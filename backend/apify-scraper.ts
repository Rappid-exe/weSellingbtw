import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

interface ApifyProfileData {
  fullName: string;
  headline: string;
  aboutText: string;
  recentPostText: string;
}

interface ApifyResult {
  success: true;
  data: ApifyProfileData;
}

interface ApifyError {
  success: false;
  error: string;
}

type ApifyResponse = ApifyResult | ApifyError;

const APIFY_API_TOKEN = process.env.APIFY_API_TOKEN;
const APIFY_ACTOR_ID = 'apimaestro~linkedin-profile-detail';

export async function scrapeLinkedInWithApify(linkedinUrl: string): Promise<ApifyResponse> {
  try {
    if (!APIFY_API_TOKEN) {
      return {
        success: false,
        error: 'Apify API token not configured'
      };
    }

    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com/in/')) {
      return {
        success: false,
        error: 'Invalid LinkedIn URL format'
      };
    }

    console.log(`Apify: Starting scrape for ${linkedinUrl}`);

    // Step 1: Start the Apify actor run with correct input format
    const runResponse = await fetch(`https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/runs?token=${APIFY_API_TOKEN}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        // Use the correct field name for the LinkedIn profile URL
        username: linkedinUrl,
        // Alternative field names to try if username doesn't work
        profileUrl: linkedinUrl,
        linkedinUrl: linkedinUrl,
        url: linkedinUrl
      })
    });

    if (!runResponse.ok) {
      const errorText = await runResponse.text();
      return {
        success: false,
        error: `Apify run start failed: ${errorText}`
      };
    }

    const runData = await runResponse.json() as any;
    const runId = runData.data.id;

    console.log(`Apify: Started run ${runId}, waiting for completion...`);

    // Step 2: Wait for the run to complete
    let attempts = 0;
    const maxAttempts = 60; // Wait up to 10 minutes (60 * 10 seconds)
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      
      // Check run status
      const statusResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_API_TOKEN}`);
      
      if (statusResponse.ok) {
        const statusData = await statusResponse.json() as any;
        const status = statusData.data.status;
        
        console.log(`Apify: Run status - ${status}`);
        
        if (status === 'SUCCEEDED') {
          // Get the results
          const resultsResponse = await fetch(`https://api.apify.com/v2/datasets/${statusData.data.defaultDatasetId}/items?token=${APIFY_API_TOKEN}`);
          
          if (resultsResponse.ok) {
            const results = await resultsResponse.json() as any[];
            
            if (results && results.length > 0) {
              const profileData = results[0];
              
              // Debug: Log the raw Apify response to see the actual structure
              console.log("Raw Apify profile data:", JSON.stringify(profileData, null, 2));
              
              // Map Apify response to our format using the correct structure
              const scrapedProfile: ApifyProfileData = {
                fullName: profileData.basic_info?.fullname || 
                         profileData.basic_info?.first_name + ' ' + profileData.basic_info?.last_name ||
                         profileData.fullName || 
                         'Unknown Name',
                         
                headline: profileData.basic_info?.headline || 
                         profileData.headline || 
                         profileData.experience?.[0]?.title ||
                         'No headline available',
                         
                aboutText: profileData.basic_info?.about || 
                          profileData.about || 
                          profileData.summary ||
                          'No about section available',
                          
                recentPostText: extractRecentPost(profileData) || 'No recent posts available'
              };

              console.log(`Apify: Successfully scraped profile for ${scrapedProfile.fullName}`);
              
              return {
                success: true,
                data: scrapedProfile
              };
            } else {
              return {
                success: false,
                error: 'No profile data returned from Apify'
              };
            }
          }
        } else if (status === 'FAILED' || status === 'ABORTED' || status === 'TIMED-OUT') {
          return {
            success: false,
            error: `Apify run ${status.toLowerCase()}: ${statusData.data.statusMessage || 'Unknown error'}`
          };
        }
        
        // Continue waiting if status is READY, RUNNING, etc.
      }
      
      attempts++;
      
      if (attempts >= maxAttempts) {
        return {
          success: false,
          error: 'Apify scraping timed out after 10 minutes'
        };
      }
    }

    return {
      success: false,
      error: 'Unexpected error in Apify scraping loop'
    };

  } catch (error) {
    console.error('Apify scraping error:', error);
    return {
      success: false,
      error: `Apify integration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Helper function to extract recent post from various possible fields
function extractRecentPost(profileData: any): string | null {
  // Try different possible fields where recent posts might be stored
  if (profileData.recentPosts && profileData.recentPosts.length > 0) {
    return profileData.recentPosts[0].text || profileData.recentPosts[0].content || profileData.recentPosts[0].commentary;
  }
  
  if (profileData.posts && profileData.posts.length > 0) {
    return profileData.posts[0].text || profileData.posts[0].content || profileData.posts[0].commentary;
  }
  
  if (profileData.activities && profileData.activities.length > 0) {
    return profileData.activities[0].text || profileData.activities[0].description || profileData.activities[0].commentary;
  }
  
  if (profileData.recentActivity) {
    return profileData.recentActivity;
  }
  
  if (profileData.activity && profileData.activity.length > 0) {
    return profileData.activity[0].text || profileData.activity[0].content;
  }
  
  // Check for LinkedIn-specific field names
  if (profileData.latestPost) {
    return profileData.latestPost.text || profileData.latestPost.content;
  }
  
  return null;
}

// Synchronous approach with correct input format
export async function scrapeLinkedInApifySync(linkedinUrl: string): Promise<ApifyResponse> {
  try {
    if (!APIFY_API_TOKEN) {
      return {
        success: false,
        error: 'Apify API token not configured'
      };
    }

    console.log(`Apify Sync: Scraping ${linkedinUrl}`);

    // Try different input formats that the actor might expect
    const inputOptions = [
      { username: linkedinUrl },
      { profileUrl: linkedinUrl },
      { linkedinUrl: linkedinUrl },
      { url: linkedinUrl },
      { profileUrls: [linkedinUrl] }
    ];

    for (const input of inputOptions) {
      console.log(`Trying input format:`, input);
      
      const response = await fetch(`https://api.apify.com/v2/acts/${APIFY_ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_API_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
      });

      if (response.ok) {
        const results = await response.json() as any[];
        
        if (results && results.length > 0) {
          const profileData = results[0];
          console.log(`Success with input format:`, input);
          
          return {
            success: true,
            data: {
              fullName: profileData.basic_info?.fullname || 
                       profileData.basic_info?.first_name + ' ' + profileData.basic_info?.last_name ||
                       profileData.fullName || 
                       'Unknown Name',
                       
              headline: profileData.basic_info?.headline || 
                       profileData.headline || 
                       profileData.experience?.[0]?.title ||
                       'No headline available',
                       
              aboutText: profileData.basic_info?.about || 
                        profileData.about || 
                        profileData.summary ||
                        'No about section available',
                        
              recentPostText: extractRecentPost(profileData) || 'No recent posts available'
            }
          };
        }
      } else {
        console.log(`Failed with input format:`, input, `Status: ${response.status}`);
      }
    }

    return {
      success: false,
      error: 'All input formats failed - check Apify actor documentation for correct input schema'
    };

  } catch (error) {
    return {
      success: false,
      error: `Apify sync integration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
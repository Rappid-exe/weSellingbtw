import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

interface PhantomBusterProfile {
  fullName: string;
  headline: string;
  aboutText: string;
  recentPostText: string;
}

interface PhantomBusterResult {
  success: true;
  data: PhantomBusterProfile;
}

interface PhantomBusterError {
  success: false;
  error: string;
}

type PhantomBusterResponse = PhantomBusterResult | PhantomBusterError;

const PHANTOMBUSTER_API_KEY = process.env.PHANTOMBUSTER_API_KEY;
const PHANTOMBUSTER_BASE_URL = 'https://api.phantombuster.com/api/v2';

export async function scrapeLinkedInWithPhantomBuster(linkedinUrl: string): Promise<PhantomBusterResponse> {
  try {
    if (!PHANTOMBUSTER_API_KEY) {
      return {
        success: false,
        error: 'PhantomBuster API key not configured'
      };
    }

    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com/in/')) {
      return {
        success: false,
        error: 'Invalid LinkedIn URL format'
      };
    }

    console.log(`PhantomBuster: Scraping ${linkedinUrl}`);

    // Step 1: Launch a phantom to scrape the LinkedIn profile
    const launchResponse = await fetch(`${PHANTOMBUSTER_BASE_URL}/phantoms/launch`, {
      method: 'POST',
      headers: {
        'X-Phantombuster-Key': PHANTOMBUSTER_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: process.env.PHANTOMBUSTER_PHANTOM_ID, // You'll get this from PhantomBuster
        argument: {
          profileUrl: linkedinUrl,
          // Add other PhantomBuster-specific parameters as needed
        }
      })
    });

    if (!launchResponse.ok) {
      const errorText = await launchResponse.text();
      return {
        success: false,
        error: `PhantomBuster launch failed: ${errorText}`
      };
    }

    const launchData = await launchResponse.json() as any;
    const containerId = launchData.containerId;

    console.log(`PhantomBuster: Launched container ${containerId}`);

    // Step 2: Wait for the phantom to complete and get results
    let attempts = 0;
    const maxAttempts = 30; // Wait up to 5 minutes (30 * 10 seconds)
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
      
      const statusResponse = await fetch(`${PHANTOMBUSTER_BASE_URL}/containers/fetch-output?id=${containerId}`, {
        headers: {
          'X-Phantombuster-Key': PHANTOMBUSTER_API_KEY
        }
      });

      if (statusResponse.ok) {
        const resultData = await statusResponse.json() as any;
        
        if (resultData.data && resultData.data.length > 0) {
          const profileData = resultData.data[0];
          
          // Map PhantomBuster response to our format
          const scrapedProfile: PhantomBusterProfile = {
            fullName: profileData.fullName || profileData.name || 'Unknown Name',
            headline: profileData.headline || profileData.title || 'No headline available',
            aboutText: profileData.description || profileData.about || 'No about section available',
            recentPostText: profileData.lastPost || profileData.recentActivity || 'No recent posts available'
          };

          console.log(`PhantomBuster: Successfully scraped profile for ${scrapedProfile.fullName}`);
          
          return {
            success: true,
            data: scrapedProfile
          };
        }
      }
      
      attempts++;
      console.log(`PhantomBuster: Waiting for results... (${attempts}/${maxAttempts})`);
    }

    return {
      success: false,
      error: 'PhantomBuster scraping timed out'
    };

  } catch (error) {
    console.error('PhantomBuster error:', error);
    return {
      success: false,
      error: `PhantomBuster integration failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}

// Alternative: Direct API approach if PhantomBuster has a simpler endpoint
export async function scrapeLinkedInDirectAPI(linkedinUrl: string): Promise<PhantomBusterResponse> {
  try {
    // This is a simplified version - adjust based on PhantomBuster's actual API
    const response = await fetch(`${PHANTOMBUSTER_BASE_URL}/linkedin/profile`, {
      method: 'POST',
      headers: {
        'X-Phantombuster-Key': PHANTOMBUSTER_API_KEY!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: linkedinUrl
      })
    });

    if (!response.ok) {
      return {
        success: false,
        error: `PhantomBuster API error: ${response.statusText}`
      };
    }

    const data = await response.json() as any;
    
    return {
      success: true,
      data: {
        fullName: data.fullName || 'Unknown Name',
        headline: data.headline || 'No headline available',
        aboutText: data.about || 'No about section available',
        recentPostText: data.recentPost || 'No recent posts available'
      }
    };

  } catch (error) {
    return {
      success: false,
      error: `PhantomBuster direct API failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
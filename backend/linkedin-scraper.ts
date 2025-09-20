import puppeteer, { Browser, Page } from 'puppeteer';

interface LinkedInProfileData {
  fullName: string;
  headline: string;
  aboutText: string;
  recentPostText: string;
}

interface ScrapingResult {
  success: true;
  data: LinkedInProfileData;
}

interface ScrapingError {
  success: false;
  error: string;
}

type LinkedInScrapingResponse = ScrapingResult | ScrapingError;

export async function scrapeLinkedInProfile(linkedinUrl: string): Promise<LinkedInScrapingResponse> {
  let browser: Browser | null = null;
  let page: Page | null = null;

  try {
    // Validate URL format
    if (!linkedinUrl || !linkedinUrl.includes('linkedin.com/in/')) {
      return {
        success: false,
        error: 'Invalid LinkedIn URL format. Must contain "linkedin.com/in/"'
      };
    }

    // Launch browser with stealth settings
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });

    page = await browser.newPage();

    // Set user agent to appear more like a real browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Set viewport
    await page.setViewport({ width: 1366, height: 768 });

    // Navigate to the LinkedIn profile
    console.log(`Navigating to: ${linkedinUrl}`);
    await page.goto(linkedinUrl, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });

    // Wait a bit for the page to fully load
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Check if we're blocked or redirected to login
    const currentUrl = page.url();
    if (currentUrl.includes('/authwall') || currentUrl.includes('/login') || currentUrl.includes('/checkpoint')) {
      return {
        success: false,
        error: 'Profile requires authentication or is private'
      };
    }

    // Extract profile information
    const profileData = await page.evaluate(() => {
      const data: Partial<LinkedInProfileData> = {};

      // Extract full name
      const nameSelectors = [
        'h1.text-heading-xlarge',
        '.pv-text-details__left-panel h1',
        '.ph5 h1',
        '[data-generated-suggestion-target] h1'
      ];
      
      for (const selector of nameSelectors) {
        const nameElement = document.querySelector(selector);
        if (nameElement?.textContent?.trim()) {
          data.fullName = nameElement.textContent.trim();
          break;
        }
      }

      // Extract headline
      const headlineSelectors = [
        '.text-body-medium.break-words',
        '.pv-text-details__left-panel .text-body-medium',
        '.ph5 .text-body-medium',
        '.pv-top-card--list-bullet .text-body-medium'
      ];

      for (const selector of headlineSelectors) {
        const headlineElement = document.querySelector(selector);
        if (headlineElement?.textContent?.trim()) {
          data.headline = headlineElement.textContent.trim();
          break;
        }
      }

      // Extract about text
      const aboutSelectors = [
        '#about ~ * .pv-shared-text-with-see-more .inline-show-more-text',
        '.pv-about-section .pv-shared-text-with-see-more .inline-show-more-text',
        '[data-generated-suggestion-target="about"] .inline-show-more-text',
        '.about .pv-shared-text-with-see-more .inline-show-more-text'
      ];

      for (const selector of aboutSelectors) {
        const aboutElement = document.querySelector(selector);
        if (aboutElement?.textContent?.trim()) {
          data.aboutText = aboutElement.textContent.trim();
          break;
        }
      }

      // Extract recent post text
      const postSelectors = [
        '.feed-shared-update-v2 .feed-shared-text .inline-show-more-text',
        '.occludable-update .feed-shared-text .inline-show-more-text',
        '.feed-shared-update-v2__description .inline-show-more-text'
      ];

      for (const selector of postSelectors) {
        const postElement = document.querySelector(selector);
        if (postElement?.textContent?.trim()) {
          data.recentPostText = postElement.textContent.trim();
          break;
        }
      }

      return data;
    });

    // Validate that we got essential information
    if (!profileData.fullName) {
      return {
        success: false,
        error: 'Could not extract profile name. Profile may be private or page structure changed.'
      };
    }

    // Fill in defaults for missing optional fields
    const result: LinkedInProfileData = {
      fullName: profileData.fullName,
      headline: profileData.headline || 'No headline available',
      aboutText: profileData.aboutText || 'No about section available',
      recentPostText: profileData.recentPostText || 'No recent posts available'
    };

    return {
      success: true,
      data: result
    };

  } catch (error) {
    console.error('LinkedIn scraping error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return {
          success: false,
          error: 'Page load timeout. Profile may be slow to load or inaccessible.'
        };
      }
      if (error.message.includes('net::ERR_NAME_NOT_RESOLVED')) {
        return {
          success: false,
          error: 'Invalid URL or network connection issue.'
        };
      }
      return {
        success: false,
        error: `Scraping failed: ${error.message}`
      };
    }

    return {
      success: false,
      error: 'Unknown error occurred during scraping'
    };

  } finally {
    // Clean up resources
    try {
      if (page) await page.close();
      if (browser) await browser.close();
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }
  }
}
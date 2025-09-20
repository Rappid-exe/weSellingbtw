import { scrapeLinkedInProfile } from './linkedin-scraper';

// Test function - you can run this to test the scraper
async function testLinkedInScraper() {
  console.log('Testing LinkedIn scraper...');
  
  // Example LinkedIn profile URL (replace with a real one for testing)
  const testUrl = 'https://www.linkedin.com/in/example-profile';
  
  try {
    const result = await scrapeLinkedInProfile(testUrl);
    
    if (result.success) {
      console.log('✅ Scraping successful!');
      console.log('Full Name:', result.data.fullName);
      console.log('Headline:', result.data.headline);
      console.log('About Text:', result.data.aboutText.substring(0, 100) + '...');
      console.log('Recent Post:', result.data.recentPostText.substring(0, 100) + '...');
    } else {
      console.log('❌ Scraping failed:', result.error);
    }
  } catch (error) {
    console.error('Test error:', error);
  }
}

// Uncomment the line below to run the test
// testLinkedInScraper();

export { testLinkedInScraper };
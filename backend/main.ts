import express from "express";
import path from "path";
import { mockProfile } from "./profile";
import { generateEmail, getAngleAgent, OutreachContext } from "./response";
import { generateVoice } from "./voice";
import { scrapeLinkedInProfile } from "./linkedin-scraper";
import { scrapeLinkedInWithApify, scrapeLinkedInApifySync } from "./apify-scraper";

const app = express();
app.use(express.json());

// Serve static audio files
app.use('/audio', express.static(path.join(__dirname, 'public', 'audio')));

// Test with mock LinkedIn data while Apify is being configured
app.post("/api/test-mock", async (req, res) => {
  try {
    const { linkedinProfile, productDescription } = req.body;
    
    if (!linkedinProfile) {
      return res.status(400).json({ error: "LinkedIn profile URL required" });
    }

    if (!productDescription) {
      return res.status(400).json({ error: "Product description required" });
    }

    console.log(`Testing with mock LinkedIn data for: ${linkedinProfile}`);
    console.log(`Product description: ${productDescription}`);
    
    // Create realistic mock data to test the email generation
    const mockScrapedData = {
      fullName: "Satya Nadella",
      headline: "Chairman and CEO at Microsoft",
      aboutText: "Passionate about empowering every person and organization on the planet to achieve more. Leading Microsoft's transformation to a cloud-first, mobile-first world. Focused on AI, mixed reality, and quantum computing innovations.",
      recentPostText: "Excited to share Microsoft's latest AI breakthroughs at Build 2024. Our new Copilot features are transforming how developers work with code. The future of software development is here! #AI #Microsoft #Build2024"
    };
    
    // Create outreach context
    const context: OutreachContext = {
      leadData: mockScrapedData,
      productDescription: productDescription
    };
    
    // Generate email using complete context
    const email = await generateEmail(context);
    
    try {
      // Generate voice using the email text
      const audioFilename = await generateVoice(email);
      const audioUrl = `http://localhost:3000/audio/${audioFilename}`;
      
      res.status(200).json({
        email: email,
        audioUrl: audioUrl,
        scrapedData: mockScrapedData,
        productDescription: productDescription,
        note: "Using mock data - Apify configuration in progress"
      });
    } catch (voiceError) {
      console.error("Voice generation failed:", voiceError);
      // Return email without voice if voice generation fails
      res.status(200).json({
        email: email,
        audioUrl: "http://localhost:3000/audio/mock-audio.mp3",
        scrapedData: mockScrapedData,
        productDescription: productDescription,
        note: "Using mock data - Voice generation failed, check ElevenLabs API key"
      });
    }
  } catch (error) {
    console.error("Mock test error:", error);
    res.status(500).json({ error: "Mock test failed", details: error });
  }
});

// Test Apify LinkedIn scraping without voice generation
app.post("/api/test-apify", async (req, res) => {
  try {
    const { linkedinProfile, productDescription } = req.body;
    
    if (!linkedinProfile) {
      return res.status(400).json({ error: "LinkedIn profile URL required" });
    }

    if (!productDescription) {
      return res.status(400).json({ error: "Product description required" });
    }

    console.log(`Testing Apify scraping: ${linkedinProfile}`);
    console.log(`Product description: ${productDescription}`);
    const scrapingResult = await scrapeLinkedInApifySync(linkedinProfile);
    
    if (scrapingResult.success) {
      console.log("Apify scraping SUCCESS - Raw data:", JSON.stringify(scrapingResult.data, null, 2));
      
      // Create outreach context with both profile data and product description
      const context: OutreachContext = {
        leadData: scrapingResult.data,
        productDescription: productDescription
      };
      
      // Generate email using complete context
      const email = await generateEmail(context);
      
      try {
        // Generate voice using the email text
        const audioFilename = await generateVoice(email);
        const audioUrl = `http://localhost:3000/audio/${audioFilename}`;
        
        res.status(200).json({
          email: email,
          audioUrl: audioUrl,
          scrapedData: scrapingResult.data,
          debug: {
            fullName: scrapingResult.data.fullName,
            headline: scrapingResult.data.headline,
            aboutText: scrapingResult.data.aboutText?.substring(0, 100) + "...",
            recentPostText: scrapingResult.data.recentPostText?.substring(0, 100) + "..."
          }
        });
      } catch (voiceError) {
        console.error("Voice generation failed:", voiceError);
        // Return email without voice if voice generation fails
        res.status(200).json({
          email: email,
          audioUrl: "http://localhost:3000/audio/mock-audio.mp3",
          scrapedData: scrapingResult.data,
          note: "Voice generation failed - check ElevenLabs API key",
          debug: {
            fullName: scrapingResult.data.fullName,
            headline: scrapingResult.data.headline,
            aboutText: scrapingResult.data.aboutText?.substring(0, 100) + "...",
            recentPostText: scrapingResult.data.recentPostText?.substring(0, 100) + "..."
          }
        });
      }
    } else {
      console.log("Apify scraping FAILED:", scrapingResult.error);
      res.status(500).json({ 
        error: "Apify scraping failed", 
        details: scrapingResult.error 
      });
    }
  } catch (error) {
    console.error("Apify test error:", error);
    res.status(500).json({ 
      error: "Apify test failed", 
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

// Debug endpoint to see scraped data
app.post("/api/debug-scrape", async (req, res) => {
  try {
    const { linkedinProfile } = req.body;
    
    if (!linkedinProfile) {
      return res.status(400).json({ error: "LinkedIn profile URL required" });
    }

    console.log(`Debug scraping: ${linkedinProfile}`);
    const scrapingResult = await scrapeLinkedInProfile(linkedinProfile);
    
    // Return the raw scraping result for debugging
    res.status(200).json({
      scrapingResult: scrapingResult,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Debug scraping error:", error);
    res.status(500).json({ error: "Debug scraping failed", details: error });
  }
});

// Test endpoint that bypasses AI and voice for testing
app.post("/api/test", async (req, res) => {
  try {
    const mockEmail = `Subject: Quick question about your recent AI work

Hi there,

I came across your LinkedIn profile and was impressed by your background in technology. Your experience caught my attention, and I'd love to discuss how our solutions might align with your current projects.

Would you be open to a brief 15-minute chat this week?

Best regards,
[Your Name]
[Your Company]`;

    // Skip voice generation for now due to ElevenLabs API issue
    const audioUrl = "http://localhost:3000/audio/mock-audio.mp3";
    
    res.status(200).json({
      email: mockEmail,
      audioUrl: audioUrl,
      note: "Voice generation skipped - ElevenLabs API key needs to be configured"
    });
  } catch (error) {
    console.error("Error in test endpoint:", error);
    res.status(500).json({ error: "Test failed" });
  }
});

app.post("/api/outreach", async (req, res) => {
  try {
    const { linkedinProfile, productDescription } = req.body;
    
    let emailText: string;
    
    if (linkedinProfile) {
      console.log(`Scraping LinkedIn profile: ${linkedinProfile}`);
      
      // Step 1: Scrape LinkedIn profile data using Apify
      const scrapingResult = await scrapeLinkedInWithApify(linkedinProfile);
      
      if (scrapingResult.success) {
        console.log(`Successfully scraped profile for: ${scrapingResult.data.fullName}`);
        
        // Step 2: Generate personalized email using scraped data and product description
        const context: OutreachContext = {
          leadData: scrapingResult.data,
          productDescription: productDescription || "AI-powered business solutions that help companies streamline operations and increase efficiency"
        };
        emailText = await generateEmail(context);
      } else {
        console.log(`Scraping failed: ${scrapingResult.error}. Falling back to mock data.`);
        
        // Fallback to mock data if scraping fails
        emailText = await getAngleAgent(mockProfile);
      }
    } else {
      console.log("No LinkedIn profile provided. Using mock data.");
      
      // Fallback to mock data if no LinkedIn profile provided
      emailText = await getAngleAgent(mockProfile);
    }
    
    // Step 3: Generate audio using the email text
    const audioFilename = await generateVoice(emailText);
    
    // Step 4: Construct the full public URL
    const audioUrl = `http://localhost:3000/audio/${audioFilename}`;
    
    // Step 5: Return unified JSON response
    res.status(200).json({
      email: emailText,
      audioUrl: audioUrl
    });
  } catch (error) {
    console.error("Error generating outreach:", error);
    res.status(500).json({ error: "Failed to generate outreach" });
  }
});

const server = app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

// Keep the server alive
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

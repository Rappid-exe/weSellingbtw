import express from "express";
import path from "path";
import { mockProfile } from "./profile";
import { getAngleAgent } from "./response";
import { generateVoice } from "./voice";

const app = express();
app.use(express.json());

// Serve static audio files
app.use('/audio', express.static(path.join(__dirname, 'public', 'audio')));

app.post("/api/outreach", async (req, res) => {
  try {
    // Step 1: Generate email text
    const emailText = await getAngleAgent(mockProfile);
    
    // Step 2: Generate audio using the email text
    const audioFilename = await generateVoice(emailText);
    
    // Step 3: Construct the full public URL
    const audioUrl = `http://localhost:3000/audio/${audioFilename}`;
    
    // Step 4: Return unified JSON response
    res.status(200).json({
      email: emailText,
      audioUrl: audioUrl
    });
  } catch (error) {
    console.error("Error generating outreach:", error);
    res.status(500).json({ error: "Failed to generate outreach" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

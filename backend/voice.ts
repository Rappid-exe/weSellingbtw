import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = "ZhWoHkkpUwKxpxd71VWe"; 

export async function generateVoice(text: string): Promise<string> {
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY!,
      },
      body: JSON.stringify({
        text,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);
    
    // Generate unique filename
    const uniqueFilename = `${uuidv4()}.mp3`;
    const audioDir = path.join(__dirname, 'public', 'audio');
    const audioPath = path.join(audioDir, uniqueFilename);
    
    // Ensure directory exists
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }
    
    // Save the audio file
    fs.writeFileSync(audioPath, audioBuffer);
    
    // Return the filename (not the full path)
    return uniqueFilename;
  } catch (error) {
    console.error("Error generating voice:", error);
    throw error;
  }
}

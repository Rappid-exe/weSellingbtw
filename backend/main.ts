import express from "express";
import { mockProfile } from "./profile";
import { getAngleAgent } from "./response";
import { generateVoice } from "./voice";

const app = express();
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const response = await getAngleAgent(mockProfile);

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("fail to gen res");
  }
});

app.post("/speak", async (req, res) => {
  try {
    const text = await getAngleAgent(mockProfile);   
    const audioBuffer = await generateVoice(text);    
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audioBuffer);                          
  } catch (err) {
    res.status(500).send("fail to gen voice");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

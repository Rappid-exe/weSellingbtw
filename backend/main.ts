import express from "express";
import { mockProfile } from "./profile";
import { getAngleAgent } from "./response";

const app = express();
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const response = await getAngleAgent(mockProfile);

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to get response from Mistral");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

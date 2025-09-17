import express from "express";
import { mockProfile } from "./profile";

const app = express();
app.use(express.json());

app.post("/generate", (req, res) => {
  const profile = mockProfile;
  res.json({
    message: "test profile",
    data: profile
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

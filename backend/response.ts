import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";
import { LeadData } from "./profile";

dotenv.config();

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY as string });

export async function getAngleAgent(leadData: LeadData): Promise<string> {
  const prompt = `
You are an expert Sales Development Representative. Your goal is to write a **friendly, personalized, and persuasive sales message** for this lead based on their professional data.

**RULES:**
1. Prioritize recent, specific, and positive events. Recent product launches, company funding news, insightful posts by the lead, or promotions are ideal.
2. Personalize the message using the lead's name, role, company, and any relevant achievements or news.
3. Make the message 2–4 sentences long, concise but engaging.
4. If no strong angle is found, you may write a polite generic sales message without inventing achievements.

LEAD INFORMATION:
---
Name: ${leadData.name}
Company: ${leadData.company}
LinkedIn Profile: ${leadData.linkedinProfile}
Company News: ${leadData.companyNews}
---

**OUTPUT:**
A full personalized outreach message ready to send as an email or text.
`;

  try {
    const chatResponse = await client.chat.complete({
      model: "mistral-large-latest",
      messages: [{ role: "user", content: prompt }],
    });

    const messageContent = chatResponse.choices?.[0]?.message?.content;

    if (typeof messageContent === "string") {
      return messageContent;
    }

    return "Failed to generate a message.";
  } catch (error) {
    console.error("Mistral API error:", error);
    return "Failed to generate a message.";
  }
}

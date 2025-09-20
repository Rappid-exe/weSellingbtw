import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";

dotenv.config();

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY as string });

// Interface for scraped LinkedIn data
export interface ScrapedLeadData {
  fullName: string;
  headline: string;
  aboutText: string;
  recentPostText: string;
}

// Interface for complete outreach context
export interface OutreachContext {
  leadData: ScrapedLeadData;
  productDescription: string;
}

export async function generateEmail(context: OutreachContext): Promise<string> {
  const { leadData, productDescription } = context;
  const prompt = `
You are an expert Sales Development Representative with 10+ years of experience in B2B outreach. Your mission is to craft a highly personalized, compelling sales email that feels authentic and builds genuine connection.

**ANALYSIS TASK:**
Analyze the following LinkedIn profile data and identify the BEST "angle" or hook for outreach:

**LEAD PROFILE DATA:**
---
Full Name: ${leadData.fullName}
Professional Headline: ${leadData.headline}
About Section: ${leadData.aboutText}
Most Recent Post: ${leadData.recentPostText}
---

**YOUR PRODUCT/SERVICE:**
---
${productDescription}
---

**PRIORITIZATION RULES:**
1. **Recent Posts** (if meaningful) = HIGHEST priority hook - shows current interests/activities
2. **About Section insights** = MEDIUM priority - reveals values, goals, pain points
3. **Professional Headline** = LOWEST priority - often generic, use only if nothing else stands out

**EMAIL REQUIREMENTS:**
1. **Subject Line**: Create a compelling subject that directly references your chosen angle AND connects to your product value
2. **Opening**: Reference the specific angle in the first sentence - be specific, not generic
3. **Value Proposition**: Connect your product/service to their specific needs, pain points, or goals based on their profile
4. **Relevance**: Show clear connection between their background/interests and how your solution helps
5. **Length**: Under 120 words total
6. **Tone**: Professional but conversational, like reaching out to a colleague
7. **Call-to-Action**: Soft and low-pressure (e.g., "open to a brief chat?")
8. **Avoid Generic Pitches**: Don't just describe your product - show WHY it matters to THEM specifically

**CRITICAL INSTRUCTIONS:**
- DO NOT make up achievements, news, or events not mentioned in the data
- DO NOT use generic phrases like "I came across your profile"
- DO reference specific details from their actual content
- DO make it feel like you genuinely read their profile/post
- DO keep it concise and scannable
- DO connect your product to their specific role, industry, or stated goals
- DO show understanding of their challenges/opportunities based on their profile
- DO make the value proposition feel tailored to them, not generic

**OUTPUT FORMAT:**
You must return ONLY the email in this exact format with no additional analysis, explanations, or commentary:

Subject: [Your compelling subject line]

Hi ${leadData.fullName},

[Your personalized email body here]

Best regards,
[Your Name]
[Your Company]

**CRITICAL OUTPUT RULE:**
- Return ONLY the email content above
- Do NOT include any analysis, explanations, or "why this works" sections
- Do NOT include any commentary about your approach
- Do NOT include any additional text after the email signature
- The response should end with "[Your Company]" and nothing else

**EXAMPLE OF GOOD PERSONALIZATION:**
If recent post mentions "just launched our new AI feature" → Reference that specific launch
If about section mentions "passionate about sustainable tech" → Connect to that passion
If headline shows recent promotion → Acknowledge their new role

Now write ONLY the email:
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

    return "Failed to generate a personalized email.";
  } catch (error) {
    console.error("Mistral API error:", error);
    
    // If it's a rate limit error, return a fallback message
    if (error instanceof Error && error.message.includes('429')) {
      return `Subject: Quick question about your background

Hi ${leadData.fullName},

I came across your LinkedIn profile and was impressed by your background as a ${leadData.headline}. Your experience caught my attention, and I'd love to discuss how our solutions might align with your current projects.

Would you be open to a brief 15-minute chat this week?

Best regards,
[Your Name]
[Your Company]`;
    }
    
    return "Failed to generate a personalized email.";
  }
}

// Legacy function for backward compatibility (can be removed later)
export async function getAngleAgent(leadData: any): Promise<string> {
  // Convert old format to new format for backward compatibility
  const scrapedData: ScrapedLeadData = {
    fullName: leadData.name || "Unknown",
    headline: `Professional at ${leadData.company || "Unknown Company"}`,
    aboutText: leadData.linkedinProfile || "No about information available",
    recentPostText: leadData.companyNews || "No recent posts available"
  };
  
  const context: OutreachContext = {
    leadData: scrapedData,
    productDescription: "AI-powered business solutions that help companies streamline operations and increase efficiency"
  };
  
  return generateEmail(context);
}

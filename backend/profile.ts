export interface LeadData {
  name: string;
  company: string;
  linkedinProfile: string;
  companyNews: string;
}

export const mockProfile: LeadData = {
  name: "Jane Doe",
  company: "Acme Corp",
  linkedinProfile: `
Jane Doe is the Head of Engineering at Acme Corp.
She recently posted about scaling engineering teams and adopting AI tools.
She gave a talk last week on AI ethics at TechConf 2025.
`,
  companyNews: `
Acme Corp announced a new AI-powered hiring platform last month.
`
};

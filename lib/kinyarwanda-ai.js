// Kinyarwanda AI Support for Rwanda Hackathon
export const kinyarwandaPrompts = {
  careerAdvice: {
    en: "Provide career advice for a tech professional in Rwanda",
    rw: "Tanga inama z'umwuga ku mukozi wa tekinoroji mu Rwanda"
  },
  skillsAssessment: {
    en: "Assess the user's technical skills and provide improvement suggestions",
    rw: "Suzuma ubumenyi bw'umukoresha mu by'ikoranabuhanga utange ibitekerezo byo guteza imbere"
  },
  jobMarket: {
    en: "Explain the current job market trends in Rwanda's tech sector",
    rw: "Sobanura icyo kiri mu isoko ry'akazi mu by'ikoranabuhanga mu Rwanda"
  }
};

export const rwandanBusinessContext = {
  companies: [
    "Bank of Kigali", "Equity Bank Rwanda", "MTN Rwanda", "Airtel Rwanda",
    "Zipline", "SafeMotos", "Flutterwave Rwanda", "AC Group", "Tigo Rwanda"
  ],
  sectors: [
    "Ubucuruzi bw'amabanki (Banking)",
    "Ikoranabuhanga (Technology)", 
    "Ubuhinzi (Agriculture)",
    "Ubukerarugendo (Tourism)",
    "Ubuvuzi (Healthcare)"
  ],
  skills: {
    "Software Development": "Iterambere ry'amahuriro",
    "Data Analysis": "Isesengura ry'amakuru",
    "Digital Marketing": "Kwamamaza ku rubuga",
    "Project Management": "Gucunga imishinga"
  }
};

export const generateKinyarwandaResponse = async (prompt, context = "general") => {
  const systemPrompt = `You are an AI career coach specifically designed for Rwanda's job market. 
  You can respond in both English and Kinyarwanda. When responding in Kinyarwanda, use proper grammar and cultural context.
  
  Context: ${context}
  Rwanda Companies: ${rwandanBusinessContext.companies.join(", ")}
  
  Always include:
  1. Practical advice for Rwanda's job market
  2. Local company examples when relevant
  3. Cultural sensitivity to Rwandan work environment
  4. Salary ranges in RWF when discussing compensation
  `;

  // This would integrate with your existing AI service
  return {
    english: "Career advice in English...",
    kinyarwanda: "Inama z'umwuga mu Kinyarwanda...",
    localContext: true
  };
};

export const translateToKinyarwanda = {
  "Dashboard": "Ikibaho",
  "Resume": "CV",
  "Interview": "Ikiganiro cy'akazi",
  "Skills": "Ubumenyi",
  "Jobs": "Akazi",
  "Career Coach": "Umwarimu w'umwuga",
  "Apply Now": "Saba ubu",
  "Remote Work": "Akazi ka kure",
  "Full-time": "Igihe cyose",
  "Part-time": "Igihe gito"
};
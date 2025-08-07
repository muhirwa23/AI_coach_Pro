import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Streaming AI service for real-time interview processing
export class StreamingInterviewAI {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
    this.conversationHistory = [];
  }

  // Real-time speech processing with context awareness
  async processStreamingInput(transcript, context = {}) {
    const { recruiterType, conversationHistory, userProfile } = context;
    
    const prompt = `You are conducting a live streaming interview as ${this.getRecruiterPersona(recruiterType)}.

CONVERSATION CONTEXT:
${conversationHistory.map(msg => `${msg.type}: ${msg.content}`).join('\n')}

CURRENT USER INPUT: "${transcript}"

USER PROFILE: ${JSON.stringify(userProfile)}

Respond naturally as if this is a real-time conversation. Keep responses:
1. Conversational and engaging (2-3 sentences max)
2. Relevant to Rwanda's job market and culture
3. Building on previous conversation context
4. Asking follow-up questions when appropriate
5. Showing genuine interest in the candidate

Respond as the recruiter would speak, not as a formal AI system.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return {
        response: response.text(),
        confidence: 0.95,
        processingTime: Date.now()
      };
    } catch (error) {
      console.error("Streaming AI Error:", error);
      return this.getFallbackStreamingResponse(transcript);
    }
  }

  // Generate comprehensive interview analysis
  async generateInterviewAnalysis(conversationHistory, metrics = {}) {
    const prompt = `Analyze this complete interview conversation for a Rwanda tech position:

CONVERSATION TRANSCRIPT:
${conversationHistory.map((msg, i) => 
  `${i + 1}. ${msg.type.toUpperCase()}: ${msg.content}`
).join('\n')}

SPEECH METRICS:
- Average volume: ${metrics.avgVolume || 'N/A'}
- Response count: ${conversationHistory.filter(m => m.type === 'user').length}
- Total duration: ${metrics.duration || 'N/A'}

Provide detailed analysis in JSON format:
{
  "overallScore": number (0-100),
  "detailedScores": {
    "communication": number,
    "technical": number,
    "culturalFit": number,
    "confidence": number,
    "problemSolving": number
  },
  "strengths": [array of specific strengths],
  "improvements": [array of specific improvement areas],
  "rwandaSpecificFeedback": [array of Rwanda market specific advice],
  "careerRecommendations": [array of career development suggestions],
  "interviewTips": [array of interview improvement tips],
  "salaryRange": "estimated salary range in RWF",
  "topCompanyMatches": [array of suitable Rwanda companies]
}

Focus on practical, actionable feedback for Rwanda's job market.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error("Analysis Error:", error);
      return this.getFallbackAnalysis();
    }
  }

  // Real-time conversation coaching
  async getConversationCoaching(currentResponse, context) {
    const prompt = `Provide real-time coaching for this interview response:

RESPONSE: "${currentResponse}"
CONTEXT: ${JSON.stringify(context)}

Give brief, actionable coaching tips (1-2 sentences) for:
1. Content improvement
2. Delivery enhancement  
3. Rwanda-specific cultural considerations

Format as JSON: {
  "contentTip": "string",
  "deliveryTip": "string", 
  "culturalTip": "string",
  "confidenceBooster": "string"
}`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      return {
        contentTip: "Provide specific examples from your experience",
        deliveryTip: "Speak clearly and maintain good pace",
        culturalTip: "Show understanding of Rwanda's collaborative culture",
        confidenceBooster: "You're doing great! Stay confident and authentic."
      };
    }
  }

  getFallbackStreamingResponse(transcript) {
    const responses = [
      "That's interesting! Can you tell me more about that?",
      "I see. How do you think that experience would apply in Rwanda's context?",
      "Good point. What challenges did you face in that situation?",
      "That sounds valuable. How would you approach similar challenges here?"
    ];
    
    return {
      response: responses[Math.floor(Math.random() * responses.length)],
      confidence: 0.7,
      processingTime: Date.now()
    };
  }

  getRecruiterPersona(recruiterType) {
    const personas = {
      "bank-of-kigali": "Sarah Uwimana, HR Director at Bank of Kigali. You are professional, thorough, and value regulatory compliance and customer service excellence.",
      "mtn-rwanda": "Jean Claude Nzeyimana, Technical Lead at MTN Rwanda. You are direct, technical, and focus on scalable mobile solutions.",
      "zipline": "Dr. Keza Rwema, Operations Manager at Zipline. You are innovation-focused, impact-driven, and curious about problem-solving approaches."
    };
    return personas[recruiterType] || personas["bank-of-kigali"];
  }
}

export class RwandaInterviewAI {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async generateInterviewQuestion(recruiterType, questionType, userProfile) {
    const prompt = `You are ${this.getRecruiterPersona(recruiterType)} conducting a job interview in Rwanda's tech sector.

User Profile: ${JSON.stringify(userProfile)}
Question Type: ${questionType}

Generate a realistic interview question that:
1. Reflects Rwanda's business culture and values
2. Tests relevant technical/soft skills for the role
3. Considers local market conditions and opportunities
4. Shows understanding of Rwanda's Vision 2050 goals
5. Is appropriate for the company's industry focus

Respond in character as the recruiter, making it conversational and authentic.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini AI Error:", error);
      return this.getFallbackQuestion(questionType);
    }
  }

  async analyzeInterviewResponse(userResponse, question, recruiterType) {
    const prompt = `As ${this.getRecruiterPersona(recruiterType)}, analyze this interview response:

Question: "${question}"
Candidate Response: "${userResponse}"

Provide detailed feedback including:
1. Score (0-100) based on Rwanda job market standards
2. Strengths demonstrated in the response
3. Areas for improvement specific to Rwanda's context
4. Cultural fit assessment for Rwandan workplace
5. Technical competency evaluation
6. Communication effectiveness
7. Follow-up question or comment as the recruiter

Format as JSON with clear sections for each evaluation criteria.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return JSON.parse(response.text());
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return this.getFallbackAnalysis();
    }
  }

  async generateResumeContent(userProfile, targetRole, targetCompany) {
    const prompt = `Generate an AI-optimized resume for Rwanda's job market:

User Profile: ${JSON.stringify(userProfile)}
Target Role: ${targetRole}
Target Company: ${targetCompany}

Create a comprehensive resume that:
1. Aligns with Rwanda's Vision 2050 and digital transformation goals
2. Highlights relevant experience for the local market
3. Includes appropriate cultural context and language skills
4. Emphasizes mobile-first and financial inclusion experience
5. Shows understanding of local business environment
6. Optimizes for ATS systems used by Rwandan companies
7. Includes relevant certifications and community involvement

Format in Markdown with proper sections and Rwanda-specific optimizations.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini Resume Error:", error);
      return this.getFallbackResume();
    }
  }

  async generateCareerAdvice(userProfile, language = "en") {
    const languageInstruction = language === "rw" 
      ? "Respond in Kinyarwanda with English technical terms where appropriate."
      : "Respond in English with occasional Kinyarwanda phrases for cultural context.";

    const prompt = `Provide personalized career advice for Rwanda's tech sector:

User Profile: ${JSON.stringify(userProfile)}
${languageInstruction}

Give advice on:
1. Career progression opportunities in Rwanda
2. Skills to develop for local market demand
3. Networking strategies within Rwanda's tech community
4. Salary negotiation tips for local market
5. Remote work opportunities with international companies
6. Entrepreneurship opportunities in Rwanda
7. Government programs and support available

Make it practical, culturally appropriate, and actionable.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini Career Advice Error:", error);
      return this.getFallbackAdvice(language);
    }
  }

  getRecruiterPersona(recruiterType) {
    const personas = {
      "bank-of-kigali": "Sarah Uwimana, HR Director at Bank of Kigali with 10 years experience in Rwanda's financial sector. You value regulatory compliance, customer service excellence, and digital innovation in banking.",
      "mtn-rwanda": "Jean Claude Nzeyimana, Technical Lead at MTN Rwanda with expertise in telecommunications and mobile technology. You focus on scalable solutions, network optimization, and mobile-first development.",
      "zipline": "Dr. Keza Rwema, Operations Manager at Zipline with background in healthcare technology and logistics. You prioritize innovation, social impact, and solving complex operational challenges."
    };
    return personas[recruiterType] || personas["bank-of-kigali"];
  }

  getFallbackQuestion(questionType) {
    const questions = {
      introduction: "Tell me about yourself and why you're interested in working in Rwanda's growing tech sector.",
      technical: "Describe a challenging technical problem you've solved and how you would apply that experience in Rwanda's context.",
      cultural: "How do you see yourself contributing to Rwanda's Vision 2050 digital transformation goals?",
      company: "What do you know about our company's role in Rwanda's economy and how would you add value?"
    };
    return questions[questionType] || questions.introduction;
  }

  getFallbackAnalysis() {
    return {
      score: 75,
      strengths: ["Clear communication", "Technical knowledge", "Cultural awareness"],
      improvements: ["Provide more specific examples", "Show deeper Rwanda market understanding"],
      culturalFit: "Good understanding of local context",
      technicalCompetency: "Solid technical foundation",
      communication: "Clear and professional",
      followUp: "Can you give me a specific example of how you've worked with limited resources to achieve maximum impact?"
    };
  }

  getFallbackResume() {
    return "# AI-Optimized Resume for Rwanda's Tech Market\n\nYour resume has been optimized for Rwanda's growing technology sector...";
  }

  getFallbackAdvice(language) {
    return language === "rw" 
      ? "Inama z'umwuga: Komeza kwiga tekinoroji nshya kandi ukore hamwe n'abandi mu Rwanda."
      : "Focus on developing skills in mobile technology, financial inclusion, and agricultural technology - these are high-growth areas in Rwanda's tech sector.";
  }
}

export const rwandaInterviewAI = new RwandaInterviewAI();
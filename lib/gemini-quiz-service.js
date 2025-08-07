import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export class GeminiQuizService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-pro" });
    this.conversationHistory = [];
  }

  // Generate dynamic quiz questions for specific tech roles
  async generateQuizQuestions(role, difficulty = "intermediate", count = 10) {
    const prompt = `Generate ${count} multiple choice questions for a ${role} position interview in Rwanda's tech sector.

REQUIREMENTS:
- Difficulty level: ${difficulty}
- Each question should have 4 options (A, B, C, D)
- Include practical, job-relevant scenarios
- Consider Rwanda's tech market context
- Mix of technical and problem-solving questions
- Include brief explanations for correct answers

FORMAT as JSON:
{
  "questions": [
    {
      "question": "Question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "explanation": "Why this answer is correct",
      "category": "technical|behavioral|problem-solving",
      "difficulty": "easy|medium|hard"
    }
  ]
}

ROLE CONTEXT: ${role}
- Focus on skills relevant to Rwanda's growing tech industry
- Include scenarios about working with limited resources
- Consider mobile-first development approaches
- Include questions about scalability and performance
- Add cultural context where appropriate`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Clean up the response to ensure valid JSON
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Gemini question generation error:', error);
      return this.getFallbackQuestions(role);
    }
  }

  // Live conversation with Gemini for interview practice
  async startLiveConversation(role, userProfile = {}) {
    const prompt = `You are an experienced tech interviewer conducting a live interview for a ${role} position in Rwanda's tech sector.

INTERVIEWER PERSONA:
- Professional but friendly
- Experienced in Rwanda's tech industry
- Understands local market challenges and opportunities
- Asks follow-up questions based on responses
- Provides constructive feedback

USER PROFILE: ${JSON.stringify(userProfile)}

INTERVIEW GUIDELINES:
1. Start with a warm greeting and role introduction
2. Ask about the candidate's background and interest in ${role}
3. Progress to technical questions based on their responses
4. Include behavioral and problem-solving scenarios
5. Consider Rwanda-specific contexts (mobile-first, limited bandwidth, etc.)
6. Keep responses conversational and under 100 words
7. Ask one question at a time
8. Provide encouragement and constructive feedback

Begin the interview now with a professional greeting.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const greeting = response.text();
      
      this.conversationHistory = [{
        role: 'interviewer',
        content: greeting,
        timestamp: new Date()
      }];
      
      return {
        message: greeting,
        conversationId: Date.now().toString(),
        status: 'active'
      };
    } catch (error) {
      console.error('Conversation start error:', error);
      return {
        message: `Hello! I'm excited to interview you for the ${role} position. Let's start by having you tell me about your background and what interests you about this role in Rwanda's tech sector.`,
        conversationId: Date.now().toString(),
        status: 'active'
      };
    }
  }

  // Continue live conversation
  async continueConversation(userResponse, conversationId, role) {
    const conversationContext = this.conversationHistory
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const prompt = `Continue this live interview conversation for a ${role} position:

CONVERSATION HISTORY:
${conversationContext}

CANDIDATE RESPONSE: "${userResponse}"

As the interviewer:
1. Acknowledge their response appropriately
2. Ask a relevant follow-up question or move to the next topic
3. Keep the conversation natural and flowing
4. Provide brief feedback when appropriate
5. Consider Rwanda's tech market context
6. Keep response under 100 words
7. If they've answered well, progress to more challenging questions
8. If they struggle, provide gentle guidance

Respond as the interviewer would naturally continue the conversation.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const aiResponse = response.text();
      
      // Add to conversation history
      this.conversationHistory.push({
        role: 'candidate',
        content: userResponse,
        timestamp: new Date()
      });
      
      this.conversationHistory.push({
        role: 'interviewer',
        content: aiResponse,
        timestamp: new Date()
      });
      
      return {
        message: aiResponse,
        conversationId,
        status: 'active'
      };
    } catch (error) {
      console.error('Conversation continue error:', error);
      return {
        message: "That's interesting! Can you tell me more about how you would apply that experience in Rwanda's tech environment?",
        conversationId,
        status: 'active'
      };
    }
  }

  // Generate interview feedback
  async generateInterviewFeedback(conversationHistory, role) {
    const conversation = conversationHistory
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    const prompt = `Analyze this interview conversation for a ${role} position and provide comprehensive feedback:

INTERVIEW TRANSCRIPT:
${conversation}

Provide detailed feedback in JSON format:
{
  "overallScore": number (0-100),
  "strengths": [array of specific strengths demonstrated],
  "improvements": [array of areas for improvement],
  "technicalAssessment": {
    "score": number (0-100),
    "feedback": "detailed technical feedback"
  },
  "communicationAssessment": {
    "score": number (0-100),
    "feedback": "communication skills feedback"
  },
  "rwandaContextAwareness": {
    "score": number (0-100),
    "feedback": "understanding of local market"
  },
  "recommendations": [array of specific recommendations],
  "nextSteps": [array of suggested next steps],
  "interviewTips": [array of interview improvement tips],
  "readinessLevel": "entry|junior|mid|senior level readiness"
}

Focus on practical, actionable feedback for Rwanda's tech job market.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Feedback generation error:', error);
      return this.getFallbackFeedback();
    }
  }

  // Analyze quiz performance and provide personalized feedback
  async analyzeQuizPerformance(answers, questions, role, timeSpent) {
    const performance = answers.map((answer, index) => ({
      question: questions[index].question,
      userAnswer: questions[index].options[answer],
      correctAnswer: questions[index].options[questions[index].correct],
      isCorrect: answer === questions[index].correct,
      category: questions[index].category
    }));

    const prompt = `Analyze this quiz performance for a ${role} position:

QUIZ RESULTS:
${JSON.stringify(performance, null, 2)}

TIME SPENT: ${timeSpent} seconds
TOTAL QUESTIONS: ${questions.length}
CORRECT ANSWERS: ${performance.filter(p => p.isCorrect).length}

Provide detailed analysis in JSON format:
{
  "overallScore": number (0-100),
  "categoryScores": {
    "technical": number,
    "behavioral": number,
    "problemSolving": number
  },
  "strengths": [array of demonstrated strengths],
  "weaknesses": [array of areas needing improvement],
  "studyRecommendations": [array of specific topics to study],
  "rwandaJobReadiness": {
    "score": number (0-100),
    "feedback": "readiness for Rwanda tech market"
  },
  "nextSteps": [array of recommended actions],
  "estimatedSalaryRange": "salary range in RWF based on performance"
}

Consider Rwanda's tech job market requirements and salary standards.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Performance analysis error:', error);
      return this.getFallbackAnalysis(performance);
    }
  }

  // Generate personalized study plan
  async generateStudyPlan(weakAreas, role, currentLevel) {
    const prompt = `Create a personalized study plan for improving in ${role} based on these weak areas:

WEAK AREAS: ${weakAreas.join(', ')}
CURRENT LEVEL: ${currentLevel}
TARGET ROLE: ${role}

Generate a comprehensive study plan in JSON format:
{
  "studyPlan": {
    "duration": "recommended study duration",
    "phases": [
      {
        "phase": "Phase name",
        "duration": "time needed",
        "topics": [array of topics to study],
        "resources": [array of recommended resources],
        "practiceProjects": [array of hands-on projects],
        "milestones": [array of learning milestones]
      }
    ]
  },
  "rwandaSpecificResources": [array of Rwanda-relevant learning resources],
  "practiceOpportunities": [array of ways to practice in Rwanda context],
  "communityConnections": [array of Rwanda tech communities to join]
}

Focus on practical, achievable goals for Rwanda's tech market.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Study plan generation error:', error);
      return this.getFallbackStudyPlan(role);
    }
  }

  // Fallback methods for when AI fails
  getFallbackQuestions(role) {
    return {
      questions: [
        {
          question: `What is the most important skill for a ${role} in Rwanda's tech sector?`,
          options: [
            "Technical expertise only",
            "Communication and technical skills",
            "Management skills",
            "Sales abilities"
          ],
          correct: 1,
          explanation: "In Rwanda's collaborative tech environment, both technical skills and communication are essential.",
          category: "behavioral",
          difficulty: "medium"
        }
      ]
    };
  }

  getFallbackFeedback() {
    return {
      overallScore: 75,
      strengths: ["Good communication", "Technical understanding"],
      improvements: ["Provide more specific examples", "Show deeper technical knowledge"],
      recommendations: ["Practice more technical scenarios", "Research Rwanda's tech market"],
      readinessLevel: "junior level readiness"
    };
  }

  getFallbackAnalysis(performance) {
    const correctCount = performance.filter(p => p.isCorrect).length;
    const score = Math.round((correctCount / performance.length) * 100);
    
    return {
      overallScore: score,
      categoryScores: { technical: score, behavioral: score - 10, problemSolving: score + 5 },
      strengths: ["Demonstrated basic understanding"],
      weaknesses: ["Need more practice in specific areas"],
      studyRecommendations: ["Review fundamental concepts", "Practice more problems"],
      rwandaJobReadiness: { score: score, feedback: "Good foundation, continue learning" },
      estimatedSalaryRange: "400,000 - 800,000 RWF based on current skill level"
    };
  }

  getFallbackStudyPlan(role) {
    return {
      studyPlan: {
        duration: "3-6 months",
        phases: [
          {
            phase: "Foundation Building",
            duration: "2 months",
            topics: [`${role} fundamentals`, "Problem solving", "Communication skills"],
            resources: ["Online courses", "Documentation", "Practice projects"],
            practiceProjects: ["Build a simple project", "Contribute to open source"],
            milestones: ["Complete basic project", "Pass practice quiz"]
          }
        ]
      },
      rwandaSpecificResources: ["Rwanda tech communities", "Local meetups"],
      practiceOpportunities: ["Join local tech groups", "Attend workshops"],
      communityConnections: ["Kigali tech hub", "Rwanda developers community"]
    };
  }
}

export const geminiQuizService = new GeminiQuizService();
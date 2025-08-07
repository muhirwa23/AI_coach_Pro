import { NextResponse } from 'next/server';
import { geminiQuizService } from '@/lib/gemini-quiz-service';

export async function POST(request) {
  try {
    const { type, data } = await request.json();

    if (type === 'quiz') {
      const { answers, questions, role, timeSpent } = data;
      
      if (!answers || !questions || !role) {
        return NextResponse.json(
          { error: 'Answers, questions, and role are required' },
          { status: 400 }
        );
      }

      const analysis = await geminiQuizService.analyzeQuizPerformance(
        answers,
        questions,
        role,
        timeSpent || 0
      );

      return NextResponse.json({
        success: true,
        analysis,
        message: 'Quiz performance analyzed successfully'
      });
    }

    if (type === 'interview') {
      const { conversationHistory, role } = data;
      
      if (!conversationHistory || !role) {
        return NextResponse.json(
          { error: 'Conversation history and role are required' },
          { status: 400 }
        );
      }

      const feedback = await geminiQuizService.generateInterviewFeedback(
        conversationHistory,
        role
      );

      return NextResponse.json({
        success: true,
        feedback,
        message: 'Interview feedback generated successfully'
      });
    }

    return NextResponse.json(
      { error: 'Invalid analysis type. Use "quiz" or "interview"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Analysis API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        message: 'Failed to analyze performance'
      },
      { status: 500 }
    );
  }
}
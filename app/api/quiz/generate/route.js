import { NextResponse } from 'next/server';
import { geminiQuizService } from '@/lib/gemini-quiz-service';

export async function POST(request) {
  try {
    const { role, difficulty, count } = await request.json();

    if (!role) {
      return NextResponse.json(
        { error: 'Role is required' },
        { status: 400 }
      );
    }

    const questions = await geminiQuizService.generateQuizQuestions(
      role,
      difficulty || 'intermediate',
      count || 10
    );

    return NextResponse.json({
      success: true,
      questions: questions.questions,
      message: 'Questions generated successfully'
    });
  } catch (error) {
    console.error('Quiz generation error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        message: 'Failed to generate quiz questions'
      },
      { status: 500 }
    );
  }
}
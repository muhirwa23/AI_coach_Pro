import { NextResponse } from 'next/server';
import { geminiQuizService } from '@/lib/gemini-quiz-service';

export async function POST(request) {
  try {
    const { action, role, userResponse, conversationId, userProfile } = await request.json();

    if (action === 'start') {
      if (!role) {
        return NextResponse.json(
          { error: 'Role is required to start conversation' },
          { status: 400 }
        );
      }

      const conversation = await geminiQuizService.startLiveConversation(role, userProfile);
      
      return NextResponse.json({
        success: true,
        ...conversation,
        message: 'Conversation started successfully'
      });
    }

    if (action === 'continue') {
      if (!userResponse || !conversationId || !role) {
        return NextResponse.json(
          { error: 'User response, conversation ID, and role are required' },
          { status: 400 }
        );
      }

      const response = await geminiQuizService.continueConversation(
        userResponse,
        conversationId,
        role
      );

      return NextResponse.json({
        success: true,
        ...response
      });
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "start" or "continue"' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Conversation API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        message: 'Failed to process conversation'
      },
      { status: 500 }
    );
  }
}
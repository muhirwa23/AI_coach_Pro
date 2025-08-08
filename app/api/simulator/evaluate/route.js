import { NextResponse } from 'next/server';
import { SkillsSimulatorAI } from '@/lib/skills-simulator-ai';

export async function POST(request) {
  try {
    const { 
      simulationType, 
      userActions, 
      timeSpent, 
      completionRate, 
      userAnswers,
      simulationId 
    } = await request.json();
    
    if (!simulationType || !userActions) {
      return NextResponse.json(
        { success: false, message: 'Simulation type and user actions are required' },
        { status: 400 }
      );
    }

    const simulator = new SkillsSimulatorAI();
    
    const evaluation = await simulator.evaluateSimulationPerformance(
      simulationType,
      userActions,
      timeSpent || 0,
      completionRate || 0
    );

    // Calculate performance metrics
    const performanceMetrics = calculatePerformanceMetrics(
      simulationType,
      userActions,
      timeSpent,
      completionRate
    );

    // Generate skill recommendations
    const skillRecommendations = await generateSkillRecommendations(
      simulator,
      simulationType,
      evaluation,
      performanceMetrics
    );

    return NextResponse.json({
      success: true,
      evaluation,
      performanceMetrics,
      skillRecommendations,
      metadata: {
        simulationType,
        evaluatedAt: new Date().toISOString(),
        simulationId,
        nextSteps: getNextSteps(simulationType, performanceMetrics.overallScore)
      }
    });

  } catch (error) {
    console.error('Simulation evaluation error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to evaluate simulation', error: error.message },
      { status: 500 }
    );
  }
}

function calculatePerformanceMetrics(type, actions, timeSpent, completionRate) {
  const baseMetrics = {
    overallScore: 0,
    efficiency: 0,
    accuracy: 0,
    problemSolving: 0,
    industryReadiness: 0
  };

  // Calculate efficiency (time vs expected time)
  const expectedTimes = {
    cloud: 90,
    devops: 120,
    cybersecurity: 75,
    'ux-design': 150
  };
  
  const expectedTime = expectedTimes[type] || 90;
  baseMetrics.efficiency = Math.max(0, Math.min(100, (expectedTime / Math.max(timeSpent, 1)) * 100));

  // Calculate accuracy based on completion rate
  baseMetrics.accuracy = completionRate;

  // Problem solving score based on action quality
  const actionCount = Array.isArray(actions) ? actions.length : 0;
  const expectedActions = getExpectedActionCount(type);
  baseMetrics.problemSolving = Math.min(100, (actionCount / expectedActions) * 100);

  // Overall score calculation
  baseMetrics.overallScore = Math.round(
    (baseMetrics.efficiency * 0.3 + 
     baseMetrics.accuracy * 0.4 + 
     baseMetrics.problemSolving * 0.3)
  );

  // Industry readiness based on overall performance
  baseMetrics.industryReadiness = baseMetrics.overallScore >= 80 ? 'Ready' : 
                                  baseMetrics.overallScore >= 60 ? 'Nearly Ready' : 'Needs Improvement';

  return baseMetrics;
}

function getExpectedActionCount(type) {
  const expectedActions = {
    cloud: 8,
    devops: 12,
    cybersecurity: 6,
    'ux-design': 10
  };
  
  return expectedActions[type] || 8;
}

async function generateSkillRecommendations(simulator, type, evaluation, metrics) {
  const recommendations = {
    immediate: [],
    shortTerm: [],
    longTerm: [],
    resources: []
  };

  // Generate recommendations based on performance
  if (metrics.overallScore < 60) {
    recommendations.immediate.push(`Review ${type} fundamentals`);
    recommendations.immediate.push('Practice basic scenarios');
  } else if (metrics.overallScore < 80) {
    recommendations.shortTerm.push(`Advanced ${type} techniques`);
    recommendations.shortTerm.push('Real-world project experience');
  } else {
    recommendations.longTerm.push(`${type} specialization certification`);
    recommendations.longTerm.push('Mentor junior developers');
  }

  // Add type-specific recommendations
  switch (type) {
    case 'cloud':
      recommendations.resources.push('AWS/Azure certification paths');
      recommendations.resources.push('Cloud architecture patterns');
      break;
    case 'devops':
      recommendations.resources.push('CI/CD pipeline optimization');
      recommendations.resources.push('Infrastructure as Code');
      break;
    case 'cybersecurity':
      recommendations.resources.push('Security frameworks (NIST, ISO 27001)');
      recommendations.resources.push('Incident response playbooks');
      break;
    case 'ux-design':
      recommendations.resources.push('Design system development');
      recommendations.resources.push('User research methodologies');
      break;
  }

  return recommendations;
}

function getNextSteps(type, score) {
  const nextSteps = [];
  
  if (score >= 80) {
    nextSteps.push('Ready for advanced simulations');
    nextSteps.push('Consider real-world projects');
    nextSteps.push('Explore certification opportunities');
  } else if (score >= 60) {
    nextSteps.push('Practice similar scenarios');
    nextSteps.push('Focus on weak areas identified');
    nextSteps.push('Seek mentorship or guidance');
  } else {
    nextSteps.push('Review fundamental concepts');
    nextSteps.push('Start with beginner-level simulations');
    nextSteps.push('Build foundational knowledge');
  }
  
  return nextSteps;
}
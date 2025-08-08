import { NextResponse } from 'next/server';
import { SkillsSimulatorAI } from '@/lib/skills-simulator-ai';

export async function POST(request) {
  try {
    const { userProfile, currentProgress, skillGaps, action } = await request.json();
    
    const simulator = new SkillsSimulatorAI();
    
    let result;
    
    switch (action) {
      case 'generate_workflow':
        result = await simulator.generateAdaptiveWorkflow(
          userProfile,
          currentProgress,
          skillGaps
        );
        break;
        
      case 'update_progress':
        result = await updateLearningProgress(userProfile, currentProgress);
        break;
        
      case 'recommend_next':
        result = await recommendNextSimulation(userProfile, currentProgress);
        break;
        
      default:
        return NextResponse.json(
          { success: false, message: 'Invalid action specified' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result,
      metadata: {
        action,
        processedAt: new Date().toISOString(),
        userLevel: determineUserLevel(currentProgress),
        recommendedPath: generateRecommendedPath(userProfile, skillGaps)
      }
    });

  } catch (error) {
    console.error('Workflow processing error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process workflow', error: error.message },
      { status: 500 }
    );
  }
}

async function updateLearningProgress(userProfile, currentProgress) {
  // Calculate learning velocity and skill improvements
  const progressMetrics = {
    completedSimulations: currentProgress.completedSimulations || 0,
    averageScore: currentProgress.averageScore || 0,
    timeInvested: currentProgress.timeInvested || 0,
    skillsImproved: currentProgress.skillsImproved || [],
    weakAreas: currentProgress.weakAreas || [],
    strongAreas: currentProgress.strongAreas || []
  };

  // Analyze learning patterns
  const learningVelocity = calculateLearningVelocity(progressMetrics);
  const skillProgression = analyzeSkillProgression(progressMetrics);
  const recommendedFocus = identifyRecommendedFocus(progressMetrics);

  return {
    progressMetrics,
    learningVelocity,
    skillProgression,
    recommendedFocus,
    nextMilestone: getNextMilestone(progressMetrics)
  };
}

async function recommendNextSimulation(userProfile, currentProgress) {
  const recommendations = [];
  
  // Analyze current skill level and gaps
  const skillLevel = determineUserLevel(currentProgress);
  const primaryGaps = identifyPrimaryGaps(currentProgress);
  
  // Generate personalized recommendations
  for (const gap of primaryGaps.slice(0, 3)) {
    const recommendation = {
      type: gap.skillArea,
      level: skillLevel,
      focus: gap.specificArea,
      priority: gap.priority,
      estimatedImpact: gap.impact,
      reasoning: `Based on your current progress, focusing on ${gap.skillArea} will have the highest impact on your career readiness in Rwanda's tech market.`
    };
    
    recommendations.push(recommendation);
  }
  
  return {
    recommendations,
    priorityOrder: recommendations.map(r => r.type),
    estimatedTimeToCompletion: calculateEstimatedTime(recommendations),
    careerImpactScore: calculateCareerImpact(recommendations, userProfile)
  };
}

function determineUserLevel(currentProgress) {
  const averageScore = currentProgress.averageScore || 0;
  const completedCount = currentProgress.completedSimulations || 0;
  
  if (averageScore >= 85 && completedCount >= 10) return 'advanced';
  if (averageScore >= 70 && completedCount >= 5) return 'intermediate';
  return 'beginner';
}

function calculateLearningVelocity(metrics) {
  const timePerSimulation = metrics.timeInvested / Math.max(metrics.completedSimulations, 1);
  const scoreImprovement = metrics.averageScore / Math.max(metrics.completedSimulations, 1);
  
  return {
    efficiency: timePerSimulation < 90 ? 'High' : timePerSimulation < 120 ? 'Medium' : 'Low',
    improvement: scoreImprovement > 5 ? 'Rapid' : scoreImprovement > 2 ? 'Steady' : 'Gradual',
    consistency: metrics.completedSimulations > 0 ? 'Regular' : 'Irregular'
  };
}

function analyzeSkillProgression(metrics) {
  return {
    strongestSkills: metrics.strongAreas.slice(0, 3),
    improvingSkills: metrics.skillsImproved.slice(0, 3),
    challengingAreas: metrics.weakAreas.slice(0, 3),
    overallTrend: metrics.averageScore > 70 ? 'Positive' : 'Needs Focus'
  };
}

function identifyRecommendedFocus(metrics) {
  const focusAreas = [];
  
  // Prioritize weak areas for improvement
  metrics.weakAreas.forEach(area => {
    focusAreas.push({
      area,
      priority: 'High',
      reason: 'Address skill gap'
    });
  });
  
  // Add advanced topics for strong areas
  metrics.strongAreas.forEach(area => {
    focusAreas.push({
      area: `Advanced ${area}`,
      priority: 'Medium',
      reason: 'Build expertise'
    });
  });
  
  return focusAreas.slice(0, 5);
}

function identifyPrimaryGaps(currentProgress) {
  // Rwanda tech market priority skills
  const marketPriorities = [
    { skillArea: 'cloud', specificArea: 'aws', priority: 'High', impact: 9 },
    { skillArea: 'devops', specificArea: 'ci-cd', priority: 'High', impact: 8 },
    { skillArea: 'cybersecurity', specificArea: 'incident-response', priority: 'Medium', impact: 7 },
    { skillArea: 'ux-design', specificArea: 'mobile-first', priority: 'Medium', impact: 8 }
  ];
  
  // Filter based on user's current progress
  const userWeakAreas = currentProgress.weakAreas || [];
  
  return marketPriorities.filter(priority => 
    userWeakAreas.includes(priority.skillArea) || 
    !currentProgress.strongAreas?.includes(priority.skillArea)
  );
}

function getNextMilestone(metrics) {
  const completedCount = metrics.completedSimulations || 0;
  
  if (completedCount < 5) {
    return {
      target: 'Complete 5 simulations',
      progress: completedCount,
      total: 5,
      reward: 'Unlock intermediate level'
    };
  } else if (completedCount < 15) {
    return {
      target: 'Achieve 80% average score',
      progress: metrics.averageScore,
      total: 80,
      reward: 'Industry readiness certification'
    };
  } else {
    return {
      target: 'Become simulation mentor',
      progress: completedCount,
      total: 25,
      reward: 'Expert status and teaching opportunities'
    };
  }
}

function generateRecommendedPath(userProfile, skillGaps) {
  const path = {
    immediate: [],
    shortTerm: [],
    longTerm: []
  };
  
  // Immediate (next 2 weeks)
  path.immediate.push('Complete skill assessment');
  path.immediate.push('Start with beginner simulation');
  
  // Short term (1-3 months)
  path.shortTerm.push('Master 2-3 core skill areas');
  path.shortTerm.push('Build portfolio projects');
  
  // Long term (3-6 months)
  path.longTerm.push('Achieve industry certification');
  path.longTerm.push('Apply for target roles');
  
  return path;
}

function calculateEstimatedTime(recommendations) {
  const timePerType = {
    cloud: 90,
    devops: 120,
    cybersecurity: 75,
    'ux-design': 150
  };
  
  return recommendations.reduce((total, rec) => {
    return total + (timePerType[rec.type] || 90);
  }, 0);
}

function calculateCareerImpact(recommendations, userProfile) {
  // Calculate based on Rwanda job market demand
  const impactScores = {
    cloud: 9,
    devops: 8,
    cybersecurity: 7,
    'ux-design': 8
  };
  
  const totalImpact = recommendations.reduce((total, rec) => {
    return total + (impactScores[rec.type] || 5);
  }, 0);
  
  return Math.min(10, totalImpact / recommendations.length);
}
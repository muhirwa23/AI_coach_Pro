import { NextResponse } from 'next/server';
import { SkillsSimulatorAI } from '@/lib/skills-simulator-ai';

export async function POST(request) {
  try {
    const { type, level, focus, userProfile } = await request.json();
    
    if (!type) {
      return NextResponse.json(
        { success: false, message: 'Simulation type is required' },
        { status: 400 }
      );
    }

    // Check if Gemini API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY not found in environment variables');
      return NextResponse.json({
        success: true,
        simulation: getFallbackSimulation(type, level, focus),
        metadata: {
          type,
          level,
          focus,
          generatedAt: new Date().toISOString(),
          estimatedDuration: getEstimatedDuration(type, level),
          difficultyScore: getDifficultyScore(type, level),
          fallback: true
        }
      });
    }

    const simulator = new SkillsSimulatorAI();
    let simulation;

    try {
      switch (type) {
        case 'cloud':
          simulation = await simulator.generateCloudScenario(level, focus);
          break;
        
        case 'devops':
          simulation = await simulator.generateDevOpsPipeline(level, focus);
          break;
        
        case 'cybersecurity':
          simulation = await simulator.generateSecurityIncident(level, focus);
          break;
        
        case 'ux-design':
          simulation = await simulator.generateUXChallenge(level, focus);
          break;
        
        default:
          return NextResponse.json(
            { success: false, message: 'Invalid simulation type' },
            { status: 400 }
          );
      }
    } catch (aiError) {
      console.error('AI generation error, using fallback:', aiError);
      simulation = getFallbackSimulation(type, level, focus);
    }

    return NextResponse.json({
      success: true,
      simulation,
      metadata: {
        type,
        level,
        focus,
        generatedAt: new Date().toISOString(),
        estimatedDuration: getEstimatedDuration(type, level),
        difficultyScore: getDifficultyScore(type, level)
      }
    });

  } catch (error) {
    console.error('Simulation generation error:', error);
    
    // Return fallback simulation even on error
    const { type, level, focus } = await request.json().catch(() => ({ type: 'cloud', level: 'intermediate', focus: 'aws' }));
    
    return NextResponse.json({
      success: true,
      simulation: getFallbackSimulation(type, level, focus),
      metadata: {
        type,
        level,
        focus,
        generatedAt: new Date().toISOString(),
        estimatedDuration: getEstimatedDuration(type, level),
        difficultyScore: getDifficultyScore(type, level),
        fallback: true,
        error: 'Used fallback due to generation error'
      }
    });
  }
}

function getEstimatedDuration(type, level) {
  const baseDurations = {
    cloud: { beginner: 45, intermediate: 90, advanced: 120 },
    devops: { beginner: 60, intermediate: 120, advanced: 180 },
    cybersecurity: { beginner: 30, intermediate: 75, advanced: 150 },
    'ux-design': { beginner: 90, intermediate: 150, advanced: 240 }
  };
  
  return baseDurations[type]?.[level] || 60;
}

function getDifficultyScore(type, level) {
  const difficultyMap = {
    beginner: 3,
    intermediate: 6,
    advanced: 9,
    expert: 10
  };
  
  return difficultyMap[level] || 5;
}

function getFallbackSimulation(type, level, focus) {
  const fallbackSimulations = {
    cloud: {
      type: 'cloud',
      title: 'Cloud Infrastructure Setup for Rwandan Fintech',
      description: 'Design and implement a scalable cloud infrastructure for a growing Rwandan fintech startup handling mobile money transactions.',
      scenario: {
        company: 'RwandaPay - Mobile Money Platform',
        challenge: 'Scale infrastructure to handle 50,000+ daily transactions',
        constraints: ['Budget: $5,000/month', 'High availability required', 'Data must stay in Africa'],
        success_criteria: '99.9% uptime, <200ms response time, secure data handling'
      },
      tasks: [
        {
          id: 1,
          title: 'Architecture Planning',
          description: 'Design the overall cloud architecture',
          options: ['Multi-region setup', 'Single region with backups', 'Hybrid cloud approach'],
          difficulty: level
        },
        {
          id: 2,
          title: 'Database Selection',
          description: 'Choose appropriate database solution',
          options: ['PostgreSQL on RDS', 'MongoDB Atlas', 'DynamoDB'],
          difficulty: level
        },
        {
          id: 3,
          title: 'Security Implementation',
          description: 'Implement security best practices',
          options: ['WAF + CloudFlare', 'VPC with private subnets', 'End-to-end encryption'],
          difficulty: level
        }
      ],
      content: 'You are the lead cloud architect for RwandaPay, a rapidly growing mobile money platform. Your task is to design and implement a scalable, secure, and cost-effective cloud infrastructure that can handle the company\'s growth from 10,000 to 50,000+ daily transactions while maintaining 99.9% uptime and complying with Rwandan data protection regulations.'
    },
    devops: {
      type: 'devops',
      title: 'CI/CD Pipeline for Rwandan E-commerce Platform',
      description: 'Build a complete DevOps pipeline for a Rwandan e-commerce platform serving both urban and rural customers.',
      scenario: {
        company: 'KigaliMarket - E-commerce Platform',
        challenge: 'Implement automated deployment pipeline',
        constraints: ['Multiple environments', 'Mobile-first approach', 'Low-bandwidth optimization'],
        success_criteria: 'Automated deployments, 95% test coverage, <5min build time'
      },
      tasks: [
        {
          id: 1,
          title: 'Source Control Strategy',
          description: 'Set up branching strategy and workflows',
          options: ['GitFlow', 'GitHub Flow', 'Trunk-based development'],
          difficulty: level
        },
        {
          id: 2,
          title: 'Build Pipeline',
          description: 'Configure automated build and testing',
          options: ['Jenkins', 'GitHub Actions', 'GitLab CI'],
          difficulty: level
        },
        {
          id: 3,
          title: 'Deployment Strategy',
          description: 'Choose deployment approach',
          options: ['Blue-green deployment', 'Rolling updates', 'Canary releases'],
          difficulty: level
        }
      ],
      content: 'KigaliMarket needs a robust DevOps pipeline to support their growing e-commerce platform. You need to implement CI/CD practices that ensure reliable deployments while considering Rwanda\'s unique infrastructure challenges including intermittent connectivity and the need for mobile-optimized applications.'
    },
    cybersecurity: {
      type: 'cybersecurity',
      title: 'Security Incident Response - Banking Sector',
      description: 'Handle a sophisticated cyber attack targeting a Rwandan digital bank\'s customer data and transaction systems.',
      scenario: {
        company: 'Bank of Kigali Digital Services',
        challenge: 'Respond to suspected data breach',
        constraints: ['Regulatory compliance (BNR)', 'Customer trust', 'Business continuity'],
        success_criteria: 'Contain breach, preserve evidence, maintain operations'
      },
      tasks: [
        {
          id: 1,
          title: 'Initial Assessment',
          description: 'Evaluate the scope and impact of the incident',
          options: ['Network traffic analysis', 'System log review', 'User behavior analysis'],
          difficulty: level
        },
        {
          id: 2,
          title: 'Containment Strategy',
          description: 'Implement immediate containment measures',
          options: ['Network segmentation', 'System isolation', 'Access revocation'],
          difficulty: level
        },
        {
          id: 3,
          title: 'Evidence Collection',
          description: 'Preserve digital evidence for investigation',
          options: ['Memory dumps', 'Disk imaging', 'Network packet capture'],
          difficulty: level
        }
      ],
      content: 'You are the incident response lead for Bank of Kigali Digital Services. Suspicious network activity has been detected, and there are indicators of a potential data breach. You must quickly assess the situation, contain the threat, and ensure compliance with Rwandan banking regulations while maintaining customer trust and business operations.'
    },
    'ux-design': {
      type: 'ux-design',
      title: 'Mobile Banking App for Rural Rwanda',
      description: 'Design an inclusive mobile banking application that serves both urban professionals and rural farmers in Rwanda.',
      scenario: {
        company: 'Urwego Bank - Digital Inclusion Initiative',
        challenge: 'Design accessible mobile banking for diverse users',
        constraints: ['Low literacy levels', 'Feature phone support', 'Intermittent connectivity'],
        success_criteria: 'High user adoption, low support calls, positive user feedback'
      },
      tasks: [
        {
          id: 1,
          title: 'User Research',
          description: 'Understand diverse user needs and contexts',
          options: ['Rural farmer interviews', 'Urban professional surveys', 'Accessibility audits'],
          difficulty: level
        },
        {
          id: 2,
          title: 'Information Architecture',
          description: 'Structure the app for intuitive navigation',
          options: ['Task-based flow', 'Feature-based grouping', 'Progressive disclosure'],
          difficulty: level
        },
        {
          id: 3,
          title: 'Visual Design',
          description: 'Create culturally appropriate and accessible design',
          options: ['High contrast mode', 'Icon-based navigation', 'Voice assistance'],
          difficulty: level
        }
      ],
      content: 'Urwego Bank wants to expand financial inclusion in Rwanda by creating a mobile banking app that works for everyone - from tech-savvy urban professionals to rural farmers with basic phones. Your challenge is to design an experience that is intuitive, accessible, and culturally appropriate while working within technical constraints like low bandwidth and varying device capabilities.'
    }
  };

  return fallbackSimulations[type] || fallbackSimulations.cloud;
}
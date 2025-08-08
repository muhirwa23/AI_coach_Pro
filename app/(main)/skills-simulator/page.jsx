"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Brain,
    Cloud,
    Shield,
    Palette,
    Settings,
    Target,
    Clock,
    Star,
    Zap,
    Trophy,
    Play,
    Sparkles,
    Rocket,
    Code,
    Users,
    BookOpen,
    Award,
    ArrowRight
} from "lucide-react";
import EnhancedSimulation from "@/components/enhanced-simulation";

export default function SkillsSimulatorPage() {
    const [activeTab, setActiveTab] = useState("enhanced");
    
    // Legacy simulation state (kept for backward compatibility)
    const [legacyState, setLegacyState] = useState({
        selectedSimulation: null,
        currentSimulation: null,
        simulationState: 'idle',
        userActions: [],
        timeSpent: 0,
        currentStep: 0,
        simulationResults: null,
        isGenerating: false,
        userProfile: {
            level: 'intermediate',
            completedSimulations: 3,
            averageScore: 75,
            preferredAreas: ['cloud', 'devops']
        }
    });

    // Legacy simulation functions (simplified for demo)
    const startLegacySimulation = async (simulationType) => {
        setLegacyState(prev => ({ ...prev, isGenerating: true }));
        // Simulate API call
        setTimeout(() => {
            setLegacyState(prev => ({ 
                ...prev, 
                isGenerating: false,
                selectedSimulation: simulationType,
                simulationState: 'running'
            }));
        }, 2000);
    };

    // Legacy simulation rendering function
    function renderLegacySimulation() {
        const simulationTypes = [
            {
                id: 'cloud',
                title: 'Cloud Environment Simulation',
                icon: <Cloud className="h-8 w-8" />,
                description: 'Master AWS, Azure, and GCP with real-world scenarios',
                difficulty: 'Intermediate',
                duration: '90 min',
                participants: '2.3k+',
                rating: 4.8,
                color: 'blue',
                gradient: 'from-blue-500 to-cyan-500',
                skills: ['AWS EC2', 'Docker', 'Kubernetes', 'Terraform', 'CloudFormation'],
                scenarios: ['E-commerce scaling', 'Disaster recovery', 'Cost optimization', 'Security hardening']
            },
            {
                id: 'devops',
                title: 'DevOps Pipeline Practice',
                icon: <Settings className="h-8 w-8" />,
                description: 'Build CI/CD pipelines and automate deployments',
                difficulty: 'Advanced',
                duration: '120 min',
                participants: '1.8k+',
                rating: 4.9,
                color: 'green',
                gradient: 'from-green-500 to-emerald-500',
                skills: ['Jenkins', 'GitLab CI', 'Docker', 'Ansible', 'Monitoring'],
                scenarios: ['Microservices deployment', 'Blue-green deployment', 'Infrastructure as Code', 'Monitoring setup']
            },
            {
                id: 'cybersecurity',
                title: 'Security Incident Response',
                icon: <Shield className="h-8 w-8" />,
                description: 'Handle real cybersecurity threats and incidents',
                difficulty: 'Expert',
                duration: '75 min',
                participants: '1.2k+',
                rating: 4.7,
                color: 'red',
                gradient: 'from-red-500 to-pink-500',
                skills: ['Incident Response', 'Forensics', 'SIEM', 'Threat Hunting', 'Compliance'],
                scenarios: ['Ransomware attack', 'Data breach', 'DDoS mitigation', 'Insider threat']
            },
            {
                id: 'ux-design',
                title: 'UX Design Challenge',
                icon: <Palette className="h-8 w-8" />,
                description: 'Create user-centered designs for African markets',
                difficulty: 'Intermediate',
                duration: '150 min',
                participants: '3.1k+',
                rating: 4.6,
                color: 'purple',
                gradient: 'from-purple-500 to-pink-500',
                skills: ['User Research', 'Prototyping', 'Figma', 'Usability Testing', 'Design Systems'],
                scenarios: ['Mobile banking app', 'E-learning platform', 'Healthcare portal', 'Government services']
            }
        ];

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {simulationTypes.map((simulation) => (
                    <Card 
                        key={simulation.id}
                        className="bg-gray-800 border-gray-700 hover:border-gray-500 transition-all duration-300 group hover:scale-105 hover:shadow-2xl"
                    >
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-4 rounded-full bg-gradient-to-r ${simulation.gradient} group-hover:scale-110 transition-transform`}>
                                    {simulation.icon}
                                </div>
                                <div className="text-right">
                                    <Badge variant="outline" className={`border-${simulation.color}-500 text-${simulation.color}-400 mb-2`}>
                                        {simulation.difficulty}
                                    </Badge>
                                    <div className="text-sm text-gray-400 flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        {simulation.duration}
                                    </div>
                                </div>
                            </div>
                            <CardTitle className="text-2xl text-white mb-2">{simulation.title}</CardTitle>
                            <p className="text-gray-300 mb-4">{simulation.description}</p>
                            
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-white mb-2">Core Skills:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {simulation.skills.map((skill, index) => (
                                            <Badge key={index} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-white mb-2">Scenarios:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {simulation.scenarios.map((scenario, index) => (
                                            <Badge key={index} variant="outline" className={`border-${simulation.color}-500 text-${simulation.color}-400 text-xs`}>
                                                {scenario}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-400">{simulation.participants}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 text-yellow-400" />
                                        <span className="text-sm text-gray-400">{simulation.rating}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <Button
                                onClick={() => startLegacySimulation(simulation)}
                                disabled={legacyState.isGenerating}
                                className={`w-full bg-gradient-to-r ${simulation.gradient} hover:opacity-90 text-white font-semibold py-3`}
                            >
                                {legacyState.isGenerating ? (
                                    <>
                                        <Zap className="h-5 w-5 mr-2 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-5 w-5 mr-2" />
                                        Start Simulation
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    // Main View with Tabs
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-6xl animate-pulse">
                                🧠
                            </div>
                            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-white" />
                            </div>
                        </div>
                    </div>
                    <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                        AI Skills Simulator
                    </h1>
                    <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
                        Master real-world tech skills through AI-powered simulations designed for Rwanda's digital economy
                    </p>
                    
                    {/* Learning Resources Banner */}
                    <div className="mb-12">
                        <Card className="bg-gradient-to-r from-red-600/20 to-pink-600/20 border-red-500/50">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
                                            <BookOpen className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">📺 YouTube E-Learning Platform</h3>
                                            <p className="text-red-200">Transform any YouTube video into an interactive learning experience with AI-powered quizzes and assessments</p>
                                        </div>
                                    </div>
                                    <a 
                                        href="https://youtub-elearning.vercel.app/" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors flex items-center gap-2"
                                    >
                                        🚀 Try Now
                                        <ArrowRight className="h-4 w-4" />
                                    </a>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Simulation Mode Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700 mb-8">
                        <TabsTrigger 
                            value="enhanced" 
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white"
                        >
                            <Rocket className="h-5 w-5 mr-2" />
                            Enhanced AI Simulation
                            <Badge variant="outline" className="ml-2 border-green-500 text-green-400 text-xs">
                                NEW
                            </Badge>
                        </TabsTrigger>
                        <TabsTrigger 
                            value="legacy"
                            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600 data-[state=active]:to-gray-500 data-[state=active]:text-white"
                        >
                            <Code className="h-5 w-5 mr-2" />
                            Classic Simulation
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="enhanced" className="mt-0">
                        <div className="mb-8">
                            <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/50">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                                            <Sparkles className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Enhanced AI Simulation</h3>
                                            <p className="text-blue-200">Powered by advanced AI agents with dynamic scenarios</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-center gap-2 text-blue-200">
                                            <Brain className="h-4 w-4" />
                                            <span>AI-driven conversations</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-200">
                                            <Target className="h-4 w-4" />
                                            <span>Real-time adaptation</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-200">
                                            <Trophy className="h-4 w-4" />
                                            <span>Portfolio artifacts</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        <EnhancedSimulation />
                    </TabsContent>

                    <TabsContent value="legacy" className="mt-0">
                        <div className="mb-8">
                            <Card className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-600/50">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="p-3 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full">
                                            <Code className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white">Classic Simulation</h3>
                                            <p className="text-gray-300">Traditional step-by-step simulation experience</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Play className="h-4 w-4" />
                                            <span>Structured scenarios</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Clock className="h-4 w-4" />
                                            <span>Timed challenges</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Star className="h-4 w-4" />
                                            <span>Performance scoring</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        {renderLegacySimulation()}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
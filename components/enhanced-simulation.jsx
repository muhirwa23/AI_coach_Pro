"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
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
    Pause,
    RotateCcw,
    CheckCircle,
    AlertTriangle,
    TrendingUp,
    Users,
    BookOpen,
    Award,
    Sparkles,
    Rocket,
    Code,
    Database,
    Monitor,
    Cpu,
    Send,
    MessageSquare,
    DollarSign,
    Timer,
    Activity,
    FileText,
    Download
} from "lucide-react";
import { toast } from "sonner";

export default function EnhancedSimulation() {
    const [simulationState, setSimulationState] = useState('selection'); // selection, active, completed
    const [currentSimulation, setCurrentSimulation] = useState(null);
    const [simulationId, setSimulationId] = useState(null);
    const [userInput, setUserInput] = useState('');
    const [conversationHistory, setConversationHistory] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [simulationStatus, setSimulationStatus] = useState(null);
    const [finalReport, setFinalReport] = useState(null);
    const chatEndRef = useRef(null);

    const roleTypes = [
        {
            id: 'cloud-architect',
            title: 'Cloud Solutions Architect',
            icon: <Cloud className="h-8 w-8" />,
            description: 'Design scalable cloud infrastructure for African fintech companies',
            difficulty: 'Advanced',
            duration: '8 hours',
            color: 'blue',
            gradient: 'from-blue-500 to-cyan-500',
            competencies: ['Infrastructure Design', 'Cost Optimization', 'Security', 'Scalability', 'Compliance']
        },
        {
            id: 'devops-engineer',
            title: 'Senior DevOps Engineer',
            icon: <Settings className="h-8 w-8" />,
            description: 'Build CI/CD pipelines for Rwanda\'s growing e-commerce platforms',
            difficulty: 'Advanced',
            duration: '6 hours',
            color: 'green',
            gradient: 'from-green-500 to-emerald-500',
            competencies: ['CI/CD Design', 'Infrastructure as Code', 'Monitoring', 'Security', 'Collaboration']
        },
        {
            id: 'cybersecurity-analyst',
            title: 'Cybersecurity Analyst',
            icon: <Shield className="h-8 w-8" />,
            description: 'Handle security incidents in Rwanda\'s banking sector',
            difficulty: 'Expert',
            duration: '4 hours',
            color: 'red',
            gradient: 'from-red-500 to-pink-500',
            competencies: ['Threat Detection', 'Incident Response', 'Risk Assessment', 'Compliance', 'Communication']
        },
        {
            id: 'ux-designer',
            title: 'Senior UX Designer',
            icon: <Palette className="h-8 w-8" />,
            description: 'Design inclusive mobile apps for diverse Rwandan users',
            difficulty: 'Intermediate',
            duration: '10 hours',
            color: 'purple',
            gradient: 'from-purple-500 to-pink-500',
            competencies: ['User Research', 'Design Thinking', 'Prototyping', 'Accessibility', 'Cultural Sensitivity']
        }
    ];

    // Auto-scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [conversationHistory]);

    // Periodic status updates during active simulation
    useEffect(() => {
        let interval;
        if (simulationState === 'active' && simulationId) {
            interval = setInterval(async () => {
                try {
                    const response = await fetch('/api/simulator/master', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            action: 'get_status',
                            simulationId
                        })
                    });
                    const data = await response.json();
                    if (data.success) {
                        setSimulationStatus(data.status);
                    }
                } catch (error) {
                    console.error('Status update error:', error);
                }
            }, 30000); // Update every 30 seconds
        }
        return () => clearInterval(interval);
    }, [simulationState, simulationId]);

    const startSimulation = async (roleType) => {
        setIsProcessing(true);
        toast.info("🤖 Ace is preparing your simulation...");

        try {
            const response = await fetch('/api/simulator/master', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'start_simulation',
                    roleType: roleType.id,
                    difficulty: 'intermediate',
                    userProfile: {
                        level: 'intermediate',
                        experience: '2-5 years',
                        location: 'Kigali, Rwanda'
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.simulation) {
                setCurrentSimulation(roleType);
                setSimulationId(data.simulation.simulationId);
                setSimulationState('active');

                // Add initial response to conversation
                setConversationHistory([{
                    type: 'agent',
                    content: data.simulation.initialResponse?.responseText || "Welcome to your simulation! Let's begin your challenge.",
                    timestamp: new Date().toISOString(),
                    state: data.simulation.initialResponse?.updatedState || { budget: 10000, time: 480, step: 1 },
                    isStakeholderMessage: data.simulation.initialResponse?.isStakeholderMessage || false
                }]);

                toast.success("🚀 Simulation started! Ace is ready to guide you.");
            } else {
                // Fallback to demo mode if API fails
                console.warn('API failed, starting demo simulation');
                startDemoSimulation(roleType);
            }
        } catch (error) {
            console.error('Simulation start error:', error);
            toast.error("API unavailable. Starting demo simulation...");
            startDemoSimulation(roleType);
        } finally {
            setIsProcessing(false);
        }
    };

    const startDemoSimulation = (roleType) => {
        const demoId = `demo_${Date.now()}`;
        setCurrentSimulation(roleType);
        setSimulationId(demoId);
        setSimulationState('active');

        const demoScenarios = {
            'cloud-architect': {
                content: "Welcome to your Cloud Architecture simulation! You're the lead architect for RwandaPay, a growing fintech startup. Your mission: Design a scalable cloud infrastructure that can handle 50,000+ daily transactions while maintaining 99.9% uptime and complying with Rwandan data protection regulations. You have a budget of $15,000 and 8 hours to complete this challenge.",
                state: { budget: 15000, time: 480, step: 1, systemReliability: 95, stakeholderSatisfaction: 80 }
            },
            'devops-engineer': {
                content: "Welcome to your DevOps Engineering simulation! You're joining KigaliMarket, Rwanda's fastest-growing e-commerce platform. Your challenge: Implement a comprehensive CI/CD pipeline that enables zero-downtime deployments while supporting both mobile and web platforms. You have a budget of $12,000 and 6 hours to transform their manual deployment process.",
                state: { budget: 12000, time: 360, step: 1, deploymentFrequency: 1, leadTime: 720, mttr: 240 }
            },
            'cybersecurity-analyst': {
                content: "Welcome to your Cybersecurity simulation! You're the lead security analyst at Bank of Kigali Digital Services. URGENT: Suspicious network activity has been detected, and there are indicators of a potential data breach. You must quickly assess the situation, contain the threat, and ensure compliance with BNR regulations. You have a budget of $8,000 and 4 hours to respond.",
                state: { budget: 8000, time: 240, step: 1, threatLevel: 7, systemsAffected: 3, dataAtRisk: 50000 }
            },
            'ux-designer': {
                content: "Welcome to your UX Design simulation! You're the senior UX designer for Urwego Bank's digital inclusion initiative. Your mission: Design an inclusive mobile banking app that serves both urban professionals and rural farmers in Rwanda. The app must support feature phones, work offline, and be accessible in Kinyarwanda, English, and French. You have a budget of $10,000 and 10 hours.",
                state: { budget: 10000, time: 600, step: 1, userSatisfaction: 70, accessibilityScore: 60, culturalRelevance: 75 }
            }
        };

        const scenario = demoScenarios[roleType.id] || demoScenarios['cloud-architect'];

        setConversationHistory([{
            type: 'agent',
            content: scenario.content,
            timestamp: new Date().toISOString(),
            state: scenario.state,
            isStakeholderMessage: false
        }]);
    };

    const sendUserAction = async () => {
        if (!userInput.trim() || isProcessing) return;

        const userMessage = userInput.trim();
        setUserInput('');
        setIsProcessing(true);

        // Add user message to conversation
        const newUserMessage = {
            type: 'user',
            content: userMessage,
            timestamp: new Date().toISOString()
        };
        setConversationHistory(prev => [...prev, newUserMessage]);

        // Check if this is a demo simulation
        if (simulationId?.startsWith('demo_')) {
            handleDemoAction(userMessage);
            return;
        }

        try {
            const response = await fetch('/api/simulator/master', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'execute_action',
                    simulationId,
                    userAction: userMessage,
                    currentState: simulationStatus?.currentState || {}
                })
            });

            const data = await response.json();

            if (data.success) {
                const agentResponse = {
                    type: 'agent',
                    content: data.response.responseText,
                    timestamp: new Date().toISOString(),
                    state: data.response.updatedState,
                    isStakeholderMessage: data.response.isStakeholderMessage,
                    isSimulationOver: data.response.isSimulationOver,
                    finalArtifact: data.response.finalArtifact
                };

                setConversationHistory(prev => [...prev, agentResponse]);

                // Check if simulation is complete
                if (data.response.isSimulationOver) {
                    await handleSimulationComplete();
                }
            } else {
                throw new Error(data.message || 'Failed to process action');
            }
        } catch (error) {
            console.error('Action processing error:', error);
            // Fallback to demo mode if API fails
            handleDemoAction(userMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDemoAction = (userMessage) => {
        // Simulate AI response for demo mode
        setTimeout(() => {
            const demoResponses = [
                "Excellent decision! Your approach shows strong technical understanding. Let's move to the next challenge...",
                "Good thinking! However, consider the budget implications. You have $2,000 less to work with now.",
                "Interesting approach! This will improve system reliability but may impact performance. How do you plan to address this?",
                "Great choice! Your stakeholders are impressed with your solution. Time to tackle the next phase.",
                "Smart move! This demonstrates your understanding of Rwanda's infrastructure challenges."
            ];

            const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)];
            const currentState = conversationHistory[conversationHistory.length - 2]?.state || { budget: 10000, time: 480, step: 1 };

            // Update state for demo
            const newState = {
                ...currentState,
                budget: Math.max(0, currentState.budget - Math.floor(Math.random() * 2000) - 500),
                time: Math.max(0, currentState.time - Math.floor(Math.random() * 30) - 15),
                step: currentState.step + 1
            };

            const agentResponse = {
                type: 'agent',
                content: randomResponse,
                timestamp: new Date().toISOString(),
                state: newState,
                isStakeholderMessage: Math.random() > 0.7, // 30% chance of stakeholder message
                isSimulationOver: newState.step >= 8 || newState.budget <= 0 || newState.time <= 0
            };

            setConversationHistory(prev => [...prev, agentResponse]);

            if (agentResponse.isSimulationOver) {
                setTimeout(() => {
                    setFinalReport({
                        simulationId,
                        report: {
                            overallScore: Math.floor(Math.random() * 30) + 70,
                            competencyScores: {
                                technical: Math.floor(Math.random() * 20) + 75,
                                problemSolving: Math.floor(Math.random() * 25) + 70,
                                communication: Math.floor(Math.random() * 15) + 80
                            },
                            strengths: ["Strong technical foundation", "Good decision-making under pressure"],
                            improvements: ["Consider cost implications more carefully", "Enhance stakeholder communication"]
                        }
                    });
                    setSimulationState('completed');
                    toast.success("🎉 Demo simulation completed!");
                }, 1000);
            }

            setIsProcessing(false);
        }, 1500); // Simulate processing time
    };

    const handleSimulationComplete = async () => {
        try {
            const response = await fetch('/api/simulator/master', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'end_simulation',
                    simulationId
                })
            });

            const data = await response.json();

            if (data.success) {
                setFinalReport(data.report);
                setSimulationState('completed');
                toast.success("🎉 Simulation completed! Your performance report is ready.");
            }
        } catch (error) {
            console.error('Simulation completion error:', error);
            toast.error("Failed to generate final report.");
        }
    };

    const resetSimulation = () => {
        setSimulationState('selection');
        setCurrentSimulation(null);
        setSimulationId(null);
        setConversationHistory([]);
        setSimulationStatus(null);
        setFinalReport(null);
        setUserInput('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendUserAction();
        }
    };

    // Role Selection View
    if (simulationState === 'selection') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-6xl animate-pulse">
                                    🎯
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                            </div>
                        </div>
                        <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                            Enhanced AI Simulation
                        </h1>
                        <p className="text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
                            Experience realistic job simulations powered by advanced AI agents. Master skills through immersive scenarios designed for Rwanda's tech industry.
                        </p>
                        <div className="flex justify-center gap-4 mb-8">
                            <Badge variant="outline" className="border-green-500 text-green-400 text-lg px-6 py-3">
                                <Brain className="h-5 w-5 mr-2" />
                                AI-Powered Scenarios
                            </Badge>
                            <Badge variant="outline" className="border-blue-500 text-blue-400 text-lg px-6 py-3">
                                <Target className="h-5 w-5 mr-2" />
                                Real-World Challenges
                            </Badge>
                            <Badge variant="outline" className="border-purple-500 text-purple-400 text-lg px-6 py-3">
                                <Trophy className="h-5 w-5 mr-2" />
                                Portfolio Artifacts
                            </Badge>
                        </div>
                    </div>

                    {/* Role Selection Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {roleTypes.map((role) => (
                            <Card
                                key={role.id}
                                className="bg-gray-800 border-gray-700 hover:border-gray-500 transition-all duration-300 group hover:scale-105 hover:shadow-2xl"
                            >
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-4 rounded-full bg-gradient-to-r ${role.gradient} group-hover:scale-110 transition-transform`}>
                                            {role.icon}
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className={`border-${role.color}-500 text-${role.color}-400 mb-2`}>
                                                {role.difficulty}
                                            </Badge>
                                            <div className="text-sm text-gray-400 flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {role.duration}
                                            </div>
                                        </div>
                                    </div>
                                    <CardTitle className="text-2xl text-white mb-2">{role.title}</CardTitle>
                                    <p className="text-gray-300 mb-4">{role.description}</p>

                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-semibold text-white mb-2">Key Competencies:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {role.competencies.map((comp, index) => (
                                                    <Badge key={index} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                                                        {comp}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Button
                                        onClick={() => startSimulation(role)}
                                        disabled={isProcessing}
                                        className={`w-full bg-gradient-to-r ${role.gradient} hover:opacity-90 text-white font-semibold py-3`}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Activity className="h-5 w-5 mr-2 animate-spin" />
                                                Starting Simulation...
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
                </div>
            </div>
        );
    }

    // Active Simulation View
    if (simulationState === 'active') {
        const currentState = conversationHistory[conversationHistory.length - 1]?.state;

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Simulation Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-full bg-gradient-to-r ${currentSimulation.gradient}`}>
                                {currentSimulation.icon}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">{currentSimulation.title}</h1>
                                <p className="text-gray-400">AI-Powered Simulation with Ace</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {currentState && (
                                <>
                                    <Badge variant="outline" className="border-green-500 text-green-400 text-lg px-4 py-2">
                                        <DollarSign className="h-4 w-4 mr-2" />
                                        ${currentState.budget || 0}
                                    </Badge>
                                    <Badge variant="outline" className="border-blue-500 text-blue-400 text-lg px-4 py-2">
                                        <Timer className="h-4 w-4 mr-2" />
                                        {currentState.time || 0}min
                                    </Badge>
                                    <Badge variant="outline" className="border-purple-500 text-purple-400 text-lg px-4 py-2">
                                        Step {currentState.step || 1}
                                    </Badge>
                                </>
                            )}
                            <Button
                                onClick={resetSimulation}
                                variant="outline"
                                className="border-gray-600 hover:border-red-500"
                            >
                                End Simulation
                            </Button>
                        </div>
                    </div>

                    {/* Chat Interface */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Main Chat Area */}
                        <div className="lg:col-span-3">
                            <Card className="bg-gray-800 border-gray-700 h-[600px] flex flex-col">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-white">
                                        <MessageSquare className="h-5 w-5" />
                                        Simulation Chat with Ace
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col">
                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                                        {conversationHistory.map((message, index) => (
                                            <div
                                                key={index}
                                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] p-4 rounded-lg ${message.type === 'user'
                                                        ? 'bg-blue-600 text-white'
                                                        : message.type === 'system'
                                                            ? 'bg-red-600 text-white'
                                                            : message.isStakeholderMessage
                                                                ? 'bg-orange-600 text-white border-l-4 border-orange-400'
                                                                : 'bg-gray-700 text-white'
                                                        }`}
                                                >
                                                    {message.type === 'agent' && message.isStakeholderMessage && (
                                                        <div className="flex items-center gap-2 mb-2 text-orange-200">
                                                            <Users className="h-4 w-4" />
                                                            <span className="text-sm font-semibold">Stakeholder Message</span>
                                                        </div>
                                                    )}
                                                    <p className="whitespace-pre-wrap">{message.content}</p>
                                                    <div className="text-xs opacity-70 mt-2">
                                                        {new Date(message.timestamp).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={chatEndRef} />
                                    </div>

                                    {/* Input Area */}
                                    <div className="flex gap-2">
                                        <Textarea
                                            value={userInput}
                                            onChange={(e) => setUserInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Describe your action or decision..."
                                            className="flex-1 bg-gray-900 border-gray-600 text-white resize-none"
                                            rows={3}
                                            disabled={isProcessing}
                                        />
                                        <Button
                                            onClick={sendUserAction}
                                            disabled={!userInput.trim() || isProcessing}
                                            className="bg-blue-600 hover:bg-blue-700"
                                        >
                                            {isProcessing ? (
                                                <Activity className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <Send className="h-5 w-5" />
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Current State */}
                            {currentState && (
                                <Card className="bg-gray-800 border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-white text-lg">Current State</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Budget:</span>
                                            <span className="text-green-400 font-semibold">${currentState.budget || 0}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Time Left:</span>
                                            <span className="text-blue-400 font-semibold">{currentState.time || 0} min</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-400">Current Step:</span>
                                            <span className="text-purple-400 font-semibold">{currentState.step || 1}</span>
                                        </div>
                                        {Object.entries(currentState).map(([key, value]) => {
                                            if (['budget', 'time', 'step'].includes(key)) return null;
                                            return (
                                                <div key={key} className="flex justify-between items-center">
                                                    <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                                                    <span className="text-yellow-400 font-semibold">{value}</span>
                                                </div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            )}

                            {/* Competencies */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg">Key Competencies</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {currentSimulation.competencies.map((comp, index) => (
                                            <Badge key={index} variant="outline" className="border-gray-600 text-gray-300 w-full justify-start">
                                                <CheckCircle className="h-3 w-3 mr-2" />
                                                {comp}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Tips */}
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <CardTitle className="text-white text-lg flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-yellow-400" />
                                        Tips
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2 text-sm text-gray-300">
                                        <li>• Be specific in your actions</li>
                                        <li>• Consider budget and time constraints</li>
                                        <li>• Think about stakeholder impact</li>
                                        <li>• Ask questions when uncertain</li>
                                        <li>• Document your decisions</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Completed Simulation View
    if (simulationState === 'completed' && finalReport) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
                <div className="max-w-6xl mx-auto">
                    {/* Completion Header */}
                    <div className="text-center mb-12">
                        <div className="flex justify-center mb-6">
                            <div className={`w-32 h-32 rounded-full bg-gradient-to-r ${currentSimulation.gradient} flex items-center justify-center text-6xl relative`}>
                                <Trophy className="h-16 w-16 text-white" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-5 w-5 text-white" />
                                </div>
                            </div>
                        </div>
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                            Simulation Complete!
                        </h1>
                        <p className="text-xl text-gray-300 mb-6">
                            {currentSimulation.title} - Performance Analysis by Ace
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4 mb-12">
                        <Button
                            onClick={resetSimulation}
                            variant="outline"
                            size="lg"
                            className="border-gray-600 hover:border-blue-500"
                        >
                            <RotateCcw className="h-5 w-5 mr-2" />
                            Try Another Simulation
                        </Button>
                        <Button
                            onClick={() => startSimulation(currentSimulation)}
                            size="lg"
                            className={`bg-gradient-to-r ${currentSimulation.gradient} hover:opacity-90`}
                        >
                            <Play className="h-5 w-5 mr-2" />
                            Retry This Simulation
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="border-green-600 hover:border-green-500"
                        >
                            <Download className="h-5 w-5 mr-2" />
                            Download Report
                        </Button>
                    </div>

                    {/* Performance Report */}
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-white">
                                <FileText className="h-6 w-6 text-blue-400" />
                                Comprehensive Performance Report
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-600">
                                    <h3 className="text-xl font-semibold text-white mb-4">Simulation Summary</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-blue-400 mb-1">
                                                {conversationHistory.length}
                                            </div>
                                            <div className="text-gray-400">Total Actions</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-green-400 mb-1">
                                                {Math.round((Date.now() - new Date(conversationHistory[0]?.timestamp).getTime()) / 60000)}
                                            </div>
                                            <div className="text-gray-400">Minutes Spent</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-purple-400 mb-1">
                                                {currentSimulation.difficulty}
                                            </div>
                                            <div className="text-gray-400">Difficulty Level</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <p className="text-lg text-gray-300 mb-4">
                                        Your detailed performance report is being generated by our AI system.
                                        This comprehensive analysis will include:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-2 text-gray-300">
                                                <CheckCircle className="h-4 w-4 text-green-400" />
                                                Overall performance score and breakdown
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-300">
                                                <CheckCircle className="h-4 w-4 text-green-400" />
                                                Competency-based evaluation
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-300">
                                                <CheckCircle className="h-4 w-4 text-green-400" />
                                                Strengths and improvement areas
                                            </li>
                                        </ul>
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-2 text-gray-300">
                                                <CheckCircle className="h-4 w-4 text-green-400" />
                                                Rwanda job market readiness assessment
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-300">
                                                <CheckCircle className="h-4 w-4 text-green-400" />
                                                Personalized learning recommendations
                                            </li>
                                            <li className="flex items-center gap-2 text-gray-300">
                                                <CheckCircle className="h-4 w-4 text-green-400" />
                                                Portfolio artifact for your career
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return null;
}
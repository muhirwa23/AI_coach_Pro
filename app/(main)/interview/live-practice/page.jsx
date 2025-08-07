"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Mic,
    Volume2,
    VolumeX,
    Square,
    User,
    Bot,
    Camera,
    CameraOff,
    Brain,
    Target,
    Clock,
    Star,
    Zap,
    Trophy,
    MessageCircle,
    Sparkles,
    Headphones,
    Video,
    ArrowLeft,
    ArrowRight
} from "lucide-react";
import { toast } from "sonner";

export default function LiveInterviewPractice() {
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [responses, setResponses] = useState([]);
    const [interviewScore, setInterviewScore] = useState(0);
    const [isVideoEnabled, setIsVideoEnabled] = useState(false);
    const [selectedInterviewType, setSelectedInterviewType] = useState("technical");
    const [sessionStarted, setSessionStarted] = useState(false);
    const [practiceMode, setPracticeMode] = useState("guided");

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const videoRef = useRef(null);

    const interviewTypes = {
        "technical": {
            name: "Technical Interview",
            icon: "💻",
            description: "Code challenges, system design, and technical problem-solving",
            difficulty: "Advanced",
            duration: "45-60 min",
            color: "blue",
            gradient: "from-blue-500 to-cyan-500"
        },
        "behavioral": {
            name: "Behavioral Interview",
            icon: "🧠",
            description: "Leadership, teamwork, and situational questions",
            difficulty: "Intermediate",
            duration: "30-45 min",
            color: "green",
            gradient: "from-green-500 to-emerald-500"
        },
        "product": {
            name: "Product Interview",
            icon: "🚀",
            description: "Product strategy, user experience, and market analysis",
            difficulty: "Advanced",
            duration: "45-60 min",
            color: "purple",
            gradient: "from-purple-500 to-pink-500"
        },
        "leadership": {
            name: "Leadership Interview",
            icon: "👑",
            description: "Management style, team building, and strategic thinking",
            difficulty: "Expert",
            duration: "60+ min",
            color: "orange",
            gradient: "from-orange-500 to-red-500"
        }
    };

    const questionSets = {
        technical: [
            {
                question: "Walk me through how you would design a scalable web application from scratch.",
                type: "system-design",
                expectedDuration: 300,
                tips: "Cover architecture, database design, scalability, and security considerations"
            },
            {
                question: "Explain the difference between SQL and NoSQL databases. When would you use each?",
                type: "technical-knowledge",
                expectedDuration: 180,
                tips: "Provide specific examples and use cases for both database types"
            },
            {
                question: "How do you approach debugging a performance issue in production?",
                type: "problem-solving",
                expectedDuration: 240,
                tips: "Mention monitoring tools, systematic approach, and prevention strategies"
            }
        ],
        behavioral: [
            {
                question: "Tell me about a time when you had to work with a difficult team member.",
                type: "teamwork",
                expectedDuration: 180,
                tips: "Use the STAR method: Situation, Task, Action, Result"
            },
            {
                question: "Describe a project where you had to learn something completely new.",
                type: "adaptability",
                expectedDuration: 150,
                tips: "Show your learning process and how you applied new knowledge"
            },
            {
                question: "How do you handle tight deadlines and competing priorities?",
                type: "time-management",
                expectedDuration: 120,
                tips: "Discuss prioritization frameworks and stress management techniques"
            }
        ],
        product: [
            {
                question: "How would you improve the user experience of a mobile banking app?",
                type: "product-design",
                expectedDuration: 300,
                tips: "Consider user research, pain points, accessibility, and metrics"
            },
            {
                question: "Walk me through how you would launch a new feature.",
                type: "product-strategy",
                expectedDuration: 240,
                tips: "Cover market research, MVP, testing, rollout strategy, and success metrics"
            }
        ],
        leadership: [
            {
                question: "How do you motivate a team during challenging times?",
                type: "team-leadership",
                expectedDuration: 180,
                tips: "Share specific strategies and real examples of team motivation"
            },
            {
                question: "Describe your approach to giving constructive feedback.",
                type: "management",
                expectedDuration: 150,
                tips: "Discuss feedback frameworks and how you ensure growth-oriented conversations"
            }
        ]
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: isVideoEnabled
            });

            if (isVideoEnabled && videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                await processResponse();
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            toast.success("Recording started - answer the question!");
        } catch (error) {
            toast.error("Could not access microphone");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);

            // Stop all tracks
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        }
    };

    const processResponse = async () => {
        // Simulate AI processing
        toast.info("🤖 AI is analyzing your response...");

        // Mock AI analysis
        setTimeout(() => {
            const mockFeedback = {
                score: Math.floor(Math.random() * 30) + 70, // 70-100
                strengths: ["Clear communication", "Structured thinking", "Good examples", "Confident delivery"],
                improvements: ["Add more specific metrics", "Provide deeper technical details", "Include edge cases"],
                transcription: "Mock transcription of user response with detailed analysis...",
                aiResponse: generateAIResponse(),
                confidence: Math.floor(Math.random() * 20) + 80,
                clarity: Math.floor(Math.random() * 25) + 75,
                relevance: Math.floor(Math.random() * 20) + 80
            };

            const currentQuestions = questionSets[selectedInterviewType];
            setResponses(prev => [...prev, {
                question: currentQuestions[currentQuestion].question,
                userResponse: mockFeedback.transcription,
                aiAnalysis: mockFeedback,
                timestamp: new Date()
            }]);

            setInterviewScore(prev => Math.round((prev + mockFeedback.score) / 2));
            toast.success(`✨ Analysis complete! Score: ${mockFeedback.score}%`);
        }, 2000);
    };

    const generateAIResponse = () => {
        const interviewType = interviewTypes[selectedInterviewType];
        const responses = {
            technical: [
                "Great approach! Can you walk me through how you'd handle database scaling as user load increases?",
                "Interesting solution. How would you ensure security and data privacy in this architecture?",
                "That's a solid foundation. What monitoring and alerting would you implement?",
                "Good thinking! How would you optimize this for mobile users with limited bandwidth?"
            ],
            behavioral: [
                "That's a great example. What would you do differently if you faced a similar situation again?",
                "I appreciate the detail. How did this experience change your approach to teamwork?",
                "Excellent use of the STAR method. Can you tell me about the long-term impact of your actions?",
                "That shows good leadership. How do you typically build trust with new team members?"
            ],
            product: [
                "Interesting perspective. How would you measure the success of these improvements?",
                "Good user-centric thinking. What data would you need to validate these assumptions?",
                "That's a comprehensive approach. How would you prioritize these features?",
                "Great insights! How would you handle potential technical constraints?"
            ],
            leadership: [
                "That's a thoughtful approach. How do you adapt your leadership style for different team members?",
                "Excellent example. What metrics do you use to measure team health and productivity?",
                "Good strategy. How do you balance individual growth with team objectives?",
                "That shows emotional intelligence. How do you handle your own stress as a leader?"
            ]
        };
        
        const typeResponses = responses[selectedInterviewType] || responses.technical;
        return typeResponses[Math.floor(Math.random() * typeResponses.length)];
    };

    const nextQuestion = () => {
        const currentQuestions = questionSets[selectedInterviewType];
        if (currentQuestion < currentQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            toast.success("🎉 Interview session completed! Check your detailed feedback below.");
        }
    };

    const startSession = () => {
        setSessionStarted(true);
        setCurrentQuestion(0);
        setResponses([]);
        setInterviewScore(0);
        toast.success(`🚀 Starting ${interviewTypes[selectedInterviewType].name} practice session!`);
    };

    const resetSession = () => {
        setSessionStarted(false);
        setCurrentQuestion(0);
        setResponses([]);
        setInterviewScore(0);
        setIsRecording(false);
        setIsVideoEnabled(false);
    };

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 0.8;
            speechSynthesis.speak(utterance);
            setIsPlaying(true);

            utterance.onend = () => setIsPlaying(false);
        }
    };

    if (!sessionStarted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-6xl animate-pulse">
                                    🎤
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                            </div>
                        </div>
                        <h1 className="text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
                            AI Interview Studio
                        </h1>
                        <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
                            Practice with our advanced AI interviewer and get real-time feedback to ace your next interview
                        </p>
                        <div className="flex justify-center gap-4 mb-8">
                            <Badge variant="outline" className="border-green-500 text-green-400 text-lg px-6 py-3">
                                <Brain className="h-5 w-5 mr-2" />
                                AI-Powered Analysis
                            </Badge>
                            <Badge variant="outline" className="border-blue-500 text-blue-400 text-lg px-6 py-3">
                                <Target className="h-5 w-5 mr-2" />
                                Real-time Feedback
                            </Badge>
                            <Badge variant="outline" className="border-purple-500 text-purple-400 text-lg px-6 py-3">
                                <Trophy className="h-5 w-5 mr-2" />
                                Performance Scoring
                            </Badge>
                        </div>
                    </div>

                    {/* Practice Mode Selection */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-white mb-8">Choose Your Practice Mode</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            <Card 
                                className={`bg-gray-800 border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer group ${
                                    practiceMode === 'guided' ? 'border-blue-500 bg-blue-900/20' : ''
                                }`}
                                onClick={() => setPracticeMode('guided')}
                            >
                                <CardContent className="p-8 text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Headphones className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Guided Practice</h3>
                                    <p className="text-gray-300 mb-4">Step-by-step interview practice with AI guidance and tips</p>
                                    <div className="flex justify-center gap-2">
                                        <Badge variant="secondary" className="bg-blue-900/30 text-blue-300">Beginner Friendly</Badge>
                                        <Badge variant="secondary" className="bg-green-900/30 text-green-300">Structured</Badge>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card 
                                className={`bg-gray-800 border-gray-700 hover:border-purple-500 transition-all duration-300 cursor-pointer group ${
                                    practiceMode === 'simulation' ? 'border-purple-500 bg-purple-900/20' : ''
                                }`}
                                onClick={() => setPracticeMode('simulation')}
                            >
                                <CardContent className="p-8 text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Video className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">Live Simulation</h3>
                                    <p className="text-gray-300 mb-4">Realistic interview simulation with dynamic AI responses</p>
                                    <div className="flex justify-center gap-2">
                                        <Badge variant="secondary" className="bg-purple-900/30 text-purple-300">Advanced</Badge>
                                        <Badge variant="secondary" className="bg-orange-900/30 text-orange-300">Realistic</Badge>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Interview Type Selection */}
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold text-center text-white mb-8">Select Interview Type</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {Object.entries(interviewTypes).map(([key, type]) => (
                                <Card 
                                    key={key}
                                    className={`bg-gray-800 border-gray-700 hover:border-gray-500 transition-all duration-300 group hover:scale-105 cursor-pointer ${
                                        selectedInterviewType === key ? `border-${type.color}-500 bg-${type.color}-900/20` : ''
                                    }`}
                                    onClick={() => setSelectedInterviewType(key)}
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className={`p-4 rounded-full bg-gradient-to-r ${type.gradient} group-hover:scale-110 transition-transform text-2xl`}>
                                                {type.icon}
                                            </div>
                                            <Badge 
                                                variant="outline" 
                                                className={`border-${type.color}-500 text-${type.color}-400`}
                                            >
                                                {type.difficulty}
                                            </Badge>
                                        </div>
                                        <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">
                                            {type.name}
                                        </CardTitle>
                                        <p className="text-gray-400 text-sm">{type.description}</p>
                                    </CardHeader>
                                    
                                    <CardContent>
                                        <div className="flex items-center justify-between text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {type.duration}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <MessageCircle className="h-4 w-4" />
                                                {questionSets[key]?.length || 0} questions
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Start Session Button */}
                    <div className="text-center">
                        <Button 
                            onClick={startSession}
                            size="lg"
                            className={`bg-gradient-to-r ${interviewTypes[selectedInterviewType].gradient} hover:opacity-90 transition-opacity text-xl px-12 py-6 rounded-full shadow-2xl`}
                        >
                            <Zap className="mr-3 h-6 w-6" />
                            Start {interviewTypes[selectedInterviewType].name}
                            <Star className="ml-3 h-6 w-6" />
                        </Button>
                        <p className="text-gray-400 mt-4">
                            {practiceMode === 'guided' ? 'Get step-by-step guidance' : 'Experience realistic interview simulation'}
                        </p>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border-blue-700">
                            <CardContent className="p-8 text-center">
                                <Brain className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-3">AI-Powered Analysis</h3>
                                <p className="text-gray-300">Advanced AI analyzes your responses for content, clarity, and confidence</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-700">
                            <CardContent className="p-8 text-center">
                                <Target className="h-16 w-16 text-green-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-3">Personalized Feedback</h3>
                                <p className="text-gray-300">Get detailed feedback on strengths and areas for improvement</p>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-700">
                            <CardContent className="p-8 text-center">
                                <Trophy className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-white mb-3">Performance Tracking</h3>
                                <p className="text-gray-300">Track your progress and see improvement over multiple sessions</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-full bg-gradient-to-r ${interviewTypes[selectedInterviewType].gradient}`}>
                            <span className="text-3xl">{interviewTypes[selectedInterviewType].icon}</span>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">{interviewTypes[selectedInterviewType].name}</h1>
                            <p className="text-gray-400">
                                Question {currentQuestion + 1} of {questionSets[selectedInterviewType]?.length || 0}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Badge variant="outline" className="border-blue-500 text-blue-400 text-lg px-4 py-2">
                            <Clock className="h-4 w-4 mr-2" />
                            {interviewTypes[selectedInterviewType].duration}
                        </Badge>
                        <Button onClick={resetSession} variant="outline" className="border-gray-600 hover:border-red-500">
                            End Session
                        </Button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Interview Progress</span>
                        <span className="text-sm text-gray-400">
                            {Math.round(((currentQuestion + 1) / (questionSets[selectedInterviewType]?.length || 1)) * 100)}%
                        </span>
                    </div>
                    <Progress 
                        value={((currentQuestion + 1) / (questionSets[selectedInterviewType]?.length || 1)) * 100} 
                        className="h-3 bg-gray-800"
                    />
                </div>

                {/* Current Question Card */}
                <Card className="bg-gray-800 border-gray-700 shadow-2xl mb-8">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <CardTitle className="flex items-center gap-3 text-white">
                                <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500">
                                    <Bot className="h-6 w-6 text-white" />
                                </div>
                                AI Interviewer
                                <Badge variant="outline" className="border-green-500 text-green-400 ml-2">
                                    LIVE
                                </Badge>
                            </CardTitle>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => speakText(questionSets[selectedInterviewType][currentQuestion].question)}
                                    disabled={isPlaying}
                                    className="border-gray-600 hover:border-blue-500"
                                >
                                    {isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                                    {isPlaying ? "Speaking..." : "🔊 Listen"}
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Question Display */}
                            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-600">
                                <div className="flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0">
                                        <MessageCircle className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xl font-medium text-white mb-4 leading-relaxed">
                                            "{questionSets[selectedInterviewType][currentQuestion].question}"
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm">
                                            <div className="flex items-center gap-2 text-blue-400">
                                                <Clock className="h-4 w-4" />
                                                Expected: {Math.floor(questionSets[selectedInterviewType][currentQuestion].expectedDuration / 60)}m {questionSets[selectedInterviewType][currentQuestion].expectedDuration % 60}s
                                            </div>
                                            <div className="flex items-center gap-2 text-green-400">
                                                <Target className="h-4 w-4" />
                                                {questionSets[selectedInterviewType][currentQuestion].type}
                                            </div>
                                        </div>
                                        <div className="mt-3 p-3 bg-blue-900/20 rounded-lg border-l-4 border-blue-400">
                                            <p className="text-sm text-blue-300">
                                                💡 <strong>Tip:</strong> {questionSets[selectedInterviewType][currentQuestion].tips}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Video Preview */}
                            {isVideoEnabled && (
                                <div className="relative bg-gray-900 rounded-xl overflow-hidden">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        muted
                                        className="w-full max-w-lg mx-auto rounded-lg"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <Badge variant="destructive" className="bg-red-600 text-white animate-pulse">
                                            🔴 RECORDING
                                        </Badge>
                                    </div>
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3">
                                            <p className="text-white text-sm text-center">
                                                Video recording enabled - maintain eye contact with camera
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Recording Controls */}
                            <div className="flex justify-center gap-4">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                                    className="border-gray-600 hover:border-purple-500 hover:bg-purple-900/20"
                                >
                                    {isVideoEnabled ? <CameraOff className="h-5 w-5 mr-2" /> : <Camera className="h-5 w-5 mr-2" />}
                                    {isVideoEnabled ? "Disable Video" : "Enable Video"}
                                </Button>

                                {!isRecording ? (
                                    <Button
                                        size="lg"
                                        onClick={startRecording}
                                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-3 text-lg shadow-lg"
                                    >
                                        <Mic className="h-6 w-6 mr-3" />
                                        Start Recording Answer
                                        <Sparkles className="h-5 w-5 ml-3" />
                                    </Button>
                                ) : (
                                    <Button
                                        size="lg"
                                        onClick={stopRecording}
                                        className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-8 py-3 text-lg"
                                    >
                                        <Square className="h-6 w-6 mr-3" />
                                        Stop & Analyze
                                    </Button>
                                )}
                            </div>

                            {/* Recording Status */}
                            {isRecording && (
                                <div className="text-center space-y-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-red-400 font-medium text-lg">
                                            Recording in progress... Speak clearly and confidently!
                                        </span>
                                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                                    </div>
                                    <Progress value={75} className="max-w-md mx-auto h-2" />
                                    <p className="text-gray-400 text-sm">
                                        AI is listening and will provide detailed feedback when you finish
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Dashboard */}
                {responses.length > 0 && (
                    <Card className="bg-gray-800 border-gray-700 shadow-2xl mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-white">
                                <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                                    <Brain className="h-6 w-6 text-white" />
                                </div>
                                AI Performance Analysis
                                <Badge variant="outline" className="border-purple-500 text-purple-400 ml-2">
                                    Real-time
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {/* Overall Score */}
                                <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-600">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-white">Overall Interview Score</h3>
                                        <div className="flex items-center gap-3">
                                            <Progress value={interviewScore} className="w-40 h-3" />
                                            <Badge 
                                                variant={interviewScore >= 80 ? "default" : "secondary"}
                                                className={`text-lg px-3 py-1 ${
                                                    interviewScore >= 80 ? 'bg-green-600 text-white' : 
                                                    interviewScore >= 60 ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                                                }`}
                                            >
                                                {interviewScore}%
                                            </Badge>
                                        </div>
                                    </div>
                                    
                                    {/* Performance Metrics */}
                                    {responses.length > 0 && responses[responses.length - 1].aiAnalysis && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-blue-400 mb-1">
                                                    {responses[responses.length - 1].aiAnalysis.confidence}%
                                                </div>
                                                <div className="text-sm text-gray-400">Confidence</div>
                                                <Progress value={responses[responses.length - 1].aiAnalysis.confidence} className="mt-2 h-2" />
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-400 mb-1">
                                                    {responses[responses.length - 1].aiAnalysis.clarity}%
                                                </div>
                                                <div className="text-sm text-gray-400">Clarity</div>
                                                <Progress value={responses[responses.length - 1].aiAnalysis.clarity} className="mt-2 h-2" />
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-purple-400 mb-1">
                                                    {responses[responses.length - 1].aiAnalysis.relevance}%
                                                </div>
                                                <div className="text-sm text-gray-400">Relevance</div>
                                                <Progress value={responses[responses.length - 1].aiAnalysis.relevance} className="mt-2 h-2" />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Individual Response Analysis */}
                                <div className="space-y-4">
                                    {responses.map((response, index) => (
                                        <div key={index} className="bg-gray-900 border border-gray-600 rounded-xl p-6">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0">
                                                    <MessageCircle className="h-5 w-5 text-white" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-3">
                                                        <h4 className="font-semibold text-white">Question {index + 1}</h4>
                                                        <Badge 
                                                            variant="outline" 
                                                            className={`${
                                                                response.aiAnalysis.score >= 80 ? 'border-green-500 text-green-400' :
                                                                response.aiAnalysis.score >= 60 ? 'border-yellow-500 text-yellow-400' :
                                                                'border-red-500 text-red-400'
                                                            }`}
                                                        >
                                                            {response.aiAnalysis.score}%
                                                        </Badge>
                                                    </div>
                                                    <p className="text-gray-300 text-sm mb-4">{response.question}</p>

                                                    {/* User Response */}
                                                    <div className="bg-blue-900/20 border-l-4 border-blue-400 p-4 rounded-lg mb-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <User className="h-4 w-4 text-blue-400" />
                                                            <span className="font-medium text-blue-400">Your Response</span>
                                                        </div>
                                                        <p className="text-gray-300 text-sm">{response.userResponse}</p>
                                                    </div>

                                                    {/* AI Follow-up */}
                                                    <div className="bg-green-900/20 border-l-4 border-green-400 p-4 rounded-lg mb-4">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Bot className="h-4 w-4 text-green-400" />
                                                            <span className="font-medium text-green-400">AI Interviewer Follow-up</span>
                                                        </div>
                                                        <p className="text-gray-300 text-sm">{response.aiAnalysis.aiResponse}</p>
                                                    </div>

                                                    {/* Feedback Grid */}
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="bg-green-900/10 border border-green-700 rounded-lg p-4">
                                                            <h5 className="font-medium text-green-400 mb-2 flex items-center gap-2">
                                                                <Star className="h-4 w-4" />
                                                                Strengths
                                                            </h5>
                                                            <ul className="text-sm space-y-1">
                                                                {response.aiAnalysis.strengths.map((strength, i) => (
                                                                    <li key={i} className="text-gray-300 flex items-start gap-2">
                                                                        <span className="text-green-400 mt-1">•</span>
                                                                        {strength}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                        <div className="bg-orange-900/10 border border-orange-700 rounded-lg p-4">
                                                            <h5 className="font-medium text-orange-400 mb-2 flex items-center gap-2">
                                                                <Target className="h-4 w-4" />
                                                                Areas to Improve
                                                            </h5>
                                                            <ul className="text-sm space-y-1">
                                                                {response.aiAnalysis.improvements.map((improvement, i) => (
                                                                    <li key={i} className="text-gray-300 flex items-start gap-2">
                                                                        <span className="text-orange-400 mt-1">•</span>
                                                                        {improvement}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center mb-8">
                    <Button
                        variant="outline"
                        disabled={currentQuestion === 0}
                        onClick={() => setCurrentQuestion(prev => prev - 1)}
                        className="border-gray-600 hover:border-blue-500 hover:bg-blue-900/20"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Previous Question
                    </Button>

                    <div className="flex gap-3">
                        <Button
                            onClick={nextQuestion}
                            disabled={currentQuestion >= (questionSets[selectedInterviewType]?.length || 0) - 1}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                            {currentQuestion >= (questionSets[selectedInterviewType]?.length || 0) - 1 ? (
                                <>
                                    Complete Interview
                                    <Trophy className="h-4 w-4 ml-2" />
                                </>
                            ) : (
                                <>
                                    Next Question
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Interview Tips */}
                <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-white">
                            <div className="p-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                                <Sparkles className="h-6 w-6 text-white" />
                            </div>
                            Interview Success Tips
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-blue-400 flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5" />
                                    Communication
                                </h4>
                                <ul className="text-sm space-y-2 text-gray-300">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">•</span>
                                        Speak clearly and at a moderate pace
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">•</span>
                                        Use the STAR method for behavioral questions
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">•</span>
                                        Maintain eye contact with the camera
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-400 mt-1">•</span>
                                        Ask clarifying questions when needed
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-semibold text-green-400 flex items-center gap-2">
                                    <Brain className="h-5 w-5" />
                                    Technical Approach
                                </h4>
                                <ul className="text-sm space-y-2 text-gray-300">
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-400 mt-1">•</span>
                                        Think out loud during problem-solving
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-400 mt-1">•</span>
                                        Consider edge cases and scalability
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-400 mt-1">•</span>
                                        Explain your reasoning step by step
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-400 mt-1">•</span>
                                        Discuss trade-offs and alternatives
                                    </li>
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <h4 className="font-semibold text-purple-400 flex items-center gap-2">
                                    <Star className="h-5 w-5" />
                                    Best Practices
                                </h4>
                                <ul className="text-sm space-y-2 text-gray-300">
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-400 mt-1">•</span>
                                        Provide specific examples and metrics
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-400 mt-1">•</span>
                                        Show enthusiasm and genuine interest
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-400 mt-1">•</span>
                                        Demonstrate continuous learning mindset
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-400 mt-1">•</span>
                                        Connect your experience to the role
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
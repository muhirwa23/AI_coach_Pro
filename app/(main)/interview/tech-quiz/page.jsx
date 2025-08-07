"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Code,
  Database,
  Smartphone,
  Cloud,
  Shield,
  Brain,
  Palette,
  Server,
  Globe,
  Zap,
  Trophy,
  Clock,
  Target,
  Star,
  ArrowRight,
  CheckCircle,
  XCircle,
  Mic,
  User,
  Bot
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function TechQuizPage() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [showConversation, setShowConversation] = useState(false);
  const [conversationData, setConversationData] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isConversationLoading, setIsConversationLoading] = useState(false);

  const techRoles = [
    {
      id: "frontend-developer",
      title: "Frontend Developer",
      icon: <Code className="h-8 w-8" />,
      description: "Build user interfaces with React, Vue, Angular",
      skills: ["JavaScript", "React", "CSS", "HTML", "TypeScript"],
      difficulty: "Intermediate",
      questions: 15,
      duration: "20 min",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: "backend-developer",
      title: "Backend Developer",
      icon: <Server className="h-8 w-8" />,
      description: "Design APIs, databases, and server architecture",
      skills: ["Node.js", "Python", "SQL", "APIs", "Docker"],
      difficulty: "Advanced",
      questions: 20,
      duration: "25 min",
      color: "green",
      gradient: "from-green-500 to-emerald-500"
    },
    {
      id: "mobile-developer",
      title: "Mobile Developer",
      icon: <Smartphone className="h-8 w-8" />,
      description: "Create iOS and Android applications",
      skills: ["React Native", "Flutter", "Swift", "Kotlin", "Firebase"],
      difficulty: "Intermediate",
      questions: 18,
      duration: "22 min",
      color: "purple",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: "fullstack-developer",
      title: "Full Stack Developer",
      icon: <Globe className="h-8 w-8" />,
      description: "End-to-end web application development",
      skills: ["JavaScript", "React", "Node.js", "MongoDB", "AWS"],
      difficulty: "Advanced",
      questions: 25,
      duration: "30 min",
      color: "orange",
      gradient: "from-orange-500 to-red-500"
    },
    {
      id: "data-scientist",
      title: "Data Scientist",
      icon: <Brain className="h-8 w-8" />,
      description: "Analyze data and build ML models",
      skills: ["Python", "Machine Learning", "SQL", "Statistics", "TensorFlow"],
      difficulty: "Advanced",
      questions: 20,
      duration: "25 min",
      color: "indigo",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      id: "devops-engineer",
      title: "DevOps Engineer",
      icon: <Cloud className="h-8 w-8" />,
      description: "Manage infrastructure and deployment pipelines",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
      difficulty: "Advanced",
      questions: 22,
      duration: "28 min",
      color: "teal",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity Specialist",
      icon: <Shield className="h-8 w-8" />,
      description: "Protect systems and data from threats",
      skills: ["Network Security", "Penetration Testing", "CISSP", "Ethical Hacking"],
      difficulty: "Expert",
      questions: 25,
      duration: "35 min",
      color: "red",
      gradient: "from-red-500 to-pink-500"
    },
    {
      id: "ui-ux-designer",
      title: "UI/UX Designer",
      icon: <Palette className="h-8 w-8" />,
      description: "Design user experiences and interfaces",
      skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
      difficulty: "Intermediate",
      questions: 15,
      duration: "18 min",
      color: "pink",
      gradient: "from-pink-500 to-rose-500"
    },
    {
      id: "database-admin",
      title: "Database Administrator",
      icon: <Database className="h-8 w-8" />,
      description: "Manage and optimize database systems",
      skills: ["SQL", "PostgreSQL", "MongoDB", "Performance Tuning", "Backup"],
      difficulty: "Advanced",
      questions: 20,
      duration: "25 min",
      color: "yellow",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  const sampleQuestions = {
    "frontend-developer": [
      {
        question: "What is the Virtual DOM in React?",
        options: [
          "A copy of the real DOM kept in memory",
          "A database for storing component state",
          "A CSS framework for styling",
          "A testing library for React"
        ],
        correct: 0,
        explanation: "The Virtual DOM is a JavaScript representation of the real DOM kept in memory and synced with the real DOM."
      },
      {
        question: "Which CSS property is used for responsive design?",
        options: [
          "display: flex",
          "media queries",
          "position: absolute",
          "z-index"
        ],
        correct: 1,
        explanation: "Media queries allow you to apply CSS styles based on device characteristics like screen size."
      },
      {
        question: "What does 'useState' hook return in React?",
        options: [
          "Only the current state value",
          "Only the setter function",
          "An array with state value and setter function",
          "An object with state properties"
        ],
        correct: 2,
        explanation: "useState returns an array where the first element is the current state value and the second is the setter function."
      }
    ],
    "backend-developer": [
      {
        question: "What is REST API?",
        options: [
          "A database management system",
          "An architectural style for web services",
          "A programming language",
          "A cloud computing platform"
        ],
        correct: 1,
        explanation: "REST (Representational State Transfer) is an architectural style for designing web services."
      },
      {
        question: "Which HTTP status code indicates a successful request?",
        options: [
          "404",
          "500",
          "200",
          "301"
        ],
        correct: 2,
        explanation: "HTTP status code 200 indicates that the request was successful."
      }
    ]
  };

  const startQuiz = async (role, useAI = true) => {
    setSelectedRole(role);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setQuizStartTime(Date.now());

    if (useAI) {
      setIsGeneratingQuiz(true);
      toast.info("🤖 Gemini AI is generating personalized questions...");

      try {
        const response = await fetch('/api/quiz/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            role: role.title,
            difficulty: role.difficulty.toLowerCase(),
            count: Math.min(role.questions, 15) // Limit for better UX
          })
        });

        const data = await response.json();

        if (data.success && data.questions) {
          setCurrentQuiz(data.questions);
          toast.success(`🎯 Generated ${data.questions.length} AI-powered questions!`);
        } else {
          throw new Error(data.message || 'Failed to generate questions');
        }
      } catch (error) {
        console.error('Quiz generation error:', error);
        toast.error("Using sample questions instead");
        setCurrentQuiz(sampleQuestions[role.id] || sampleQuestions["frontend-developer"]);
      } finally {
        setIsGeneratingQuiz(false);
      }
    } else {
      setCurrentQuiz(sampleQuestions[role.id] || sampleQuestions["frontend-developer"]);
      toast.success(`Starting ${role.title} quiz!`);
    }
  };

  const handleAnswer = async (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < currentQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate basic results
      const correctAnswers = currentQuiz.reduce((count, question, index) => {
        return count + (newAnswers[index] === question.correct ? 1 : 0);
      }, 0);

      const score = Math.round((correctAnswers / currentQuiz.length) * 100);
      const timeSpent = Math.round((Date.now() - quizStartTime) / 1000);

      // Get AI analysis
      setIsAnalyzing(true);
      toast.info("🤖 Gemini AI is analyzing your performance...");

      try {
        const response = await fetch('/api/quiz/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'quiz',
            data: {
              answers: newAnswers,
              questions: currentQuiz,
              role: selectedRole.title,
              timeSpent
            }
          })
        });

        const data = await response.json();

        if (data.success && data.analysis) {
          setQuizResults({
            score,
            correctAnswers,
            totalQuestions: currentQuiz.length,
            passed: score >= 70,
            aiAnalysis: data.analysis,
            timeSpent
          });
          toast.success("🎉 AI analysis complete!");
        } else {
          throw new Error('Analysis failed');
        }
      } catch (error) {
        console.error('Analysis error:', error);
        setQuizResults({
          score,
          correctAnswers,
          totalQuestions: currentQuiz.length,
          passed: score >= 70,
          timeSpent
        });
        toast.warning("Basic results shown - AI analysis unavailable");
      } finally {
        setIsAnalyzing(false);
        setShowResults(true);
      }
    }
  };

  const resetQuiz = () => {
    setSelectedRole(null);
    setCurrentQuiz(null);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setQuizResults(null);
    setShowConversation(false);
    setConversationData(null);
    setConversationHistory([]);
    setUserInput("");
  };

  const startLiveConversation = async (role) => {
    setIsConversationLoading(true);
    toast.info("🤖 Starting live conversation with Gemini AI...");

    try {
      const response = await fetch('/api/quiz/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'start',
          role: role.title,
          userProfile: {
            targetRole: role.title,
            experience: 'mid-level' // Could be dynamic
          }
        })
      });

      const data = await response.json();

      if (data.success) {
        setSelectedRole(role);
        setShowConversation(true);
        setConversationData(data);
        setConversationHistory([{
          role: 'interviewer',
          content: data.message,
          timestamp: new Date()
        }]);
        toast.success("🎤 Live interview started!");
      } else {
        throw new Error(data.message || 'Failed to start conversation');
      }
    } catch (error) {
      console.error('Conversation start error:', error);
      toast.error("Failed to start live conversation");
    } finally {
      setIsConversationLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !conversationData) return;

    const userMessage = userInput.trim();
    setUserInput("");

    // Add user message to history
    setConversationHistory(prev => [...prev, {
      role: 'candidate',
      content: userMessage,
      timestamp: new Date()
    }]);

    setIsConversationLoading(true);

    try {
      const response = await fetch('/api/quiz/conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'continue',
          userResponse: userMessage,
          conversationId: conversationData.conversationId,
          role: selectedRole.title
        })
      });

      const data = await response.json();

      if (data.success) {
        setConversationHistory(prev => [...prev, {
          role: 'interviewer',
          content: data.message,
          timestamp: new Date()
        }]);
      } else {
        throw new Error(data.message || 'Failed to continue conversation');
      }
    } catch (error) {
      console.error('Message send error:', error);
      toast.error("Failed to send message");
    } finally {
      setIsConversationLoading(false);
    }
  };

  if (showResults && quizResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gray-800 border-gray-700 shadow-2xl">
            <CardHeader className="text-center">
              <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${selectedRole.gradient} flex items-center justify-center mb-4`}>
                <Trophy className="h-12 w-12 text-white" />
              </div>
              <CardTitle className="text-3xl text-white">Quiz Results</CardTitle>
              <p className="text-gray-300">{selectedRole.title} Assessment</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className={`text-6xl font-bold mb-2 ${quizResults.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {quizResults.score}%
                </div>
                <p className="text-gray-300 text-lg">
                  {quizResults.correctAnswers} out of {quizResults.totalQuestions} correct
                </p>
                <Progress value={quizResults.score} className="mt-4 h-3" />
              </div>

              <div className={`p-6 rounded-lg border-2 ${quizResults.passed ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
                <div className="flex items-center gap-3 mb-3">
                  {quizResults.passed ? (
                    <CheckCircle className="h-8 w-8 text-green-400" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-400" />
                  )}
                  <h3 className="text-xl font-semibold text-white">
                    {quizResults.passed ? 'Congratulations!' : 'Keep Learning!'}
                  </h3>
                </div>
                <p className="text-gray-300">
                  {quizResults.passed
                    ? `Excellent work! You've demonstrated strong knowledge in ${selectedRole.title}. You're ready for interviews in this role.`
                    : `You're on the right track! Review the areas you missed and try again. Practice makes perfect in ${selectedRole.title}.`
                  }
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={resetQuiz} variant="outline" size="lg">
                  Try Another Role
                </Button>
                <Button onClick={() => startQuiz(selectedRole)} size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Live Conversation Interface
  if (showConversation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full bg-gradient-to-r ${selectedRole.gradient}`}>
                {selectedRole.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">🎤 Live AI Interview</h1>
                <p className="text-gray-400">{selectedRole.title} - Powered by Gemini AI</p>
              </div>
            </div>
            <Button onClick={resetQuiz} variant="outline">
              End Interview
            </Button>
          </div>

          <Card className="bg-gray-800 border-gray-700 shadow-2xl mb-6">
            <CardHeader>
              <CardTitle className="text-white">🤖 Live Conversation with AI Interviewer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 border border-gray-600 p-4 rounded-lg min-h-[400px] max-h-[400px] overflow-y-auto mb-4">
                {conversationHistory.map((message, index) => (
                  <div key={index} className={`mb-4 p-3 rounded-lg ${message.role === 'candidate'
                      ? 'bg-blue-900/30 border-l-4 border-blue-400 ml-8'
                      : 'bg-green-900/30 border-l-4 border-green-400 mr-8'
                    }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {message.role === 'candidate' ? (
                        <User className="h-4 w-4 text-blue-400" />
                      ) : (
                        <Bot className="h-4 w-4 text-green-400" />
                      )}
                      <span className="font-medium text-white">
                        {message.role === 'candidate' ? 'You' : 'AI Interviewer'}
                      </span>
                      <span className="text-xs text-gray-400 ml-auto">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{message.content}</p>
                  </div>
                ))}
                {isConversationLoading && (
                  <div className="flex items-center gap-2 text-blue-400 p-3">
                    <Brain className="h-4 w-4 animate-pulse" />
                    <span>AI is thinking...</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your response here..."
                  className="flex-1 p-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  disabled={isConversationLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!userInput.trim() || isConversationLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Send
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border-green-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-400 mb-2">
                  🤖 Live AI Interview Experience
                </h3>
                <p className="text-gray-300 text-sm">
                  Have a natural conversation with Gemini AI. The AI interviewer will ask follow-up questions
                  based on your responses and provide real-time feedback tailored to Rwanda's tech market.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentQuiz) {
    const question = currentQuiz[currentQuestion];
    const progress = ((currentQuestion + 1) / currentQuiz.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-full bg-gradient-to-r ${selectedRole.gradient}`}>
                {selectedRole.icon}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{selectedRole.title} Quiz</h1>
                <p className="text-gray-400">Question {currentQuestion + 1} of {currentQuiz.length}</p>
              </div>
            </div>
            <Button onClick={resetQuiz} variant="outline">
              Exit Quiz
            </Button>
          </div>

          <div className="mb-6">
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="bg-gray-800 border-gray-700 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {question.options.map((option, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  variant="outline"
                  className="w-full text-left justify-start p-4 h-auto border-gray-600 hover:border-blue-500 hover:bg-blue-900/20"
                >
                  <span className="mr-3 text-blue-400 font-semibold">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            🚀 Tech Role Quiz Hub
          </h1>
          <p className="text-xl text-gray-300 mb-6">
            Test your skills and prepare for your dream tech role in Rwanda
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="outline" className="border-green-500 text-green-400 text-lg px-4 py-2">
              🇷🇼 Rwanda Tech Focus
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400 text-lg px-4 py-2">
              🎯 Industry Relevant
            </Badge>
            <Badge variant="outline" className="border-purple-500 text-purple-400 text-lg px-4 py-2">
              ⚡ Instant Results
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techRoles.map((role) => (
            <Card
              key={role.id}
              className="bg-gray-800 border-gray-700 hover:border-gray-500 transition-all duration-300 group hover:scale-105 hover:shadow-2xl"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${role.gradient} group-hover:scale-110 transition-transform`}>
                    {role.icon}
                  </div>
                  <Badge
                    variant="outline"
                    className={`border-${role.color}-500 text-${role.color}-400`}
                  >
                    {role.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-white group-hover:text-blue-400 transition-colors">
                  {role.title}
                </CardTitle>
                <p className="text-gray-400 text-sm">{role.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {role.skills.slice(0, 3).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                      {skill}
                    </Badge>
                  ))}
                  {role.skills.length > 3 && (
                    <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                      +{role.skills.length - 3} more
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {role.questions} questions
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {role.duration}
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => startQuiz(role, true)}
                    disabled={isGeneratingQuiz}
                    className={`w-full bg-gradient-to-r ${role.gradient} hover:opacity-90 transition-opacity group-hover:shadow-lg`}
                  >
                    {isGeneratingQuiz ? (
                      <>
                        <Brain className="mr-2 h-4 w-4 animate-spin" />
                        Generating AI Quiz...
                      </>
                    ) : (
                      <>
                        🤖 AI-Powered Quiz
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => startLiveConversation(role)}
                    disabled={isConversationLoading}
                    variant="outline"
                    className="w-full border-gray-600 hover:border-green-500 hover:bg-green-900/20"
                  >
                    {isConversationLoading ? (
                      <>
                        <Brain className="mr-2 h-4 w-4 animate-spin" />
                        Starting AI Interview...
                      </>
                    ) : (
                      <>
                        🎤 Live AI Interview
                        <Mic className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-700 max-w-4xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <Star className="h-8 w-8 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">Why Take Our Tech Quizzes?</h3>
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="text-center">
                  <Zap className="h-12 w-12 text-blue-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-2">Instant Feedback</h4>
                  <p className="text-gray-300 text-sm">Get immediate results and explanations for each question</p>
                </div>
                <div className="text-center">
                  <Target className="h-12 w-12 text-green-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-2">Industry Relevant</h4>
                  <p className="text-gray-300 text-sm">Questions based on real job requirements in Rwanda</p>
                </div>
                <div className="text-center">
                  <Trophy className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-white mb-2">Skill Assessment</h4>
                  <p className="text-gray-300 text-sm">Identify your strengths and areas for improvement</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
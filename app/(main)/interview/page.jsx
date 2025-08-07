import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket, Target, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function InterviewPrepPage() {
  const assessments = await getAssessments();

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-6xl font-bold gradient-title">
          Interview Preparation
        </h1>
      </div>

      {/* Tech Quiz Feature Card */}
      <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 dark:from-blue-900/20 dark:to-purple-900/20 dark:border-blue-700">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
              <Rocket className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-2xl flex items-center gap-2">
                🚀 Tech Role Quiz Hub
                <Badge variant="outline" className="border-green-500 text-green-600">
                  NEW
                </Badge>
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Test your skills across 9+ tech roles with interactive quizzes designed for Rwanda's job market
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              <span className="text-sm">9+ Tech Roles</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-green-500" />
              <span className="text-sm">Instant Results</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">🇷🇼 Rwanda Focused</span>
            </div>
          </div>
          <Link href="/interview/tech-quiz">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
              Start Tech Quiz
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <StatsCards assessments={assessments} />
        <PerformanceChart assessments={assessments} />
        <QuizList assessments={assessments} />
      </div>
    </div>
  );
}

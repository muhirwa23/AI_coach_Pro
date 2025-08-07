import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building, DollarSign, Clock } from "lucide-react";

// Mock Rwanda job data - in real app, this would come from API
const rwandaJobs = [
  {
    id: 1,
    title: "Full Stack Developer",
    company: "Bank of Kigali",
    location: "Kigali",
    salary: "800,000 - 1,200,000 RWF",
    type: "Full-time",
    skills: ["React", "Node.js", "PostgreSQL"],
    posted: "2 days ago",
    remote: false
  },
  {
    id: 2,
    title: "Mobile App Developer",
    company: "MTN Rwanda",
    location: "Kigali",
    salary: "600,000 - 900,000 RWF",
    type: "Full-time",
    skills: ["Flutter", "React Native", "Firebase"],
    posted: "1 week ago",
    remote: true
  },
  {
    id: 3,
    title: "Data Analyst",
    company: "Zipline",
    location: "Muhanga",
    salary: "500,000 - 750,000 RWF",
    type: "Full-time",
    skills: ["Python", "SQL", "Tableau"],
    posted: "3 days ago",
    remote: false
  },
  {
    id: 4,
    title: "DevOps Engineer",
    company: "SafeMotos",
    location: "Remote (Rwanda)",
    salary: "900,000 - 1,400,000 RWF",
    type: "Full-time",
    skills: ["AWS", "Docker", "Kubernetes"],
    posted: "5 days ago",
    remote: true
  }
];

export default function JobsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-6xl font-bold gradient-title">🇷🇼 Rwanda Tech Jobs</h1>
        <Badge variant="outline" className="text-lg px-4 py-2">
          {rwandaJobs.length} Active Positions
        </Badge>
      </div>

      <div className="grid gap-6">
        {rwandaJobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      {job.company}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {job.posted}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <DollarSign className="h-4 w-4" />
                    {job.salary}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={job.remote ? "default" : "secondary"}>
                      {job.remote ? "Remote" : "On-site"}
                    </Badge>
                    <Badge variant="outline">{job.type}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Required Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    💡 Skills match: 85% based on your profile
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Apply Now
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-2">🎯 AI-Powered Job Matching</h3>
          <p className="text-muted-foreground mb-4">
            Our AI analyzes your skills, location preferences, and career goals to match you with the best opportunities in Rwanda's growing tech sector.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">92%</div>
              <div className="text-sm text-muted-foreground">Match Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">1,200+</div>
              <div className="text-sm text-muted-foreground">Successful Placements</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">30</div>
              <div className="text-sm text-muted-foreground">Partner Companies</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
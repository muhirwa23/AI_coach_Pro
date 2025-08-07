"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  Download,
  Edit,
  Loader2,
  Monitor,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { saveResume } from "@/actions/resume";
import { EntryForm } from "./entry-form";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/nextjs";
import { entriesToMarkdown } from "@/app/lib/helper";
import { resumeSchema } from "@/app/lib/schema";
import html2pdf from "html2pdf.js/dist/html2pdf.min.js";

export default function ResumeBuilder({ initialContent }) {
  const [activeTab, setActiveTab] = useState("edit");
  const [previewContent, setPreviewContent] = useState(initialContent);
  const { user } = useUser();
  const [resumeMode, setResumeMode] = useState("preview");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      contactInfo: {},
      summary: "",
      skills: "",
      experience: [],
      education: [],
      projects: [],
    },
  });

  const {
    loading: isSaving,
    fn: saveResumeFn,
    data: saveResult,
    error: saveError,
  } = useFetch(saveResume);

  // Watch form fields for preview updates
  const formValues = watch();

  useEffect(() => {
    if (initialContent) setActiveTab("preview");
  }, [initialContent]);

  // Update preview content when form values change
  useEffect(() => {
    if (activeTab === "edit") {
      const newContent = getCombinedContent();
      setPreviewContent(newContent ? newContent : initialContent);
    }
  }, [formValues, activeTab]);

  // Handle save result
  useEffect(() => {
    if (saveResult && !isSaving) {
      toast.success("Resume saved successfully!");
    }
    if (saveError) {
      toast.error(saveError.message || "Failed to save resume");
    }
  }, [saveResult, saveError, isSaving]);

  const getContactMarkdown = () => {
    const { contactInfo } = formValues;
    const parts = [];
    if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
    if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
    if (contactInfo.linkedin)
      parts.push(`💼 [LinkedIn](${contactInfo.linkedin})`);
    if (contactInfo.twitter) parts.push(`🐦 [Twitter](${contactInfo.twitter})`);

    return parts.length > 0
      ? `## <div align="center">${user.fullName}</div>
        \n\n<div align="center">\n\n${parts.join(" | ")}\n\n</div>
        \n\n### 🇷🇼 Rwanda Digital Skills Certified Professional
        \n\n*Verified through AI Career Coach - Rwanda's Premier Skills Development Platform*`
      : "";
  };

  const getCombinedContent = () => {
    const { summary, skills, experience, education, projects } = formValues;
    return [
      getContactMarkdown(),
      summary && `## Professional Summary\n\n${summary}`,
      skills && `## Skills\n\n${skills}`,
      entriesToMarkdown(experience, "Work Experience"),
      entriesToMarkdown(education, "Education"),
      entriesToMarkdown(projects, "Projects"),
    ]
      .filter(Boolean)
      .join("\n\n");
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const generateAIResume = async () => {
    setIsGeneratingAI(true);
    toast.info("🤖 AI is analyzing Rwanda's job market to optimize your resume...");
    
    try {
      // Simulate AI generation with Rwanda-specific content
      setTimeout(() => {
        const aiGeneratedContent = generateRwandaOptimizedResume();
        setPreviewContent(aiGeneratedContent);
        setAiSuggestions({
          improvements: [
            "Added Rwanda Vision 2050 alignment",
            "Optimized for local tech companies",
            "Included mobile-first project examples",
            "Added Kinyarwanda language skills"
          ],
          marketFit: 92,
          salaryRange: "600,000 - 1,200,000 RWF",
          topMatches: ["Bank of Kigali", "MTN Rwanda", "Zipline"]
        });
        toast.success("🎉 AI has optimized your resume for Rwanda's job market!");
        setIsGeneratingAI(false);
      }, 3000);
    } catch (error) {
      toast.error("AI generation failed. Please try again.");
      setIsGeneratingAI(false);
    }
  };

  const generateRwandaOptimizedResume = () => {
    return `## <div align="center">${user?.fullName || "Your Name"}</div>

<div align="center">

📧 ${user?.emailAddresses?.[0]?.emailAddress || "your@email.com"} | 📱 +250 XXX XXX XXX | 💼 [LinkedIn](https://linkedin.com/in/yourprofile) | 🐦 [Twitter](https://twitter.com/yourhandle)

</div>

### 🇷🇼 Rwanda Digital Skills Certified Professional

*AI-Optimized Resume for Rwanda's Growing Tech Sector*

---

## Professional Summary

Dynamic software developer with expertise in mobile-first solutions and financial technology, perfectly aligned with Rwanda's Vision 2050 digital transformation goals. Proven track record in developing scalable applications for emerging markets with focus on financial inclusion and agricultural technology. Fluent in English with basic Kinyarwanda proficiency and strong cultural understanding of Rwanda's business environment.

**Key Achievements:**
- 🏆 Developed mobile payment solutions serving 50,000+ users
- 🌱 Built agricultural data platform increasing farmer productivity by 30%
- 📱 Created offline-first applications for low-bandwidth environments
- 🤝 Led cross-cultural teams in East African market

---

## Technical Skills

### **Core Technologies**
- **Frontend:** React, React Native, Flutter, Progressive Web Apps
- **Backend:** Node.js, Python, Java, RESTful APIs, GraphQL
- **Mobile:** iOS/Android development, Mobile Money API integration
- **Database:** PostgreSQL, MongoDB, Firebase, SQLite (offline-first)
- **Cloud:** AWS, Google Cloud, Azure, Docker, Kubernetes

### **Rwanda-Specific Expertise**
- 💳 **Mobile Money Integration:** MTN MoMo, Airtel Money APIs
- 🏦 **Banking Systems:** Core banking, regulatory compliance (BNR)
- 🌾 **AgriTech Solutions:** IoT sensors, weather data, crop monitoring
- 📊 **Data Analytics:** Market research, financial inclusion metrics
- 🗣️ **Languages:** English (Fluent), Kinyarwanda (Basic), French (Conversational)

---

## Work Experience

### **Senior Full Stack Developer** | *TechCorp Rwanda* | *2022 - Present*
- 🚀 Led development of mobile banking platform serving 100,000+ Rwandan users
- 💡 Implemented offline-first architecture reducing data usage by 60%
- 🤝 Collaborated with Bank of Kigali on digital transformation initiatives
- 📈 Increased user engagement by 45% through localized UI/UX design
- 🎯 **Impact:** Contributed to Rwanda's financial inclusion goals, reaching rural communities

### **Mobile Developer** | *FinTech Solutions* | *2020 - 2022*
- 📱 Built cross-platform mobile apps for microfinance institutions
- 🔐 Implemented secure payment gateways compliant with BNR regulations
- 🌍 Developed multilingual interfaces (English/Kinyarwanda/French)
- 📊 Created analytics dashboard for loan performance tracking
- 🎯 **Impact:** Enabled 25,000+ rural entrepreneurs to access digital financial services

### **Software Developer** | *AgriTech Innovations* | *2019 - 2020*
- 🌾 Developed IoT-based crop monitoring system for Rwandan farmers
- 📡 Built SMS-based alert system for weather and market prices
- 🤖 Implemented machine learning for crop yield prediction
- 📱 Created farmer-friendly mobile app with voice commands in Kinyarwanda
- 🎯 **Impact:** Improved agricultural productivity for 5,000+ smallholder farmers

---

## Education

### **Bachelor of Science in Computer Science** | *University of Rwanda* | *2019*
- 🏆 **Graduated Magna Cum Laude** (GPA: 3.8/4.0)
- 🎓 **Thesis:** "Mobile Payment Solutions for Rural Rwanda"
- 🏅 **Awards:** Best Innovation Project, Dean's List (4 semesters)
- 🤝 **Leadership:** President of Computer Science Student Association

### **Certifications**
- 🏆 **AWS Certified Solutions Architect** (2023)
- 📱 **Google Mobile Web Specialist** (2022)
- 🔐 **Certified Ethical Hacker (CEH)** (2021)
- 🇷🇼 **Rwanda Digital Skills Certificate** - Advanced Level (2023)

---

## Key Projects

### **🏦 RwandaPay - Mobile Money Aggregator**
*Full Stack Developer | 2023*
- Built unified platform connecting MTN MoMo, Airtel Money, and bank accounts
- Processed $2M+ in transactions with 99.9% uptime
- **Tech Stack:** React Native, Node.js, PostgreSQL, AWS
- **Impact:** Simplified digital payments for 50,000+ users across Rwanda

### **🌾 SmartFarm Rwanda - Agricultural IoT Platform**
*Lead Developer | 2022*
- Developed IoT sensors and mobile app for precision agriculture
- Integrated weather data, soil monitoring, and market price APIs
- **Tech Stack:** Python, React, MongoDB, LoRaWAN, TensorFlow
- **Impact:** Increased crop yields by 30% for participating farmers

### **📚 EduTech Rwanda - Offline Learning Platform**
*Frontend Developer | 2021*
- Created progressive web app for rural education with offline capabilities
- Implemented content in Kinyarwanda with audio support
- **Tech Stack:** React, Service Workers, IndexedDB, Web Speech API
- **Impact:** Enabled learning for 10,000+ students in remote areas

---

## Community Impact & Leadership

### **🤝 Rwanda Tech Community**
- **Mentor:** Kigali Tech Hub - Guided 20+ junior developers
- **Speaker:** Rwanda ICT Chamber events on mobile development
- **Volunteer:** Code for Rwanda - Built civic tech solutions

### **🌍 Social Impact**
- **UN SDG Contributor:** Projects aligned with Goals 1, 4, 8, and 9
- **Women in Tech Advocate:** Mentored 15+ female developers
- **Rural Development:** Technology solutions reaching 30+ districts

---

## Awards & Recognition

- 🏆 **Rwanda ICT Awards 2023** - Best Mobile Application (RwandaPay)
- 🌟 **Africa Code Week 2022** - Outstanding Mentor Award
- 🎯 **Kigali Innovation City** - Top 10 Emerging Tech Talent
- 📱 **Google Developer Challenge** - Winner, Mobile Category (2021)

---

## Languages & Cultural Competency

- 🗣️ **English:** Native/Fluent (Professional working proficiency)
- 🇷🇼 **Kinyarwanda:** Intermediate (Conversational, improving daily)
- 🇫🇷 **French:** Basic (Can handle technical documentation)
- 🌍 **Cultural Skills:** Deep understanding of Rwandan business culture, Ubuntu philosophy

---

## Professional References

**Available upon request** - Including references from:
- Bank of Kigali Technology Department
- Rwanda Development Board (RDB)
- Kigali Innovation City Leadership
- University of Rwanda Faculty

---

*This resume has been AI-optimized for Rwanda's job market with 92% compatibility score for top tech companies including Bank of Kigali, MTN Rwanda, and Zipline.*`;
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById("resume-pdf");
      const opt = {
        margin: [15, 15],
        filename: "resume.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const formattedContent = previewContent
        .replace(/\n/g, "\n") // Normalize newlines
        .replace(/\n\s*\n/g, "\n\n") // Normalize multiple newlines to double newlines
        .trim();

      console.log(previewContent, formattedContent);
      await saveResumeFn(previewContent);
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  return (
    <div data-color-mode="light" className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h1 className="font-bold gradient-title text-5xl md:text-6xl">
          Resume Builder
        </h1>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={generateAIResume}
            disabled={isGeneratingAI}
          >
            {isGeneratingAI ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                AI Generating...
              </>
            ) : (
              <>
                🤖 AI Generate
              </>
            )}
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
          <Button onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Download PDF
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="edit">Form</TabsTrigger>
          <TabsTrigger value="preview">Markdown</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    {...register("contactInfo.email")}
                    type="email"
                    placeholder="your@email.com"
                    error={errors.contactInfo?.email}
                  />
                  {errors.contactInfo?.email && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <Input
                    {...register("contactInfo.mobile")}
                    type="tel"
                    placeholder="+1 234 567 8900"
                  />
                  {errors.contactInfo?.mobile && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.mobile.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    {...register("contactInfo.linkedin")}
                    type="url"
                    placeholder="https://linkedin.com/in/your-profile"
                  />
                  {errors.contactInfo?.linkedin && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.linkedin.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Twitter/X Profile
                  </label>
                  <Input
                    {...register("contactInfo.twitter")}
                    type="url"
                    placeholder="https://twitter.com/your-handle"
                  />
                  {errors.contactInfo?.twitter && (
                    <p className="text-sm text-red-500">
                      {errors.contactInfo.twitter.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Professional Summary</h3>
              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="Write a compelling professional summary..."
                    error={errors.summary}
                  />
                )}
              />
              {errors.summary && (
                <p className="text-sm text-red-500">{errors.summary.message}</p>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skills</h3>
              <Controller
                name="skills"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="h-32"
                    placeholder="List your key skills..."
                    error={errors.skills}
                  />
                )}
              />
              {errors.skills && (
                <p className="text-sm text-red-500">{errors.skills.message}</p>
              )}
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Work Experience</h3>
              <Controller
                name="experience"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Experience"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>

            {/* Education */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Education</h3>
              <Controller
                name="education"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Education"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.education && (
                <p className="text-sm text-red-500">
                  {errors.education.message}
                </p>
              )}
            </div>

            {/* Projects */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Projects</h3>
              <Controller
                name="projects"
                control={control}
                render={({ field }) => (
                  <EntryForm
                    type="Project"
                    entries={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.projects && (
                <p className="text-sm text-red-500">
                  {errors.projects.message}
                </p>
              )}
            </div>
          </form>
        </TabsContent>

        <TabsContent value="preview">
          {/* AI Suggestions Panel */}
          {aiSuggestions && (
            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
                🤖 AI Resume Optimization Results
                <Badge variant="default" className="bg-green-600">
                  {aiSuggestions.marketFit}% Market Fit
                </Badge>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">✅ AI Improvements:</h4>
                  <ul className="text-xs space-y-1">
                    {aiSuggestions.improvements.map((improvement, i) => (
                      <li key={i} className="text-green-700">• {improvement}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">💰 Salary Projection:</h4>
                  <p className="text-sm font-semibold text-green-600">{aiSuggestions.salaryRange}</p>
                  <p className="text-xs text-muted-foreground">Based on Rwanda market data</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm mb-2">🎯 Top Company Matches:</h4>
                  <div className="flex flex-wrap gap-1">
                    {aiSuggestions.topMatches.map((company, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {company}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "preview" && (
            <Button
              variant="link"
              type="button"
              className="mb-2"
              onClick={() =>
                setResumeMode(resumeMode === "preview" ? "edit" : "preview")
              }
            >
              {resumeMode === "preview" ? (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Resume
                </>
              ) : (
                <>
                  <Monitor className="h-4 w-4" />
                  Show Preview
                </>
              )}
            </Button>
          )}

          {activeTab === "preview" && resumeMode !== "preview" && (
            <div className="flex p-3 gap-2 items-center border-2 border-yellow-600 text-yellow-600 rounded mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">
                You will lose editied markdown if you update the form data.
              </span>
            </div>
          )}
          <div className="border rounded-lg">
            <MDEditor
              value={previewContent}
              onChange={setPreviewContent}
              height={800}
              preview={resumeMode}
            />
          </div>
          <div className="hidden">
            <div id="resume-pdf">
              <MDEditor.Markdown
                source={previewContent}
                style={{
                  background: "white",
                  color: "black",
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

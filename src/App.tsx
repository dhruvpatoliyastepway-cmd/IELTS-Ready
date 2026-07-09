import { useState } from "react";
import { ExamDetails, WritingTopic, WritingEvaluation, StudyPlan } from "./types";
import HookScreen from "./components/HookScreen";
import ExamDetailsScreen from "./components/ExamDetailsScreen";
import SnapshotScreen from "./components/SnapshotScreen";
import ProcessingScreen from "./components/ProcessingScreen";
import VerdictScreen from "./components/VerdictScreen";
import Header from "./components/Header";
import { Award, ShieldCheck, Database, Zap, BookOpen } from "lucide-react";

export default function App() {
  const [step, setStep] = useState<"hook" | "exam_details" | "snapshot" | "processing" | "verdict">("hook");
  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);
  const [mcqAnswers, setMcqAnswers] = useState<{ [key: string]: number }>({});
  const [selectedTopic, setSelectedTopic] = useState<WritingTopic | null>(null);
  const [writingResponse, setWritingResponse] = useState("");
  const [voiceTranscript, setVoiceTranscript] = useState<string | undefined>(undefined);
  
  // Assessment outputs
  const [evaluationResult, setEvaluationResult] = useState<WritingEvaluation | null>(null);
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  // STEP NAVIGATION
  const handleStart = () => {
    setStep("exam_details");
  };

  const handleExamDetailsSubmit = (details: ExamDetails) => {
    setExamDetails(details);
    setStep("snapshot");
  };

  const handleSnapshotSubmit = async (
    answers: { [key: string]: number },
    topic: WritingTopic,
    writingText: string,
    transcript?: string
  ) => {
    setMcqAnswers(answers);
    setSelectedTopic(topic);
    setWritingResponse(writingText);
    setVoiceTranscript(transcript);
    setStep("processing");

    // Initiate AI Evaluation in the background
    try {
      const response = await fetch("/api/evaluate-writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ writingText, topic: topic.prompt }),
      });
      if (response.ok) {
        const data = await response.json();
        setEvaluationResult(data);
      } else {
        throw new Error("Writing evaluation failed.");
      }
    } catch (err) {
      console.error(err);
      // Fallback evaluation for premium fail-safe user experience
      setEvaluationResult({
        estimated_band: 6.5,
        strength: "Clear topical argument structure.",
        weakness: "Repetitive conjunction use.",
        feedback: "Your paragraph introduces the topic well. To reach band 7.0+, try substituting simpler verbs with more academic alternatives and vary your sentence structures."
      });
    }
  };

  const handleProcessingComplete = () => {
    setStep("verdict");
  };

  const handleLeadCapturedSubmit = async (name: string, email: string, phone: string) => {
    setIsGeneratingPlan(true);

    // Calculate details for study plan
    const targetBand = examDetails?.targetBand || 7.0;
    
    const g1Correct = mcqAnswers.g1 === 1 ? 1 : 0;
    const v1Correct = mcqAnswers.v1 === 2 ? 1 : 0;
    const mcqCorrectCount = g1Correct + v1Correct;
    
    let mcqBand = 5.5;
    if (mcqCorrectCount === 1) mcqBand = 6.0;
    if (mcqCorrectCount === 2) mcqBand = 6.5;

    const writingBand = evaluationResult?.estimated_band || 6.0;
    const hasVoice = !!voiceTranscript;
    const speakingBand = hasVoice ? (voiceTranscript!.length > 100 ? 7.0 : 6.5) : 0;

    let estimatedCurrentBand = 6.0;
    if (hasVoice) {
      estimatedCurrentBand = (mcqBand * 0.2) + (writingBand * 0.5) + (speakingBand * 0.3);
    } else {
      estimatedCurrentBand = (mcqBand * 0.2) + (writingBand * 0.8);
    }
    estimatedCurrentBand = Math.round(estimatedCurrentBand * 2) / 2;
    estimatedCurrentBand = Math.max(5.0, Math.min(9.0, estimatedCurrentBand));

    const gap = Math.max(0, targetBand - estimatedCurrentBand);
    
    const hasBooked = examDetails?.examDate !== "not_booked";
    let daysRemaining = 999;
    if (hasBooked && examDetails?.examDate) {
      const examDateObj = new Date(examDetails.examDate);
      const currentDateObj = new Date();
      const diffTime = examDateObj.getTime() - currentDateObj.getTime();
      daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          targetBand,
          currentBand: estimatedCurrentBand,
          gap,
          daysRemaining: hasBooked ? daysRemaining : 30,
          strength: evaluationResult?.strength || "Good cohesion",
          weakness: evaluationResult?.weakness || "Limited vocabulary range",
        }),
      });

      if (response.ok) {
        const plan = await response.json();
        setStudyPlan(plan);
      } else {
        throw new Error("Failed to generate plan.");
      }
    } catch (err) {
      console.error(err);
      // Fallback study plan
      setStudyPlan({
        title: "High-Impact IELTS Close-the-Gap Curriculum",
        day1: {
          title: "Day 1: Lexical Resource Upgrades",
          tasks: [
            "Learn 5 high-tier Academic word pairings targeting your weakness.",
            "Incorporate inverted conditional structures in 3 sample paragraphs.",
            "Record a 15-second response and focus purely on fluent phrasing."
          ]
        },
        day2: {
          title: "Day 2: Structural Speed Drills",
          tasks: [
            "Draft a full Task 2 introduction under a 3-minute stopwatch.",
            "Improve cohesion transition signals (e.g. using on the contrary, subsequently).",
            "Evaluate 2 high-scoring sample scripts from the database."
          ]
        },
        day3: {
          title: "Day 3: Target Timed Strategy",
          tasks: [
            "Simulate an official Part 1 speaking session under timed review.",
            "Check for spelling errors and minor grammatical slips in your drafts.",
            "Formulate 3 complex compound sentences using contrasting conjunctions."
          ]
        },
        finalAdvice: "Close monitoring of your paragraph structure will guarantee a band 7.5+ outcome!"
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Helper to determine step tracking labels for Geometric header
  const getStepIndicator = () => {
    switch (step) {
      case "hook":
        return "Step 01 / 06 — Hook";
      case "exam_details":
        return "Step 02 / 06 — Exam Details";
      case "snapshot":
        return "Step 03 / 06 — Snapshot";
      case "processing":
        return "Step 04 / 06 — Analyzing";
      case "verdict":
        return studyPlan 
          ? "Step 06 / 06 — Unlocked Report" 
          : "Step 05 / 06 — Verdict";
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream text-brand-dark flex flex-col font-sans transition-all duration-300">
      
      {/* GEOMETRIC BALANCE MAIN WRAPPER CONTAINER */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[80px_1fr_80px] min-h-[calc(100vh-120px)] border-b border-brand-border">
        
        {/* SIDEBAR LEFT - Vertical rail */}
        <div className="hidden md:flex flex-col items-center justify-center border-r border-brand-border bg-white py-12 select-none">
          <div className="writing-mode-vertical-rl transform rotate-180 uppercase tracking-[0.3em] font-display font-bold text-[10px] text-zinc-400 whitespace-nowrap">
            IELTS READINESS SYSTEM — 2026
          </div>
        </div>

        {/* CENTER CONTENT COLUMN */}
        <div className="flex flex-col bg-brand-cream overflow-y-auto">
          
          {/* HEADER ROW */}
          <div className="flex items-center justify-between border-b border-brand-border bg-white px-6 sm:px-10 py-5">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-brand-orange" id="header-brand-logo" />
              <span className="font-display font-black text-xl tracking-tighter uppercase">
                VERDICT<span className="text-brand-orange">.ai</span>
              </span>
            </div>
            <div className="text-[10px] font-mono font-black text-brand-orange uppercase tracking-wider">
              {getStepIndicator()}
            </div>
          </div>

          {/* DYNAMIC SCREEN CONTENT CONTAINER */}
          <div className="flex-1 py-8 px-4 sm:px-8">
            {step === "hook" && (
              <HookScreen onStart={handleStart} />
            )}
            {step === "exam_details" && (
              <ExamDetailsScreen 
                onNext={handleExamDetailsSubmit} 
                onBack={() => setStep("hook")} 
              />
            )}
            {step === "snapshot" && (
              <SnapshotScreen 
                onComplete={handleSnapshotSubmit} 
                onBack={() => setStep("exam_details")} 
              />
            )}
            {step === "processing" && (
              <ProcessingScreen onComplete={handleProcessingComplete} />
            )}
            {step === "verdict" && examDetails && (
              <VerdictScreen 
                examDetails={examDetails}
                mcqAnswers={mcqAnswers}
                writingEvaluation={evaluationResult}
                voiceTranscript={voiceTranscript}
                onLeadCaptured={handleLeadCapturedSubmit}
                studyPlan={studyPlan}
                isGeneratingPlan={isGeneratingPlan}
              />
            )}
          </div>
        </div>

        {/* SIDEBAR RIGHT - Auxiliary Action Controls */}
        <div className="hidden md:flex flex-col border-l border-brand-border bg-white select-none">
          <div className="flex-1 border-b border-brand-border flex items-center justify-center">
            <span className="font-mono font-bold text-xs text-zinc-500">EN</span>
          </div>
          <div className="flex-1 border-b border-brand-border flex items-center justify-center">
            <div className="writing-mode-vertical-rl transform rotate-180 uppercase tracking-[0.1em] font-display font-bold text-[9px] text-zinc-400 whitespace-nowrap">
              ACCURATE DIAGNOSTIC
            </div>
          </div>
          <div className="flex-1 bg-brand-orange text-white flex items-center justify-center font-display font-black text-lg select-none">
            ?
          </div>
        </div>

      </div>

      {/* FOOTER ROW WITH METRICS */}
      <footer className="bg-brand-dark text-white grid grid-cols-1 sm:grid-cols-3 border-t border-brand-border">
        <div className="p-6 border-r border-zinc-800 flex flex-col justify-center">
          <span className="text-3xl font-display font-light text-brand-orange">3m</span>
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono mt-0.5">
            Average Completion Time
          </span>
        </div>
        <div className="p-6 border-r border-zinc-800 flex flex-col justify-center">
          <span className="text-3xl font-display font-light text-brand-orange">50k+</span>
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono mt-0.5">
            Scripts Evaluated
          </span>
        </div>
        <div className="p-6 flex flex-col justify-center">
          <span className="text-3xl font-display font-light text-brand-orange">±0.5</span>
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono mt-0.5">
            Band Scoring Accuracy
          </span>
        </div>
      </footer>

    </div>
  );
}

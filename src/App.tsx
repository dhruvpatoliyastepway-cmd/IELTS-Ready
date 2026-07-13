import { useState } from "react";
import { ExamDetails } from "./types";
import HookScreen from "./components/HookScreen";
import ExamDetailsScreen from "./components/ExamDetailsScreen";
import SnapshotScreen from "./components/SnapshotScreen";
import ProcessingScreen from "./components/ProcessingScreen";
import VerdictScreen from "./components/VerdictScreen";
import { Award } from "lucide-react";

export default function App() {
  const [step, setStep] = useState<"hook" | "exam_details" | "snapshot" | "processing" | "verdict">("hook");
  const [examDetails, setExamDetails] = useState<ExamDetails | null>(null);
  const [mcqAnswers, setMcqAnswers] = useState<{ [key: string]: number }>({});
  
  // STEP NAVIGATION
  const handleStart = () => {
    setStep("exam_details");
  };

  const handleExamDetailsSubmit = (details: ExamDetails) => {
    setExamDetails(details);
    setStep("snapshot");
  };

  const handleSnapshotSubmit = (answers: { [key: string]: number }) => {
    setMcqAnswers(answers);
    setStep("processing");
  };

  const handleProcessingComplete = () => {
    setStep("verdict");
  };

  const handleRestart = () => {
    setMcqAnswers({});
    setExamDetails(null);
    setStep("hook");
  };

  // Helper to determine step tracking labels for Geometric header
  const getStepIndicator = () => {
    switch (step) {
      case "hook":
        return "Step 01 / 05 — Introduction";
      case "exam_details":
        return "Step 02 / 05 — Exam Target";
      case "snapshot":
        return "Step 03 / 05 — Diagnostic Test";
      case "processing":
        return "Step 04 / 05 — Analysis";
      case "verdict":
        return "Step 05 / 05 — Verdict Report";
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
                onBack={handleRestart} 
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
                onRestart={handleRestart}
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

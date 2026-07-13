import React, { useState } from "react";
import { motion } from "motion/react";
import { ExamDetails, StudyPlan } from "../types";
import { MCQ_QUESTIONS } from "../data";
import { 
  Calendar, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  ArrowRight,
  Info,
  CalendarDays,
  Target,
  FileText,
  BookmarkCheck,
  Award,
  AlertCircle,
  Check,
  X,
  RefreshCw
} from "lucide-react";

interface VerdictScreenProps {
  examDetails: ExamDetails;
  mcqAnswers: { [key: string]: number };
  onRestart: () => void;
}

// Complete combination diagnostic scoring grid
export function calculateIELTSDiagnosticScore(
  mcqAnswers: { [key: string]: number },
  selfRatedLevel: string
) {
  let correctCount = 0;
  const questionsStatus = MCQ_QUESTIONS.map(q => {
    const studentAnswer = mcqAnswers[q.id];
    const isCorrect = studentAnswer === q.correctIndex;
    if (isCorrect) correctCount++;
    return {
      ...q,
      studentAnswer,
      isCorrect
    };
  });

  let estimatedCurrentBand = 6.0;
  
  if (selfRatedLevel === "beginner") {
    const mapping: { [key: number]: number } = {
      6: 7.0,
      5: 6.5,
      4: 6.0,
      3: 5.5,
      2: 5.0,
      1: 4.5,
      0: 4.0
    };
    estimatedCurrentBand = mapping[correctCount];
  } else if (selfRatedLevel === "advanced") {
    const mapping: { [key: number]: number } = {
      6: 9.0,
      5: 8.5,
      4: 7.5,
      3: 6.5,
      2: 6.0,
      1: 5.5,
      0: 5.0
    };
    estimatedCurrentBand = mapping[correctCount];
  } else {
    // Intermediate or Not Sure baseline
    const mapping: { [key: number]: number } = {
      6: 8.0,
      5: 7.5,
      4: 7.0,
      3: 6.0,
      2: 5.5,
      1: 5.0,
      0: 4.5
    };
    estimatedCurrentBand = mapping[correctCount];
  }

  return {
    correctCount,
    estimatedCurrentBand,
    questionsStatus
  };
}

// Client-side precise study plan builder
export function generateStudyPlanClient(
  correctCount: number,
  failedCategories: string[],
  targetBand: number,
  name: string
): StudyPlan {
  let day1Title = "Day 1: Master Grammatical Range (GRA)";
  let day1Tasks = [
    "Study advanced conditional inversions: Practice changing standard 'If governments spend...' structures into cohesive 'Should governments invest...' formats.",
    "Formulate 5 complex-compound sentences using restrictive relative clauses and subjunctive forms.",
    "Execute paragraph parallelism practice to satisfy the GRA criteria for high bands."
  ];

  if (!failedCategories.includes("Grammatical Range & Accuracy (GRA)")) {
    day1Title = "Day 1: Perfect Academic Task Response (TR)";
    day1Tasks = [
      "Deconstruct 3 official IELTS Essay prompts. Brainstorm highly balanced qualified thesis layouts.",
      "Draft introductory lines that explicitly articulate your complete line of argument to the examiner.",
      "Ensure logical division of body paragraphs centered around unique, fully-developed cohesive thoughts."
    ];
  }

  let day2Title = "Day 2: Elevate Lexical Resource (LR)";
  let day2Tasks = [
    "Purge simple nouns or verbs (e.g. 'bad', 'do', 'hurt') and replace with high-register equivalents ('deleterious', 'precipitate', 'jeopardize').",
    "Study formal academic collocations: Draft sentences utilizing 'spark unprecedented growth' or 'unbridled degradation'.",
    "Conduct a rigorous spelling drill of tricky examiner trap-words (e.g., 'accommodate', 'pronunciation')."
  ];

  if (!failedCategories.includes("Lexical Resource (LR)")) {
    day2Title = "Day 2: Coherence and Sentence Links (CC)";
    day2Tasks = [
      "Inject formal contrastive semicolon conjunct structures ('subsequently', 'by contrast', 'nevertheless') across your text drafts.",
      "Create clear structural progression by linking topic sentences back to your central thesis statement.",
      "Review your script cohesiveness: Ensure transition terms are varied rather than repeating the same adverb."
    ];
  }

  let day3Title = "Day 3: High-Stress Time Drill Strategy";
  let day3Tasks = [
    "Draft a full 40-minute Task 2 essay using your custom-designed thesis structure and advanced connectors.",
    "Spend the final 5 minutes scanning specifically for parallel syntax shifts or minor punctuation slips.",
    "Verify your completed drafts against official examiner checksheets to confirm you hit the " + targetBand.toFixed(1) + " threshold."
  ];

  return {
    title: "Your High-Impact 3-Day IELTS Mastery Plan",
    day1: { title: day1Title, tasks: day1Tasks },
    day2: { title: day2Title, tasks: day2Tasks },
    day3: { title: day3Title, tasks: day3Tasks },
    finalAdvice: `Quality always overrides sheer length. Real IELTS examiners heavily penalize redundant paragraphs. Keep your argument structures highly compact, clean, and grammatically flawless to secure Band ${targetBand.toFixed(1)}+.`
  };
}

export default function VerdictScreen({
  examDetails,
  mcqAnswers,
  onRestart
}: VerdictScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // 1. Calculate scores and diagnostic combinations
  const { correctCount, estimatedCurrentBand, questionsStatus } = calculateIELTSDiagnosticScore(
    mcqAnswers,
    examDetails.selfRatedLevel
  );

  const targetBand = examDetails.targetBand;
  const gap = Math.max(0, targetBand - estimatedCurrentBand);

  // Industry estimation: ~30 days of focused study per 0.5 band gap
  const daysNeeded = (gap / 0.5) * 30;

  // 2. Days remaining calculations
  const hasBooked = examDetails.examDate !== "not_booked";
  let daysRemaining = 999;
  if (hasBooked) {
    const examDateObj = new Date(examDetails.examDate);
    const currentDateObj = new Date();
    const diffTime = examDateObj.getTime() - currentDateObj.getTime();
    daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  }

  // 3. Assign Verdict category based on target gap and remaining days
  let verdict: "green" | "yellow" | "red" = "green";
  if (!hasBooked) {
    verdict = gap === 0 ? "green" : "yellow";
  } else {
    if (daysRemaining >= daysNeeded * 1.2) {
      verdict = "green";
    } else if (daysRemaining >= daysNeeded * 0.7) {
      verdict = "yellow";
    } else {
      verdict = "red";
    }
  }

  // Determine failed categories for custom study-plan generation
  const failedCategories = questionsStatus
    .filter(q => !q.isCorrect)
    .map(q => q.category);

  const getVerdictCopy = () => {
    switch (verdict) {
      case "green":
        return {
          title: "You are On Track",
          colorClass: "text-emerald-700 bg-emerald-50 border-emerald-200",
          desc: `Outstanding result! You are currently tracking at Band ${estimatedCurrentBand.toFixed(1)}, and your goal is Band ${targetBand.toFixed(1)}. With ${hasBooked ? `${daysRemaining} days remaining` : "flexible timing"}, you have a clear, safe runway to succeed. Focus on polish, not pressure.`,
          cta: "Claim focused prep roadmap"
        };
      case "yellow":
        return {
          title: "It's Tight — Action Required",
          colorClass: "text-amber-700 bg-amber-50 border-amber-200",
          desc: `Warning. You are currently tracking at Band ${estimatedCurrentBand.toFixed(1)}, but you need Band ${targetBand.toFixed(1)}. With only ${hasBooked ? `${daysRemaining} days remaining` : "limited prep space"}, this is a very tight margin. You must adopt a highly structured prep routine to close the gap.`,
          cta: `Build my ${Math.max(15, Math.ceil(daysNeeded))}-Day Action Plan`
        };
      case "red":
        return {
          title: "Critical Margin — Reschedule Recommended",
          colorClass: "text-rose-700 bg-rose-50 border-rose-200",
          desc: `High Risk. You are currently tracking at Band ${estimatedCurrentBand.toFixed(1)}, and you need Band ${targetBand.toFixed(1)}. Your exam is in just ${daysRemaining} days, but closing a ${gap.toFixed(1)} band gap requires approximately ${daysNeeded} days of intensive study. Rescheduling is highly recommended to protect your exam fees.`,
          cta: "Claim My Safety Reschedule Plan"
        };
    }
  };

  const copy = getVerdictCopy();

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError("Please enter your name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!phone.trim()) {
      setFormError("Please enter your phone number.");
      return;
    }
    setFormError("");
    setIsGenerating(true);

    // Instant deterministic generation with zero AI delay / latency
    setTimeout(() => {
      const plan = generateStudyPlanClient(correctCount, failedCategories, targetBand, name);
      setStudyPlan(plan);
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto py-4 px-4 space-y-8">
      
      {!studyPlan ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-extrabold text-brand-orange uppercase tracking-wider block">
              IELTS Objective Diagnostic Completed
            </span>
            <h3 className="text-3xl font-display font-black text-brand-dark uppercase tracking-tight">
              Diagnostic Verdict
            </h3>
          </div>

          {/* Geometric Circles for Verdict State */}
          <div className="bg-white border border-brand-border rounded-2xl p-6 flex flex-col items-center justify-center space-y-6 shadow-xs">
            <div className="flex gap-6 justify-center items-center">
              {/* GREEN */}
              <div className={`circle flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 transition-all duration-300 ${
                verdict === "green" 
                  ? "bg-emerald-50 border-emerald-500 text-emerald-600 scale-105 shadow-md shadow-emerald-50" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-300 opacity-20"
              }`}>
                <span className="text-2xl font-bold">●</span>
                <span className="text-[10px] font-mono font-extrabold uppercase mt-1">Ready</span>
              </div>

              {/* YELLOW */}
              <div className={`circle flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 transition-all duration-300 ${
                verdict === "yellow" 
                  ? "bg-amber-50 border-amber-500 text-amber-600 scale-105 shadow-md shadow-amber-50" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-300 opacity-20"
              }`}>
                <span className="text-2xl font-bold">▲</span>
                <span className="text-[10px] font-mono font-extrabold uppercase mt-1">Tight</span>
              </div>

              {/* RED */}
              <div className={`circle flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 transition-all duration-300 ${
                verdict === "red" 
                  ? "bg-rose-50 border-rose-500 text-rose-600 scale-105 shadow-md shadow-rose-50" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-300 opacity-20"
              }`}>
                <span className="text-2xl font-bold">✖</span>
                <span className="text-[10px] font-mono font-extrabold uppercase mt-1">Delay</span>
              </div>
            </div>

            {/* Verdict text badge */}
            <div className={`px-4 py-2 rounded-xl border text-xs sm:text-sm font-bold uppercase tracking-wide flex items-center gap-2 ${copy.colorClass}`}>
              {verdict === "green" && <CheckCircle className="w-4 h-4" />}
              {verdict === "yellow" && <AlertTriangle className="w-4 h-4" />}
              {verdict === "red" && <AlertTriangle className="w-4 h-4 animate-bounce" />}
              {copy.title}
            </div>

            {/* Verdict Explanation Copy */}
            <p className="text-sm text-zinc-600 text-center max-w-lg leading-relaxed font-sans">
              {copy.desc}
            </p>
          </div>

          {/* Diagnostic Metric Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-brand-border rounded-xl p-4 flex flex-col justify-center shadow-xs">
              <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">Estimated Score</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-display font-black text-brand-dark">Band {estimatedCurrentBand.toFixed(1)}</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">Score: {correctCount}/6 correct answers.</p>
            </div>

            <div className="bg-white border border-brand-border rounded-xl p-4 flex flex-col justify-center shadow-xs">
              <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">Target vs Gap</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-display font-black text-brand-orange">Band {targetBand.toFixed(1)}</span>
                <span className="text-xs font-bold text-zinc-500">({gap > 0 ? `-${gap.toFixed(1)}` : "Met"})</span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">Goal for {examDetails.reason.toUpperCase()}.</p>
            </div>

            <div className="bg-white border border-brand-border rounded-xl p-4 flex flex-col justify-center shadow-xs">
              <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">Time Required</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-2xl sm:text-3xl font-display font-black text-brand-dark">
                  {hasBooked ? `${daysRemaining} Days` : "Flexi"}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-1">
                {hasBooked ? `Gap demands ~${Math.ceil(daysNeeded)} prep days.` : `We recommend ~${Math.ceil(daysNeeded)} days.`}
              </p>
            </div>
          </div>

          {/* Comprehensive Scientific Scorecard of MCQ Answers */}
          <div className="bg-white border border-brand-border rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div>
                <h4 className="font-display font-black text-brand-dark uppercase tracking-tight text-base">
                  Diagnostic Scorecard
                </h4>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Detailed rubric breakdown of your diagnostic response
                </p>
              </div>
              <span className="px-3 py-1 bg-brand-dark text-white font-mono text-xs font-bold rounded">
                Score: {correctCount} / 6
              </span>
            </div>

            <div className="space-y-5">
              {questionsStatus.map((q, idx) => {
                const optLetterSelected = String.fromCharCode(65 + q.studentAnswer);
                const optLetterCorrect = String.fromCharCode(65 + q.correctIndex);
                
                return (
                  <div key={q.id} className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2.5 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200/50 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-zinc-200 text-zinc-700 font-mono font-bold text-[9px] rounded">
                          Q{idx + 1}
                        </span>
                        <span className="font-bold text-zinc-700 uppercase tracking-tight text-[10px] font-mono">
                          {q.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[9px] font-mono">
                        {q.isCorrect ? (
                          <span className="text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                            <Check className="w-3 h-3" /> Correct
                          </span>
                        ) : (
                          <span className="text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded flex items-center gap-1">
                            <X className="w-3 h-3" /> Incorrect
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="font-medium text-zinc-800 leading-relaxed font-sans italic">
                      "{q.question.substring(0, 150)}{q.question.length > 150 ? "..." : ""}"
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                      <div className="p-2 rounded bg-zinc-100/60 text-zinc-600">
                        Your Choice: <span className="font-bold text-zinc-800">({optLetterSelected}) {q.options[q.studentAnswer]}</span>
                      </div>
                      {!q.isCorrect && (
                        <div className="p-2 rounded bg-emerald-50 text-emerald-800">
                          Correct Answer: <span className="font-bold">({optLetterCorrect}) {q.options[q.correctIndex]}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-white rounded border border-zinc-200/60 leading-relaxed text-zinc-600 text-[11px]">
                      <span className="font-bold text-brand-dark font-display uppercase tracking-wider block text-[9px] mb-1">Examiner Rubric Context:</span>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lead Capture with Lock */}
          <div className="bg-brand-cream border border-brand-border rounded-2xl p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full filter blur-xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="space-y-2 mb-6">
              <h4 className="text-xl font-display font-black text-brand-dark uppercase tracking-tight flex items-center gap-2">
                <Lock className="w-5 h-5 text-brand-orange animate-pulse" id="lock-icon" />
                Unlock Custom Day-by-Day Study Plan
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed font-sans">
                Enter your details to instantly unlock the specialized IELTS 3-day close-the-gap preparation curriculum, targeting your exact weak rubrics identified in the scorecard.
              </p>
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase text-zinc-600 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-400" id="lead-name-icon" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Candidate Name"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-xs transition-all font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono font-bold uppercase text-zinc-600 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" id="lead-email-icon" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-xs transition-all font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono font-bold uppercase text-zinc-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" id="lead-phone-icon" />
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-xs transition-all font-sans"
                />
              </div>

              {formError && (
                <p className="text-xs font-semibold text-rose-600">{formError}</p>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 py-4 bg-brand-orange hover:bg-brand-dark text-white font-display font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
                >
                  {isGenerating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating Curated Plan...
                    </>
                  ) : (
                    <>
                      Get My Custom Study Plan
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={onRestart}
                  className="px-5 py-4 border border-zinc-200 rounded-xl text-zinc-600 hover:bg-zinc-50 font-mono font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" id="btn-re-check" />
                  Restart Check
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      ) : (
        /* INSTANT STUDY PLAN UNLOCKED REPORT */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Unlocked plan hero banner */}
          <div className="bg-brand-dark text-white rounded-2xl p-6 relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/15 rounded-full filter blur-2xl -mr-12 -mt-12" />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-brand-orange text-white text-[9px] font-mono font-bold uppercase rounded">
                  Report Unlocked
                </span>
                <span className="text-[9px] font-mono text-zinc-400">Diagnostic ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-white leading-none">
                {studyPlan.title}
              </h3>
              <p className="text-xs text-zinc-300 max-w-lg leading-relaxed font-sans">
                Prepared specifically for <span className="text-brand-orange font-bold font-mono">{name}</span> to address identified weaknesses under the {failedCategories.length > 0 ? failedCategories.join(", ") : "GRA & LR"} rubrics to reach <span className="font-bold text-white">Band {targetBand.toFixed(1)}</span> from current <span className="font-bold text-zinc-300">Band {estimatedCurrentBand.toFixed(1)}</span>.
              </p>
            </div>
          </div>

          {/* Quick Scorecard Info */}
          <div className="bg-white border border-brand-border rounded-xl p-5 space-y-4 shadow-xs">
            <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">Candidate Diagnostics</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-sans">
              <div className="p-3 bg-zinc-50 rounded-lg text-center border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">GRA Performance</span>
                <span className="text-sm font-bold text-zinc-800">
                  {failedCategories.filter(c => c.includes("GRA") || c.includes("Grammatical")).length === 0 ? "100%" : "Needs Polish"}
                </span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg text-center border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">LR Register</span>
                <span className="text-sm font-bold text-zinc-800">
                  {failedCategories.filter(c => c.includes("LR") || c.includes("Lexical")).length === 0 ? "100%" : "Needs Upgrades"}
                </span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg text-center border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Coherence Range</span>
                <span className="text-sm font-bold text-zinc-800">
                  {failedCategories.filter(c => c.includes("CC") || c.includes("Cohesion")).length === 0 ? "100%" : "Needs Focus"}
                </span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg text-center border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block">Target Goal</span>
                <span className="text-sm font-bold text-brand-orange">Band {targetBand.toFixed(1)}</span>
              </div>
            </div>
          </div>

          {/* Detailed 3-Day Plan Columns */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-brand-orange uppercase tracking-wider">Your High-Yield 3-Day Curriculum</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Day 1 */}
              <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-3 flex flex-col relative">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <span className="text-[10px] font-mono font-bold text-brand-orange uppercase tracking-wide">Day 01</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                </div>
                <h5 className="font-display font-bold text-sm text-brand-dark uppercase leading-tight">
                  {studyPlan.day1.title}
                </h5>
                <ul className="space-y-3 pt-2">
                  {studyPlan.day1.tasks.map((task, idx) => (
                    <li key={idx} className="text-xs text-zinc-600 leading-relaxed flex items-start gap-2 font-sans">
                      <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-zinc-300 text-brand-orange focus:ring-brand-orange shrink-0 cursor-pointer" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Day 2 */}
              <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-3 flex flex-col relative">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <span className="text-[10px] font-mono font-bold text-brand-orange uppercase tracking-wide">Day 02</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                </div>
                <h5 className="font-display font-bold text-sm text-brand-dark uppercase leading-tight">
                  {studyPlan.day2.title}
                </h5>
                <ul className="space-y-3 pt-2">
                  {studyPlan.day2.tasks.map((task, idx) => (
                    <li key={idx} className="text-xs text-zinc-600 leading-relaxed flex items-start gap-2 font-sans">
                      <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-zinc-300 text-brand-orange focus:ring-brand-orange shrink-0 cursor-pointer" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Day 3 */}
              <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-3 flex flex-col relative">
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                  <span className="text-[10px] font-mono font-bold text-brand-orange uppercase tracking-wide">Day 03</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                </div>
                <h5 className="font-display font-bold text-sm text-brand-dark uppercase leading-tight">
                  {studyPlan.day3.title}
                </h5>
                <ul className="space-y-3 pt-2">
                  {studyPlan.day3.tasks.map((task, idx) => (
                    <li key={idx} className="text-xs text-zinc-600 leading-relaxed flex items-start gap-2 font-sans">
                      <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-zinc-300 text-brand-orange focus:ring-brand-orange shrink-0 cursor-pointer" />
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Expert Coach advice block */}
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl space-y-1.5 text-emerald-950 font-sans">
            <span className="text-[9px] font-mono uppercase bg-emerald-100 px-2 py-0.5 rounded text-emerald-800 font-bold tracking-wider inline-block">Coach Advice</span>
            <p className="text-xs font-semibold leading-relaxed">
              "{studyPlan.finalAdvice}"
            </p>
          </div>

          {/* CTA Mastery Box */}
          <div className="bg-brand-orange text-white p-6 sm:p-8 rounded-2xl shadow-md text-center space-y-4">
            <h4 className="text-xl sm:text-2xl font-display font-black uppercase tracking-tight">
              Ready for focused 1-on-1 IELTS success?
            </h4>
            <p className="text-xs text-white/90 max-w-md mx-auto leading-relaxed font-sans">
              Our professional academic coaches assist candidates to close IELTS gaps in less than {Math.max(15, Math.ceil(daysNeeded))} days using examiner checklists. Let's maximize your score together.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <a
                href={`https://wa.me/1234567890?text=Hello%20I've%20completed%20the%20IELTS%20Readiness%20Check.%20My%20Estimated%20Band%20is%20${estimatedCurrentBand.toFixed(1)}%20and%20Target%20is%20${targetBand.toFixed(1)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-brand-dark hover:bg-zinc-900 text-white font-mono font-bold text-xs uppercase tracking-wide rounded-lg transition-all inline-flex items-center justify-center gap-1.5 shadow-sm"
              >
                Chat with IELTS Coach on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono font-bold text-xs uppercase tracking-wide rounded-lg transition-all inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Print Diagnostic Report
              </button>
            </div>
            
            <button 
              type="button"
              onClick={onRestart}
              className="text-xs text-white/75 hover:text-white underline uppercase tracking-wider font-mono pt-2 cursor-pointer inline-block"
            >
              Take diagnostic quiz again
            </button>
          </div>
        </motion.div>
      )}

    </div>
  );
}

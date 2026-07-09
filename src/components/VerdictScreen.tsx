import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExamDetails, WritingEvaluation, StudyPlan } from "../types";
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
  Target
} from "lucide-react";

interface VerdictScreenProps {
  examDetails: ExamDetails;
  mcqAnswers: { [key: string]: number };
  writingEvaluation: WritingEvaluation | null;
  voiceTranscript?: string;
  onLeadCaptured: (name: string, email: string, phone: string) => Promise<void>;
  studyPlan: StudyPlan | null;
  isGeneratingPlan: boolean;
}

export default function VerdictScreen({
  examDetails,
  mcqAnswers,
  writingEvaluation,
  voiceTranscript,
  onLeadCaptured,
  studyPlan,
  isGeneratingPlan
}: VerdictScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [leadFormSubmitted, setLeadFormSubmitted] = useState(false);

  // 1. Calculate MCQ score
  // correct Index: g1 is 1, v1 is 2
  const g1Correct = mcqAnswers.g1 === 1 ? 1 : 0;
  const v1Correct = mcqAnswers.v1 === 2 ? 1 : 0;
  const mcqCorrectCount = g1Correct + v1Correct;
  
  // MCQ rough band mapping
  let mcqBand = 5.5;
  if (mcqCorrectCount === 1) mcqBand = 6.0;
  if (mcqCorrectCount === 2) mcqBand = 6.5;

  // 2. Writing band
  const writingBand = writingEvaluation?.estimated_band || 6.0;

  // 3. Speaking band estimate (if voice transcript provided, otherwise 0 weight)
  const hasVoice = !!voiceTranscript;
  const speakingBand = hasVoice ? (voiceTranscript!.length > 100 ? 7.0 : 6.5) : 0;

  // 4. Weighted Band Calculation
  let estimatedCurrentBand = 6.0;
  if (hasVoice) {
    estimatedCurrentBand = (mcqBand * 0.2) + (writingBand * 0.5) + (speakingBand * 0.3);
  } else {
    estimatedCurrentBand = (mcqBand * 0.2) + (writingBand * 0.8);
  }
  
  // Round to nearest 0.5 band score
  estimatedCurrentBand = Math.round(estimatedCurrentBand * 2) / 2;
  // Ensure bound
  estimatedCurrentBand = Math.max(5.0, Math.min(9.0, estimatedCurrentBand));

  // 5. Gap assessment
  const targetBand = examDetails.targetBand;
  const gap = Math.max(0, targetBand - estimatedCurrentBand);

  // Industry rule of thumb: ~30 days of focused study per 0.5 band gap
  const daysNeeded = (gap / 0.5) * 30;

  // 6. Days remaining calculation
  const hasBooked = examDetails.examDate !== "not_booked";
  let daysRemaining = 999;
  if (hasBooked) {
    const examDateObj = new Date(examDetails.examDate);
    const currentDateObj = new Date();
    const diffTime = examDateObj.getTime() - currentDateObj.getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // 7. Assign Verdict bucket
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

  // Final Action Recommendation text
  const getVerdictCopy = () => {
    switch (verdict) {
      case "green":
        return {
          title: "You're On Track",
          colorClass: "text-emerald-600 bg-emerald-50 border-emerald-200",
          desc: `Based on your diagnostic, you're tracking toward Band ${estimatedCurrentBand.toFixed(1)}, and your target is ${targetBand.toFixed(1)}. You have enough time to seal any gaps. The key now is consistent structural practice, not panic.`,
          cta: "Get focused prep checklist"
        };
      case "yellow":
        return {
          title: "It's Tight — But Doable",
          colorClass: "text-amber-600 bg-amber-50 border-amber-200",
          desc: `You are currently tracking around Band ${estimatedCurrentBand.toFixed(1)}, and you need ${targetBand.toFixed(1)} for your exam. That's a real gap, but closeable if you start focused prep now. Most students in your position who commit to a structured plan hit their target.`,
          cta: `Get my ${Math.max(15, Math.ceil(daysNeeded))} - Day Closing Plan`
        };
      case "red":
        return {
          title: "Reschedule Recommended",
          colorClass: "text-rose-600 bg-rose-50 border-rose-200",
          desc: `Right now you are tracking around Band ${estimatedCurrentBand.toFixed(1)}, and your exam is only ${daysRemaining} days away. Based on typical prep timelines, closing a ${gap.toFixed(1)} band gap in this window isn't realistic — and a low score can delay visa/uni approvals more than a short reschedule. We highly recommend moving your exam date.`,
          cta: "Get my rescheduling + prep plan"
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
      setFormError("Please enter your phone/WhatsApp number.");
      return;
    }
    setFormError("");
    setLeadFormSubmitted(true);
    onLeadCaptured(name, email, phone);
  };

  return (
    <div className="max-w-2xl mx-auto py-4 px-4 space-y-8">
      
      {/* VERDICT SCREEN HERO CONTAINER */}
      {!studyPlan ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-extrabold text-brand-orange uppercase tracking-wider block">
              IELTS Diagnostic Completed
            </span>
            <h3 className="text-3xl font-display font-black text-brand-dark uppercase tracking-tight">
              Diagnostic Verdict
            </h3>
          </div>

          {/* High Contrast Geometric Circle Visuals */}
          <div className="bg-white border border-brand-border rounded-2xl p-6 flex flex-col items-center justify-center space-y-6 shadow-xs">
            <div className="flex gap-6 justify-center items-center">
              {/* GREEN */}
              <div className={`circle flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 transition-all duration-300 ${
                verdict === "green" 
                  ? "bg-emerald-50 border-emerald-500 text-emerald-600 scale-105 shadow-md shadow-emerald-50" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-300 opacity-30"
              }`}>
                <span className="text-2xl font-bold">●</span>
                <span className="text-[10px] font-mono font-extrabold uppercase mt-1">Ready</span>
              </div>

              {/* YELLOW */}
              <div className={`circle flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 transition-all duration-300 ${
                verdict === "yellow" 
                  ? "bg-amber-50 border-amber-500 text-amber-600 scale-105 shadow-md shadow-amber-50" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-300 opacity-30"
              }`}>
                <span className="text-2xl font-bold">▲</span>
                <span className="text-[10px] font-mono font-extrabold uppercase mt-1">Tight</span>
              </div>

              {/* RED */}
              <div className={`circle flex flex-col items-center justify-center w-24 h-24 rounded-full border-2 transition-all duration-300 ${
                verdict === "red" 
                  ? "bg-rose-50 border-rose-500 text-rose-600 scale-105 shadow-md shadow-rose-50" 
                  : "bg-zinc-50 border-zinc-200 text-zinc-300 opacity-30"
              }`}>
                <span className="text-2xl font-bold">✖</span>
                <span className="text-[10px] font-mono font-extrabold uppercase mt-1">Delay</span>
              </div>
            </div>

            {/* Verdict text badge */}
            <div className={`px-4 py-2 rounded-xl border text-sm font-bold uppercase tracking-wide flex items-center gap-2 ${copy.colorClass}`}>
              {verdict === "green" && <CheckCircle className="w-4 h-4" id="verdict-check-icon" />}
              {verdict === "yellow" && <AlertTriangle className="w-4 h-4" id="verdict-warning-icon" />}
              {verdict === "red" && <AlertTriangle className="w-4 h-4 animate-bounce" id="verdict-critical-icon" />}
              {copy.title}
            </div>

            {/* Verdict Explanation Copy */}
            <p className="text-sm text-zinc-600 text-center max-w-lg leading-relaxed">
              {copy.desc}
            </p>
          </div>

          {/* Diagnostic Metric Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white border border-brand-border rounded-xl p-4 flex flex-col justify-center shadow-xs">
              <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">Estimated Level</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-display font-extrabold text-brand-dark">Band {estimatedCurrentBand.toFixed(1)}</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Diagnostic based on writing + MCQs.</p>
            </div>

            <div className="bg-white border border-brand-border rounded-xl p-4 flex flex-col justify-center shadow-xs">
              <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">Target / Gap</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-display font-extrabold text-brand-orange">Band {targetBand.toFixed(1)}</span>
                <span className="text-xs font-semibold text-zinc-500">({gap > 0 ? `-${gap.toFixed(1)}` : "Met"})</span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Requested for {examDetails.reason.toUpperCase()}.</p>
            </div>

            <div className="bg-white border border-brand-border rounded-xl p-4 flex flex-col justify-center shadow-xs">
              <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider block">Time Margin</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-3xl font-display font-extrabold text-brand-dark">
                  {hasBooked ? `${daysRemaining} Days` : "Unbooked"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                {hasBooked ? `Target needs ~${daysNeeded} study days.` : `We recommend ~${daysNeeded} prep days.`}
              </p>
            </div>
          </div>

          {/* Writing Diagnostic Insight Box */}
          {writingEvaluation && (
            <div className="p-4 bg-zinc-800 text-white rounded-xl border border-zinc-700 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-brand-orange text-white text-[9px] font-mono font-bold uppercase rounded">Examiner Feedback</span>
                <h4 className="text-xs font-bold text-zinc-300 font-mono">LEXICAL RESOURCE & COHERENCE</h4>
              </div>
              <p className="text-xs text-zinc-300 italic">
                "{writingEvaluation.feedback}"
              </p>
              <div className="grid grid-cols-2 gap-4 pt-1.5 border-t border-zinc-700/60 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">Strength:</span>
                  <p className="text-zinc-200 mt-0.5">{writingEvaluation.strength}</p>
                </div>
                <div>
                  <span className="text-[10px] text-brand-orange uppercase tracking-wider font-bold">Limit Area:</span>
                  <p className="text-zinc-200 mt-0.5">{writingEvaluation.weakness}</p>
                </div>
              </div>
            </div>
          )}

          {/* Lead Capture form to unlock reports */}
          <div className="bg-brand-cream border border-brand-border rounded-2xl p-6 shadow-xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full filter blur-xl -mr-10 -mt-10 pointer-events-none" />
            
            <div className="space-y-2 mb-6">
              <h4 className="text-xl font-display font-black text-brand-dark uppercase tracking-tight flex items-center gap-2">
                <Lock className="w-5 h-5 text-brand-orange" id="lock-icon" />
                Unlock Your Study Plan & Diagnostic Report
              </h4>
              <p className="text-xs text-zinc-600 leading-relaxed">
                Submit your contact details below to instantly load your personalized 3-day high-impact IELTS prep plan to bridge the <span className="font-bold text-brand-orange">-{gap.toFixed(1)}</span> band gap.
              </p>
            </div>

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-mono font-bold uppercase text-zinc-600 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-400" id="form-user-icon" />
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
                  <label className="text-[11px] font-mono font-bold uppercase text-zinc-600 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-zinc-400" id="form-mail-icon" />
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
                <label className="text-[11px] font-mono font-bold uppercase text-zinc-600 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" id="form-phone-icon" />
                  Phone / WhatsApp Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210 (WhatsApp preferred for instant plan)"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange text-xs transition-all font-sans"
                />
              </div>

              {formError && (
                <p className="text-xs font-semibold text-rose-600 mt-2">{formError}</p>
              )}

              <button
                type="submit"
                disabled={isGeneratingPlan}
                className="w-full py-4 bg-brand-orange hover:bg-brand-dark text-white font-display font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:pointer-events-none mt-2"
              >
                {isGeneratingPlan ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Custom Study Plan...
                  </>
                ) : (
                  <>
                    Get My Full Report & Study Plan
                    <ArrowRight className="w-4 h-4" id="btn-lead-arrow" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      ) : (
        /* STUDY PLAN DELIVERABLE */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header Card */}
          <div className="bg-brand-dark text-white rounded-2xl p-6 relative overflow-hidden shadow-md">
            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-orange/20 rounded-full filter blur-2xl -mr-12 -mt-12" />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-brand-orange text-white text-[10px] font-mono font-bold uppercase rounded">
                  Unlocked Report
                </span>
                <span className="text-[10px] font-mono text-zinc-400">Diagnostic ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-display font-black uppercase tracking-tight text-white leading-none">
                {studyPlan.title}
              </h3>
              <p className="text-xs text-zinc-300 max-w-lg leading-relaxed">
                Prepared specifically for <span className="text-brand-orange font-bold font-mono">{name || "Candidate"}</span> to address identified weaknesses and reach <span className="font-bold text-white">Band {targetBand.toFixed(1)}</span> from current <span className="font-bold text-zinc-300">Band {estimatedCurrentBand.toFixed(1)}</span> in the remaining days.
              </p>
            </div>
          </div>

          {/* Detailed Diagnostic Stats Grid */}
          <div className="bg-white border border-brand-border rounded-xl p-5 space-y-4 shadow-xs">
            <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">Candidate Diagnostic Scorecard</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-zinc-50 rounded-lg text-center border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tight block">Grammar Snap</span>
                <span className="text-base font-bold text-zinc-800">{g1Correct === 1 ? "100%" : "0%"} correct</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg text-center border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tight block">Vocab Register</span>
                <span className="text-base font-bold text-zinc-800">{v1Correct === 1 ? "100%" : "0%"} correct</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg text-center border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tight block">Writing Band</span>
                <span className="text-base font-bold text-zinc-800">Band {writingBand.toFixed(1)}</span>
              </div>
              <div className="p-3 bg-zinc-50 rounded-lg text-center border border-zinc-100">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-tight block">Voice Fluency</span>
                <span className="text-base font-bold text-zinc-800">{hasVoice ? "Band 6.5" : "N/A"}</span>
              </div>
            </div>
          </div>

          {/* The 3-Day Plan Columns */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold text-brand-orange uppercase tracking-wider">Your High-Yield 3-Day Curriculum</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Day 1 */}
              <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between relative">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                    <span className="text-[10px] font-mono font-bold text-brand-orange uppercase tracking-wide">Day 01</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                  </div>
                  <h5 className="font-display font-bold text-sm text-brand-dark uppercase leading-tight">
                    {studyPlan.day1.title}
                  </h5>
                  <ul className="space-y-2.5">
                    {studyPlan.day1.tasks.map((task, idx) => (
                      <li key={idx} className="text-xs text-zinc-600 leading-relaxed flex items-start gap-2">
                        <input type="checkbox" className="w-3.5 h-3.5 mt-0.5 rounded border-zinc-300 text-brand-orange focus:ring-brand-orange shrink-0" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Day 2 */}
              <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between relative">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                    <span className="text-[10px] font-mono font-bold text-brand-orange uppercase tracking-wide">Day 02</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  </div>
                  <h5 className="font-display font-bold text-sm text-brand-dark uppercase leading-tight">
                    {studyPlan.day2.title}
                  </h5>
                  <ul className="space-y-2.5">
                    {studyPlan.day2.tasks.map((task, idx) => (
                      <li key={idx} className="text-xs text-zinc-600 leading-relaxed flex items-start gap-2">
                        <input type="checkbox" className="w-3.5 h-3.5 mt-0.5 rounded border-zinc-300 text-brand-orange focus:ring-brand-orange shrink-0" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Day 3 */}
              <div className="bg-white border border-brand-border rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between relative">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
                    <span className="text-[10px] font-mono font-bold text-brand-orange uppercase tracking-wide">Day 03</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  </div>
                  <h5 className="font-display font-bold text-sm text-brand-dark uppercase leading-tight">
                    {studyPlan.day3.title}
                  </h5>
                  <ul className="space-y-2.5">
                    {studyPlan.day3.tasks.map((task, idx) => (
                      <li key={idx} className="text-xs text-zinc-600 leading-relaxed flex items-start gap-2">
                        <input type="checkbox" className="w-3.5 h-3.5 mt-0.5 rounded border-zinc-300 text-brand-orange focus:ring-brand-orange shrink-0" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Expert Coach Final Advice block */}
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl space-y-1 text-emerald-950">
            <span className="text-[10px] font-mono uppercase bg-emerald-100 px-2 py-0.5 rounded text-emerald-800 font-bold tracking-wider">Coach Recommendation</span>
            <p className="text-xs font-semibold leading-relaxed pt-1 font-sans">
              "{studyPlan.finalAdvice}"
            </p>
          </div>

          {/* Call to action for the paid course or direct booking */}
          <div className="bg-brand-orange text-white p-6 rounded-2xl shadow-md text-center space-y-4">
            <h4 className="text-xl font-display font-black uppercase tracking-tight">
              Ready for targeted 1-on-1 IELTS mastery?
            </h4>
            <p className="text-xs text-white/90 max-w-md mx-auto leading-relaxed">
              We help candidates close score gaps within {Math.max(15, Math.ceil(daysNeeded))} days using simulated IELTS trials and feedback from former examiners. Join our premium course today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="https://wa.me/1234567890?text=I've%20completed%20the%20IELTS%20Readiness%20Check"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 bg-brand-dark hover:bg-zinc-900 text-white font-mono font-bold text-xs uppercase tracking-wide rounded-lg transition-colors inline-flex items-center justify-center gap-1.5"
              >
                Chat on WhatsApp
              </a>
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-mono font-bold text-xs uppercase tracking-wide rounded-lg transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Print Report
              </button>
            </div>
          </div>

        </motion.div>
      )}

    </div>
  );
}

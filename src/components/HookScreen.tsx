import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, ShieldAlert, Timer } from "lucide-react";

interface HookScreenProps {
  onStart: () => void;
}

export default function HookScreen({ onStart }: HookScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.4 }}
      className="max-w-xl mx-auto py-10 px-4"
    >
      <div className="text-center space-y-4 mb-8">
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full uppercase tracking-wider">
          Official Diagnostic Funnel
        </span>
        <h2 className="text-4xl font-display font-extrabold text-zinc-900 tracking-tight leading-tight">
          Booked your IELTS exam? <br />
          <span className="text-indigo-600 bg-indigo-50/50 px-2 rounded-lg">Find out if you're actually ready.</span>
        </h2>
        <p className="text-lg text-zinc-600 max-w-md mx-auto">
          Most students overestimate their band by <span className="font-semibold text-zinc-900">0.5 to 1.0 points</span>. Take this 3-minute check before it is too late to reschedule.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6 shadow-sm space-y-4 mb-8">
        <h3 className="font-display font-bold text-zinc-900 text-base mb-2">What this 3-minute diagnostic covers:</h3>
        
        <div className="space-y-3.5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" id="bullet-icon-1" />
            <div>
              <p className="text-sm font-semibold text-zinc-900">Quick Skill Snapshot</p>
              <p className="text-xs text-zinc-500">Grammar & high-tier Academic Vocabulary checks designed by expert examiners.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" id="bullet-icon-2" />
            <div>
              <p className="text-sm font-semibold text-zinc-900">AI Mini-Writing Assessment</p>
              <p className="text-xs text-zinc-500">Real-time evaluation of a 2-3 line response mapping directly to the Task 2 rubric.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" id="bullet-icon-3" />
            <div>
              <p className="text-sm font-semibold text-zinc-900">Immediate Readiness Verdict</p>
              <p className="text-xs text-zinc-500">Instant tracking score with action recommendation: On Track, Tight, or Reschedule.</p>
            </div>
          </div>
        </div>

        <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/50 flex gap-3 text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" id="alert-icon" />
          <p className="text-xs leading-relaxed text-amber-800">
            <strong>Reschedule Penalty Window:</strong> IELTS centers typically require changes 5 weeks prior. Don't waste your registration fee if you're not scoring in your target band yet.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onStart}
          className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-display font-bold text-base hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl hover:shadow-indigo-100 flex items-center justify-center gap-2 group cursor-pointer"
        >
          Check My Readiness
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" id="cta-arrow" />
        </button>
        <span className="text-xs text-zinc-400 flex items-center gap-1">
          <Timer className="w-3.5 h-3.5" id="timer-icon" />
          Takes 180 seconds • No registration required for diagnostic
        </span>
      </div>
    </motion.div>
  );
}

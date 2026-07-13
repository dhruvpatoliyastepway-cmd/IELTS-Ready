import { motion } from "motion/react";
import { ArrowRight, CheckCircle2, ShieldAlert, Timer, Award, Scale } from "lucide-react";

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
      className="max-w-2xl mx-auto py-10 px-4 space-y-8"
    >
      {/* Visual Header Banner */}
      <div className="text-center space-y-4">
        <span className="px-3.5 py-1.5 bg-brand-orange/10 text-brand-orange text-xs font-mono font-bold rounded-lg uppercase tracking-wider inline-block">
          EXAMINER-LEVEL DIAGNOSTIC TOOL
        </span>
        <h2 className="text-4xl sm:text-5xl font-display font-black text-brand-dark tracking-tight leading-none uppercase">
          Is Your IELTS Score <br />
          <span className="text-brand-orange">At Serious Risk?</span>
        </h2>
        <p className="text-base sm:text-lg text-zinc-600 max-w-xl mx-auto leading-relaxed">
          IELTS registration costs <span className="font-bold text-brand-dark">$220+ USD</span>. Yet, over 64% of candidates fail to reach their target band by just <span className="font-bold text-brand-orange">0.5 points</span> on their first attempt due to hidden structural flaws in their prep.
        </p>
      </div>

      {/* Grid Features */}
      <div className="bg-white rounded-2xl border border-brand-border p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h3 className="font-display font-black text-brand-dark uppercase tracking-wide text-sm mb-1">
            Why General Mock Tests Fail You:
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Most prep sites use superficial scoring. Our diagnostic is strictly engineered around the actual four core assessment pillars that real examiners evaluate.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-orange mt-0.5 shrink-0" id="feat-1" />
            <div>
              <p className="text-xs font-bold text-brand-dark uppercase font-display">Grammatical Range (GRA)</p>
              <p className="text-[11px] text-zinc-500 mt-1">Evaluates your utilization of advanced structures like conditional inversions and perfect parallelism.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-orange mt-0.5 shrink-0" id="feat-2" />
            <div>
              <p className="text-xs font-bold text-brand-dark uppercase font-display">Lexical Resource (LR)</p>
              <p className="text-[11px] text-zinc-500 mt-1">Tests whether your vocabulary features precise high-register academic collocations or repetitive slips.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-orange mt-0.5 shrink-0" id="feat-3" />
            <div>
              <p className="text-xs font-bold text-brand-dark uppercase font-display">Coherence & Cohesion (CC)</p>
              <p className="text-[11px] text-zinc-500 mt-1">Verifies your ability to deploy elegant contrastive connectors rather than basic prepositions.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-brand-orange mt-0.5 shrink-0" id="feat-4" />
            <div>
              <p className="text-xs font-bold text-brand-dark uppercase font-display">Task Response Logic (TR)</p>
              <p className="text-[11px] text-zinc-500 mt-1">Checks if your introduction and thesis layouts meet the strict structure needed for Band 7.5+.</p>
            </div>
          </div>
        </div>

        {/* Reschedule Penalty Warnings */}
        <div className="p-4 bg-rose-50 rounded-xl border border-rose-200/60 flex gap-3 text-rose-950">
          <ShieldAlert className="w-5.5 h-5.5 text-rose-600 shrink-0 mt-0.5" id="alert-banner-icon" />
          <div>
            <p className="text-xs font-bold uppercase font-display tracking-tight text-rose-900">
              The 5-Week Reschedule Rule
            </p>
            <p className="text-[11px] leading-relaxed text-rose-800 mt-0.5">
              British Council and IDP allow you to change or reschedule your test date for free up to 5 weeks before. Take this 3-minute checkup now to save your registration fees if you are not yet scoring in your target band.
            </p>
          </div>
        </div>
      </div>

      {/* Call To Actions */}
      <div className="flex flex-col items-center gap-4">
        <button
          onClick={onStart}
          className="w-full sm:w-auto px-10 py-5 bg-brand-orange hover:bg-brand-dark text-white rounded-xl font-display font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:shadow-brand-orange/20 flex items-center justify-center gap-2.5 group cursor-pointer"
        >
          Verify My Readiness Now
          <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" id="cta-icon-arrow" />
        </button>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1">
            <Timer className="w-3.5 h-3.5 text-brand-orange" id="time-badge" />
            Takes Exactly 180 Seconds
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Scale className="w-3.5 h-3.5 text-brand-orange" id="scale-badge" />
            No Account Needed for Diagnosis
          </span>
        </div>
      </div>
    </motion.div>
  );
}

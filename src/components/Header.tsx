import { Award } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm ring-4 ring-indigo-50/50">
            <Award className="w-5 h-5" id="brand-logo-icon" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-zinc-900 tracking-tight leading-none">
              IELTS Readiness
            </h1>
            <span className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">
              Exam Diagnostic
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-[11px] font-medium text-zinc-600 flex items-center gap-1.5 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
            3-Min Checkup
          </div>
        </div>
      </div>
    </header>
  );
}

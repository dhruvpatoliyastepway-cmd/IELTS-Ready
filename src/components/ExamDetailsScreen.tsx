import { useState } from "react";
import { motion } from "motion/react";
import { ExamDetails } from "../types";
import { Calendar, Compass, HelpCircle, ChevronRight, AlertCircle } from "lucide-react";

interface ExamDetailsScreenProps {
  onNext: (details: ExamDetails) => void;
  onBack: () => void;
}

export default function ExamDetailsScreen({ onNext, onBack }: ExamDetailsScreenProps) {
  const [notBookedYet, setNotBookedYet] = useState(false);
  const [examDate, setExamDate] = useState("");
  const [targetBand, setTargetBand] = useState<number>(7.0);
  const [reason, setReason] = useState("");
  const [selfRatedLevel, setSelfRatedLevel] = useState("");
  const [error, setError] = useState("");

  const handleNext = () => {
    if (!notBookedYet && !examDate) {
      setError("Please select your exam date or check 'Not booked yet'.");
      return;
    }
    if (!reason) {
      setError("Please select the primary reason for your target band.");
      return;
    }
    if (!selfRatedLevel) {
      setError("Please select your current self-rated level.");
      return;
    }

    setError("");
    onNext({
      examDate: notBookedYet ? "not_booked" : examDate,
      targetBand,
      reason,
      selfRatedLevel,
    });
  };

  const bandOptions = Array.from({ length: 8 }, (_, i) => 5.5 + i * 0.5); // 5.5 to 9.0

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-xl mx-auto py-8 px-4"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-display font-bold text-zinc-900 tracking-tight">
          Tell us about your target test
        </h2>
        <p className="text-sm text-zinc-500 mt-1">
          This helps calibrate the timeline and recommendation engine.
        </p>
      </div>

      <div className="space-y-6 bg-white border border-zinc-200/80 rounded-2xl p-6 shadow-sm mb-6">
        {/* Test Date Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-zinc-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-500" id="icon-date" />
            When is your scheduled IELTS test?
          </label>
          <div className="space-y-3">
            <input
              type="date"
              disabled={notBookedYet}
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 bg-zinc-50 disabled:bg-zinc-100 disabled:text-zinc-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors"
            />
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={notBookedYet}
                onChange={(e) => {
                  setNotBookedYet(e.target.checked);
                  if (e.target.checked) setExamDate("");
                }}
                className="w-4.5 h-4.5 text-indigo-600 border-zinc-300 rounded focus:ring-indigo-500"
              />
              <span className="text-xs font-medium text-zinc-600">
                I haven't booked an official test date yet
              </span>
            </label>
          </div>
        </div>

        {/* Target Band Score */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-zinc-800 flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-500" id="icon-band" />
            What is your Target Band Score?
          </label>
          <div className="grid grid-cols-4 gap-2">
            {bandOptions.map((band) => (
              <button
                key={band}
                type="button"
                onClick={() => setTargetBand(band)}
                className={`py-2.5 rounded-xl border text-sm font-bold font-mono transition-all ${
                  targetBand === band
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100"
                    : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                }`}
              >
                {band.toFixed(1)}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-zinc-400 italic">
            Note: Visa or University entries typically demand a minimum score of 6.5 or 7.0.
          </p>
        </div>

        {/* Primary Purpose */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-zinc-800 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-500" id="icon-purpose" />
            What is your primary reason for taking the IELTS?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { id: "visa", label: "Visa / Immigration Requirements" },
              { id: "university", label: "University / Academic Admission" },
              { id: "migration", label: "Permanent Residency (PR)" },
              { id: "job", label: "Professional / Job Qualification" },
              { id: "other", label: "General Assessment / Other" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setReason(opt.id)}
                className={`p-3 rounded-xl border text-xs text-left font-medium transition-colors ${
                  reason === opt.id
                    ? "bg-indigo-50 border-indigo-200 text-indigo-900 font-semibold"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Self Rated Current Level */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-zinc-800">
            How would you rate your current English level?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: "beginner", label: "Beginner" },
              { id: "intermediate", label: "Intermediate" },
              { id: "advanced", label: "Advanced" },
              { id: "not_sure", label: "Not sure" },
            ].map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => setSelfRatedLevel(level.id)}
                className={`py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                  selfRatedLevel === level.id
                    ? "bg-indigo-50 border-indigo-200 text-indigo-900"
                    : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex gap-2.5 text-rose-800 text-xs items-center mb-6">
          <AlertCircle className="w-4 h-4 shrink-0" id="error-alert-icon" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="flex gap-3 justify-between">
        <button
          onClick={onBack}
          className="px-5 py-3 border border-zinc-200 rounded-xl text-zinc-600 font-medium hover:bg-zinc-50 cursor-pointer transition-colors text-sm"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 cursor-pointer shadow-md transition-all flex items-center gap-1.5 text-sm"
        >
          Continue to Quiz
          <ChevronRight className="w-4 h-4" id="btn-details-continue" />
        </button>
      </div>
    </motion.div>
  );
}

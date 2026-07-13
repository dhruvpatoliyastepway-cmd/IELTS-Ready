import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MCQ_QUESTIONS } from "../data";
import { MCQQuestion } from "../types";
import { 
  ChevronRight, 
  ChevronLeft,
  BookOpen, 
  Sparkles, 
  Check,
  AlertCircle
} from "lucide-react";

interface SnapshotScreenProps {
  onComplete: (mcqAnswers: { [key: string]: number }) => void;
  onBack: () => void;
}

export default function SnapshotScreen({ onComplete, onBack }: SnapshotScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});

  const currentQuestion = MCQ_QUESTIONS[currentIndex];

  const handleSelectOption = (optionIdx: number) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: optionIdx
    });
  };

  const handleNext = () => {
    if (currentIndex < MCQ_QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete(answers);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const isCurrentAnswered = answers[currentQuestion.id] !== undefined;

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      {/* Step Progress indicators */}
      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center text-xs text-zinc-500 font-mono">
          <span className="font-bold text-brand-orange uppercase tracking-wider">
            Assessment Section: Part 1
          </span>
          <span className="font-bold">
            Question {currentIndex + 1} of {MCQ_QUESTIONS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-orange transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / MCQ_QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Question Categories Tracked */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {MCQ_QUESTIONS.map((q, idx) => {
            const isCompleted = answers[q.id] !== undefined;
            const isCurrent = idx === currentIndex;
            return (
              <span 
                key={q.id}
                className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded transition-all ${
                  isCurrent 
                    ? "bg-brand-orange text-white font-bold" 
                    : isCompleted 
                      ? "bg-zinc-800 text-zinc-300" 
                      : "bg-zinc-100 text-zinc-400"
                }`}
              >
                Q0{idx + 1}
              </span>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -15 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {/* Rubric Category Highlight Header */}
          <div className="space-y-2">
            <span className="px-2.5 py-1 bg-brand-dark text-white font-mono text-[10px] font-bold rounded uppercase tracking-widest inline-block">
              {currentQuestion.category}
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-black text-brand-dark uppercase tracking-tight leading-tight">
              Test your proficiency level:
            </h3>
          </div>

          {/* Question Box */}
          <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-xs space-y-6">
            <p className="text-sm sm:text-base font-semibold text-zinc-800 leading-relaxed whitespace-pre-wrap font-sans">
              {currentQuestion.question}
            </p>

            {/* Answer Options Grid */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = answers[currentQuestion.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all flex items-start gap-3 group relative cursor-pointer ${
                      isSelected 
                        ? "bg-brand-orange/5 border-brand-orange text-brand-dark ring-2 ring-brand-orange/15" 
                        : "bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-700"
                    }`}
                  >
                    {/* Circle Indicator */}
                    <span className={`w-5 h-5 rounded-md flex items-center justify-center border font-mono text-[10px] shrink-0 mt-0.5 ${
                      isSelected 
                        ? "bg-brand-orange border-brand-orange text-white font-bold" 
                        : "border-zinc-300 text-zinc-400 group-hover:border-zinc-400"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed font-sans">{opt}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-between items-center mt-8">
        <button
          type="button"
          onClick={currentIndex === 0 ? onBack : handlePrev}
          className="px-5 py-3 border border-zinc-200 rounded-xl text-zinc-600 font-bold text-xs uppercase tracking-wide hover:bg-zinc-50 transition-colors cursor-pointer flex items-center gap-1"
        >
          <ChevronLeft className="w-4 h-4" id="prev-nav" />
          Back
        </button>

        <button
          type="button"
          onClick={handleNext}
          disabled={!isCurrentAnswered}
          className="px-6 py-3.5 bg-brand-dark hover:bg-brand-orange text-white rounded-xl font-display font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:pointer-events-none disabled:bg-zinc-300 shadow-md hover:shadow-brand-orange/10"
        >
          {currentIndex === MCQ_QUESTIONS.length - 1 ? (
            <>
              Finish & Analyze
              <Check className="w-4 h-4" id="finish-check" />
            </>
          ) : (
            <>
              Next Question
              <ChevronRight className="w-4 h-4" id="next-arrow" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

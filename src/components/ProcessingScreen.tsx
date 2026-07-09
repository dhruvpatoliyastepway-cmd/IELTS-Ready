import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, ShieldCheck, Sparkles, Database } from "lucide-react";

interface ProcessingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  { icon: Database, text: "Comparing your responses to 50,000+ premium IELTS scripts..." },
  { icon: Sparkles, text: "Running NLP grammar and lexical range evaluation..." },
  { icon: Loader2, text: "Calculating overall performance score and current band level..." },
  { icon: ShieldCheck, text: "Compiling diagnostic verdict and custom recommended timeline..." }
];

export default function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    const completionTimeout = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(completionTimeout);
    };
  }, [onComplete]);

  const IconComponent = STEPS[currentStep].icon;

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center space-y-8 flex flex-col items-center justify-center min-h-[400px]">
      <div className="relative">
        {/* Orbiting dots */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-2 border-dashed border-brand-orange/40 flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-white border border-brand-border flex items-center justify-center shadow-xs">
            <IconComponent className="w-7 h-7 text-brand-orange animate-pulse" id="processing-loader-icon" />
          </div>
        </motion.div>
        
        {/* Pulse rings */}
        <div className="absolute inset-0 -m-2 rounded-full border border-brand-orange/10 animate-ping" />
      </div>

      <div className="space-y-3 max-w-sm">
        <h3 className="font-display font-extrabold text-xl text-brand-dark uppercase tracking-tight">
          Analyzing Your Performance
        </h3>
        
        <div className="h-14 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-medium text-zinc-600 leading-relaxed px-4"
            >
              {STEPS[currentStep].text}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      {/* Modern geometric progress bar */}
      <div className="w-48 h-1 bg-zinc-200 rounded-full overflow-hidden relative">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 4.8, ease: "easeInOut" }}
          className="h-full bg-brand-orange"
        />
      </div>
      
      <span className="text-[10px] text-zinc-400 font-mono tracking-wider uppercase">
        Verdict diagnostic pipeline v1.2
      </span>
    </div>
  );
}

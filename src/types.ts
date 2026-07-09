export interface ExamDetails {
  examDate: string; // YYYY-MM-DD, or "not_booked"
  targetBand: number; // e.g. 5.5, 6.0, ..., 9.0
  reason: string; // e.g. "visa" | "university" | "migration" | "job" | "other"
  selfRatedLevel: string; // e.g. "beginner" | "intermediate" | "advanced" | "not_sure"
}

export interface MCQQuestion {
  id: string;
  type: "grammar" | "vocabulary";
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface WritingTopic {
  id: string;
  prompt: string;
  category: string;
}

export interface WritingEvaluation {
  estimated_band: number;
  strength: string;
  weakness: string;
  feedback: string;
}

export interface StudyPlanDay {
  title: string;
  tasks: string[];
}

export interface StudyPlan {
  title: string;
  day1: StudyPlanDay;
  day2: StudyPlanDay;
  day3: StudyPlanDay;
  finalAdvice: string;
}

export interface LeadInfo {
  name: string;
  email: string;
  phone: string;
}

export interface QuizSessionState {
  step: "hook" | "exam_details" | "snapshot" | "processing" | "verdict" | "lead_capture" | "report";
  examDetails: ExamDetails | null;
  mcqAnswers: { [key: string]: number }; // questionId -> selectedIndex
  writingTopic: WritingTopic | null;
  writingResponse: string;
  evaluationResult: WritingEvaluation | null;
  leadInfo: LeadInfo | null;
  studyPlan: StudyPlan | null;
}

import { MCQQuestion, WritingTopic } from "./types";

export const MCQ_QUESTIONS: MCQQuestion[] = [
  {
    id: "g1",
    type: "grammar",
    question: "Choose the sentence that is grammatically correct and demonstrates a Band 7.5+ academic style for an introduction:",
    options: [
      "If governments spend more money on public transport, citizens would use it more.",
      "Should governments invest more resources in public transit networks, citizens will be encouraged to utilize them.",
      "If governments would invest more money in public transport, citizens will use it more.",
      "Were governments to invest more money in public transit, citizens used it more."
    ],
    correctIndex: 1,
    explanation: "This option uses a high-level grammatical inversion ('Should governments invest...') which elegantly demonstrates a sophisticated 'Grammatical Range and Accuracy' (GRA) structure, typical of Band 7.5+ IELTS writing."
  },
  {
    id: "v1",
    type: "vocabulary",
    question: "Select the vocabulary term that best elevates the register of this statement to a Band 7.5+ standard:\n\n'The ________ consumption of fossil fuels has accelerated global environmental degradation.'",
    options: [
      "very high",
      "bad",
      "unbridled",
      "heavy"
    ],
    correctIndex: 2,
    explanation: "'Unbridled' represents a highly academic, precise lexical item that refers to uncontrolled or unconstrained activity. Using such words demonstrates 'Lexical Resource' (LR) precision and range required for high band scores."
  }
];

export const WRITING_TOPICS: WritingTopic[] = [
  {
    id: "wt1",
    prompt: "Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake, regardless of whether the course is useful to an employer. Discuss both views and give your opinion.",
    category: "Education & Career"
  },
  {
    id: "wt2",
    prompt: "In many countries, the level of juvenile crime is increasing rapidly. What do you believe are the primary causes of this crime, and what practical measures can be taken to reduce it?",
    category: "Crime & Society"
  },
  {
    id: "wt3",
    prompt: "Some people believe that school children should be required to perform unpaid community service in their spare time. To what extent do you agree or disagree with this statement?",
    category: "Youth & Education"
  },
  {
    id: "wt4",
    prompt: "With the rapid advancement of technology, many people think that physical books and newspapers will eventually be completely replaced by digital alternatives. Discuss both views and give your opinion.",
    category: "Technology & Culture"
  },
  {
    id: "wt5",
    prompt: "Human activity has had an increasingly negative impact on global environments. What are the main environmental threats today, and what solutions can you propose at an individual level?",
    category: "Environment & Lifestyle"
  }
];

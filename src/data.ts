import { MCQQuestion } from "./types";

export const MCQ_QUESTIONS: MCQQuestion[] = [
  {
    id: "q1",
    type: "grammar",
    category: "Grammatical Range & Accuracy (GRA)",
    question: "Identify the sentence that represents premium, band-optimized cohesive academic styling for an IELTS Task 2 introduction:",
    options: [
      "If governments spend more money on public transport, citizens would use it more.",
      "Should governments invest more resources in public transit networks, citizens will be encouraged to utilize them.",
      "If governments would invest more money in public transport, citizens will use it more.",
      "Were governments to invest more money in public transit, citizens used it more."
    ],
    correctIndex: 1,
    explanation: "This option uses a high-level grammatical inversion ('Should governments invest...') which elegantly demonstrates a sophisticated conditional structure, typical of Band 7.5+ IELTS writing."
  },
  {
    id: "q2",
    type: "vocabulary",
    category: "Lexical Resource (LR)",
    question: "Select the vocabulary term that best elevates the register of this statement to a Band 7.5+ academic standard:\n\n'The ________ consumption of fossil fuels has accelerated global environmental degradation.'",
    options: [
      "very high",
      "bad",
      "unbridled",
      "heavy"
    ],
    correctIndex: 2,
    explanation: "'Unbridled' represents a highly academic, precise lexical item that refers to uncontrolled or unconstrained activity, satisfying the range required for high band scores."
  },
  {
    id: "q3",
    type: "cohesion",
    category: "Coherence & Cohesion (CC)",
    question: "Which of the following cohesive devices best completes the contrastive argument below while maintaining a formal academic style?\n\n'Many argue that remote learning offers unparalleled flexibility; ________, critics assert that it diminishes the vital social interactions of traditional classrooms.'",
    options: [
      "but anyway",
      "by contrast",
      "on the other hand of things",
      "whereas"
    ],
    correctIndex: 1,
    explanation: "'By contrast' is a high-level contrastive cohesive marker that fits perfectly at the beginning of a semicolon-separated clause, aligning with the CC rubric for Band 7.5+."
  },
  {
    id: "q4",
    type: "task_response",
    category: "Task Response (TR)",
    question: "To score Band 7.5+ in 'Task Response', how should an introduction be structured for an essay prompting: 'Some believe that physical books will be replaced by digital media. To what extent do you agree or disagree?'",
    options: [
      "Paraphrase the prompt and state a clear, direct, and qualified thesis indicating the extent of agreement.",
      "Copy the prompt exactly as written to ensure correct word usage, then say 'I will discuss both sides'.",
      "Write a broad philosophical statement about reading habits without stating your specific viewpoint.",
      "Simply state your personal opinion with personal stories and anecdotes right from the first sentence."
    ],
    correctIndex: 0,
    explanation: "To satisfy the Task Response (TR) rubric, you must present a clear, qualified position throughout. Paraphrasing the prompt and introducing a balanced thesis accomplishes this."
  },
  {
    id: "q5",
    type: "grammar",
    category: "Grammatical Range & Accuracy (GRA)",
    question: "Choose the sentence that demonstrates perfect grammatical parallelism and syntactic complexity suitable for a Band 8.0+ essay:",
    options: [
      "The policy intends to reduce traffic congestion, encouraging cycling, and clean the air.",
      "The policy intends to reduce traffic congestion, encourage cycling, and cleanse the ambient atmosphere.",
      "The policy intends reducing traffic congestion, to encourage cycling, and air cleaning.",
      "The policy intends to reduce traffic congestion, cycle encouragement, and air cleaning."
    ],
    correctIndex: 1,
    explanation: "This option demonstrates parallel infinitive structures ('to [reduce, encourage, cleanse]') and uses high-register vocabulary ('cleanse the ambient atmosphere'), which are critical for high GRA scores."
  },
  {
    id: "q6",
    type: "vocabulary",
    category: "Lexical Resource (LR)",
    question: "Which verb-noun collocation represents the most precise and high-level academic style for an IELTS Task 2 discussion on economic changes?",
    options: [
      "to make a change in the economy",
      "to spark unprecedented economic growth",
      "to do economic progress",
      "to start big economic shifts"
    ],
    correctIndex: 1,
    explanation: "'To spark unprecedented economic growth' uses a highly sophisticated verb-adjective-noun collocation, which is highly valued under the Lexical Resource (LR) rubric for Band 8.0+."
  }
];

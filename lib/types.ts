export type QuestionMode = "quiz" | "solver";
export type AnswerType = "multiple-choice" | "short-text" | "numeric";
export type Topic =
  | "fundamentals"
  | "metric-system"
  | "significant-figures"
  | "dimensional-analysis"
  | "the-mole"
  | "stoichiometry"
  | "molarity-dilutions";

export interface GivenValue {
  value: number;
  unit: string;
  sigfigs?: number;
}

export interface ConversionFactor {
  numerator: string;
  denominator: string;
  numerator_value?: number;
  denominator_value?: number;
}

export interface FinalAnswer {
  value: number;
  unit: string;
  sigfigs: number;
  tolerance_pct: number;
}

export interface QuizContent {
  prompt: string;
  answer_type: AnswerType;
  correct_answer: string | number;
  choices?: string[];
  explanation: string;
}

export interface SolverContent {
  prompt: string;
  given: GivenValue[];
  target_unit: string;
  solution_chain: ConversionFactor[];
  final_answer: FinalAnswer;
  explanation: string;
}

export interface Question {
  id: string;
  topic: Topic;
  subtopic: string;
  mode: QuestionMode;
  difficulty: number;
  content: QuizContent | SolverContent;
  is_sample: boolean;
}

export interface ReviewState {
  user_id: string;
  question_id: string;
  stability: number;
  difficulty: number;
  due: string;
  reps: number;
  lapses: number;
  state: number;
  last_review: string | null;
}

export interface ReviewLog {
  id: string;
  user_id: string;
  question_id: string;
  rating: number;
  state: number;
  due: string;
  reviewed_at: string;
  time_taken_ms: number;
}

export interface TopicInfo {
  id: Topic;
  label: string;
  description: string;
  mode: QuestionMode | "mixed";
  order: number;
  icon: string;
  color: string;
}

export const TOPICS: TopicInfo[] = [
  {
    id: "fundamentals",
    label: "Fundamentals",
    description: "Measurement, accuracy vs precision, matter classification",
    mode: "quiz",
    order: 1,
    icon: "atom",
    color: "#818cf8",
  },
  {
    id: "metric-system",
    label: "Metric System",
    description: "SI prefixes, base units, unit conversions",
    mode: "quiz",
    order: 2,
    icon: "ruler",
    color: "#34d399",
  },
  {
    id: "significant-figures",
    label: "Significant Figures",
    description: "Counting sig figs, rounding in calculations",
    mode: "mixed",
    order: 3,
    icon: "hash",
    color: "#fbbf24",
  },
  {
    id: "dimensional-analysis",
    label: "Dimensional Analysis",
    description: "Unit conversion chains, single to multi-step",
    mode: "solver",
    order: 4,
    icon: "arrow-left-right",
    color: "#f0abfc",
  },
  {
    id: "the-mole",
    label: "The Mole",
    description: "Mole-to-particle, mole-to-mass, Avogadro's number",
    mode: "solver",
    order: 5,
    icon: "molecule",
    color: "#60a5fa",
  },
  {
    id: "stoichiometry",
    label: "Stoichiometry",
    description: "Grams/moles/molecules, limiting reactants, % yield",
    mode: "solver",
    order: 6,
    icon: "scale",
    color: "#fb923c",
  },
  {
    id: "molarity-dilutions",
    label: "Molarity & Dilutions",
    description: "Molarity, C1V1=C2V2, stock solutions",
    mode: "solver",
    order: 7,
    icon: "flask-conical",
    color: "#2dd4bf",
  },
];

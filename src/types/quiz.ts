export interface QuizData {
  vowels: Record<string, { word: string; meaning: string }>;
  consonants: Record<string, { word: string; meaning: string }>;
  knownWords: Record<string, string>;
  vowel_signs: string[];
  numbers: string[];
  gunitakshara: Record<string, string[]>;
}

export interface Question {
  id: number;
  type: 'before' | 'after' | 'kannada-to-english' | 'english-to-kannada' | 'kannada-number-to-english' | 'english-number-to-kannada';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  questions: Question[];
  showResult: boolean;
  showAnswer: boolean;
  selectedAnswer: string | null;
  isCorrect: boolean | null;
}
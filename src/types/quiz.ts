export interface QuizData {
  vowels: Record<string, { word: string; meaning: string }>;
  consonants: Record<string, { word: string; meaning: string }>;
  knownWords: Record<string, string>;
  vowel_signs: string[];
  numbers: string[];
  gunitakshara: Record<string, string[]>;
}

export interface HindiData {
  gender: Array<{ male: string; female: string }>;
  meanings: Record<string, string>;
  nounsAndVerbs: Array<{
    sentence: string;
    nouns: string[];
    verbs: string[];
    meaning: string;
  }>;
  singularPlural: Array<{
    singular: string;
    plural: string;
  }>;
}

export interface Question {
  id: number;
  type: 'before' | 'after' | 'kannada-to-english' | 'english-to-kannada' | 
        'kannada-number-to-english' | 'english-number-to-kannada' | 'flash-card' |
        'hindi-gender' | 'hindi-meaning-to-english' | 'english-to-hindi' |
        'hindi-noun-verb' | 'hindi-singular-plural';
  question: string;
  options: string[];
  correctAnswer: string | string[];
  explanation?: string;
  sentence?: string;
  sentenceMeaning?: string;
  questionMode?: 'select-male' | 'select-female' | 'identify-gender' | 'select-nouns' | 'select-verbs' | 'identify-number';
  flashCardWord?: string;
  flashCardType?: 'kannada-to-english' | 'english-to-kannada';
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  questions: Question[];
  showResult: boolean;
  showAnswer: boolean;
  selectedAnswer: string | string[] | null;
  isCorrect: boolean | null;
}

export type Subject = 'kannada' | 'hindi';
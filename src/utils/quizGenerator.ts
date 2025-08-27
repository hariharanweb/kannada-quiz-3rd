import { QuizData, Question } from '../types/quiz';

export class QuizGenerator {
  private data: QuizData;
  private vowelOrder: string[];
  private consonantOrder: string[];

  constructor(data: QuizData) {
    this.data = data;
    this.vowelOrder = Object.keys(data.vowels);
    this.consonantOrder = Object.keys(data.consonants);
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private generateBeforeAfterQuestion(type: 'before' | 'after'): Question | null {
    const useVowels = Math.random() < 0.5;
    const letters = useVowels ? this.vowelOrder : this.consonantOrder;
    
    let targetIndex: number;
    if (type === 'before') {
      targetIndex = Math.floor(Math.random() * (letters.length - 1)) + 1;
    } else {
      targetIndex = Math.floor(Math.random() * (letters.length - 1));
    }

    const targetLetter = letters[targetIndex];
    const correctAnswer = type === 'before' 
      ? letters[targetIndex - 1] 
      : letters[targetIndex + 1];

    // Generate wrong options
    const wrongOptions: string[] = [];
    const availableLetters = letters.filter(l => l !== correctAnswer && l !== targetLetter);
    
    while (wrongOptions.length < 3 && availableLetters.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableLetters.length);
      const option = availableLetters.splice(randomIndex, 1)[0];
      wrongOptions.push(option);
    }

    if (wrongOptions.length < 3) return null;

    const options = this.shuffleArray([correctAnswer, ...wrongOptions]);
    
    return {
      id: Date.now() + Math.random(),
      type,
      question: `What comes ${type} "${targetLetter}"?`,
      options,
      correctAnswer,
      explanation: `In the ${useVowels ? 'vowel' : 'consonant'} sequence, "${correctAnswer}" comes ${type} "${targetLetter}".`
    };
  }

  private generateKannadaToEnglishQuestion(): Question | null {
    const words = Object.entries(this.data.knownWords);
    if (words.length < 4) return null;

    const shuffledWords = this.shuffleArray(words);
    const [kannadaWord, correctAnswer] = shuffledWords[0];
    
    const wrongOptions = shuffledWords
      .slice(1, 4)
      .map(([, meaning]) => meaning);

    const options = this.shuffleArray([correctAnswer, ...wrongOptions]);

    return {
      id: Date.now() + Math.random(),
      type: 'kannada-to-english',
      question: `What is the meaning of "${kannadaWord}"?`,
      options,
      correctAnswer,
      explanation: `"${kannadaWord}" means "${correctAnswer}" in English.`
    };
  }

  private generateEnglishToKannadaQuestion(): Question | null {
    const words = Object.entries(this.data.knownWords);
    if (words.length < 4) return null;

    const shuffledWords = this.shuffleArray(words);
    const [correctAnswer, englishWord] = shuffledWords[0];
    
    const wrongOptions = shuffledWords
      .slice(1, 4)
      .map(([kannada]) => kannada);

    const options = this.shuffleArray([correctAnswer, ...wrongOptions]);

    return {
      id: Date.now() + Math.random(),
      type: 'english-to-kannada',
      question: `What is the Kannada word for "${englishWord}"?`,
      options,
      correctAnswer,
      explanation: `"${englishWord}" is "${correctAnswer}" in Kannada.`
    };
  }

  generateQuestions(count: number): Question[] {
    const questions: Question[] = [];
    const questionTypes = ['before', 'after', 'kannada-to-english', 'english-to-kannada'] as const;
    
    let attempts = 0;
    const maxAttempts = count * 3;

    while (questions.length < count && attempts < maxAttempts) {
      attempts++;
      const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      
      let question: Question | null = null;
      
      switch (type) {
        case 'before':
        case 'after':
          question = this.generateBeforeAfterQuestion(type);
          break;
        case 'kannada-to-english':
          question = this.generateKannadaToEnglishQuestion();
          break;
        case 'english-to-kannada':
          question = this.generateEnglishToKannadaQuestion();
          break;
      }

      if (question) {
        questions.push(question);
      }
    }

    return questions;
  }
}
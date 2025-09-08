import { QuizData, Question } from '../types/quiz';

export class QuizGenerator {
  private data: QuizData;
  private vowelOrder: string[];
  private consonantOrder: string[];
  private kannadaNumbers: string[];
  private englishNumbers: string[];

  constructor(data: QuizData) {
    this.data = data;
    this.vowelOrder = Object.keys(data.vowels);
    this.consonantOrder = Object.keys(data.consonants);
    this.kannadaNumbers = data.numbers;
    this.englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  }

  private convertToKannadaNumber(num: number): string {
    return num.toString().split('').map(digit => this.kannadaNumbers[parseInt(digit)]).join('');
  }

  private convertToEnglishNumber(kannadaNum: string): string {
    return kannadaNum.split('').map(char => {
      const index = this.kannadaNumbers.indexOf(char);
      return index !== -1 ? index.toString() : char;
    }).join('');
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

  private generateKannadaNumberToEnglishQuestion(): Question | null {
    // Generate a random number between 1 and 50
    const randomNumber = Math.floor(Math.random() * 50) + 1;
    const kannadaNumber = this.convertToKannadaNumber(randomNumber);
    const correctAnswer = randomNumber.toString();

    // Generate wrong options
    const wrongOptions: string[] = [];
    const usedNumbers = new Set([randomNumber]);

    while (wrongOptions.length < 3) {
      const wrongNum = Math.floor(Math.random() * 50) + 1;
      if (!usedNumbers.has(wrongNum)) {
        wrongOptions.push(wrongNum.toString());
        usedNumbers.add(wrongNum);
      }
    }

    const options = this.shuffleArray([correctAnswer, ...wrongOptions]);

    return {
      id: Date.now() + Math.random(),
      type: 'kannada-number-to-english',
      question: `What is the English number for "${kannadaNumber}"?`,
      options,
      correctAnswer,
      explanation: `"${kannadaNumber}" is "${correctAnswer}" in English.`
    };
  }

  private generateEnglishNumberToKannadaQuestion(): Question | null {
    // Generate a random number between 1 and 50
    const randomNumber = Math.floor(Math.random() * 50) + 1;
    const correctAnswer = this.convertToKannadaNumber(randomNumber);
    const englishNumber = randomNumber.toString();

    // Generate wrong options
    const wrongOptions: string[] = [];
    const usedNumbers = new Set([randomNumber]);

    while (wrongOptions.length < 3) {
      const wrongNum = Math.floor(Math.random() * 50) + 1;
      if (!usedNumbers.has(wrongNum)) {
        wrongOptions.push(this.convertToKannadaNumber(wrongNum));
        usedNumbers.add(wrongNum);
      }
    }

    const options = this.shuffleArray([correctAnswer, ...wrongOptions]);

    return {
      id: Date.now() + Math.random(),
      type: 'english-number-to-kannada',
      question: `What is the Kannada number for "${englishNumber}"?`,
      options,
      correctAnswer,
      explanation: `"${englishNumber}" is "${correctAnswer}" in Kannada.`
    };
  }

  private generateFlashCardQuestion(): Question | null {
    const words = Object.entries(this.data.knownWords);
    if (words.length === 0) return null;

    const [kannadaWord, englishWord] = words[Math.floor(Math.random() * words.length)];
    const flashCardType = Math.random() < 0.5 ? 'kannada-to-english' : 'english-to-kannada';
    
    const displayWord = flashCardType === 'kannada-to-english' ? kannadaWord : englishWord;
    const correctAnswer = flashCardType === 'kannada-to-english' ? englishWord : kannadaWord;

    return {
      id: Date.now() + Math.random(),
      type: 'flash-card',
      question: `Look at the word and answer orally`,
      options: ['Correct', 'Wrong'], // Teacher buttons
      correctAnswer: correctAnswer,
      flashCardWord: displayWord,
      flashCardType: flashCardType,
      explanation: `The word "${displayWord}" means "${correctAnswer}".`
    };
  }
  generateQuestions(count: number): Question[] {
    const questions: Question[] = [];
    
    // Ensure equal distribution of question types
    const questionTypes = ['before', 'after', 'kannada-to-english', 'english-to-kannada', 'kannada-number-to-english', 'english-number-to-kannada'] as const;
    const questionsPerType = Math.floor(count / questionTypes.length);
    const remainder = count % questionTypes.length;
    
    // Create a balanced distribution
    const typeDistribution: string[] = [];
    questionTypes.forEach(type => {
      for (let i = 0; i < questionsPerType; i++) {
        typeDistribution.push(type);
      }
    });
    
    // Add remaining questions randomly
    for (let i = 0; i < remainder; i++) {
      const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      typeDistribution.push(randomType);
    }
    
    // Shuffle the distribution
    const shuffledTypes = this.shuffleArray(typeDistribution);
    
    let attempts = 0;
    const maxAttempts = count * 3;
    let typeIndex = 0;

    while (questions.length < count && attempts < maxAttempts && typeIndex < shuffledTypes.length) {
      attempts++;
      const type = shuffledTypes[typeIndex] as typeof questionTypes[number];
      
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
        case 'kannada-number-to-english':
          question = this.generateKannadaNumberToEnglishQuestion();
          break;
        case 'english-number-to-kannada':
          question = this.generateEnglishNumberToKannadaQuestion();
          break;
      }

      if (question) {
        questions.push(question);
        typeIndex++;
      }
    }

    return questions;
  }

  generateFlashCards(count: number = 10): Question[] {
    const flashCards: Question[] = [];
    const words = Object.entries(this.data.knownWords);
    
    if (words.length === 0) return flashCards;

    // Generate specified number of flash cards
    for (let i = 0; i < count && i < words.length; i++) {
      const [kannadaWord, englishWord] = words[i];
      const flashCardType = Math.random() < 0.5 ? 'kannada-to-english' : 'english-to-kannada';
      
      const displayWord = flashCardType === 'kannada-to-english' ? kannadaWord : englishWord;
      const correctAnswer = flashCardType === 'kannada-to-english' ? englishWord : kannadaWord;

      const flashCard: Question = {
        id: Date.now() + Math.random() + i,
        type: 'flash-card',
        question: `Look at the word and answer orally`,
        options: ['Correct', 'Wrong'], // Teacher buttons
        correctAnswer: correctAnswer,
        flashCardWord: displayWord,
        flashCardType: flashCardType,
        explanation: `The word "${displayWord}" means "${correctAnswer}".`
      };

      flashCards.push(flashCard);
    }

    return this.shuffleArray(flashCards);
  }
}
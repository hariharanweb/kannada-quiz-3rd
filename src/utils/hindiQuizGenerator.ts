import { HindiData, Question } from '../types/quiz';

export class HindiQuizGenerator {
  private data: HindiData;

  constructor(data: HindiData) {
    this.data = data;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private generateGenderQuestion(): Question | null {
    if (this.data.gender.length === 0) return null;

    const randomPair = this.data.gender[Math.floor(Math.random() * this.data.gender.length)];
    const questionModes = ['select-male', 'select-female', 'identify-gender'] as const;
    const mode = questionModes[Math.floor(Math.random() * questionModes.length)];

    switch (mode) {
      case 'select-male':
        return {
          id: Date.now() + Math.random(),
          type: 'hindi-gender',
          question: 'Select the male word:',
          options: [randomPair.male, randomPair.female],
          correctAnswer: randomPair.male,
          explanation: `"${randomPair.male}" is male and "${randomPair.female}" is female.`,
          questionMode: mode
        };

      case 'select-female':
        return {
          id: Date.now() + Math.random(),
          type: 'hindi-gender',
          question: 'Select the female word:',
          options: [randomPair.male, randomPair.female],
          correctAnswer: randomPair.female,
          explanation: `"${randomPair.female}" is female and "${randomPair.male}" is male.`,
          questionMode: mode
        };

      case 'identify-gender':
        const word = Math.random() < 0.5 ? randomPair.male : randomPair.female;
        const gender = word === randomPair.male ? 'Male' : 'Female';
        return {
          id: Date.now() + Math.random(),
          type: 'hindi-gender',
          question: `Is "${word}" male or female?`,
          options: ['Male', 'Female'],
          correctAnswer: gender,
          explanation: `"${word}" is ${gender.toLowerCase()}.`,
          questionMode: mode
        };

      default:
        return null;
    }
  }

  private generateMeaningQuestion(): Question | null {
    const words = Object.entries(this.data.meanings);
    if (words.length < 4) return null;

    const isHindiToEnglish = Math.random() < 0.5;
    const shuffledWords = this.shuffleArray(words);
    
    if (isHindiToEnglish) {
      const [hindiWord, correctAnswer] = shuffledWords[0];
      const wrongOptions = shuffledWords.slice(1, 4).map(([, meaning]) => meaning);
      const options = this.shuffleArray([correctAnswer, ...wrongOptions]);

      return {
        id: Date.now() + Math.random(),
        type: 'hindi-meaning-to-english',
        question: `What is the meaning of "${hindiWord}"?`,
        options,
        correctAnswer,
        explanation: `"${hindiWord}" means "${correctAnswer}" in English.`
      };
    } else {
      const [correctAnswer, englishWord] = shuffledWords[0];
      const wrongOptions = shuffledWords.slice(1, 4).map(([hindi]) => hindi);
      const options = this.shuffleArray([correctAnswer, ...wrongOptions]);

      return {
        id: Date.now() + Math.random(),
        type: 'english-to-hindi',
        question: `What is the Hindi word for "${englishWord}"?`,
        options,
        correctAnswer,
        explanation: `"${englishWord}" is "${correctAnswer}" in Hindi.`
      };
    }
  }

  private generateNounVerbQuestion(): Question | null {
    if (this.data.nounsAndVerbs.length === 0) return null;

    const randomSentence = this.data.nounsAndVerbs[Math.floor(Math.random() * this.data.nounsAndVerbs.length)];
    const questionType = Math.random() < 0.5 ? 'select-nouns' : 'select-verbs';
    
    const allWords = randomSentence.sentence.split(' ');
    const correctAnswers = questionType === 'select-nouns' ? randomSentence.nouns : randomSentence.verbs;

    return {
      id: Date.now() + Math.random(),
      type: 'hindi-noun-verb',
      question: questionType === 'select-nouns' ? 'Click on all the NOUNS in the sentence:' : 'Click on all the VERBS in the sentence:',
      options: allWords,
      correctAnswer: correctAnswers,
      explanation: `In this sentence, the ${questionType === 'select-nouns' ? 'nouns' : 'verbs'} are: ${correctAnswers.join(', ')}`,
      sentence: randomSentence.sentence,
      sentenceMeaning: randomSentence.meaning,
      questionMode: questionType
    };
  }

  private generateSingularPluralQuestion(): Question | null {
    if (this.data.singularPlural.length === 0) return null;

    const randomPair = this.data.singularPlural[Math.floor(Math.random() * this.data.singularPlural.length)];
    const word = Math.random() < 0.5 ? randomPair.singular : randomPair.plural;
    const correctAnswer = word === randomPair.singular ? 'Singular' : 'Plural';

    return {
      id: Date.now() + Math.random(),
      type: 'hindi-singular-plural',
      question: `Is "${word}" singular or plural?`,
      options: ['Singular', 'Plural'],
      correctAnswer,
      explanation: `"${word}" is ${correctAnswer.toLowerCase()}. ${correctAnswer === 'Singular' ? `Plural form: "${randomPair.plural}"` : `Singular form: "${randomPair.singular}"`}`,
      questionMode: 'identify-number'
    };
  }

  generateQuestions(count: number): Question[] {
    const questions: Question[] = [];
    
    // Ensure equal distribution of question types
    const questionTypes = ['hindi-gender', 'hindi-meaning-to-english', 'english-to-hindi', 'hindi-noun-verb', 'hindi-singular-plural'] as const;
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
        case 'hindi-gender':
          question = this.generateGenderQuestion();
          break;
        case 'hindi-meaning-to-english':
        case 'english-to-hindi':
          question = this.generateMeaningQuestion();
          break;
        case 'hindi-noun-verb':
          question = this.generateNounVerbQuestion();
          break;
        case 'hindi-singular-plural':
          question = this.generateSingularPluralQuestion();
          break;
      }

      if (question) {
        questions.push(question);
        typeIndex++;
      }
    }

    return questions;
  }
}
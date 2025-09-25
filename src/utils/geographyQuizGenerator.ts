import { GeographyData, Question } from '../types/quiz';

export class GeographyQuizGenerator {
  private data: GeographyData;

  constructor(data: GeographyData) {
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

  private generateStateCapitalQuestions(count: number): Question[] {
    const questions: Question[] = [];
    const allStatesAndUTs = [...this.data.states, ...this.data.unionTerritories];
    const shuffledStates = this.shuffleArray(allStatesAndUTs);

    for (let i = 0; i < Math.min(count, shuffledStates.length); i++) {
      const correctState = shuffledStates[i];
      const otherStates = allStatesAndUTs.filter(s => s.name !== correctState.name);
      const wrongOptions = this.shuffleArray(otherStates).slice(0, 3);
      const options = this.shuffleArray([correctState.name, ...wrongOptions.map(s => s.name)]);

      questions.push({
        id: i + 1,
        type: 'geography-state-capital',
        question: `Which state/UT has the capital "${correctState.capital}"?`,
        options: options,
        correctAnswer: correctState.name,
        explanation: `${correctState.name} is the ${this.data.states.find(s => s.name === correctState.name) ? 'state' : 'union territory'} with capital ${correctState.capital}.`
      });
    }

    return questions;
  }

  generateQuestions(count: number): Question[] {
    return this.generateStateCapitalQuestions(count);
  }
}
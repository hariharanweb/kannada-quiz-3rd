import React from 'react';
import { useState, useEffect } from 'react';
import { QuizHeader } from './components/QuizHeader';
import { QuizSettings } from './components/QuizSettings';
import { QuestionCard } from './components/QuestionCard';
import { QuizResults } from './components/QuizResults';
import { QuizGenerator } from './utils/quizGenerator';
import { QuizState, QuizData } from './types/quiz';
import quizData from './data/test.json';

function App() {
  const [gameState, setGameState] = useState<'settings' | 'quiz' | 'results'>('settings');
  const [questionCount, setQuestionCount] = useState(20);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestion: 0,
    score: 0,
    questions: [],
    showResult: false,
    showAnswer: false,
    selectedAnswer: null,
    isCorrect: null
  });

  const quizGenerator = new QuizGenerator(quizData as QuizData);

  const startQuiz = () => {
    const questions = quizGenerator.generateQuestions(questionCount);
    setQuizState({
      currentQuestion: 0,
      score: 0,
      questions,
      showResult: false,
      showAnswer: false,
      selectedAnswer: null,
      isCorrect: null
    });
    setGameState('quiz');
  };

  const handleAnswerSelect = (answer: string) => {
    const currentQ = quizState.questions[quizState.currentQuestion];
    const isCorrect = answer === currentQ.correctAnswer;
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showAnswer: true,
      isCorrect,
      score: isCorrect ? prev.score + 1 : prev.score
    }));
  };

  const handleNextQuestion = () => {
    if (quizState.currentQuestion + 1 >= quizState.questions.length) {
      setGameState('results');
    } else {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
        showAnswer: false,
        selectedAnswer: null,
        isCorrect: null
      }));
    }
  };

  const restartQuiz = () => {
    startQuiz();
  };

  const backToSettings = () => {
    setGameState('settings');
    setQuizState({
      currentQuestion: 0,
      score: 0,
      questions: [],
      showResult: false,
      showAnswer: false,
      selectedAnswer: null,
      isCorrect: null
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <QuizHeader 
          score={gameState === 'quiz' ? quizState.score : undefined}
          totalQuestions={gameState === 'quiz' ? quizState.questions.length : undefined}
        />
        
        {gameState === 'settings' && (
          <QuizSettings
            questionCount={questionCount}
            onQuestionCountChange={setQuestionCount}
            onStartQuiz={startQuiz}
          />
        )}
        
        {gameState === 'quiz' && quizState.questions.length > 0 && (
          <QuestionCard
            question={quizState.questions[quizState.currentQuestion]}
            currentQuestionIndex={quizState.currentQuestion}
            totalQuestions={quizState.questions.length}
            selectedAnswer={quizState.selectedAnswer}
            showAnswer={quizState.showAnswer}
            isCorrect={quizState.isCorrect}
            onAnswerSelect={handleAnswerSelect}
            onNextQuestion={handleNextQuestion}
          />
        )}
        
        {gameState === 'results' && (
          <QuizResults
            score={quizState.score}
            totalQuestions={quizState.questions.length}
            onRestart={restartQuiz}
            onBackToSettings={backToSettings}
          />
        )}
      </div>
    </div>
  );
}

export default App;

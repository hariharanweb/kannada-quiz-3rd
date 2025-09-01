import React from 'react';
import { useState, useEffect } from 'react';
import { useTheme } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { QuizHeader } from './components/QuizHeader';
import { SubjectSelector } from './components/SubjectSelector';
import { QuizSettings } from './components/QuizSettings';
import { QuestionCard } from './components/QuestionCard';
import { QuizResults } from './components/QuizResults';
import { QuizGenerator } from './utils/quizGenerator';
import { HindiQuizGenerator } from './utils/hindiQuizGenerator';
import { QuizState, QuizData, HindiData, Subject } from './types/quiz';
import kannadaData from './data/test.json';
import hindiData from './data/hindi.json';

function App() {
  const { isDark } = useTheme();
  const [gameState, setGameState] = useState<'subject-selection' | 'settings' | 'quiz' | 'results'>('subject-selection');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
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

  const kannadaQuizGenerator = new QuizGenerator(kannadaData as QuizData);
  const hindiQuizGenerator = new HindiQuizGenerator(hindiData as HindiData);

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setGameState('settings');
  };

  const startQuiz = () => {
    if (!selectedSubject) return;
    
    const generator = selectedSubject === 'kannada' ? kannadaQuizGenerator : hindiQuizGenerator;
    const questions = generator.generateQuestions(questionCount);
    
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

  const handleAnswerSelect = (answer: string | string[]) => {
    const currentQ = quizState.questions[quizState.currentQuestion];
    let isCorrect: boolean;

    if (Array.isArray(answer) && Array.isArray(currentQ.correctAnswer)) {
      // Multi-select answer (noun/verb questions)
      isCorrect = answer.length === currentQ.correctAnswer.length && 
                 answer.every(a => currentQ.correctAnswer.includes(a));
    } else {
      // Single select answer
      isCorrect = answer === currentQ.correctAnswer;
    }
    
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

  const backToSubjects = () => {
    setGameState('subject-selection');
    setSelectedSubject(null);
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
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      <ThemeToggle />
      <div className="container mx-auto px-4 py-8">
        <QuizHeader 
          subject={selectedSubject || undefined}
          score={gameState === 'quiz' ? quizState.score : undefined}
          totalQuestions={gameState === 'quiz' ? quizState.questions.length : undefined}
        />
        
        {gameState === 'subject-selection' && (
          <SubjectSelector onSubjectSelect={handleSubjectSelect} />
        )}
        
        {gameState === 'settings' && selectedSubject && (
          <QuizSettings
            subject={selectedSubject}
            questionCount={questionCount}
            onQuestionCountChange={setQuestionCount}
            onStartQuiz={startQuiz}
            onBackToSubjects={backToSubjects}
          />
        )}
        
        {gameState === 'quiz' && quizState.questions.length > 0 && selectedSubject && (
          <QuestionCard
            subject={selectedSubject}
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
        
        {gameState === 'results' && selectedSubject && (
          <QuizResults
            subject={selectedSubject}
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
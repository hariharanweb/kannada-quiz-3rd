import { useState } from 'react';
import { useTheme } from './contexts/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
import { QuizHeader } from './components/QuizHeader';
import { SubjectSelector } from './components/SubjectSelector';
import { QuizSettings } from './components/QuizSettings';
import { QuestionCard } from './components/QuestionCard';
import { QuizResults } from './components/QuizResults';
import { QuizGenerator } from './utils/quizGenerator';
import { HindiQuizGenerator } from './utils/hindiQuizGenerator';
import { GeographyQuizGenerator } from './utils/geographyQuizGenerator';
import { QuizState, QuizData, HindiData, GeographyData, Subject } from './types/quiz';
import kannadaData from './data/test.json';
import hindiData from './data/hindi.json';
import geographyData from './data/indiaMap.json';

function App() {
  const { isDark } = useTheme();
  const [gameState, setGameState] = useState<'subject-selection' | 'settings' | 'quiz' | 'flash-cards' | 'results'>('subject-selection');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [questionCount, setQuestionCount] = useState(20);
  const [flashCardCount, setFlashCardCount] = useState(10);
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
  const geographyQuizGenerator = new GeographyQuizGenerator(geographyData as GeographyData);

  const handleSubjectSelect = (subject: Subject) => {
    setSelectedSubject(subject);
    setGameState('settings');
  };

  const startQuiz = () => {
    if (!selectedSubject) return;

    const generator = selectedSubject === 'kannada'
      ? kannadaQuizGenerator
      : selectedSubject === 'hindi'
      ? hindiQuizGenerator
      : geographyQuizGenerator;
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

  const startFlashCards = () => {
    if (selectedSubject !== 'kannada') return;
    
    const flashCards = kannadaQuizGenerator.generateFlashCards(flashCardCount);
    
    setQuizState({
      currentQuestion: 0,
      score: 0,
      questions: flashCards,
      showResult: false,
      showAnswer: false,
      selectedAnswer: null,
      isCorrect: null
    });
    setGameState('flash-cards');
  };

  const handleAnswerSelect = (answer: string | string[], timeScore?: number) => {
    const currentQ = quizState.questions[quizState.currentQuestion];
    let isCorrect: boolean;
    let scoreToAdd = 0;

    if (currentQ.type === 'flash-card') {
      // Flash card scoring: isCorrect based on teacher input, score based on time
      isCorrect = answer === 'Correct';
      scoreToAdd = isCorrect ? (timeScore || 0) : 0;
    } else if (Array.isArray(answer) && Array.isArray(currentQ.correctAnswer)) {
      // Multi-select answer (noun/verb questions)
      isCorrect = answer.length === currentQ.correctAnswer.length && 
                 answer.every(a => currentQ.correctAnswer.includes(a));
      scoreToAdd = isCorrect ? 1 : 0;
    } else {
      // Single select answer
      isCorrect = answer === currentQ.correctAnswer;
      scoreToAdd = isCorrect ? 1 : 0;
    }
    
    setQuizState(prev => ({
      ...prev,
      selectedAnswer: answer,
      showAnswer: true,
      isCorrect,
      score: prev.score + scoreToAdd
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
            flashCardCount={flashCardCount}
            onQuestionCountChange={setQuestionCount}
            onFlashCardCountChange={setFlashCardCount}
            onStartQuiz={startQuiz}
            onStartFlashCards={startFlashCards}
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

        {gameState === 'flash-cards' && quizState.questions.length > 0 && selectedSubject && (
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
            isFlashCards={quizState.questions.length > 0 && quizState.questions[0].type === 'flash-card'}
          />
        )}
      </div>
    </div>
  );
}

export default App;
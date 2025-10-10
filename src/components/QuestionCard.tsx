import React from 'react';
import { Question, Subject } from '../types/quiz';
import { CheckCircle, XCircle, ArrowRight, Info } from 'lucide-react';
import { FlashCard } from './FlashCard';
import { themeStyles, getOptionStateStyle, getWordStateStyle, getFeedbackTextColor } from '../styles/themeStyles';

interface QuestionCardProps {
  subject: Subject;
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | string[] | null;
  showAnswer: boolean;
  isCorrect: boolean | null;
  onAnswerSelect: (answer: string | string[], timeScore?: number) => void;
  onNextQuestion: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  subject,
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  showAnswer,
  isCorrect,
  onAnswerSelect,
  onNextQuestion
}) => {
  const isMultiSelect = question.type === 'hindi-noun-verb';
  const [localSelectedAnswers, setLocalSelectedAnswers] = React.useState<string[]>([]);
  const [showTooltip, setShowTooltip] = React.useState(false);

  // Reset local selection when question changes
  React.useEffect(() => {
    setLocalSelectedAnswers([]);
  }, [question.id]);

  const handleWordClick = (word: string) => {
    if (!isMultiSelect || showAnswer) return;

    setLocalSelectedAnswers(prev => 
      prev.includes(word)
        ? prev.filter(w => w !== word)
        : [...prev, word]
    );
  };

  const handleRegularAnswerSelect = (answer: string) => {
    if (showAnswer || isMultiSelect) return;
    onAnswerSelect(answer);
  };

  const handleSubmitMultiSelect = () => {
    if (!isMultiSelect || localSelectedAnswers.length === 0) return;
    onAnswerSelect(localSelectedAnswers);
  };

  const getWordStyle = (word: string) => {
    if (!isMultiSelect) return '';

    const isSelected = showAnswer
      ? Array.isArray(selectedAnswer) && selectedAnswer.includes(word)
      : localSelectedAnswers.includes(word);
    const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [];
    const isCorrectAnswer = correctAnswers.includes(word);

    return getWordStateStyle(isSelected, showAnswer, isCorrectAnswer);
  };

  const getOptionStyle = (option: string) => {
    if (isMultiSelect) return '';

    const isSelected = selectedAnswer === option;
    const isCorrectAnswer = option === question.correctAnswer;
    const isAnswerCorrect = isCorrect ?? false;

    return getOptionStateStyle(isSelected, showAnswer, isAnswerCorrect, isCorrectAnswer);
  };

  const getOptionIcon = (option: string) => {
    if (isMultiSelect) return null;
    
    if (!showAnswer) return null;

    if (option === question.correctAnswer) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }

    if (selectedAnswer === option && option !== question.correctAnswer) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }

    return null;
  };

  const isAnswerComplete = () => {
    if (isMultiSelect) {
      return localSelectedAnswers.length > 0;
    }
    return selectedAnswer !== null;
  };

  // Handle flash card questions differently
  if (question.type === 'flash-card') {
    return (
      <FlashCard
        question={question}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        onAnswerSelect={onAnswerSelect}
        onNextQuestion={onNextQuestion}
        showAnswer={showAnswer}
        isCorrect={isCorrect}
      />
    );
  }

  return (
    <div className={`max-w-2xl mx-auto rounded-2xl shadow-xl p-8 ${themeStyles.bg.card}`}>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-semibold ${themeStyles.text.secondary}`}>
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-semibold text-blue-600">
            {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
          </span>
        </div>
        <div className={`w-full rounded-full h-2 ${themeStyles.progress.bg}`}>
          <div
            className={`h-2 rounded-full transition-all duration-300 ${themeStyles.progress.bar}`}
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className={`text-2xl font-bold mb-4 text-center ${themeStyles.text.primary}`}>
          {question.question}
        </h2>
        
        {/* Sentence for noun/verb questions */}
        {question.sentence && (
          <div className={`rounded-xl p-6 mb-6 ${themeStyles.content.highlight}`}>
            <div className="text-center mb-2">
              <div className="flex items-center justify-center gap-2 mb-4">
                <h3 className={`text-xl font-semibold ${themeStyles.text.primary}`}>Sentence:</h3>
                <div className="relative">
                  <button
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className={`p-1 rounded-full transition-colors duration-200 ${themeStyles.state.info}`}
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  {showTooltip && (
                    <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 text-sm rounded-lg whitespace-nowrap z-10 ${themeStyles.tooltip.base}`}>
                      English: {question.sentenceMeaning}
                    </div>
                  )}
                </div>
              </div>
              <div className={`flex flex-wrap justify-center gap-2 text-2xl font-bold mb-2 ${themeStyles.text.primary}`}>
                {question.sentence.split(' ').map((word, index) => (
                  <span
                    key={index}
                    onClick={() => handleWordClick(word)}
                    className={`px-3 py-2 rounded-lg border-2 transition-all duration-200 ${getWordStyle(word)}`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
            
            {isMultiSelect && !showAnswer && (
              <div className="text-center">
                <button
                  onClick={handleSubmitMultiSelect}
                  disabled={!isAnswerComplete()}
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${
                    isAnswerComplete()
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                      : themeStyles.button.disabled
                  }`}
                >
                  Submit Answer
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Options */}
      {!isMultiSelect && (
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleRegularAnswerSelect(option)}
              disabled={showAnswer}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between text-left font-semibold ${getOptionStyle(option)} ${
                !showAnswer ? 'hover:scale-102 cursor-pointer' : 'cursor-default'
              }`}
            >
              <span className="text-lg">{option}</span>
              {getOptionIcon(option)}
            </button>
          ))}
        </div>
      )}

      {/* Answer Explanation */}
      {showAnswer && (
        <div className="mb-6">
          <div className={`p-4 rounded-xl border ${
            isCorrect ? themeStyles.feedback.correct : themeStyles.feedback.incorrect
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-semibold ${getFeedbackTextColor(isCorrect ?? false)}`}>
                {isCorrect ? 'Correct!' : 'Incorrect!'}
              </span>
            </div>
            {question.explanation && (
              <p className={themeStyles.text.secondary}>{question.explanation}</p>
            )}
          </div>
        </div>
      )}

      {/* Next Button */}
      {showAnswer && (
        <button
          onClick={onNextQuestion}
          className={`w-full bg-gradient-to-r ${
            subject === 'kannada' ? 'from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600' : 'from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600'
          } text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2`}
        >
          {currentQuestionIndex + 1 === totalQuestions ? 'View Results' : 'Next Question'}
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
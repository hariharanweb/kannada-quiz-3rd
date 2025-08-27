import React from 'react';
import { Question } from '../types/quiz';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  showAnswer: boolean;
  isCorrect: boolean | null;
  onAnswerSelect: (answer: string) => void;
  onNextQuestion: () => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  showAnswer,
  isCorrect,
  onAnswerSelect,
  onNextQuestion
}) => {
  const getOptionStyle = (option: string) => {
    if (!showAnswer) {
      return selectedAnswer === option
        ? 'bg-blue-100 border-blue-300 text-blue-800'
        : 'bg-white border-gray-200 hover:border-blue-300 hover:bg-blue-50';
    }

    if (option === question.correctAnswer) {
      return 'bg-green-100 border-green-300 text-green-800';
    }

    if (selectedAnswer === option && option !== question.correctAnswer) {
      return 'bg-red-100 border-red-300 text-red-800';
    }

    return 'bg-gray-50 border-gray-200 text-gray-600';
  };

  const getOptionIcon = (option: string) => {
    if (!showAnswer) return null;

    if (option === question.correctAnswer) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }

    if (selectedAnswer === option && option !== question.correctAnswer) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }

    return null;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-semibold text-blue-600">
            {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {question.question}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showAnswer && onAnswerSelect(option)}
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

      {/* Answer Explanation */}
      {showAnswer && (
        <div className="mb-6">
          <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-semibold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect!'}
              </span>
            </div>
            {question.explanation && (
              <p className="text-gray-700">{question.explanation}</p>
            )}
          </div>
        </div>
      )}

      {/* Next Button */}
      {showAnswer && (
        <button
          onClick={onNextQuestion}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          {currentQuestionIndex + 1 === totalQuestions ? 'View Results' : 'Next Question'}
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
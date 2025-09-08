import React, { useState, useEffect } from 'react';
import { Question } from '../types/quiz';
import { useTheme } from '../contexts/ThemeContext';
import { CheckCircle, XCircle, ArrowRight, Clock } from 'lucide-react';

interface FlashCardProps {
  question: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  onAnswerSelect: (answer: string, timeScore: number) => void;
  onNextQuestion: () => void;
  showAnswer: boolean;
  isCorrect: boolean | null;
}

export const FlashCard: React.FC<FlashCardProps> = ({
  question,
  currentQuestionIndex,
  totalQuestions,
  onAnswerSelect,
  onNextQuestion,
  showAnswer,
  isCorrect
}) => {
  const { isDark } = useTheme();
  const [timeLeft, setTimeLeft] = useState(10);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    // Reset timer for new question
    setTimeLeft(10);
    setIsTimerActive(true);
    setHasAnswered(false);
  }, [question.id]);

  useEffect(() => {
    if (!isTimerActive || timeLeft === 0 || hasAnswered) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft, hasAnswered]);

  const handleTeacherResponse = (isCorrect: boolean) => {
    if (hasAnswered) return;
    
    setHasAnswered(true);
    setIsTimerActive(false);
    
    // Calculate score: time remaining (10 - time elapsed)
    const timeScore = timeLeft;
    onAnswerSelect(isCorrect ? 'Correct' : 'Wrong', timeScore);
  };

  const progressPercentage = ((10 - timeLeft) / 10) * 100;

  return (
    <div className={`max-w-2xl mx-auto rounded-2xl shadow-xl p-8 ${
      isDark ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Flash Card {currentQuestionIndex + 1} of {totalQuestions}
          </span>
          <span className="text-sm font-semibold text-blue-600">
            {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%
          </span>
        </div>
        <div className={`w-full rounded-full h-2 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div
            className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Timer Section */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Clock className={`w-6 h-6 ${timeLeft <= 3 ? 'text-red-500' : 'text-blue-500'}`} />
          <span className={`text-2xl font-bold ${
            timeLeft <= 3 
              ? 'text-red-500' 
              : isDark ? 'text-blue-400' : 'text-blue-600'
          }`}>
            {timeLeft}s
          </span>
        </div>
        
        {/* Time Progress Bar */}
        <div className={`w-full rounded-full h-3 mb-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
          <div
            className={`h-3 rounded-full transition-all duration-1000 ${
              timeLeft <= 3 
                ? 'bg-gradient-to-r from-red-400 to-red-600' 
                : 'bg-gradient-to-r from-green-400 to-blue-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Flash Card Display */}
      <div className="mb-8">
        <div className={`text-center p-8 rounded-2xl border-2 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-700 to-gray-600 border-gray-500' 
            : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
        }`}>
          <div className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            {question.flashCardType === 'kannada-to-english' 
              ? 'What is the English meaning?' 
              : 'What is the Kannada word?'
            }
          </div>
          <div className={`text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {question.flashCardWord}
          </div>
          <div className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Student answers orally
          </div>
        </div>
      </div>

      {/* Teacher Buttons */}
      {!showAnswer && !hasAnswered && timeLeft > 0 && (
        <div className="space-y-4 mb-6">
          <div className={`text-center text-lg font-semibold mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Teacher: Did the student answer correctly?
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleTeacherResponse(true)}
              className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Correct
            </button>
            <button
              onClick={() => handleTeacherResponse(false)}
              className="bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              Wrong
            </button>
          </div>
        </div>
      )}

      {/* Time's Up Message */}
      {timeLeft === 0 && !hasAnswered && (
        <div className="mb-6">
          <div className={`p-4 rounded-xl border text-center ${
            isDark 
              ? 'bg-orange-900/20 border-orange-700 text-orange-300'
              : 'bg-orange-50 border-orange-200 text-orange-800'
          }`}>
            <Clock className="w-6 h-6 mx-auto mb-2" />
            <div className="font-semibold">Time's up!</div>
            <div className="text-sm">Student gets 0 points for this card.</div>
          </div>
        </div>
      )}

      {/* Answer Explanation */}
      {showAnswer && (
        <div className="mb-6">
          <div className={`p-4 rounded-xl border ${
            isCorrect 
              ? isDark 
                ? 'bg-green-900/20 border-green-700'
                : 'bg-green-50 border-green-200'
              : isDark
                ? 'bg-red-900/20 border-red-700'
                : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600" />
              )}
              <span className={`font-semibold ${
                isCorrect 
                  ? isDark ? 'text-green-300' : 'text-green-800'
                  : isDark ? 'text-red-300' : 'text-red-800'
              }`}>
                {isCorrect ? 'Correct!' : 'Incorrect!'}
              </span>
            </div>
            <div className={`mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <strong>Answer:</strong> {question.correctAnswer}
            </div>
            {question.explanation && (
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{question.explanation}</p>
            )}
            {isCorrect && (
              <div className={`mt-2 text-sm ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                <strong>Points earned:</strong> {timeLeft} points
              </div>
            )}
          </div>
        </div>
      )}

      {/* Next Button */}
      {(showAnswer || (timeLeft === 0 && !hasAnswered)) && (
        <button
          onClick={onNextQuestion}
          className="w-full bg-gradient-to-r from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          {currentQuestionIndex + 1 === totalQuestions ? 'View Results' : 'Next Flash Card'}
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
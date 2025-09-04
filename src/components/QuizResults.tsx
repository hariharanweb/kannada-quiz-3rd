import React from 'react';
import { Trophy, Star, RotateCcw, Home } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Subject } from '../types/quiz';

interface QuizResultsProps {
  subject: Subject;
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onBackToSettings: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  subject,
  score,
  totalQuestions,
  onRestart,
  onBackToSettings
}) => {
  const isDark= useTheme(),
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getGrade = () => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', message: 'Outstanding!' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-500', message: 'Excellent!' };
    if (percentage >= 70) return { grade: 'B+', color: 'text-blue-500', message: 'Very Good!' };
    if (percentage >= 60) return { grade: 'B', color: 'text-blue-400', message: 'Good!' };
    if (percentage >= 50) return { grade: 'C', color: 'text-yellow-500', message: 'Keep Practicing!' };
    return { grade: 'D', color: 'text-red-500', message: 'Need More Practice!' };
  };

  const { grade, color, message } = getGrade();

  const getStars = () => {
    if (percentage >= 90) return 3;
    if (percentage >= 70) return 2;
    if (percentage >= 50) return 1;
    return 0;
  };

  const stars = getStars();

  const getButtonGradient = () => {
    return subject === 'kannada' 
      ? 'from-orange-400 to-red-500 hover:from-orange-500 hover:to-red-600'
      : 'from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600';
  };

  return (
    <div className={`max-w-md mx-auto rounded-2xl shadow-xl p-8 text-center ${
      isDark ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Trophy Icon */}
      <div className="mb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
          <Trophy className="w-10 h-10 text-white" />
        </div>
        
        {/* Stars */}
        <div className="flex justify-center gap-1 mb-2">
          {[1, 2, 3].map((star) => (
            <Star
              key={star}
              className={`w-6 h-6 ${
                star <= stars ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Quiz Complete!</h2>
        <p className={`text-xl font-semibold mb-4 ${color}`}>{message}</p>
        
        <div className={`rounded-xl p-6 mb-4 ${
          isDark 
            ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20' 
            : 'bg-gradient-to-r from-blue-50 to-purple-50'
        }`}>
          <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {score}/{totalQuestions}
          </div>
          <div className="text-lg text-gray-600 mb-2">
            {percentage}% Correct
          </div>
          <div className={`text-2xl font-bold ${color}`}>
            Grade: {grade}
          </div>
        </div>

        {/* Encouragement Message */}
        <div className={`rounded-xl p-4 ${
          isDark 
            ? 'bg-gradient-to-r from-green-900/20 to-blue-900/20' 
            : 'bg-gradient-to-r from-green-50 to-blue-50'
        }`}>
          <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            {percentage >= 80 
              ? `Great job! You're mastering ${subject === 'kannada' ? 'Kannada' : 'Hindi'}!`
              : percentage >= 60
              ? "Good effort! Keep practicing to improve!"
              : "Don't give up! Practice makes perfect!"}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onRestart}
          className={`w-full bg-gradient-to-r ${getButtonGradient()} text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2`}
        >
          <RotateCcw className="w-5 h-5" />
          Try Again
        </button>
        
        <button
          onClick={onBackToSettings}
          className={`w-full font-bold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 ${
            isDark 
              ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white'
              : 'bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white'
          }`}
        >
          <Home className="w-5 h-5" />
          Back to Settings
        </button>
      </div>
    </div>
  );
};
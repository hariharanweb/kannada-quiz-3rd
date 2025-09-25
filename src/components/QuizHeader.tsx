import React from 'react';
import { BookOpen, Award } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Subject } from '../types/quiz';

interface QuizHeaderProps {
  subject?: Subject;
  score?: number;
  totalQuestions?: number;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({ subject, score, totalQuestions }) => {
  const { isDark } = useTheme();

  const getSubjectTitle = () => {
    if (!subject) return 'Language Quiz';
    if (subject === 'kannada') return 'ಕನ್ನಡ Quiz';
    if (subject === 'hindi') return 'हिंदी Quiz';
    return 'Geography Quiz';
  };

  const getGradient = () => {
    if (!subject) return 'from-purple-400 to-pink-500';
    if (subject === 'kannada') return 'from-orange-400 to-red-500';
    if (subject === 'hindi') return 'from-green-400 to-blue-500';
    return 'from-blue-400 to-purple-500';
  };

  const getTextGradient = () => {
    if (!subject) return 'from-purple-500 to-pink-600';
    if (subject === 'kannada') return 'from-orange-500 to-red-600';
    if (subject === 'hindi') return 'from-green-500 to-blue-600';
    return 'from-blue-500 to-purple-600';
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br ${getGradient()} rounded-full`}>
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <h1 className={`text-3xl font-bold bg-gradient-to-r ${getTextGradient()} bg-clip-text text-transparent`}>
          {getSubjectTitle()}
        </h1>
      </div>
      
      <p className={`text-center text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        {subject === 'kannada' ? 'Learn Kannada the Fun Way!' :
         subject === 'hindi' ? 'Learn Hindi the Fun Way!' :
         subject === 'geography' ? 'Learn Geography the Fun Way!' :
         'Learn Languages the Fun Way!'}
      </p>
      
      {score !== undefined && totalQuestions !== undefined && (
        <div className="flex justify-center mt-3">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-sm ${
            isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
          }`}>
            <Award className="w-4 h-4" />
            Score: {score}/{totalQuestions}
          </div>
        </div>
      )}
    </div>
  );
};
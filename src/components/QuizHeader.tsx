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
    return subject === 'kannada' ? 'ಕನ್ನಡ Quiz' : 'हिंदी Quiz';
  };

  const getGradient = () => {
    if (!subject) return 'from-purple-400 to-pink-500';
    return subject === 'kannada' ? 'from-orange-400 to-red-500' : 'from-green-400 to-blue-500';
  };

  const getTextGradient = () => {
    if (!subject) return 'from-purple-500 to-pink-600';
    return subject === 'kannada' ? 'from-orange-500 to-red-600' : 'from-green-500 to-blue-600';
  };

  return (
    <div className="text-center mb-8">
      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${getGradient()} rounded-full mb-4`}>
        <BookOpen className="w-8 h-8 text-white" />
      </div>
      <h1 className={`text-4xl font-bold bg-gradient-to-r ${getTextGradient()} bg-clip-text text-transparent mb-2`}>
        {getSubjectTitle()}
      </h1>
      <p className="text-gray-600 text-lg">
        {subject === 'kannada' ? 'Learn Kannada the Fun Way!' : 
         subject === 'hindi' ? 'Learn Hindi the Fun Way!' : 
         'Learn Languages the Fun Way!'}
      </p>
      
      {score !== undefined && totalQuestions !== undefined && (
        <div className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
          isDark ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
        }`}>
          <Award className="w-4 h-4" />
          Score: {score}/{totalQuestions}
        </div>
      )}
    </div>
  );
};
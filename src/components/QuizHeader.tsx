import React from 'react';
import { BookOpen, Award } from 'lucide-react';

interface QuizHeaderProps {
  score?: number;
  totalQuestions?: number;
}

export const QuizHeader: React.FC<QuizHeaderProps> = ({ score, totalQuestions }) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-4">
        <BookOpen className="w-8 h-8 text-white" />
      </div>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent mb-2">
        ಕನ್ನಡ Quiz
      </h1>
      <p className="text-gray-600 text-lg">Learn Kannada the Fun Way!</p>
      
      {score !== undefined && totalQuestions !== undefined && (
        <div className="mt-4 inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
          <Award className="w-4 h-4" />
          Score: {score}/{totalQuestions}
        </div>
      )}
    </div>
  );
};
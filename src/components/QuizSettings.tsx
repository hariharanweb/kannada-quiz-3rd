import React from 'react';
import { Settings, Play } from 'lucide-react';

interface QuizSettingsProps {
  questionCount: number;
  onQuestionCountChange: (count: number) => void;
  onStartQuiz: () => void;
}

export const QuizSettings: React.FC<QuizSettingsProps> = ({
  questionCount,
  onQuestionCountChange,
  onStartQuiz
}) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-4">
          <Settings className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Quiz Settings</h2>
        <p className="text-gray-600">Configure your Kannada quiz</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Number of Questions
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[10, 15, 20, 25].map((count) => (
              <button
                key={count}
                onClick={() => onQuestionCountChange(count)}
                className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  questionCount === count
                    ? 'bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg transform scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                }`}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Question Types:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Letter sequence (before/after)</li>
            <li>• Kannada to English translation</li>
            <li>• English to Kannada translation</li>
            <li>• Kannada numbers to English (1-50)</li>
            <li>• English numbers to Kannada (1-50)</li>
          </ul>
        </div>

        <button
          onClick={onStartQuiz}
          className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-4 px-6 rounded-xl hover:from-green-500 hover:to-blue-600 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          Start Quiz
        </button>
      </div>
    </div>
  );
};
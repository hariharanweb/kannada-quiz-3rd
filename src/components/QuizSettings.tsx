import React from 'react';
import { Settings, Play, ArrowLeft, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Subject } from '../types/quiz';

interface QuizSettingsProps {
  subject: Subject;
  questionCount: number;
  flashCardCount: number;
  onQuestionCountChange: (count: number) => void;
  onFlashCardCountChange: (count: number) => void;
  onStartQuiz: () => void;
  onStartFlashCards: () => void;
  onBackToSubjects: () => void;
}

export const QuizSettings: React.FC<QuizSettingsProps> = ({
  subject,
  questionCount,
  flashCardCount,
  onQuestionCountChange,
  onFlashCardCountChange,
  onStartQuiz,
  onStartFlashCards,
  onBackToSubjects
}) => {
  const isDark= useTheme();
  const getSubjectInfo = () => {
    if (subject === 'kannada') {
      return {
        title: 'ಕನ್ನಡ Quiz',
        subtitle: 'Kannada Learning Quiz',
        gradient: 'from-orange-400 to-red-500',
        bgGradient: 'from-orange-50 to-red-50',
        questionTypes: [
          '• Letter sequence (before/after)',
          '• Kannada to English translation',
          '• English to Kannada translation',
          '• Kannada numbers to English (1-50)',
          '• English numbers to Kannada (1-50)'
        ]
      };
    } else {
      return {
        title: 'हिंदी Quiz',
        subtitle: 'Hindi Learning Quiz',
        gradient: 'from-green-400 to-blue-500',
        bgGradient: 'from-green-50 to-blue-50',
        questionTypes: [
          '• Gender identification (male/female)',
          '• Hindi to English meanings',
          '• English to Hindi translations',
          '• Identify nouns and verbs',
          '• Singular and plural forms'
        ]
      };
    }
  };

  const subjectInfo = getSubjectInfo();

  return (
    <div className={`max-w-4xl mx-auto rounded-2xl shadow-xl p-8 ${
      isDark ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* Back Button */}
      <button
        onClick={onBackToSubjects}
        className={`mb-4 flex items-center gap-2 transition-colors duration-200 ${
          isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Subjects
      </button>

      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${subjectInfo.gradient} rounded-full mb-4`}>
          <Settings className="w-8 h-8 text-white" />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>{subjectInfo.title} Settings</h2>
        <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Configure your {subjectInfo.subtitle}</p>
      </div>

      <div className={`${subject === 'kannada' ? 'grid md:grid-cols-2 gap-6' : 'max-w-md mx-auto'}`}>
        {/* Regular Quiz Section */}
        <div className={`rounded-2xl p-6 border-2 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-600' 
            : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
        }`}>
          <h3 className={`text-lg font-bold mb-4 text-center ${isDark ? 'text-white' : 'text-gray-800'}`}>
            📝 Regular Quiz
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                Number of Questions
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 20, 25].map((count) => (
                  <button
                    key={count}
                    onClick={() => onQuestionCountChange(count)}
                    className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                      questionCount === count
                        ? `bg-gradient-to-r ${subjectInfo.gradient} text-white shadow-lg transform scale-105`
                        : isDark 
                          ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className={`rounded-xl p-4 ${
              isDark 
                ? 'bg-gradient-to-r from-gray-700 to-gray-600' 
                : `bg-gradient-to-r ${subjectInfo.bgGradient}`
            }`}>
              <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>Question Types:</h4>
              <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>
                {subjectInfo.questionTypes.map((type, index) => (
                  <li key={index}>{type}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={onStartQuiz}
              className={`w-full bg-gradient-to-r ${subjectInfo.gradient} text-white font-bold py-4 px-6 rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2`}
            >
              <Play className="w-5 h-5" />
              Start Quiz
            </button>
          </div>
        </div>

        {/* Flash Cards Section - Only for Kannada */}
        {subject === 'kannada' && (
          <div className={`rounded-2xl p-6 border-2 ${
            isDark 
              ? 'bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-600/50' 
              : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'
          }`}>
            <h3 className={`text-lg font-bold mb-4 text-center ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>
              ⚡ Flash Cards
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-3 ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
                  Number of Flash Cards
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[5, 10, 15, 20].map((count) => (
                    <button
                      key={count}
                      onClick={() => onFlashCardCountChange(count)}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                        flashCardCount === count
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                          : isDark 
                            ? 'bg-purple-800/30 text-purple-200 hover:bg-purple-700/50 hover:scale-105'
                            : 'bg-purple-100 text-purple-700 hover:bg-purple-200 hover:scale-105'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`rounded-xl p-4 ${
                isDark 
                  ? 'bg-gradient-to-r from-purple-800/30 to-pink-800/30' 
                  : 'bg-gradient-to-r from-purple-100 to-pink-100'
              }`}>
                <h4 className={`font-semibold mb-2 ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>How it Works:</h4>
                <ul className={`text-sm space-y-1 ${isDark ? 'text-purple-200' : 'text-purple-700'}`}>
                  <li>• Shows Kannada or English words</li>
                  <li>• Student answers orally in 10 seconds</li>
                  <li>• Teacher clicks Correct/Wrong</li>
                  <li>• Points = time remaining (faster = more points)</li>
                </ul>
              </div>

              <button
                onClick={onStartFlashCards}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:opacity-90 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Start Flash Cards ({flashCardCount} cards)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
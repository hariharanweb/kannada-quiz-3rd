import React from 'react';
import { Settings, Play, ArrowLeft, Zap } from 'lucide-react';
import { Subject } from '../types/quiz';
import { themeStyles } from '../styles/themeStyles';

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
    } else if (subject === 'hindi') {
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
    } else {
      return {
        title: 'Geography Quiz',
        subtitle: 'Geography Learning Quiz',
        gradient: 'from-blue-400 to-purple-500',
        bgGradient: 'from-blue-50 to-purple-50',
        questionTypes: [
          '• Indian states and capitals',
          '• Interactive map-based questions',
          '• Union territories',
          '• Click on the correct state/UT',
          '• Visual geography learning'
        ]
      };
    }
  };

  const subjectInfo = getSubjectInfo();

  return (
    <div className={`max-w-4xl mx-auto rounded-2xl shadow-xl p-8 ${themeStyles.bg.card}`}>
      {/* Back Button */}
      <button
        onClick={onBackToSubjects}
        className={`mb-4 flex items-center gap-2 transition-colors duration-200 ${themeStyles.text.secondary} hover:opacity-80`}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Subjects
      </button>

      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${subjectInfo.gradient} rounded-full mb-4`}>
          <Settings className="w-8 h-8 text-white" />
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${themeStyles.text.primary}`}>{subjectInfo.title} Settings</h2>
        <p className={themeStyles.text.secondary}>Configure your {subjectInfo.subtitle}</p>
      </div>

      <div className={`${subject === 'kannada' ? 'grid md:grid-cols-2 gap-6' : 'max-w-md mx-auto'}`}>
        {/* Regular Quiz Section */}
        <div className={`rounded-2xl p-6 border-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 ${themeStyles.border.primary}`}>
          <h3 className={`text-lg font-bold mb-4 text-center ${themeStyles.text.primary}`}>
            📝 Regular Quiz
          </h3>

          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-semibold mb-3 ${themeStyles.text.secondary}`}>
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
                        : `${themeStyles.bg.secondary} ${themeStyles.text.primary} hover:opacity-80 hover:scale-105`
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className={`rounded-xl p-4 bg-gradient-to-r ${subjectInfo.bgGradient} dark:from-gray-700 dark:to-gray-600`}>
              <h4 className={`font-semibold mb-2 ${themeStyles.text.primary}`}>Question Types:</h4>
              <ul className={`text-sm space-y-1 ${themeStyles.text.secondary}`}>
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
          <div className="rounded-2xl p-6 border-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-600/50">
            <h3 className="text-lg font-bold mb-4 text-center text-purple-800 dark:text-purple-300">
              ⚡ Flash Cards
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-3 text-purple-700 dark:text-purple-200">
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
                          : 'bg-purple-100 text-purple-700 dark:bg-purple-800/30 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-700/50 hover:scale-105'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-xl p-4 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800/30 dark:to-pink-800/30">
                <h4 className="font-semibold mb-2 text-purple-800 dark:text-purple-300">How it Works:</h4>
                <ul className="text-sm space-y-1 text-purple-700 dark:text-purple-200">
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
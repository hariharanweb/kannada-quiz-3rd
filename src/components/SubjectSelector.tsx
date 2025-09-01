import React from 'react';
import { BookOpen, Globe } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Subject } from '../types/quiz';

interface SubjectSelectorProps {
  onSubjectSelect: (subject: Subject) => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({ onSubjectSelect }) => {
  const { isDark } = useTheme();

  return (
    <div className={`max-w-2xl mx-auto rounded-2xl shadow-xl p-8 ${
      isDark ? 'bg-gray-800' : 'bg-white'
    }`}>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mb-6">
          <Globe className="w-10 h-10 text-white" />
        </div>
        <h2 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-800'}`}>Choose Your Subject</h2>
        <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Select a language to start learning!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Kannada Subject */}
        <button
          onClick={() => onSubjectSelect('kannada')}
          className={`group rounded-2xl p-8 border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
            isDark 
              ? 'bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-700 hover:from-orange-800/30 hover:to-red-800/30 hover:border-orange-600'
              : 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:from-orange-100 hover:to-red-100 hover:border-orange-300'
          }`}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>ಕನ್ನಡ</h3>
            <p className="text-lg font-semibold text-orange-600 mb-3">Kannada</p>
            <div className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>• Letter sequences</p>
              <p>• Word translations</p>
              <p>• Number recognition</p>
            </div>
          </div>
        </button>

        {/* Hindi Subject */}
        <button
          onClick={() => onSubjectSelect('hindi')}
          className={`group rounded-2xl p-8 border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${
            isDark 
              ? 'bg-gradient-to-br from-green-900/20 to-blue-900/20 border-green-700 hover:from-green-800/30 hover:to-blue-800/30 hover:border-green-600'
              : 'bg-gradient-to-br from-green-50 to-blue-50 border-green-200 hover:from-green-100 hover:to-blue-100 hover:border-green-300'
          }`}
        >
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>हिंदी</h3>
            <p className="text-lg font-semibold text-green-600 mb-3">Hindi</p>
            <div className={`text-sm space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <p>• Gender identification</p>
              <p>• Word meanings</p>
              <p>• Nouns & Verbs</p>
              <p>• Singular & Plural</p>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-8 text-center">
        <div className={`rounded-xl p-4 ${
          isDark 
            ? 'bg-gradient-to-r from-purple-900/20 to-pink-900/20' 
            : 'bg-gradient-to-r from-purple-50 to-pink-50'
        }`}>
          <p className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Choose your preferred language to start an interactive learning quiz!
          </p>
        </div>
      </div>
    </div>
  );
};
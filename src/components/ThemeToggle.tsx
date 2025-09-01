import React from 'react';
import { Lightbulb } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`fixed top-6 right-6 p-3 rounded-full transition-all duration-300 transform hover:scale-110 shadow-lg z-50 ${
        isDark 
          ? 'bg-yellow-400 hover:bg-yellow-300 text-gray-900' 
          : 'bg-gray-800 hover:bg-gray-700 text-yellow-400'
      }`}
      title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
    >
      <Lightbulb className={`w-6 h-6 transition-transform duration-300 ${isDark ? 'rotate-0' : 'rotate-12'}`} />
    </button>
  );
};
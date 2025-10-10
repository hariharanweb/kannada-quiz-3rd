/**
 * Centralized theme styles to avoid isDark checks throughout the codebase.
 * Use these utility functions to get consistent theme-aware styles.
 */

export const themeStyles = {
  // Background styles
  bg: {
    primary: 'bg-white dark:bg-gray-800',
    secondary: 'bg-gray-50 dark:bg-gray-700',
    tertiary: 'bg-gray-100 dark:bg-gray-600',
    gradient: 'bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
    card: 'bg-white dark:bg-gray-800',
  },

  // Text styles
  text: {
    primary: 'text-gray-800 dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-300',
    tertiary: 'text-gray-500 dark:text-gray-400',
    muted: 'text-gray-400 dark:text-gray-500',
  },

  // Border styles
  border: {
    primary: 'border-gray-200 dark:border-gray-600',
    secondary: 'border-gray-300 dark:border-gray-500',
  },

  // Interactive elements
  button: {
    primary: 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600',
    disabled: 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed',
  },

  // State-based styles
  state: {
    selected: 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-600 dark:text-blue-200',
    correct: 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-600 dark:text-green-200',
    incorrect: 'bg-red-100 border-red-300 text-red-800 dark:bg-red-900 dark:border-red-600 dark:text-red-200',
    hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/50',
    info: 'bg-blue-100 hover:bg-blue-200 text-blue-600 dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-blue-200',
  },

  // Feedback backgrounds
  feedback: {
    correct: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700',
    incorrect: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700',
  },

  // Input styles
  input: {
    base: 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-white',
    hover: 'hover:border-blue-300 dark:hover:border-blue-500',
  },

  // Specialized components
  progress: {
    bg: 'bg-gray-200 dark:bg-gray-700',
    bar: 'bg-gradient-to-r from-blue-400 to-purple-500',
  },

  // Card styles
  card: {
    base: 'bg-white dark:bg-gray-800 rounded-2xl shadow-xl',
    hover: 'hover:shadow-2xl transition-shadow',
  },

  // Sentence/content areas
  content: {
    highlight: 'bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
  },

  // Option/Answer button styles
  option: {
    base: 'bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600 text-gray-800 dark:text-gray-200',
    hover: 'hover:border-blue-300 hover:bg-blue-50 dark:hover:border-blue-500 dark:hover:bg-blue-900/30',
    disabled: 'bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300',
  },

  // Word selection (for noun/verb questions)
  word: {
    base: 'bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    hover: 'hover:bg-blue-50 dark:hover:bg-blue-900/50 cursor-pointer',
  },

  // Tooltip
  tooltip: {
    base: 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-800',
  },
};

/**
 * Combine multiple theme style classes
 */
export const combineStyles = (...styles: string[]): string => {
  return styles.filter(Boolean).join(' ');
};

/**
 * Get feedback text color based on correctness
 */
export const getFeedbackTextColor = (isCorrect: boolean): string => {
  return isCorrect
    ? 'text-green-800 dark:text-green-300'
    : 'text-red-800 dark:text-red-300';
};

/**
 * Get option style based on state (not selected, selected, correct, incorrect)
 */
export const getOptionStateStyle = (
  isSelected: boolean,
  showAnswer: boolean,
  isCorrect: boolean,
  isCorrectAnswer: boolean
): string => {
  if (!showAnswer) {
    return isSelected
      ? themeStyles.state.selected
      : combineStyles(themeStyles.option.base, themeStyles.option.hover);
  }

  if (isCorrectAnswer) {
    return themeStyles.state.correct;
  }

  if (isSelected && !isCorrect) {
    return themeStyles.state.incorrect;
  }

  return themeStyles.option.disabled;
};

/**
 * Get word style for multi-select questions
 */
export const getWordStateStyle = (
  isSelected: boolean,
  showAnswer: boolean,
  isCorrectAnswer: boolean
): string => {
  if (!showAnswer) {
    return isSelected
      ? combineStyles(themeStyles.state.selected, 'cursor-pointer')
      : combineStyles(themeStyles.word.base, themeStyles.word.hover);
  }

  if (isCorrectAnswer) {
    return themeStyles.state.correct;
  }

  if (isSelected && !isCorrectAnswer) {
    return themeStyles.state.incorrect;
  }

  return themeStyles.word.base;
};

/**
 * Get SVG text color (for maps)
 */
export const getSvgTextColor = (
  isSelected: boolean,
  showAnswer: boolean,
  isCorrect: boolean,
  isWrong: boolean
): string => {
  if (isCorrect) return '#22C55E'; // Green
  if (isWrong) return '#EF4444'; // Red
  if (isSelected) return '#3B82F6'; // Blue
  return 'currentColor';
};

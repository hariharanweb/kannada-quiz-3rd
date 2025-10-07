import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import indiaSvg from '../maps/india/India-map-en.svg?raw';
import stateCapitalsData from '../maps/india/stateCapitals.json';

interface StateCapital {
  state: string;
  capital: string;
}

interface IndiaMapProps {
  onComplete?: (score: number, total: number) => void;
}

interface QuizQuestion {
  capital: string;
  correctState: string;
  options: string[];
}

export const IndiaMap: React.FC<IndiaMapProps> = ({ onComplete }) => {
  const { isDark } = useTheme();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  // Initialize quiz questions
  useEffect(() => {
    const generateQuestions = () => {
      // Shuffle and take 10 random states
      const shuffled = [...stateCapitalsData].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 10);

      return selected.map((item: StateCapital) => ({
        capital: item.capital,
        correctState: item.state,
        options: [item.state] // We'll use the map for selection, not buttons
      }));
    };

    setQuestions(generateQuestions());
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  // Create a normalized state name mapping for the SVG
  const stateNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    stateCapitalsData.forEach((item: StateCapital) => {
      // Create variations to match SVG text
      const normalized = item.state.toLowerCase().trim();
      map[normalized] = item.state;

      // Handle special cases
      if (item.state === 'Jammu - Kashmir') {
        map['jammu - kashmir'] = item.state;
        map['jammu-kashmir'] = item.state;
      }
    });
    return map;
  }, []);


  const handleStateClick = (stateName: string) => {
    if (showResult || quizComplete) return;

    const normalizedStateName = stateName.toLowerCase().trim();
    const mappedState = stateNameMap[normalizedStateName];

    if (mappedState) {
      setSelectedState(mappedState);
    }
  };

  const handleSubmit = () => {
    if (!selectedState || !currentQuestion) return;

    setShowResult(true);

    if (selectedState === currentQuestion.correctState) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedState(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
      if (onComplete) {
        onComplete(score + (selectedState === currentQuestion.correctState ? 1 : 0), questions.length);
      }
    }
  };

  const handleRestart = () => {
    const generateQuestions = () => {
      const shuffled = [...stateCapitalsData].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 10);

      return selected.map((item: StateCapital) => ({
        capital: item.capital,
        correctState: item.state,
        options: [item.state]
      }));
    };

    setQuestions(generateQuestions());
    setCurrentQuestionIndex(0);
    setSelectedState(null);
    setScore(0);
    setShowResult(false);
    setQuizComplete(false);
  };

  // Process SVG to make states clickable
  const processedSvgContent = useMemo(() => {
    if (!indiaSvg || !currentQuestion) return indiaSvg;

    let processed = indiaSvg;

    // Extract text elements and combine multi-line state names
    const textBlockPattern = /<text[^>]*>([\s\S]*?)<\/text>/g;
    const stateTexts = new Map<string, string[]>(); // Map full state name to individual parts

    let textMatch;
    while ((textMatch = textBlockPattern.exec(indiaSvg)) !== null) {
      const fullTextBlock = textMatch[0];
      const textContent = textMatch[1];

      // Skip Bengali text (check both in attributes and content)
      if (textContent.includes('প্র') ||
          fullTextBlock.includes('systemLanguage="bn"') ||
          /[\u0980-\u09FF]/.test(textContent)) {
        continue;
      }

      // Extract all tspan contents
      const tspanPattern = /<tspan[^>]*>([^<]+)<\/tspan>/g;
      const parts: string[] = [];
      const originalParts: string[] = []; // Keep original text with spaces
      let tspanMatch;

      while ((tspanMatch = tspanPattern.exec(textContent)) !== null) {
        const originalPart = tspanMatch[1];
        const part = originalPart.trim();

        // Only process English text (not Bengali)
        if (part && part !== 'INDIA' && !/[\u0980-\u09FF]/.test(part)) {
          parts.push(part);
          originalParts.push(originalPart);
        }
      }

      if (parts.length > 0) {
        const fullStateName = parts.join(' ').trim();
        if (fullStateName) {
          stateTexts.set(fullStateName, originalParts);
        }
      }
    }

    // Color all path elements (states) and make them clickable
    processed = processed.replace(/<path([^>/]*)(\/?)>/g, (match, attrs, selfClose) => {
      const idMatch = attrs.match(/id="([^"]+)"/);
      if (idMatch) {
        // Apply colors to all paths (they represent state boundaries)
        const color = '#E5E7EB';
        const cursor = 'pointer';

        // For now, we'll apply default styling
        // The actual state identification will happen through text overlay clicks

        return `<path${attrs} style="fill:${color};stroke:#ffffff;stroke-width:1;cursor:${showResult ? 'default' : cursor};transition:fill 0.3s" class="state-path"${selfClose}>`;
      }
      return match;
    });

    // Make text elements clickable and styled
    stateTexts.forEach((originalParts, fullStateName) => {
      // For each part of the state name (with original spacing), make it clickable
      originalParts.forEach(originalPart => {
        // Escape special regex characters in the original text (including spaces)
        const escapedPart = originalPart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Find and enhance each tspan containing this part (exact match with spaces)
        const tspanRegex = new RegExp(
          `<tspan([^>]*)>${escapedPart}<\\/tspan>`,
          'g'
        );

        processed = processed.replace(tspanRegex, (match, attrs) => {
          // Check if already has class attribute
          if (attrs.includes('class=')) {
            return match; // Already processed
          }
          return `<tspan${attrs} class="state-text" data-state="${fullStateName}" style="cursor:${showResult ? 'default' : 'pointer'};user-select:none;fill:${isDark ? '#ffffff' : '#000000'}">${originalPart}</tspan>`;
        });
      });
    });

    return processed;
  }, [currentQuestion, showResult, isDark]);

  // Handle clicks on SVG
  const handleSvgClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as SVGElement;

    // Check if clicked on a text element
    if (target.classList?.contains('state-text') || target.getAttribute('data-state')) {
      const stateName = target.getAttribute('data-state') || target.textContent?.trim();
      if (stateName) {
        handleStateClick(stateName);
      }
    }
  };

  if (!currentQuestion) {
    return (
      <div className={`w-full max-w-4xl mx-auto p-4 rounded-2xl ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      } shadow-xl`}>
        <p className="text-center">Loading quiz...</p>
      </div>
    );
  }

  if (quizComplete) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className={`w-full max-w-4xl mx-auto p-8 rounded-2xl ${
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
      } shadow-xl text-center`}>
        <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
        <div className="text-6xl mb-4">
          {percentage >= 80 ? '🎉' : percentage >= 60 ? '👏' : '📚'}
        </div>
        <p className="text-2xl mb-2">
          Your Score: {score} / {questions.length}
        </p>
        <p className="text-xl mb-6">
          {percentage}% Correct
        </p>
        <button
          onClick={handleRestart}
          className={`px-8 py-3 rounded-xl font-semibold transition-colors ${
            isDark
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 rounded-2xl ${
      isDark ? 'bg-gray-800' : 'bg-white'
    } shadow-xl`}>
      {/* Header */}
      <div className="text-center mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Score: {score} / {questions.length}
          </div>
        </div>

        <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          What is the capital of which state?
        </h3>

        <div className={`text-3xl font-bold mb-3 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
          {currentQuestion.capital}
        </div>

        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Click on the state name on the map
        </p>
      </div>

      {/* SVG Map */}
      <div className="flex justify-center mb-4">
        <div
          className="w-full max-w-xl"
          onClick={handleSvgClick}
          dangerouslySetInnerHTML={{ __html: processedSvgContent }}
        />
      </div>

      {/* Selected State Display */}
      {selectedState && (
        <div className={`text-center mb-3 p-3 rounded-lg ${
          isDark ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Selected: <span className="font-bold">{selectedState}</span>
          </p>
        </div>
      )}

      {/* Result Message */}
      {showResult && (
        <div className={`text-center mb-3 p-3 rounded-lg ${
          selectedState === currentQuestion.correctState
            ? isDark ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-800'
            : isDark ? 'bg-red-900/30 text-red-300' : 'bg-red-100 text-red-800'
        }`}>
          {selectedState === currentQuestion.correctState ? (
            <p className="text-lg font-bold">Correct! 🎉</p>
          ) : (
            <div>
              <p className="text-lg font-bold mb-1">Incorrect</p>
              <p className="text-sm">The correct answer is: <span className="font-bold">{currentQuestion.correctState}</span></p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mb-4">
        {!showResult ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedState}
            className={`px-6 py-2.5 rounded-xl font-semibold transition-colors ${
              selectedState
                ? isDark
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className={`px-6 py-2.5 rounded-xl font-semibold transition-colors ${
              isDark
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>

      {/* Legend */}
      <div className="pt-3 border-t">
        <div className="flex flex-wrap gap-3 justify-center text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Selected</span>
          </div>
          {showResult && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded"></div>
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Correct Answer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Your Incorrect Answer</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

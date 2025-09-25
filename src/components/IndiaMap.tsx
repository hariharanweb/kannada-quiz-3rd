import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface StateInfo {
  name: string;
  capital: string;
  code: string;
  region?: string;
  color: string;
}

interface IndiaMapProps {
  states: StateInfo[];
  unionTerritories: StateInfo[];
  selectedState?: string;
  correctState?: string;
  onStateClick?: (stateName: string) => void;
  showResult?: boolean;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  states,
  unionTerritories,
  selectedState,
  correctState,
  onStateClick,
  showResult = false
}) => {
  const { isDark } = useTheme();
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    // Load SVG content
    fetch('/maps/india/india.svg')
      .then(response => response.text())
      .then(data => setSvgContent(data))
      .catch(error => console.error('Error loading SVG:', error));
  }, []);

  // Create a mapping from state codes to state names
  const codeToName = React.useMemo(() => {
    const mapping: Record<string, string> = {};
    [...states, ...unionTerritories].forEach(item => {
      mapping[`IN-${item.code}`] = item.name;
    });
    return mapping;
  }, [states, unionTerritories]);

  const getStateColor = (stateName: string) => {
    if (showResult) {
      if (stateName === correctState) {
        return '#22C55E'; // Green for correct
      }
      if (stateName === selectedState && stateName !== correctState) {
        return '#EF4444'; // Red for incorrect
      }
    } else if (stateName === selectedState) {
      return '#3B82F6'; // Blue for selected
    }

    const stateInfo = [...states, ...unionTerritories].find(s => s.name === stateName);
    return stateInfo?.color || '#94A3B8';
  };

  const handleStateClick = (stateName: string) => {
    if (!showResult && onStateClick) {
      onStateClick(stateName);
    }
  };

  // Process SVG content to add interactivity
  const processedSvgContent = React.useMemo(() => {
    if (!svgContent) return '';

    let processed = svgContent;

    // Add colors and click handlers to each state path
    Object.keys(codeToName).forEach(stateCode => {
      const stateName = codeToName[stateCode];
      const color = getStateColor(stateName);

      // Replace the path element with colored and clickable version
      const pathRegex = new RegExp(`<path[^>]+id="${stateCode}"[^>]*>`, 'g');
      processed = processed.replace(pathRegex, (match) => {
        // Extract existing attributes and add our styles
        return match.replace(
          /<path/,
          `<path style="fill:${color};stroke:#ffffff;stroke-width:1;cursor:${showResult ? 'default' : 'pointer'}" class="state-path" data-state="${stateName}"`
        );
      });
    });

    return processed;
  }, [svgContent, codeToName, selectedState, correctState, showResult, states, unionTerritories]);


  // Handle SVG click events
  const handleSvgClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as SVGPathElement;
    if (target.classList.contains('state-path')) {
      const stateName = target.getAttribute('data-state');
      if (stateName) {
        handleStateClick(stateName);
      }
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto p-4 rounded-2xl ${
      isDark ? 'bg-gray-800' : 'bg-white'
    } shadow-xl`}>
      <div className="text-center mb-6">
        <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
          Map of India
        </h3>
        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          Click on the state to select your answer
        </p>
      </div>

      {/* SVG Map */}
      <div className="flex justify-center mb-6">
        <div
          className="w-full max-w-2xl"
          onClick={handleSvgClick}
          dangerouslySetInnerHTML={{ __html: processedSvgContent }}
        />
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Selected</span>
          </div>
          {showResult && (
            <>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Correct Answer</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>Incorrect</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
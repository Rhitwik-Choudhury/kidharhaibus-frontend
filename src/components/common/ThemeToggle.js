import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * Small, accessible toggle that flips the app between light/dark.
 * Uses ThemeContext so any part of the app can react to the change.
 */
const ThemeToggle = ({ className = '' }) => {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <button
      type="button"
      onClick={() => setDarkMode(!darkMode)}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Light mode' : 'Dark mode'}
      className={`inline-flex items-center justify-center h-10 w-10 rounded-lg border 
                  border-gray-300/60 dark:border-gray-700/60 
                  bg-white/60 dark:bg-gray-900/60 
                  hover:bg-white dark:hover:bg-gray-800 
                  shadow-sm backdrop-blur transition-colors ${className}`}
    >
      {darkMode ? (
        <Sun className="h-5 w-5 text-amber-400" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700" />
      )}
    </button>
  );
};

export default ThemeToggle;

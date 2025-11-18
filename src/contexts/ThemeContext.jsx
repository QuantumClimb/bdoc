/**
 * ThemeContext - Global theme management (light/dark mode)
 */

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    // Always default to dark mode
    const saved = localStorage.getItem('bdoc_theme');
    if (!saved) {
      localStorage.setItem('bdoc_theme', 'dark');
      document.documentElement.classList.add('dark'); // Apply dark class immediately
      return true; // Default to dark mode
    }
    const isDarkMode = saved === 'dark';
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
    return isDarkMode;
  });

  useEffect(() => {
    localStorage.setItem('bdoc_theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initial theme state (default to 'light')
  const [theme, setTheme] = useState<Theme>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme on component mount
  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Priority: localStorage > system preference > default 'light'
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (systemPrefersDark) {
      setTheme('dark');
    }

    // Apply theme class to document
    updateThemeClass('light', 'dark');
    setIsInitialized(true);
  }, []);

  // Update the DOM when theme changes
  useEffect(() => {
    if (!isInitialized) return;
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Update document classes
    updateThemeClass('light', 'dark');
  }, [theme, isInitialized]);

  // Helper to update document class
  const updateThemeClass = (lightClass: string, darkClass: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.add(darkClass);
      document.documentElement.classList.remove(lightClass);
    } else {
      document.documentElement.classList.remove(darkClass);
      document.documentElement.classList.add(lightClass);
    }
  };

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  // Debug helper to see theme state
  console.debug('Current theme:', theme, isInitialized ? 'initialized' : 'initializing');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 
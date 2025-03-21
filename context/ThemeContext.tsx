"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Create a singleton to track if we've initialized already
let hasInitialized = false;

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initial theme state (default to 'light')
  const [theme, setTheme] = useState<Theme>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme on component mount
  useEffect(() => {
    // Prevent multiple initializations during development mode
    if (hasInitialized) {
      setIsInitialized(true);
      return;
    }
    
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
    updateThemeClass();
    setIsInitialized(true);
    hasInitialized = true;
    
    // Log only once during initialization
    console.debug('Theme system initialized');
  }, []);

  // Update the DOM when theme changes
  useEffect(() => {
    if (!isInitialized) return;
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Update document classes
    updateThemeClass();

    // Only log theme changes after initialization
    console.debug('Theme changed to:', theme);
  }, [theme, isInitialized]);

  // Helper to update document class
  const updateThemeClass = () => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

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
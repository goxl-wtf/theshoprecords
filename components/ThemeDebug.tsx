'use client';

import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState } from "react";

export default function ThemeDebug() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [systemTheme, setSystemTheme] = useState<string | null>(null);
  
  useEffect(() => {
    setMounted(true);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setSystemTheme(prefersDark ? 'dark' : 'light');
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="theme-debug">
      <div>App Theme: <strong>{theme}</strong></div>
      <div>System Theme: <strong>{systemTheme}</strong></div>
      <div>HTML Class: <strong>{document.documentElement.classList.contains('dark') ? 'dark' : 'light'}</strong></div>
    </div>
  );
} 
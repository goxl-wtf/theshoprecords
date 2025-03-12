"use client";

import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import { FiMoon, FiSun } from "react-icons/fi";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Effect to handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // If not mounted yet (during SSR or before hydration), show skeleton loader
  if (!mounted) {
    return (
      <button 
        className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center animate-pulse"
        aria-label="Loading theme toggle"
        disabled
      >
        <span className="sr-only">Loading theme toggle</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? (
        <FiSun className="w-5 h-5 text-yellow-400" />
      ) : (
        <FiMoon className="w-5 h-5 text-indigo-700" />
      )}
    </button>
  );
} 
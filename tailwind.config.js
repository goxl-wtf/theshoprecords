/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Use class for manual theme toggling
  theme: {
    extend: {
      colors: {
        primary: "#ff0099", // Pink color for accents
        secondary: "#6441a5", // Purple for gradients
        dark: {
          100: "#1a1a1a",
          200: "#151515",
          300: "#111111",
          400: "#0a0a0a",
          500: "#050505",
        },
        light: {
          100: "#ffffff",
          200: "#f5f5f5",
          300: "#e5e5e5",
          400: "#d4d4d4",
          500: "#a3a3a3",
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 
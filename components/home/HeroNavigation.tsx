'use client';

import React from 'react';
import { cn } from '../../utils/classNames';

interface HeroNavigationProps {
  totalSlides: number;
  currentSlide: number;
  onPrevClick: () => void;
  onNextClick: () => void;
  onDotClick: (index: number) => void;
  className?: string;
}

const HeroNavigation: React.FC<HeroNavigationProps> = ({
  totalSlides,
  currentSlide,
  onPrevClick,
  onNextClick,
  onDotClick,
  className
}) => {
  return (
    <div className={cn("flex justify-center mt-8", className)}>
      {/* Prev Button */}
      <button 
        onClick={onPrevClick}
        className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded-full mr-4 focus:outline-none shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300"
        aria-label="Previous album"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {/* Dots */}
      <div className="flex space-x-2 items-center">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={`w-3 h-3 rounded-full focus:outline-none transform transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-primary scale-125 shadow-md' 
                : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Next Button */}
      <button 
        onClick={onNextClick}
        className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 p-2 rounded-full ml-4 focus:outline-none shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-300"
        aria-label="Next album"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default HeroNavigation; 
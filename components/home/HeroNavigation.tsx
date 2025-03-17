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
    <div className={cn("flex justify-center mt-8 mb-4", className)}>
      {/* Dots */}
      <div className="flex space-x-3 items-center py-2 px-1">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => onDotClick(index)}
            className={`w-3 h-3 rounded-full focus:outline-none transform transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-primary scale-125 shadow-md' 
                : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
            }`}
            style={{ 
              margin: "0 6px",
              transformOrigin: "center"
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroNavigation; 
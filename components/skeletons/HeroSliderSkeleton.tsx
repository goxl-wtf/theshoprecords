'use client';

import React from 'react';
import { cn } from '../../utils/classNames';

interface HeroSliderSkeletonProps {
  className?: string;
}

const HeroSliderSkeleton: React.FC<HeroSliderSkeletonProps> = ({ className }) => {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* Left side - Album Image placeholder */}
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <div className="relative">
            <div className="w-[400px] h-[400px] bg-gray-200 dark:bg-dark-300 rounded-lg" />
            <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-gray-300 dark:bg-dark-400 rounded-full" />
          </div>
        </div>
        
        {/* Right side - Content placeholders */}
        <div className="md:w-1/2 text-center md:text-left">
          <div className="space-y-3">
            {/* Artist and title placeholders */}
            <div className="space-y-2">
              <div className="h-8 w-3/4 bg-gray-300 dark:bg-dark-400 rounded mx-auto md:mx-0" />
              <div className="h-8 w-full bg-gray-300 dark:bg-dark-400 rounded mx-auto md:mx-0" />
            </div>
            
            {/* Rating placeholder */}
            <div className="flex items-center justify-center md:justify-start my-4">
              <div className="flex items-center mr-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-5 w-5 bg-gray-200 dark:bg-dark-300 rounded-full mx-0.5" />
                ))}
              </div>
              <div className="h-4 w-20 bg-gray-200 dark:bg-dark-300 rounded" />
            </div>
            
            {/* Format badges placeholders */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 w-16 bg-gray-200 dark:bg-dark-300 rounded-full" />
              ))}
            </div>
            
            {/* Price and stock placeholders */}
            <div className="mb-6">
              <div className="h-7 w-24 bg-gray-300 dark:bg-dark-400 rounded mx-auto md:mx-0 mb-2" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-dark-300 rounded mx-auto md:mx-0" />
            </div>
            
            {/* Button placeholder */}
            <div className="h-12 w-40 bg-primary/30 rounded-lg mx-auto md:mx-0" />
          </div>
        </div>
      </div>
      
      {/* Navigation dots placeholder */}
      <div className="flex justify-center mt-8">
        <div className="flex items-center space-x-6">
          <div className="h-10 w-10 bg-gray-200 dark:bg-dark-300 rounded-full" />
          <div className="flex space-x-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`h-3 w-3 rounded-full ${i === 0 ? 'bg-primary/50' : 'bg-gray-200 dark:bg-dark-300'}`} />
            ))}
          </div>
          <div className="h-10 w-10 bg-gray-200 dark:bg-dark-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default HeroSliderSkeleton; 
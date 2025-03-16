'use client';

import React from 'react';
import { cn } from '../../utils/classNames';

interface ProductCardSkeletonProps {
  className?: string;
}

const ProductCardSkeleton: React.FC<ProductCardSkeletonProps> = ({ className }) => {
  return (
    <div className={cn(
      "bg-white dark:bg-dark-200 rounded-lg shadow-md overflow-hidden animate-pulse", 
      className
    )}>
      {/* Image placeholder */}
      <div className="aspect-square w-full bg-gray-200 dark:bg-dark-300" />
      
      <div className="p-4">
        {/* Tags/badges placeholders */}
        <div className="flex gap-2 mb-3">
          <div className="h-5 w-16 bg-gray-200 dark:bg-dark-300 rounded-full" />
          <div className="h-5 w-16 bg-gray-200 dark:bg-dark-300 rounded-full" />
        </div>
        
        {/* Title placeholder */}
        <div className="h-5 w-3/4 bg-gray-300 dark:bg-dark-400 rounded mb-2" />
        
        {/* Artist placeholder */}
        <div className="h-4 w-1/2 bg-gray-200 dark:bg-dark-300 rounded mb-4" />
        
        {/* Price and actions placeholders */}
        <div className="flex justify-between items-center mt-4">
          {/* Price placeholder */}
          <div className="h-6 w-16 bg-gray-300 dark:bg-dark-400 rounded" />
          
          {/* Action buttons placeholder */}
          <div className="flex space-x-2">
            <div className="h-8 w-14 bg-gray-200 dark:bg-dark-300 rounded" />
            <div className="h-8 w-24 bg-primary/30 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton; 
'use client';

import React from 'react';
import { FiX } from 'react-icons/fi';
import { Genre, Style } from '../../../utils/types';

interface ActiveFiltersProps {
  selectedGenres: string[];
  selectedStyles: string[];
  priceRange: [number, number];
  onGenreRemove: (genreId: string) => void;
  onStyleRemove: (styleId: string) => void;
  onClearAllFilters: () => void;
  genres: Genre[];
  styles: Style[];
  minPrice: number;
  maxPrice: number;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  selectedGenres,
  selectedStyles,
  priceRange,
  onGenreRemove,
  onStyleRemove,
  onClearAllFilters,
  genres,
  styles,
  minPrice,
  maxPrice,
}) => {
  // Get names of selected genres and styles
  const selectedGenreNames = selectedGenres.map(
    id => genres.find(genre => genre.id === id)?.name || 'Unknown Genre'
  );
  
  const selectedStyleNames = selectedStyles.map(
    id => styles.find(style => style.id === id)?.name || 'Unknown Style'
  );

  const hasPriceFilter = priceRange[0] > minPrice || priceRange[1] < maxPrice;
  
  // Check if any filters are active
  const hasActiveFilters = selectedGenres.length > 0 || selectedStyles.length > 0 || hasPriceFilter;
  
  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Active Filters</h4>
        <button
          onClick={onClearAllFilters}
          className="text-sm text-primary hover:text-primary-dark transition-colors"
        >
          Clear All
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {selectedGenreNames.map((name, index) => (
          <div 
            key={`genre-${selectedGenres[index]}`}
            className="bg-primary bg-opacity-10 text-primary text-sm rounded-full px-3 py-1 flex items-center"
          >
            <span className="mr-1">{name}</span>
            <button 
              onClick={() => onGenreRemove(selectedGenres[index])}
              className="ml-1 focus:outline-none hover:text-primary-dark"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        
        {selectedStyleNames.map((name, index) => (
          <div 
            key={`style-${selectedStyles[index]}`}
            className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:bg-opacity-20 dark:text-blue-400 text-sm rounded-full px-3 py-1 flex items-center"
          >
            <span className="mr-1">{name}</span>
            <button 
              onClick={() => onStyleRemove(selectedStyles[index])}
              className="ml-1 focus:outline-none hover:text-blue-800 dark:hover:text-blue-300"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        
        {hasPriceFilter && (
          <div className="bg-green-50 text-green-700 dark:bg-green-900 dark:bg-opacity-20 dark:text-green-400 text-sm rounded-full px-3 py-1">
            ${priceRange[0]} - ${priceRange[1]}
          </div>
        )}
      </div>
    </div>
  );
};

// Add default export
export default ActiveFilters; 
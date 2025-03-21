'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency } from '@/utils/formatCurrency';

interface PriceRangeSliderProps {
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  priceRange,
  onPriceRangeChange,
  minPrice,
  maxPrice
}) => {
  // Ensure all values are valid numbers
  const safeMinPrice = isNaN(minPrice) ? 0 : minPrice;
  const safeMaxPrice = isNaN(maxPrice) ? 1000 : maxPrice;
  
  // Make sure we have a valid initial price range
  const safeInitialRange: [number, number] = [
    isNaN(priceRange[0]) ? safeMinPrice : priceRange[0],
    isNaN(priceRange[1]) ? safeMaxPrice : priceRange[1]
  ];
  
  const [localRange, setLocalRange] = useState<[number, number]>(safeInitialRange);
  
  // Update local range when props change, ensuring they're valid numbers
  useEffect(() => {
    const newRange: [number, number] = [
      isNaN(priceRange[0]) ? safeMinPrice : priceRange[0],
      isNaN(priceRange[1]) ? safeMaxPrice : priceRange[1]
    ];
    setLocalRange(newRange);
  }, [priceRange, safeMinPrice, safeMaxPrice]);

  // Handle min price change
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value);
    if (!isNaN(newMin) && newMin <= localRange[1]) {
      setLocalRange([newMin, localRange[1]]);
    }
  };

  // Handle max price change
  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value);
    if (!isNaN(newMax) && newMax >= localRange[0]) {
      setLocalRange([localRange[0], newMax]);
    }
  };

  // Apply changes when user stops dragging
  const handleRangeApply = () => {
    onPriceRangeChange(localRange);
  };

  // Ensure we always render valid numeric attributes
  const minValue = isNaN(localRange[0]) ? safeMinPrice : localRange[0];
  const maxValue = isNaN(localRange[1]) ? safeMaxPrice : localRange[1];

  return (
    <div className="space-y-4 py-6 border-b dark:border-gray-700">
      <h3 className="text-base font-medium text-gray-900 dark:text-white">Price Range</h3>
      
      <div className="flex space-x-4 items-center">
        <div className="w-1/2">
          <label htmlFor="min-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Min
          </label>
          <input
            type="range"
            id="min-price"
            min={safeMinPrice}
            max={safeMaxPrice}
            value={minValue}
            onChange={handleMinChange}
            onMouseUp={handleRangeApply}
            onTouchEnd={handleRangeApply}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="max-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Max
          </label>
          <input
            type="range"
            id="max-price"
            min={safeMinPrice}
            max={safeMaxPrice}
            value={maxValue}
            onChange={handleMaxChange}
            onMouseUp={handleRangeApply}
            onTouchEnd={handleRangeApply}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
        <span>{formatCurrency(minValue)}</span>
        <span>{formatCurrency(maxValue)}</span>
      </div>
    </div>
  );
};

export default PriceRangeSlider; 
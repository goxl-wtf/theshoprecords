"use client";

import React, { useState, useEffect } from 'react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  className = '',
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= min && newQuantity <= max) {
      onQuantityChange(newQuantity);
    }
  };

  const incrementQuantity = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  return (
    <div className={`flex items-center ${className}`}>
      <button 
        onClick={decrementQuantity}
        className="h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-l-md border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors duration-300"
        disabled={quantity <= min}
        aria-label="Decrease quantity"
      >
        -
      </button>
      <input
        type="text"
        value={quantity}
        onChange={handleInputChange}
        className="h-8 w-12 border-t border-b border-gray-300 dark:border-gray-600 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
        aria-label="Quantity"
        min={min}
        max={max}
      />
      <button 
        onClick={incrementQuantity}
        className="h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-r-md border border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors duration-300"
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector; 
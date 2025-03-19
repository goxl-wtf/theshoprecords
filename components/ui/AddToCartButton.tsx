"use client";

import React, { useState } from 'react';
import { Product, ProductWithDetails } from '@/utils/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import QuantitySelector from './QuantitySelector';

interface AddToCartButtonProps {
  product: Product | ProductWithDetails;
  size?: 'small' | 'medium' | 'large';
  showQuantity?: boolean;
  className?: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({ 
  product, 
  size = 'medium', 
  showQuantity = false,
  className = '' 
}) => {
  const { addToCart, isInCart, updateQuantity } = useCart();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, quantity);
    
    // Show toast notification
    showToast(
      `Added ${quantity} ${quantity === 1 ? 'copy' : 'copies'} of "${product.title}" to cart`,
      'success',
      3000
    );
    
    // Reset quantity after adding
    setQuantity(1);
    
    // Visual feedback timeout
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  // Determine button size classes
  const sizeClasses = {
    small: 'px-3 py-1 text-sm',
    medium: 'px-4 py-2',
    large: 'px-6 py-3 text-lg',
  };

  const buttonClasses = `
    ${sizeClasses[size]} 
    bg-primary hover:bg-primary/90 
    text-white font-medium rounded-md 
    flex items-center justify-center 
    transition-all duration-300 
    transform ${isAdding ? 'scale-105' : ''} 
    ${className}
  `;

  return (
    <div className="flex flex-col gap-2">
      {showQuantity && (
        <QuantitySelector
          quantity={quantity}
          onQuantityChange={handleQuantityChange}
          min={1}
          max={99}
        />
      )}
      
      <button 
        onClick={handleAddToCart} 
        className={buttonClasses}
        aria-label={`Add ${product.title} to cart`}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
          />
        </svg>
        {isInCart(product.id) ? 'Add More' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default AddToCartButton; 
import React from 'react';

export interface AddToCartProps {
  price: number;
  stock: number;
}

/**
 * AddToCart component displays the product price, stock info, and add to cart button
 * 
 * @param {AddToCartProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const AddToCart: React.FC<AddToCartProps> = ({ price, stock }) => {
  // Format the price nicely
  const formattedPrice = price 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price) 
    : 'Price on request';

  return (
    <div className="py-4 border-t border-b border-gray-200 dark:border-dark-300 flex justify-between items-center">
      <div>
        <span className="text-2xl font-bold text-gray-900 dark:text-light-100">{formattedPrice}</span>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {stock > 0 
            ? `${stock} in stock` 
            : 'Out of stock'}
        </p>
      </div>
      
      <button 
        className={`px-6 py-2 rounded-md text-white font-medium ${
          stock > 0
            ? 'bg-primary hover:bg-primary/90'
            : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
        }`}
        disabled={stock <= 0}
        aria-disabled={stock <= 0}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCart; 
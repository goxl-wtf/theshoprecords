import React from 'react';
import { ProductWithDetails } from '@/utils/types';
import AddToCartButton from '@/components/ui/AddToCartButton';

export interface AddToCartProps {
  price: number;
  in_stock: boolean;
  product: ProductWithDetails;
}

/**
 * AddToCart component displays the product price, stock info, and add to cart button
 * 
 * @param {AddToCartProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const AddToCart: React.FC<AddToCartProps> = ({ price, in_stock, product }) => {
  // Format the price nicely
  const formattedPrice = price 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price) 
    : 'Price on request';

  return (
    <div className="py-4 border-t border-b border-gray-200 dark:border-dark-300 flex justify-between items-center">
      <div>
        <span className="text-2xl font-bold text-gray-900 dark:text-light-100">{formattedPrice}</span>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {in_stock 
            ? 'In stock' 
            : 'Out of stock'}
        </p>
      </div>
      
      <AddToCartButton 
        product={product}
        size="medium"
        showQuantity={false}
        className={!in_stock ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' : ''}
      />
    </div>
  );
};

export default AddToCart; 
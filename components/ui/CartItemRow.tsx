"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem } from '@/utils/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import { formatCurrency } from '@/utils/formatters';
import QuantitySelector from './QuantitySelector';

interface CartItemRowProps {
  item: CartItem;
}

const CartItemRow: React.FC<CartItemRowProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  const { showToast } = useToast();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
    showToast(`Removed "${item.title}" from cart`, 'info', 3000);
  };

  return (
    <tr className="transition-colors duration-300">
      <td className="py-4 px-4">
        <div className="flex items-center">
          <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded">
            <Image
              src={item.image}
              alt={`${item.title} by ${item.artist}`}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="ml-4">
            <Link 
              href={`/shop/${item.id}`}
              className="font-medium text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary transition-colors duration-300"
            >
              {item.title}
            </Link>
            <div className="text-gray-500 dark:text-gray-400 transition-colors duration-300">{item.artist}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-4 text-gray-900 dark:text-white transition-colors duration-300">
        {formatCurrency(item.price)}
      </td>
      <td className="py-4 px-4">
        <QuantitySelector
          quantity={item.quantity}
          onQuantityChange={handleQuantityChange}
          min={1}
          max={99}
        />
      </td>
      <td className="py-4 px-4 font-medium text-gray-900 dark:text-white transition-colors duration-300">
        {formatCurrency(item.price * item.quantity)}
      </td>
      <td className="py-4 px-4 text-right">
        <button 
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
          aria-label="Remove item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default CartItemRow; 
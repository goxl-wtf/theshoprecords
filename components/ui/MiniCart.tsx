"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

const MiniCart: React.FC = () => {
  const { items, itemCount, totalAmount, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  // Close the cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={cartRef}>
      {/* Cart Icon with Badge */}
      <button 
        onClick={toggleCart} 
        className="flex items-center"
        aria-label="Shopping cart"
      >
        <div className="relative">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-gray-800 dark:text-gray-200" 
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
          
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {itemCount}
            </span>
          )}
        </div>
      </button>

      {/* Mini Cart Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20 overflow-hidden transition-all duration-300">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Cart ({itemCount})</h3>
          </div>

          {items.length > 0 ? (
            <>
              <div className="max-h-72 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                    <div className="w-16 h-16 flex-shrink-0 relative rounded overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.artist}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
                          aria-label={`Remove ${item.title} from cart`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between mb-4">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Subtotal</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/cart"
                    className="text-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    className="text-center px-4 py-2 bg-primary text-white rounded-md font-medium text-sm hover:bg-primary/90 transition-colors duration-300"
                    onClick={() => setIsOpen(false)}
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div className="p-4 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">Your cart is empty</p>
              <Link
                href="/shop"
                className="px-4 py-2 bg-primary text-white rounded-md font-medium text-sm hover:bg-primary/90 transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Browse Records
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MiniCart; 
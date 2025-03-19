"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { FiX, FiShoppingCart, FiTrash2, FiArrowRight } from 'react-icons/fi';

const SidebarCart: React.FC = () => {
  const { items, itemCount, totalAmount, removeFromCart, updateQuantity, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    setIsOpen(!isOpen);
  };

  // Close the cart when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Cart Icon with Badge */}
      <button 
        onClick={toggleCart} 
        className="flex items-center"
        aria-label="Shopping cart"
      >
        <div className="relative">
          <FiShoppingCart className="h-6 w-6 text-gray-800 dark:text-gray-200" />
          
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
              {itemCount}
            </span>
          )}
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[100] transition-opacity duration-300 ease-in-out" 
          onClick={toggleCart} 
          aria-hidden="true"
        />
      )}

      {/* Slide-in Cart Sidebar */}
      <div 
        ref={cartRef}
        className={`fixed top-0 right-0 h-full w-80 md:w-96 bg-white dark:bg-gray-800 shadow-xl z-[101] transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-hidden flex flex-col`}
      >
        {/* Cart Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Your Cart ({itemCount})</h3>
          <button 
            onClick={toggleCart}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
            aria-label="Close cart"
          >
            <FiX className="h-6 w-6" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-grow overflow-y-auto">
          {items.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {items.map((item) => (
                <div key={item.id} className="p-4 flex items-start gap-3 group">
                  <div className="w-20 h-20 flex-shrink-0 relative rounded overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <Image
                      src={item.image || "https://via.placeholder.com/150"}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.artist}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center border rounded overflow-hidden">
                        <button 
                          className="px-2 py-1 border-r hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1);
                          }}
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >-</button>
                        <span className="px-3 py-1 font-medium text-sm">{item.quantity}</span>
                        <button 
                          className="px-2 py-1 border-l hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQuantity(item.id, item.quantity + 1);
                          }}
                          aria-label="Increase quantity"
                        >+</button>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCart(item.id);
                      }}
                      className="mt-2 text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300 flex items-center gap-1"
                      aria-label={`Remove ${item.title} from cart`}
                    >
                      <FiTrash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="flex justify-center mb-4">
                <FiShoppingCart className="h-16 w-16 text-gray-300 dark:text-gray-600" />
              </div>
              <p className="text-gray-500 dark:text-gray-400 mb-4">Your cart is empty</p>
              <Link
                href="/shop"
                className="px-4 py-2 bg-primary text-white rounded-md font-medium text-sm hover:bg-primary/90 transition-colors duration-300 inline-flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <span>Browse Records</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                <span className="font-medium text-gray-900 dark:text-white">Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-medium pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-lg text-gray-900 dark:text-white">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Link
                href="/checkout"
                className="w-full text-center px-4 py-3 bg-primary text-white rounded-md font-medium text-sm hover:bg-primary/90 transition-colors duration-300 inline-flex items-center justify-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <span>Checkout</span>
                <FiArrowRight className="w-4 h-4" />
              </Link>
              <div className="flex gap-2">
                <Link
                  href="/cart"
                  className="flex-1 text-center px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  View Cart
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearCart();
                  }}
                  className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-md text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300 flex items-center"
                  aria-label="Clear cart"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SidebarCart; 
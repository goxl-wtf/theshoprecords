"use client";

import React from 'react';
import Link from 'next/link';
import CartItemRow from '@/components/ui/CartItemRow';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/utils/formatters';

export default function Cart() {
  const { items, itemCount, totalAmount, clearCart, getCartItemsBySeller, getSellerSubtotal } = useCart();
  
  // Get cart items grouped by seller
  const groupedItems = getCartItemsBySeller();
  
  // Fixed shipping fee - in a real app this might be calculated based on location, weight, etc.
  const shipping = items.length > 0 ? 5.99 : 0;
  const total = totalAmount + shipping;

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Your Cart</h1>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {/* Render items grouped by seller */}
            {Object.keys(groupedItems).map((sellerId) => (
              <div key={sellerId} className="mb-8">
                <div className="flex items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    {sellerId === 'official' 
                      ? 'TheShopRecords Official' 
                      : groupedItems[sellerId][0].seller_name || 'Marketplace Seller'}
                  </h2>
                  {sellerId !== 'official' && (
                    <span className="ml-2 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      Marketplace Seller
                    </span>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300 mb-4">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                      <tr>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Product</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Price</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Quantity</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Total</th>
                        <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                      {groupedItems[sellerId].map((item) => (
                        <CartItemRow key={item.id} item={item} />
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Seller subtotal */}
                <div className="flex justify-end mb-2">
                  <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <span className="text-gray-600 dark:text-gray-300 text-sm">Seller subtotal: </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(getSellerSubtotal(sellerId))}
                    </span>
                  </span>
                </div>
              </div>
            ))}

            <div className="mt-6 flex justify-between items-center">
              <Link
                href="/shop"
                className="flex items-center text-primary hover:text-primary/80 transition-colors duration-300"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Continue Shopping
              </Link>
              <button 
                onClick={clearCart}
                className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded transition-colors duration-300"
              >
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">Order Summary</h2>
              <div className="border-t dark:border-gray-700 pt-4 transition-colors duration-300">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                  <span className="text-gray-900 dark:text-white font-medium transition-colors duration-300">{formatCurrency(totalAmount)}</span>
                </div>
                
                {/* Display number of sellers */}
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Sellers</span>
                  <span className="text-gray-900 dark:text-white font-medium transition-colors duration-300">
                    {Object.keys(groupedItems).length}
                  </span>
                </div>
                
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Shipping</span>
                  <span className="text-gray-900 dark:text-white font-medium transition-colors duration-300">{formatCurrency(shipping)}</span>
                </div>
                <div className="flex justify-between pt-4 border-t dark:border-gray-700 mt-4 transition-colors duration-300">
                  <span className="text-gray-900 dark:text-white font-bold transition-colors duration-300">Total</span>
                  <span className="text-primary text-xl font-bold">{formatCurrency(total)}</span>
                </div>
              </div>
              <Link href="/checkout" className="mt-6 w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-md font-medium transition-colors duration-300 inline-block text-center">
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors duration-300">
          <h2 className="text-xl font-medium mb-4 text-gray-900 dark:text-white transition-colors duration-300">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">Looks like you haven&apos;t added any records to your cart yet.</p>
          <Link 
            href="/shop" 
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium inline-block transition-colors duration-300"
          >
            Browse Records
          </Link>
        </div>
      )}
    </div>
  );
} 
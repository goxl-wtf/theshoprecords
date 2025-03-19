"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, CheckCircle } from 'lucide-react';

export default function CheckoutSuccess() {
  const router = useRouter();

  // If user refreshes this page, redirect them to the home page
  // This ensures they can only reach this page after a successful payment
  useEffect(() => {
    const hasCompletedPayment = sessionStorage.getItem('order_completed');
    
    if (!hasCompletedPayment) {
      router.push('/');
      return;
    }
    
    // Clear the flag after successful rendering
    return () => {
      sessionStorage.removeItem('order_completed');
    };
  }, [router]);

  return (
    <div className="container-custom py-16">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center transition-colors duration-300">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white transition-colors duration-300">
            Thank You for Your Order!
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 transition-colors duration-300">
            Your payment was successful and your order has been placed.
          </p>
          
          <div className="border-t border-b dark:border-gray-700 py-6 mb-6">
            <div className="flex justify-center items-center">
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-300">
                  A confirmation email has been sent to your inbox
                </p>
                <p className="text-sm text-primary">
                  (Feature coming soon)
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-center">
            <Link
              href="/shop"
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium inline-flex items-center justify-center transition-colors duration-300"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
            
            <Link
              href="/dashboard/orders"
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-md font-medium inline-flex items-center justify-center transition-colors duration-300"
            >
              View Your Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
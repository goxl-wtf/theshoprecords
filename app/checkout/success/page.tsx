"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, CheckCircle, Truck, Store } from 'lucide-react';

interface OrderDetails {
  id: string;
  status: string;
  seller_count: number;
}

export default function CheckoutSuccess() {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);

  // If user refreshes this page, redirect them to the home page
  // This ensures they can only reach this page after a successful payment
  useEffect(() => {
    const hasCompletedPayment = localStorage.getItem('order_completed');
    const orderInfo = localStorage.getItem('order_details');
    
    if (!hasCompletedPayment) {
      router.push('/');
      return;
    }
    
    // Try to get order details from localStorage
    if (orderInfo) {
      try {
        setOrderDetails(JSON.parse(orderInfo));
      } catch (e) {
        console.error('Failed to parse order details', e);
      }
    }
  }, [router]);

  // Handle navigation and cleanup when user clicks on links
  const handleNavigation = () => {
    // Only remove the flag when user navigates away
    localStorage.removeItem('order_completed');
    localStorage.removeItem('order_details');
  };

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
            {orderDetails ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Order Reference:</span>
                  <span className="text-base font-semibold text-gray-800 dark:text-gray-200">{orderDetails.id}</span>
                </div>
                
                {orderDetails.seller_count > 1 && (
                  <div className="flex items-center text-sm p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg">
                    <Store className="h-4 w-4 mr-2" />
                    <span>
                      Your order includes items from {orderDetails.seller_count} different sellers. 
                      Each seller will process and ship your items separately.
                    </span>
                  </div>
                )}
                
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                  <Truck className="h-4 w-4 mr-2" />
                  <span>Shipping updates will be sent to your email address</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 transition-colors duration-300">
                  A confirmation email has been sent to your inbox
                </p>
                <p className="text-sm text-primary">
                  (Feature coming soon)
                </p>
              </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 justify-center">
            <Link
              href="/shop"
              onClick={handleNavigation}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium inline-flex items-center justify-center transition-colors duration-300"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Continue Shopping
            </Link>
            
            <Link
              href="/user/orders"
              onClick={handleNavigation}
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
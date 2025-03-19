"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import StripeProvider from '@/components/ui/StripeProvider';
import StripeElements from '@/components/ui/StripeElements';

export default function Checkout() {
  const router = useRouter();
  const { items, itemCount, totalAmount, clearCart } = useCart();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // Fixed shipping fee - in a real app this might be calculated based on location, weight, etc.
  const shipping = items.length > 0 ? 5.99 : 0;
  const total = totalAmount + shipping;

  // Fetch payment intent from the API when the cart items change
  useEffect(() => {
    if (items.length > 0) {
      const fetchPaymentIntent = async () => {
        try {
          const response = await fetch('/api/stripe/payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items,
              customer: {
                name: formData.name,
                email: formData.email,
              },
            }),
          });

          const data = await response.json();
          
          if (response.ok) {
            setClientSecret(data.clientSecret);
          } else {
            showToast(`Error: ${data.error?.message || 'Failed to initialize payment'}`, 'error');
            console.error('Payment intent error:', data.error);
          }
        } catch (error) {
          console.error('Failed to fetch payment intent:', error);
          showToast('Error initializing payment. Please try again.', 'error');
        }
      };

      fetchPaymentIntent();
    }
  }, [items, showToast]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    showToast('Payment successful!', 'success');
    // Set flag for successful order completion
    localStorage.setItem('order_completed', 'true');
    // Clear the cart after successful payment
    clearCart();
    // Redirect to a success page
    router.push('/checkout/success');
  };

  // Handle payment error
  const handlePaymentError = (error: Error) => {
    console.error('Payment error:', error);
    showToast(`Payment failed: ${error.message}`, 'error');
    setIsLoading(false);
  };

  // If cart is empty, redirect to cart page
  if (items.length === 0) {
    return (
      <div className="container-custom py-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center transition-colors duration-300">
          <h2 className="text-xl font-medium mb-4 text-gray-900 dark:text-white transition-colors duration-300">Your cart is empty</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">You need to add items to your cart before checkout.</p>
          <Link 
            href="/shop" 
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium inline-block transition-colors duration-300"
          >
            Browse Records
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Shipping Information</h2>
            
            <form id="payment-form" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                            focus:outline-none focus:ring-primary focus:border-primary 
                            dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                            focus:outline-none focus:ring-primary focus:border-primary 
                            dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                          focus:outline-none focus:ring-primary focus:border-primary 
                          dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                            focus:outline-none focus:ring-primary focus:border-primary 
                            dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                            focus:outline-none focus:ring-primary focus:border-primary 
                            dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm 
                            focus:outline-none focus:ring-primary focus:border-primary 
                            dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
              
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Payment Information</h2>
              
              {/* Stripe Elements will be rendered here */}
              {clientSecret ? (
                <StripeProvider clientSecret={clientSecret}>
                  <StripeElements
                    clientSecret={clientSecret}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                    amount={total}
                  />
                </StripeProvider>
              ) : (
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-md">
                  <div className="animate-pulse flex space-x-4">
                    <div className="flex-1 space-y-4 py-1">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Loading payment form...</p>
                </div>
              )}
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading || !clientSecret}
                  className={`w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-md font-medium 
                          transition-colors duration-300 flex items-center justify-center
                          ${(isLoading || !clientSecret) ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Complete Payment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">Order Summary</h2>
            <div className="border-t dark:border-gray-700 pt-4 transition-colors duration-300">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                <span className="text-gray-900 dark:text-white font-medium transition-colors duration-300">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Shipping</span>
                <span className="text-gray-900 dark:text-white font-medium transition-colors duration-300">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-4 border-t dark:border-gray-700 mt-4 transition-colors duration-300">
                <span className="text-gray-900 dark:text-white font-bold transition-colors duration-300">Total</span>
                <span className="text-primary text-xl font-bold">${total.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6 border-t dark:border-gray-700 pt-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Your Cart</h3>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => (
                  <li key={item.id} className="py-3 flex justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-6">
              <Link 
                href="/cart"
                className="text-primary hover:text-primary/80 text-sm flex items-center"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Return to cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
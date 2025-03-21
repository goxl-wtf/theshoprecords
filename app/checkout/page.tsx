"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import StripeProvider from '@/components/ui/StripeProvider';
import StripeElements from '@/components/ui/StripeElements';
import { formatCurrency } from '@/utils/formatters';

export default function Checkout() {
  const router = useRouter();
  const { items, itemCount, totalAmount, clearCart, getCartItemsBySeller, getSellerSubtotal } = useCart();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  // Group items by seller
  const groupedItems = getCartItemsBySeller();
  
  // Shipping options state
  const [shippingOptions, setShippingOptions] = useState<Record<string, string>>(() => {
    // Initialize with standard shipping for each seller
    const initialOptions: Record<string, string> = {};
    Object.keys(groupedItems).forEach(sellerId => {
      initialOptions[sellerId] = 'standard';
    });
    return initialOptions;
  });
  
  // Calculate shipping costs based on selected options
  const calculateShippingCost = (sellerId: string): number => {
    const option = shippingOptions[sellerId];
    const baseShipping = 5.99;
    
    switch (option) {
      case 'express':
        return baseShipping + 4.99;
      case 'priority':
        return baseShipping + 9.99;
      case 'standard':
      default:
        return baseShipping;
    }
  };
  
  // Calculate total shipping cost across all sellers
  const totalShipping = Object.keys(groupedItems).reduce((total, sellerId) => {
    return total + calculateShippingCost(sellerId);
  }, 0);
  
  // Total amount including shipping
  const total = totalAmount + totalShipping;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

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
              shippingDetails: {
                options: shippingOptions,
                totalShipping
              },
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
  }, [items, shippingOptions, totalShipping, showToast]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Handle shipping option changes
  const handleShippingChange = (sellerId: string, option: string) => {
    setShippingOptions(prev => ({
      ...prev,
      [sellerId]: option
    }));
  };

  // Handle payment success
  const handlePaymentSuccess = (paymentIntent: any) => {
    showToast('Payment successful!', 'success');
    
    // Create order in database
    createOrder(paymentIntent);
  };
  
  // Create order in database after successful payment
  const createOrder = async (paymentIntent: any) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: formData,
          items,
          paymentIntent,
          amount: total,
          shippingDetails: {
            options: shippingOptions,
            totalShipping
          }
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Error creating order:', data.error);
        showToast(`Error creating order: ${data.error?.message || 'Unknown error'}`, 'error');
        return;
      }
      
      // Save order details to localStorage for the success page
      localStorage.setItem('order_completed', 'true');
      localStorage.setItem('order_details', JSON.stringify(data.order));
      
      // Clear the cart after successful order creation
      clearCart();
      
      // Redirect to success page
      router.push('/checkout/success');
      
    } catch (error) {
      console.error('Error creating order:', error);
      showToast('Error creating order. Please contact support.', 'error');
    }
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
              
              {/* Orders Group by Seller */}
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Your Order</h3>
                
                {Object.keys(groupedItems).map((sellerId) => (
                  <div key={sellerId} className="mb-6 border rounded-lg overflow-hidden">
                    {/* Seller Header */}
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 border-b">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">
                          {sellerId === 'official' 
                            ? 'TheShopRecords Official' 
                            : groupedItems[sellerId][0].seller_name || 'Marketplace Seller'}
                        </h4>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {groupedItems[sellerId].length} {groupedItems[sellerId].length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Seller Items */}
                    <div className="p-3 bg-white dark:bg-gray-800">
                      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                        {groupedItems[sellerId].map((item) => (
                          <li key={item.id} className="py-3 flex justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {item.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {item.artist} • Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </li>
                        ))}
                      </ul>
                      
                      {/* Shipping Options for this Seller */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h5 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-2">
                          Shipping Options
                        </h5>
                        <div className="space-y-2">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`shipping-${sellerId}`}
                              value="standard"
                              checked={shippingOptions[sellerId] === 'standard'}
                              onChange={() => handleShippingChange(sellerId, 'standard')}
                              className="mr-2 text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">
                              Standard Shipping (3-5 business days)
                            </span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {formatCurrency(5.99)}
                            </span>
                          </label>
                          
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`shipping-${sellerId}`}
                              value="express"
                              checked={shippingOptions[sellerId] === 'express'}
                              onChange={() => handleShippingChange(sellerId, 'express')}
                              className="mr-2 text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">
                              Express Shipping (2-3 business days)
                            </span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {formatCurrency(10.98)}
                            </span>
                          </label>
                          
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="radio"
                              name={`shipping-${sellerId}`}
                              value="priority"
                              checked={shippingOptions[sellerId] === 'priority'}
                              onChange={() => handleShippingChange(sellerId, 'priority')}
                              className="mr-2 text-primary focus:ring-primary"
                            />
                            <span className="text-sm text-gray-800 dark:text-gray-200 flex-1">
                              Priority Shipping (1-2 business days)
                            </span>
                            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                              {formatCurrency(15.98)}
                            </span>
                          </label>
                        </div>
                      </div>
                      
                      {/* Seller Subtotal with Shipping */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Subtotal:
                        </span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {formatCurrency(getSellerSubtotal(sellerId))}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Shipping:
                        </span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {formatCurrency(calculateShippingCost(sellerId))}
                        </span>
                      </div>
                      <div className="mt-2 flex justify-between">
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          Seller Total:
                        </span>
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">
                          {formatCurrency(getSellerSubtotal(sellerId) + calculateShippingCost(sellerId))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
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
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300 sticky top-4">
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
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  Shipping ({Object.keys(groupedItems).length} {Object.keys(groupedItems).length === 1 ? 'seller' : 'sellers'})
                </span>
                <span className="text-gray-900 dark:text-white font-medium transition-colors duration-300">
                  {formatCurrency(totalShipping)}
                </span>
              </div>
              
              <div className="flex justify-between pt-4 border-t dark:border-gray-700 mt-4 transition-colors duration-300">
                <span className="text-gray-900 dark:text-white font-bold transition-colors duration-300">Total</span>
                <span className="text-primary text-xl font-bold">{formatCurrency(total)}</span>
              </div>
            </div>
            
            <div className="mt-6">
              <button 
                type="submit" 
                form="payment-form"
                disabled={isLoading || !clientSecret}
                className={`w-full bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-md font-medium transition-colors duration-300 
                  ${(isLoading || !clientSecret) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? 'Processing...' : 'Complete Order'}
              </button>
            </div>
            
            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400">
              <p className="mb-1">
                By completing your purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
              <p>
                Your payment information is processed securely by Stripe. We do not store your credit card details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
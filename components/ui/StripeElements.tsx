"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface StripeElementsProps {
  clientSecret: string | null;
  onPaymentSuccess: (paymentIntent: any) => void;
  onPaymentError: (error: Error) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  amount: number;
}

const StripeElements: React.FC<StripeElementsProps> = ({
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
  setIsLoading,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  // Card element options
  const cardElementOptions = {
    style: {
      base: {
        color: 'var(--card-text-color, #32325d)',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        fontWeight: '500',
        letterSpacing: '0.025em',
        '::placeholder': {
          color: 'var(--card-placeholder-color, #aab7c4)',
        },
        ':-webkit-autofill': {
          color: 'var(--card-text-color, #32325d)',
        },
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a',
      },
    },
    hidePostalCode: true,
  };

  const handleCardChange = (event: any) => {
    // Clear any errors when the card details change
    if (event.error) {
      setError(event.error.message);
    } else {
      setError(null);
    }
  };

  const handlePaymentSubmit = useCallback(async () => {
    if (!stripe || !elements || !clientSecret) {
      // Stripe.js has not loaded yet or client secret is missing
      return;
    }
    
    setIsLoading(true);
    
    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        setError(error.message || 'An error occurred with your payment. Please try again.');
        onPaymentError(new Error(error.message));
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setError(null);
        onPaymentSuccess(paymentIntent);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      onPaymentError(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [stripe, elements, clientSecret, setIsLoading, onPaymentSuccess, onPaymentError]);

  useEffect(() => {
    // Attach the handlePaymentSubmit to a parent form's submit event
    const form = document.getElementById('payment-form');
    
    if (form) {
      const handleSubmit = (e: Event) => {
        e.preventDefault();
        handlePaymentSubmit();
      };
      
      form.addEventListener('submit', handleSubmit);
      
      return () => {
        form.removeEventListener('submit', handleSubmit);
      };
    }
  }, [handlePaymentSubmit]);

  // Set dynamic color based on theme
  useEffect(() => {
    const root = document.documentElement;
    const isDarkMode = document.documentElement.classList.contains('dark');
    root.style.setProperty('--card-text-color', isDarkMode ? '#ffffff' : '#32325d');
    root.style.setProperty('--card-placeholder-color', isDarkMode ? '#a0aec0' : '#aab7c4');
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          root.style.setProperty('--card-text-color', isDark ? '#ffffff' : '#32325d');
          root.style.setProperty('--card-placeholder-color', isDark ? '#a0aec0' : '#aab7c4');
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Card Details
        </label>
        <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800">
          <CardElement options={cardElementOptions} onChange={handleCardChange} />
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-md">
          {error}
        </div>
      )}
      
      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Your card information is encrypted and never stored on our servers.
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Test with any of these card numbers:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
          <div className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
            <span className="font-semibold">Success:</span> 4242 4242 4242 4242
          </div>
          <div className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
            <span className="font-semibold">Requires Auth:</span> 4000 0025 0000 3155
          </div>
          <div className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
            <span className="font-semibold">Decline:</span> 4000 0000 0000 0002
          </div>
          <div className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded-md">
            <span className="font-semibold">Any future date, any 3 digits CVV</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeElements; 
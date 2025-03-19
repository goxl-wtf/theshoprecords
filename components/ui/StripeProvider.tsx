'use client';

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import getStripe from '@/lib/stripe/client';
import { StripeElementsOptions } from '@stripe/stripe-js';

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret: string | null;
}

const StripeProvider: React.FC<StripeProviderProps> = ({ 
  children, 
  clientSecret 
}) => {
  const stripePromise = getStripe();

  // Only create options if clientSecret exists (not null)
  const options: StripeElementsOptions | undefined = clientSecret ? {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#6366f1',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        borderRadius: '0.375rem',
      },
    },
  } : undefined;

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};

export default StripeProvider; 
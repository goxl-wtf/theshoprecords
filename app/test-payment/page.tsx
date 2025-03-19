'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { ProductWithDetails, Image } from '@/utils/types';

interface TestCard {
  number: string;
  description: string;
  expectedResult: string;
}

export default function TestPaymentPage() {
  const router = useRouter();
  const { addToCart, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  // Stripe test cards
  const testCards: TestCard[] = [
    { 
      number: '4242 4242 4242 4242', 
      description: 'Successful payment', 
      expectedResult: 'Payment succeeds, order completes'
    },
    { 
      number: '4000 0000 0000 0002', 
      description: 'Card declined (generic)', 
      expectedResult: 'Payment fails with a decline message'
    },
    { 
      number: '4000 0000 0000 9995', 
      description: 'Insufficient funds', 
      expectedResult: 'Payment fails with an insufficient funds message'
    },
    { 
      number: '4000 0000 0000 3220', 
      description: '3D Secure authentication required', 
      expectedResult: 'Payment requires 3D Secure authentication'
    },
    { 
      number: '4000 0000 0000 9987', 
      description: 'Card requiring authentication that fails', 
      expectedResult: 'Authentication fails and the payment does not complete'
    }
  ];

  // Test data for other fields
  const testData = {
    expiryDate: '12/34',
    cvc: '123',
    postalCode: '12345'
  };

  // Function to set up a test order
  const setupTestOrder = async () => {
    try {
      setIsLoading(true);
      
      // Clear any existing cart
      clearCart();
      
      // Add a test product to the cart
      const testProduct1: ProductWithDetails = {
        id: 'test-product-1',
        discogs_id: '12345',
        title: 'Test Product (Vinyl)',
        artist: 'Test Artist',
        price: 29.99,
        slug: 'test-product-1',
        condition: 'Mint',
        description: 'A test vinyl record for testing checkout functionality',
        in_stock: true,
        images: [{ 
          id: 'test-image-1', 
          product_id: 'test-product-1',
          url: 'https://via.placeholder.com/300x300?text=Test+Product',
          is_primary: true
        }],
        genres: [],
        styles: []
      };
      
      addToCart(testProduct1, 1);
      
      // Add another test product
      const testProduct2: ProductWithDetails = {
        id: 'test-product-2',
        discogs_id: '67890',
        title: 'Test Product (CD)',
        artist: 'Another Artist',
        price: 14.99,
        slug: 'test-product-2',
        condition: 'Very Good Plus',
        description: 'A test CD for testing checkout functionality',
        in_stock: true,
        images: [{ 
          id: 'test-image-2', 
          product_id: 'test-product-2',
          url: 'https://via.placeholder.com/300x300?text=Test+CD',
          is_primary: true
        }],
        genres: [],
        styles: []
      };
      
      addToCart(testProduct2, 2);
      
      // Redirect to checkout
      router.push('/checkout');
      
    } catch (error) {
      console.error('Error setting up test order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Stripe Test Payment</h1>
      
      <div className="bg-amber-50 p-4 mb-8 rounded-md border border-amber-200">
        <h2 className="text-lg font-semibold mb-2">⚠️ Testing Environment Only</h2>
        <p>This page is for testing the Stripe payment integration. Use the test cards below to simulate different payment scenarios.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div>
          <h2 className="text-xl font-bold mb-4">Test Cards</h2>
          <div className="space-y-4">
            {testCards.map((card, index) => (
              <div key={index} className="bg-white p-4 rounded-md border border-gray-200">
                <p className="font-mono text-lg mb-1">{card.number}</p>
                <p className="font-medium">{card.description}</p>
                <p className="text-sm text-gray-600 mt-1">Expected: {card.expectedResult}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-white p-4 rounded-md border border-gray-200 mt-4">
            <h3 className="font-bold mb-2">Test Data for Other Fields</h3>
            <ul className="space-y-1">
              <li><span className="font-medium">Expiry Date:</span> {testData.expiryDate}</li>
              <li><span className="font-medium">CVC:</span> {testData.cvc}</li>
              <li><span className="font-medium">Postal Code:</span> {testData.postalCode}</li>
            </ul>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4">Test Process</h2>
          <ol className="list-decimal pl-6 space-y-3 mb-6">
            <li>Click the &quot;Create Test Order&quot; button below</li>
            <li>You&apos;ll be redirected to the checkout page with test products</li>
            <li>Fill out the checkout form with test data</li>
            <li>Use one of the test card numbers from the left</li>
            <li>Complete the payment to see the result</li>
          </ol>
          
          <button
            onClick={setupTestOrder}
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-md text-white font-medium transition ${
              isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Setting up...' : 'Create Test Order'}
          </button>
          
          <Link 
            href="/"
            className="mt-4 w-full py-3 px-4 rounded-md border border-gray-300 text-center inline-block"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-md border border-gray-200">
        <h2 className="text-xl font-bold mb-3">Webhook Testing</h2>
        <p className="mb-4">
          To test webhooks locally, you can use the Stripe CLI to forward events to your local server:
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-x-auto">
          stripe listen --forward-to localhost:3000/api/stripe/webhook
        </pre>
      </div>
    </div>
  );
} 
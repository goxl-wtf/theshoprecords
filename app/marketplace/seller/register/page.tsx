'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSeller } from '@/context/SellerContext';
import AuthCheck from '@/components/auth/AuthCheck';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SellerRegisterPage() {
  const router = useRouter();
  const { registerAsSeller, isLoading } = useSeller();
  
  const [storeName, setStoreName] = useState('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Validate inputs
      if (!storeName.trim()) {
        throw new Error('Store name is required');
      }
      
      const result = await registerAsSeller({
        store_name: storeName,
        description,
        contact_email: contactEmail,
        logo_url: logoUrl,
      });
      
      if (result) {
        setSuccess(true);
        // Redirect after a short delay
        setTimeout(() => {
          router.push('/marketplace/seller/dashboard');
        }, 1500);
      } else {
        throw new Error('Failed to register as seller');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Error registering as seller:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }
  
  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Become a Seller</h1>
        
        {success ? (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            <p className="font-bold">Success!</p>
            <p>Your seller profile has been created. Redirecting to your dashboard...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                <p>{error}</p>
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Seller Benefits</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Sell your vinyl collection to music enthusiasts worldwide</li>
                <li>Set your own prices and manage your inventory</li>
                <li>Connect with buyers who share your musical interests</li>
                <li>Easy integration with Discogs for product information</li>
                <li>Low platform fees and secure payment processing</li>
              </ul>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Store Name *
                </label>
                <Input
                  id="storeName"
                  type="text"
                  value={storeName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStoreName(e.target.value)}
                  placeholder="Your record store name"
                  required
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">This will be displayed to buyers</p>
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Store Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell buyers about your store, expertise, and the types of records you sell"
                  rows={4}
                  className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 p-3"
                />
              </div>
              
              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Email
                </label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContactEmail(e.target.value)}
                  placeholder="contact@yourdomain.com"
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">This will be used for seller communications</p>
              </div>
              
              <div>
                <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Logo URL
                </label>
                <Input
                  id="logoUrl"
                  type="url"
                  value={logoUrl}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/your-logo.png"
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-1">URL to your store logo (optional)</p>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
                <h3 className="text-md font-semibold mb-2">Seller Agreement</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  By registering as a seller, you agree to the marketplace&apos;s terms and conditions, 
                  including commission fees, shipping requirements, and seller responsibilities.
                </p>
                
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting || !storeName.trim()}
                >
                  Register as Seller
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AuthCheck>
  );
} 
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

interface VerificationRequestFormProps {
  sellerId: string;
  onRequestSent?: () => void;
  className?: string;
}

const VerificationRequestForm: React.FC<VerificationRequestFormProps> = ({
  sellerId,
  onRequestSent,
  className = '',
}) => {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/marketplace/seller/verification-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seller_id: sellerId,
          business_name: businessName,
          website_url: websiteUrl,
          tax_id: taxId,
          additional_info: additionalInfo,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit verification request');
      }

      setSuccess(true);
      if (onRequestSent) {
        onRequestSent();
      }
    } catch (err: any) {
      console.error('Error submitting verification request:', err);
      setError(err.message || 'An error occurred while submitting your request');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mb-4">
            <svg
              className="w-6 h-6 text-green-600 dark:text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Verification Request Submitted
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
            Your verification request has been submitted successfully. Our team will review your
            request and get back to you within 2-3 business days.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 ${className}`}>
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Seller Verification Request
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Complete this form to request verification for your seller account. Verified sellers benefit from
        higher visibility, increased trust, and priority placement in marketplace listings.
      </p>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 mb-6">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="businessName" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Business Name*
            </label>
            <input
              id="businessName"
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="websiteUrl" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Business Website
            </label>
            <input
              id="websiteUrl"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://yourbusiness.com"
            />
          </div>

          <div>
            <label 
              htmlFor="taxId" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Tax ID / Business Registration Number*
            </label>
            <input
              id="taxId"
              type="text"
              value={taxId}
              onChange={(e) => setTaxId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label 
              htmlFor="additionalInfo" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Additional Information
            </label>
            <textarea
              id="additionalInfo"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              rows={4}
              placeholder="Please provide any additional information about your business or experience selling records"
            />
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            By submitting this request, you confirm all information provided is accurate. 
            We may contact you for additional verification if needed.
          </p>

          <div className="mt-6">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? <><Spinner size="sm" /> <span className="ml-2">Submitting...</span></> : 'Submit Verification Request'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VerificationRequestForm; 
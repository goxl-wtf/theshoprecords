'use client';

import React from 'react';
import { ListingCondition } from '@/utils/types';
import { FiStar, FiCheck, FiCheckCircle } from 'react-icons/fi';

interface MarketplaceFiltersProps {
  showMarketplaceListings: boolean;
  setShowMarketplaceListings: (show: boolean) => void;
  sellerRatingFilter: number | null;
  setSellerRatingFilter: (rating: number | null) => void;
  verifiedSellersOnly: boolean;
  setVerifiedSellersOnly: (verified: boolean) => void;
  conditionFilter: ListingCondition | null;
  setConditionFilter: (condition: ListingCondition | null) => void;
  sellerPriceRange: [number, number];
  setSellerPriceRange: (range: [number, number]) => void;
  minSellerPrice: number;
  maxSellerPrice: number;
}

// Function to format condition for display
const formatCondition = (condition: string): string => {
  return condition
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  showMarketplaceListings,
  setShowMarketplaceListings,
  sellerRatingFilter,
  setSellerRatingFilter,
  verifiedSellersOnly,
  setVerifiedSellersOnly,
  conditionFilter,
  setConditionFilter,
  sellerPriceRange,
  setSellerPriceRange,
  minSellerPrice,
  maxSellerPrice,
}) => {
  // List of possible conditions
  const conditions: ListingCondition[] = [
    'mint',
    'near_mint',
    'very_good',
    'good',
    'fair',
    'poor',
  ];

  // Rating options
  const ratingOptions = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-6 pb-6 border-b dark:border-gray-700">
      <h3 className="text-base font-medium text-gray-900 dark:text-white">Marketplace</h3>
      
      {/* Toggle for marketplace listings */}
      <div className="relative flex items-start">
        <div className="flex h-5 items-center">
          <input
            id="marketplace-toggle"
            name="marketplace-toggle"
            type="checkbox"
            checked={showMarketplaceListings}
            onChange={(e) => setShowMarketplaceListings(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-primary-400"
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="marketplace-toggle" className="font-medium text-gray-700 dark:text-gray-300">
            Show Marketplace Listings
          </label>
        </div>
      </div>

      {showMarketplaceListings && (
        <div className="space-y-5">
          {/* Seller Rating Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2 flex items-center">
              <FiStar className="mr-1 text-yellow-400" /> 
              Minimum Seller Rating
            </h4>
            <div className="flex flex-wrap gap-2">
              {ratingOptions.map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSellerRatingFilter(sellerRatingFilter === rating ? null : rating)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    sellerRatingFilter === rating
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {rating}+ ★
                </button>
              ))}
              {sellerRatingFilter !== null && (
                <button
                  onClick={() => setSellerRatingFilter(null)}
                  className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Verified Sellers Only */}
          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input
                id="verified-sellers"
                name="verified-sellers"
                type="checkbox"
                checked={verifiedSellersOnly}
                onChange={(e) => setVerifiedSellersOnly(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:focus:ring-primary-400"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="verified-sellers" className="font-medium text-gray-700 dark:text-gray-300 flex items-center">
                <FiCheckCircle className="mr-1 text-green-500" /> 
                Verified Sellers Only
              </label>
            </div>
          </div>

          {/* Condition Filter */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Condition</h4>
            <div className="flex flex-wrap gap-2">
              {conditions.map((condition) => (
                <button
                  key={condition}
                  onClick={() => setConditionFilter(conditionFilter === condition ? null : condition)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    conditionFilter === condition
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  {formatCondition(condition)}
                </button>
              ))}
              {conditionFilter !== null && (
                <button
                  onClick={() => setConditionFilter(null)}
                  className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplaceFilters; 
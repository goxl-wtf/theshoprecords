'use client';

import React, { useState, useEffect } from 'react';
import { Listing, Product } from '@/utils/types';
import { formatCurrency } from '@/utils/formatters';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';

interface ProductListingsProps {
  product: Product;
  listings?: Listing[];
}

/**
 * ProductListings component displays all available listings for a product
 * allowing users to compare prices, conditions, and sellers
 */
const ProductListings: React.FC<ProductListingsProps> = ({ product, listings }) => {
  const [selectedListing, setSelectedListing] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string>('price_asc');
  const { addToCart } = useCart();
  
  // Use listings from props or from product if available
  const availableListings = listings || product.listings || [];
  
  // Filter only active listings
  const activeListings = availableListings.filter(listing => listing.status === 'active');

  // Sort listings based on the selected sort option
  const sortedListings = [...activeListings].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating_desc':
        const aRating = a.seller?.average_rating || 0;
        const bRating = b.seller?.average_rating || 0;
        return bRating - aRating;
      case 'condition_desc': {
        const conditionRank = {
          'mint': 6,
          'near_mint': 5,
          'very_good': 4,
          'good': 3,
          'fair': 2,
          'poor': 1
        };
        return (conditionRank[a.condition as keyof typeof conditionRank] || 0) - 
               (conditionRank[b.condition as keyof typeof conditionRank] || 0);
      }
      default:
        return a.price - b.price;
    }
  });
  
  // Format condition text for display
  const formatCondition = (condition: string): string => {
    return condition.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  // Handle adding a listing to cart
  const handleAddToCart = (listing: Listing) => {
    addToCart(product, 1, listing);
  };
  
  if (activeListings.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-dark-300 rounded-lg p-4 my-4">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No listings available for this product.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6" id="listings">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <h3 className="text-lg font-semibold">Available from {activeListings.length} sellers</h3>
        
        <div className="mt-2 md:mt-0">
          <label htmlFor="sort-listings" className="text-sm text-gray-500 dark:text-gray-400 mr-2">
            Sort by:
          </label>
          <select 
            id="sort-listings"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm p-1 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Seller Rating</option>
            <option value="condition_desc">Condition</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-dark-300">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Seller
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Condition
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Shipping
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-dark-200 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedListings.map((listing) => {
              const isSelected = selectedListing === listing.id;
              const sellerName = listing.seller?.store_name || 'Marketplace Seller';
              const isVerified = Boolean(listing.seller?.is_verified);
              const sellerRating = listing.seller?.average_rating || null;
              
              // Simplified shipping calculation for display
              const shippingCost = 5.99;
              
              return (
                <tr 
                  key={listing.id} 
                  className={`hover:bg-gray-50 dark:hover:bg-dark-300 transition-colors ${
                    isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  } cursor-pointer`}
                  onClick={() => setSelectedListing(isSelected ? null : listing.id)}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {/* Seller logo if available */}
                      <div className="flex-shrink-0 h-8 w-8 relative">
                        {listing.seller?.logo_url ? (
                          <Image
                            src={listing.seller.logo_url}
                            alt={sellerName}
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-primary bg-opacity-20 flex items-center justify-center text-primary">
                            {sellerName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center">
                          {sellerName}
                          {isVerified && (
                            <svg className="w-4 h-4 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                          )}
                        </div>
                        {sellerRating && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg 
                                  key={i} 
                                  className={`w-3 h-3 ${i < Math.round(sellerRating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                                  fill="currentColor" 
                                  viewBox="0 0 20 20" 
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                              ))}
                              <span className="ml-1">{sellerRating.toFixed(1)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-dark-300 text-gray-800 dark:text-gray-200 rounded-full">
                      {formatCondition(listing.condition)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatCurrency(listing.price)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatCurrency(shippingCost)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm">
                    <button 
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(listing);
                      }}
                    >
                      Add to Cart
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {selectedListing && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-dark-300 rounded-lg">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Listing Details</h4>
          
          {sortedListings.find(l => l.id === selectedListing)?.description && (
            <div className="mb-3">
              <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Description</h5>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {sortedListings.find(l => l.id === selectedListing)?.description}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Condition Details</h5>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {formatCondition(sortedListings.find(l => l.id === selectedListing)?.condition || 'unknown')}
              </p>
            </div>
            <div>
              <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">Available Quantity</h5>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {sortedListings.find(l => l.id === selectedListing)?.quantity || 1}
              </p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-light transition-colors duration-200"
              onClick={() => {
                const listing = sortedListings.find(l => l.id === selectedListing);
                if (listing) handleAddToCart(listing);
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListings; 
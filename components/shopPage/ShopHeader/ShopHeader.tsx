'use client';

import React from 'react';
import { FiShoppingBag } from 'react-icons/fi';

interface SortOption {
  value: string;
  label: string;
}

interface ShopHeaderProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalProducts: number;
  sortOptions?: SortOption[];
  showMarketplaceIndicator?: boolean;
}

const ShopHeader: React.FC<ShopHeaderProps> = ({
  sortBy,
  onSortChange,
  totalProducts,
  sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'title-a-z', label: 'Name: A-Z' },
    { value: 'title-z-a', label: 'Name: Z-A' },
  ],
  showMarketplaceIndicator = false,
}) => {
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  };

  return (
    <div className="bg-white dark:bg-dark-200 rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-grow flex items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
          </p>
          
          {showMarketplaceIndicator && (
            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              <FiShoppingBag className="mr-1" />
              Marketplace
            </span>
          )}
        </div>

        <div className="flex-shrink-0 min-w-[200px]">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Sort by
          </label>
          <select
            id="sort"
            className="w-full border border-gray-200 rounded-md py-2 pl-3 pr-10 bg-white dark:bg-dark-100 dark:border-dark-100 dark:text-white"
            value={sortBy}
            onChange={handleSortChange}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader; 
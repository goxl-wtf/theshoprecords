'use client';

import React, { useState } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

interface ShopHeaderProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalProducts: number;
}

const ShopHeader: React.FC<ShopHeaderProps> = ({
  searchTerm,
  onSearch,
  sortBy,
  onSortChange,
  totalProducts,
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchTerm);
  };

  const clearSearch = () => {
    setLocalSearchTerm('');
    onSearch('');
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  };

  return (
    <div className="bg-white dark:bg-dark-200 rounded-lg shadow-sm p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-grow">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <input
                type="text"
                className="w-full pl-10 pr-10 py-2.5 bg-gray-100 dark:bg-dark-100 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition-all dark:text-white"
                placeholder="Search products..."
                value={localSearchTerm}
                onChange={handleSearchChange}
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {localSearchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                >
                  <FiX />
                </button>
              )}
            </div>
          </form>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Showing {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
          </p>
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
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-asc">Name: A-Z</option>
            <option value="name-desc">Name: Z-A</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ShopHeader; 
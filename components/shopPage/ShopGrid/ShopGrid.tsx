'use client';

import React from 'react';
import ProductCard from '../../../components/ProductCard';
import { Product } from '../../../utils/types';
import { FiAlertCircle } from 'react-icons/fi';

interface ShopGridProps {
  products: Product[];
  loading: boolean;
}

const ShopGrid: React.FC<ShopGridProps> = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white dark:bg-dark-200 rounded-lg shadow-sm overflow-hidden">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 dark:bg-dark-100"></div>
              <div className="p-4">
                <div className="h-5 bg-gray-200 dark:bg-dark-100 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-dark-100 rounded w-1/2 mb-6"></div>
                <div className="h-6 bg-gray-200 dark:bg-dark-100 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white dark:bg-dark-200 rounded-lg p-8 text-center shadow-sm">
        <FiAlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Try changing your filters or search terms to find what you're looking for.
        </p>
        <button 
          onClick={() => window.location.href = '/shop'}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ShopGrid; 
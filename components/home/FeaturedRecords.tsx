'use client';

import React from 'react';
import ProductCard from '../ProductCard';
import ProductCardSkeleton from '../skeletons/ProductCardSkeleton';
import { ProductWithDetails } from '../../utils/types';

interface FeaturedRecordsProps {
  products: ProductWithDetails[];
  loading: boolean;
  error: string | null;
}

const FeaturedRecords: React.FC<FeaturedRecordsProps> = ({ products, loading, error }) => {
  return (
    <section className="py-12 bg-white dark:bg-black transition-colors duration-300">
      <div className="container-custom">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white transition-colors duration-300">Featured Records</h2>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedRecords; 
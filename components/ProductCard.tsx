import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '../utils/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Find the first image for the product or use a placeholder
  const fallbackImage = '/images/record-placeholder.svg';
  
  // Safe access to product images
  const productImage = product && 
    (product as any).images && 
    Array.isArray((product as any).images) && 
    (product as any).images.length > 0 ? 
    (product as any).images[0].url : 
    fallbackImage;
  
  // Function to handle adding to cart (will be implemented later)
  const addToCart = () => {
    console.log('Adding to cart:', product.id);
    // To be implemented with cart context
  };

  // Format the price nicely
  const formattedPrice = product.price 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price) 
    : 'Price on request';

  return (
    <div className="bg-white dark:bg-dark-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      <Link href={`/shop/${product.id}`} className="block overflow-hidden relative group">
        <div className="relative aspect-square transform transition-transform duration-300 group-hover:scale-105">
          <Image
            src={productImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-opacity duration-300"
            onError={(e) => {
              // Fallback if image fails to load
              const target = e.target as HTMLImageElement;
              target.src = fallbackImage;
            }}
          />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">View Details</span>
          </div>
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs mb-2">
          {product.format && (
            <span className="inline-block px-2 py-1 mr-2 mb-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full">
              {product.format}
            </span>
          )}
          {product.condition && (
            <span className="inline-block px-2 py-1 mb-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full">
              {product.condition}
            </span>
          )}
        </div>
        
        <Link href={`/shop/${product.id}`} className="group">
          <h3 className="font-semibold text-gray-900 dark:text-light-100 line-clamp-1 group-hover:text-primary transition-colors duration-200 relative">
            {product.title}
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-1">{product.artist}</p>
        </Link>
        
        <div className="mt-auto">
          <div className="mb-3">
            <span className="font-bold text-gray-900 dark:text-light-100">{formattedPrice}</span>
          </div>
          <button 
            onClick={addToCart}
            className="group relative overflow-hidden bg-primary text-white py-2 rounded text-sm w-full
            transition-all duration-300 ease-in-out
            hover:bg-primary-dark hover:shadow-lg hover:scale-[1.02] 
            active:scale-[0.98] active:shadow-inner"
          >
            <span className="relative z-10 flex items-center justify-center gap-1">
              Add to Cart
              <svg 
                className="w-0 h-4 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:w-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <span className="absolute bottom-0 left-0 w-full h-0 bg-white/10 transition-all duration-300 group-hover:h-full"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 
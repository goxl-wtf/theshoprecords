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
    <div className="bg-white dark:bg-dark-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square">
        <Image
          src={productImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
          onError={(e) => {
            // Fallback if image fails to load
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
          }}
        />
      </div>
      
      <div className="p-4">
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
        
        <h3 className="font-semibold text-gray-900 dark:text-light-100 line-clamp-1">{product.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-1">{product.artist}</p>
        
        <div className="flex justify-between items-center mt-4">
          <span className="font-bold text-gray-900 dark:text-light-100">{formattedPrice}</span>
          <div className="flex space-x-2">
            <Link
              href={`/shop/${product.id}`}
              className="text-primary hover:text-primary/80 font-medium"
            >
              View
            </Link>
            <button 
              onClick={addToCart}
              className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/90"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 
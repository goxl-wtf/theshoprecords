import React from 'react';
import Image from 'next/image';

export interface ProductImageProps {
  imageUrl: string | null;
  alt: string;
}

/**
 * ProductImage component displays the main product image
 * 
 * @param {ProductImageProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const ProductImage: React.FC<ProductImageProps> = ({ imageUrl, alt }) => {
  return (
    <div className="mb-4 relative aspect-square bg-white dark:bg-dark-200 rounded-lg overflow-hidden">
      {imageUrl ? (
        <Image 
          src={imageUrl} 
          alt={alt} 
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
        />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          No image available
        </div>
      )}
    </div>
  );
};

export default ProductImage; 
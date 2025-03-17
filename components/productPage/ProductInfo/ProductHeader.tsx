import React from 'react';

export interface ProductHeaderProps {
  title: string;
  artist: string;
}

/**
 * ProductHeader component displays the product title and artist
 * 
 * @param {ProductHeaderProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const ProductHeader: React.FC<ProductHeaderProps> = ({ title, artist }) => {
  return (
    <div className="mb-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-light-100 mb-2">
        {title}
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-300">
        {artist}
      </p>
    </div>
  );
};

export default ProductHeader; 
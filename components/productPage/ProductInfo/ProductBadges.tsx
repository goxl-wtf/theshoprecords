import React from 'react';

export interface ProductBadgesProps {
  format?: string;
  condition?: string;
  year?: number;
  label?: string;
}

/**
 * ProductBadges component displays product details as badge elements
 * 
 * @param {ProductBadgesProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const ProductBadges: React.FC<ProductBadgesProps> = ({
  format,
  condition,
  year,
  label
}) => {
  return (
    <div className="flex gap-4 flex-wrap">
      {format && (
        <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full">
          {format}
        </span>
      )}
      {condition && (
        <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full">
          {condition}
        </span>
      )}
      {year && (
        <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full">
          {year}
        </span>
      )}
      {label && (
        <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full">
          {label}
        </span>
      )}
    </div>
  );
};

export default ProductBadges; 
import React, { useState } from 'react';
import { ProductWithDetails } from '../../../utils/types';
import Description from './Description';
import TrackList from './TrackList';

export interface ProductTabsProps {
  product: ProductWithDetails;
}

/**
 * ProductTabs component manages the description and track list tabs
 * 
 * @param {ProductTabsProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<'description' | 'tracks'>('description');

  return (
    <div className="mt-8">
      <div className="border-b border-gray-200 dark:border-dark-300">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('description')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'description'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab('tracks')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tracks'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Track List
          </button>
        </nav>
      </div>
      
      <div className="py-4">
        {activeTab === 'description' ? (
          <Description description={product.description} />
        ) : (
          <TrackList tracks={product.tracks || []} />
        )}
      </div>
    </div>
  );
};

export default ProductTabs; 
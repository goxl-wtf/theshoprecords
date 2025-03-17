import React from 'react';
import { ProductWithDetails } from '../../../utils/types';
import ProductHeader from './ProductHeader';
import ProductBadges from './ProductBadges';
import ProductMeta from './ProductMeta';
import AddToCart from './AddToCart';

export interface ProductInfoProps {
  product: ProductWithDetails;
}

/**
 * ProductInfo component displays all the product information sections
 * 
 * @param {ProductInfoProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  return (
    <div>
      <ProductHeader
        title={product.title}
        artist={product.artist}
      />
      
      <div className="space-y-4 mb-6">
        <ProductBadges
          format={product.format}
          condition={product.condition}
          year={product.year}
          label={product.label}
        />
        
        <ProductMeta
          genres={product.genres}
          styles={product.styles}
        />
        
        <AddToCart
          price={product.price}
          stock={product.stock}
        />
      </div>
    </div>
  );
};

export default ProductInfo; 
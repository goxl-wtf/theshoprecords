import React, { useEffect, useState } from 'react';
import { ProductWithDetails, Listing } from '@/utils/types';
import AddToCartButton from '@/components/ui/AddToCartButton';
import { formatCurrency } from '@/utils/formatters';
import { useCart } from '@/context/CartContext';

export interface AddToCartProps {
  price: number;
  in_stock: boolean;
  product: ProductWithDetails;
}

/**
 * AddToCart component displays the product price, stock info, and add to cart button
 * 
 * @param {AddToCartProps} props - The component props
 * @returns {JSX.Element} The rendered component
 */
const AddToCart: React.FC<AddToCartProps> = ({ price, in_stock, product }) => {
  const [bestListing, setBestListing] = useState<Listing | null>(null);
  const [activeListingsCount, setActiveListingsCount] = useState<number>(0);
  const { isInCart } = useCart();
  
  useEffect(() => {
    // If product has listings, find the best (lowest price) active listing
    if (product.listings && product.listings.length > 0) {
      const activeListings = product.listings.filter(
        listing => listing.status === 'active' && listing.quantity > 0
      );
      
      setActiveListingsCount(activeListings.length);
      
      if (activeListings.length > 0) {
        // Sort by price and get the lowest
        const lowestPriceListing = [...activeListings].sort(
          (a, b) => a.price - b.price
        )[0];
        
        setBestListing(lowestPriceListing);
      }
    }
  }, [product.listings]);

  // Format the price nicely
  const formattedPrice = bestListing 
    ? formatCurrency(bestListing.price)
    : price 
      ? formatCurrency(price) 
      : 'Price on request';

  // Check if item is in stock (either traditional inventory or from listings)
  const isAvailable = bestListing ? true : in_stock;
  
  // Check if the product or listing is already in the cart
  const inCart = isInCart(product.id, bestListing?.id);

  return (
    <div className="py-4 border-t border-b border-gray-200 dark:border-dark-300 flex justify-between items-center">
      <div>
        <span className="text-2xl font-bold text-gray-900 dark:text-light-100">{formattedPrice}</span>
        {bestListing && activeListingsCount > 1 && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            {activeListingsCount} sellers available - Compare all options below
          </p>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {isAvailable 
            ? 'In stock' 
            : 'Out of stock'}
        </p>
        
        {/* Show seller info if it's a marketplace listing */}
        {bestListing && bestListing.seller && (
          <div className="mt-2 flex items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">Sold by:</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 ml-1 flex items-center">
              {bestListing.seller.store_name || 'Marketplace Seller'}
              {bestListing.seller.is_verified && (
                <svg className="w-3 h-3 text-blue-500 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
              )}
            </span>
          </div>
        )}
      </div>
      
      <AddToCartButton 
        product={product}
        size="medium"
        showQuantity={true}
        listing={bestListing || undefined}
        isInCart={inCart}
        className={!isAvailable ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed' : ''}
      />
    </div>
  );
};

export default AddToCart; 
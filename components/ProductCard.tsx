import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product, Listing } from '../utils/types';
import { formatCurrency } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  showSeller?: boolean;
  listing?: Listing;
  showMarketplaceDetails?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  showSeller = true, 
  listing,
  showMarketplaceDetails = false
}) => {
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

  // Determine if we have a listing or just a product
  const hasListing = listing || (product.listings && product.listings.length > 0);
  
  // Get the current listing (either passed directly or first one from product)
  const currentListing = listing || (product.listings && product.listings.length > 0 ? product.listings[0] : null);
  
  // Count number of available listings for this product
  const listingCount = product.listings?.filter(l => l.status === 'active')?.length || 0;
  
  // Format the price nicely
  const formattedPrice = currentListing 
    ? formatCurrency(currentListing.price)
    : product.price
      ? formatCurrency(product.price)
      : 'Price on request';
  
  // Get seller information
  const sellerName = currentListing?.seller?.store_name || 
    (currentListing?.seller_id ? 'Marketplace Seller' : 'Official Store');
  const isVerified = currentListing ? Boolean(currentListing.seller?.is_verified) : false;
  const sellerRating = currentListing?.seller?.average_rating || null;

  // Should we actually show the seller section - either by prop or because we're in marketplace mode
  const shouldShowSeller = showSeller || showMarketplaceDetails;

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
          
          {/* Multiple listings indicator with improved styling */}
          {listingCount > 1 && (
            <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>{listingCount} sellers</span>
            </div>
          )}
          
          {/* Marketplace badge */}
          {showMarketplaceDetails && (
            <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Marketplace</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4 flex flex-col flex-grow">
        <div className="text-xs mb-2">
          {product.format && (
            <span className="inline-block px-2 py-1 mr-2 mb-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full">
              {product.format}
            </span>
          )}
          {currentListing && currentListing.condition ? (
            <span className="inline-block px-2 py-1 mb-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full">
              {currentListing.condition}
            </span>
          ) : product.condition && (
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
        
        {/* Enhanced seller information section */}
        {shouldShowSeller && hasListing && (
          <div className="flex items-center mt-1 mb-2 bg-gray-50 dark:bg-dark-300 rounded-md p-2">
            <div className="flex-shrink-0 mr-2">
              {currentListing?.seller?.logo_url ? (
                <div className="h-8 w-8 relative rounded-full overflow-hidden">
                  <Image
                    src={currentListing.seller.logo_url}
                    alt={sellerName}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-8 w-8 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
                  <span className="text-primary font-semibold text-sm">
                    {sellerName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex-grow overflow-hidden">
              <div className="flex items-center">
                <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate mr-1">
                  {sellerName}
                </p>
                {isVerified && (
                  <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                )}
              </div>
              
              {/* Star rating display */}
              {sellerRating && (
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-3 h-3 ${i < Math.floor(sellerRating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  ))}
                  <span className="ml-1 text-xs text-gray-600 dark:text-gray-400">
                    {sellerRating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="mt-auto">
          <div className="mb-3">
            <span className="font-bold text-gray-900 dark:text-light-100">{formattedPrice}</span>
            
            {/* Enhanced compare prices indicator */}
            {listingCount > 1 && (
              <Link 
                href={`/shop/${product.id}#listings`}
                className="text-xs text-blue-600 dark:text-blue-400 ml-2 hover:underline inline-flex items-center"
              >
                <span>Compare prices</span>
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            )}
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
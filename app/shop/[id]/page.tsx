"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchProductById } from '../../../utils/productService';
import { ProductWithDetails } from '../../../utils/types';
import BreadcrumbNav from '../../../components/BreadcrumbNav';
import Loading from '../../../components/Loading';

// Import our components
import ProductGallery from '../../../components/productPage/ProductGallery';
import ProductInfo from '../../../components/productPage/ProductInfo';
import ProductTabs from '../../../components/productPage/ProductTabs';
import ProductListings from '../../../components/productPage/ProductListings';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [multipleListings, setMultipleListings] = useState<boolean>(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductById(id);
        setProduct(productData);
        
        // Check if the product has multiple listings
        setMultipleListings(
          Boolean(productData?.listings && 
          Array.isArray(productData.listings) && 
          productData.listings.length > 0)
        );
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading product:', err);
        setError('Failed to load product details');
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <p className="text-red-700">Error: {error || 'Product not found'}</p>
          <p className="text-red-500">
            Please try again or go back to the <Link href="/shop" className="underline">shop</Link>.
          </p>
        </div>
      </div>
    );
  }
  
  // Breadcrumb navigation items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: product.title, href: `/shop/${product.id}`, active: true }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-8">
        {/* Left side - Images */}
        <ProductGallery
          images={product.images || []}
          title={product.title}
        />
        
        {/* Right side - Product Info */}
        <div>
          <ProductInfo product={product} />
          
          {/* If multiple listings are available, show comparison info */}
          {multipleListings ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mt-6 mb-4">
              <p className="text-blue-700 dark:text-blue-300 text-sm flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                </svg>
                This product is available from multiple sellers. Compare prices and conditions below.
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-dark-300 rounded-lg p-4 mt-6 mb-4">
              <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                </svg>
                This product is currently only available directly from our store.
              </p>
            </div>
          )}
          
          <ProductTabs product={product} />
        </div>
      </div>
      
      {/* Show the listings comparison if multiple listings are available */}
      {multipleListings && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-light-100">
            Compare Listings
          </h2>
          <ProductListings product={product} />
        </div>
      )}
      
      {/* Additional product recommendations section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-light-100">
          You might also like
        </h2>
        {/* Recommended products would go here */}
        <div className="text-center p-8 bg-gray-50 dark:bg-dark-300 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Recommendations will appear here based on your browsing history and this product's genre.
          </p>
        </div>
      </div>
    </div>
  );
} 
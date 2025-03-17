"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchProductById } from '../../../utils/productService';
import { ProductWithDetails } from '../../../utils/types';
import BreadcrumbNav from '../../../components/BreadcrumbNav';
import Loading from '../../../components/Loading';

// Import our new components
import ProductGallery from '../../../components/productPage/ProductGallery';
import ProductInfo from '../../../components/productPage/ProductInfo';
import ProductTabs from '../../../components/productPage/ProductTabs';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductById(id);
        setProduct(productData);
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
          <ProductTabs product={product} />
        </div>
      </div>
    </div>
  );
} 
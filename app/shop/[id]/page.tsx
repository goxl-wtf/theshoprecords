"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { fetchProductById } from '../../../utils/productService';
import { ProductWithDetails } from '../../../utils/types';
import BreadcrumbNav from '../../../components/BreadcrumbNav';
import Loading from '../../../components/Loading';

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'description' | 'tracks'>('description');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const productData = await fetchProductById(id);
        setProduct(productData);
        
        // Set the first image as active if available
        if (productData?.images && productData.images.length > 0) {
          setActiveImage(productData.images[0].url);
        }
        
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

  // Format the price nicely
  const formattedPrice = product.price 
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.price) 
    : 'Price on request';
  
  // Breadcrumb navigation items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
    { label: product.title, href: `/shop/${product.id}`, active: true }
  ];

  // Handle image thumbnail click
  const handleThumbnailClick = (imageUrl: string) => {
    setActiveImage(imageUrl);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-8">
        {/* Left side - Images */}
        <div>
          {/* Main Image */}
          <div className="mb-4 relative aspect-square bg-white dark:bg-dark-200 rounded-lg overflow-hidden">
            {activeImage ? (
              <Image 
                src={activeImage} 
                alt={product.title} 
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
          
          {/* Image Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {product.images.slice(0, 5).map((image) => (
                <button
                  key={image.id}
                  onClick={() => handleThumbnailClick(image.url)}
                  className={`relative aspect-square rounded-md overflow-hidden ${
                    activeImage === image.url ? 'ring-2 ring-primary' : 'ring-1 ring-gray-200 dark:ring-dark-300'
                  }`}
                >
                  <Image 
                    src={image.url} 
                    alt={`${product.title} thumbnail`} 
                    fill
                    sizes="(max-width: 768px) 20vw, 10vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Right side - Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-light-100 mb-2">{product.title}</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">{product.artist}</p>
          
          {/* Product Details */}
          <div className="space-y-4 mb-6">
            <div className="flex gap-4 flex-wrap">
              {product.format && (
                <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full">
                  {product.format}
                </span>
              )}
              {product.condition && (
                <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full">
                  {product.condition}
                </span>
              )}
              {product.year && (
                <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full">
                  {product.year}
                </span>
              )}
              {product.label && (
                <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full">
                  {product.label}
                </span>
              )}
            </div>
            
            {/* Genres and Styles */}
            <div className="flex flex-col gap-2">
              {product.genres && product.genres.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Genres:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.genres.map(genre => (
                      <span 
                        key={genre.id} 
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {product.styles && product.styles.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Styles:</span>
                  <div className="flex flex-wrap gap-2">
                    {product.styles.map(style => (
                      <span 
                        key={style.id} 
                        className="text-sm text-gray-600 dark:text-gray-400"
                      >
                        {style.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Price and Stock */}
            <div className="py-4 border-t border-b border-gray-200 dark:border-dark-300 flex justify-between items-center">
              <div>
                <span className="text-2xl font-bold text-gray-900 dark:text-light-100">{formattedPrice}</span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {product.stock > 0 
                    ? `${product.stock} in stock` 
                    : 'Out of stock'}
                </p>
              </div>
              
              <button 
                className={`px-6 py-2 rounded-md text-white font-medium ${
                  product.stock > 0
                    ? 'bg-primary hover:bg-primary/90'
                    : 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
                }`}
                disabled={product.stock <= 0}
              >
                Add to Cart
              </button>
            </div>
          </div>
          
          {/* Product Description Tabs */}
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
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
                  
                  {product.notes && (
                    <div className="mt-4">
                      <h3 className="text-lg font-medium mb-2">Notes</h3>
                      <p className="text-gray-600 dark:text-gray-400">{product.notes}</p>
                    </div>
                  )}
                  
                  {product.discogs_url && (
                    <div className="mt-4">
                      <a 
                        href={product.discogs_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        View on Discogs
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {product.tracks && product.tracks.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-300">
                        <thead className="bg-gray-50 dark:bg-dark-300">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Position</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-dark-200 divide-y divide-gray-200 dark:divide-dark-300">
                          {product.tracks.map((track) => (
                            <tr key={track.id} className="hover:bg-gray-50 dark:hover:bg-dark-300">
                              <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{track.position}</td>
                              <td className="px-4 py-2 text-sm text-gray-900 dark:text-gray-200">{track.title}</td>
                              <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">{track.duration || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No track listing available for this product.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
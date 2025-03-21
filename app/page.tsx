'use client';

import React, { useState, useEffect } from 'react';
import HeroSlider from '@/components/home/HeroSlider';
import HeroSliderSkeleton from '@/components/skeletons/HeroSliderSkeleton';
import SearchWithStats from '@/components/home/SearchWithStats';
import FeaturedRecords from '@/components/home/FeaturedRecords';
import GenreShowcase from '@/components/home/GenreShowcase';
import { fetchProducts } from '@/utils/productService';
import { ProductWithDetails } from '@/utils/types';

function HomePage() {
  const [loading, setLoading] = useState(true);
  const [heroProducts, setHeroProducts] = useState<ProductWithDetails[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithDetails[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // List of genres for the showcase
  // Using placeholder images until we have our own genre images
  const genres = [
    { name: "Rock", image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=400&h=200&auto=format&fit=crop" },
    { name: "Jazz", image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?q=80&w=400&h=200&auto=format&fit=crop" },
    { name: "Hip-Hop", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=400&h=200&auto=format&fit=crop" },
    { name: "Folk, World & Country", image: "https://images.unsplash.com/photo-1447619297994-b829cc1ab44a?q=80&w=400&h=200&auto=format&fit=crop" }
  ];

  // Get random products for featured sections
  const getRandomProducts = (products: ProductWithDetails[], count: number) => {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Fetch products on component mount
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const products = await fetchProducts();
        
        if (products && Array.isArray(products)) {
          setTotalProducts(products.length);
          
          // Select random products for hero section
          setHeroProducts(getRandomProducts(products, 5));
          
          // Select different random products for featured section
          setFeaturedProducts(getRandomProducts(products, 8));
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Handle search form submission
  const handleSearch = (query: string) => {
    // Navigate to search results page with query
    window.location.href = `/shop?search=${encodeURIComponent(query)}`;
  };

  return (
    <>
      {/* Hero Section with Carousel */}
      <section className="bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-black py-10 md:py-20 transition-colors duration-300 overflow-hidden">
        <div className="container-custom">
          {loading ? (
            <HeroSliderSkeleton />
          ) : heroProducts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No featured albums available</p>
            </div>
          ) : (
            <HeroSlider products={heroProducts} autoPlayInterval={5000} />
          )}
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container-custom">
          <SearchWithStats
            productCount={totalProducts}
            onSearch={handleSearch}
          />
        </div>
      </section>

      {/* Featured Records */}
      <section className="py-16 bg-gray-50 dark:bg-black transition-colors duration-300">
        <div className="container-custom">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 aspect-square mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <FeaturedRecords products={featuredProducts} loading={loading} error={error} />
          )}
        </div>
      </section>

      {/* Categories/Genres Section */}
      <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container-custom">
          <GenreShowcase genres={genres} />
        </div>
      </section>
    </>
  );
}

export default function Home() {
  return (
    <>
      {/* Original HomePage Content */}
      <HomePage />
    </>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layouts/MainLayout';
import HeroSlider from '../components/home/HeroSlider';
import HeroSliderSkeleton from '../components/skeletons/HeroSliderSkeleton';
import SearchWithStats from '../components/home/SearchWithStats';
import FeaturedRecords from '../components/home/FeaturedRecords';
import GenreShowcase from '../components/home/GenreShowcase';
import { fetchProducts } from '../utils/productService';
import { ProductWithDetails } from '../utils/types';

// Sample data for genres
const genres = [
  { name: 'Rock', image: '/images/record-placeholder.svg' },
  { name: 'Jazz', image: '/images/record-placeholder.svg' },
  { name: 'Hip-Hop', image: '/images/record-placeholder.svg' },
  { name: 'Folk, World & Country', image: '/images/record-placeholder.svg' },
];

export default function Home() {
  const [featuredRecords, setFeaturedRecords] = useState<ProductWithDetails[]>([]);
  const [heroProducts, setHeroProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Function to get a random set of products from the full list
  const getRandomProducts = (products: ProductWithDetails[], count: number) => {
    // Make a copy to avoid mutating the original array
    const shuffled = [...products];
    // Only include products that have images
    const productsWithImages = shuffled.filter(p => 
      p.images && p.images.length > 0 && p.images[0].url
    );
    
    // If we don't have enough products with images, return what we have
    if (productsWithImages.length <= count) {
      return productsWithImages;
    }
    
    // Fisher-Yates shuffle algorithm
    for (let i = productsWithImages.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [productsWithImages[i], productsWithImages[j]] = [productsWithImages[j], productsWithImages[i]];
    }
    
    // Return the first 'count' elements
    return productsWithImages.slice(0, count);
  };
  
  // Fetch products from Supabase when the component mounts
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const products = await fetchProducts();
        
        // Select 3-5 random products for the hero carousel
        const randomHeroProducts = getRandomProducts(products, 5);
        setHeroProducts(randomHeroProducts);
        
        // Take products for the featured section (excluding hero products)
        const heroIds = new Set(randomHeroProducts.map(p => p.id));
        const remainingProducts = products.filter(p => !heroIds.has(p.id));
        setFeaturedRecords(remainingProducts.slice(0, 4));
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products');
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);

  // Handle search
  const handleSearch = (query: string) => {
    console.log('Search for:', query);
    // In a real application, this would trigger a search query to the API
  };

  return (
    <MainLayout>
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

      {/* Search Section with Statistics */}
      <SearchWithStats onSearch={handleSearch} />

      {/* Featured Records Section */}
      <FeaturedRecords 
        products={featuredRecords} 
        loading={loading} 
        error={error} 
      />
      
      {/* Categories/Genres Section */}
      <GenreShowcase genres={genres} />
    </MainLayout>
  );
}

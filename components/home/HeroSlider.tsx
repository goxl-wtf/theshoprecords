'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductWithDetails } from '../../utils/types';
import HeroNavigation from './HeroNavigation';

interface HeroSliderProps {
  products: ProductWithDetails[];
  autoPlayInterval?: number; // in milliseconds
}

const HeroSlider: React.FC<HeroSliderProps> = ({ products, autoPlayInterval = 18000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [previousSlide, setPreviousSlide] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<'right-to-left' | 'left-to-right'>('right-to-left');
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Helper function to get the lowest price from product listings or fallback to legacy price
  const getLowestPrice = (product: ProductWithDetails, showDecimals: boolean = false): string => {
    if (product.listings && product.listings.length > 0) {
      // Filter active listings and get the lowest price
      const activeListings = product.listings.filter(
        listing => listing.status === 'active' && listing.quantity > 0
      );
      
      if (activeListings.length > 0) {
        const lowestPrice = Math.min(...activeListings.map(listing => listing.price));
        return showDecimals ? lowestPrice.toFixed(2) : lowestPrice.toFixed(0);
      }
    }
    
    // Fallback to legacy price field if available
    if (product.price) {
      return showDecimals ? product.price.toFixed(2) : product.price.toFixed(0);
    }
    
    return showDecimals ? "0.00" : "0";
  };
  
  // Helper function to check if a product has active listings
  const hasActiveListings = (product: ProductWithDetails): boolean => {
    if (product.listings && product.listings.length > 0) {
      return product.listings.some(
        listing => listing.status === 'active' && listing.quantity > 0
      );
    }
    return false;
  };
  
  // Handle slide change with coordinated animations
  const handleSlideChange = useCallback((newSlide: number, direction: 'right-to-left' | 'left-to-right') => {
    if (isAnimating || newSlide === currentSlide) return;
    
    setIsAnimating(true);
    setPreviousSlide(currentSlide);
    setSlideDirection(direction);
    setCurrentSlide(newSlide);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
      setPreviousSlide(null);
    }, 800); // Same as animation duration
  }, [currentSlide, isAnimating]);
  
  // Auto-advance the carousel
  useEffect(() => {
    if (products.length <= 1 || isAnimating) return;
    
    const interval = setInterval(() => {
      handleSlideChange((currentSlide + 1) % products.length, 'right-to-left');
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [products, autoPlayInterval, currentSlide, isAnimating, handleSlideChange]);
  
  // Navigate to previous slide
  const prevSlide = () => {
    const newSlide = currentSlide === 0 ? products.length - 1 : currentSlide - 1;
    handleSlideChange(newSlide, 'left-to-right');
  };
  
  // Navigate to next slide
  const nextSlide = () => {
    const newSlide = (currentSlide + 1) % products.length;
    handleSlideChange(newSlide, 'right-to-left');
  };
  
  // Get products to display
  const currentProduct = products[currentSlide];
  const prevProduct = previousSlide !== null ? products[previousSlide] : null;
  
  // If no products, don't render anything
  if (!products.length || !currentProduct) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes slideOutLeft {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(-100%);
            opacity: 0;
          }
        }
        
        @keyframes slideOutRight {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(100%);
            opacity: 0;
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes scaleIn {
          from {
            transform: scale(0.7);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes floatAnimation {
          0% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-15px) rotate(3deg);
          }
          100% {
            transform: translateY(0) rotate(0);
          }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .animate-slide-out-left {
          animation: slideOutLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .animate-slide-out-right {
          animation: slideOutRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.7s ease-out forwards;
        }
        
        .animate-scale-in {
          animation: scaleIn 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        .animate-float {
          animation: floatAnimation 8s ease-in-out infinite;
        }
        
        .bg-blob {
          border-radius: 50%;
          filter: blur(10px);
          position: absolute;
          z-index: -1;
          opacity: 0.7;
          transition: all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
      
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="bg-blob animate-float" 
            style={{ 
              background: 'linear-gradient(to right, #7928CA, #FF0080)', 
              width: '300px', 
              height: '300px', 
              top: '-50px', 
              left: '-100px',
              animationDelay: '0s',
              animationDuration: '20s'
            }}
          ></div>
          <div 
            className="bg-blob animate-float" 
            style={{ 
              background: 'linear-gradient(to right, #0070F3, #00DFD8)', 
              width: '350px', 
              height: '350px', 
              bottom: '-100px', 
              right: '-100px',
              animationDelay: '1s',
              animationDuration: '15s'
            }}
          ></div>
        </div>

        {/* Carousel Content */}
        <div className="relative min-h-[500px] z-10 overflow-hidden">
          {/* Current slide */}
          <div 
            className={`flex flex-col md:flex-row items-center gap-8 min-h-[500px] absolute inset-0 ${
              isAnimating 
                ? slideDirection === 'right-to-left' 
                  ? 'animate-slide-in-right' 
                  : 'animate-slide-in-left'
                : ''
            }`}
            style={{ zIndex: 10 }}
          >
            {/* Left side - Album Image */}
            <div className="md:w-1/2 flex justify-center md:justify-end animate-scale-in">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src={currentProduct?.images && currentProduct.images.length > 0 
                    ? currentProduct.images[0].url 
                    : '/images/record-placeholder.svg'}
                  alt={`${currentProduct.artist} - ${currentProduct.title}`}
                  width={400}
                  height={400}
                  className="rounded-lg shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                  priority
                />
                <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4 rotate-12 shadow-lg z-20">
                  <div className="text-center">
                    <div className="text-xs">ONLY</div>
                    <div>€{getLowestPrice(currentProduct)}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className="md:w-1/2 text-center md:text-left flex flex-col justify-center">
              <div className="space-y-2 animate-fade-in">
                <div className="relative mb-4">
                  <div className="absolute -left-4 top-0 w-1 h-full bg-primary hidden md:block"></div>
                  {/* Artist name with gradient */}
                  <h2 className="text-3xl md:text-5xl font-bold">
                    <span className="bg-clip-text bg-gradient-to-r from-primary to-secondary text-transparent">{currentProduct.artist}</span>
                  </h2>
                  
                  {/* Album title - without repeating artist name */}
                  <p className="text-2xl md:text-3xl mt-2 text-gray-800 dark:text-white">
                    {currentProduct.title.includes(currentProduct.artist) 
                      ? currentProduct.title.replace(`${currentProduct.artist} - `, '') 
                      : currentProduct.title}
                  </p>
                </div>
                <div className="flex items-center justify-center md:justify-start mb-4">
                  <div className="flex items-center mr-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-yellow-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                    5.0 ({Math.round(Math.random() * 2000) + 500} ratings)
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentProduct.format && (
                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                      {currentProduct.format}
                    </span>
                  )}
                  {currentProduct.condition && (
                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                      {currentProduct.condition}
                    </span>
                  )}
                  {currentProduct.year && (
                    <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                      {currentProduct.year}
                    </span>
                  )}
                </div>
                
                <div className="mb-6">
                  <p className="text-xl font-bold mb-2 text-gray-800 dark:text-white transition-colors duration-300">
                    €{getLowestPrice(currentProduct, true)}
                  </p>
                  {currentProduct.in_stock || hasActiveListings(currentProduct) ? (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      In stock
                    </p>
                  ) : (
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Out of stock
                    </p>
                  )}
                </div>
                
                <Link 
                  href={`/shop/${currentProduct.id}`}
                  className="inline-block bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg hover:scale-105 transform transition-all duration-300"
                >
                  Bekijk in TheWebShop
                </Link>
              </div>
            </div>
          </div>
          
          {/* Previous slide if it exists */}
          {prevProduct && (
            <div 
              className={`flex flex-col md:flex-row items-center gap-8 min-h-[500px] absolute inset-0 ${
                slideDirection === 'right-to-left' 
                  ? 'animate-slide-out-left' 
                  : 'animate-slide-out-right'
              }`}
              style={{ zIndex: 5 }}
            >
              {/* Left side - Album Image */}
              <div className="md:w-1/2 flex justify-center md:justify-end">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Image
                    src={prevProduct?.images && prevProduct.images.length > 0 
                      ? prevProduct.images[0].url 
                      : '/images/record-placeholder.svg'}
                    alt={`${prevProduct.artist} - ${prevProduct.title}`}
                    width={400}
                    height={400}
                    className="rounded-lg shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)]"
                  />
                  <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4 rotate-12 shadow-lg z-20">
                    <div className="text-center">
                      <div className="text-xs">ONLY</div>
                      <div>€{getLowestPrice(prevProduct)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right side - Content */}
              <div className="md:w-1/2 text-center md:text-left flex flex-col justify-center">
                <div className="space-y-2">
                  <div className="relative mb-4">
                    <div className="absolute -left-4 top-0 w-1 h-full bg-primary hidden md:block"></div>
                    {/* Artist name with gradient */}
                    <h2 className="text-3xl md:text-5xl font-bold">
                      <span className="bg-clip-text bg-gradient-to-r from-primary to-secondary text-transparent">{prevProduct.artist}</span>
                    </h2>
                    
                    {/* Album title - without repeating artist name */}
                    <p className="text-2xl md:text-3xl mt-2 text-gray-800 dark:text-white">
                      {prevProduct.title.includes(prevProduct.artist) 
                        ? prevProduct.title.replace(`${prevProduct.artist} - `, '') 
                        : prevProduct.title}
                    </p>
                  </div>
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    <div className="flex items-center mr-2">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-yellow-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                          />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                      5.0 ({Math.round(Math.random() * 2000) + 500} ratings)
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prevProduct.format && (
                      <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                        {prevProduct.format}
                      </span>
                    )}
                    {prevProduct.condition && (
                      <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                        {prevProduct.condition}
                      </span>
                    )}
                    {prevProduct.year && (
                      <span className="inline-block px-3 py-1 bg-gray-100 dark:bg-dark-300 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                        {prevProduct.year}
                      </span>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <p className="text-xl font-bold mb-2 text-gray-800 dark:text-white transition-colors duration-300">
                      €{getLowestPrice(prevProduct, true)}
                    </p>
                    {prevProduct.in_stock || hasActiveListings(prevProduct) ? (
                      <p className="text-sm text-green-600 dark:text-green-400">
                        In stock
                      </p>
                    ) : (
                      <p className="text-sm text-red-600 dark:text-red-400">
                        Out of stock
                      </p>
                    )}
                  </div>
                  
                  <Link 
                    href={`/shop/${prevProduct.id}`}
                    className="inline-block bg-gradient-to-r from-primary to-secondary text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg hover:scale-105 transform transition-all duration-300"
                  >
                    Bekijk in TheWebShop
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Carousel Navigation */}
        <HeroNavigation 
          totalSlides={products.length}
          currentSlide={currentSlide}
          onPrevClick={prevSlide}
          onNextClick={nextSlide}
          onDotClick={(index) => {
            const direction = index > currentSlide ? 'right-to-left' : 'left-to-right';
            handleSlideChange(index, direction);
          }}
          className="relative z-20"
        />
      </div>
    </>
  );
};

export default HeroSlider; 
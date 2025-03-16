'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductWithDetails } from '../../utils/types';
import HeroNavigation from './HeroNavigation';

interface HeroSliderProps {
  products: ProductWithDetails[];
  autoPlayInterval?: number; // in milliseconds
}

const HeroSlider: React.FC<HeroSliderProps> = ({ products, autoPlayInterval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'right-to-left' | 'left-to-right'>('right-to-left');
  const [animationKey, setAnimationKey] = useState(0);
  
  // Auto-advance the carousel
  useEffect(() => {
    if (products.length === 0) return;
    
    const interval = setInterval(() => {
      setSlideDirection('right-to-left');
      setCurrentSlide((prev) => {
        const newSlide = (prev + 1) % products.length;
        setAnimationKey(prevKey => prevKey + 1);
        return newSlide;
      });
    }, autoPlayInterval);
    
    return () => clearInterval(interval);
  }, [products, autoPlayInterval]);
  
  // Navigate to previous slide
  const prevSlide = () => {
    setSlideDirection('left-to-right');
    setCurrentSlide((prev) => {
      const newSlide = prev === 0 ? products.length - 1 : prev - 1;
      setAnimationKey(prevKey => prevKey + 1);
      return newSlide;
    });
  };
  
  // Navigate to next slide
  const nextSlide = () => {
    setSlideDirection('right-to-left');
    setCurrentSlide((prev) => {
      const newSlide = (prev + 1) % products.length;
      setAnimationKey(prevKey => prevKey + 1);
      return newSlide;
    });
  };
  
  // Get the current product to display in hero
  const currentProduct = products[currentSlide];
  
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
        
        .animate-slide-in-right {
          animation: slideInRight 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out both;
        }
      `}</style>
      
      <div className="relative">
        {/* Carousel Content - Key is important here to force re-render and animation */}
        <div 
          key={animationKey} 
          className={`flex flex-col md:flex-row items-center gap-8 ${
            slideDirection === 'right-to-left' ? 'animate-slide-in-right' : 'animate-slide-in-left'
          }`}
        >
          {/* Left side - Album Image */}
          <div className="md:w-1/2 flex justify-center md:justify-end">
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
              <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-y-0 translate-y-4 rotate-12 shadow-lg">
                <div className="text-center">
                  <div className="text-xs">ONLY</div>
                  <div>€{currentProduct.price.toFixed(0)}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Content */}
          <div className="md:w-1/2 text-center md:text-left">
            <div className="space-y-2 animate-fade-in">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white transition-colors duration-300 relative">
                <span className="bg-clip-text bg-gradient-to-r from-primary to-secondary text-transparent">{currentProduct.artist}</span>
                <span className="block md:mt-1">{currentProduct.title}</span>
                <div className="absolute -left-4 top-0 w-1 h-full bg-primary hidden md:block"></div>
              </h2>
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
                  €{currentProduct.price.toFixed(2)}
                </p>
                {currentProduct.stock > 0 ? (
                  <p className="text-sm text-green-600 dark:text-green-400">
                    In stock ({currentProduct.stock} available)
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
        
        {/* Carousel Navigation */}
        <HeroNavigation 
          totalSlides={products.length}
          currentSlide={currentSlide}
          onPrevClick={prevSlide}
          onNextClick={nextSlide}
          onDotClick={(index) => {
            setSlideDirection(index > currentSlide ? 'right-to-left' : 'left-to-right');
            setCurrentSlide(index);
            setAnimationKey(prevKey => prevKey + 1);
          }}
        />
      </div>
    </>
  );
};

export default HeroSlider; 
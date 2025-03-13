"use client";

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGenresDropdownOpen, setIsGenresDropdownOpen] = useState(false);
  const genresDropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (genresDropdownRef.current && !genresDropdownRef.current.contains(event.target as Node)) {
        setIsGenresDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // List of genres for the dropdown
  const genres = [
    "Rock",
    "Folk, World, & Country",
    "Hip-Hop",
    "Jazz",
    "Metal",
    "Pop",
    "Country",
    "Reggae, Dub & Ska",
    "Funk & Soul",
    "Disco",
    "Electronic",
    "Blues",
    "Stage & Screen"
  ];

  return (
    <header className="bg-white dark:bg-black py-4 shadow-md dark:shadow-lg transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          {/* Main Navigation - All items in one row with logo in the middle */}
          <nav className="hidden md:flex items-center justify-center w-full">
            {/* Left Navigation Items */}
            <div className="flex-1 flex justify-end space-x-8 mr-8">
              <Link href="/" className="text-gray-900 dark:text-white hover:text-primary uppercase tracking-wide transition-colors duration-300">
                Home
              </Link>
              {/* Genres dropdown */}
              <div className="relative" ref={genresDropdownRef}>
                <button 
                  className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white uppercase tracking-wide transition-colors duration-300 flex items-center"
                  onClick={() => setIsGenresDropdownOpen(!isGenresDropdownOpen)}
                >
                  Genres
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 ml-1 transition-transform duration-300 ${isGenresDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Genres dropdown menu */}
                {isGenresDropdownOpen && (
                  <div className="absolute z-50 mt-2 left-1/2 transform -translate-x-1/2 w-64 rounded-none bg-gray-900 shadow-lg">
                    <div className="py-2 text-white">
                      {genres.map((genre, index) => (
                        <Link 
                          key={index} 
                          href={`/shop?genre=${encodeURIComponent(genre)}`}
                          className="block px-6 py-3 hover:text-purple-500 transition-colors duration-300"
                        >
                          {genre}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white uppercase tracking-wide transition-colors duration-300">
                Contact
              </Link>
            </div>
            
            {/* Logo (centered) */}
            <Link href="/" className="relative">
              <Image 
                src="/images/theshoprecords-logo.webp" 
                alt="TheShopRecords" 
                width={110} 
                height={50} 
                className="object-contain"
                priority
              />
            </Link>
            
            {/* Right Navigation Items */}
            <div className="flex-1 flex justify-start space-x-8 ml-8">
              <Link href="/account" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white uppercase tracking-wide transition-colors duration-300">
                Account
              </Link>
              <Link href="/cart" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white transition-colors duration-300" aria-label="Shopping Cart">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </Link>
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile Header */}
          <div className="flex md:hidden items-center justify-between w-full">
            {/* Mobile Menu Button */}
            <div>
              <button
                type="button"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none transition-colors duration-300"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>

            {/* Logo (centered for mobile) */}
            <div className="flex justify-center">
              <Link href="/" className="relative">
                <Image 
                  src="/images/theshoprecords-logo.webp" 
                  alt="TheShopRecords" 
                  width={90} 
                  height={40} 
                  className="object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Theme Toggle and Shopping Cart Icon */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Link href="/cart" className="text-gray-600 dark:text-white p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300" aria-label="Shopping Cart">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile menu, toggled by button above */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 mt-2 transition-colors duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-gray-900 dark:text-white font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-300">
                HOME
              </Link>
              
              {/* Mobile Genres Dropdown */}
              <div>
                <button
                  onClick={() => setIsGenresDropdownOpen(!isGenresDropdownOpen)}
                  className="w-full flex justify-between items-center px-3 py-2 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-300"
                >
                  GENRES
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transition-transform duration-300 ${isGenresDropdownOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isGenresDropdownOpen && (
                  <div className="pl-4 mt-1 space-y-1 bg-gray-900">
                    {genres.map((genre, index) => (
                      <Link 
                        key={index} 
                        href={`/shop?genre=${encodeURIComponent(genre)}`}
                        className="block px-3 py-2 text-white hover:text-purple-500"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link href="/contact" className="block px-3 py-2 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-300">
                CONTACT
              </Link>
              <Link href="/account" className="block px-3 py-2 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors duration-300">
                ACCOUNT
              </Link>
              <Link href="/cart" className="block px-3 py-2 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md flex items-center transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                WINKELMAND
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 
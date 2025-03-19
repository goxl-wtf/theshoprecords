"use client";

import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import SidebarCart from '@/components/ui/SidebarCart';
import UserMenu from '@/components/ui/UserMenu';

// Custom hover styles for menu items with animated underline
const menuItemClasses = "relative text-gray-900 dark:text-white hover:text-primary uppercase tracking-wide transition-colors duration-300 py-2 group";
const menuItemUnderlineClasses = "absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 group-hover:w-full transition-all duration-300 opacity-0 group-hover:opacity-100";

// Secondary menu item styles (for Contact, etc.)
const secondaryMenuItemClasses = "relative text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-white uppercase tracking-wide transition-colors duration-300 py-2 group";

// Icon button hover effect
const iconButtonClasses = "transition-all duration-300 hover:scale-110 hover:text-pink-500 dark:hover:text-purple-400";
// Cart wrapper class without hover scaling (to prevent conflicts with SidebarCart)
const cartWrapperClasses = "transition-colors duration-300";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGenresDropdownOpen, setIsGenresDropdownOpen] = useState(false);
  const genresDropdownRef = useRef<HTMLDivElement>(null);
  const genresButtonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState({});

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

  // Pre-calculate position before showing dropdown
  const handleGenresClick = () => {
    if (!isGenresDropdownOpen && genresButtonRef.current) {
      const buttonRect = genresButtonRef.current.getBoundingClientRect();
      // Position centered under the button
      const buttonCenter = buttonRect.left + (buttonRect.width / 2);
      const dropdownWidth = 256; // w-64 = 16rem = 256px
      
      setDropdownStyle({
        position: 'fixed' as const,
        top: `${buttonRect.bottom + window.scrollY}px`,
        left: `${buttonCenter - (dropdownWidth / 2)}px`, // Center the dropdown
        zIndex: 50,
        width: `${dropdownWidth}px`
      });
    }
    setIsGenresDropdownOpen(!isGenresDropdownOpen);
  };

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
    <header className="bg-white dark:bg-black py-2 pb-4 shadow-md dark:shadow-lg transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center">
          {/* Main Navigation - All items in one row with logo in the middle */}
          <nav className="hidden md:flex items-center justify-center w-full">
            {/* Left Navigation Items */}
            <div className="flex-1 flex justify-end items-center space-x-8 mr-8">
              <Link href="/shop" className={menuItemClasses}>
                Browse
                <span className={menuItemUnderlineClasses}></span>
              </Link>
              {/* Genres dropdown */}
              <div className="relative py-2 group" ref={genresDropdownRef}>
                <button 
                  ref={genresButtonRef}
                  className={`${secondaryMenuItemClasses} flex items-center`}
                  onClick={handleGenresClick}
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
                  <span className={menuItemUnderlineClasses}></span>
                </button>
                
                {/* Genres dropdown menu */}
                {isGenresDropdownOpen && (
                  <div className="rounded-md bg-gray-900 shadow-lg overflow-hidden animate-fadeIn opacity-100" style={dropdownStyle}>
                    <div className="py-2 text-white backdrop-blur-sm bg-opacity-95">
                      {genres.map((genre, index) => (
                        <Link 
                          key={index} 
                          href={`/shop?genre=${encodeURIComponent(genre)}`}
                          className="block px-6 py-3 hover:bg-purple-900/30 hover:text-pink-400 transition-all duration-300 border-l-2 border-transparent hover:border-pink-500"
                        >
                          {genre}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Link href="/contact" className={secondaryMenuItemClasses}>
                Contact
                <span className={menuItemUnderlineClasses}></span>
              </Link>
            </div>
            
            {/* Logo (centered) */}
            <Link href="/" className="relative">
              <div className="w-[100px] h-[100px] relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600/30 to-purple-600/30 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                <Image 
                  src="/images/theshoprecords-logo.webp" 
                  alt="TheShopRecords" 
                  width={100} 
                  height={100} 
                  className="object-contain -mb-10 relative z-10"
                  priority
                />
              </div>
            </Link>
            
            {/* Right Navigation Items */}
            <div className="flex-1 flex justify-start items-center space-x-8 ml-8">
              <div className={iconButtonClasses}>
                <UserMenu />
              </div>
              <div className={cartWrapperClasses}>
                <SidebarCart />
              </div>
              <div className={iconButtonClasses}>
                <ThemeToggle />
              </div>
            </div>
          </nav>

          {/* Mobile Header */}
          <div className="flex md:hidden items-center justify-between w-full">
            {/* Mobile Menu Button */}
            <div className={iconButtonClasses}>
              <button
                type="button"
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none transition-all duration-300"
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
                <div className="w-[90px] h-[90px] relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-600/30 to-purple-600/30 rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                  <Image 
                    src="/images/theshoprecords-logo.webp" 
                    alt="TheShopRecords" 
                    width={90} 
                    height={90} 
                    className="object-contain -mb-9 relative z-10"
                    priority
                  />
                </div>
              </Link>
            </div>

            {/* Theme Toggle and Shopping Cart Icon */}
            <div className="flex items-center space-x-2">
              <div className={iconButtonClasses}>
                <ThemeToggle />
              </div>
              <div className={cartWrapperClasses}>
                <SidebarCart />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu, toggled by button above */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-black/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-800 mt-2 transition-all duration-300 animate-slideDown">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/shop" className="block px-3 py-2 text-gray-900 dark:text-white font-medium hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:text-pink-600 dark:hover:text-pink-400 rounded-md transition-all duration-300 border-l-2 border-transparent hover:border-pink-500">
                BROWSE
              </Link>
              
              {/* Mobile Genres Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsGenresDropdownOpen(!isGenresDropdownOpen)}
                  className="w-full flex justify-between items-center px-3 py-2 text-gray-600 dark:text-gray-400 font-medium hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:text-pink-600 dark:hover:text-pink-400 rounded-md transition-all duration-300 border-l-2 border-transparent hover:border-pink-500"
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
                  <div className="absolute top-full left-0 right-0 mt-1 space-y-1 bg-gray-900/95 backdrop-blur-sm rounded-md animate-fadeIn w-full pl-4">
                    {genres.map((genre, index) => (
                      <Link 
                        key={index} 
                        href={`/shop?genre=${encodeURIComponent(genre)}`}
                        className="block px-3 py-2 text-white hover:text-pink-400 hover:bg-purple-900/30 transition-all duration-300 border-l-2 border-transparent hover:border-pink-500"
                      >
                        {genre}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              
              <Link href="/contact" className="block px-3 py-2 text-gray-600 dark:text-gray-400 font-medium hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:text-pink-600 dark:hover:text-pink-400 rounded-md transition-all duration-300 border-l-2 border-transparent hover:border-pink-500">
                CONTACT
              </Link>
              <div className="px-3 py-2">
                <UserMenu />
              </div>
              <Link href="/cart" className="block px-3 py-2 text-gray-600 dark:text-gray-400 font-medium hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-pink-500/20 hover:text-pink-600 dark:hover:text-pink-400 rounded-md flex items-center transition-all duration-300 border-l-2 border-transparent hover:border-pink-500">
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
'use client';

import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import BreadcrumbNav from '../../components/BreadcrumbNav';
import Loading from '../../components/Loading';
import SearchBar from '../../components/SearchBar';
import { ShopFilters, ShopHeader, ShopGrid, ActiveFilters } from '../../components/shopPage';

export default function ShopPage() {
  const { 
    filteredProducts, 
    genres, 
    styles, 
    loading, 
    error,
    searchTerm,
    setSearchTerm,
    filterByGenre,
    removeGenreFilter,
    filterByStyle,
    removeStyleFilter,
    clearAllFilters,
    selectedGenres,
    selectedStyles,
    sortBy, 
    setSortBy,
    priceRange,
    setPriceRange,
    minPrice,
    maxPrice
  } = useProducts();

  // Create breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop', active: true },
  ];

  // Handle search
  const handleSearch = (searchQuery: string) => {
    setSearchTerm(searchQuery);
  };

  // Handle sort change
  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
  };

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.created_at || '0').getTime() - new Date(a.created_at || '0').getTime();
      case 'oldest':
        return new Date(a.created_at || '0').getTime() - new Date(b.created_at || '0').getTime();
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <p className="text-red-700">Error: {error}</p>
          <p className="text-red-500">Please try refreshing the page or contact support if the problem persists.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Main SearchBar at the top of the page */}
      <div className="mb-8">
        <SearchBar 
          initialValue={searchTerm} 
          onSearch={handleSearch} 
          debounceTime={500} 
        />
      </div>
      
      <BreadcrumbNav items={breadcrumbItems} />
            
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* Filters Sidebar (Desktop) and Mobile Filter Drawer */}
        <aside className="w-full md:w-1/4">
          <ShopFilters 
            genres={genres} 
            styles={styles}
            selectedGenres={selectedGenres}
            selectedStyles={selectedStyles}
            onGenreSelect={filterByGenre}
            onStyleSelect={filterByStyle}
            onGenreRemove={removeGenreFilter}
            onStyleRemove={removeStyleFilter}
            onClearAllFilters={clearAllFilters}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </aside>
        
        <div className="w-full md:w-3/4">
          {/* Header with sort & product count (search removed) */}
          <ShopHeader
            searchTerm={''}
            onSearch={() => {}}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            totalProducts={sortedProducts.length}
          />
          
          {/* Active Filters display (desktop and mobile) */}
          <div className="md:hidden mb-6">
            <ActiveFilters
              selectedGenres={selectedGenres}
              selectedStyles={selectedStyles}
              priceRange={priceRange}
              onGenreRemove={removeGenreFilter}
              onStyleRemove={removeStyleFilter}
              onClearAllFilters={clearAllFilters}
              genres={genres}
              styles={styles}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />
          </div>
          
          {/* Product Grid */}
          <ShopGrid 
            products={sortedProducts} 
            loading={loading} 
          />
        </div>
      </div>
    </div>
  );
} 
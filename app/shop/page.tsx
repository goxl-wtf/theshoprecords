'use client';

import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import ProductCard from '../../components/ProductCard';
import Sidebar from '../../components/Sidebar';
import SearchBar from '../../components/SearchBar';
import BreadcrumbNav from '../../components/BreadcrumbNav';
import Loading from '../../components/Loading';
import PageHeading from '../../components/PageHeading';

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
    filterByStyle,
    selectedGenre,
    selectedStyle
  } = useProducts();

  const [sortBy, setSortBy] = useState('newest');

  // Sort products based on selected sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      case 'oldest':
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      case 'name-asc':
        return a.title.localeCompare(b.title);
      case 'name-desc':
        return b.title.localeCompare(a.title);
      default:
        return 0;
    }
  });

  if (loading) {
    return <Loading />;
  }

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

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop', active: true },
  ];

  const handleSearch = (searchQuery: string) => {
    setSearchTerm(searchQuery);
  };

  const handleGenreFilter = (genreId: string | null) => {
    filterByGenre(genreId);
  };

  const handleStyleFilter = (styleId: string | null) => {
    filterByStyle(styleId);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BreadcrumbNav items={breadcrumbItems} />
      
      <PageHeading title="Shop" subtitle="Browse our selection of vinyl records, CDs, cassettes, and more" />
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <Sidebar 
            genres={genres} 
            styles={styles}
            selectedGenre={selectedGenre}
            selectedStyle={selectedStyle}
            onGenreSelect={handleGenreFilter}
            onStyleSelect={handleStyleFilter}
          />
        </aside>
        
        <div className="w-full md:w-3/4">
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <SearchBar initialValue={searchTerm} onSearch={handleSearch} />
            
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-gray-700 dark:text-gray-300">Sort by:</label>
              <select
                id="sort"
                className="border border-gray-300 rounded-md p-2 bg-white dark:bg-dark-200 dark:text-light-100 dark:border-dark-100"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
            </div>
          </div>
          
          {sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filters or search terms.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
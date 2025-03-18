'use client';

import React from 'react';
import SearchBar from '../SearchBar';
import StatCard from './StatCard';

interface SearchWithStatsProps {
  onSearch: (query: string) => void;
  productCount?: number; // Make sure this is defined
}

const SearchWithStats: React.FC<SearchWithStatsProps> = ({ 
  onSearch, 
  productCount = 0 
}) => {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container-custom">
        {/* Search Bar Section */}
        <div className="max-w-5xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">
            <span className="bg-clip-text bg-gradient-to-r from-primary to-secondary text-transparent dark:from-primary/90 dark:to-secondary/90">
              Find Your Favorite Records
            </span>
          </h2>
          <SearchBar onSearch={onSearch} />
        </div>
        
        {/* Statistics */}
        <div className="flex flex-wrap justify-center gap-8 mt-10">
          <StatCard value="20,000+" label="Vinyl en CD's in de winkel" />
          <StatCard 
            value={productCount ? productCount.toString() : "Loading..."} 
            label="Nieuwe en tweedehands LP's Online" 
          />
          <StatCard value="100%" label="Klant tevredenheid" />
        </div>
      </div>
    </section>
  );
};

export default SearchWithStats; 
'use client';

import React from 'react';
import SearchBar from '../SearchBar';
import StatCard from './StatCard';

interface SearchWithStatsProps {
  onSearch: (query: string) => void;
}

const SearchWithStats: React.FC<SearchWithStatsProps> = ({ onSearch }) => {
  return (
    <section className="py-10 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="container-custom">
        <SearchBar onSearch={onSearch} />
        
        {/* Statistics */}
        <div className="flex flex-wrap justify-center gap-8 mt-10">
          <StatCard value="20,000+" label="Vinyl en CD's in de winkel" />
          <StatCard value="1940" label="Nieuwe en tweedehands LP's Online" />
          <StatCard value="100%" label="Klant tevredenheid" />
        </div>
      </div>
    </section>
  );
};

export default SearchWithStats; 
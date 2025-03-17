"use client";

import React, { useState, useEffect } from 'react';

interface SearchBarProps {
  initialValue?: string;
  onSearch: (searchQuery: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ initialValue = '', onSearch }) => {
  const [searchValue, setSearchValue] = useState(initialValue);

  useEffect(() => {
    // Update the search value if initialValue changes from outside
    setSearchValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative">
        <input
          type="text"
          className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-full shadow-md 
          bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 
          focus:ring-2 focus:ring-primary focus:border-primary dark:focus:border-primary 
          dark:placeholder-gray-400 placeholder-gray-500 
          transition-all duration-300"
          placeholder="Search for records..."
          value={searchValue}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors duration-300"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
    </form>
  );
};

export default SearchBar; 
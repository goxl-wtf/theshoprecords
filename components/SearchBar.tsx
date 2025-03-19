"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX, FiMusic, FiUser, FiTag } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { SearchSuggestion, debounce, getSearchSuggestions } from '../utils/searchUtils';
import { useProducts } from '../context/ProductContext';
import Image from 'next/image';

interface SearchBarProps {
  initialValue?: string;
  onSearch: (searchQuery: string) => void;
  debounceTime?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  initialValue = '', 
  onSearch, 
  debounceTime = 500 
}) => {
  const router = useRouter();
  const { products } = useProducts();
  const [searchValue, setSearchValue] = useState(initialValue);
  const [showDropdown, setShowDropdown] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Function to fetch suggestions - wrapped in useRef to maintain reference
  const fetchSuggestionsRef = useRef(
    debounce(async (value: string) => {
      if (!value || value.length < 2) {
        setSuggestions([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const results = await getSearchSuggestions(value, products);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setLoading(false);
      }
    }, debounceTime)
  );

  // Update suggestions when search value changes
  useEffect(() => {
    if (searchValue.trim()) {
      fetchSuggestionsRef.current(searchValue);
    } else {
      setSuggestions([]);
    }
  }, [searchValue, products]);

  // Update search value if initialValue changes from outside
  useEffect(() => {
    setSearchValue(initialValue);
  }, [initialValue]);

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSuggestionSelect(suggestions[selectedIndex]);
    } else if (searchValue.trim()) {
      onSearch(searchValue);
      setShowDropdown(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    setShowDropdown(!!value.trim());
    setSelectedIndex(-1);
  };

  // Clear search input
  const handleClear = () => {
    setSearchValue('');
    setSuggestions([]);
    setShowDropdown(false);
    onSearch('');
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown || suggestions.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: SearchSuggestion) => {
    setSearchValue(suggestion.title);
    setShowDropdown(false);
    
    // Handle different types of suggestions
    switch (suggestion.type) {
      case 'album':
        if (suggestion.slug) {
          router.push(`/shop/${suggestion.slug}`);
        } else {
          onSearch(suggestion.title);
        }
        break;
      case 'artist':
        onSearch(suggestion.title);
        break;
      case 'genre':
        if (suggestion.slug) {
          router.push(`/genres/${suggestion.slug}`);
        } else {
          onSearch(suggestion.title);
        }
        break;
    }
  };

  // Get icon for suggestion type
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'album':
        return <FiMusic className="h-4 w-4 text-primary" />;
      case 'artist':
        return <FiUser className="h-4 w-4 text-blue-500" />;
      case 'genre':
        return <FiTag className="h-4 w-4 text-green-500" />;
      default:
        return <FiSearch className="h-4 w-4" />;
    }
  };

  // Display for different types of suggestions
  const renderSuggestionContent = (suggestion: SearchSuggestion, isSelected: boolean) => {
    const commonClasses = `flex items-center gap-3 px-4 py-2 text-sm ${
      isSelected ? 'bg-gray-100 dark:bg-gray-700' : ''
    } hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer`;
    
    return (
      <div 
        className={commonClasses}
        onClick={() => handleSuggestionSelect(suggestion)}
      >
        {/* Type Icon or Image */}
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
          {suggestion.image ? (
            <div className="relative w-10 h-10 rounded overflow-hidden">
              <Image 
                src={suggestion.image} 
                alt={suggestion.title}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
          ) : (
            getSuggestionIcon(suggestion.type)
          )}
        </div>
        
        {/* Title and Type */}
        <div className="flex-1 overflow-hidden">
          <div className="font-medium truncate">{suggestion.title}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {suggestion.type}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full" ref={searchRef}>
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
            onFocus={() => setShowDropdown(!!searchValue.trim())}
            onKeyDown={handleKeyDown}
            aria-label="Search"
            autoComplete="off"
          />
          
          {/* Clear button (only shows when there's text) */}
          {searchValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 
              hover:text-gray-700 dark:hover:text-gray-100 transition-colors duration-300"
              aria-label="Clear search"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}
          
          {/* Search button */}
          <button
            type="submit"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-300 
            hover:text-primary dark:hover:text-primary transition-colors duration-300"
            aria-label="Search"
          >
            <FiSearch 
              className={`h-6 w-6 ${loading ? 'animate-pulse text-primary' : ''}`} 
            />
          </button>
        </div>
      </form>
      
      {/* Suggestions Dropdown */}
      {showDropdown && (
        <div 
          className="absolute z-50 w-full left-0 right-0 mx-auto max-w-3xl mt-1 bg-white dark:bg-gray-800 border border-gray-200 
          dark:border-gray-700 rounded-lg shadow-lg overflow-hidden transition-all duration-200 
          max-h-[400px] overflow-y-auto"
          aria-live="polite"
        >
          {loading && suggestions.length === 0 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              <div className="animate-spin inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full mb-2"></div>
              <p>Searching...</p>
            </div>
          )}
          
          {!loading && suggestions.length === 0 && searchValue.trim().length >= 2 && (
            <div className="p-4 text-center text-gray-500 dark:text-gray-400">
              No results found
            </div>
          )}
          
          {suggestions.length > 0 && (
            <div>
              <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                Suggestions
              </div>
              
              <div>
                {suggestions.map((suggestion, index) => (
                  <div key={suggestion.id}>
                    {renderSuggestionContent(suggestion, index === selectedIndex)}
                  </div>
                ))}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                <button 
                  onClick={() => {
                    onSearch(searchValue);
                    setShowDropdown(false);
                  }}
                  className="text-primary hover:underline focus:outline-none"
                >
                  Search for "{searchValue}"
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  fetchProducts, 
  fetchGenres, 
  fetchStyles, 
  searchProducts,
  fetchProductsByGenres,
  fetchProductsByStyles,
  fetchProductsByGenresAndStyles
} from '../utils/productService';
import { Product, Genre, Style } from '../utils/types';

interface ProductContextType {
  products: Product[];
  genres: Genre[];
  styles: Style[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterByGenre: (genreId: string) => void;
  removeGenreFilter: (genreId: string) => void;
  filterByStyle: (styleId: string) => void;
  removeStyleFilter: (styleId: string) => void;
  clearAllFilters: () => void;
  filteredProducts: Product[];
  selectedGenres: string[];
  selectedStyles: string[];
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [styles, setStyles] = useState<Style[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  // Fetch initial data from Supabase
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        
        // Load products
        const productsData = await fetchProducts();
        setProducts(productsData);
        setFilteredProducts(productsData);
        
        // Load genres
        const genresData = await fetchGenres();
        setGenres(genresData);
        
        // Load styles
        const stylesData = await fetchStyles();
        setStyles(stylesData);
        
        // Set price range based on product data
        if (productsData.length > 0) {
          const prices = productsData.map(p => p.price);
          const min = Math.floor(Math.min(...prices));
          const max = Math.ceil(Math.max(...prices));
          setMinPrice(min);
          setMaxPrice(max);
          setPriceRange([min, max]);
        }
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data from the database');
        setLoading(false);
        console.error('Error loading initial data:', err);
      }
    };

    loadInitialData();
  }, []);

  // Apply filters whenever selection changes
  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true);
      
      try {
        let results: Product[] = [];
        
        // If search term is active, that takes priority
        if (searchTerm.trim() !== '') {
          results = await searchProducts(searchTerm);
          
          // Then filter the search results by genres and styles if necessary
          if (selectedGenres.length > 0 || selectedStyles.length > 0) {
            results = filterProductsByGenresAndStyles(
              results, 
              selectedGenres, 
              selectedStyles
            );
          }
        }
        // Otherwise, apply genre and style filters
        else if (selectedGenres.length > 0 && selectedStyles.length > 0) {
          // Fetch products that match both selected genres and styles
          results = await fetchProductsByGenresAndStyles(selectedGenres, selectedStyles);
        } 
        else if (selectedGenres.length > 0) {
          // Fetch products that match selected genres
          results = await fetchProductsByGenres(selectedGenres);
        } 
        else if (selectedStyles.length > 0) {
          // Fetch products that match selected styles
          results = await fetchProductsByStyles(selectedStyles);
        }
        else {
          // No filters, show all products
          results = [...products];
        }
        
        // Apply price filtering
        results = results.filter(
          product => product.price >= priceRange[0] && product.price <= priceRange[1]
        );
        
        setFilteredProducts(results);
      } catch (err) {
        console.error('Error applying filters:', err);
      } finally {
        setLoading(false);
      }
    };

    // Don't run on initial empty state
    if (products.length > 0) {
      applyFilters();
    }
  }, [searchTerm, selectedGenres, selectedStyles, products, priceRange]);

  // Helper function to filter products by genres and styles client-side
  const filterProductsByGenresAndStyles = (
    productList: Product[], 
    genreIds: string[], 
    styleIds: string[]
  ): Product[] => {
    if (genreIds.length === 0 && styleIds.length === 0) return productList;
    
    return productList.filter(product => {
      const matchesGenre = genreIds.length === 0 || 
        product.genres?.some(genre => genreIds.includes(genre.id));
      
      const matchesStyle = styleIds.length === 0 || 
        product.styles?.some(style => styleIds.includes(style.id));
      
      return matchesGenre && matchesStyle;
    });
  };

  // Add a genre filter
  const filterByGenre = (genreId: string) => {
    if (!selectedGenres.includes(genreId)) {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  // Remove a genre filter
  const removeGenreFilter = (genreId: string) => {
    setSelectedGenres(selectedGenres.filter(id => id !== genreId));
  };

  // Add a style filter
  const filterByStyle = (styleId: string) => {
    if (!selectedStyles.includes(styleId)) {
      setSelectedStyles([...selectedStyles, styleId]);
    }
  };

  // Remove a style filter
  const removeStyleFilter = (styleId: string) => {
    setSelectedStyles(selectedStyles.filter(id => id !== styleId));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedGenres([]);
    setSelectedStyles([]);
    setSearchTerm('');
    setPriceRange([minPrice, maxPrice]);
  };

  const value = {
    products,
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
    filteredProducts,
    selectedGenres,
    selectedStyles,
    sortBy,
    setSortBy,
    priceRange,
    setPriceRange,
    minPrice,
    maxPrice,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}; 
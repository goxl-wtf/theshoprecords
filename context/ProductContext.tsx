'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  fetchProducts, 
  fetchGenres, 
  fetchStyles, 
  searchProducts,
  fetchProductsByGenre,
  fetchProductsByStyle
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
  filterByGenre: (genreId: string | null) => void;
  filterByStyle: (styleId: string | null) => void;
  filteredProducts: Product[];
  selectedGenre: string | null;
  selectedStyle: string | null;
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
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

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
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load data from the database');
        setLoading(false);
        console.error('Error loading initial data:', err);
      }
    };

    loadInitialData();
  }, []);

  // Handle search
  useEffect(() => {
    const handleSearch = async () => {
      if (searchTerm.trim() === '') {
        // If search is empty and no filters are active, show all products
        if (!selectedGenre && !selectedStyle) {
          setFilteredProducts(products);
        }
        return;
      }

      try {
        const results = await searchProducts(searchTerm);
        setFilteredProducts(results);
      } catch (err) {
        console.error('Error searching products:', err);
      }
    };

    // Debounce search to avoid excessive API calls
    const debounceTimer = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, products, selectedGenre, selectedStyle]);

  // Filter by genre
  const filterByGenre = async (genreId: string | null) => {
    setSelectedGenre(genreId);
    
    if (!genreId) {
      // If no genre filter, respect any style filter or search term
      if (selectedStyle) {
        filterByStyle(selectedStyle);
      } else if (searchTerm) {
        searchProducts(searchTerm).then(setFilteredProducts);
      } else {
        setFilteredProducts(products);
      }
      return;
    }

    try {
      const filteredByGenre = await fetchProductsByGenre(genreId);
      setFilteredProducts(filteredByGenre);
    } catch (err) {
      console.error('Error filtering by genre:', err);
    }
  };

  // Filter by style
  const filterByStyle = async (styleId: string | null) => {
    setSelectedStyle(styleId);
    
    if (!styleId) {
      // If no style filter, respect any genre filter or search term
      if (selectedGenre) {
        filterByGenre(selectedGenre);
      } else if (searchTerm) {
        searchProducts(searchTerm).then(setFilteredProducts);
      } else {
        setFilteredProducts(products);
      }
      return;
    }

    try {
      const filteredByStyle = await fetchProductsByStyle(styleId);
      setFilteredProducts(filteredByStyle);
    } catch (err) {
      console.error('Error filtering by style:', err);
    }
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
    filterByStyle,
    filteredProducts,
    selectedGenre,
    selectedStyle,
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
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
import { fetchActiveListings } from '../utils/marketplaceService';
import { Product, Genre, Style, ListingCondition } from '../utils/types';

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
  // New marketplace filters
  sellerRatingFilter: number | null;
  setSellerRatingFilter: (rating: number | null) => void;
  verifiedSellersOnly: boolean;
  setVerifiedSellersOnly: (verified: boolean) => void;
  conditionFilter: ListingCondition | null;
  setConditionFilter: (condition: ListingCondition | null) => void;
  showMarketplaceListings: boolean;
  setShowMarketplaceListings: (show: boolean) => void;
  sellerPriceRange: [number, number];
  setSellerPriceRange: (range: [number, number]) => void;
  minSellerPrice: number;
  maxSellerPrice: number;
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
  
  // New marketplace filter states
  const [sellerRatingFilter, setSellerRatingFilter] = useState<number | null>(null);
  const [verifiedSellersOnly, setVerifiedSellersOnly] = useState<boolean>(false);
  const [conditionFilter, setConditionFilter] = useState<ListingCondition | null>(null);
  const [showMarketplaceListings, setShowMarketplaceListings] = useState<boolean>(false);
  const [sellerPriceRange, setSellerPriceRange] = useState<[number, number]>([0, 1000]);
  const [minSellerPrice, setMinSellerPrice] = useState<number>(0);
  const [maxSellerPrice, setMaxSellerPrice] = useState<number>(1000);

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
          setSellerPriceRange([min, max]); // Initialize seller price range with the same values
          setMinSellerPrice(min);
          setMaxSellerPrice(max);
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
        
        // If we're showing marketplace listings, use that filtering logic
        if (showMarketplaceListings) {
          const listingsResponse = await fetchActiveListings(1, 100, {
            genre: selectedGenres.length > 0 ? selectedGenres[0] : undefined, // Limited to one genre for now
            style: selectedStyles.length > 0 ? selectedStyles[0] : undefined, // Limited to one style for now
            condition: conditionFilter || undefined,
            minPrice: sellerPriceRange[0],
            maxPrice: sellerPriceRange[1]
          });
          
          // Create a unique set of products from listings
          const uniqueProducts = new Map<string, Product>();
          
          listingsResponse.listings.forEach(listing => {
            if (listing.product && 
                (!sellerRatingFilter || (listing.seller?.average_rating || 0) >= sellerRatingFilter) &&
                (!verifiedSellersOnly || listing.seller?.is_verified)) {
              uniqueProducts.set(listing.product.id, listing.product);
            }
          });
          
          results = Array.from(uniqueProducts.values());
          
          // If search term is active, filter further
          if (searchTerm.trim() !== '') {
            results = results.filter(product => 
              product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.artist.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
        } 
        // Otherwise use the standard product filtering logic
        else {
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
        }
        
        // Sort results based on sortBy option
        results = sortProducts(results);
        
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
  }, [searchTerm, selectedGenres, selectedStyles, products, priceRange, 
      sellerRatingFilter, verifiedSellersOnly, conditionFilter, 
      showMarketplaceListings, sellerPriceRange, sortBy]);

  // Sort products based on the sortBy state
  const sortProducts = (productsToSort: Product[]): Product[] => {
    const sorted = [...productsToSort];
    
    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => 
          new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
        );
      case 'oldest':
        return sorted.sort((a, b) => 
          new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime()
        );
      case 'price-low-high':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return sorted.sort((a, b) => b.price - a.price);
      case 'title-a-z':
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case 'title-z-a':
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case 'seller-rating':
        // For products with listings, sort by highest average seller rating
        return sorted.sort((a, b) => {
          const aListings = Array.isArray(a.listings) ? a.listings : [];
          const bListings = Array.isArray(b.listings) ? b.listings : [];
          
          const aRating = aListings.length > 0 
            ? Math.max(...aListings.map(l => (l.seller?.average_rating || 0)))
            : 0;
          
          const bRating = bListings.length > 0
            ? Math.max(...bListings.map(l => (l.seller?.average_rating || 0)))
            : 0;
            
          return bRating - aRating;
        });
      case 'listing-freshness':
        // Sort by the newest listing for each product
        return sorted.sort((a, b) => {
          const aListings = Array.isArray(a.listings) ? a.listings : [];
          const bListings = Array.isArray(b.listings) ? b.listings : [];
          
          const aNewest = aListings.length > 0
            ? Math.max(...aListings.map(l => new Date(l.created_at || Date.now()).getTime()))
            : 0;
            
          const bNewest = bListings.length > 0
            ? Math.max(...bListings.map(l => new Date(l.created_at || Date.now()).getTime()))
            : 0;
            
          return bNewest - aNewest;
        });
      default:
        return sorted;
    }
  };

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
    setSellerPriceRange([minSellerPrice, maxSellerPrice]);
    setSellerRatingFilter(null);
    setVerifiedSellersOnly(false);
    setConditionFilter(null);
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
    // Expose the new marketplace filter states and setters
    sellerRatingFilter,
    setSellerRatingFilter,
    verifiedSellersOnly,
    setVerifiedSellersOnly,
    conditionFilter,
    setConditionFilter,
    showMarketplaceListings,
    setShowMarketplaceListings,
    sellerPriceRange,
    setSellerPriceRange,
    minSellerPrice,
    maxSellerPrice,
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
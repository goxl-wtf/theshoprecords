'use client';

import React, { useState, useEffect } from 'react';
import { useProducts } from '../../context/ProductContext';
import BreadcrumbNav from '../../components/BreadcrumbNav';
import Loading from '../../components/Loading';
import SearchBar from '../../components/SearchBar';
import { ShopFilters, ShopHeader, ShopGrid, ActiveFilters } from '../../components/shopPage';
import Pagination from '../../components/common/Pagination';
import { fetchActiveListings } from '../../utils/marketplaceService';
import { Product } from '../../utils/types';

export default function ShopPage() {
  // Current pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(12); // Number of products per page
  const [marketplaceProducts, setMarketplaceProducts] = useState<Product[]>([]);
  const [isLoadingMarketplace, setIsLoadingMarketplace] = useState(false);

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
    maxPrice,
    // New marketplace filter states
    showMarketplaceListings,
    setShowMarketplaceListings,
    sellerRatingFilter,
    setSellerRatingFilter,
    verifiedSellersOnly,
    setVerifiedSellersOnly,
    conditionFilter,
    setConditionFilter,
    sellerPriceRange,
    setSellerPriceRange,
    minSellerPrice,
    maxSellerPrice
  } = useProducts();

  // Load marketplace listings with pagination when showing marketplace or filters change
  useEffect(() => {
    // Only fetch if showing marketplace listings
    if (!showMarketplaceListings) {
      return;
    }

    const fetchMarketplaceListings = async () => {
      setIsLoadingMarketplace(true);
      try {
        const filters = {
          minPrice: sellerPriceRange[0],
          maxPrice: sellerPriceRange[1],
          condition: conditionFilter || undefined,
          isVerifiedOnly: verifiedSellersOnly
        };

        const result = await fetchActiveListings(currentPage, itemsPerPage, filters);
        
        // Map listings to product format with proper type conversion
        const productsFromListings = result.listings
          .filter(listing => listing.product && listing.product.id) // Ensure product exists and has id
          .map(listing => {
            return {
              // Spread the product properties with guaranteed id
              ...(listing.product as Product),
              // Add listing information to product
              listings: [listing]
            } as Product;
          });

        setMarketplaceProducts(productsFromListings);
        setTotalPages(result.pageCount);
      } catch (error) {
        console.error('Error fetching marketplace listings:', error);
      } finally {
        setIsLoadingMarketplace(false);
      }
    };

    fetchMarketplaceListings();
  }, [
    showMarketplaceListings, 
    currentPage, 
    itemsPerPage, 
    sellerPriceRange,
    conditionFilter,
    verifiedSellersOnly,
    sellerRatingFilter,
    sortBy
  ]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    showMarketplaceListings,
    sellerPriceRange,
    conditionFilter,
    verifiedSellersOnly,
    sellerRatingFilter,
    searchTerm,
    selectedGenres,
    selectedStyles,
    priceRange
  ]);

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

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get sort options based on marketplace toggle
  const getSortOptions = () => {
    const baseOptions = [
      { value: 'newest', label: 'Newest' },
      { value: 'oldest', label: 'Oldest' },
      { value: 'price-low-high', label: 'Price: Low to High' },
      { value: 'price-high-low', label: 'Price: High to Low' },
      { value: 'title-a-z', label: 'Name: A to Z' },
      { value: 'title-z-a', label: 'Name: Z to A' },
    ];

    // Add marketplace-specific sort options when marketplace listings are shown
    if (showMarketplaceListings) {
      return [
        ...baseOptions,
        { value: 'seller-rating', label: 'Seller Rating' },
        { value: 'listing-freshness', label: 'Newest Listings' },
      ];
    }

    return baseOptions;
  };

  // Determine which products to display
  const productsToDisplay = showMarketplaceListings 
    ? marketplaceProducts 
    : filteredProducts;

  // For shop mode (non-marketplace), paginate the filtered products client-side
  const paginatedProductsForShop = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Calculate total pages for shop mode
  const totalPagesForShop = Math.ceil(filteredProducts.length / itemsPerPage);

  // Display products based on mode (marketplace or shop)
  const displayProducts = showMarketplaceListings
    ? productsToDisplay
    : paginatedProductsForShop;

  // Determine which loading state to use
  const isLoading = showMarketplaceListings ? isLoadingMarketplace : loading;

  // Determine which total pages to use
  const displayTotalPages = showMarketplaceListings ? totalPages : totalPagesForShop;

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
            // Marketplace filter props
            showMarketplaceListings={showMarketplaceListings}
            setShowMarketplaceListings={setShowMarketplaceListings}
            sellerRatingFilter={sellerRatingFilter}
            setSellerRatingFilter={setSellerRatingFilter}
            verifiedSellersOnly={verifiedSellersOnly}
            setVerifiedSellersOnly={setVerifiedSellersOnly}
            conditionFilter={conditionFilter}
            setConditionFilter={setConditionFilter}
            sellerPriceRange={sellerPriceRange}
            setSellerPriceRange={setSellerPriceRange}
            minSellerPrice={minSellerPrice}
            maxSellerPrice={maxSellerPrice}
          />
        </aside>
        
        <div className="w-full md:w-3/4">
          {/* Header with sort & product count */}
          <ShopHeader
            searchTerm={''}
            onSearch={() => {}}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            totalProducts={showMarketplaceListings ? marketplaceProducts.length : filteredProducts.length}
            sortOptions={getSortOptions()}
            showMarketplaceIndicator={showMarketplaceListings}
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
            products={displayProducts} 
            loading={isLoading} 
            isMarketplace={showMarketplaceListings}
          />
          
          {/* Pagination */}
          <Pagination 
            currentPage={currentPage}
            totalPages={displayTotalPages}
            onPageChange={handlePageChange}
            className="mt-8"
          />
        </div>
      </div>
    </div>
  );
} 
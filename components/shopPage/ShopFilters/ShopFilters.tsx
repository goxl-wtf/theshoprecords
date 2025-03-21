'use client';

import React, { useState } from 'react';
import { Genre, Style, ListingCondition } from '../../../utils/types';
import FilterSection from '../FilterComponents/FilterSection';
import { PriceRangeSlider, MarketplaceFilters } from '../FilterComponents';
import ActiveFilters from '../ActiveFilters/ActiveFilters';
import { FiFilter, FiX } from 'react-icons/fi';

interface ShopFiltersProps {
  genres: Genre[];
  styles: Style[];
  selectedGenres: string[];
  selectedStyles: string[];
  onGenreSelect: (genreId: string) => void;
  onStyleSelect: (styleId: string) => void;
  onGenreRemove: (genreId: string) => void;
  onStyleRemove: (styleId: string) => void;
  onClearAllFilters: () => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  minPrice: number;
  maxPrice: number;
  // Marketplace filter props
  showMarketplaceListings: boolean;
  setShowMarketplaceListings: (show: boolean) => void;
  sellerRatingFilter: number | null;
  setSellerRatingFilter: (rating: number | null) => void;
  verifiedSellersOnly: boolean;
  setVerifiedSellersOnly: (verified: boolean) => void;
  conditionFilter: ListingCondition | null;
  setConditionFilter: (condition: ListingCondition | null) => void;
  sellerPriceRange: [number, number];
  setSellerPriceRange: (range: [number, number]) => void;
  minSellerPrice: number;
  maxSellerPrice: number;
}

const ShopFilters: React.FC<ShopFiltersProps> = ({
  genres,
  styles,
  selectedGenres,
  selectedStyles,
  onGenreSelect,
  onStyleSelect,
  onGenreRemove,
  onStyleRemove,
  onClearAllFilters,
  priceRange,
  onPriceRangeChange,
  minPrice,
  maxPrice,
  // Marketplace filter props
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
  maxSellerPrice,
}) => {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Count products with each genre and style 
  // This would be better provided from the backend in a real app
  const genresWithCount = genres.map(genre => ({
    ...genre,
    count: 0 // In a real app, we'd get the count from the API
  }));

  const stylesWithCount = styles.map(style => ({
    ...style,
    count: 0 // In a real app, we'd get the count from the API
  }));

  return (
    <>
      {/* Mobile filter toggle button */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <FiFilter className="mr-2 h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Mobile filter sidebar */}
      <div
        className={`fixed inset-0 z-40 flex md:hidden transform ${
          isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-900 shadow-xl">
          <div className="px-4 pt-5 pb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h2>
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-5 h-full overflow-y-auto px-4 pb-6">
            <ActiveFilters
              selectedGenres={selectedGenres}
              selectedStyles={selectedStyles}
              priceRange={priceRange}
              onGenreRemove={onGenreRemove}
              onStyleRemove={onStyleRemove}
              onClearAllFilters={onClearAllFilters}
              genres={genres}
              styles={styles}
              minPrice={minPrice}
              maxPrice={maxPrice}
            />

            <MarketplaceFilters
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

            <FilterSection
              title="Genres"
              items={genresWithCount}
              selectedItems={selectedGenres}
              onItemSelect={onGenreSelect}
              onItemRemove={onGenreRemove}
            />

            <FilterSection
              title="Styles"
              items={stylesWithCount}
              selectedItems={selectedStyles}
              onItemSelect={onStyleSelect}
              onItemRemove={onStyleRemove}
            />

            <PriceRangeSlider
              priceRange={showMarketplaceListings ? sellerPriceRange : priceRange}
              onPriceRangeChange={showMarketplaceListings ? setSellerPriceRange : onPriceRangeChange}
              minPrice={showMarketplaceListings ? minSellerPrice : minPrice}
              maxPrice={showMarketplaceListings ? maxSellerPrice : maxPrice}
            />
          </div>
        </div>
        
        <div 
          className="flex-shrink-0 w-14" 
          aria-hidden="true" 
          onClick={() => setIsMobileFilterOpen(false)}
        />
      </div>

      {/* Desktop filter sidebar */}
      <div className="hidden md:block sticky top-20">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Filters</h2>
        
        <ActiveFilters
          selectedGenres={selectedGenres}
          selectedStyles={selectedStyles}
          priceRange={priceRange}
          onGenreRemove={onGenreRemove}
          onStyleRemove={onStyleRemove}
          onClearAllFilters={onClearAllFilters}
          genres={genres}
          styles={styles}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />

        <MarketplaceFilters
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

        <FilterSection
          title="Genres"
          items={genresWithCount}
          selectedItems={selectedGenres}
          onItemSelect={onGenreSelect}
          onItemRemove={onGenreRemove}
        />

        <FilterSection
          title="Styles"
          items={stylesWithCount}
          selectedItems={selectedStyles}
          onItemSelect={onStyleSelect}
          onItemRemove={onStyleRemove}
        />

        <PriceRangeSlider
          priceRange={showMarketplaceListings ? sellerPriceRange : priceRange}
          onPriceRangeChange={showMarketplaceListings ? setSellerPriceRange : onPriceRangeChange}
          minPrice={showMarketplaceListings ? minSellerPrice : minPrice}
          maxPrice={showMarketplaceListings ? maxSellerPrice : maxPrice}
        />
      </div>
    </>
  );
};

export default ShopFilters; 
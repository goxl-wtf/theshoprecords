'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/components/layouts/MainLayout';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';

// Sample data for featured records
const featuredRecords = [
  {
    id: 'record1',
    title: 'Abbey Road',
    artist: 'The Beatles',
    price: 29.99,
    image: 'https://picsum.photos/300/300?random=1',
    rating: 4.8,
    reviewCount: 123,
    genre: 'Rock'
  },
  {
    id: 'record2',
    title: 'Dark Side of the Moon',
    artist: 'Pink Floyd',
    price: 24.99,
    image: 'https://picsum.photos/300/300?random=2',
    rating: 5.0,
    reviewCount: 211,
    genre: 'Rock'
  },
  {
    id: 'record3',
    title: 'Rumours',
    artist: 'Fleetwood Mac',
    price: 21.99,
    image: 'https://picsum.photos/300/300?random=3',
    rating: 4.7,
    reviewCount: 89,
    genre: 'Rock'
  },
  {
    id: 'record4',
    title: 'Thriller',
    artist: 'Michael Jackson',
    price: 27.99,
    image: 'https://picsum.photos/300/300?random=4',
    rating: 4.9,
    reviewCount: 176,
    genre: 'Pop'
  }
];

// Sample data for genres
const genres = [
  { name: 'Rock', image: 'https://picsum.photos/400/200?random=5' },
  { name: 'Jazz', image: 'https://picsum.photos/400/200?random=6' },
  { name: 'Hip-Hop', image: 'https://picsum.photos/400/200?random=7' },
  { name: 'Folk, World & Country', image: 'https://picsum.photos/400/200?random=8' },
];

// Featured album data (like the "Nirvana - Nevermind" in the screenshot)
const featuredAlbum = {
  id: 'featured1',
  title: 'Nevermind',
  artist: 'Nirvana',
  price: 28.00,
  image: 'https://picsum.photos/600/600?random=9',
  rating: 5.0,
  reviewCount: 2039,
  description: 'Limited Edition Vinyl'
};

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-gray-100 dark:from-gray-900 dark:to-black py-10 md:py-20 transition-colors duration-300">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left side - Featured album */}
            <div className="md:w-1/2 flex justify-center md:justify-end">
              <div className="relative">
                <Image
                  src={featuredAlbum.image}
                  alt={`${featuredAlbum.artist} - ${featuredAlbum.title}`}
                  width={400}
                  height={400}
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
            
            {/* Right side - Content */}
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800 dark:text-white transition-colors duration-300">
                {featuredAlbum.artist} - {featuredAlbum.title}
              </h2>
              <div className="flex items-center justify-center md:justify-start mb-4">
                <div className="flex items-center mr-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-yellow-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
                  {featuredAlbum.rating} ({featuredAlbum.reviewCount} ratings)
                </span>
              </div>
              <p className="text-xl font-bold mb-6 text-gray-800 dark:text-white transition-colors duration-300">€{featuredAlbum.price.toFixed(2)}</p>
              <Link 
                href={`/shop/${featuredAlbum.id}`}
                className="inline-block bg-primary text-white font-semibold py-3 px-8 rounded-lg hover:bg-opacity-90 transition duration-300"
              >
                Bekijk in TheWebShop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-10 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="container-custom">
          <SearchBar />
          
          {/* Statistics */}
          <div className="flex flex-wrap justify-center gap-8 mt-10 text-center">
            <div className="px-6">
              <p className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white transition-colors duration-300">20,000+</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">Vinyl en CD's in de winkel</p>
            </div>
            <div className="px-6">
              <p className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white transition-colors duration-300">1940</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">Nieuwe en tweedehands LP's Online</p>
            </div>
            <div className="px-6">
              <p className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white transition-colors duration-300">100%</p>
              <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">Klant tevredenheid</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Records Section */}
      <section className="py-12 bg-white dark:bg-black transition-colors duration-300">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white transition-colors duration-300">Featured Records</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredRecords.map((record) => (
              <ProductCard key={record.id} {...record} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories/Genres Section */}
      <section className="py-12 bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <div className="container-custom">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 dark:text-white transition-colors duration-300">Browse by Genre</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {genres.map((genre, index) => (
              <Link key={index} href={`/genres/${genre.name.toLowerCase()}`} className="block">
                <div className="relative overflow-hidden rounded-lg group">
                  <Image
                    src={genre.image}
                    alt={genre.name}
                    width={400}
                    height={200}
                    className="object-cover h-40 w-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-white text-xl font-semibold">{genre.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

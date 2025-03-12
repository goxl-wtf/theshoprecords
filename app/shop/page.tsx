import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MainLayout from '@/components/layouts/MainLayout';

export default function Shop() {
  // Mock data for records
  const records = [
    {
      id: 1,
      title: "Abbey Road",
      artist: "The Beatles",
      price: 29.99,
      image: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
      genre: "Rock",
    },
    {
      id: 2,
      title: "Dark Side of the Moon",
      artist: "Pink Floyd",
      price: 24.99,
      image: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
      genre: "Rock",
    },
    {
      id: 3,
      title: "Rumours",
      artist: "Fleetwood Mac",
      price: 27.99,
      image: "https://upload.wikimedia.org/wikipedia/en/f/fb/FMacRumours.PNG",
      genre: "Rock",
    },
    {
      id: 4,
      title: "Thriller",
      artist: "Michael Jackson",
      price: 22.99,
      image: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png",
      genre: "Pop",
    },
    {
      id: 5,
      title: "Kind of Blue",
      artist: "Miles Davis",
      price: 34.99,
      image: "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg",
      genre: "Jazz",
    },
    {
      id: 6,
      title: "Blue Train",
      artist: "John Coltrane",
      price: 31.99,
      image: "https://upload.wikimedia.org/wikipedia/en/0/06/Bluetrane.jpg",
      genre: "Jazz",
    },
    {
      id: 7,
      title: "The Chronic",
      artist: "Dr. Dre",
      price: 28.99,
      image: "https://upload.wikimedia.org/wikipedia/en/1/19/Dr.DreTheChronic.jpg",
      genre: "Hip Hop",
    },
    {
      id: 8,
      title: "To Pimp a Butterfly",
      artist: "Kendrick Lamar",
      price: 26.99,
      image: "https://upload.wikimedia.org/wikipedia/en/f/f6/Kendrick_Lamar_-_To_Pimp_a_Butterfly.png",
      genre: "Hip Hop",
    },
  ];

  return (
    <MainLayout>
      <div className="container-custom py-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white transition-colors duration-300">Shop Records</h1>
        
        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-8 transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Search */}
            <div className="md:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  placeholder="Search for records..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
                />
                <button className="absolute inset-y-0 right-0 px-3 flex items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 dark:text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
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
            </div>
            
            {/* Genre Filter */}
            <div>
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                Genre
              </label>
              <select
                id="genre"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
              >
                <option value="">All Genres</option>
                <option value="rock">Rock</option>
                <option value="jazz">Jazz</option>
                <option value="hip-hop">Hip Hop</option>
                <option value="pop">Pop</option>
                <option value="classical">Classical</option>
              </select>
            </div>
            
            {/* Price Filter */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">
                Price
              </label>
              <select
                id="price"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-300"
              >
                <option value="">Any Price</option>
                <option value="under-20">Under $20</option>
                <option value="20-30">$20 - $30</option>
                <option value="30-40">$30 - $40</option>
                <option value="over-40">Over $40</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Records Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {records.map((record) => (
            <div key={record.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
              <div className="relative h-64">
                <Image
                  src={record.image}
                  alt={`${record.title} by ${record.artist}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <span className="inline-block px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full mb-2 transition-colors duration-300">{record.genre}</span>
                <h3 className="font-bold text-lg text-gray-800 dark:text-white transition-colors duration-300">{record.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{record.artist}</p>
                <div className="flex justify-between items-center mt-4">
                  <span className="font-bold text-lg text-gray-800 dark:text-white transition-colors duration-300">${record.price.toFixed(2)}</span>
                  <div className="flex space-x-2">
                    <Link
                      href={`/shop/${record.id}`}
                      className="text-primary hover:text-primary/80 font-medium transition-colors duration-300"
                    >
                      View
                    </Link>
                    <button className="bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/90 transition-colors duration-300">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">Previous</button>
            <button className="px-3 py-1 bg-primary text-white rounded-md transition-colors duration-300">1</button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">2</button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">3</button>
            <button className="px-3 py-1 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300">Next</button>
          </nav>
        </div>
      </div>
    </MainLayout>
  );
} 
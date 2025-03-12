"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import MainLayout from '@/components/layouts/MainLayout';

export default function ProductDetailPage() {
  const params = useParams();
  const recordId = parseInt(params.id as string);
  
  // Mock record data - in a real app, this would be fetched from an API or database
  const records = [
    {
      id: 1,
      title: "Abbey Road",
      artist: "The Beatles",
      price: 29.99,
      image: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
      genre: "Rock",
      year: 1969,
      condition: "Near Mint",
      description: "Abbey Road is the eleventh studio album by the English rock band the Beatles, released on 26 September 1969 by Apple Records. The recording sessions were the last in which all four Beatles participated.",
      trackList: [
        "Come Together",
        "Something",
        "Maxwell's Silver Hammer",
        "Oh! Darling",
        "Octopus's Garden",
        "I Want You (She's So Heavy)",
        "Here Comes the Sun",
        "Because",
        "You Never Give Me Your Money",
        "Sun King",
        "Mean Mr. Mustard",
        "Polythene Pam",
        "She Came in Through the Bathroom Window",
        "Golden Slumbers",
        "Carry That Weight",
        "The End",
        "Her Majesty",
      ],
      sellerId: 1,
      sellerName: "VinylVault",
    },
    {
      id: 2,
      title: "Dark Side of the Moon",
      artist: "Pink Floyd",
      price: 24.99,
      image: "https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png",
      genre: "Rock",
      year: 1973,
      condition: "Very Good Plus",
      description: "The Dark Side of the Moon is the eighth studio album by the English rock band Pink Floyd, released on 1 March 1973. It built on ideas explored in the band's earlier recordings and live shows, but lacks the extended instrumental excursions that characterized their work following the departure in 1968 of founder member, principal composer, and lyricist Syd Barrett.",
      trackList: [
        "Speak to Me",
        "Breathe",
        "On the Run", 
        "Time",
        "The Great Gig in the Sky",
        "Money",
        "Us and Them",
        "Any Colour You Like", 
        "Brain Damage",
        "Eclipse",
      ],
      sellerId: 2,
      sellerName: "ClassicSpins",
    },
  ];
  
  // Find the record with the matching ID
  const record = records.find(r => r.id === recordId);
  
  // If record not found, display message
  if (!record) {
    return (
      <MainLayout>
        <div className="container-custom py-10">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h1 className="text-2xl font-bold text-red-600">Record Not Found</h1>
            <p className="mt-4 text-gray-700 dark:text-gray-300 transition-colors duration-300">The record you're looking for does not exist.</p>
            <Link href="/shop" className="mt-4 inline-block text-primary hover:underline">
              Back to Shop
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container-custom py-10">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex text-sm">
            <li className="flex items-center">
              <Link href="/" className="text-gray-500 hover:text-primary transition-colors duration-300">
                Home
              </Link>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li className="flex items-center">
              <Link href="/shop" className="text-gray-500 hover:text-primary transition-colors duration-300">
                Shop
              </Link>
              <span className="mx-2 text-gray-400">/</span>
            </li>
            <li className="text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300">
              {record.title}
            </li>
          </ol>
        </nav>
        
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-md">
              <Image
                src={record.image}
                alt={`${record.title} by ${record.artist}`}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Details */}
            <div>
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 transition-colors duration-300">
                <div className="flex items-center mb-2">
                  <span className="inline-block px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full transition-colors duration-300">{record.genre}</span>
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Released: {record.year}</span>
                </div>
                <h1 className="text-3xl font-bold mb-1 text-gray-800 dark:text-white transition-colors duration-300">{record.title}</h1>
                <h2 className="text-xl text-gray-700 dark:text-gray-300 mb-4 transition-colors duration-300">{record.artist}</h2>
                <p className="text-2xl font-bold text-primary">${record.price.toFixed(2)}</p>
              </div>
              
              {/* Condition */}
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-white transition-colors duration-300">Condition</h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">{record.condition}</p>
              </div>
              
              {/* Seller Info */}
              <div className="mb-6">
                <h3 className="font-semibold mb-2 text-gray-800 dark:text-white transition-colors duration-300">Seller</h3>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center transition-colors duration-300">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">{record.sellerName.charAt(0)}</span>
                  </div>
                  <span className="ml-2 text-gray-700 dark:text-gray-300 transition-colors duration-300">{record.sellerName}</span>
                </div>
              </div>
              
              {/* Add to Cart */}
              <div className="flex space-x-4">
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium flex-grow transition-colors duration-300">
                  Add to Cart
                </button>
                <button className="border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-3 rounded-md flex items-center justify-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="24" 
                    height="24" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* Description and Tracklist */}
          <div className="p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Description */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white transition-colors duration-300">Description</h3>
                <p className="text-gray-700 dark:text-gray-300 transition-colors duration-300">{record.description}</p>
              </div>
              
              {/* Tracklist */}
              <div>
                <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-white transition-colors duration-300">Tracklist</h3>
                <ol className="list-decimal list-inside space-y-1">
                  {record.trackList.map((track, index) => (
                    <li key={index} className="text-gray-700 dark:text-gray-300 transition-colors duration-300">{track}</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 
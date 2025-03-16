'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Genre {
  name: string;
  image: string;
}

interface GenreShowcaseProps {
  genres: Genre[];
}

const GenreShowcase: React.FC<GenreShowcaseProps> = ({ genres }) => {
  return (
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
  );
};

export default GenreShowcase; 
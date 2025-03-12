import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

type ProductCardProps = {
  id: string;
  title: string;
  artist: string;
  price: number;
  image: string;
  rating?: number;
  reviewCount?: number;
  genre?: string;
};

const ProductCard = ({
  id,
  title,
  artist,
  price,
  image,
  rating = 0,
  reviewCount = 0,
  genre,
}: ProductCardProps) => {
  return (
    <div className="group">
      <Link href={`/product/${id}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-900 transition-all duration-300 group-hover:opacity-90">
          {/* Album Cover */}
          <div className="aspect-square relative">
            <Image
              src={image}
              alt={`${artist} - ${title}`}
              width={300}
              height={300}
              className="object-cover"
            />
            
            {/* Quick View Button (appears on hover) */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium">
                Bekijk Album
              </span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-3">
          <h3 className="text-gray-800 dark:text-white font-medium tracking-wide">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{artist}</p>
          
          {/* Price and Rating */}
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-800 dark:text-white font-semibold">€{price.toFixed(2)}</span>
            
            {rating > 0 && (
              <div className="flex items-center">
                <div className="flex items-center mr-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-3 w-3 ${
                        i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'
                      }`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                      />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400 text-xs">({reviewCount})</span>
              </div>
            )}
          </div>
          
          {/* Genre Tag */}
          {genre && (
            <div className="mt-2">
              <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-400 rounded">
                {genre}
              </span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard; 
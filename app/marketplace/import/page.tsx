'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { searchReleases, getReleaseDetails, convertDiscogsToProduct } from '@/utils/discogsService';
import { Product } from '@/utils/types';
import AuthCheck from '@/components/auth/AuthCheck';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';

export default function ImportPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedRelease, setSelectedRelease] = useState<any>(null);
  const [convertedProduct, setConvertedProduct] = useState<Partial<Product> | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setError('');
    setSearchResults([]);
    setSelectedRelease(null);
    setConvertedProduct(null);

    try {
      const result = await searchReleases(searchQuery);
      if ('message' in result) {
        setError(result.message);
      } else {
        setSearchResults(result.results);
      }
    } catch (err) {
      setError('Failed to search Discogs. Please try again.');
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectRelease = async (releaseId: number) => {
    setIsConverting(true);
    setError('');
    setSelectedRelease(null);
    setConvertedProduct(null);

    try {
      const releaseDetails = await getReleaseDetails(releaseId);
      if ('message' in releaseDetails) {
        setError(releaseDetails.message);
      } else {
        setSelectedRelease(releaseDetails);
        const product = convertDiscogsToProduct(releaseDetails);
        setConvertedProduct(product);
      }
    } catch (err) {
      setError('Failed to fetch release details. Please try again.');
      console.error(err);
    } finally {
      setIsConverting(false);
    }
  };

  const handleCreateListing = () => {
    if (!convertedProduct) return;
    
    // Store the product data in session storage to access it in the create listing form
    sessionStorage.setItem('importedProduct', JSON.stringify(convertedProduct));
    router.push('/marketplace/create-listing');
  };

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Import Record from Discogs</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                placeholder="Search albums, artists, or releases..."
                disabled={isSearching}
                className="w-full"
              />
            </div>
            <Button 
              type="submit" 
              isLoading={isSearching}
              disabled={isSearching || !searchQuery.trim()}
            >
              Search
            </Button>
          </form>
          
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{error}</p>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && !selectedRelease && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Search Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((result) => (
                  <Card key={result.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                    <div 
                      onClick={() => handleSelectRelease(result.id)} 
                      className="flex flex-col h-full"
                    >
                      <div className="relative aspect-square w-full">
                        <Image
                          src={result.cover_image || '/images/placeholder.jpg'}
                          alt={result.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover rounded-t-lg"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{result.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {result.year} • {result.country}
                        </p>
                        <div className="mt-auto">
                          <div className="flex flex-wrap gap-1 mt-2">
                            {result.format?.slice(0, 2).map((format: string, i: number) => (
                              <span 
                                key={i} 
                                className="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1 text-xs"
                              >
                                {format}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Selected Release */}
          {isConverting && (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
              <span className="ml-3">Converting release...</span>
            </div>
          )}

          {selectedRelease && convertedProduct && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Selected Release</h2>
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1">
                    {selectedRelease.images && selectedRelease.images.length > 0 && (
                      <div className="relative aspect-square w-full rounded-lg overflow-hidden">
                        <Image
                          src={selectedRelease.images[0].uri || '/images/placeholder.jpg'}
                          alt={convertedProduct.title || ''}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-contain"
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold">{convertedProduct.title}</h3>
                    <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">{convertedProduct.artist}</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Year</p>
                        <p className="font-medium">{convertedProduct.year || 'Unknown'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Suggested Price</p>
                        <p className="font-medium">${convertedProduct.price?.toFixed(2) || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Genres</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {convertedProduct.genres?.map((genre, i) => (
                            <span 
                              key={i} 
                              className="inline-block bg-blue-100 dark:bg-blue-900 rounded-full px-2 py-1 text-xs"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Styles</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {convertedProduct.styles?.map((style, i) => (
                            <span 
                              key={i} 
                              className="inline-block bg-purple-100 dark:bg-purple-900 rounded-full px-2 py-1 text-xs"
                            >
                              {style.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {convertedProduct.description && (
                      <div className="mb-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Description</p>
                        <p className="text-sm mt-1">{convertedProduct.description}</p>
                      </div>
                    )}
                    
                    {convertedProduct.tracks && convertedProduct.tracks.length > 0 && (
                      <div className="mb-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Tracklist</p>
                        <div className="max-h-60 overflow-y-auto pr-2">
                          <table className="w-full text-sm">
                            <thead className="text-xs text-gray-700 dark:text-gray-300 uppercase bg-gray-100 dark:bg-gray-800">
                              <tr>
                                <th className="px-2 py-3 text-left">Pos</th>
                                <th className="px-2 py-3 text-left">Title</th>
                                <th className="px-2 py-3 text-right">Duration</th>
                              </tr>
                            </thead>
                            <tbody>
                              {convertedProduct.tracks.map((track, i) => (
                                <tr key={i} className="border-b dark:border-gray-700">
                                  <td className="px-2 py-2">{track.position}</td>
                                  <td className="px-2 py-2">{track.title}</td>
                                  <td className="px-2 py-2 text-right">{track.duration}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-3 mt-8">
                      <Button onClick={handleCreateListing} className="w-full sm:w-auto">
                        Create Listing with This Record
                      </Button>
                      <Button variant="secondary" onClick={() => setSelectedRelease(null)} className="w-full sm:w-auto">
                        Back to Search Results
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthCheck>
  );
} 
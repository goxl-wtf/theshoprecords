'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { getProductsWithoutDiscogsId, findPotentialMatches, linkProductToDiscogs, enrichProductWithDiscogsData } from '@/utils/discogsLinkingUtil';
import { Product } from '@/utils/types';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

export default function DiscogsLinkingPage() {
  const { user, isLoading: userLoading } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [potentialMatches, setPotentialMatches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [linkedCount, setLinkedCount] = useState(0);
  const [message, setMessage] = useState('');
  const [batchProcessing, setBatchProcessing] = useState(false);
  const pageSize = 10;

  // Load products without Discogs IDs
  useEffect(() => {
    const loadProducts = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const data = await getProductsWithoutDiscogsId(pageSize, page * pageSize);
        setProducts(data);
        
        if (data.length > 0 && !currentProduct) {
          setCurrentProduct(data[0]);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setMessage('Failed to load products without Discogs IDs.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [user, page, linkedCount]);

  // Load potential matches when current product changes
  useEffect(() => {
    const loadMatches = async () => {
      if (!currentProduct) return;
      
      setIsLoading(true);
      setPotentialMatches([]);
      
      try {
        const matches = await findPotentialMatches(currentProduct);
        setPotentialMatches(matches);
      } catch (error) {
        console.error('Error finding matches:', error);
        setMessage('Failed to find potential matches.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMatches();
  }, [currentProduct]);

  // Handle linking a product to a Discogs release
  const handleLinkProduct = async (discogsId: number) => {
    if (!currentProduct) return;
    
    setIsLoading(true);
    setMessage('');
    
    try {
      // First, link the product to the Discogs ID
      const linked = await linkProductToDiscogs(currentProduct.id, discogsId);
      
      if (linked) {
        // Then, enrich the product with additional data
        await enrichProductWithDiscogsData(currentProduct.id, discogsId);
        
        setMessage(`Successfully linked "${currentProduct.title}" to Discogs.`);
        setLinkedCount(prev => prev + 1);
        
        // Move to the next product
        const nextIndex = products.findIndex(p => p.id === currentProduct.id) + 1;
        if (nextIndex < products.length) {
          setCurrentProduct(products[nextIndex]);
        } else if (products.length > 0) {
          // If we've reached the end of the current page, load the next page
          setPage(prev => prev + 1);
        } else {
          setCurrentProduct(null);
        }
      } else {
        setMessage('Failed to link product to Discogs.');
      }
    } catch (error) {
      console.error('Error linking product:', error);
      setMessage('An error occurred while linking the product.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle skipping the current product
  const handleSkipProduct = () => {
    if (!currentProduct) return;
    
    const nextIndex = products.findIndex(p => p.id === currentProduct.id) + 1;
    if (nextIndex < products.length) {
      setCurrentProduct(products[nextIndex]);
    } else if (products.length > 0) {
      setPage(prev => prev + 1);
    } else {
      setCurrentProduct(null);
    }
  };

  // Handle automatic batch processing
  const handleBatchProcess = async () => {
    if (batchProcessing) return;
    
    setBatchProcessing(true);
    setMessage('');
    
    try {
      for (const product of products) {
        setCurrentProduct(product);
        setIsLoading(true);
        
        // Find potential matches
        const matches = await findPotentialMatches(product);
        setPotentialMatches(matches);
        
        // If there's a high-confidence match, link it automatically
        if (matches.length > 0) {
          const match = matches[0];
          await linkProductToDiscogs(product.id, match.id);
          await enrichProductWithDiscogsData(product.id, match.id);
          setLinkedCount(prev => prev + 1);
        }
        
        setIsLoading(false);
        
        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      setMessage(`Batch processing complete. Linked ${linkedCount} products.`);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error in batch processing:', error);
      setMessage('An error occurred during batch processing.');
    } finally {
      setBatchProcessing(false);
      setIsLoading(false);
    }
  };

  // Only allow admin access
  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin: Discogs Linking</h1>
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
          <p>You must be logged in as an admin to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin: Discogs Linking</h1>
      
      {message && (
        <div className={`border-l-4 p-4 mb-6 ${
          message.includes('Successfully') 
            ? 'bg-green-100 border-green-500 text-green-700' 
            : 'bg-yellow-100 border-yellow-500 text-yellow-700'
        }`}>
          <p>{message}</p>
        </div>
      )}
      
      <div className="mb-6 flex justify-between items-center">
        <div>
          <p className="text-gray-600">
            Products without Discogs ID: <span className="font-semibold">{products.length}</span>
          </p>
          <p className="text-gray-600">
            Products linked this session: <span className="font-semibold">{linkedCount}</span>
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0 || isLoading || batchProcessing}
            variant="secondary"
          >
            Previous Page
          </Button>
          
          <Button 
            onClick={() => setPage(page + 1)}
            disabled={products.length < pageSize || isLoading || batchProcessing}
            variant="secondary"
          >
            Next Page
          </Button>
          
          <Button 
            onClick={handleBatchProcess}
            isLoading={batchProcessing}
            disabled={batchProcessing || isLoading || products.length === 0}
          >
            Auto-Link Batch
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
          <span className="ml-2">Loading...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Current Product */}
          {currentProduct ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Current Product</h2>
              
              <div className="flex items-start gap-4">
                {currentProduct.images && currentProduct.images.length > 0 ? (
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <Image
                      src={currentProduct.images[0].url}
                      alt={currentProduct.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-500 dark:text-gray-400">No Image</span>
                  </div>
                )}
                
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{currentProduct.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{currentProduct.artist}</p>
                  
                  {currentProduct.year && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm">Year: {currentProduct.year}</p>
                  )}
                  
                  {currentProduct.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 line-clamp-3">
                      {currentProduct.description}
                    </p>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={handleSkipProduct} 
                className="mt-4"
                variant="secondary"
                disabled={isLoading || batchProcessing}
              >
                Skip This Product
              </Button>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">
                {products.length === 0 ? 
                  'No more products to link!' : 
                  'Select a product to link'}
              </p>
            </div>
          )}
          
          {/* Potential Matches */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Potential Discogs Matches</h2>
            
            {potentialMatches.length > 0 ? (
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                {potentialMatches.map((match, index) => (
                  <div key={match.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex gap-4">
                    {match.thumb ? (
                      <div className="relative w-24 h-24 flex-shrink-0">
                        <Image
                          src={match.thumb}
                          alt={match.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-500 dark:text-gray-400">No Image</span>
                      </div>
                    )}
                    
                    <div className="flex-grow">
                      <h3 className="text-md font-semibold">{match.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Year: {match.year}, Country: {match.country}
                      </p>
                      
                      {match.format && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Format: {match.format.join(', ')}
                        </p>
                      )}
                      
                      <div className="mt-2">
                        <Button
                          onClick={() => handleLinkProduct(match.id)}
                          size="sm"
                          disabled={isLoading || batchProcessing}
                          className="w-full"
                          variant={index === 0 ? "primary" : "secondary"}
                        >
                          {index === 0 ? 'Link This Release (Best Match)' : 'Link This Release'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  {currentProduct ? 'No matches found for this product.' : 'Select a product to find matches.'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 
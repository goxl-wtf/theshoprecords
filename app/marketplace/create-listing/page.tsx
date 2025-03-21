'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ListingCondition } from '@/utils/types';
import { createListing, createProduct, updateProduct } from '@/utils/marketplaceService';
import { useSeller } from '@/context/SellerContext';
import AuthCheck from '@/components/auth/AuthCheck';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Image from 'next/image';

const conditionOptions: Record<ListingCondition, string> = {
  mint: 'Mint (M)',
  near_mint: 'Near Mint (NM)',
  very_good: 'Very Good (VG+)',
  good: 'Good (G)',
  fair: 'Fair (F)',
  poor: 'Poor (P)'
};

export default function CreateListingPage() {
  const router = useRouter();
  const { sellerProfile, isLoading: isSellerLoading } = useSeller();
  
  const [importedProduct, setImportedProduct] = useState<Partial<Product> | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [condition, setCondition] = useState<ListingCondition>('near_mint');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [productLoaded, setProductLoaded] = useState(false);

  // Load product data from session storage
  useEffect(() => {
    const loadProduct = () => {
      if (typeof window === 'undefined') return;
      
      try {
        const productData = sessionStorage.getItem('importedProduct');
        if (productData) {
          const parsed = JSON.parse(productData);
          setImportedProduct(parsed);
          setTitle(parsed.title || '');
          setDescription(parsed.description || '');
          setPrice(parsed.price ? parsed.price.toString() : '');
          setProductLoaded(true);
        }
      } catch (err) {
        console.error('Error loading product data:', err);
        setError('Could not load product data. Please try importing again.');
      }
    };

    loadProduct();
  }, []);

  // Redirect if no seller profile
  useEffect(() => {
    if (!isSellerLoading && !sellerProfile) {
      router.push('/marketplace/seller/register');
    }
  }, [sellerProfile, isSellerLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importedProduct || !sellerProfile) return;

    setIsSubmitting(true);
    setError('');

    try {
      // First, create or update the product in the database
      const productData = { 
        ...importedProduct,
        // Add any necessary fields that might be missing from the imported product
        in_stock: true,
        price: parseFloat(price)
      };

      // If there's a discogs_id, use it to check if the product already exists
      let productId = '';
      if (importedProduct.discogs_id) {
        // Check if a product with this discogs_id already exists
        // For now, we'll assume it doesn't and create a new one
        // In a real implementation, you'd want to check for existing products
        const newProduct = await createProduct(productData);
        if (!newProduct) throw new Error('Failed to create product');
        productId = newProduct.id;
      } else {
        // Create a new product
        const newProduct = await createProduct(productData);
        if (!newProduct) throw new Error('Failed to create product');
        productId = newProduct.id;
      }

      // Create the listing
      const listingData = {
        seller_id: sellerProfile.id,
        product_id: productId,
        title,
        description,
        price: parseFloat(price),
        currency: 'USD', // Hardcoded for now, could be configurable
        condition,
        quantity: parseInt(quantity),
        status: 'active' as const,
        is_featured: false
      };

      const newListing = await createListing(listingData);
      if (!newListing) throw new Error('Failed to create listing');

      // Clear the imported product from session storage
      sessionStorage.removeItem('importedProduct');

      // Redirect to the new listing
      router.push(`/marketplace/listings/${newListing.id}`);
    } catch (err) {
      console.error('Error creating listing:', err);
      setError('Failed to create listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSellerLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
        <span className="ml-2">Loading seller profile...</span>
      </div>
    );
  }

  if (!importedProduct && productLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create Listing</h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-red-500 mb-4">No product data found. Please import a product first.</p>
          <Button onClick={() => router.push('/marketplace/import')}>
            Import from Discogs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Create Listing</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
              <p>{error}</p>
            </div>
          )}
          
          {importedProduct && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Preview */}
                <div className="lg:col-span-1">
                  <h2 className="text-xl font-semibold mb-4">Product Preview</h2>
                  
                  {importedProduct.images && importedProduct.images.length > 0 && (
                    <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-4">
                      <Image
                        src={importedProduct.images[0].url || '/images/placeholder.jpg'}
                        alt={importedProduct.title || ''}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-contain"
                      />
                    </div>
                  )}
                  
                  <div className="text-sm">
                    <p><span className="font-semibold">Artist:</span> {importedProduct.artist}</p>
                    <p><span className="font-semibold">Title:</span> {importedProduct.title}</p>
                    {importedProduct.year && <p><span className="font-semibold">Year:</span> {importedProduct.year}</p>}
                    
                    {importedProduct.genres && importedProduct.genres.length > 0 && (
                      <div className="mt-2">
                        <span className="font-semibold">Genres:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {importedProduct.genres.map((genre, i) => (
                            <span 
                              key={i} 
                              className="inline-block bg-blue-100 dark:bg-blue-900 rounded-full px-2 py-1 text-xs"
                            >
                              {genre.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Listing Form */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-xl font-semibold mb-4">Listing Details</h2>
                  
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Listing Title
                    </label>
                    <Input
                      id="title"
                      type="text"
                      value={title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                      placeholder="Enter listing title"
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the condition, special features, etc."
                      className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 min-h-[120px] p-3"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price (USD)
                      </label>
                      <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Quantity
                      </label>
                      <Input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(e.target.value)}
                        min="1"
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Condition
                    </label>
                    <select
                      id="condition"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as ListingCondition)}
                      className="w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 p-3"
                      required
                    >
                      {Object.entries(conditionOptions).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="pt-4">
                    <Button
                      type="submit"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                      className="w-full md:w-auto"
                    >
                      Create Listing
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => router.push('/marketplace/import')}
                      className="w-full md:w-auto mt-2 md:mt-0 md:ml-2"
                    >
                      Back to Import
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </AuthCheck>
  );
} 
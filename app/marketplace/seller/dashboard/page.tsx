'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSeller } from '@/context/SellerContext';
import { Listing, ListingStatus } from '@/utils/types';
import AuthCheck from '@/components/auth/AuthCheck';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';
import Link from 'next/link';
import SalesOverview from '@/components/marketplace/seller/SalesOverview';
import PeriodSelector, { PeriodType } from '@/components/marketplace/seller/PeriodSelector';
import VerificationRequestForm from '@/components/marketplace/seller/VerificationRequestForm';

export default function SellerDashboardPage() {
  const router = useRouter();
  const { 
    sellerProfile, 
    isLoading, 
    listings, 
    isLoadingListings,
    refreshListings,
    changeListing,
    removeListing
  } = useSeller();
  
  const [activeTab, setActiveTab] = useState<string>('active');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isChangingStatus, setIsChangingStatus] = useState<string | null>(null);
  const [activeDashboardTab, setActiveDashboardTab] = useState<'listings' | 'analytics' | 'verification'>('listings');
  const [analyticsPeriod, setAnalyticsPeriod] = useState<PeriodType>('month');
  const [customDateRange, setCustomDateRange] = useState<{ startDate: string; endDate: string } | undefined>(undefined);
  
  // Filter listings by status
  const filteredListings = listings.filter(listing => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return listing.status === 'active';
    if (activeTab === 'pending') return listing.status === 'pending';
    if (activeTab === 'sold') return listing.status === 'sold';
    if (activeTab === 'draft') return listing.status === 'draft';
    return true;
  });
  
  // Load listings by status tab
  useEffect(() => {
    const loadListings = async () => {
      if (!sellerProfile) return;
      
      const status = activeTab !== 'all' ? activeTab as ListingStatus : undefined;
      await refreshListings(status);
    };
    
    loadListings();
  }, [activeTab, sellerProfile, refreshListings]);
  
  // Handle status change
  const handleStatusChange = async (listingId: string, newStatus: ListingStatus) => {
    setIsChangingStatus(listingId);
    
    try {
      const success = await changeListing(listingId, newStatus);
      if (!success) {
        console.error('Failed to update listing status');
      }
    } catch (err) {
      console.error('Error changing listing status:', err);
    } finally {
      setIsChangingStatus(null);
    }
  };
  
  // Handle listing deletion
  const handleDelete = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }
    
    setIsDeleting(listingId);
    
    try {
      const success = await removeListing(listingId);
      if (!success) {
        console.error('Failed to delete listing');
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Handle period change for analytics
  const handlePeriodChange = (period: PeriodType, customRange?: { startDate: string; endDate: string }) => {
    setAnalyticsPeriod(period);
    setCustomDateRange(customRange);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
        <span className="ml-2">Loading seller profile...</span>
      </div>
    );
  }
  
  if (!sellerProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-4">Seller Dashboard</h1>
          <p className="text-red-500 mb-4">You are not registered as a seller yet.</p>
          <Button onClick={() => router.push('/marketplace/seller/register')}>
            Register as Seller
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <AuthCheck>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Seller Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-20">
              <div className="flex flex-col items-center mb-4">
                {sellerProfile.logo_url ? (
                  <div className="relative w-24 h-24 rounded-full overflow-hidden mb-3">
                    <Image 
                      src={sellerProfile.logo_url} 
                      alt={sellerProfile.store_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3">
                    <span className="text-2xl font-bold text-gray-500 dark:text-gray-400">
                      {sellerProfile.store_name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                
                <h2 className="text-xl font-bold">{sellerProfile.store_name}</h2>
                {sellerProfile.is_verified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mt-1">
                    Verified Seller
                  </span>
                )}
              </div>
              
              <div className="space-y-3 mb-6">
                {sellerProfile.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">{sellerProfile.description}</p>
                )}
                
                {sellerProfile.contact_email && (
                  <p className="text-sm flex items-center text-gray-600 dark:text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {sellerProfile.contact_email}
                  </p>
                )}
                
                <p className="text-sm flex items-center text-gray-600 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Joined {new Date(sellerProfile.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Link href="/marketplace/seller/edit-profile">
                  <Button variant="secondary" className="w-full">
                    Edit Profile
                  </Button>
                </Link>
                <Link href="/marketplace/import">
                  <Button className="w-full">
                    Add New Listing
                  </Button>
                </Link>
                
                {/* Dashboard Navigation */}
                <div className="mt-6 border-t dark:border-gray-700 pt-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Dashboard</p>
                  <div className="flex flex-col space-y-1">
                    <button
                      className={`text-left px-2 py-1.5 rounded-md text-sm ${
                        activeDashboardTab === 'listings'
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setActiveDashboardTab('listings')}
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Listings
                      </span>
                    </button>
                    
                    <button
                      className={`text-left px-2 py-1.5 rounded-md text-sm ${
                        activeDashboardTab === 'analytics'
                          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setActiveDashboardTab('analytics')}
                    >
                      <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        Sales Analytics
                      </span>
                    </button>
                    
                    {!sellerProfile.is_verified && (
                      <button
                        className={`text-left px-2 py-1.5 rounded-md text-sm ${
                          activeDashboardTab === 'verification'
                            ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setActiveDashboardTab('verification')}
                      >
                        <span className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Get Verified
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeDashboardTab === 'listings' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-2xl font-bold">Your Listings</h1>
                  <Link href="/marketplace/import">
                    <Button size="sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      New Listing
                    </Button>
                  </Link>
                </div>
                
                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
                  <nav className="flex flex-wrap -mb-px">
                    <button
                      className={`mr-2 py-2 px-4 border-b-2 font-medium text-sm ${
                        activeTab === 'all'
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                      onClick={() => setActiveTab('all')}
                    >
                      All
                    </button>
                    <button
                      className={`mr-2 py-2 px-4 border-b-2 font-medium text-sm ${
                        activeTab === 'active'
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                      onClick={() => setActiveTab('active')}
                    >
                      Active
                    </button>
                    <button
                      className={`mr-2 py-2 px-4 border-b-2 font-medium text-sm ${
                        activeTab === 'pending'
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                      onClick={() => setActiveTab('pending')}
                    >
                      Pending
                    </button>
                    <button
                      className={`mr-2 py-2 px-4 border-b-2 font-medium text-sm ${
                        activeTab === 'sold'
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                      onClick={() => setActiveTab('sold')}
                    >
                      Sold
                    </button>
                    <button
                      className={`mr-2 py-2 px-4 border-b-2 font-medium text-sm ${
                        activeTab === 'draft'
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                      onClick={() => setActiveTab('draft')}
                    >
                      Draft
                    </button>
                  </nav>
                </div>
                
                {/* Listings */}
                {isLoadingListings ? (
                  <div className="flex justify-center items-center py-12">
                    <Spinner size="lg" />
                    <span className="ml-2">Loading listings...</span>
                  </div>
                ) : filteredListings.length > 0 ? (
                  <div className="space-y-4">
                    {filteredListings.map((listing) => (
                      <div 
                        key={listing.id} 
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col md:flex-row"
                      >
                        {/* Listing Thumbnail */}
                        <div className="md:w-1/4 flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                          <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                            {listing.product?.images && listing.product.images.length > 0 ? (
                              <Image
                                src={listing.product.images[0].url}
                                alt={listing.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-400">
                                No Image
                              </div>
                            )}
                            
                            {/* Status badge */}
                            <div className="absolute top-2 left-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                listing.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                listing.status === 'sold' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                listing.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                              }`}>
                                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Listing Details */}
                        <div className="md:w-3/4 flex flex-col flex-grow justify-between">
                          <div>
                            <h3 className="text-lg font-semibold mb-1">{listing.title}</h3>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">
                              {listing.product?.artist || 'Unknown Artist'} • Condition: {
                                listing.condition === 'mint' ? 'Mint (M)' :
                                listing.condition === 'near_mint' ? 'Near Mint (NM)' :
                                listing.condition === 'very_good' ? 'Very Good (VG+)' :
                                listing.condition === 'good' ? 'Good (G)' :
                                listing.condition === 'fair' ? 'Fair (F)' :
                                listing.condition === 'poor' ? 'Poor (P)' :
                                listing.condition
                              }
                            </p>
                            {listing.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                {listing.description}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="mb-2 md:mb-0">
                              <span className="font-semibold text-gray-900 dark:text-white">${listing.price.toFixed(2)}</span>
                              {listing.quantity > 0 && (
                                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                  {listing.quantity} in stock
                                </span>
                              )}
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => router.push(`/marketplace/seller/edit-listing/${listing.id}`)}
                              >
                                Edit
                              </Button>
                              
                              {listing.status !== 'active' && (
                                <Button
                                  size="sm"
                                  variant="primary"
                                  onClick={() => handleStatusChange(listing.id, 'active')}
                                  disabled={isChangingStatus === listing.id}
                                >
                                  {isChangingStatus === listing.id ? (
                                    <><Spinner size="xs" /> Activating...</>
                                  ) : (
                                    'Activate'
                                  )}
                                </Button>
                              )}
                              
                              {listing.status === 'active' && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleStatusChange(listing.id, 'draft')}
                                  disabled={isChangingStatus === listing.id}
                                >
                                  {isChangingStatus === listing.id ? (
                                    <><Spinner size="xs" /> Drafting...</>
                                  ) : (
                                    'Draft'
                                  )}
                                </Button>
                              )}
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDelete(listing.id)}
                                disabled={isDeleting === listing.id}
                              >
                                {isDeleting === listing.id ? (
                                  <><Spinner size="xs" /> Deleting...</>
                                ) : (
                                  'Delete'
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No listings found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {activeTab === 'all'
                        ? "You haven't created any listings yet."
                        : `You don't have any ${activeTab} listings.`}
                    </p>
                    <Link href="/marketplace/import">
                      <Button>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Create Your First Listing
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {/* Sales Analytics Tab */}
            {activeDashboardTab === 'analytics' && (
              <>
                <PeriodSelector 
                  onPeriodChange={handlePeriodChange} 
                  defaultPeriod={analyticsPeriod} 
                />
                <SalesOverview 
                  period={analyticsPeriod} 
                  customDateRange={customDateRange}
                />
              </>
            )}
            
            {/* Verification Tab */}
            {activeDashboardTab === 'verification' && !sellerProfile.is_verified && (
              <VerificationRequestForm 
                sellerId={sellerProfile.id} 
                onRequestSent={() => setActiveDashboardTab('listings')} 
              />
            )}
          </div>
        </div>
      </div>
    </AuthCheck>
  );
} 
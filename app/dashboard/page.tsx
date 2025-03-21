'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const [error, setError] = useState(null);

  // Add more extensive logging to help identify the issue
  console.log('Dashboard page loading. Rendering Dashboard component.');

  // At the start of the Dashboard component:
  console.log(`Dashboard component rendered with user: ${user ? 'logged in' : 'not logged in'}, isLoading: ${isLoading}`);

  // After the component has rendered, log the loading state regularly
  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log(`Dashboard loading check - isLoading: ${isLoading}, user: ${user ? 'present' : 'null'}`);
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [isLoading, user]);

  useEffect(() => {
    // Debug logging
    console.log(`Dashboard rendered - user: ${user ? 'present' : 'not present'}, isLoading: ${isLoading}`);
    
    // First check: if we have a manual login redirect flag, we came directly from login
    // This takes precedence over all other checks - we know the user is authenticated
    const hasManualRedirect = typeof window !== 'undefined' && sessionStorage.getItem('manual_login_redirect') === 'true';
    
    if (hasManualRedirect) {
      console.log('Dashboard: Detected manual redirect from login page');
      
      // Clear the flag to prevent it from affecting future navigations
      sessionStorage.removeItem('manual_login_redirect');
      
      // No need to check auth state - login page already verified authentication
      return;
    }
    
    // Check for fresh_login parameters which indicate we just came from login
    const url = typeof window !== 'undefined' ? new URL(window.location.href) : null;
    const hasFreshLogin = url?.searchParams.get('fresh_login') === 'true';
    
    if (hasFreshLogin) {
      console.log('Dashboard: Detected a fresh login redirect');
      
      // Clean up URL parameters
      if (url) {
        url.searchParams.delete('fresh_login');
        url.searchParams.delete('t');
        window.history.replaceState({}, document.title, url.toString());
      }
      
      // If we have a fresh login but no user data yet, wait a moment for UserContext to initialize
      if (!user && !isLoading) {
        console.log('Dashboard: Fresh login detected but no user data yet. Forcing context refresh.');
        
        // Force a reload if we don't get user data within 2 seconds
        const forceReloadTimer = setTimeout(() => {
          console.log('Dashboard: Still no user data after timeout. Forcing page reload.');
          window.location.reload();
        }, 2000);
        
        return () => {
          clearTimeout(forceReloadTimer);
        };
      }
    }

    // Check for auth_success parameter passed by middleware
    const authSuccess = url?.searchParams.get('auth_success') === 'true';
    
    if (authSuccess) {
      // Clean up the URL by removing the auth_success parameter
      if (url) {
        url.searchParams.delete('auth_success');
        window.history.replaceState({}, document.title, url.toString());
      }
      console.log('Dashboard: Detected successful auth redirect from middleware');
    }
  }, [user, isLoading]);

  // After the component has rendered, log the loading state only once initially
  useEffect(() => {
    console.log(`Dashboard: Initial render complete - isLoading: ${isLoading}, user: ${user ? 'present' : 'null'}`);
  }, []); // Empty dependency array = run once

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // If not authenticated, show a message instead of null
  if (!user) {
    // Check if we have a URL parameter indicating a recent redirect from middleware
    const url = typeof window !== 'undefined' ? new URL(window.location.href) : null;
    const hasAuthSuccess = url?.searchParams.get('auth_success') === 'true';
    
    if (hasAuthSuccess) {
      // If middleware redirected us here, show a loading message instead of an error
      return (
        <div className="container mx-auto p-8 text-center">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Session is loading. Please wait...
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mx-auto"></div>
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="container mx-auto p-8 text-center">
        <p>Authentication check failed. Redirecting to login...</p>
      </div>
    );
  }
  
  // At this point, we know user is not null, so we can safely use it
  
  // Check if the user is a seller (using is_seller flag first, then fallbacks)
  const isSeller = 
    (user.is_seller === true) || // Check is_seller flag first
    (user.seller_profile !== null && user.seller_profile !== undefined) || 
    (user.email && user.email.includes('seller')); // Fallback for demo accounts

  console.log('Dashboard: User object', user);
  console.log('Dashboard: Detected as seller?', isSeller, 'From is_seller flag?', user.is_seller === true);

  // Create a temporary seller_profile if needed
  if (isSeller && !user.seller_profile && user.email) {
    console.log('Creating temporary seller_profile based on email:', user.email);
    (user as any).seller_profile = {
      user_id: user.id,
      store_name: `${user.email.split('@')[0]}'s Store`,
      is_verified: false,
      created_at: new Date().toISOString(),
    };
  }

  // Determine username to display - handle different user object structures safely
  // Use a type guard to safely access username if it exists
  const displayName = 
    (user as any).username || // Cast to any to handle custom user data
    (user.email ? user.email.split('@')[0] : 'User'); // fallback to first part of email or just 'User'

  // Mock orders data
  const orders = [
    {
      id: "ORD12345",
      date: "March 10, 2025",
      total: 64.98,
      status: "Delivered",
      items: [
        {
          id: 1,
          title: "Abbey Road",
          artist: "The Beatles",
          price: 29.99,
          image: "https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg",
        },
        {
          id: 5,
          title: "Kind of Blue",
          artist: "Miles Davis",
          price: 34.99,
          image: "https://upload.wikimedia.org/wikipedia/en/9/9c/MilesDavisKindofBlue.jpg",
        },
      ],
    },
    {
      id: "ORD12346",
      date: "February 25, 2025",
      total: 28.99,
      status: "Delivered",
      items: [
        {
          id: 7,
          title: "The Chronic",
          artist: "Dr. Dre",
          price: 28.99,
          image: "https://upload.wikimedia.org/wikipedia/en/1/19/Dr.DreTheChronic.jpg",
        },
      ],
    },
  ];

  // Mock listings data (for sellers)
  const listings = [
    {
      id: 101,
      title: "Nevermind",
      artist: "Nirvana",
      price: 26.99,
      image: "https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg",
      status: "Available",
      createdAt: "March 5, 2025",
    },
    {
      id: 102,
      title: "Exile on Main St.",
      artist: "The Rolling Stones",
      price: 31.99,
      image: "https://upload.wikimedia.org/wikipedia/en/c/ca/ExileMainSt.jpg",
      status: "Available",
      createdAt: "March 1, 2025",
    },
    {
      id: 103,
      title: "Back to Black",
      artist: "Amy Winehouse",
      price: 24.99,
      image: "https://upload.wikimedia.org/wikipedia/en/6/67/Amy_Winehouse_-_Back_to_Black_%28album%29.png",
      status: "Sold",
      createdAt: "February 18, 2025",
    },
  ];

  // Mock seller stats
  const sellerStats = {
    totalSales: 1249.98,
    totalOrders: 34,
    averageRating: 4.8,
    pendingOrders: 2,
    completedOrders: 32,
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2 dark:text-white transition-colors duration-300">
        {isSeller ? 'Seller Dashboard' : 'Your Dashboard'}
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 transition-colors duration-300">
        {isSeller 
          ? 'Manage your listings, track sales, and grow your business' 
          : 'Track your orders, wishlists, and account information'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300">
            <div className="text-center mb-4">
              <div className="inline-block bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full mb-4 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{displayName}</h2>
              <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">{user.email}</p>
              {isSeller && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 transition-colors duration-300">
                    Verified Seller
                  </span>
                </div>
              )}
            </div>
            
            <hr className="my-4 border-gray-200 dark:border-gray-700 transition-colors duration-300" />
            
            <nav className="space-y-2">
              <Link href="/dashboard" 
                className="block px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-medium transition-colors duration-300">
                Dashboard
              </Link>
              <Link href="/user/orders" 
                className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                Orders
              </Link>
              <Link href="/user/profile" 
                className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                Profile
              </Link>
              
              {isSeller && (
                <>
                  <hr className="my-4 border-gray-200 dark:border-gray-700 transition-colors duration-300" />
                  <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider transition-colors duration-300">
                    Seller Tools
                  </h3>
                  <Link href="/dashboard/listings" 
                    className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                    Manage Listings
                  </Link>
                  <Link href="/dashboard/sales" 
                    className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                    Sales Analytics
                  </Link>
                </>
              )}
            </nav>
          </div>
          
          {/* Quick Stats Card */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">Quick Stats</h2>
            <div className="space-y-4">
              {isSeller ? (
                <>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Total Sales</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">${sellerStats.totalSales.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Orders Completed</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{sellerStats.completedOrders}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Average Rating</p>
                    <div className="flex items-center">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mr-2 transition-colors duration-300">{sellerStats.averageRating}</p>
                      <div className="flex text-yellow-400">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{orders.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Wishlist Items</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">6</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Account Since</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">March 2025</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-9">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md transition-colors duration-300">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                {isSeller ? 'Seller Overview' : 'Recent Orders'}
              </h2>
            </div>
            
            <div className="p-6">
              {isSeller ? (
                // Seller Dashboard Content
                <div className="space-y-8">
                  {/* Sales Overview */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">Sales Overview</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg transition-colors duration-300">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800 rounded-full p-3 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 dark:text-blue-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Revenue</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">${sellerStats.totalSales.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg transition-colors duration-300">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-100 dark:bg-green-800 rounded-full p-3 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Completed Orders</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">{sellerStats.completedOrders}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg transition-colors duration-300">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-800 rounded-full p-3 transition-colors duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600 dark:text-amber-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Pending Orders</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300">{sellerStats.pendingOrders}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Active Listings */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">Active Listings</h3>
                      <Link href="/dashboard/listings" className="text-sm text-primary hover:underline transition-colors duration-300">View All</Link>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {listings.filter(l => l.status === 'Available').map(listing => (
                        <div key={listing.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors duration-300">
                          <div className="aspect-square relative">
                            <Image
                              src={listing.image}
                              alt={listing.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{listing.title}</h4>
                            <p className="text-gray-500 dark:text-gray-400 text-sm transition-colors duration-300">{listing.artist}</p>
                            <div className="flex justify-between items-center mt-2">
                              <p className="font-bold text-gray-900 dark:text-white transition-colors duration-300">${listing.price}</p>
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 transition-colors duration-300">Listed {listing.createdAt}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Recent Sales */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">Recent Sales</h3>
                      <Link href="/dashboard/sales" className="text-sm text-primary hover:underline transition-colors duration-300">View All</Link>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                        <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Order ID</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Date</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Status</th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                          <tr>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">#1234</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">May 15, 2023</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">$245.99</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">#1233</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">May 8, 2023</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Shipped</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">$119.50</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">#1232</td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Apr 29, 2023</td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Delivered</span>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">$78.25</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                // Regular User Dashboard Content
                <div className="space-y-8">
                  {/* Recent Orders */}
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-colors duration-300">
                          <div className="p-4 bg-gray-50 dark:bg-gray-700 flex justify-between items-center border-b border-gray-200 dark:border-gray-600 transition-colors duration-300">
                            <div>
                              <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">Order #{order.id}</h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{order.date}</p>
                            </div>
                            <div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100 transition-colors duration-300">
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="space-y-3">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center">
                                  <div className="h-16 w-16 relative flex-shrink-0">
                                    <Image
                                      src={item.image}
                                      alt={item.title}
                                      fill
                                      className="object-cover rounded"
                                    />
                                  </div>
                                  <div className="ml-4 flex-grow">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{item.title}</h4>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{item.artist}</p>
                                  </div>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">
                                    ${item.price.toFixed(2)}
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between transition-colors duration-300">
                              <span className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Total</span>
                              <span className="text-base font-bold text-gray-900 dark:text-white transition-colors duration-300">${order.total.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <Link 
                        href="/user/orders" 
                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none transition-colors duration-300"
                      >
                        View All Orders
                      </Link>
                    </div>
                  </div>
                  
                  {/* Recently Viewed */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">Recently Viewed</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors duration-300">
                        <div className="aspect-square bg-gray-200 dark:bg-gray-600 rounded-md mb-2 transition-colors duration-300"></div>
                        <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">Tame Impala - Currents</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">$29.99</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors duration-300">
                        <div className="aspect-square bg-gray-200 dark:bg-gray-600 rounded-md mb-2 transition-colors duration-300"></div>
                        <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">The Strokes - The New Abnormal</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">$24.99</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors duration-300">
                        <div className="aspect-square bg-gray-200 dark:bg-gray-600 rounded-md mb-2 transition-colors duration-300"></div>
                        <h3 className="font-medium text-gray-900 dark:text-white transition-colors duration-300">Kendrick Lamar - To Pimp A Butterfly</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">$27.99</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
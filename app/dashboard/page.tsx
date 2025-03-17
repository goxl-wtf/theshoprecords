import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Dashboard() {
  // Mock user data - in a real app, this would be fetched from an API or Supabase
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    createdAt: "January 2025",
    type: "Seller",
  };

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
      price: 29.99,
      image: "https://upload.wikimedia.org/wikipedia/en/c/ca/ExileMainSt.jpg",
      status: "Available",
      createdAt: "March 8, 2025",
    },
    {
      id: 103,
      title: "London Calling",
      artist: "The Clash",
      price: 32.99,
      image: "https://upload.wikimedia.org/wikipedia/en/0/00/TheClashLondonCallingalbumcover.jpg",
      status: "Sold",
      createdAt: "February 15, 2025",
    },
  ];

  return (
    <div className="container-custom py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors duration-300">
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full bg-gray-200 dark:bg-gray-700 mr-4 overflow-hidden transition-colors duration-300">
                  {/* Profile Image Placeholder */}
                  <div className="h-full w-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">John Doe</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Joined April 2023</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                <Link href="/dashboard" className="block px-4 py-2 rounded-md bg-primary text-white font-medium transition-colors duration-300">
                  Dashboard
                </Link>
                <Link href="/dashboard/orders" className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                  Orders
                </Link>
                <Link href="/dashboard/wishlist" className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                  Wishlist
                </Link>
                <Link href="/dashboard/settings" className="block px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                  Account Settings
                </Link>
                <button className="w-full text-left px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300">
                  Sign Out
                </button>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden transition-colors duration-300">
            <div className="border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <div className="px-6 py-4">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-300">Dashboard</h1>
              </div>
            </div>
            
            <div className="p-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors duration-300">
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Orders</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">5</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors duration-300">
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Wishlist Items</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">12</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 transition-colors duration-300">
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Reviews</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">3</p>
                </div>
              </div>
              
              {/* Recent Orders */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4 transition-colors duration-300">Recent Orders</h2>
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 transition-colors duration-300">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                    <thead className="bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Order ID</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Date</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Status</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider transition-colors duration-300">Total</th>
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
                <div className="mt-4 text-right">
                  <Link href="/dashboard/orders" className="text-primary hover:underline font-medium text-sm transition-colors duration-300">
                    View all orders →
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
          </div>
        </div>
      </div>
    </div>
  );
} 
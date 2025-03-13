import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MainLayout from '@/components/layouts/MainLayout';

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
    <MainLayout>
      <div className="container-custom py-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white transition-colors duration-300">Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
              <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white transition-colors duration-300">Account Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Name</p>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Email</p>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Member Since</p>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{user.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">Account Type</p>
                  <p className="font-medium text-gray-900 dark:text-white transition-colors duration-300">{user.type}</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <h3 className="text-sm font-medium mb-2 text-gray-900 dark:text-white transition-colors duration-300">Quick Actions</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/dashboard/profile" className="text-primary hover:underline">
                      Edit Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/change-password" className="text-primary hover:underline">
                      Change Password
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/addresses" className="text-primary hover:underline">
                      Manage Addresses
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Orders Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-300">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">Recent Orders</h2>
                <Link href="/dashboard/orders" className="text-primary hover:underline text-sm">
                  View All Orders
                </Link>
              </div>
              {orders.length > 0 ? (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 transition-colors duration-300">
                      <div className="flex justify-between items-center mb-3">
                        <div>
                          <span className="font-medium text-gray-900 dark:text-white transition-colors duration-300">Order #{order.id}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-sm ml-4 transition-colors duration-300">{order.date}</span>
                        </div>
                        <div>
                          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 rounded-full text-xs font-medium transition-colors duration-300">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 mb-3">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center">
                            <div className="w-12 h-12 overflow-hidden rounded">
                              <Image
                                src={item.image}
                                alt={`${item.title} by ${item.artist}`}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{item.title}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{item.artist}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="font-bold text-gray-900 dark:text-white transition-colors duration-300">Total: ${order.total.toFixed(2)}</p>
                        <Link
                          href={`/dashboard/orders/${order.id}`}
                          className="text-sm text-primary hover:underline"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 transition-colors duration-300">You have no orders yet.</p>
              )}
            </div>

            {/* Seller Listings Section (only for sellers) */}
            {user.type === "Seller" && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white transition-colors duration-300">Your Listings</h2>
                  <div className="flex space-x-3">
                    <Link
                      href="/dashboard/listings/new"
                      className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm transition-colors duration-300"
                    >
                      Add New Listing
                    </Link>
                    <Link
                      href="/dashboard/listings"
                      className="text-primary hover:underline text-sm flex items-center"
                    >
                      View All
                    </Link>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="text-left bg-gray-50 dark:bg-gray-700 transition-colors duration-300">
                      <tr>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors duration-300">Record</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors duration-300">Price</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors duration-300">Status</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors duration-300">Listed On</th>
                        <th className="px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-300 transition-colors duration-300"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
                      {listings.map((listing) => (
                        <tr key={listing.id} className="transition-colors duration-300">
                          <td className="px-4 py-4">
                            <div className="flex items-center">
                              <div className="w-10 h-10 overflow-hidden rounded">
                                <Image
                                  src={listing.image}
                                  alt={`${listing.title} by ${listing.artist}`}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900 dark:text-white transition-colors duration-300">{listing.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors duration-300">{listing.artist}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 dark:text-white transition-colors duration-300">${listing.price.toFixed(2)}</td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
                                listing.status === "Available"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {listing.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{listing.createdAt}</td>
                          <td className="px-4 py-4 text-right text-sm">
                            <Link
                              href={`/dashboard/listings/${listing.id}`}
                              className="text-primary hover:underline"
                            >
                              Edit
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 
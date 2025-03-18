'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';

interface NavItem {
  name: string;
  href: string;
  description: string;
  icon: React.ReactNode;
}

const UserDashboardNav = () => {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const [mounted, setMounted] = useState(false);

  // Ensure we only render the correct menu items after client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything during SSR
  if (!mounted) {
    return null;
  }

  // Don't render for logged out users
  if (!user && !loading) {
    return null;
  }

  const navItems: NavItem[] = [
    {
      name: 'Profile',
      href: '/user/profile',
      description: 'Manage your account details',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'Orders',
      href: '/user/orders',
      description: 'View your order history',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'Wishlist',
      href: '/user/wishlist',
      description: 'Your saved items',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
        <div className="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="animate-pulse h-24 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden mb-6 transition-colors duration-300">
      <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Account Dashboard</h2>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                  isActive ? 'bg-gray-50 dark:bg-gray-700' : ''
                }`}
              >
                <div className={`mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  {item.icon}
                </div>
                <div>
                  <p className={`font-medium ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
                {isActive && (
                  <div className="ml-auto">
                    <span className="h-2 w-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                  </div>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserDashboardNav; 
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the main auth/login route
    router.replace('/auth/login');
  }, [router]);

  // Show a simple loading state while redirecting
  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 transition-colors duration-300">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Redirecting to login...
        </h1>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    </div>
  );
} 
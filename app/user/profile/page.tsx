'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function ProfilePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If user is not logged in and done loading, redirect to login
    if (!loading && !user) {
      router.push('/auth/login?redirect=/user/profile');
      return;
    }

    // Redirect to orders for now until we build the profile page
    router.push('/user/orders');
  }, [user, loading, router]);

  // Show loading indicator
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  );
} 
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function AccountPage() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push('/auth/login');
      } else if (user.seller_profile) {
        // User has a seller profile, redirect to dashboard
        router.push('/dashboard');
      } else {
        // Regular user, redirect to profile
        router.push('/user/profile');
      }
    }
  }, [user, isLoading, router]);

  // Show loading state while checking auth and redirecting
  return (
    <div className="container mx-auto p-8 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
        <p className="mt-4 text-lg">Redirecting to your account...</p>
      </div>
    </div>
  );
} 
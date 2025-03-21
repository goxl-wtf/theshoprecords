'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSupabase } from '@/utils/supabaseClient';
import { Spinner } from '../ui/Spinner';

interface AuthCheckProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

export default function AuthCheck({ 
  children, 
  requiredRole,
  redirectTo = '/auth/login'
}: AuthCheckProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabase();
      
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking auth:', error);
          router.push(redirectTo);
          return;
        }
        
        if (!session) {
          // No active session, redirect to login
          router.push(redirectTo);
          return;
        }
        
        // If role is required, check user's role
        if (requiredRole) {
          // Here you would check if the user has the required role
          // This is a simplified example - you'll need to implement role checking
          // based on your application's role management system
          const { data: user, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();
            
          if (userError || !user || user.role !== requiredRole) {
            console.error('User does not have required role');
            router.push(redirectTo);
            return;
          }
        }
        
        // User is authorized
        setIsAuthorized(true);
      } catch (err) {
        console.error('Error in auth check:', err);
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router, redirectTo, requiredRole]);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
        <span className="ml-2">Checking authentication...</span>
      </div>
    );
  }
  
  if (!isAuthorized) {
    return null; // Will redirect, but just in case
  }
  
  return <>{children}</>;
} 
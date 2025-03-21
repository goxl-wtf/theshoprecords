'use client';

import { useState, useTransition, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/context/UserContext';

// Loading component
function LoginLoading() {
  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mb-6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  );
}

// The actual login component that uses useSearchParams
function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPending, startTransition] = useTransition();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { signIn } = useUser();
  const router = useRouter();

  const handleAuthSubmit = async (formData: FormData) => {
    setLoginError(null);
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const redirectTo = formData.get('redirectTo') as string || '/dashboard';
    
    try {
      console.log('[LoginPage] Submitting login form:', email);
      const result = await signIn(email, password);
      
      if (result.success) {
        console.log('[LoginPage] Login successful:', email);
        setLoginSuccess(true);
        
        // Set flag in sessionStorage to ensure we can detect an active login on other pages
        sessionStorage.setItem('manual_login_redirect', 'true'); 
        
        // Handle redirect with timer
        startTransition(() => {
          // Delay redirect slightly to ensure the server has time to set cookies
          setTimeout(() => {
            // Write log and force navigation - use complete URL to bypass all client-side routing
            console.log(`[LoginPage] Forcing direct navigation to: ${window.location.origin}${redirectTo}`);
            window.location.href = `${window.location.origin}${redirectTo}`;
          }, 1000);
        });
      } else {
        console.error('[LoginPage] Login failed:', result.error?.message);
        setLoginError(result.error?.message || 'Invalid login credentials');
      }
    } catch (err) {
      console.error('[LoginPage] Login error:', err);
      setLoginError('An unexpected error occurred');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Login to Your Account</h1>
      
      {loginSuccess && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded mb-4">
          Login successful! Redirecting to your account...
        </div>
      )}
      
      {loginError && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4">
          {loginError}
        </div>
      )}
      
      <form action={handleAuthSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded focus:outline-none focus:border-primary dark:text-white"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded focus:outline-none focus:border-primary dark:text-white"
            required
          />
        </div>
        
        {/* Hidden redirect field */}
        <input 
          type="hidden" 
          name="redirectTo" 
          value={typeof window !== 'undefined' ? 
            new URLSearchParams(window.location.search).get('redirect') || '/dashboard' : 
            '/dashboard'
          }
        />
        
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-200"
          disabled={isPending}
          aria-disabled={isPending}
        >
          {isPending ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div className="mt-4 text-center text-gray-700 dark:text-gray-300">
        <p>Don&apos;t have an account? <Link href="/auth/register" className="text-primary hover:underline">Register</Link></p>
      </div>
      
      <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
        <h3 className="font-bold mb-2 dark:text-white">Demo Accounts:</h3>
        <p className="text-sm mb-1 dark:text-gray-300"><strong>Regular User:</strong> user@test.nl / password</p>
        <p className="text-sm mb-1 dark:text-gray-300"><strong>Seller:</strong> seller@test.nl / password</p>
        <p className="text-sm dark:text-gray-300"><strong>Test User:</strong> test@example.com / password</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          These accounts are for testing purposes only. In demo mode, <strong>any password</strong> will work.
        </p>
      </div>
    </div>
  );
}

// Export the login page with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginContent />
    </Suspense>
  );
} 
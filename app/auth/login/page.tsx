'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/app/context/UserContext';

// Loading component to display during suspense
function LoginLoading() {
  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}

// The actual login component that uses useSearchParams
function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, signIn, loading: userLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  // Redirect if user is already logged in
  useEffect(() => {
    if (user && !userLoading) {
      router.push(redirectUrl);
    }
  }, [user, userLoading, router, redirectUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Since this is a demo app and we don't have a real auth system,
      // we'll just use a predefined user for testing
      if (email === 'test@example.com' && password === 'password') {
        // Simulate successful login
        // In a real app, this would be a call to your auth system
        const { success, error } = await signIn(email, password);
        
        if (success) {
          // Redirect to the requested page or home
          router.push(redirectUrl);
        } else {
          setError(error?.message || 'An error occurred during sign in');
        }
      } else {
        // Show an error for incorrect credentials
        setError('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If still checking auth status, show loading
  if (userLoading) {
    return (
      <div className="container mx-auto max-w-md px-4 py-16">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Don't show login form if already logged in
  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-16">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 transition-colors duration-300">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
          Log In to Your Account
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded mb-6">
          <p className="text-sm font-medium">Demo Login</p>
          <p className="text-sm">Email: test@example.com</p>
          <p className="text-sm">Password: password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors duration-300"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-300 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link
              href="/auth/register"
              className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
            >
              Register
            </Link>
          </p>
        </div>
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
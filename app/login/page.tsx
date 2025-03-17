import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
  return (
    <div className="container-custom py-10">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white transition-colors duration-300">Sign in to your account</h1>
          
          {/* Login Form */}
          <form className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Email address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-dark-200 dark:border-dark-100 dark:text-light-100 transition-colors duration-300"
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            {/* Password */}
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-dark-200 dark:border-dark-100 dark:text-light-100 transition-colors duration-300"
                placeholder="••••••••"
                required
              />
            </div>
            
            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot password?
              </a>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
            >
              Sign in
            </button>
          </form>
          
          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow border-t border-gray-300 dark:border-dark-100"></div>
            <span className="flex-shrink mx-4 text-gray-600 dark:text-gray-400 text-sm">Or continue with</span>
            <div className="flex-grow border-t border-gray-300 dark:border-dark-100"></div>
          </div>
          
          {/* Social login buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              className="py-2 px-4 border border-gray-300 dark:border-dark-100 rounded-md hover:bg-gray-50 dark:hover:bg-dark-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
            >
              <div className="flex justify-center">
                <Image src="/images/social/google.svg" alt="Google" width={20} height={20} />
              </div>
            </button>
            <button
              type="button"
              className="py-2 px-4 border border-gray-300 dark:border-dark-100 rounded-md hover:bg-gray-50 dark:hover:bg-dark-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
            >
              <div className="flex justify-center">
                <Image src="/images/social/facebook.svg" alt="Facebook" width={20} height={20} />
              </div>
            </button>
            <button
              type="button"
              className="py-2 px-4 border border-gray-300 dark:border-dark-100 rounded-md hover:bg-gray-50 dark:hover:bg-dark-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
            >
              <div className="flex justify-center">
                <Image src="/images/social/apple.svg" alt="Apple" width={20} height={20} />
              </div>
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-dark-200 border-t border-gray-200 dark:border-dark-100 transition-colors duration-300">
          <p className="text-sm text-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 
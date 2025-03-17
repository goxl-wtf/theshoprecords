import React from 'react';
import Link from 'next/link';

export default function Register() {
  return (
    <div className="container-custom py-10">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-300">
        <div className="px-6 py-8">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white transition-colors duration-300">Create an account</h1>
          
          {/* Registration Form */}
          <form className="space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Full name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-dark-200 dark:border-dark-100 dark:text-light-100 transition-colors duration-300"
                placeholder="John Doe"
                required
              />
            </div>
            
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
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Must be at least 8 characters long and contain a mix of letters, numbers, and special characters.
              </p>
            </div>
            
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Confirm password
              </label>
              <input
                type="password"
                id="confirm-password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-dark-200 dark:border-dark-100 dark:text-light-100 transition-colors duration-300"
                placeholder="••••••••"
                required
              />
            </div>
            
            {/* Account Type */}
            <div>
              <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors duration-300">
                Account type
              </span>
              <div className="flex gap-4">
                <div className="flex items-center">
                  <input
                    id="buyer"
                    name="account-type"
                    type="radio"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    defaultChecked
                  />
                  <label htmlFor="buyer" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Buyer
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="seller"
                    name="account-type"
                    type="radio"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  />
                  <label htmlFor="seller" className="ml-2 block text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    Seller
                  </label>
                </div>
              </div>
            </div>
            
            {/* Terms and Conditions */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-700 dark:text-gray-300 transition-colors duration-300">
                  I agree to the{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>
            
            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
            >
              Create account
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-dark-200 border-t border-gray-200 dark:border-dark-100 transition-colors duration-300">
          <p className="text-sm text-center text-gray-700 dark:text-gray-300 transition-colors duration-300">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 
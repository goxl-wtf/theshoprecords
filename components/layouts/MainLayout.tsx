"use client";

import React, { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import Header from './Header';
import Footer from './Footer';

type MainLayoutProps = {
  children: ReactNode;
};

// Custom fallback component for layout errors
const LayoutErrorFallback = ({ error }: { error: Error }) => (
  <div className="p-8 text-center bg-white dark:bg-gray-800 text-gray-800 dark:text-white">
    <h1 className="text-red-600 mb-4 text-2xl font-bold">Layout Error</h1>
    <p>An error occurred in the main layout:</p>
    <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-left mt-4 overflow-auto text-sm">
      {error.message}
    </pre>
  </div>
);

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <ErrorBoundary FallbackComponent={LayoutErrorFallback}>
      <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
};

export default MainLayout; 
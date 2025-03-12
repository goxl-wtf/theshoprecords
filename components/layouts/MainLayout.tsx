"use client";

import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

type MainLayoutProps = {
  children: ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
  try {
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-black text-gray-800 dark:text-white transition-colors duration-300">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    );
  } catch (error) {
    console.error('Error in MainLayout:', error);
    return (
      <div className="p-8 text-center bg-white dark:bg-dark-300 text-gray-800 dark:text-white">
        <h1 className="text-red-600 mb-4 text-2xl font-bold">Layout Error</h1>
        <p>An error occurred in the main layout:</p>
        <pre className="bg-gray-100 dark:bg-dark-200 p-4 rounded-lg text-left mt-4 overflow-auto text-sm">
          {error?.toString()}
        </pre>
      </div>
    );
  }
};

export default MainLayout; 
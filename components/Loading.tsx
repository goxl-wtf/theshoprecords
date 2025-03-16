import React from 'react';

const Loading = () => {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg text-gray-700 dark:text-gray-300">Loading products...</p>
    </div>
  );
};

export default Loading; 
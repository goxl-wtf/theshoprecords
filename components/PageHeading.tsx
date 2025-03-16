import React from 'react';

interface PageHeadingProps {
  title: string;
  subtitle?: string;
}

const PageHeading: React.FC<PageHeadingProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-light-100 mb-2">{title}</h1>
      {subtitle && <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>}
    </div>
  );
};

export default PageHeading; 
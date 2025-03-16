'use client';

import React from 'react';
import { cn } from '../../utils/classNames';

interface StatCardProps {
  value: string | number;
  label: string;
  color?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ value, label, color, className }) => {
  return (
    <div className={cn("px-6 text-center", className)}>
      <p className={cn(
        "text-2xl md:text-4xl font-bold text-gray-800 dark:text-white transition-colors duration-300",
        color
      )}>
        {value}
      </p>
      <p className="text-gray-600 dark:text-gray-400 mt-2 transition-colors duration-300">
        {label}
      </p>
    </div>
  );
};

export default StatCard; 
'use client';

import React, { useState } from 'react';

export type PeriodType = 'week' | 'month' | 'quarter' | 'year' | 'custom';

interface PeriodSelectorProps {
  onPeriodChange: (period: PeriodType, customRange?: { startDate: string; endDate: string }) => void;
  defaultPeriod?: PeriodType;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ 
  onPeriodChange, 
  defaultPeriod = 'month' 
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>(defaultPeriod);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showCustomRange, setShowCustomRange] = useState<boolean>(defaultPeriod === 'custom');
  
  // Format date for input field default
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Get default start date (1 month ago)
  const getDefaultStartDate = () => {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Handle period button click
  const handlePeriodClick = (period: PeriodType) => {
    setSelectedPeriod(period);
    
    if (period === 'custom') {
      setShowCustomRange(true);
      
      // Set default date range to last 30 days if not already set
      if (!startDate) {
        setStartDate(getDefaultStartDate());
      }
      if (!endDate) {
        setEndDate(getTodayDateString());
      }
      
      // Only trigger onChange if we have both dates
      if (startDate && endDate) {
        onPeriodChange(period, { startDate, endDate });
      }
    } else {
      setShowCustomRange(false);
      onPeriodChange(period);
    }
  };
  
  // Handle custom date range changes
  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
      
      // Update period if both dates are valid
      if (value && endDate) {
        onPeriodChange('custom', { startDate: value, endDate });
      }
    } else {
      setEndDate(value);
      
      // Update period if both dates are valid
      if (startDate && value) {
        onPeriodChange('custom', { startDate, endDate: value });
      }
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            selectedPeriod === 'week'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => handlePeriodClick('week')}
        >
          Week
        </button>
        
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            selectedPeriod === 'month'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => handlePeriodClick('month')}
        >
          Month
        </button>
        
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            selectedPeriod === 'quarter'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => handlePeriodClick('quarter')}
        >
          Quarter
        </button>
        
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            selectedPeriod === 'year'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => handlePeriodClick('year')}
        >
          Year
        </button>
        
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
            selectedPeriod === 'custom'
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
          onClick={() => handlePeriodClick('custom')}
        >
          Custom
        </button>
      </div>
      
      {showCustomRange && (
        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange('start', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              max={endDate || getTodayDateString()}
            />
          </div>
          
          <div className="flex flex-col">
            <label className="text-sm text-gray-500 dark:text-gray-400 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleDateChange('end', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              min={startDate}
              max={getTodayDateString()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PeriodSelector; 
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

export interface ToastProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  message: string;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  type = 'info',
  message,
  onClose,
  duration = 3000,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  const getIconColor = () => {
    switch (type) {
      case 'success': return 'text-green-500';
      case 'error': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-blue-500';
    }
  };
  
  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20';
      case 'error': return 'bg-red-50 dark:bg-red-900/20';
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20';
      default: return 'bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300); // Wait for animation to complete
  }, [onClose]);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, handleClose]);
  
  if (!isVisible && !message) return null;
  
  return (
    <div 
      className={`fixed bottom-4 right-4 p-4 rounded-md shadow-md max-w-md
        ${getBackgroundColor()}
        flex items-center gap-2
        ${isVisible ? 'animate-slide-in-right' : 'animate-slide-out-right'}
        transition-all duration-300
        z-50`}
    >
      <div className={`flex-shrink-0 ${getIconColor()}`}>
        {/* Icon based on type */}
        {type === 'success' && (
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        )}
        {type === 'error' && (
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
        )}
        {type === 'warning' && (
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        )}
        {type === 'info' && (
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
        )}
      </div>
      
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {message}
        </p>
      </div>
      
      <button
        onClick={handleClose}
        className="ml-auto flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default Toast; 
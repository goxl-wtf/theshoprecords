"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast, { ToastProps } from '@/components/ui/Toast';

interface ToastContextType {
  showToast: (message: string, type: ToastProps['type'], duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastItem extends ToastProps {
  id: number;
}

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [nextId, setNextId] = useState(1);

  const showToast = (message: string, type: ToastProps['type'] = 'info', duration = 3000) => {
    const id = nextId;
    setNextId(prev => prev + 1);
    
    setToasts(prevToasts => [
      ...prevToasts,
      {
        id,
        message,
        type,
        duration,
        onClose: () => handleClose(id),
      },
    ]);
  };

  const handleClose = (id: number) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => handleClose(toast.id)}
        />
      ))}
    </ToastContext.Provider>
  );
};

export default ToastContext; 
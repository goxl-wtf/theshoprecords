'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/classNames';

// Define input variants using class-variance-authority
const inputVariants = cva(
  // Base styles applied to all input variants
  "flex w-full rounded-md border text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-200 focus-visible:ring-primary/20",
        outline: "border-gray-300 dark:border-gray-700 bg-transparent focus-visible:ring-primary/20",
        ghost: "border-transparent bg-gray-100 dark:bg-dark-300 hover:bg-gray-200 dark:hover:bg-dark-400 focus-visible:ring-primary/20",
        flush: "border-b border-l-0 border-r-0 border-t-0 rounded-none border-gray-300 dark:border-gray-700 px-0 focus-visible:ring-0 focus-visible:border-primary",
      },
      size: {
        sm: "h-8 px-3 py-1 text-xs",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-5 py-3 text-base",
      },
      hasError: {
        true: "border-red-500 text-red-600 focus-visible:ring-red-500/20 dark:border-red-400 dark:text-red-400",
      },
      hasIcon: {
        true: "pl-10", // Add padding for the icon
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      hasError: false,
      hasIcon: false,
    },
  }
);

// Input wrapper for icon positioning
const inputWrapperVariants = cva("relative flex items-center", {
  variants: {
    fullWidth: {
      true: "w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});

// Extend input props with our custom variants
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, // Omit HTML size to avoid conflicts
    VariantProps<typeof inputVariants> {
  icon?: React.ReactNode;
  error?: string;
  fullWidth?: boolean;
}

// Create the Input component with ref forwarding
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, hasError, hasIcon, icon, error, fullWidth = true, ...props }, ref) => {
    // If an icon is provided but hasIcon is not explicitly set to false, set it to true
    const effectiveHasIcon = hasIcon ?? (icon ? true : false);
    
    // If an error is provided but hasError is not explicitly set, set it to true
    const effectiveHasError = hasError ?? (error ? true : false);
    
    return (
      <div className="space-y-1">
        <div className={cn(inputWrapperVariants({ fullWidth }))}>
          {icon && (
            <div className="absolute left-3 flex h-full items-center text-gray-500 dark:text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              inputVariants({
                variant,
                size,
                hasError: effectiveHasError,
                hasIcon: effectiveHasIcon,
                className,
              })
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, inputVariants }; 
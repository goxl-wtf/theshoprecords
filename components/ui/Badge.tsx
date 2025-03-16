'use client';

import React, { HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/classNames';

// Define badge variants using class-variance-authority
const badgeVariants = cva(
  // Base styles applied to all badge variants
  "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        primary: "bg-primary/10 text-primary dark:bg-primary/20",
        secondary: "bg-secondary/10 text-secondary dark:bg-secondary/20",
        success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        outline: "border border-gray-200 text-gray-800 dark:border-gray-700 dark:text-gray-300",
      },
      size: {
        sm: "px-1.5 py-0 text-[10px]",
        md: "px-2.5 py-0.5 text-xs",
        lg: "px-3 py-1 text-sm",
      },
      withDot: {
        true: "pl-1.5", // Extra space on the left for the status dot
      },
      removable: {
        true: "pr-1", // Extra space on the right for the remove button
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      withDot: false,
      removable: false,
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  onRemove?: () => void;
  statusColor?: string; // For custom status dot color
}

const Badge = ({
  className,
  variant,
  size,
  withDot,
  removable,
  onRemove,
  statusColor,
  children,
  ...props
}: BadgeProps) => {
  return (
    <div 
      className={cn(badgeVariants({ variant, size, withDot, removable }), className)}
      {...props}
    >
      {withDot && (
        <span 
          className={cn(
            "mr-1 h-1.5 w-1.5 shrink-0 rounded-full", 
            statusColor || (
              variant === 'success' ? "bg-green-500" :
              variant === 'warning' ? "bg-yellow-500" :
              variant === 'danger' ? "bg-red-500" :
              variant === 'info' ? "bg-blue-500" :
              variant === 'primary' ? "bg-primary" :
              variant === 'secondary' ? "bg-secondary" :
              "bg-gray-500"
            )
          )} 
        />
      )}
      
      {children}
      
      {removable && onRemove && (
        <button
          type="button"
          className="ml-1 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 focus:outline-none"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove badge"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-3 w-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export { Badge, badgeVariants }; 
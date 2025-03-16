'use client';

import React, { HTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/classNames';

// Define card variants using class-variance-authority
const cardVariants = cva(
  // Base styles applied to all card variants
  "rounded-lg overflow-hidden transition-all duration-300",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-dark-200 shadow-sm hover:shadow-md",
        outline: "bg-white dark:bg-dark-200 border border-gray-200 dark:border-gray-800 hover:shadow-md",
        ghost: "bg-transparent hover:bg-gray-50 dark:hover:bg-dark-300",
        elevated: "bg-white dark:bg-dark-200 shadow-md hover:shadow-lg transform hover:translate-y-[-2px]",
      },
      padding: {
        none: "",
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
    },
  }
);

// Card container props
interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  // Additional props can be added here
}

// Card header props
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

// Card content props
interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

// Card footer props
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {}

// Card component
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, padding, className }))}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

// Card header component
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mb-3 px-1", className)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = "CardHeader";

// Card content component
const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("px-1", className)}
        {...props}
      />
    );
  }
);
CardContent.displayName = "CardContent";

// Card footer component
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mt-3 px-1", className)}
        {...props}
      />
    );
  }
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter }; 
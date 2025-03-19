'use client';

import React, { HTMLAttributes, forwardRef } from 'react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '../../utils/classNames';

// Card container variant definition
const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        outlined: 'border border-gray-200 dark:border-gray-700 bg-transparent hover:border-gray-300 dark:hover:border-gray-600',
        elevated: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg',
        flat: 'border-none bg-gray-50 dark:bg-gray-900',
      },
      size: {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
      },
      hover: {
        true: 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
      },
      width: {
        auto: 'w-auto',
        full: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      hover: false,
      width: 'full',
    },
  }
);

interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

// Card component
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size, hover, width, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, size, hover, width, className }))}
        {...props}
      />
    );
  }
);
Card.displayName = 'Card';

// Card Header component
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5 pb-4', className)}
        {...props}
      />
    );
  }
);
CardHeader.displayName = 'CardHeader';

// Card Body component
const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ className, ...props }, ref) => {
    return <div ref={ref} className={cn('', className)} {...props} />;
  }
);
CardBody.displayName = 'CardBody';

// Card Footer component
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center pt-4', className)}
        {...props}
      />
    );
  }
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardBody, CardFooter }; 
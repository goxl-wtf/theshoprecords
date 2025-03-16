'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/classNames';
import { Spinner } from '../../components/ui/Spinner';

// Define button variants using class-variance-authority
const buttonVariants = cva(
  // Base styles applied to all button variants
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-secondary text-white hover:bg-secondary/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline focus-visible:ring-0",
        gradient: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg shadow transition-all duration-300",
      },
      size: {
        xs: "h-7 px-2 rounded-md text-xs",
        sm: "h-9 px-3 rounded-md",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-8 rounded-md",
        icon: "h-9 w-9",
      },
      rounded: {
        true: "rounded-full",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      rounded: false,
      fullWidth: false,
    },
  }
);

// Extend button props with our custom variants
export interface ButtonProps 
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Create the Button component with ref forwarding
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, rounded, fullWidth, isLoading = false, loadingText, leftIcon, rightIcon, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, rounded, fullWidth }), className)}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <span className="mr-2">
            <Spinner size={size === "xs" ? "xs" : "sm"} />
          </span>
        )}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {isLoading && loadingText ? loadingText : children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants }; 
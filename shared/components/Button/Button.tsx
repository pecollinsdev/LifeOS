import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

/**
 * Reusable button component with mobile-first design.
 * 
 * Optimized for touch interactions with appropriate sizing
 * and visual feedback for mobile devices.
 */
/**
 * Reusable button component with iOS-style design.
 * 
 * Features:
 * - iOS-style rounded corners (12px)
 * - Smooth spring-like transitions
 * - Subtle shadow on primary variant
 * - Touch-optimized with proper sizing
 * - Accessible focus states
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}) => {
  // iOS-style base classes with smooth transitions
  const baseClasses = 'font-semibold rounded-xl transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97] active:transition-transform active:duration-100';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white shadow-sm hover:bg-primary-700 hover:shadow-md focus:ring-primary-500 active:bg-primary-800 active:shadow-sm',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-400 active:bg-gray-300',
    outline: 'border-2 border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50 hover:border-primary-700 focus:ring-primary-500 active:bg-primary-100',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100',
  };

  const sizeClasses = {
    sm: 'px-4 py-2.5 text-sm min-h-[44px]',
    md: 'px-5 py-3 text-base min-h-[48px]',
    lg: 'px-6 py-4 text-lg min-h-[52px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};


import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Badge component with iOS-style design.
 * 
 * Features:
 * - iOS-style rounded corners (pill shape)
 * - Subtle background colors
 * - Proper font weights
 * - Mobile-optimized sizing
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-success-light text-success-dark',
    warning: 'bg-warning-light text-warning-dark',
    error: 'bg-error-light text-error-dark',
  };

  const sizeClasses = {
    sm: 'text-xs font-semibold px-2.5 py-1',
    md: 'text-sm font-semibold px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};


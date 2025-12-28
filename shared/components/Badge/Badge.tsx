import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

/**
 * Badge component for displaying counts, status, or labels.
 * 
 * Mobile-optimized with appropriate sizing for touch interfaces.
 * Used for stat indicators, status badges, and small labels.
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'sm',
  className = '',
}) => {
  const variantClasses = {
    primary: 'bg-primary-100 text-primary-700',
    secondary: 'bg-neutral-100 text-neutral-700',
    success: 'bg-success-light text-success-dark',
    warning: 'bg-warning-light text-warning-dark',
    error: 'bg-error-light text-error-dark',
  };

  const sizeClasses = {
    sm: 'text-sm font-medium px-2.5 py-0.5',
    md: 'text-base font-medium px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
};


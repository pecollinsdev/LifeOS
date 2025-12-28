import React from 'react';
import { Card } from '../Card';

export interface AlertProps {
  children: React.ReactNode;
  variant?: 'info' | 'error' | 'warning' | 'success';
  className?: string;
}

/**
 * Alert component for displaying messages, errors, and notifications.
 * 
 * Provides consistent styling for different alert types.
 * Mobile-optimized with appropriate spacing and contrast.
 */
export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  className = '',
}) => {
  const variantClasses = {
    info: 'bg-info-bg border-info-border text-info-text',
    error: 'bg-error-bg border-error-border text-error-text',
    warning: 'bg-warning-bg border-warning-border text-warning-text',
    success: 'bg-success-bg border-success-border text-success-text',
  };

  return (
    <Card className={`${variantClasses[variant]} ${className}`} padding="md">
      <div className="text-sm">{children}</div>
    </Card>
  );
};


import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Card component with iOS-style design.
 * 
 * Features:
 * - iOS-style rounded corners (16px)
 * - Subtle layered shadows
 * - Smooth transitions
 * - Touch-optimized interactions
 * - Generous padding options
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  padding = 'md',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  const interactiveClasses = onClick
    ? 'cursor-pointer active:scale-[0.98] transition-all duration-150 hover:shadow-md'
    : '';

  return (
    <div
      className={`bg-surface rounded-2xl shadow-sm border border-gray-200/60 ${paddingClasses[padding]} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};


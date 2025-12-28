import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

/**
 * Card component for containing content sections.
 * 
 * Mobile-optimized with touch-friendly interactions and
 * appropriate spacing for small screens.
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  padding = 'md',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const interactiveClasses = onClick
    ? 'cursor-pointer active:scale-[0.98] transition-transform'
    : '';

  return (
    <div
      className={`bg-surface rounded-xl shadow-sm border border-neutral-200 ${paddingClasses[padding]} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};


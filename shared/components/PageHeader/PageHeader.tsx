import React from 'react';
import Link from 'next/link';
import { Icon } from '../Icon';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backHref?: string;
  rightAction?: React.ReactNode;
  className?: string;
}

/**
 * PageHeader component with iOS-style design.
 * 
 * Features:
 * - Clean, minimal header design
 * - Smooth backdrop blur effect (iOS-style)
 * - Proper safe area support
 * - Touch-optimized navigation
 * - Consistent typography hierarchy
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  backHref = '/',
  rightAction,
  className = '',
}) => {
  return (
    <header className={`bg-surface/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-10 pt-safe-top ${className}`}>
      <div className="max-w-2xl mx-auto px-5 py-4 flex items-center gap-4">
        {showBack && (
          <Link
            href={backHref}
            className="p-2 -ml-2 text-gray-600 hover:text-gray-900 active:opacity-70 active:scale-95 transition-all duration-150 rounded-lg hover:bg-gray-100"
            aria-label="Go back"
          >
            <Icon name="chevron-left" size={24} />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-text-primary tracking-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm text-text-secondary mt-1 font-medium">{subtitle}</p>
          )}
        </div>
        {rightAction && <div className="flex-shrink-0">{rightAction}</div>}
      </div>
    </header>
  );
};


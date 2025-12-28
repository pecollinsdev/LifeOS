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
 * PageHeader component - Consistent header for all pages.
 * 
 * Mobile-optimized with safe area support and touch-friendly
 * navigation. Provides consistent spacing and typography.
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
    <header className={`bg-surface border-b border-neutral-200 sticky top-0 z-10 pt-safe-top ${className}`}>
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
        {showBack && (
          <Link
            href={backHref}
            className="p-2 -ml-2 text-neutral-600 hover:text-neutral-900 active:opacity-70 transition-opacity dark:text-neutral-400 dark:hover:text-neutral-100"
            aria-label="Go back"
          >
            <Icon name="chevron-left" size={24} />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{title}</h1>
          {subtitle && (
            <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-0.5">{subtitle}</p>
          )}
        </div>
        {rightAction && <div className="flex-shrink-0">{rightAction}</div>}
      </div>
    </header>
  );
};


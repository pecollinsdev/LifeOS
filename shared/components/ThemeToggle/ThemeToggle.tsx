'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';
import { Icon } from '../Icon';

/**
 * ThemeToggle component - Toggle between light and dark themes.
 * 
 * Mobile-optimized button that cycles through:
 * - System (follows OS preference)
 * - Light (manual override)
 * - Dark (manual override)
 * 
 * Placement: Typically in PageHeader rightAction slot.
 */
export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  const handleToggle = () => {
    // Cycle: system -> light -> dark -> system
    if (theme === 'system') {
      setTheme('light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };

  // Determine icon and label based on current state
  const getIcon = () => {
    if (theme === 'system') {
      // Show current resolved theme icon when on system
      return resolvedTheme === 'dark' ? 'moon' : 'sun';
    }
    return theme === 'dark' ? 'moon' : 'sun';
  };

  const getLabel = () => {
    if (theme === 'system') {
      return `System (${resolvedTheme})`;
    }
    return theme === 'dark' ? 'Dark mode' : 'Light mode';
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 active:opacity-70 transition-all focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 ${className}`}
      aria-label={getLabel()}
      title={getLabel()}
    >
      <Icon name={getIcon()} size={20} />
    </button>
  );
};


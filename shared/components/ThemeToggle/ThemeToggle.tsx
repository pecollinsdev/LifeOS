'use client';

import React from 'react';
import { useTheme } from '@/lib/theme';
import { Icon } from '../Icon';

/**
 * ThemeToggle component - iOS-style theme switcher.
 * 
 * Features:
 * - Simple light/dark toggle (no system option in UI)
 * - Automatically respects system preference on first load
 * - Manual toggle persists preference and overrides system
 * - iOS-style icon button design
 * - Smooth transitions
 * - Mobile-optimized touch target (44x44px minimum)
 * - Accessible with proper ARIA attributes
 * 
 * Placement: Typically in PageHeader rightAction slot.
 * 
 * Implementation:
 * - Uses sun icon for light mode, moon icon for dark mode
 * - Toggles between 'light' and 'dark' themes
 * - ThemeProvider handles system preference detection automatically
 */
export const ThemeToggle: React.FC<{ className?: string }> = ({ 
  className = ''
}) => {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';
  const iconName = isDark ? 'moon' : 'sun';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2.5 rounded-xl 
        text-text-secondary hover:text-text-primary hover:bg-surface-hover 
        active:scale-95 
        transition-all duration-150 
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
        min-w-[44px] min-h-[44px] 
        flex items-center justify-center
        ${className}
      `}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      type="button"
    >
      <Icon 
        name={iconName} 
        size={22}
        className="transition-transform duration-200"
      />
    </button>
  );
};


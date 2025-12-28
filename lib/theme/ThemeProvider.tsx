'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

/**
 * Theme type - simplified to just light and dark.
 * System preference is automatically detected on first load,
 * but user can manually override with light or dark.
 */
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'lifeos-theme';

/**
 * ThemeProvider - Manages theme state and applies it to the document.
 * 
 * Features:
 * - Automatically detects system preference on first load (iOS 'prefers-color-scheme')
 * - Allows manual override with light/dark toggle
 * - Persists user preference in localStorage
 * - Listens to system preference changes when no manual override is set
 * - Applies theme via data-theme attribute for CSS variable switching
 * - Prevents flash of wrong theme on page load
 * 
 * Implementation:
 * - Uses 'prefers-color-scheme' media query for system detection
 * - Stores 'light' or 'dark' in localStorage (null = use system)
 * - Applies theme immediately on mount to prevent FOUC
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme | null>(null); // null = use system
  const [mounted, setMounted] = useState(false);

  /**
   * Get system preference using prefers-color-scheme media query.
   * Returns 'dark' if system prefers dark, 'light' otherwise.
   */
  const getSystemTheme = useCallback((): Theme => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  /**
   * Get the effective theme (user preference or system preference).
   */
  const getEffectiveTheme = useCallback((): Theme => {
    return theme ?? getSystemTheme();
  }, [theme, getSystemTheme]);

  /**
   * Apply theme to document root element.
   * This triggers CSS variable changes via [data-theme] selector.
   */
  const applyTheme = useCallback((effectiveTheme: Theme) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', effectiveTheme);
    
    // Update iOS status bar style for PWA
    const statusBarMeta = document.getElementById('status-bar-style');
    if (statusBarMeta) {
      statusBarMeta.setAttribute('content', effectiveTheme === 'dark' ? 'black-translucent' : 'default');
    }
  }, []);

  /**
   * Load theme preference from localStorage on mount.
   * If no preference is stored, use system preference.
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        setThemeState(stored);
      }
      // If null or invalid, theme remains null (use system)
    } catch (error) {
      // localStorage might not be available, use system default
      console.warn('Failed to load theme preference:', error);
    }

    setMounted(true);
  }, []);

  /**
   * Apply theme and listen to system preference changes.
   * 
   * - If user has manually set a theme, use that
   * - If theme is null (system), use system preference and listen for changes
   */
  useEffect(() => {
    if (!mounted) return;

    const effectiveTheme = getEffectiveTheme();
    applyTheme(effectiveTheme);

    // Only listen to system changes if using system preference (theme is null)
    if (theme !== null) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      const newSystemTheme = getSystemTheme();
      applyTheme(newSystemTheme);
    };

    // Modern browsers (Safari 14+, Chrome 106+)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemChange);
      return () => mediaQuery.removeEventListener('change', handleSystemChange);
    }
    // Fallback for older browsers (Safari < 14)
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleSystemChange);
      return () => mediaQuery.removeListener(handleSystemChange);
    }
  }, [theme, mounted, getEffectiveTheme, applyTheme, getSystemTheme]);

  /**
   * Set theme and persist to localStorage.
   * Pass null to use system preference.
   */
  const setTheme = useCallback((newTheme: Theme | null) => {
    setThemeState(newTheme);
    try {
      if (newTheme === null) {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } else {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      }
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, []);

  /**
   * Toggle between light and dark themes.
   * If currently using system preference, switches to opposite of current system theme.
   */
  const toggleTheme = useCallback(() => {
    const currentEffective = getEffectiveTheme();
    const newTheme: Theme = currentEffective === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [getEffectiveTheme, setTheme]);

  // Provide safe defaults during SSR/unmounted state
  const effectiveTheme = mounted ? getEffectiveTheme() : 'light';
  const contextValue: ThemeContextType = {
    theme: effectiveTheme,
    setTheme: mounted ? (newTheme: Theme) => setTheme(newTheme) : () => {},
    toggleTheme: mounted ? toggleTheme : () => {},
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme context.
 * 
 * @returns {ThemeContextType} Theme state and controls
 * @throws {Error} If used outside ThemeProvider
 * 
 * Usage:
 * ```tsx
 * const { theme, setTheme, toggleTheme } = useTheme();
 * ```
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};


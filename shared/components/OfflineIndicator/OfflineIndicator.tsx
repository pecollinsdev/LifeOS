'use client';

import React from 'react';
import { Icon } from '../Icon';

/**
 * OfflineIndicator component - Subtle indicator when offline
 * 
 * Shows a small, unobtrusive indicator at the top of the screen
 * when the device is offline. Auto-hides when connection is restored.
 */
export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = React.useState(true);
  const [showIndicator, setShowIndicator] = React.useState(false);

  React.useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Hide indicator after a brief delay
      setTimeout(() => setShowIndicator(false), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
    };

    // Set initial state
    setIsOnline(navigator.onLine);
    if (!navigator.onLine) {
      setShowIndicator(true);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showIndicator || isOnline) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-gray-800 text-gray-100 text-center py-2 px-4 text-sm flex items-center justify-center gap-2 animate-slide-down pt-safe-top"
      role="status"
      aria-live="polite"
    >
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        className="text-gray-400"
      >
        <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
      </svg>
      <span>You're offline. App is working in offline mode.</span>
    </div>
  );
};


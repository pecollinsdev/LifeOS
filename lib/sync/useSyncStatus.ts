'use client';

import { useState, useEffect } from 'react';
import { getSyncConfig } from './sync-config';

/**
 * Sync status information.
 */
export interface SyncStatus {
  enabled: boolean;
  isOnline: boolean;
  canSync: boolean;
  lastSyncTime: Date | null;
}

/**
 * Hook to get sync status.
 * 
 * Monitors:
 * - Whether sync is enabled
 * - Network connectivity
 * - Whether sync can currently run
 */
export function useSyncStatus(): SyncStatus {
  const [isOnline, setIsOnline] = useState(true);
  const [config, setConfig] = useState(getSyncConfig());

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    // Listen for config changes
    const interval = setInterval(() => {
      const newConfig = getSyncConfig();
      if (newConfig.enabled !== config.enabled) {
        setConfig(newConfig);
      }
    }, 1000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [config.enabled]);

  const canSync = config.enabled && isOnline && !!config.endpoint;

  return {
    enabled: config.enabled,
    isOnline,
    canSync,
    lastSyncTime: null, // Could be enhanced to track last sync time
  };
}


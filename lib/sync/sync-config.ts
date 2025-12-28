/**
 * Sync configuration.
 * 
 * Controls whether sync is enabled and provides remote endpoint.
 * For personal use - simple configuration.
 */

export interface SyncConfig {
  /** Whether sync is enabled */
  enabled: boolean;
  /** Remote API endpoint for sync */
  endpoint?: string;
  /** API key/token for authentication (if needed) */
  apiKey?: string;
}

/**
 * Default sync configuration.
 * 
 * Sync is disabled by default - user must explicitly enable it.
 */
export const defaultSyncConfig: SyncConfig = {
  enabled: false,
  // endpoint: 'https://api.example.com/sync', // Set when enabling sync
  // apiKey: 'your-api-key', // Set when enabling sync
};

/**
 * Get sync configuration from localStorage or return default.
 */
export function getSyncConfig(): SyncConfig {
  if (typeof window === 'undefined') {
    return defaultSyncConfig;
  }

  try {
    const stored = localStorage.getItem('lifeos-sync-config');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('[Sync] Failed to load sync config:', error);
  }

  return defaultSyncConfig;
}

/**
 * Save sync configuration to localStorage.
 */
export function saveSyncConfig(config: SyncConfig): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem('lifeos-sync-config', JSON.stringify(config));
  } catch (error) {
    console.error('[Sync] Failed to save sync config:', error);
  }
}


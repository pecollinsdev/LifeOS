import { IStorable } from '../storage/storage.interface';
import { getSyncConfig } from './sync-config';

/**
 * Sync service for remote synchronization.
 * 
 * Handles:
 * - Uploading local changes to remote
 * - Downloading remote changes
 * - Conflict resolution (local wins)
 * 
 * All operations are non-blocking and optional.
 */
export class SyncService<T extends IStorable> {
  private config = getSyncConfig();
  private storeName: string;

  constructor(storeName: string) {
    this.storeName = storeName;
  }

  /**
   * Check if sync is enabled and network is available.
   */
  private canSync(): boolean {
    if (!this.config.enabled || !this.config.endpoint) {
      return false;
    }

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return false;
    }

    return true;
  }

  /**
   * Upload local items to remote (non-blocking).
   * 
   * This is called after local saves to sync changes.
   */
  async uploadItems(items: T[]): Promise<void> {
    if (!this.canSync()) {
      return;
    }

    // Fire and forget - don't block on sync
    this.uploadItemsAsync(items).catch((error) => {
      console.warn('[Sync] Upload failed:', error);
      // Silently fail - local data is already saved
    });
  }

  /**
   * Upload items asynchronously.
   */
  private async uploadItemsAsync(items: T[]): Promise<void> {
    if (!this.config.endpoint) {
      return;
    }

    const response = await fetch(`${this.config.endpoint}/${this.storeName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
      },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      throw new Error(`Sync upload failed: ${response.statusText}`);
    }
  }

  /**
   * Download items from remote (non-blocking).
   * 
   * Returns items that should be merged with local data.
   * Local data always wins in conflicts.
   */
  async downloadItems(localItems: T[]): Promise<T[]> {
    if (!this.canSync()) {
      return [];
    }

    try {
      return await this.downloadItemsAsync(localItems);
    } catch (error) {
      console.warn('[Sync] Download failed:', error);
      // Return empty array - local data is source of truth
      return [];
    }
  }

  /**
   * Download items asynchronously.
   */
  private async downloadItemsAsync(localItems: T[]): Promise<T[]> {
    if (!this.config.endpoint) {
      return [];
    }

    const response = await fetch(`${this.config.endpoint}/${this.storeName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Sync download failed: ${response.statusText}`);
    }

    const data = await response.json();
    const remoteItems: T[] = data.items || [];

    // Conflict resolution: Local always wins
    // Only return items that don't exist locally or are older
    const localMap = new Map(localItems.map((item) => [item.id, item]));
    const itemsToMerge: T[] = [];

    for (const remoteItem of remoteItems) {
      const localItem = localMap.get(remoteItem.id);

      if (!localItem) {
        // New item from remote - add it
        itemsToMerge.push(remoteItem);
      } else {
        // Conflict: Compare updatedAt timestamps
        // Local wins if it's newer or equal
        const localTime = new Date(localItem.updatedAt).getTime();
        const remoteTime = new Date(remoteItem.updatedAt).getTime();

        if (remoteTime > localTime) {
          // Remote is newer, but local still wins (per requirements)
          // Skip this item - local data is source of truth
        }
      }
    }

    return itemsToMerge;
  }

  /**
   * Delete item from remote (non-blocking).
   */
  async deleteItem(id: string): Promise<void> {
    if (!this.canSync()) {
      return;
    }

    this.deleteItemAsync(id).catch((error) => {
      console.warn('[Sync] Delete failed:', error);
      // Silently fail - local delete already happened
    });
  }

  /**
   * Delete item asynchronously.
   */
  private async deleteItemAsync(id: string): Promise<void> {
    if (!this.config.endpoint) {
      return;
    }

    const response = await fetch(`${this.config.endpoint}/${this.storeName}/${id}`, {
      method: 'DELETE',
      headers: {
        ...(this.config.apiKey && { Authorization: `Bearer ${this.config.apiKey}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Sync delete failed: ${response.statusText}`);
    }
  }
}


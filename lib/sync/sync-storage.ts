import { IStorage, IStorable } from '../storage/storage.interface';
import { SyncService } from './sync-service';
import { getSyncConfig } from './sync-config';

/**
 * SyncStorage wraps a local storage implementation and adds optional sync.
 * 
 * Behavior:
 * - Always writes to local storage first (local-first)
 * - Syncs to remote in background (non-blocking)
 * - Local data always wins in conflicts
 * - Works offline (sync disabled when offline)
 * 
 * @template T - Must extend IStorable
 */
export class SyncStorage<T extends IStorable> implements IStorage<T> {
  private syncService: SyncService<T>;
  private localStorage: IStorage<T>;
  private config = getSyncConfig();

  constructor(localStorage: IStorage<T>, storeName: string) {
    this.localStorage = localStorage;
    this.syncService = new SyncService<T>(storeName);
  }

  /**
   * Get all items from local storage.
   * Optionally merges with remote data if sync is enabled.
   */
  async getAll(): Promise<T[]> {
    // Always read from local first
    const localItems = await this.localStorage.getAll();

    // If sync is enabled, try to merge remote data (non-blocking)
    // Note: This happens on getAll() which may be called frequently
    // In production, you might want to debounce or cache this
    if (this.config.enabled) {
      try {
        const remoteItems = await this.syncService.downloadItems(localItems);
        
        // Merge remote items that don't exist locally
        const localMap = new Map(localItems.map((item) => [item.id, item]));
        for (const remoteItem of remoteItems) {
          if (!localMap.has(remoteItem.id)) {
            // New item from remote - save to local
            await this.localStorage.save(remoteItem);
            localItems.push(remoteItem);
          }
        }
      } catch (error) {
        // Silently fail - local data is source of truth
        console.warn('[Sync] Failed to merge remote data:', error);
      }
    }

    return localItems;
  }

  /**
   * Get item by ID from local storage.
   */
  async getById(id: string): Promise<T | undefined> {
    return this.localStorage.getById(id);
  }

  /**
   * Save item to local storage first, then sync to remote.
   * 
   * Local-first: Item is saved locally immediately.
   * Sync happens in background (non-blocking).
   */
  async save(item: T): Promise<T> {
    // Save to local first (local-first)
    const savedItem = await this.localStorage.save(item);

    // Sync to remote in background (non-blocking)
    if (this.config.enabled) {
      const allItems = await this.localStorage.getAll();
      this.syncService.uploadItems(allItems).catch((error) => {
        // Silently fail - local save already succeeded
        console.warn('[Sync] Background sync failed:', error);
      });
    }

    return savedItem;
  }

  /**
   * Delete item from local storage first, then sync delete to remote.
   * 
   * Local-first: Item is deleted locally immediately.
   * Sync happens in background (non-blocking).
   */
  async delete(id: string): Promise<boolean> {
    // Delete from local first (local-first)
    const deleted = await this.localStorage.delete(id);

    // Sync delete to remote in background (non-blocking)
    if (deleted && this.config.enabled) {
      this.syncService.deleteItem(id).catch((error) => {
        // Silently fail - local delete already succeeded
        console.warn('[Sync] Background delete sync failed:', error);
      });
    }

    return deleted;
  }

  /**
   * Clear all items from local storage.
   * Note: This does NOT clear remote data (by design).
   */
  async clear(): Promise<void> {
    return this.localStorage.clear();
  }
}


import { IStorage, IStorable } from './storage.interface';
import { IndexedDBStorage } from './indexeddb-storage';
import { SyncStorage } from '../sync/sync-storage';
import { getSyncConfig } from '../sync/sync-config';

/**
 * Storage type options.
 * Can be extended to support localStorage, backend API, etc.
 */
export type StorageType = 'indexeddb' | 'localstorage' | 'api';

/**
 * Factory for creating storage instances.
 * 
 * Centralizes storage creation logic and allows easy swapping
 * of storage backends without changing feature code.
 * 
 * Optionally wraps storage with sync layer if sync is enabled.
 */
export class StorageFactory {
  /**
   * Creates a storage instance for a given store name.
   * 
   * If sync is enabled in config, wraps local storage with sync layer.
   * Otherwise, returns plain local storage (local-first behavior).
   * 
   * @param storeName - The name of the object store (e.g., 'tasks', 'habits')
   * @param storageType - The type of storage to use (default: 'indexeddb')
   * @param enableSync - Whether to enable sync (default: checks config)
   * @returns A storage instance implementing IStorage<T>
   */
  static create<T extends IStorable>(
    storeName: string,
    storageType: StorageType = 'indexeddb',
    enableSync?: boolean
  ): IStorage<T> {
    // Create local storage
    let storage: IStorage<T>;

    switch (storageType) {
      case 'indexeddb':
        storage = new IndexedDBStorage<T>(storeName as any);
        break;
      case 'localstorage':
        // Future implementation: LocalStorageStorage
        throw new Error('LocalStorage storage not yet implemented');
      case 'api':
        // Future implementation: ApiStorage
        throw new Error('API storage not yet implemented');
      default:
        throw new Error(`Unknown storage type: ${storageType}`);
    }

    // Wrap with sync if enabled
    const syncConfig = getSyncConfig();
    const shouldSync = enableSync !== undefined ? enableSync : syncConfig.enabled;

    if (shouldSync) {
      return new SyncStorage<T>(storage, storeName);
    }

    return storage;
  }
}


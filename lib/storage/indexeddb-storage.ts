import { IStorage, IStorable } from './storage.interface';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

/**
 * IndexedDB schema definition.
 * Each feature domain gets its own object store.
 */
interface LifeOSDB extends DBSchema {
  tasks: {
    key: string;
    value: IStorable;
  };
  habits: {
    key: string;
    value: IStorable;
  };
  finances: {
    key: string;
    value: IStorable;
  };
  fitness: {
    key: string;
    value: IStorable;
  };
  nutrition: {
    key: string;
    value: IStorable;
  };
}

/**
 * Valid store names for type safety.
 */
type StoreName = 'tasks' | 'habits' | 'finances' | 'fitness' | 'nutrition';

/**
 * IndexedDB-based storage implementation.
 * 
 * Uses IndexedDB for reliable client-side storage that works well
 * on mobile devices and can handle larger datasets than localStorage.
 * 
 * @template T - Must extend IStorable
 */
export class IndexedDBStorage<T extends IStorable> implements IStorage<T> {
  private dbName = 'lifeos-db';
  private dbVersion = 1;
  private storeName: StoreName;

  constructor(storeName: StoreName) {
    this.storeName = storeName;
  }

  /**
   * Gets or creates the IndexedDB database instance.
   */
  private async getDB(): Promise<IDBPDatabase<LifeOSDB>> {
    return openDB<LifeOSDB>(this.dbName, this.dbVersion, {
      upgrade(db) {
        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains('tasks')) {
          db.createObjectStore('tasks', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('habits')) {
          db.createObjectStore('habits', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('finances')) {
          db.createObjectStore('finances', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('fitness')) {
          db.createObjectStore('fitness', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('nutrition')) {
          db.createObjectStore('nutrition', { keyPath: 'id' });
        }
      },
    });
  }

  async getAll(): Promise<T[]> {
    const db = await this.getDB();
    return (await db.getAll(this.storeName)) as T[];
  }

  async getById(id: string): Promise<T | undefined> {
    const db = await this.getDB();
    return (await db.get(this.storeName, id)) as T | undefined;
  }

  async save(item: T): Promise<T> {
    const db = await this.getDB();
    const now = new Date().toISOString();
    const itemToSave: T = {
      ...item,
      updatedAt: now,
      createdAt: item.createdAt || now,
    };
    await db.put(this.storeName, itemToSave as IStorable);
    return itemToSave;
  }

  async delete(id: string): Promise<boolean> {
    const db = await this.getDB();
    const result = await db.delete(this.storeName, id);
    return result !== undefined;
  }

  async clear(): Promise<void> {
    const db = await this.getDB();
    await db.clear(this.storeName);
  }
}


/**
 * Storage interface for data persistence.
 * 
 * This abstraction allows swapping between IndexedDB, localStorage, or
 * a backend API without changing feature code.
 * 
 * @template T - The type of data being stored
 */
export interface IStorage<T> {
  /**
   * Retrieves all items of type T from storage.
   * @returns Promise resolving to an array of items
   */
  getAll(): Promise<T[]>;

  /**
   * Retrieves a single item by its ID.
   * @param id - Unique identifier for the item
   * @returns Promise resolving to the item or undefined if not found
   */
  getById(id: string): Promise<T | undefined>;

  /**
   * Saves a new item or updates an existing one.
   * @param item - The item to save (must have an id property)
   * @returns Promise resolving to the saved item
   */
  save(item: T): Promise<T>;

  /**
   * Deletes an item by its ID.
   * @param id - Unique identifier for the item to delete
   * @returns Promise resolving to true if deleted, false if not found
   */
  delete(id: string): Promise<boolean>;

  /**
   * Clears all items of this type from storage.
   * @returns Promise resolving when complete
   */
  clear(): Promise<void>;
}

/**
 * Base interface for entities that can be stored.
 * All stored entities must have a unique identifier.
 */
export interface IStorable {
  id: string;
  createdAt: string;
  updatedAt: string;
}


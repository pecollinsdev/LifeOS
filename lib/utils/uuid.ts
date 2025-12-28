/**
 * Generates a unique identifier.
 * 
 * Simple UUID v4 implementation for client-side ID generation.
 * In production, you might want to use a library like 'uuid'.
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}


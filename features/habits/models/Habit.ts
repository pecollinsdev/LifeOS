import { IStorable } from '@/lib/storage';

/**
 * Habit model representing a single habit item.
 * 
 * This is the core domain model for the Habits feature.
 * All habit-related operations work with this model.
 */
export interface Habit extends IStorable {
  name: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'custom';
  streak: number; // Current consecutive days
  bestStreak: number; // Best streak achieved
}

/**
 * Creates a new habit with default values.
 */
export function createHabit(
  name: string,
  overrides?: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>
): Habit {
  const now = new Date().toISOString();
  return {
    id: '',
    name,
    description: '',
    frequency: 'daily',
    streak: 0,
    bestStreak: 0,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}


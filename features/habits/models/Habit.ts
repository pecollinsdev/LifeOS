import { IStorable } from '@/lib/storage';
import { getCurrentDateString } from '@/lib/utils/date-override';

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
  completedDates: string[]; // ISO date strings (YYYY-MM-DD) when habit was completed
}

/**
 * Creates a new habit with default values.
 * 
 * @param name - The habit name (required)
 * @param overrides - Optional properties to override defaults
 * @returns A new Habit object
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
    completedDates: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Gets today's date as a YYYY-MM-DD string.
 * Used for tracking daily habit completions.
 * 
 * In development, respects date override for testing.
 */
export function getTodayDateString(): string {
  return getCurrentDateString();
}

/**
 * Checks if a habit is completed for today.
 * 
 * @param habit - The habit to check
 * @returns True if the habit is completed today
 */
export function isCompletedToday(habit: Habit): boolean {
  const today = getTodayDateString();
  return habit.completedDates.includes(today);
}


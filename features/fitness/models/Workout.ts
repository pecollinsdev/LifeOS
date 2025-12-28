import { IStorable } from '@/lib/storage';

/**
 * Workout model representing a single workout session.
 * 
 * This is the core domain model for the Fitness feature.
 */
export interface Workout extends IStorable {
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'other';
  duration: number; // Duration in minutes
  calories?: number;
  date: string; // ISO date string
  notes?: string;
}

/**
 * Creates a new workout with default values.
 */
export function createWorkout(
  name: string,
  overrides?: Partial<Omit<Workout, 'id' | 'createdAt' | 'updatedAt' | 'name'>>
): Workout {
  const now = new Date().toISOString();
  return {
    id: '',
    name,
    type: 'cardio',
    duration: 0,
    date: now,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}


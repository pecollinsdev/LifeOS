import { IStorable } from '@/lib/storage';

/**
 * Workout type enumeration.
 */
export enum WorkoutType {
  STRENGTH = 'strength',
  CARDIO = 'cardio',
  FLEXIBILITY = 'flexibility',
  OTHER = 'other',
}

/**
 * Exercise set for strength training.
 */
export interface ExerciseSet {
  reps?: number;
  weight?: number; // Weight in lbs or kg
  duration?: number; // Duration in seconds (for time-based exercises)
  restTime?: number; // Rest time in seconds between sets
}

/**
 * Exercise entry within a workout.
 */
export interface Exercise {
  name: string;
  sets: ExerciseSet[];
}

/**
 * Workout model representing a single workout session.
 * 
 * This is the core domain model for the Fitness feature.
 * Supports both strength training (sets/reps/weight) and cardio (time/duration).
 */
export interface Workout extends IStorable {
  name: string;
  type: WorkoutType;
  date: string; // ISO date string (YYYY-MM-DD)
  
  // For strength training
  exercises?: Exercise[]; // List of exercises with sets, reps, weight
  
  // For cardio/time-based workouts
  duration?: number; // Total duration in minutes
  
  // Optional metadata
  calories?: number; // Estimated calories burned
  notes?: string; // Additional notes about the workout
}

/**
 * Creates a new workout with default values.
 * 
 * @param name - The workout name (required)
 * @param type - The workout type (required)
 * @param overrides - Optional properties to override defaults
 * @returns A new Workout object
 */
export function createWorkout(
  name: string,
  type: WorkoutType,
  overrides?: Partial<Omit<Workout, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'type'>>
): Workout {
  const now = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0];
  return {
    id: '',
    name,
    type,
    date: today,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Creates a new exercise set with default values.
 * 
 * @param overrides - Optional properties to override defaults
 * @returns A new ExerciseSet object
 */
export function createExerciseSet(
  overrides?: Partial<ExerciseSet>
): ExerciseSet {
  return {
    reps: undefined,
    weight: undefined,
    duration: undefined,
    restTime: undefined,
    ...overrides,
  };
}

/**
 * Creates a new exercise with default values.
 * 
 * @param name - The exercise name (required)
 * @param overrides - Optional properties to override defaults
 * @returns A new Exercise object
 */
export function createExercise(
  name: string,
  overrides?: Partial<Omit<Exercise, 'name'>>
): Exercise {
  return {
    name,
    sets: [],
    ...overrides,
  };
}


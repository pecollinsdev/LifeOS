import { IStorage } from '@/lib/storage';
import { Workout, WorkoutType } from '../models/Workout';
import { generateId } from '@/lib/utils/uuid';

/**
 * Service layer for workout operations.
 * 
 * Encapsulates all business logic related to workouts and acts as
 * an interface between the UI and storage layer.
 * 
 * Handles workout management and filtering.
 */
export class WorkoutService {
  constructor(private storage: IStorage<Workout>) {}

  /**
   * Retrieves all workouts.
   * @returns Promise resolving to an array of all workouts, sorted by date (newest first)
   */
  async getAllWorkouts(): Promise<Workout[]> {
    const workouts = await this.storage.getAll();
    // Sort by date descending (newest first)
    return workouts.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }

  /**
   * Retrieves a workout by its ID.
   * @param id - The workout ID
   * @returns Promise resolving to the workout or undefined
   */
  async getWorkoutById(id: string): Promise<Workout | undefined> {
    return this.storage.getById(id);
  }

  /**
   * Creates a new workout.
   * @param workout - The workout to create (id will be generated)
   * @returns Promise resolving to the created workout
   */
  async createWorkout(workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workout> {
    const now = new Date().toISOString();
    const workoutWithId: Workout = {
      ...workout,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    return this.storage.save(workoutWithId);
  }

  /**
   * Updates an existing workout.
   * @param workout - The workout with updated properties
   * @returns Promise resolving to the updated workout
   */
  async updateWorkout(workout: Workout): Promise<Workout> {
    return this.storage.save(workout);
  }

  /**
   * Deletes a workout.
   * @param id - The ID of the workout to delete
   * @returns Promise resolving to true if deleted, false otherwise
   */
  async deleteWorkout(id: string): Promise<boolean> {
    return this.storage.delete(id);
  }

  /**
   * Gets workouts filtered by type.
   * @param type - The workout type to filter by
   * @returns Promise resolving to filtered workouts
   */
  async getWorkoutsByType(type: WorkoutType): Promise<Workout[]> {
    const workouts = await this.getAllWorkouts();
    return workouts.filter((w) => w.type === type);
  }

  /**
   * Gets workouts filtered by date range.
   * @param startDate - Start date (ISO string)
   * @param endDate - End date (ISO string)
   * @returns Promise resolving to filtered workouts
   */
  async getWorkoutsByDateRange(startDate: string, endDate: string): Promise<Workout[]> {
    const workouts = await this.getAllWorkouts();
    return workouts.filter((w) => {
      const workoutDate = new Date(w.date).getTime();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      return workoutDate >= start && workoutDate <= end;
    });
  }
}


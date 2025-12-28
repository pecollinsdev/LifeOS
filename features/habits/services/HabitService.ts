import { IStorage } from '@/lib/storage';
import { Habit, getTodayDateString, isCompletedToday } from '../models/Habit';
import { generateId } from '@/lib/utils/uuid';

/**
 * Service layer for habit operations.
 * 
 * Encapsulates all business logic related to habits and acts as
 * an interface between the UI and storage layer.
 * 
 * Handles streak calculations and daily completion tracking.
 */
export class HabitService {
  constructor(private storage: IStorage<Habit>) {}

  /**
   * Retrieves all habits.
   * @returns Promise resolving to an array of all habits
   */
  async getAllHabits(): Promise<Habit[]> {
    return this.storage.getAll();
  }

  /**
   * Retrieves a habit by its ID.
   * @param id - The habit ID
   * @returns Promise resolving to the habit or undefined
   */
  async getHabitById(id: string): Promise<Habit | undefined> {
    return this.storage.getById(id);
  }

  /**
   * Creates a new habit.
   * @param habit - The habit to create (id will be generated)
   * @returns Promise resolving to the created habit
   */
  async createHabit(habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Habit> {
    const now = new Date().toISOString();
    const habitWithId: Habit = {
      ...habit,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    return this.storage.save(habitWithId);
  }

  /**
   * Updates an existing habit.
   * @param habit - The habit with updated properties
   * @returns Promise resolving to the updated habit
   */
  async updateHabit(habit: Habit): Promise<Habit> {
    return this.storage.save(habit);
  }

  /**
   * Deletes a habit.
   * @param id - The ID of the habit to delete
   * @returns Promise resolving to true if deleted, false otherwise
   */
  async deleteHabit(id: string): Promise<boolean> {
    return this.storage.delete(id);
  }

  /**
   * Marks a habit as completed for today.
   * Updates the streak and best streak if applicable.
   * 
   * @param id - The ID of the habit to mark as completed
   * @returns Promise resolving to the updated habit
   */
  async markCompletedToday(id: string): Promise<Habit> {
    const habit = await this.getHabitById(id);
    if (!habit) {
      throw new Error(`Habit with id ${id} not found`);
    }

    // If already completed today, return as-is
    if (isCompletedToday(habit)) {
      return habit;
    }

    const today = getTodayDateString();
    const updatedDates = [...habit.completedDates, today].sort();

    // Calculate new streak
    const newStreak = this.calculateStreak(updatedDates);
    const newBestStreak = Math.max(habit.bestStreak, newStreak);

    return this.updateHabit({
      ...habit,
      completedDates: updatedDates,
      streak: newStreak,
      bestStreak: newBestStreak,
    });
  }

  /**
   * Unmarks a habit as completed for today.
   * Recalculates the streak.
   * 
   * @param id - The ID of the habit to unmark
   * @returns Promise resolving to the updated habit
   */
  async unmarkCompletedToday(id: string): Promise<Habit> {
    const habit = await this.getHabitById(id);
    if (!habit) {
      throw new Error(`Habit with id ${id} not found`);
    }

    const today = getTodayDateString();
    const updatedDates = habit.completedDates.filter((date) => date !== today);

    // Recalculate streak
    const newStreak = this.calculateStreak(updatedDates);

    return this.updateHabit({
      ...habit,
      completedDates: updatedDates,
      streak: newStreak,
    });
  }

  /**
   * Toggles the completion status for today.
   * 
   * @param id - The ID of the habit to toggle
   * @returns Promise resolving to the updated habit
   */
  async toggleCompletedToday(id: string): Promise<Habit> {
    const habit = await this.getHabitById(id);
    if (!habit) {
      throw new Error(`Habit with id ${id} not found`);
    }

    if (isCompletedToday(habit)) {
      return this.unmarkCompletedToday(id);
    } else {
      return this.markCompletedToday(id);
    }
  }

  /**
   * Recalculates streaks for all habits.
   * Useful when the date changes (e.g., during testing).
   * 
   * @returns Promise resolving to an array of updated habits
   */
  async recalculateAllStreaks(): Promise<Habit[]> {
    const habits = await this.getAllHabits();
    const updatedHabits: Habit[] = [];

    for (const habit of habits) {
      const newStreak = this.calculateStreak(habit.completedDates);
      const newBestStreak = Math.max(habit.bestStreak, newStreak);
      
      if (newStreak !== habit.streak || newBestStreak !== habit.bestStreak) {
        const updated = await this.updateHabit({
          ...habit,
          streak: newStreak,
          bestStreak: newBestStreak,
        });
        updatedHabits.push(updated);
      } else {
        updatedHabits.push(habit);
      }
    }

    return updatedHabits;
  }

  /**
   * Calculates the current streak from completion dates.
   * 
   * A streak is consecutive days ending today (or yesterday if today isn't completed).
   * Only counts backward from today.
   * 
   * @param completedDates - Array of ISO date strings (YYYY-MM-DD)
   * @returns The current streak count
   */
  private calculateStreak(completedDates: string[]): number {
    if (completedDates.length === 0) {
      return 0;
    }

    // Sort dates in descending order (most recent first)
    const sortedDates = [...completedDates].sort().reverse();
    const today = getTodayDateString();
    
    // Helper to get previous day as YYYY-MM-DD
    const getPreviousDay = (dateStr: string): string => {
      const date = new Date(dateStr);
      date.setDate(date.getDate() - 1);
      return date.toISOString().split('T')[0];
    };

    let streak = 0;
    let expectedDate = today;

    // Check if today is completed
    if (sortedDates[0] === today) {
      streak = 1;
      expectedDate = getPreviousDay(today);
    } else {
      // Start from yesterday if today isn't completed
      expectedDate = getPreviousDay(today);
    }

    // Count consecutive days backward
    for (let i = streak > 0 ? 1 : 0; i < sortedDates.length; i++) {
      if (sortedDates[i] === expectedDate) {
        streak++;
        expectedDate = getPreviousDay(expectedDate);
      } else {
        // Streak broken
        break;
      }
    }

    return streak;
  }
}


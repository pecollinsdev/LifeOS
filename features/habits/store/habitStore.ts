import { create } from 'zustand';
import { Habit } from '../models/Habit';
import { HabitService } from '../services/HabitService';
import { StorageFactory } from '@/lib/storage';

/**
 * State interface for the habit store.
 */
interface HabitState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Actions interface for the habit store.
 */
interface HabitActions {
  // State management
  setHabits: (habits: Habit[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Habit operations
  loadHabits: () => Promise<void>;
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateHabit: (habit: Habit) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  toggleHabitComplete: (id: string) => Promise<void>;
  recalculateStreaks: () => Promise<void>;
}

/**
 * Combined store interface.
 */
type HabitStore = HabitState & HabitActions;

/**
 * Zustand store for habit state management.
 * 
 * Provides reactive state management for habits with async operations.
 * The service layer handles persistence, while the store manages UI state.
 * 
 * Performance: Uses selectors to prevent unnecessary re-renders.
 */
const store = create<HabitStore>((set, get) => {
  const service = new HabitService(StorageFactory.create<Habit>('habits'));

  return {
    // Initial state
    habits: [],
    isLoading: false,
    error: null,

    // State setters
    setHabits: (habits) => set({ habits }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // Load all habits from storage
    loadHabits: async () => {
      set({ isLoading: true, error: null });
      try {
        const habits = await service.getAllHabits();
        set({ habits, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to load habits',
          isLoading: false,
        });
      }
    },

    // Add a new habit
    addHabit: async (habit) => {
      set({ isLoading: true, error: null });
      try {
        const newHabit = await service.createHabit(habit);
        set((state) => ({
          habits: [...state.habits, newHabit],
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to add habit',
          isLoading: false,
        });
      }
    },

    // Update an existing habit
    updateHabit: async (habit) => {
      set({ isLoading: true, error: null });
      try {
        const updatedHabit = await service.updateHabit(habit);
        set((state) => ({
          habits: state.habits.map((h) => (h.id === habit.id ? updatedHabit : h)),
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to update habit',
          isLoading: false,
        });
      }
    },

    // Delete a habit
    deleteHabit: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await service.deleteHabit(id);
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to delete habit',
          isLoading: false,
        });
      }
    },

    // Toggle habit completion for today
    toggleHabitComplete: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const updatedHabit = await service.toggleCompletedToday(id);
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? updatedHabit : h)),
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to toggle habit',
          isLoading: false,
        });
      }
    },

    // Recalculate streaks for all habits (useful when date changes)
    recalculateStreaks: async () => {
      set({ isLoading: true, error: null });
      try {
        const updatedHabits = await service.recalculateAllStreaks();
        set({ habits: updatedHabits, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to recalculate streaks',
          isLoading: false,
        });
      }
    },
  };
});

// Performance: Export store with selectors to prevent unnecessary re-renders
// Components should use these selectors instead of accessing the store directly

/**
 * Hook to get all habits. Use specific selectors when possible.
 */
export const useHabitStore = store;

/**
 * Selector: Get only the habits array (for components that need the full list)
 */
export const useHabits = () => store((state) => state.habits);

/**
 * Selector: Get habits count (optimized for dashboard)
 */
export const useHabitsCount = () => store((state) => state.habits.length);

/**
 * Selector: Get only habit actions (for components that don't need state)
 */
export const useHabitActions = () =>
  store((state) => ({
    loadHabits: state.loadHabits,
    addHabit: state.addHabit,
    updateHabit: state.updateHabit,
    deleteHabit: state.deleteHabit,
    toggleHabitComplete: state.toggleHabitComplete,
    recalculateStreaks: state.recalculateStreaks,
  }));

/**
 * Selector: Get loading and error state
 */
export const useHabitStatus = () =>
  store((state) => ({
    isLoading: state.isLoading,
    error: state.error,
  }));


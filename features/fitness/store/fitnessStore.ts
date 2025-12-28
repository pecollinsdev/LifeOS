import { create } from 'zustand';
import { Workout, WorkoutType } from '../models/Workout';
import { WorkoutService } from '../services/WorkoutService';
import { StorageFactory } from '@/lib/storage';

/**
 * State interface for the fitness store.
 */
interface FitnessState {
  workouts: Workout[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Actions interface for the fitness store.
 */
interface FitnessActions {
  // State management
  setWorkouts: (workouts: Workout[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Workout operations
  loadWorkouts: () => Promise<void>;
  addWorkout: (workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateWorkout: (workout: Workout) => Promise<void>;
  deleteWorkout: (id: string) => Promise<void>;
}

/**
 * Combined store interface.
 */
type FitnessStore = FitnessState & FitnessActions;

/**
 * Zustand store for fitness state management.
 * 
 * Provides reactive state management for workouts with async operations.
 * The service layer handles persistence, while the store manages UI state.
 * 
 * Performance: Uses selectors to prevent unnecessary re-renders.
 */
const store = create<FitnessStore>((set, get) => {
  const service = new WorkoutService(StorageFactory.create<Workout>('fitness'));

  return {
    // Initial state
    workouts: [],
    isLoading: false,
    error: null,

    // State setters
    setWorkouts: (workouts) => set({ workouts }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // Load all workouts from storage
    loadWorkouts: async () => {
      set({ isLoading: true, error: null });
      try {
        const workouts = await service.getAllWorkouts();
        set({ workouts, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to load workouts',
          isLoading: false,
        });
      }
    },

    // Add a new workout
    addWorkout: async (workout) => {
      set({ isLoading: true, error: null });
      try {
        const newWorkout = await service.createWorkout(workout);
        set((state) => ({
          workouts: [newWorkout, ...state.workouts],
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to add workout',
          isLoading: false,
        });
      }
    },

    // Update an existing workout
    updateWorkout: async (workout) => {
      set({ isLoading: true, error: null });
      try {
        const updatedWorkout = await service.updateWorkout(workout);
        set((state) => ({
          workouts: state.workouts.map((w) => (w.id === workout.id ? updatedWorkout : w)),
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to update workout',
          isLoading: false,
        });
      }
    },

    // Delete a workout
    deleteWorkout: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await service.deleteWorkout(id);
        set((state) => ({
          workouts: state.workouts.filter((w) => w.id !== id),
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to delete workout',
          isLoading: false,
        });
      }
    },
  };
});

// Performance: Export store with selectors to prevent unnecessary re-renders

/**
 * Hook to get the entire fitness store. Use specific selectors when possible.
 */
export const useFitnessStore = store;

/**
 * Selector: Get only the workouts array
 */
export const useWorkouts = () => store((state) => state.workouts);

/**
 * Selector: Get only workout actions (for components that don't need state)
 */
export const useFitnessActions = () =>
  store((state) => ({
    loadWorkouts: state.loadWorkouts,
    addWorkout: state.addWorkout,
    updateWorkout: state.updateWorkout,
    deleteWorkout: state.deleteWorkout,
  }));

/**
 * Selector: Get loading and error state
 */
export const useFitnessStatus = () =>
  store((state) => ({
    isLoading: state.isLoading,
    error: state.error,
  }));


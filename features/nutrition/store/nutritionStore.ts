import { create } from 'zustand';
import { Meal, DailyMacros } from '../models/Meal';
import { MealService } from '../services/MealService';
import { StorageFactory } from '@/lib/storage';
import { getCurrentDateString } from '@/lib/utils/date-override';

/**
 * State interface for the nutrition store.
 */
interface NutritionState {
  meals: Meal[];
  dailyMacros: DailyMacros | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Actions interface for the nutrition store.
 */
interface NutritionActions {
  // State management
  setMeals: (meals: Meal[]) => void;
  setDailyMacros: (macros: DailyMacros | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Meal operations
  loadMeals: () => Promise<void>;
  loadMealsForDate: (date: string) => Promise<void>;
  addMeal: (meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateMeal: (meal: Meal) => Promise<void>;
  deleteMeal: (id: string) => Promise<void>;
  refreshDailyMacros: (date?: string) => Promise<void>;
}

/**
 * Combined store interface.
 */
type NutritionStore = NutritionState & NutritionActions;

/**
 * Zustand store for nutrition state management.
 * 
 * Provides reactive state management for meals with async operations.
 * The service layer handles persistence, while the store manages UI state.
 * 
 * Performance: Uses selectors to prevent unnecessary re-renders.
 */
const store = create<NutritionStore>((set, get) => {
  const service = new MealService(StorageFactory.create<Meal>('nutrition'));

  return {
    // Initial state
    meals: [],
    dailyMacros: null,
    isLoading: false,
    error: null,

    // State setters
    setMeals: (meals) => set({ meals }),
    setDailyMacros: (dailyMacros) => set({ dailyMacros }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // Load all meals from storage
    loadMeals: async () => {
      set({ isLoading: true, error: null });
      try {
        const meals = await service.getAllMeals();
        const today = getCurrentDateString();
        const macros = await service.getDailyMacros(today);
        set({ meals, dailyMacros: macros, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to load meals',
          isLoading: false,
        });
      }
    },

    // Load meals for a specific date
    loadMealsForDate: async (date: string) => {
      set({ isLoading: true, error: null });
      try {
        const meals = await service.getMealsByDate(date);
        const macros = await service.getDailyMacros(date);
        set({ meals: meals, dailyMacros: macros, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to load meals for date',
          isLoading: false,
        });
      }
    },

    // Add a new meal
    addMeal: async (meal) => {
      set({ isLoading: true, error: null });
      try {
        const newMeal = await service.createMeal(meal);
        const macros = await service.getDailyMacros(meal.date);
        set((state) => ({
          meals: [newMeal, ...state.meals],
          dailyMacros: macros,
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to add meal',
          isLoading: false,
        });
      }
    },

    // Update an existing meal
    updateMeal: async (meal) => {
      set({ isLoading: true, error: null });
      try {
        const updatedMeal = await service.updateMeal(meal);
        const macros = await service.getDailyMacros(meal.date);
        set((state) => ({
          meals: state.meals.map((m) => (m.id === meal.id ? updatedMeal : m)),
          dailyMacros: macros,
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to update meal',
          isLoading: false,
        });
      }
    },

    // Delete a meal
    deleteMeal: async (id) => {
      set({ isLoading: true, error: null });
      try {
        const meal = get().meals.find((m) => m.id === id);
        if (!meal) {
          throw new Error('Meal not found');
        }
        await service.deleteMeal(id);
        const macros = await service.getDailyMacros(meal.date);
        set((state) => ({
          meals: state.meals.filter((m) => m.id !== id),
          dailyMacros: macros,
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to delete meal',
          isLoading: false,
        });
      }
    },

    // Refresh daily macros for a specific date (defaults to today)
    refreshDailyMacros: async (date?: string) => {
      try {
        const targetDate = date || getCurrentDateString();
        const macros = await service.getDailyMacros(targetDate);
        set({ dailyMacros: macros });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to refresh macros',
        });
      }
    },
  };
});

// Performance: Export store with selectors to prevent unnecessary re-renders

/**
 * Hook to get the entire nutrition store. Use specific selectors when possible.
 */
export const useNutritionStore = store;

/**
 * Selector: Get only the meals array
 */
export const useMeals = () => store((state) => state.meals);

/**
 * Selector: Get meals for today
 */
export const useTodayMeals = () => {
  const meals = useMeals();
  const today = getCurrentDateString();
  return meals.filter((meal) => meal.date === today);
};

/**
 * Selector: Get daily macros
 */
export const useDailyMacros = () => store((state) => state.dailyMacros);

/**
 * Selector: Get only nutrition actions (for components that don't need state)
 */
export const useNutritionActions = () =>
  store((state) => ({
    loadMeals: state.loadMeals,
    loadMealsForDate: state.loadMealsForDate,
    addMeal: state.addMeal,
    updateMeal: state.updateMeal,
    deleteMeal: state.deleteMeal,
    refreshDailyMacros: state.refreshDailyMacros,
  }));

/**
 * Selector: Get loading and error state
 */
export const useNutritionStatus = () =>
  store((state) => ({
    isLoading: state.isLoading,
    error: state.error,
  }));


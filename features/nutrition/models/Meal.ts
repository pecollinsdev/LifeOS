import { IStorable } from '@/lib/storage';

/**
 * Meal type.
 */
export enum MealType {
  BREAKFAST = 'breakfast',
  LUNCH = 'lunch',
  DINNER = 'dinner',
  SNACK = 'snack',
}

/**
 * Meal model representing a single meal entry.
 * 
 * This is the core domain model for the Nutrition feature.
 */
export interface Meal extends IStorable {
  name: string;
  type: MealType;
  calories: number;
  protein?: number; // grams
  carbs?: number; // grams
  fats?: number; // grams
  date: string; // ISO date string
  notes?: string;
}

/**
 * Creates a new meal with default values.
 * 
 * @param name - The meal name (required)
 * @param calories - The calorie count (required)
 * @param overrides - Optional properties to override defaults
 * @returns A new Meal object
 */
export function createMeal(
  name: string,
  calories: number,
  overrides?: Partial<Omit<Meal, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'calories'>>
): Meal {
  const now = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0];
  return {
    id: '',
    name,
    type: MealType.BREAKFAST,
    calories,
    date: today,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Daily macro totals interface.
 * Aggregates all macros for a given date.
 */
export interface DailyMacros {
  date: string; // ISO date string (YYYY-MM-DD)
  totalCalories: number;
  totalProtein: number; // grams
  totalCarbs: number; // grams
  totalFats: number; // grams
  mealCount: number;
}


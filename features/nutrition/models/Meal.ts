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
 */
export function createMeal(
  name: string,
  calories: number,
  overrides?: Partial<Omit<Meal, 'id' | 'createdAt' | 'updatedAt' | 'name' | 'calories'>>
): Meal {
  const now = new Date().toISOString();
  return {
    id: '',
    name,
    type: MealType.BREAKFAST,
    calories,
    date: now,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}


import { IStorage } from '@/lib/storage';
import { Meal, DailyMacros } from '../models/Meal';
import { generateId } from '@/lib/utils/uuid';

/**
 * Service layer for meal operations.
 * 
 * Encapsulates all business logic related to meals and acts as
 * an interface between the UI and storage layer.
 * 
 * Handles meal management and daily macro calculations.
 */
export class MealService {
  constructor(private storage: IStorage<Meal>) {}

  /**
   * Retrieves all meals.
   * @returns Promise resolving to an array of all meals, sorted by date (newest first)
   */
  async getAllMeals(): Promise<Meal[]> {
    const meals = await this.storage.getAll();
    // Sort by date descending (newest first), then by meal type
    return meals.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (dateB !== dateA) {
        return dateB - dateA;
      }
      // If same date, sort by meal type order
      const typeOrder = ['breakfast', 'lunch', 'dinner', 'snack'];
      return typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type);
    });
  }

  /**
   * Retrieves a meal by its ID.
   * @param id - The meal ID
   * @returns Promise resolving to the meal or undefined
   */
  async getMealById(id: string): Promise<Meal | undefined> {
    return this.storage.getById(id);
  }

  /**
   * Creates a new meal.
   * @param meal - The meal to create (id will be generated)
   * @returns Promise resolving to the created meal
   */
  async createMeal(meal: Omit<Meal, 'id' | 'createdAt' | 'updatedAt'>): Promise<Meal> {
    const now = new Date().toISOString();
    const mealWithId: Meal = {
      ...meal,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    return this.storage.save(mealWithId);
  }

  /**
   * Updates an existing meal.
   * @param meal - The meal with updated properties
   * @returns Promise resolving to the updated meal
   */
  async updateMeal(meal: Meal): Promise<Meal> {
    return this.storage.save(meal);
  }

  /**
   * Deletes a meal.
   * @param id - The ID of the meal to delete
   * @returns Promise resolving to true if deleted, false otherwise
   */
  async deleteMeal(id: string): Promise<boolean> {
    return this.storage.delete(id);
  }

  /**
   * Gets meals for a specific date.
   * @param date - Date string in YYYY-MM-DD format
   * @returns Promise resolving to meals for that date
   */
  async getMealsByDate(date: string): Promise<Meal[]> {
    const meals = await this.getAllMeals();
    return meals.filter((meal) => meal.date === date);
  }

  /**
   * Calculates daily macro totals for a specific date.
   * @param date - Date string in YYYY-MM-DD format
   * @returns Promise resolving to daily macro totals
   */
  async getDailyMacros(date: string): Promise<DailyMacros> {
    const meals = await this.getMealsByDate(date);
    
    const totals = meals.reduce(
      (acc, meal) => ({
        totalCalories: acc.totalCalories + (meal.calories || 0),
        totalProtein: acc.totalProtein + (meal.protein || 0),
        totalCarbs: acc.totalCarbs + (meal.carbs || 0),
        totalFats: acc.totalFats + (meal.fats || 0),
      }),
      {
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFats: 0,
      }
    );

    return {
      date,
      ...totals,
      mealCount: meals.length,
    };
  }

  /**
   * Gets meals filtered by meal type.
   * @param type - The meal type to filter by
   * @returns Promise resolving to filtered meals
   */
  async getMealsByType(type: Meal['type']): Promise<Meal[]> {
    const meals = await this.getAllMeals();
    return meals.filter((m) => m.type === type);
  }
}


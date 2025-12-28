'use client';

import React, { useEffect, useMemo } from 'react';
import { useTodayMeals, useNutritionStatus, useNutritionActions } from '../../store/nutritionStore';
import { MealItem } from '../MealItem/MealItem';
import { Alert } from '@/shared/components';
import { MealType } from '../../models/Meal';

/**
 * MealList component displays meals for today.
 * 
 * Shows meals grouped by meal type (Breakfast, Lunch, Dinner, Snack)
 * and provides a clean mobile-optimized interface.
 * 
 * Performance: Uses selectors and memoization to prevent unnecessary re-renders.
 */
export const MealList: React.FC = () => {
  // Performance: Use specific selectors instead of entire store
  const meals = useTodayMeals();
  const { isLoading, error } = useNutritionStatus();
  const { loadMeals } = useNutritionActions();

  useEffect(() => {
    loadMeals();
    // Performance: loadMeals is stable (from selector), but include it for safety
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Performance: Memoize grouped meals to prevent recalculation on every render
  const groupedMeals = useMemo(() => {
    const grouped: Record<MealType, typeof meals> = {
      [MealType.BREAKFAST]: [],
      [MealType.LUNCH]: [],
      [MealType.DINNER]: [],
      [MealType.SNACK]: [],
    };

    meals.forEach((meal) => {
      grouped[meal.type].push(meal);
    });

    return grouped;
  }, [meals]);

  const getMealTypeLabel = (type: MealType): string => {
    const labels: Record<MealType, string> = {
      [MealType.BREAKFAST]: 'Breakfast',
      [MealType.LUNCH]: 'Lunch',
      [MealType.DINNER]: 'Dinner',
      [MealType.SNACK]: 'Snack',
    };
    return labels[type] || 'Meal';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-sm text-text-tertiary">Loading meals...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  return (
    <div className="space-y-5">
      {meals.length === 0 ? (
        <Alert variant="info">
          <div className="text-center py-4">
            <p className="font-medium">No meals logged for today. Add your first meal to start tracking!</p>
          </div>
        </Alert>
      ) : (
        Object.entries(groupedMeals).map(([type, typeMeals]) => {
          if (typeMeals.length === 0) return null;
          return (
            <div key={type} className="space-y-3">
              <h2 className="text-lg font-bold text-text-primary mb-1">
                {getMealTypeLabel(type as MealType)}
              </h2>
              {typeMeals.map((meal) => (
                <MealItem key={meal.id} meal={meal} />
              ))}
            </div>
          );
        })
      )}
    </div>
  );
};


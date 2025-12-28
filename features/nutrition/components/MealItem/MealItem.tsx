'use client';

import React, { memo, useCallback } from 'react';
import { Meal, MealType } from '../../models/Meal';
import { useNutritionActions } from '../../store/nutritionStore';
import { Card, Icon, Badge } from '@/shared/components';

export interface MealItemProps {
  meal: Meal;
}

/**
 * MealItem component displays a single meal.
 * 
 * Mobile-optimized with touch-friendly controls and clear
 * visual feedback for meal type and macro information.
 * 
 * Performance: Memoized to prevent re-renders when parent updates.
 */
export const MealItem: React.FC<MealItemProps> = memo(({ meal }) => {
  // Performance: Only subscribe to actions, not state
  const { deleteMeal } = useNutritionActions();

  // Performance: Memoize callbacks to prevent child re-renders
  const handleDelete = useCallback(() => {
    if (confirm('Are you sure you want to delete this meal?')) {
      deleteMeal(meal.id);
    }
  }, [meal.id, deleteMeal]);

  const getMealTypeLabel = (mealType: MealType): string => {
    const labels: Record<MealType, string> = {
      [MealType.BREAKFAST]: 'Breakfast',
      [MealType.LUNCH]: 'Lunch',
      [MealType.DINNER]: 'Dinner',
      [MealType.SNACK]: 'Snack',
    };
    return labels[mealType] || 'Meal';
  };

  const getMealTypeColor = (mealType: MealType): 'primary' | 'success' | 'warning' | 'secondary' => {
    const colors: Record<MealType, 'primary' | 'success' | 'warning' | 'secondary'> = {
      [MealType.BREAKFAST]: 'primary',
      [MealType.LUNCH]: 'success',
      [MealType.DINNER]: 'warning',
      [MealType.SNACK]: 'secondary',
    };
    return colors[mealType] || 'secondary';
  };

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="font-semibold text-text-primary truncate">{meal.name}</h3>
            <Badge variant={getMealTypeColor(meal.type)} size="sm">
              {getMealTypeLabel(meal.type)}
            </Badge>
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex items-center gap-4">
              <span className="font-bold text-text-primary">
                {meal.calories} <span className="text-text-tertiary font-normal">cal</span>
              </span>
            </div>

            {(meal.protein || meal.carbs || meal.fats) && (
              <div className="flex items-center gap-3 text-xs text-text-secondary mt-2">
                {meal.protein !== undefined && (
                  <span>
                    <span className="font-semibold">P:</span> {meal.protein}g
                  </span>
                )}
                {meal.carbs !== undefined && (
                  <span>
                    <span className="font-semibold">C:</span> {meal.carbs}g
                  </span>
                )}
                {meal.fats !== undefined && (
                  <span>
                    <span className="font-semibold">F:</span> {meal.fats}g
                  </span>
                )}
              </div>
            )}

            {meal.notes && (
              <div className="mt-2 text-xs text-text-tertiary italic">
                "{meal.notes}"
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="flex-shrink-0 w-11 h-11 flex items-center justify-center text-gray-400 hover:text-red-600 active:text-red-700 active:scale-95 transition-all duration-150 rounded-xl hover:bg-red-50 active:bg-red-100"
          aria-label="Delete meal"
        >
          <Icon name="delete" size={20} />
        </button>
      </div>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Performance: Custom comparison - return true if props are equal (skip re-render)
  return (
    prevProps.meal.id === nextProps.meal.id &&
    prevProps.meal.name === nextProps.meal.name &&
    prevProps.meal.type === nextProps.meal.type &&
    prevProps.meal.calories === nextProps.meal.calories &&
    prevProps.meal.protein === nextProps.meal.protein &&
    prevProps.meal.carbs === nextProps.meal.carbs &&
    prevProps.meal.fats === nextProps.meal.fats &&
    prevProps.meal.date === nextProps.meal.date &&
    prevProps.meal.notes === nextProps.meal.notes
  );
});

MealItem.displayName = 'MealItem';


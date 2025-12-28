'use client';

import React from 'react';
import { useDailyMacros } from '../../store/nutritionStore';
import { Card } from '@/shared/components';

/**
 * DailyMacrosDisplay component shows daily macro totals.
 * 
 * Displays total calories, protein, carbs, and fats for today
 * in a mobile-optimized card layout with clear visual hierarchy.
 */
export const DailyMacrosDisplay: React.FC = () => {
  const macros = useDailyMacros();

  if (!macros) {
    return (
      <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
        <div className="text-center py-4">
          <p className="text-sm text-text-secondary font-medium">No meals logged for today</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
      <div className="space-y-4">
        {/* Total Calories */}
        <div className="text-center">
          <p className="text-sm font-semibold text-text-secondary mb-1">Total Calories</p>
          <p className="text-4xl font-bold text-primary-700">
            {macros.totalCalories.toFixed(0)}
          </p>
          <p className="text-xs text-text-tertiary mt-1 font-medium">
            {macros.mealCount} meal{macros.mealCount !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Macros Breakdown */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-primary-200">
          <div className="text-center">
            <p className="text-xs text-text-tertiary mb-1 font-medium">Protein</p>
            <p className="text-xl font-bold text-blue-600">
              {macros.totalProtein.toFixed(1)}g
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-tertiary mb-1 font-medium">Carbs</p>
            <p className="text-xl font-bold text-green-600">
              {macros.totalCarbs.toFixed(1)}g
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-tertiary mb-1 font-medium">Fats</p>
            <p className="text-xl font-bold text-yellow-600">
              {macros.totalFats.toFixed(1)}g
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};


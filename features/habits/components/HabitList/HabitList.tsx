'use client';

import React, { useEffect, useMemo } from 'react';
import { useHabits, useHabitStatus, useHabitActions } from '../../store/habitStore';
import { HabitItem } from '../HabitItem/HabitItem';
import { Card, Alert } from '@/shared/components';
import { isCompletedToday } from '../../models/Habit';

/**
 * HabitList component displays all habits.
 * 
 * Shows today's habits with checkboxes and provides a clean
 * mobile-optimized interface for viewing and interacting with habits.
 * 
 * Performance: Uses selectors and memoization to prevent unnecessary re-renders.
 */
export const HabitList: React.FC = () => {
  // Performance: Use specific selectors instead of entire store
  const habits = useHabits();
  const { isLoading, error } = useHabitStatus();
  const { loadHabits } = useHabitActions();

  useEffect(() => {
    // Load habits on mount (only once)
    loadHabits();
    // Performance: loadHabits is stable (from selector), but include it for safety
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Performance: Memoize filtered arrays to prevent recalculation on every render
  const { completedHabits, incompleteHabits } = useMemo(() => {
    const completed: typeof habits = [];
    const incomplete: typeof habits = [];

    habits.forEach((habit) => {
      if (isCompletedToday(habit)) {
        completed.push(habit);
      } else {
        incomplete.push(habit);
      }
    });

    return { completedHabits: completed, incompleteHabits: incomplete };
  }, [habits]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-sm text-gray-500">Loading habits...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  return (
    <div className="space-y-5">
      {incompleteHabits.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-text-primary mb-1">
            Today's Habits
          </h2>
          {incompleteHabits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} />
          ))}
        </div>
      )}

      {completedHabits.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-bold text-text-tertiary mb-1">
            Completed Today
          </h2>
          {completedHabits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} />
          ))}
        </div>
      )}

      {habits.length === 0 && (
        <Alert variant="info">
          <div className="text-center py-4">
            <p className="font-medium">No habits yet. Create your first habit to start tracking!</p>
          </div>
        </Alert>
      )}
    </div>
  );
};


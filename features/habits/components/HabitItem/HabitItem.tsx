'use client';

import React, { memo, useCallback } from 'react';
import { Habit, isCompletedToday } from '../../models/Habit';
import { useHabitActions } from '../../store/habitStore';
import { Card, Icon } from '@/shared/components';

export interface HabitItemProps {
  habit: Habit;
}

/**
 * HabitItem component displays a single habit with completion checkbox.
 * 
 * Mobile-optimized with touch-friendly controls and clear
 * visual feedback for completion status and streak information.
 * 
 * Performance: Memoized to prevent re-renders when parent updates.
 */
export const HabitItem: React.FC<HabitItemProps> = memo(({ habit }) => {
  // Performance: Only subscribe to actions, not state
  const { toggleHabitComplete, deleteHabit } = useHabitActions();
  const isCompleted = isCompletedToday(habit);

  // Performance: Memoize callbacks to prevent child re-renders
  const handleToggle = useCallback(() => {
    toggleHabitComplete(habit.id);
  }, [habit.id, toggleHabitComplete]);

  const handleDelete = useCallback(() => {
    if (confirm('Are you sure you want to delete this habit?')) {
      deleteHabit(habit.id);
    }
  }, [habit.id, deleteHabit]);

  return (
    <Card className={`${isCompleted ? 'bg-primary-50 border-primary-200' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          className={`mt-0.5 flex-shrink-0 w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-200 active:scale-95 ${
            isCompleted
              ? 'bg-primary-600 border-primary-600'
              : 'border-gray-300 hover:border-primary-500 active:border-primary-600'
          }`}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isCompleted && <Icon name="check" size={18} className="text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <h3
            className={`font-semibold ${
              isCompleted 
                ? 'text-primary-900' 
                : 'text-text-primary'
            }`}
          >
            {habit.name}
          </h3>
          {habit.description && (
            <p
              className={`text-sm mt-1 ${
                isCompleted 
                  ? 'text-primary-700' 
                  : 'text-text-secondary'
              }`}
            >
              {habit.description}
            </p>
          )}
          
          {/* Streak and completion info */}
          <div className="flex items-center gap-4 mt-2 text-xs">
            {habit.streak > 0 && (
              <span className="text-primary-600 font-semibold">
                🔥 {habit.streak} day{habit.streak !== 1 ? 's' : ''} streak
              </span>
            )}
            {habit.bestStreak > 0 && habit.bestStreak !== habit.streak && (
              <span className="text-text-tertiary">
                Best: {habit.bestStreak} day{habit.bestStreak !== 1 ? 's' : ''}
              </span>
            )}
            {habit.completedDates.length > 0 && (
              <span className="text-text-tertiary">
                {habit.completedDates.length} completion{habit.completedDates.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="flex-shrink-0 w-11 h-11 flex items-center justify-center text-gray-400 hover:text-red-600 active:text-red-700 active:scale-95 transition-all duration-150 rounded-xl hover:bg-red-50 active:bg-red-100"
          aria-label="Delete habit"
        >
          <Icon name="delete" size={20} />
        </button>
      </div>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Performance: Custom comparison - return true if props are equal (skip re-render)
  // Only re-render if habit data actually changes
  const prevCompleted = isCompletedToday(prevProps.habit);
  const nextCompleted = isCompletedToday(nextProps.habit);
  
  return (
    prevProps.habit.id === nextProps.habit.id &&
    prevProps.habit.name === nextProps.habit.name &&
    prevProps.habit.description === nextProps.habit.description &&
    prevProps.habit.streak === nextProps.habit.streak &&
    prevProps.habit.bestStreak === nextProps.habit.bestStreak &&
    prevProps.habit.completedDates.length === nextProps.habit.completedDates.length &&
    prevCompleted === nextCompleted
  );
});

HabitItem.displayName = 'HabitItem';


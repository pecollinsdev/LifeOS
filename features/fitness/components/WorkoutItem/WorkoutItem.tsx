'use client';

import React, { memo, useCallback } from 'react';
import { Workout, WorkoutType } from '../../models/Workout';
import { useFitnessActions } from '../../store/fitnessStore';
import { Card, Icon, Badge } from '@/shared/components';

export interface WorkoutItemProps {
  workout: Workout;
}

/**
 * WorkoutItem component displays a single workout.
 * 
 * Mobile-optimized with touch-friendly controls and clear
 * visual feedback for workout type and details.
 * 
 * Performance: Memoized to prevent re-renders when parent updates.
 */
export const WorkoutItem: React.FC<WorkoutItemProps> = memo(({ workout }) => {
  // Performance: Only subscribe to actions, not state
  const { deleteWorkout } = useFitnessActions();

  // Performance: Memoize callbacks to prevent child re-renders
  const handleDelete = useCallback(() => {
    if (confirm('Are you sure you want to delete this workout?')) {
      deleteWorkout(workout.id);
    }
  }, [workout.id, deleteWorkout]);

  const getWorkoutTypeLabel = (type: WorkoutType): string => {
    const labels: Record<WorkoutType, string> = {
      [WorkoutType.STRENGTH]: 'Strength',
      [WorkoutType.CARDIO]: 'Cardio',
      [WorkoutType.FLEXIBILITY]: 'Flexibility',
      [WorkoutType.OTHER]: 'Other',
    };
    return labels[type] || 'Other';
  };

  const getWorkoutTypeColor = (type: WorkoutType): 'primary' | 'success' | 'warning' | 'secondary' => {
    const colors: Record<WorkoutType, 'primary' | 'success' | 'warning' | 'secondary'> = {
      [WorkoutType.STRENGTH]: 'primary',
      [WorkoutType.CARDIO]: 'success',
      [WorkoutType.FLEXIBILITY]: 'warning',
      [WorkoutType.OTHER]: 'secondary',
    };
    return colors[type] || 'secondary';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const isStrength = workout.type === WorkoutType.STRENGTH;

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="font-semibold text-text-primary truncate">{workout.name}</h3>
            <Badge variant={getWorkoutTypeColor(workout.type)} size="sm">
              {getWorkoutTypeLabel(workout.type)}
            </Badge>
          </div>

          <div className="space-y-2 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <span className="text-text-tertiary">📅</span>
              <span>{formatDate(workout.date)}</span>
            </div>

            {isStrength && workout.exercises && workout.exercises.length > 0 && (
              <div className="mt-2 space-y-1">
                {workout.exercises.map((exercise, index) => (
                  <div key={index} className="text-xs">
                    <span className="font-medium">{exercise.name}:</span>{' '}
                    {exercise.sets.map((set, setIndex) => (
                      <span key={setIndex} className="ml-1">
                        {set.reps || '-'} reps
                        {set.weight && ` @ ${set.weight}lbs`}
                        {setIndex < exercise.sets.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {!isStrength && workout.duration && (
              <div className="flex items-center gap-2">
                <span className="text-text-tertiary">⏱️</span>
                <span>{workout.duration} minutes</span>
              </div>
            )}

            {workout.calories && (
              <div className="flex items-center gap-2">
                <span className="text-text-tertiary">🔥</span>
                <span>{workout.calories} calories</span>
              </div>
            )}

            {workout.notes && (
              <div className="mt-2 text-xs text-text-tertiary italic">
                "{workout.notes}"
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="flex-shrink-0 w-11 h-11 flex items-center justify-center text-gray-400 hover:text-red-600 active:text-red-700 active:scale-95 transition-all duration-150 rounded-xl hover:bg-red-50 active:bg-red-100"
          aria-label="Delete workout"
        >
          <Icon name="delete" size={20} />
        </button>
      </div>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Performance: Custom comparison - return true if props are equal (skip re-render)
  return (
    prevProps.workout.id === nextProps.workout.id &&
    prevProps.workout.name === nextProps.workout.name &&
    prevProps.workout.type === nextProps.workout.type &&
    prevProps.workout.date === nextProps.workout.date &&
    JSON.stringify(prevProps.workout.exercises) === JSON.stringify(nextProps.workout.exercises) &&
    prevProps.workout.duration === nextProps.workout.duration &&
    prevProps.workout.calories === nextProps.workout.calories &&
    prevProps.workout.notes === nextProps.workout.notes
  );
});

WorkoutItem.displayName = 'WorkoutItem';


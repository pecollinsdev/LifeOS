'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useWorkouts, useFitnessStatus, useFitnessActions } from '../../store/fitnessStore';
import { WorkoutItem } from '../WorkoutItem/WorkoutItem';
import { Alert, Select } from '@/shared/components';
import { Workout, WorkoutType } from '../../models/Workout';

/**
 * Grouping options for workouts.
 */
type GroupByOption = 'none' | 'type' | 'date';

/**
 * WorkoutList component displays all workouts.
 * 
 * Shows workouts sorted by date (newest first) with optional grouping
 * by workout type or date. Provides a clean mobile-optimized interface.
 * 
 * Performance: Uses selectors and memoization to prevent unnecessary re-renders.
 */
export const WorkoutList: React.FC = () => {
  // Performance: Use specific selectors instead of entire store
  const workouts = useWorkouts();
  const { isLoading, error } = useFitnessStatus();
  const { loadWorkouts } = useFitnessActions();
  const [groupBy, setGroupBy] = useState<GroupByOption>('none');

  useEffect(() => {
    loadWorkouts();
    // Performance: loadWorkouts is stable (from selector), but include it for safety
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Performance: Memoize grouped workouts to prevent recalculation on every render
  const groupedWorkouts = useMemo(() => {
    if (groupBy === 'none') {
      return { type: 'none' as const, ungrouped: workouts };
    }

    if (groupBy === 'type') {
      const grouped: Record<WorkoutType, Workout[]> = {
        [WorkoutType.STRENGTH]: [],
        [WorkoutType.CARDIO]: [],
        [WorkoutType.FLEXIBILITY]: [],
        [WorkoutType.OTHER]: [],
      };

      workouts.forEach((workout) => {
        grouped[workout.type].push(workout);
      });

      return { type: 'byType' as const, grouped };
    }

    if (groupBy === 'date') {
      const grouped: Record<string, Workout[]> = {};

      workouts.forEach((workout) => {
        const dateKey = workout.date;
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(workout);
      });

      // Sort dates descending (newest first)
      const sortedDates = Object.keys(grouped).sort((a, b) => {
        return new Date(b).getTime() - new Date(a).getTime();
      });

      return { type: 'byDate' as const, dates: sortedDates, grouped };
    }

    return { type: 'none' as const, ungrouped: workouts };
  }, [workouts, groupBy]);

  const formatDateHeader = (dateString: string): string => {
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
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const getWorkoutTypeLabel = (type: WorkoutType): string => {
    const labels: Record<WorkoutType, string> = {
      [WorkoutType.STRENGTH]: 'Strength Training',
      [WorkoutType.CARDIO]: 'Cardio',
      [WorkoutType.FLEXIBILITY]: 'Flexibility',
      [WorkoutType.OTHER]: 'Other',
    };
    return labels[type] || 'Other';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-sm text-text-tertiary">Loading workouts...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  return (
    <div className="space-y-4">
      {/* Group By Selector */}
      {workouts.length > 0 && (
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-text-secondary">Group by:</label>
          <Select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as GroupByOption)}
            className="flex-1 max-w-xs"
          >
            <option value="none">None</option>
            <option value="type">Workout Type</option>
            <option value="date">Date</option>
          </Select>
        </div>
      )}

      {/* Ungrouped List */}
      {groupBy === 'none' && (
        <div className="space-y-3">
          {workouts.length === 0 ? (
            <Alert variant="info">
              <div className="text-center py-4">
                <p className="font-medium">No workouts yet. Log your first workout to start tracking!</p>
              </div>
            </Alert>
          ) : (
            workouts.map((workout) => (
              <WorkoutItem key={workout.id} workout={workout} />
            ))
          )}
        </div>
      )}

      {/* Grouped by Type */}
      {groupBy === 'type' && groupedWorkouts.type === 'byType' && (
        <div className="space-y-5">
          {Object.entries(groupedWorkouts.grouped).map(([type, typeWorkouts]) => {
            if (typeWorkouts.length === 0) return null;
            return (
              <div key={type} className="space-y-3">
                <h2 className="text-lg font-bold text-text-primary mb-1">
                  {getWorkoutTypeLabel(type as WorkoutType)}
                </h2>
                {typeWorkouts.map((workout) => (
                  <WorkoutItem key={workout.id} workout={workout} />
                ))}
              </div>
            );
          })}
        </div>
      )}

      {/* Grouped by Date */}
      {groupBy === 'date' && groupedWorkouts.type === 'byDate' && (
        <div className="space-y-5">
          {groupedWorkouts.dates.map((dateKey) => {
            const dateWorkouts = groupedWorkouts.grouped[dateKey];
            if (!dateWorkouts || dateWorkouts.length === 0) return null;
            return (
              <div key={dateKey} className="space-y-3">
                <h2 className="text-lg font-bold text-text-primary mb-1">
                  {formatDateHeader(dateKey)}
                </h2>
                {dateWorkouts.map((workout) => (
                  <WorkoutItem key={workout.id} workout={workout} />
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


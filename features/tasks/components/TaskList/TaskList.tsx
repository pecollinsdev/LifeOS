'use client';

import React, { useEffect, useMemo } from 'react';
import { useTasks, useTaskStatus, useTaskActions } from '../../store/taskStore';
import { TaskItem } from '../TaskItem/TaskItem';
import { Card, Alert } from '@/shared/components';
import { TaskStatus } from '../../models/Task';

/**
 * TaskList component displays all tasks.
 * 
 * Separates tasks by status and provides a clean mobile-optimized
 * interface for viewing and interacting with tasks.
 * 
 * Performance: Uses selectors and memoization to prevent unnecessary re-renders.
 */
export const TaskList: React.FC = () => {
  // Performance: Use specific selectors instead of entire store
  const tasks = useTasks();
  const { isLoading, error } = useTaskStatus();
  const { loadTasks } = useTaskActions();

  useEffect(() => {
    loadTasks();
    // Performance: loadTasks is stable (from selector), but include it for safety
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Performance: Memoize filtered arrays to prevent recalculation on every render
  const { activeTasks, completedTasks } = useMemo(() => {
    const active = tasks.filter((task) => task.status !== TaskStatus.COMPLETED);
    const completed = tasks.filter((task) => task.status === TaskStatus.COMPLETED);
    return { activeTasks: active, completedTasks: completed };
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-sm text-gray-500">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  return (
    <div className="space-y-6">
      {activeTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">Active Tasks</h2>
          {activeTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-500 dark:text-neutral-400">Completed</h2>
          {completedTasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}

      {tasks.length === 0 && (
        <Alert variant="info">
          <div className="text-center py-4">
            <p>No tasks yet. Create your first task!</p>
          </div>
        </Alert>
      )}
    </div>
  );
};


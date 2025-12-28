'use client';

import React, { memo, useCallback } from 'react';
import { Task } from '../../models/Task';
import { useTaskActions } from '../../store/taskStore';
import { Card } from '@/shared/components';
import { Icon } from '@/shared/components';
import { TaskStatus } from '../../models/Task';

export interface TaskItemProps {
  task: Task;
}

/**
 * TaskItem component displays a single task with actions.
 * 
 * Mobile-optimized with touch-friendly controls and clear
 * visual feedback for task status.
 * 
 * Performance: Memoized to prevent re-renders when parent updates.
 */
export const TaskItem: React.FC<TaskItemProps> = memo(({ task }) => {
  // Performance: Only subscribe to actions, not state
  const { toggleTaskComplete, deleteTask } = useTaskActions();
  const isCompleted = task.status === TaskStatus.COMPLETED;

  // Performance: Memoize callbacks to prevent child re-renders
  const handleToggle = useCallback(() => {
    toggleTaskComplete(task.id);
  }, [task.id, toggleTaskComplete]);

  const handleDelete = useCallback(() => {
    if (confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  }, [task.id, deleteTask]);

  return (
    <Card className={`${isCompleted ? 'opacity-60' : ''}`}>
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          className={`mt-0.5 flex-shrink-0 w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all active:scale-95 ${
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
            className={`font-medium ${
              isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`text-sm mt-1 ${
                isCompleted ? 'text-gray-400' : 'text-gray-600'
              }`}
            >
              {task.description}
            </p>
          )}
          {task.dueDate && (
            <p className="text-xs text-gray-500 mt-2">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>

        <button
          onClick={handleDelete}
          className="flex-shrink-0 w-11 h-11 flex items-center justify-center text-gray-400 hover:text-red-600 active:text-red-700 active:scale-95 transition-all rounded-lg hover:bg-red-50 active:bg-red-100"
          aria-label="Delete task"
        >
          <Icon name="delete" size={20} />
        </button>
      </div>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Performance: Custom comparison - return true if props are equal (skip re-render)
  // Only re-render if task data actually changes
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.status === nextProps.task.status &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.description === nextProps.task.description &&
    prevProps.task.dueDate === nextProps.task.dueDate
  );
});

TaskItem.displayName = 'TaskItem';


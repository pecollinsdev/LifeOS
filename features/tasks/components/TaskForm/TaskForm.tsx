'use client';

import React, { useState } from 'react';
import { useTaskActions } from '../../store/taskStore';
import { Input, Button, Select } from '@/shared/components';
import { TaskPriority, TaskStatus } from '../../models/Task';

export interface TaskFormProps {
  onSuccess?: () => void;
}

/**
 * TaskForm component for creating new tasks.
 * 
 * Mobile-optimized form with appropriate input types and
 * touch-friendly controls.
 */
export const TaskForm: React.FC<TaskFormProps> = ({ onSuccess }) => {
  // Performance: Only subscribe to actions, not state
  const { addTask } = useTaskActions();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    await addTask({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status: TaskStatus.TODO,
      dueDate: dueDate || undefined,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPriority(TaskPriority.MEDIUM);
    setDueDate('');

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title"
        required
        autoFocus
      />

      <Input
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add details..."
      />

      <Select
        label="Priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value as TaskPriority)}
      >
        <option value={TaskPriority.LOW}>Low</option>
        <option value={TaskPriority.MEDIUM}>Medium</option>
        <option value={TaskPriority.HIGH}>High</option>
      </Select>

      <Input
        label="Due Date (optional)"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />

      <Button type="submit" fullWidth>
        Add Task
      </Button>
    </form>
  );
};


'use client';

import React, { useState } from 'react';
import { useHabitActions } from '../../store/habitStore';
import { Input, Button } from '@/shared/components';
import { createHabit } from '../../models/Habit';

export interface HabitFormProps {
  onSuccess?: () => void;
}

/**
 * HabitForm component for creating new habits.
 * 
 * Mobile-optimized form with appropriate input types and
 * touch-friendly controls.
 */
export const HabitForm: React.FC<HabitFormProps> = ({ onSuccess }) => {
  // Performance: Only subscribe to actions, not state
  const { addHabit } = useHabitActions();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const newHabit = createHabit(name.trim(), {
      description: description.trim() || undefined,
      frequency: 'daily',
      streak: 0,
      bestStreak: 0,
      completedDates: [],
    });

    await addHabit(newHabit);

    // Reset form
    setName('');
    setDescription('');

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Habit Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Brush teeth, Take vitamins"
        required
        autoFocus
      />

      <Input
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add details about this habit..."
      />

      <Button type="submit" fullWidth>
        Create Habit
      </Button>
    </form>
  );
};


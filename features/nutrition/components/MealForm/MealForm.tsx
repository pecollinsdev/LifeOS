'use client';

import React, { useState } from 'react';
import { useNutritionActions } from '../../store/nutritionStore';
import { Input, Button, Select } from '@/shared/components';
import { MealType, createMeal } from '../../models/Meal';

export interface MealFormProps {
  onSuccess?: () => void;
}

/**
 * MealForm component for creating new meals.
 * 
 * Mobile-optimized form with appropriate input types and
 * touch-friendly controls for adding meals with macro tracking.
 */
export const MealForm: React.FC<MealFormProps> = ({ onSuccess }) => {
  // Performance: Only subscribe to actions, not state
  const { addMeal } = useNutritionActions();
  const [name, setName] = useState('');
  const [type, setType] = useState<MealType>(MealType.BREAKFAST);
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const getMealTypeLabel = (mealType: MealType): string => {
    const labels: Record<MealType, string> = {
      [MealType.BREAKFAST]: 'Breakfast',
      [MealType.LUNCH]: 'Lunch',
      [MealType.DINNER]: 'Dinner',
      [MealType.SNACK]: 'Snack',
    };
    return labels[mealType] || 'Breakfast';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const caloriesNum = parseFloat(calories);
    if (!calories || isNaN(caloriesNum) || caloriesNum <= 0) {
      alert('Please enter a valid calorie count');
      return;
    }

    const meal = createMeal(name.trim(), caloriesNum, {
      type,
      protein: protein ? parseFloat(protein) : undefined,
      carbs: carbs ? parseFloat(carbs) : undefined,
      fats: fats ? parseFloat(fats) : undefined,
      date,
      notes: notes.trim() || undefined,
    });

    await addMeal(meal);

    // Reset form
    setName('');
    setType(MealType.BREAKFAST);
    setCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Meal Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Grilled Chicken Salad"
        required
        autoFocus
      />

      <Select
        label="Meal Type"
        value={type}
        onChange={(e) => setType(e.target.value as MealType)}
      >
        <option value={MealType.BREAKFAST}>Breakfast</option>
        <option value={MealType.LUNCH}>Lunch</option>
        <option value={MealType.DINNER}>Dinner</option>
        <option value={MealType.SNACK}>Snack</option>
      </Select>

      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <Input
        label="Calories"
        type="number"
        step="1"
        min="0"
        value={calories}
        onChange={(e) => setCalories(e.target.value)}
        placeholder="500"
        required
      />

      <div className="grid grid-cols-3 gap-3">
        <Input
          label="Protein (g)"
          type="number"
          step="0.1"
          min="0"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          placeholder="0"
        />
        <Input
          label="Carbs (g)"
          type="number"
          step="0.1"
          min="0"
          value={carbs}
          onChange={(e) => setCarbs(e.target.value)}
          placeholder="0"
        />
        <Input
          label="Fats (g)"
          type="number"
          step="0.1"
          min="0"
          value={fats}
          onChange={(e) => setFats(e.target.value)}
          placeholder="0"
        />
      </div>

      <Input
        label="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Any additional notes..."
      />

      <Button type="submit" fullWidth>
        Add Meal
      </Button>
    </form>
  );
};


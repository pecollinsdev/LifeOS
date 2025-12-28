'use client';

import React, { useState } from 'react';
import { useFitnessActions } from '../../store/fitnessStore';
import { Input, Button, Select, Icon } from '@/shared/components';
import {
  WorkoutType,
  createWorkout,
  createExercise,
  createExerciseSet,
  Exercise,
} from '../../models/Workout';

export interface WorkoutFormProps {
  onSuccess?: () => void;
}

/**
 * WorkoutForm component for creating new workouts.
 * 
 * Mobile-optimized form that adapts based on workout type:
 * - Strength: Exercises with sets, reps, weight
 * - Cardio: Duration/time
 * 
 * Touch-friendly controls for mobile devices.
 */
export const WorkoutForm: React.FC<WorkoutFormProps> = ({ onSuccess }) => {
  // Performance: Only subscribe to actions, not state
  const { addWorkout } = useFitnessActions();
  const [name, setName] = useState('');
  const [type, setType] = useState<WorkoutType>(WorkoutType.STRENGTH);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // For strength training
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseName, setCurrentExerciseName] = useState('');
  const [currentSets, setCurrentSets] = useState<Array<{ reps?: string; weight?: string }>>([{}]);
  
  // For cardio/time-based
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');

  const isStrength = type === WorkoutType.STRENGTH;

  const handleAddExercise = () => {
    if (!currentExerciseName.trim()) return;

    const sets = currentSets
      .filter((s) => s.reps || s.weight)
      .map((s) =>
        createExerciseSet({
          reps: s.reps ? parseInt(s.reps) : undefined,
          weight: s.weight ? parseFloat(s.weight) : undefined,
        })
      );

    if (sets.length === 0) {
      alert('Please add at least one set with reps or weight');
      return;
    }

    const exercise = createExercise(currentExerciseName.trim(), { sets });
    setExercises([...exercises, exercise]);
    setCurrentExerciseName('');
    setCurrentSets([{}]);
  };

  const handleAddSet = () => {
    setCurrentSets([...currentSets, {}]);
  };

  const handleRemoveSet = (index: number) => {
    setCurrentSets(currentSets.filter((_, i) => i !== index));
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    if (isStrength && exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    if (!isStrength && (!duration || parseFloat(duration) <= 0)) {
      alert('Please enter a valid duration');
      return;
    }

    const workout = createWorkout(name.trim(), type, {
      exercises: isStrength ? exercises : undefined,
      duration: !isStrength ? parseFloat(duration) : undefined,
      calories: calories ? parseFloat(calories) : undefined,
      notes: notes.trim() || undefined,
      date,
    });

    await addWorkout(workout);

    // Reset form
    setName('');
    setType(WorkoutType.STRENGTH);
    setDate(new Date().toISOString().split('T')[0]);
    setExercises([]);
    setCurrentExerciseName('');
    setCurrentSets([{}]);
    setDuration('');
    setCalories('');
    setNotes('');

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Workout Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g., Morning Run, Upper Body"
        required
        autoFocus
      />

      <Select
        label="Workout Type"
        value={type}
        onChange={(e) => {
          const newType = e.target.value as WorkoutType;
          setType(newType);
          // Reset type-specific fields
          if (newType !== WorkoutType.STRENGTH) {
            setExercises([]);
          } else {
            setDuration('');
          }
        }}
      >
        <option value={WorkoutType.STRENGTH}>Strength</option>
        <option value={WorkoutType.CARDIO}>Cardio</option>
        <option value={WorkoutType.FLEXIBILITY}>Flexibility</option>
        <option value={WorkoutType.OTHER}>Other</option>
      </Select>

      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      {isStrength ? (
        <div className="space-y-5">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Exercises</h3>
            
            {/* Add Exercise Section */}
            <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
              <Input
                label="Exercise Name"
                value={currentExerciseName}
                onChange={(e) => setCurrentExerciseName(e.target.value)}
                placeholder="e.g., Bench Press, Squats"
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Sets</label>
                {currentSets.map((set, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="Reps"
                      value={set.reps || ''}
                      onChange={(e) => {
                        const newSets = [...currentSets];
                        newSets[index] = { ...newSets[index], reps: e.target.value };
                        setCurrentSets(newSets);
                      }}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      step="0.5"
                      placeholder="Weight (lbs)"
                      value={set.weight || ''}
                      onChange={(e) => {
                        const newSets = [...currentSets];
                        newSets[index] = { ...newSets[index], weight: e.target.value };
                        setCurrentSets(newSets);
                      }}
                      className="flex-1"
                    />
                    {currentSets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSet(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Icon name="delete" size={18} />
                      </button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSet}
                >
                  Add Set
                </Button>
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={handleAddExercise}
                disabled={!currentExerciseName.trim()}
              >
                Add Exercise
              </Button>
            </div>

            {/* Added Exercises */}
            {exercises.length > 0 && (
              <div className="space-y-2">
                {exercises.map((exercise, exIndex) => (
                  <div key={exIndex} className="p-3 bg-white border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{exercise.name}</h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(exIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Icon name="delete" size={16} />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      {exercise.sets.map((set, setIndex) => (
                        <div key={setIndex}>
                          Set {setIndex + 1}: {set.reps || '-'} reps
                          {set.weight && ` × ${set.weight} lbs`}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <Input
            label="Duration (minutes)"
            type="number"
            step="1"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="30"
            required
          />

          <Input
            label="Calories (optional)"
            type="number"
            step="1"
            min="0"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="300"
          />
        </div>
      )}

      <Input
        label="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="How did it feel? Any notes..."
      />

      <Button type="submit" fullWidth>
        Save Workout
      </Button>
    </form>
  );
};


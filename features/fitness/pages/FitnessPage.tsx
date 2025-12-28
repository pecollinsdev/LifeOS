'use client';

import React, { useState, Suspense, lazy } from 'react';
import { WorkoutList } from '../components';
import { Button, Icon, PageHeader, Card } from '@/shared/components';

// Performance: Lazy load WorkoutForm - only loads when form is shown
// Reduces initial bundle size and improves first paint
const WorkoutForm = lazy(() =>
  import('../components/WorkoutForm/WorkoutForm').then((module) => ({
    default: module.WorkoutForm,
  }))
);

/**
 * FitnessPage component - Main page for the Fitness feature.
 * 
 * Provides a complete interface for managing workouts with
 * navigation back to home and workout logging.
 * 
 * Mobile-first design optimized for PWA usage on iPhone.
 */
export const FitnessPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="Fitness"
        showBack
        rightAction={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            <Icon name="plus" size={20} className="mr-1" />
            {showForm ? 'Cancel' : 'Log Workout'}
          </Button>
        }
      />

      <main className="max-w-2xl mx-auto px-5 py-6 space-y-5">
        {showForm && (
          <Card>
            <Suspense
              fallback={
                <div className="flex justify-center items-center py-8">
                  <p className="text-sm text-text-tertiary">Loading form...</p>
                </div>
              }
            >
              <WorkoutForm onSuccess={() => setShowForm(false)} />
            </Suspense>
          </Card>
        )}

        <div>
          <h2 className="text-lg font-bold text-text-primary mb-4">
            Workouts
          </h2>
          <WorkoutList />
        </div>
      </main>
    </div>
  );
};


'use client';

import React, { useState, Suspense, lazy } from 'react';
import { HabitList } from '../components';
import { DateTestControls } from '../components/DateTestControls';
import { Button, Icon, PageHeader, Card } from '@/shared/components';

// Performance: Lazy load HabitForm - only loads when form is shown
// Reduces initial bundle size and improves first paint
const HabitForm = lazy(() =>
  import('../components/HabitForm/HabitForm').then((module) => ({
    default: module.HabitForm,
  }))
);

/**
 * HabitsPage component - Main page for the Habits feature.
 * 
 * Provides a complete interface for managing habits with
 * navigation back to home and habit creation.
 * 
 * Mobile-first design optimized for PWA usage on iPhone.
 */
export const HabitsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="Habits"
        showBack
        rightAction={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            <Icon name="plus" size={20} className="mr-1" />
            {showForm ? 'Cancel' : 'New'}
          </Button>
        }
      />

      <main className="max-w-2xl mx-auto px-5 py-6 space-y-5">
        <DateTestControls />
        
        {showForm && (
          <Card>
            <Suspense
              fallback={
                <div className="flex justify-center items-center py-8">
                  <p className="text-sm text-text-tertiary">Loading form...</p>
                </div>
              }
            >
              <HabitForm onSuccess={() => setShowForm(false)} />
            </Suspense>
          </Card>
        )}

        <HabitList />
      </main>
    </div>
  );
};


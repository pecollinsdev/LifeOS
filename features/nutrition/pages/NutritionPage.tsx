'use client';

import React, { useState, Suspense, lazy } from 'react';
import { MealList, DailyMacrosDisplay } from '../components';
import { Button, Icon, PageHeader, Card } from '@/shared/components';

// Performance: Lazy load MealForm - only loads when form is shown
// Reduces initial bundle size and improves first paint
const MealForm = lazy(() =>
  import('../components/MealForm/MealForm').then((module) => ({
    default: module.MealForm,
  }))
);

/**
 * NutritionPage component - Main page for the Nutrition feature.
 * 
 * Provides a complete interface for managing meals with
 * navigation back to home and meal logging.
 * 
 * Mobile-first design optimized for PWA usage on iPhone.
 */
export const NutritionPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="Nutrition"
        showBack
        rightAction={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            <Icon name="plus" size={20} className="mr-1" />
            {showForm ? 'Cancel' : 'Add Meal'}
          </Button>
        }
      />

      <main className="max-w-2xl mx-auto px-5 py-6 space-y-5">
        <DailyMacrosDisplay />

        {showForm && (
          <Card>
            <Suspense
              fallback={
                <div className="flex justify-center items-center py-8">
                  <p className="text-sm text-text-tertiary">Loading form...</p>
                </div>
              }
            >
              <MealForm onSuccess={() => setShowForm(false)} />
            </Suspense>
          </Card>
        )}

        <div>
          <h2 className="text-lg font-bold text-text-primary mb-4">
            Today's Meals
          </h2>
          <MealList />
        </div>
      </main>
    </div>
  );
};


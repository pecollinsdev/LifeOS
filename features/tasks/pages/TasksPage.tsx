'use client';

import React, { useState, Suspense, lazy } from 'react';
import { TaskList } from '../components';
import { Button, Icon, PageHeader, Card } from '@/shared/components';

// Performance: Lazy load TaskForm - only loads when form is shown
// Reduces initial bundle size and improves first paint
const TaskForm = lazy(() => 
  import('../components/TaskForm/TaskForm').then(module => ({ 
    default: module.TaskForm 
  }))
);

/**
 * TasksPage component - Main page for the Tasks feature.
 * 
 * Provides a complete interface for managing tasks with
 * navigation back to home and task creation.
 */
export const TasksPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="Tasks"
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
        {showForm && (
          <Card>
            <Suspense fallback={
              <div className="flex justify-center items-center py-8">
                <p className="text-sm text-text-tertiary">Loading form...</p>
              </div>
            }>
              <TaskForm onSuccess={() => setShowForm(false)} />
            </Suspense>
          </Card>
        )}

        <TaskList />
      </main>
    </div>
  );
};


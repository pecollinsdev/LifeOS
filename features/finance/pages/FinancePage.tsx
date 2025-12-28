'use client';

import React, { useState, Suspense, lazy } from 'react';
import { TransactionList, BalanceDisplay } from '../components';
import { Button, Icon, PageHeader, Card } from '@/shared/components';

// Performance: Lazy load TransactionForm - only loads when form is shown
// Reduces initial bundle size and improves first paint
const TransactionForm = lazy(() =>
  import('../components/TransactionForm/TransactionForm').then((module) => ({
    default: module.TransactionForm,
  }))
);

/**
 * FinancePage component - Main page for the Finance feature.
 * 
 * Provides a complete interface for managing financial transactions with
 * balance display, transaction list, and transaction creation.
 * 
 * Mobile-first design optimized for PWA usage on iPhone.
 */
export const FinancePage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-24">
      <PageHeader
        title="Finance"
        showBack
        rightAction={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            <Icon name="plus" size={20} className="mr-1" />
            {showForm ? 'Cancel' : 'Add'}
          </Button>
        }
      />

      <main className="max-w-2xl mx-auto px-5 py-6 space-y-5">
        <BalanceDisplay />

        {showForm && (
          <Card>
            <Suspense
              fallback={
                <div className="flex justify-center items-center py-8">
                  <p className="text-sm text-text-tertiary">Loading form...</p>
                </div>
              }
            >
              <TransactionForm onSuccess={() => setShowForm(false)} />
            </Suspense>
          </Card>
        )}

        <div>
          <h2 className="text-lg font-bold text-text-primary mb-4">
            Transactions
          </h2>
          <TransactionList />
        </div>
      </main>
    </div>
  );
};


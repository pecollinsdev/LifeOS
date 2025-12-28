'use client';

import React, { useEffect } from 'react';
import { useTransactions, useFinanceStatus, useFinanceActions } from '../../store/financeStore';
import { TransactionItem } from '../TransactionItem/TransactionItem';
import { Alert } from '@/shared/components';

/**
 * TransactionList component displays all transactions.
 * 
 * Shows transactions sorted by date (newest first) and provides a clean
 * mobile-optimized interface for viewing transactions.
 * 
 * Performance: Uses selectors to prevent unnecessary re-renders.
 */
export const TransactionList: React.FC = () => {
  // Performance: Use specific selectors instead of entire store
  const transactions = useTransactions();
  const { isLoading, error } = useFinanceStatus();
  const { loadTransactions } = useFinanceActions();

  useEffect(() => {
    loadTransactions();
    // Performance: loadTransactions is stable (from selector), but include it for safety
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <p className="text-sm text-text-tertiary">Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  return (
    <div className="space-y-3">
      {transactions.length === 0 ? (
        <Alert variant="info">
          <div className="text-center py-4">
            <p className="font-medium">No transactions yet. Add your first transaction to start tracking!</p>
          </div>
        </Alert>
      ) : (
        transactions.map((transaction) => (
          <TransactionItem key={transaction.id} transaction={transaction} />
        ))
      )}
    </div>
  );
};


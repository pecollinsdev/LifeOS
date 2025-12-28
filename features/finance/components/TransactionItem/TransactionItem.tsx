'use client';

import React, { memo, useCallback } from 'react';
import { Transaction, TransactionType, TransactionCategory } from '../../models/Transaction';
import { useFinanceActions } from '../../store/financeStore';
import { Card, Icon, Badge } from '@/shared/components';

export interface TransactionItemProps {
  transaction: Transaction;
}

/**
 * TransactionItem component displays a single transaction.
 * 
 * Mobile-optimized with touch-friendly controls and clear
 * visual feedback for transaction type and category.
 * 
 * Performance: Memoized to prevent re-renders when parent updates.
 */
export const TransactionItem: React.FC<TransactionItemProps> = memo(({ transaction }) => {
  // Performance: Only subscribe to actions, not state
  const { deleteTransaction } = useFinanceActions();

  // Performance: Memoize callbacks to prevent child re-renders
  const handleDelete = useCallback(() => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(transaction.id);
    }
  }, [transaction.id, deleteTransaction]);

  const getCategoryLabel = (cat: TransactionCategory): string => {
    const labels: Record<TransactionCategory, string> = {
      [TransactionCategory.FOOD]: 'Food',
      [TransactionCategory.TRANSPORT]: 'Transport',
      [TransactionCategory.ENTERTAINMENT]: 'Entertainment',
      [TransactionCategory.BILLS]: 'Bills',
      [TransactionCategory.RENT]: 'Rent',
      [TransactionCategory.SHOPPING]: 'Shopping',
      [TransactionCategory.HEALTHCARE]: 'Healthcare',
      [TransactionCategory.EDUCATION]: 'Education',
      [TransactionCategory.SALARY]: 'Salary',
      [TransactionCategory.FREELANCE]: 'Freelance',
      [TransactionCategory.INVESTMENT]: 'Investment',
      [TransactionCategory.GIFT]: 'Gift',
      [TransactionCategory.OTHER]: 'Other',
    };
    return labels[cat] || 'Other';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
    });
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const isIncome = transaction.type === TransactionType.INCOME;

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
            isIncome
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          <span className="text-lg font-bold">
            {isIncome ? '+' : '-'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-text-primary truncate">
              {transaction.description || getCategoryLabel(transaction.category)}
            </h3>
            <span
              className={`font-bold text-lg flex-shrink-0 ${
                isIncome 
                  ? 'text-green-600' 
                  : 'text-red-600'
              }`}
            >
              {isIncome ? '+' : '-'}
              {formatAmount(transaction.amount)}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={isIncome ? 'success' : 'secondary'} size="sm">
              {getCategoryLabel(transaction.category)}
            </Badge>
            <span className="text-xs text-text-tertiary">
              {formatDate(transaction.date)}
            </span>
          </div>
        </div>

        <button
          onClick={handleDelete}
          className="flex-shrink-0 w-11 h-11 flex items-center justify-center text-gray-400 hover:text-red-600 active:text-red-700 active:scale-95 transition-all duration-150 rounded-xl hover:bg-red-50 active:bg-red-100"
          aria-label="Delete transaction"
        >
          <Icon name="delete" size={20} />
        </button>
      </div>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Performance: Custom comparison - return true if props are equal (skip re-render)
  return (
    prevProps.transaction.id === nextProps.transaction.id &&
    prevProps.transaction.amount === nextProps.transaction.amount &&
    prevProps.transaction.type === nextProps.transaction.type &&
    prevProps.transaction.category === nextProps.transaction.category &&
    prevProps.transaction.description === nextProps.transaction.description &&
    prevProps.transaction.date === nextProps.transaction.date
  );
});

TransactionItem.displayName = 'TransactionItem';


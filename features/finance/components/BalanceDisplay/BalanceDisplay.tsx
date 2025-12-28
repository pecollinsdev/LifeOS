'use client';

import React from 'react';
import { useBalance } from '../../store/financeStore';
import { Card } from '@/shared/components';

/**
 * BalanceDisplay component shows the current balance and totals.
 * 
 * Displays total balance, income, and expenses in a mobile-optimized
 * card layout with clear visual hierarchy.
 */
export const BalanceDisplay: React.FC = () => {
  const { balance, totalIncome, totalExpenses } = useBalance();

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
      <div className="space-y-4">
        {/* Total Balance */}
        <div className="text-center">
          <p className="text-sm font-semibold text-text-secondary mb-1">Total Balance</p>
          <p
            className={`text-4xl font-bold ${
              balance >= 0 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}
          >
            {formatCurrency(balance)}
          </p>
        </div>

        {/* Income and Expenses */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-primary-200">
          <div className="text-center">
            <p className="text-xs text-text-tertiary mb-1 font-medium">Income</p>
            <p className="text-xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-text-tertiary mb-1 font-medium">Expenses</p>
            <p className="text-xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};


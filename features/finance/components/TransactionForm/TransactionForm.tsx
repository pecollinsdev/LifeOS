'use client';

import React, { useState } from 'react';
import { useFinanceActions } from '../../store/financeStore';
import { Input, Button, Select } from '@/shared/components';
import {
  TransactionType,
  TransactionCategory,
  createTransaction,
} from '../../models/Transaction';

export interface TransactionFormProps {
  onSuccess?: () => void;
}

/**
 * TransactionForm component for creating new transactions.
 * 
 * Mobile-optimized form with appropriate input types and
 * touch-friendly controls for adding income or expenses.
 */
export const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess }) => {
  // Performance: Only subscribe to actions, not state
  const { addTransaction } = useFinanceActions();
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<TransactionCategory>(TransactionCategory.OTHER);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  // Get appropriate categories based on transaction type
  const getCategoriesForType = (transactionType: TransactionType): TransactionCategory[] => {
    if (transactionType === TransactionType.INCOME) {
      return [
        TransactionCategory.SALARY,
        TransactionCategory.FREELANCE,
        TransactionCategory.INVESTMENT,
        TransactionCategory.GIFT,
        TransactionCategory.OTHER,
      ];
    } else {
      return [
        TransactionCategory.FOOD,
        TransactionCategory.TRANSPORT,
        TransactionCategory.ENTERTAINMENT,
        TransactionCategory.BILLS,
        TransactionCategory.RENT,
        TransactionCategory.SHOPPING,
        TransactionCategory.HEALTHCARE,
        TransactionCategory.EDUCATION,
        TransactionCategory.OTHER,
      ];
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const amountNum = parseFloat(amount);
    if (!amount || isNaN(amountNum) || amountNum <= 0) {
      return;
    }

    const transaction = createTransaction(type, amountNum, {
      category,
      description: description.trim() || undefined,
      date,
    });

    await addTransaction(transaction);

    // Reset form
    setAmount('');
    setDescription('');
    setCategory(TransactionCategory.OTHER);
    setDate(new Date().toISOString().split('T')[0]);

    onSuccess?.();
  };

  const availableCategories = getCategoriesForType(type);

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Select
        label="Type"
        value={type}
        onChange={(e) => {
          const newType = e.target.value as TransactionType;
          setType(newType);
          // Reset category when type changes
          const newCategories = getCategoriesForType(newType);
          if (!newCategories.includes(category)) {
            setCategory(newCategories[0]);
          }
        }}
      >
        <option value={TransactionType.INCOME}>Income</option>
        <option value={TransactionType.EXPENSE}>Expense</option>
      </Select>

      <Input
        label="Amount"
        type="number"
        step="0.01"
        min="0.01"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
        required
        autoFocus
      />

      <Select
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value as TransactionCategory)}
      >
        {availableCategories.map((cat) => (
          <option key={cat} value={cat}>
            {getCategoryLabel(cat)}
          </option>
        ))}
      </Select>

      <Input
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Add a note..."
      />

      <Input
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <Button type="submit" fullWidth>
        Add {type === TransactionType.INCOME ? 'Income' : 'Expense'}
      </Button>
    </form>
  );
};


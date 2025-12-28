import { IStorable } from '@/lib/storage';

/**
 * Transaction type.
 */
export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

/**
 * Transaction category.
 */
export enum TransactionCategory {
  FOOD = 'food',
  TRANSPORT = 'transport',
  ENTERTAINMENT = 'entertainment',
  BILLS = 'bills',
  SHOPPING = 'shopping',
  SALARY = 'salary',
  OTHER = 'other',
}

/**
 * Transaction model representing a single financial transaction.
 * 
 * This is the core domain model for the Finance feature.
 */
export interface Transaction extends IStorable {
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  date: string; // ISO date string
}

/**
 * Creates a new transaction with default values.
 */
export function createTransaction(
  type: TransactionType,
  amount: number,
  overrides?: Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'type' | 'amount'>>
): Transaction {
  const now = new Date().toISOString();
  return {
    id: '',
    type,
    amount,
    category: TransactionCategory.OTHER,
    description: '',
    date: now,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}


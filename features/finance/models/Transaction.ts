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
  // Expenses
  FOOD = 'food',
  TRANSPORT = 'transport',
  ENTERTAINMENT = 'entertainment',
  BILLS = 'bills',
  RENT = 'rent',
  SHOPPING = 'shopping',
  HEALTHCARE = 'healthcare',
  EDUCATION = 'education',
  // Income
  SALARY = 'salary',
  FREELANCE = 'freelance',
  INVESTMENT = 'investment',
  GIFT = 'gift',
  // Other
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
 * 
 * @param type - Transaction type (income or expense)
 * @param amount - Transaction amount (positive number)
 * @param overrides - Optional properties to override defaults
 * @returns A new Transaction object
 */
export function createTransaction(
  type: TransactionType,
  amount: number,
  overrides?: Partial<Omit<Transaction, 'id' | 'createdAt' | 'updatedAt' | 'type' | 'amount'>>
): Transaction {
  const now = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0];
  return {
    id: '',
    type,
    amount: Math.abs(amount), // Ensure positive
    category: TransactionCategory.OTHER,
    description: '',
    date: today,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

/**
 * Recurrence frequency for recurring transactions.
 */
export enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

/**
 * Recurring transaction model.
 * 
 * Defines a template for transactions that repeat automatically.
 */
export interface RecurringTransaction extends IStorable {
  type: TransactionType;
  amount: number;
  category: TransactionCategory;
  description: string;
  frequency: RecurrenceFrequency;
  startDate: string; // ISO date string (YYYY-MM-DD)
  endDate?: string; // ISO date string (YYYY-MM-DD), optional
  lastProcessedDate?: string; // ISO date string (YYYY-MM-DD)
  isActive: boolean;
}

/**
 * Creates a new recurring transaction with default values.
 * 
 * @param type - Transaction type (income or expense)
 * @param amount - Transaction amount
 * @param frequency - How often the transaction repeats
 * @param overrides - Optional properties to override defaults
 * @returns A new RecurringTransaction object
 */
export function createRecurringTransaction(
  type: TransactionType,
  amount: number,
  frequency: RecurrenceFrequency,
  overrides?: Partial<Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt' | 'type' | 'amount' | 'frequency'>>
): RecurringTransaction {
  const now = new Date().toISOString();
  const today = new Date().toISOString().split('T')[0];
  return {
    id: '',
    type,
    amount: Math.abs(amount),
    category: TransactionCategory.OTHER,
    description: '',
    frequency,
    startDate: today,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}


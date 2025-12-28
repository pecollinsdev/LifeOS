import { IStorage } from '@/lib/storage';
import {
  Transaction,
  TransactionType,
  RecurringTransaction,
  createTransaction,
} from '../models/Transaction';
import { generateId } from '@/lib/utils/uuid';

/**
 * Service layer for transaction operations.
 * 
 * Encapsulates all business logic related to transactions and acts as
 * an interface between the UI and storage layer.
 * 
 * Handles balance calculations and transaction management.
 */
export class TransactionService {
  constructor(
    private transactionStorage: IStorage<Transaction>,
    private recurringStorage: IStorage<RecurringTransaction>
  ) {}

  /**
   * Retrieves all transactions.
   * Filters out recurring transactions by checking for the 'frequency' field.
   * @returns Promise resolving to an array of all transactions, sorted by date (newest first)
   */
  async getAllTransactions(): Promise<Transaction[]> {
    const allItems = await this.transactionStorage.getAll();
    // Filter to only get Transaction objects (not RecurringTransaction)
    // RecurringTransaction has 'frequency' field, Transaction doesn't
    const transactions = allItems.filter(
      (item): item is Transaction => !('frequency' in item)
    ) as Transaction[];
    // Sort by date descending (newest first)
    return transactions.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
  }

  /**
   * Retrieves a transaction by its ID.
   * @param id - The transaction ID
   * @returns Promise resolving to the transaction or undefined
   */
  async getTransactionById(id: string): Promise<Transaction | undefined> {
    return this.transactionStorage.getById(id);
  }

  /**
   * Creates a new transaction.
   * @param transaction - The transaction to create (id will be generated)
   * @returns Promise resolving to the created transaction
   */
  async createTransaction(
    transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Transaction> {
    const now = new Date().toISOString();
    const transactionWithId: Transaction = {
      ...transaction,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    return this.transactionStorage.save(transactionWithId);
  }

  /**
   * Updates an existing transaction.
   * @param transaction - The transaction with updated properties
   * @returns Promise resolving to the updated transaction
   */
  async updateTransaction(transaction: Transaction): Promise<Transaction> {
    return this.transactionStorage.save(transaction);
  }

  /**
   * Deletes a transaction.
   * @param id - The ID of the transaction to delete
   * @returns Promise resolving to true if deleted, false otherwise
   */
  async deleteTransaction(id: string): Promise<boolean> {
    return this.transactionStorage.delete(id);
  }

  /**
   * Calculates the total balance from all transactions.
   * Income adds to balance, expenses subtract from balance.
   * 
   * @returns Promise resolving to the total balance
   */
  async calculateBalance(): Promise<number> {
    const transactions = await this.getAllTransactions();
    return transactions.reduce((balance, transaction) => {
      if (transaction.type === TransactionType.INCOME) {
        return balance + transaction.amount;
      } else {
        return balance - transaction.amount;
      }
    }, 0);
  }

  /**
   * Gets total income.
   * @returns Promise resolving to total income amount
   */
  async getTotalIncome(): Promise<number> {
    const transactions = await this.getAllTransactions();
    return transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  /**
   * Gets total expenses.
   * @returns Promise resolving to total expense amount
   */
  async getTotalExpenses(): Promise<number> {
    const transactions = await this.getAllTransactions();
    return transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
  }

  /**
   * Gets transactions filtered by category.
   * @param category - The category to filter by
   * @returns Promise resolving to filtered transactions
   */
  async getTransactionsByCategory(category: Transaction['category']): Promise<Transaction[]> {
    const transactions = await this.getAllTransactions();
    return transactions.filter((t) => t.category === category);
  }

  /**
   * Gets transactions filtered by type.
   * @param type - The type to filter by (income or expense)
   * @returns Promise resolving to filtered transactions
   */
  async getTransactionsByType(type: TransactionType): Promise<Transaction[]> {
    const transactions = await this.getAllTransactions();
    return transactions.filter((t) => t.type === type);
  }

  // Recurring Transactions

  /**
   * Retrieves all recurring transactions.
   * Filters to only get RecurringTransaction objects by checking for the 'frequency' field.
   * @returns Promise resolving to an array of all recurring transactions
   */
  async getAllRecurringTransactions(): Promise<RecurringTransaction[]> {
    const allItems = await this.recurringStorage.getAll();
    // Filter to only get RecurringTransaction objects
    // RecurringTransaction has 'frequency' field
    return allItems.filter(
      (item): item is RecurringTransaction => 'frequency' in item
    ) as RecurringTransaction[];
  }

  /**
   * Creates a new recurring transaction.
   * @param recurring - The recurring transaction to create
   * @returns Promise resolving to the created recurring transaction
   */
  async createRecurringTransaction(
    recurring: Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RecurringTransaction> {
    const now = new Date().toISOString();
    const recurringWithId: RecurringTransaction = {
      ...recurring,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    return this.recurringStorage.save(recurringWithId);
  }

  /**
   * Updates an existing recurring transaction.
   * @param recurring - The recurring transaction with updated properties
   * @returns Promise resolving to the updated recurring transaction
   */
  async updateRecurringTransaction(
    recurring: RecurringTransaction
  ): Promise<RecurringTransaction> {
    return this.recurringStorage.save(recurring);
  }

  /**
   * Deletes a recurring transaction.
   * @param id - The ID of the recurring transaction to delete
   * @returns Promise resolving to true if deleted, false otherwise
   */
  async deleteRecurringTransaction(id: string): Promise<boolean> {
    return this.recurringStorage.delete(id);
  }
}


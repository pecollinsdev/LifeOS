import { create } from 'zustand';
import { Transaction, TransactionType } from '../models/Transaction';
import { RecurringTransaction } from '../models/Transaction';
import { TransactionService } from '../services/TransactionService';
import { StorageFactory } from '@/lib/storage';

/**
 * State interface for the finance store.
 */
interface FinanceState {
  transactions: Transaction[];
  recurringTransactions: RecurringTransaction[];
  balance: number;
  totalIncome: number;
  totalExpenses: number;
  isLoading: boolean;
  error: string | null;
}

/**
 * Actions interface for the finance store.
 */
interface FinanceActions {
  // State management
  setTransactions: (transactions: Transaction[]) => void;
  setRecurringTransactions: (recurring: RecurringTransaction[]) => void;
  setBalance: (balance: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Transaction operations
  loadTransactions: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  refreshBalance: () => Promise<void>;

  // Recurring transaction operations
  loadRecurringTransactions: () => Promise<void>;
  addRecurringTransaction: (recurring: Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRecurringTransaction: (recurring: RecurringTransaction) => Promise<void>;
  deleteRecurringTransaction: (id: string) => Promise<void>;
}

/**
 * Combined store interface.
 */
type FinanceStore = FinanceState & FinanceActions;

/**
 * Zustand store for finance state management.
 * 
 * Provides reactive state management for transactions with async operations.
 * The service layer handles persistence, while the store manages UI state.
 * 
 * Performance: Uses selectors to prevent unnecessary re-renders.
 */
const store = create<FinanceStore>((set, get) => {
  const service = new TransactionService(
    StorageFactory.create<Transaction>('finances'),
    StorageFactory.create<RecurringTransaction>('finances') // Note: Using same store name, but different types
  );

  return {
    // Initial state
    transactions: [],
    recurringTransactions: [],
    balance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    isLoading: false,
    error: null,

    // State setters
    setTransactions: (transactions) => set({ transactions }),
    setRecurringTransactions: (recurringTransactions) => set({ recurringTransactions }),
    setBalance: (balance) => set({ balance }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // Load all transactions from storage
    loadTransactions: async () => {
      set({ isLoading: true, error: null });
      try {
        const transactions = await service.getAllTransactions();
        const totalIncome = await service.getTotalIncome();
        const totalExpenses = await service.getTotalExpenses();
        const balance = await service.calculateBalance();
        set({
          transactions,
          totalIncome,
          totalExpenses,
          balance,
          isLoading: false,
        });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to load transactions',
          isLoading: false,
        });
      }
    },

    // Add a new transaction
    addTransaction: async (transaction) => {
      set({ isLoading: true, error: null });
      try {
        const newTransaction = await service.createTransaction(transaction);
        const totalIncome = await service.getTotalIncome();
        const totalExpenses = await service.getTotalExpenses();
        const balance = await service.calculateBalance();
        set((state) => ({
          transactions: [newTransaction, ...state.transactions],
          totalIncome,
          totalExpenses,
          balance,
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to add transaction',
          isLoading: false,
        });
      }
    },

    // Update an existing transaction
    updateTransaction: async (transaction) => {
      set({ isLoading: true, error: null });
      try {
        const updatedTransaction = await service.updateTransaction(transaction);
        const totalIncome = await service.getTotalIncome();
        const totalExpenses = await service.getTotalExpenses();
        const balance = await service.calculateBalance();
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === transaction.id ? updatedTransaction : t
          ),
          totalIncome,
          totalExpenses,
          balance,
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to update transaction',
          isLoading: false,
        });
      }
    },

    // Delete a transaction
    deleteTransaction: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await service.deleteTransaction(id);
        const totalIncome = await service.getTotalIncome();
        const totalExpenses = await service.getTotalExpenses();
        const balance = await service.calculateBalance();
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
          totalIncome,
          totalExpenses,
          balance,
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to delete transaction',
          isLoading: false,
        });
      }
    },

    // Refresh balance and totals
    refreshBalance: async () => {
      try {
        const totalIncome = await service.getTotalIncome();
        const totalExpenses = await service.getTotalExpenses();
        const balance = await service.calculateBalance();
        set({ totalIncome, totalExpenses, balance });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to refresh balance',
        });
      }
    },

    // Load all recurring transactions
    loadRecurringTransactions: async () => {
      set({ isLoading: true, error: null });
      try {
        const recurring = await service.getAllRecurringTransactions();
        set({ recurringTransactions: recurring, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to load recurring transactions',
          isLoading: false,
        });
      }
    },

    // Add a new recurring transaction
    addRecurringTransaction: async (recurring) => {
      set({ isLoading: true, error: null });
      try {
        const newRecurring = await service.createRecurringTransaction(recurring);
        set((state) => ({
          recurringTransactions: [...state.recurringTransactions, newRecurring],
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to add recurring transaction',
          isLoading: false,
        });
      }
    },

    // Update an existing recurring transaction
    updateRecurringTransaction: async (recurring) => {
      set({ isLoading: true, error: null });
      try {
        const updatedRecurring = await service.updateRecurringTransaction(recurring);
        set((state) => ({
          recurringTransactions: state.recurringTransactions.map((r) =>
            r.id === recurring.id ? updatedRecurring : r
          ),
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to update recurring transaction',
          isLoading: false,
        });
      }
    },

    // Delete a recurring transaction
    deleteRecurringTransaction: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await service.deleteRecurringTransaction(id);
        set((state) => ({
          recurringTransactions: state.recurringTransactions.filter((r) => r.id !== id),
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to delete recurring transaction',
          isLoading: false,
        });
      }
    },
  };
});

// Performance: Export store with selectors to prevent unnecessary re-renders

/**
 * Hook to get the entire finance store. Use specific selectors when possible.
 */
export const useFinanceStore = store;

/**
 * Selector: Get only the transactions array
 */
export const useTransactions = () => store((state) => state.transactions);

/**
 * Selector: Get balance and totals
 */
export const useBalance = () =>
  store((state) => ({
    balance: state.balance,
    totalIncome: state.totalIncome,
    totalExpenses: state.totalExpenses,
  }));

/**
 * Selector: Get only transaction actions (for components that don't need state)
 */
export const useFinanceActions = () =>
  store((state) => ({
    loadTransactions: state.loadTransactions,
    addTransaction: state.addTransaction,
    updateTransaction: state.updateTransaction,
    deleteTransaction: state.deleteTransaction,
    refreshBalance: state.refreshBalance,
    loadRecurringTransactions: state.loadRecurringTransactions,
    addRecurringTransaction: state.addRecurringTransaction,
    updateRecurringTransaction: state.updateRecurringTransaction,
    deleteRecurringTransaction: state.deleteRecurringTransaction,
  }));

/**
 * Selector: Get loading and error state
 */
export const useFinanceStatus = () =>
  store((state) => ({
    isLoading: state.isLoading,
    error: state.error,
  }));

/**
 * Selector: Get recurring transactions
 */
export const useRecurringTransactions = () =>
  store((state) => state.recurringTransactions);


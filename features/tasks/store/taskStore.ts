import { create } from 'zustand';
import { Task } from '../models/Task';
import { TaskService } from '../services/TaskService';
import { StorageFactory } from '@/lib/storage';

/**
 * State interface for the task store.
 */
interface TaskState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Actions interface for the task store.
 */
interface TaskActions {
  // State management
  setTasks: (tasks: Task[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Task operations
  loadTasks: () => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
}

/**
 * Combined store interface.
 */
type TaskStore = TaskState & TaskActions;

/**
 * Zustand store for task state management.
 * 
 * Provides reactive state management for tasks with async operations.
 * The service layer handles persistence, while the store manages UI state.
 * 
 * Performance: Uses selectors to prevent unnecessary re-renders.
 */
const store = create<TaskStore>((set, get) => {
  const service = new TaskService(StorageFactory.create<Task>('tasks'));

  return {
    // Initial state
    tasks: [],
    isLoading: false,
    error: null,

    // State setters
    setTasks: (tasks) => set({ tasks }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),

    // Load all tasks from storage
    loadTasks: async () => {
      set({ isLoading: true, error: null });
      try {
        const tasks = await service.getAllTasks();
        set({ tasks, isLoading: false });
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to load tasks',
          isLoading: false,
        });
      }
    },

    // Add a new task
    addTask: async (task) => {
      set({ isLoading: true, error: null });
      try {
        const newTask = await service.createTask(task);
        set((state) => ({
          tasks: [...state.tasks, newTask],
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to add task',
          isLoading: false,
        });
      }
    },

    // Update an existing task
    updateTask: async (task) => {
      set({ isLoading: true, error: null });
      try {
        const updatedTask = await service.updateTask(task);
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to update task',
          isLoading: false,
        });
      }
    },

    // Delete a task
    deleteTask: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await service.deleteTask(id);
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to delete task',
          isLoading: false,
        });
      }
    },

    // Toggle task completion status
    toggleTaskComplete: async (id) => {
      const task = get().tasks.find((t) => t.id === id);
      if (!task) return;

      set({ isLoading: true, error: null });
      try {
        let updatedTask: Task;
        if (task.status === 'completed') {
          updatedTask = await service.reopenTask(id);
        } else {
          updatedTask = await service.completeTask(id);
        }
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? updatedTask : t)),
          isLoading: false,
        }));
      } catch (error) {
        set({
          error: error instanceof Error ? error.message : 'Failed to toggle task',
          isLoading: false,
        });
      }
    },
  };
});

// Performance: Export store with selectors to prevent unnecessary re-renders
// Components should use these selectors instead of accessing the store directly

/**
 * Hook to get all tasks. Use specific selectors when possible.
 */
export const useTaskStore = store;

/**
 * Selector: Get only the tasks array (for components that need the full list)
 */
export const useTasks = () => store((state) => state.tasks);

/**
 * Selector: Get active tasks count (optimized for HomeDashboard)
 */
export const useActiveTasksCount = () => 
  store((state) => state.tasks.filter((t) => t.status !== 'completed').length);

/**
 * Selector: Get only task actions (for components that don't need state)
 */
export const useTaskActions = () => 
  store((state) => ({
    loadTasks: state.loadTasks,
    addTask: state.addTask,
    updateTask: state.updateTask,
    deleteTask: state.deleteTask,
    toggleTaskComplete: state.toggleTaskComplete,
  }));

/**
 * Selector: Get loading and error state
 */
export const useTaskStatus = () => 
  store((state) => ({
    isLoading: state.isLoading,
    error: state.error,
  }));


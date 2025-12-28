import { IStorable } from '@/lib/storage';

/**
 * Task priority levels.
 */
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

/**
 * Task status.
 */
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

/**
 * Task model representing a single task item.
 * 
 * This is the core domain model for the Tasks feature.
 * All task-related operations work with this model.
 */
export interface Task extends IStorable {
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string; // ISO date string
  completedAt?: string; // ISO date string
}

/**
 * Creates a new task with default values.
 * 
 * @param title - The task title (required)
 * @param overrides - Optional properties to override defaults
 * @returns A new Task object
 */
export function createTask(
  title: string,
  overrides?: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>
): Task {
  const now = new Date().toISOString();
  return {
    id: '',
    title,
    description: '',
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}


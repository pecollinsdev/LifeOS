import { IStorage } from '@/lib/storage';
import { Task } from '../models/Task';
import { generateId } from '@/lib/utils/uuid';

/**
 * Service layer for task operations.
 * 
 * Encapsulates all business logic related to tasks and acts as
 * an interface between the UI and storage layer.
 */
export class TaskService {
  constructor(private storage: IStorage<Task>) {}

  /**
   * Retrieves all tasks.
   * @returns Promise resolving to an array of all tasks
   */
  async getAllTasks(): Promise<Task[]> {
    return this.storage.getAll();
  }

  /**
   * Retrieves a task by its ID.
   * @param id - The task ID
   * @returns Promise resolving to the task or undefined
   */
  async getTaskById(id: string): Promise<Task | undefined> {
    return this.storage.getById(id);
  }

  /**
   * Creates a new task.
   * @param task - The task to create (id will be generated)
   * @returns Promise resolving to the created task
   */
  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const now = new Date().toISOString();
    const taskWithId: Task = {
      ...task,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    return this.storage.save(taskWithId);
  }

  /**
   * Updates an existing task.
   * @param task - The task with updated properties
   * @returns Promise resolving to the updated task
   */
  async updateTask(task: Task): Promise<Task> {
    return this.storage.save(task);
  }

  /**
   * Deletes a task.
   * @param id - The ID of the task to delete
   * @returns Promise resolving to true if deleted, false otherwise
   */
  async deleteTask(id: string): Promise<boolean> {
    return this.storage.delete(id);
  }

  /**
   * Marks a task as completed.
   * @param id - The ID of the task to complete
   * @returns Promise resolving to the updated task
   */
  async completeTask(id: string): Promise<Task> {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return this.updateTask({
      ...task,
      status: 'completed' as const,
      completedAt: new Date().toISOString(),
    });
  }

  /**
   * Marks a task as incomplete (reopens it).
   * @param id - The ID of the task to reopen
   * @returns Promise resolving to the updated task
   */
  async reopenTask(id: string): Promise<Task> {
    const task = await this.getTaskById(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }
    return this.updateTask({
      ...task,
      status: 'todo' as const,
      completedAt: undefined,
    });
  }
}


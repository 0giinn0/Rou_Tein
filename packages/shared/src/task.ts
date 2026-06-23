export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export type RecurrenceType = "daily" | "weekly" | "monthly" | "yearly" | "none";

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  listId: string;
  tags: string[];
  subtasks: SubTask[];
  recurrence: RecurrenceType;
  createdAt: string;
  updatedAt: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
  icon?: string;
  taskCount: number;
}

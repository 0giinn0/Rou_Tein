import { create } from "zustand";
import type { Task, TaskList } from "@ticktick/shared";

interface TaskStore {
  tasks: Task[];
  lists: TaskList[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setTasks: (tasks: Task[]) => void;
}

const defaultLists: TaskList[] = [
  { id: "inbox", name: "Inbox", color: "#6b7280", taskCount: 0 },
  { id: "today", name: "Today", color: "#3b82f6", taskCount: 0 },
  { id: "upcoming", name: "Upcoming", color: "#8b5cf6", taskCount: 0 },
];

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  lists: defaultLists,
  addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),
  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)),
    })),
  deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),
  setTasks: (tasks) => set({ tasks }),
}));

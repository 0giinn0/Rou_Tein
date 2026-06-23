import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Task, TaskList, SubTask } from "@ticktick/shared";

interface TaskStore {
  tasks: Task[];
  lists: TaskList[];
  selectedListId: string | null;
  searchQuery: string;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleSubTask: (taskId: string, subTaskId: string) => void;
  addList: (list: TaskList) => void;
  selectList: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
}

const defaultLists: TaskList[] = [
  { id: "inbox", name: "Inbox", color: "#6b7280", taskCount: 0 },
  { id: "today", name: "Today", color: "#3b82f6", taskCount: 0 },
  { id: "upcoming", name: "Upcoming", color: "#8b5cf6", taskCount: 0 },
];

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      lists: defaultLists,
      selectedListId: null,
      searchQuery: "",

      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      updateTask: (id, updates) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
          ),
        })),
      deleteTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      toggleSubTask: (taskId, subTaskId) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  subtasks: t.subtasks.map((st) =>
                    st.id === subTaskId ? { ...st, completed: !st.completed } : st
                  ),
                }
              : t
          ),
        })),
      addList: (list) => set((state) => ({ lists: [...state.lists, list] })),
      selectList: (id) => set({ selectedListId: id }),
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    { name: "routtein-tasks", partialize: (state) => ({ tasks: state.tasks, lists: state.lists }) }
  )
);

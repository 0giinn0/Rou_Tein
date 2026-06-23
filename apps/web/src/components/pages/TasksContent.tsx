"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, Calendar, Repeat, ChevronDown, ChevronUp } from "lucide-react";
import { useTaskStore } from "@/store/taskStore";
import { useStreakStore } from "@/store/streakStore";
import { Card, Button, Badge, Input, Modal, Select } from "@ticktick/ui";
import type { Task, TaskPriority, RecurrenceType, SubTask } from "@ticktick/shared";

type Filter = "all" | "pending" | "completed";

const recurrenceOptions = [
  { value: "none", label: "None" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const priorityStyles: Record<TaskPriority, string> = {
  high: "bg-coral/10 text-coral border-coral/20",
  medium: "bg-amber/10 text-amber border-amber/20",
  low: "bg-emerald/10 text-emerald border-emerald/20",
};

export default function TasksContent() {
  const {
    tasks,
    lists,
    selectedListId,
    searchQuery,
    addTask,
    updateTask,
    deleteTask,
    toggleSubTask,
    selectList,
    setSearchQuery,
  } = useTaskStore();
  const streakState = useStreakStore();

  const [filter, setFilter] = useState<Filter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());

  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formPriority, setFormPriority] = useState<TaskPriority>("medium");
  const [formListId, setFormListId] = useState("inbox");
  const [formDueDate, setFormDueDate] = useState("");
  const [formRecurrence, setFormRecurrence] = useState<RecurrenceType>("none");

  useEffect(() => {
    streakState.initializeDay();
  }, [streakState]);

  const today = new Date().toISOString().split("T")[0];
  const todayCompleted = tasks.filter(
    (t) => t.status === "completed" && t.dueDate?.startsWith(today)
  ).length;

  useEffect(() => {
    if (todayCompleted >= 3) {
      streakState.completeChallenge("complete-3-tasks");
    }
  }, [todayCompleted, streakState]);

  const remaining = tasks.filter((t) => t.status !== "completed").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount = tasks.length;

  const filtered = useMemo(() => {
    let result = tasks;

    if (selectedListId) {
      result = result.filter((t) => t.listId === selectedListId);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q));
    }

    if (filter === "pending") {
      result = result.filter((t) => t.status !== "completed");
    } else if (filter === "completed") {
      result = result.filter((t) => t.status === "completed");
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [tasks, selectedListId, searchQuery, filter]);

  function resetForm() {
    setFormTitle("");
    setFormDesc("");
    setFormPriority("medium");
    setFormListId("inbox");
    setFormDueDate("");
    setFormRecurrence("none");
  }

  function handleCreate() {
    if (!formTitle.trim()) return;
    const now = new Date().toISOString();
    const task: Task = {
      id: genId(),
      title: formTitle.trim(),
      description: formDesc.trim() || undefined,
      priority: formPriority,
      status: "pending",
      dueDate: formDueDate || undefined,
      listId: formListId,
      tags: [],
      subtasks: [],
      recurrence: formRecurrence,
      createdAt: now,
      updatedAt: now,
    };
    addTask(task);
    resetForm();
    setModalOpen(false);
  }

  function toggleDone(task: Task) {
    const nextStatus = task.status === "completed" ? "pending" : "completed";
    updateTask(task.id, { status: nextStatus });
  }

  function toggleExpanded(taskId: string) {
    setExpandedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  }

  function formatDate(d?: string): string {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function isOverdue(d?: string): boolean {
    if (!d) return false;
    return new Date(d) < new Date(new Date().toDateString());
  }

  function handleAddSubTask(taskId: string) {
    const title = prompt("Sub-task title:");
    if (!title?.trim()) return;
    const sub: SubTask = { id: genId(), title: title.trim(), completed: false };
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      updateTask(taskId, { subtasks: [...task.subtasks, sub] });
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-s4 space-y-s4 pb-28">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bauhaus text-cream">Tasks</h1>
          <p className="text-sm text-muted mt-s1">
            {remaining} remaining · {completedCount} completed
          </p>
        </div>
        <Button size="sm" onClick={() => setModalOpen(true)} className="rounded-full">
          <Plus size={16} className="mr-1" />
          New Task
        </Button>
      </header>

      {/* Progress */}
      <div className="glass rounded-3xl p-s4">
        <div className="flex items-center justify-between text-sm mb-s2">
          <span className="text-muted">Daily Progress</span>
          <span className="text-cream font-bold">
            {Math.round(totalCount > 0 ? (completedCount / totalCount) * 100 : 0)}%
          </span>
        </div>
        <div className="h-2.5 bg-surface-variant rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-emerald to-teal rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        <p className="text-xs text-muted mt-s2">
          Complete 3 tasks today to finish the Task Master challenge
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
        />
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl glass text-cream text-sm placeholder:text-muted focus:outline-none focus:border-cream/30 transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-s2 overflow-x-auto pb-s1">
        {(["all", "pending", "completed"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              filter === f
                ? "bg-cream text-ink"
                : "glass text-muted hover:text-cream"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Lists */}
      <div className="flex items-center gap-s2 overflow-x-auto pb-s1">
        <button
          onClick={() => selectList(null)}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
            selectedListId === null
              ? "bg-coral/10 text-coral border border-coral/20"
              : "glass text-muted hover:text-cream"
          }`}
        >
          All
        </button>
        {lists.map((list) => (
          <button
            key={list.id}
            onClick={() => selectList(list.id)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              selectedListId === list.id
                ? "text-ink"
                : "glass text-muted hover:text-cream"
            }`}
            style={
              selectedListId === list.id
                ? { backgroundColor: list.color, borderColor: list.color }
                : undefined
            }
          >
            {list.name}
          </button>
        ))}
      </div>

      {/* Task List */}
      {filtered.length === 0 ? (
        <div className="glass rounded-3xl p-s6 text-center">
          <p className="text-sm text-muted uppercase tracking-wider">
            No tasks found
          </p>
          <p className="text-[10px] text-subtle mt-s1">
            Create a new task to get started
          </p>
        </div>
      ) : (
        <div className="space-y-s2">
          <AnimatePresence>
            {filtered.map((task) => {
              const done = task.status === "completed";
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass rounded-2xl overflow-hidden"
                >
                  <div className="flex items-center gap-s3 p-s3">
                    <button
                      onClick={() => toggleDone(task)}
                      className={`w-5 h-5 flex-shrink-0 rounded-lg border-2 transition-all ${
                        done
                          ? "bg-emerald border-emerald"
                          : "border-muted hover:border-cream"
                      }`}
                    >
                      {done && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-full h-full text-ink p-0.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="4"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </motion.svg>
                      )}
                    </button>

                    <span
                      className={`flex-1 text-sm ${
                        done
                          ? "line-through text-muted"
                          : "text-cream font-medium"
                      }`}
                    >
                      {task.title}
                    </span>

                    <Badge
                      variant={task.priority === "high" ? "error" : task.priority === "low" ? "success" : "primary"}
                      className={`rounded-full border ${priorityStyles[task.priority]}`}
                    >
                      {task.priority}
                    </Badge>

                    {task.dueDate && (
                      <div
                        className={`flex items-center gap-s1 text-[10px] font-bold uppercase tracking-wider ${
                          isOverdue(task.dueDate) && !done
                            ? "text-coral"
                            : "text-muted"
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        {formatDate(task.dueDate)}
                      </div>
                    )}

                    {task.recurrence !== "none" && (
                      <Repeat className="w-3 h-3 text-muted" />
                    )}

                    {task.subtasks.length > 0 && (
                      <button
                        onClick={() => toggleExpanded(task.id)}
                        className="text-muted hover:text-cream transition-colors"
                      >
                        {expandedTasks.has(task.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-muted hover:text-coral transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <AnimatePresence>
                    {expandedTasks.has(task.id) && task.subtasks.length > 0 && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-border/50 px-s3 py-s2 space-y-s1 bg-surface/30"
                      >
                        {task.subtasks.map((st) => (
                          <div key={st.id} className="flex items-center gap-s2">
                            <button
                              onClick={() => toggleSubTask(task.id, st.id)}
                              className={`w-4 h-4 flex-shrink-0 rounded border-2 transition-all ${
                                st.completed
                                  ? "bg-emerald border-emerald"
                                  : "border-muted"
                              }`}
                            />
                            <span
                              className={`text-xs ${
                                st.completed
                                  ? "line-through text-muted"
                                  : "text-cream"
                              }`}
                            >
                              {st.title}
                            </span>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add Task Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Task" className="rounded-3xl">
        <div className="space-y-s3">
          <Input
            label="Title"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="What needs to be done?"
            autoFocus
            className="rounded-xl"
          />
          <Input
            label="Description"
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            placeholder="Add details..."
            className="rounded-xl"
          />
          <div className="grid grid-cols-2 gap-s3">
            <Select
              label="Priority"
              value={formPriority}
              onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
              options={[
                { value: "low", label: "Low" },
                { value: "medium", label: "Medium" },
                { value: "high", label: "High" },
              ]}
            />
            <Select
              label="List"
              value={formListId}
              onChange={(e) => setFormListId(e.target.value)}
              options={lists.map((l) => ({ value: l.id, label: l.name }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-s3">
            <Input
              label="Due Date"
              type="date"
              value={formDueDate}
              onChange={(e) => setFormDueDate(e.target.value)}
              className="rounded-xl"
            />
            <Select
              label="Recurrence"
              value={formRecurrence}
              onChange={(e) => setFormRecurrence(e.target.value as RecurrenceType)}
              options={recurrenceOptions}
            />
          </div>
          <div className="flex justify-end gap-s2 pt-s2">
            <Button variant="ghost" size="sm" onClick={() => setModalOpen(false)} className="rounded-full">
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate} className="rounded-full">
              Create Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

import { supabase } from "./supabase";
import type { Task } from "@ticktick/shared";

export interface SyncableStreak {
  streak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  xp: number;
  level: number;
  coins: number;
  perfectDays: number;
  badges: string[];
  unlockedThemes: string[];
  activeTheme: string;
  streakFreeze: number;
  totalTasksCompleted: number;
}

export async function syncTasks(tasks: Task[]) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return { error: new Error("Not authenticated") };

  const { error: deleteError } = await supabase.from("tasks").delete().eq("user_id", userId);
  if (deleteError) return { error: deleteError };

  if (tasks.length === 0) return { error: null };

  const rows = tasks.map((t) => ({
    user_id: userId,
    title: t.title,
    status: t.status,
    priority: t.priority,
    due_date: t.dueDate,
  }));

  const { error } = await supabase.from("tasks").insert(rows);
  return { error };
}

export async function fetchTasks(): Promise<{ tasks: Task[]; error: Error | null }> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return { tasks: [], error: new Error("Not authenticated") };

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return { tasks: [], error: error ?? new Error("No data") };

  const tasks: Task[] = data.map((row) => ({
    id: row.id,
    title: row.title,
    status: row.status,
    priority: row.priority,
    dueDate: row.due_date,
    listId: "inbox",
    subtasks: [],
    tags: [],
    recurrence: "none",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  return { tasks, error: null };
}

export async function syncStreak(streak: SyncableStreak) {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return { error: new Error("Not authenticated") };

  const { error } = await supabase.from("streaks").upsert(
    {
      user_id: userId,
      streak: streak.streak,
      longest_streak: streak.longestStreak,
      last_active_date: streak.lastActiveDate,
      xp: streak.xp,
      level: streak.level,
      coins: streak.coins,
      perfect_days: streak.perfectDays,
      badges: streak.badges,
      unlocked_themes: streak.unlockedThemes,
      active_theme: streak.activeTheme,
      streak_freeze: streak.streakFreeze,
      total_tasks_completed: streak.totalTasksCompleted,
    },
    { onConflict: "user_id" }
  );

  return { error };
}

export async function fetchStreak(): Promise<{ streak: SyncableStreak | null; error: Error | null }> {
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id;
  if (!userId) return { streak: null, error: new Error("Not authenticated") };

  const { data, error } = await supabase.from("streaks").select("*").eq("user_id", userId).single();

  if (error || !data) return { streak: null, error: error ?? new Error("No data") };

  const streak: SyncableStreak = {
    streak: data.streak,
    longestStreak: data.longest_streak,
    lastActiveDate: data.last_active_date,
    xp: data.xp,
    level: data.level,
    coins: data.coins,
    perfectDays: data.perfect_days,
    badges: data.badges,
    unlockedThemes: data.unlocked_themes,
    activeTheme: data.active_theme,
    streakFreeze: data.streak_freeze,
    totalTasksCompleted: data.total_tasks_completed,
  };

  return { streak, error: null };
}

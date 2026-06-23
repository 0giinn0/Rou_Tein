import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WEEKLY_WORKOUT } from "@ticktick/shared";
import type { WorkoutDay, CustomWorkout } from "@ticktick/shared";

interface WorkoutStore {
  weekStart: string | null;
  days: WorkoutDay[];
  exerciseCompletions: Record<string, boolean>;
  customWorkouts: CustomWorkout[];
  activeCustomWorkoutId: string | null;
  customExerciseCompletions: Record<string, boolean>;
  initWeek: () => void;
  toggleExercise: (dayId: string, exerciseId: string) => void;
  toggleDay: (dayId: string) => void;
  getWeekProgress: () => number;
  getDayProgress: (dayId: string) => number;
  createCustomWorkout: (name: string, exercises: { exerciseId: string; sets: number; reps: number }[]) => void;
  deleteCustomWorkout: (id: string) => void;
  setActiveCustomWorkout: (id: string | null) => void;
  toggleCustomExercise: (workoutId: string, exerciseId: string) => void;
  getCustomWorkoutProgress: (id: string) => number;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      weekStart: null,
      days: WEEKLY_WORKOUT,
      exerciseCompletions: {},
      customWorkouts: [],
      activeCustomWorkoutId: null,
      customExerciseCompletions: {},

      initWeek: () => {
        const today = new Date();
        const state = get();
        if (state.weekStart) {
          const start = new Date(state.weekStart);
          const diff = (today.getTime() - start.getTime()) / (1000 * 3600 * 24);
          if (diff < 7 && diff >= 0) return;
        }
        const dayOfWeek = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
        set({
          weekStart: monday.toISOString().split("T")[0],
          days: WEEKLY_WORKOUT.map((d) => ({ ...d, completed: false, completedAt: undefined })),
          exerciseCompletions: {},
        });
      },

      toggleExercise: (dayId, exerciseId) => {
        set((s) => ({
          exerciseCompletions: {
            ...s.exerciseCompletions,
            [`${dayId}-${exerciseId}`]: !s.exerciseCompletions[`${dayId}-${exerciseId}`],
          },
        }));
      },

      toggleDay: (dayId) => {
        set((s) => ({
          days: s.days.map((d) => {
            if (d.id !== dayId) return d;
            const willComplete = !d.completed;
            return { ...d, completed: willComplete, completedAt: willComplete ? new Date().toISOString() : undefined };
          }),
        }));
      },

      getWeekProgress: () => {
        const state = get();
        return Math.round((state.days.filter((d) => d.completed).length / 7) * 100);
      },

      getDayProgress: (dayId) => {
        const state = get();
        const day = state.days.find((d) => d.id === dayId);
        if (!day || day.exercises.length === 0) return 0;
        const completed = day.exercises.filter(
          (e) => state.exerciseCompletions[`${dayId}-${e.id}`]
        ).length;
        return Math.round((completed / day.exercises.length) * 100);
      },

      createCustomWorkout: (name, exercises) => {
        const id = Math.random().toString(36).substring(2, 11);
        const workout: CustomWorkout = { id, name, exercises, createdAt: new Date().toISOString() };
        set((s) => ({ customWorkouts: [...s.customWorkouts, workout] }));
      },

      deleteCustomWorkout: (id) => {
        set((s) => ({
          customWorkouts: s.customWorkouts.filter((w) => w.id !== id),
          activeCustomWorkoutId: s.activeCustomWorkoutId === id ? null : s.activeCustomWorkoutId,
        }));
      },

      setActiveCustomWorkout: (id) => {
        set((s) => ({
          activeCustomWorkoutId: id,
          customExerciseCompletions: {},
          customWorkouts: s.customWorkouts.map((w) =>
            w.id === id ? { ...w, lastUsed: new Date().toISOString() } : w
          ),
        }));
      },

      toggleCustomExercise: (workoutId, exerciseId) => {
        set((s) => ({
          customExerciseCompletions: {
            ...s.customExerciseCompletions,
            [`${workoutId}-${exerciseId}`]: !s.customExerciseCompletions[`${workoutId}-${exerciseId}`],
          },
        }));
      },

      getCustomWorkoutProgress: (id) => {
        const state = get();
        const workout = state.customWorkouts.find((w) => w.id === id);
        if (!workout || workout.exercises.length === 0) return 0;
        const completed = workout.exercises.filter(
          (e) => state.customExerciseCompletions[`${id}-${e.exerciseId}`]
        ).length;
        return Math.round((completed / workout.exercises.length) * 100);
      },
    }),
    {
      name: "routtein-mobile-workout",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        weekStart: state.weekStart,
        days: state.days,
        exerciseCompletions: state.exerciseCompletions,
        customWorkouts: state.customWorkouts,
        activeCustomWorkoutId: state.activeCustomWorkoutId,
        customExerciseCompletions: state.customExerciseCompletions,
      }),
    }
  )
);

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WEEKLY_WORKOUT } from "@ticktick/shared";
import type { WorkoutDay } from "@ticktick/shared";

interface WorkoutStore {
  weekStart: string | null;
  days: WorkoutDay[];
  exerciseCompletions: Record<string, boolean>;
  initWeek: () => void;
  toggleExercise: (dayId: string, exerciseId: string) => void;
  toggleDay: (dayId: string) => void;
  getWeekProgress: () => number;
  getDayProgress: (dayId: string) => number;
}

export const useWorkoutStore = create<WorkoutStore>()(
  persist(
    (set, get) => ({
      weekStart: null,
      days: WEEKLY_WORKOUT,
      exerciseCompletions: {},

      initWeek: () => {
        const today = new Date();
        // reset if more than 7 days since weekStart
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
    }),
    {
      name: "routtein-mobile-workout",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        weekStart: state.weekStart,
        days: state.days,
        exerciseCompletions: state.exerciseCompletions,
      }),
    }
  )
);

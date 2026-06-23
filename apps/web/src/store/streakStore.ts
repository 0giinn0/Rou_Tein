import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  DailyChallenge,
  StreakState as StreakStateBase,
} from "@ticktick/shared";
import {
  defaultChallenges,
  getXpForLevel,
  getTodayKey,
} from "@ticktick/shared";

interface StreakStore extends StreakStateBase {
  initializeDay: () => void;
  recordActivity: (type: "task" | "meal" | "weather" | "quiz") => void;
  completeChallenge: (id: string) => void;
  completeQuiz: (score: number, total: number) => void;
  canClaimDaily: () => boolean;
  claimDaily: () => void;
  getXpToNextLevel: () => number;
  getProgressToNextLevel: () => number;
  getTodayProgress: () => number;
}

export const useStreakStore = create<StreakStore>()(
  persist(
    (set, get) => ({
      streak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      xp: 0,
      level: 1,
      coins: 0,
      challenges: defaultChallenges,
      quizCompleted: false,
      quizScore: 0,
      quizzesTakenToday: 0,
      perfectDays: 0,

      initializeDay: () => {
        const today = getTodayKey();
        const state = get();

        if (state.lastActiveDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayKey = yesterday.toISOString().split("T")[0];

        let newStreak = state.streak;
        if (state.lastActiveDate === yesterdayKey) {
          newStreak = state.streak + 1;
        } else if (state.lastActiveDate !== today) {
          newStreak = 1;
        }

        set({
          challenges: defaultChallenges.map((c) => ({ ...c, completed: false })),
          quizCompleted: false,
          quizScore: 0,
          quizzesTakenToday: 0,
          streak: newStreak,
          longestStreak: Math.max(state.longestStreak, newStreak),
          lastActiveDate: today,
        });
      },

      recordActivity: () => {
        get().initializeDay();
      },

      completeChallenge: (id) => {
        get().initializeDay();
        const state = get();
        const challenge = state.challenges.find((c) => c.id === id);
        if (!challenge || challenge.completed) return;

        const completedAt = new Date().toISOString();
        const newChallenges = state.challenges.map((c) =>
          c.id === id ? { ...c, completed: true, completedAt } : c
        );

        let newXp = state.xp + challenge.xpReward;
        let newLevel = state.level;
        let newCoins = state.coins + challenge.coinReward;

        while (newXp >= getXpForLevel(newLevel)) {
          newXp -= getXpForLevel(newLevel);
          newLevel += 1;
        }

        const allCompleted = newChallenges.every((c) => c.completed);
        const newPerfectDays =
          allCompleted && !state.challenges.every((c) => c.completed)
            ? state.perfectDays + 1
            : state.perfectDays;

        set({
          challenges: newChallenges,
          xp: newXp,
          level: newLevel,
          coins: newCoins,
          perfectDays: newPerfectDays,
        });
      },

      completeQuiz: (score, total) => {
        get().initializeDay();
        const state = get();
        if (state.quizCompleted) return;

        const pct = score / total;
        const xpGain = Math.round(40 * pct);
        const coinGain = Math.round(15 * pct);

        let newXp = state.xp + xpGain;
        let newLevel = state.level;
        let newCoins = state.coins + coinGain;

        while (newXp >= getXpForLevel(newLevel)) {
          newXp -= getXpForLevel(newLevel);
          newLevel += 1;
        }

        set({
          quizCompleted: true,
          quizScore: score,
          quizzesTakenToday: state.quizzesTakenToday + 1,
          xp: newXp,
          level: newLevel,
          coins: newCoins,
        });

        get().completeChallenge("daily-quiz");
      },

      canClaimDaily: () => {
        const state = get();
        const today = getTodayKey();
        return state.lastActiveDate !== today;
      },

      claimDaily: () => {
        get().initializeDay();
      },

      getXpToNextLevel: () => getXpForLevel(get().level),

      getProgressToNextLevel: () => {
        const state = get();
        return Math.min(100, (state.xp / getXpForLevel(state.level)) * 100);
      },

      getTodayProgress: () => {
        const completed = get().challenges.filter((c) => c.completed).length;
        return Math.round((completed / get().challenges.length) * 100);
      },
    }),
    {
      name: "routtein-streaks",
      partialize: (state) => ({
        streak: state.streak,
        longestStreak: state.longestStreak,
        lastActiveDate: state.lastActiveDate,
        xp: state.xp,
        level: state.level,
        coins: state.coins,
        challenges: state.challenges,
        quizCompleted: state.quizCompleted,
        quizScore: state.quizScore,
        quizzesTakenToday: state.quizzesTakenToday,
        perfectDays: state.perfectDays,
      }),
    }
  )
);

export type { DailyChallenge };

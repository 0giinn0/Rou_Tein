import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { DailyChallenge, StreakState as StreakStateBase } from "@ticktick/shared";
import {
  defaultChallenges,
  getXpForLevel,
  getTodayKey,
  BADGES,
  THEMES,
  STREAK_FREEZE_COST,
  getLevelReward,
  getBadgeById,
} from "@ticktick/shared";

interface UnlockResult {
  badgeId?: string;
  leveledUp?: boolean;
  newLevel?: number;
  rewardCoins?: number;
}

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
  buyTheme: (themeId: string) => boolean;
  setActiveTheme: (themeId: string) => void;
  buyStreakFreeze: () => boolean;
  useStreakFreeze: () => boolean;
  completeTask: () => UnlockResult;
}

function addXp(
  state: StreakStateBase,
  xpGain: number
): { xp: number; level: number; leveledUp: boolean; newLevel: number; rewardCoins: number } {
  let newXp = state.xp + xpGain;
  let newLevel = state.level;
  let leveledUp = false;
  let rewardCoins = 0;

  while (newXp >= getXpForLevel(newLevel)) {
    newXp -= getXpForLevel(newLevel);
    newLevel += 1;
    leveledUp = true;
    rewardCoins += getLevelReward(newLevel).coins;
  }

  return { xp: newXp, level: newLevel, leveledUp, newLevel, rewardCoins };
}

function checkBadges(state: StreakStateBase): string[] {
  const newlyUnlocked: string[] = [];
  const has = (id: string) => state.badges.includes(id);
  const unlock = (id: string) => {
    if (!has(id)) newlyUnlocked.push(id);
  };

  if (state.totalTasksCompleted >= 1) unlock("first-task");
  if (state.totalTasksCompleted >= 50) unlock("task-machine");
  if (state.streak >= 3) unlock("streak-3");
  if (state.streak >= 7) unlock("streak-7");
  if (state.streak >= 30) unlock("streak-30");
  if (state.perfectDays >= 1) unlock("perfect-day");
  if (state.level >= 5) unlock("level-5");
  if (state.level >= 10) unlock("level-10");
  if (state.coins >= 500) unlock("coin-collector");

  return newlyUnlocked;
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
      badges: [],
      unlockedThemes: ["default"],
      activeTheme: "default",
      streakFreeze: 0,
      totalTasksCompleted: 0,

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
          if (state.streakFreeze > 0 && !state.badges.includes("frozen-day")) {
            // auto-use streak freeze is handled by useStreakFreeze
          }
          newStreak = 1;
        }

        const newBadges = checkBadges({ ...state, streak: newStreak });

        set({
          challenges: defaultChallenges.map((c) => ({ ...c, completed: false })),
          quizCompleted: false,
          quizScore: 0,
          quizzesTakenToday: 0,
          streak: newStreak,
          longestStreak: Math.max(state.longestStreak, newStreak),
          lastActiveDate: today,
          badges: Array.from(new Set([...state.badges, ...newBadges])),
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

        const { xp, level, leveledUp, newLevel, rewardCoins } = addXp(state, challenge.xpReward);
        const totalCoins = state.coins + challenge.coinReward + rewardCoins;

        const allCompleted = newChallenges.every((c) => c.completed);
        const newPerfectDays =
          allCompleted && !state.challenges.every((c) => c.completed)
            ? state.perfectDays + 1
            : state.perfectDays;

        const tempState = {
          ...state,
          xp,
          level,
          coins: totalCoins,
          perfectDays: newPerfectDays,
        };
        const newBadges = checkBadges(tempState);

        set({
          challenges: newChallenges,
          xp,
          level,
          coins: totalCoins,
          perfectDays: newPerfectDays,
          badges: Array.from(new Set([...state.badges, ...newBadges])),
        });
      },

      completeQuiz: (score, total) => {
        get().initializeDay();
        const state = get();
        if (state.quizCompleted) return;

        const pct = score / total;
        const xpGain = Math.round(40 * pct);
        const coinGain = Math.round(15 * pct);

        const { xp, level, leveledUp, newLevel, rewardCoins } = addXp(state, xpGain);
        const totalCoins = state.coins + coinGain + rewardCoins;

        const quizBadge = pct === 1 ? "quiz-genius" : undefined;
        const newBadges = checkBadges({
          ...state,
          xp,
          level,
          coins: totalCoins,
        });
        if (quizBadge) newBadges.push(quizBadge);

        set({
          quizCompleted: true,
          quizScore: score,
          quizzesTakenToday: state.quizzesTakenToday + 1,
          xp,
          level,
          coins: totalCoins,
          badges: Array.from(new Set([...state.badges, ...newBadges])),
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

      buyTheme: (themeId) => {
        const state = get();
        const theme = THEMES.find((t) => t.id === themeId);
        if (!theme || state.unlockedThemes.includes(themeId) || state.coins < theme.cost) {
          return false;
        }
        set({
          coins: state.coins - theme.cost,
          unlockedThemes: [...state.unlockedThemes, themeId],
          activeTheme: themeId,
        });
        return true;
      },

      setActiveTheme: (themeId) => {
        if (get().unlockedThemes.includes(themeId)) {
          set({ activeTheme: themeId });
        }
      },

      buyStreakFreeze: () => {
        const state = get();
        if (state.coins < STREAK_FREEZE_COST) return false;
        set({ coins: state.coins - STREAK_FREEZE_COST, streakFreeze: state.streakFreeze + 1 });
        return true;
      },

      useStreakFreeze: () => {
        const state = get();
        const today = getTodayKey();
        if (state.streakFreeze <= 0 || state.lastActiveDate === today) return false;
        set({
          streakFreeze: state.streakFreeze - 1,
          lastActiveDate: today,
        });
        return true;
      },

      completeTask: () => {
        const state = get();
        const totalTasksCompleted = state.totalTasksCompleted + 1;
        const newBadges = checkBadges({ ...state, totalTasksCompleted });
        set({ totalTasksCompleted, badges: Array.from(new Set([...state.badges, ...newBadges])) });

        const result: UnlockResult = {};
        if (newBadges.length > 0) result.badgeId = newBadges[0];
        return result;
      },
    }),
    {
      name: "routtein-mobile-streaks",
      storage: createJSONStorage(() => AsyncStorage),
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
        badges: state.badges,
        unlockedThemes: state.unlockedThemes,
        activeTheme: state.activeTheme,
        streakFreeze: state.streakFreeze,
        totalTasksCompleted: state.totalTasksCompleted,
      }),
    }
  )
);

export type { DailyChallenge };

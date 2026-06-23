export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  completedAt?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: "weather" | "health" | "productivity" | "nature";
}

export interface StreakState {
  streak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  xp: number;
  level: number;
  coins: number;
  challenges: DailyChallenge[];
  quizCompleted: boolean;
  quizScore: number;
  quizzesTakenToday: number;
  perfectDays: number;
  badges: string[];
  unlockedThemes: string[];
  activeTheme: string;
  streakFreeze: number;
  totalTasksCompleted: number;
}

export const LEVEL_XP_BASE = 100;

export const defaultChallenges: DailyChallenge[] = [
  {
    id: "complete-3-tasks",
    title: "Task Master",
    description: "Complete 3 tasks today",
    icon: "✓",
    xpReward: 30,
    coinReward: 10,
    completed: false,
  },
  {
    id: "log-a-meal",
    title: "Nutrition Log",
    description: "Log one meal today",
    icon: "🍎",
    xpReward: 20,
    coinReward: 5,
    completed: false,
  },
  {
    id: "check-weather",
    title: "Weather Watcher",
    description: "Check today's weather",
    icon: "☀",
    xpReward: 15,
    coinReward: 5,
    completed: false,
  },
  {
    id: "daily-quiz",
    title: "Brain Boost",
    description: "Complete the daily quiz",
    icon: "🧠",
    xpReward: 40,
    coinReward: 15,
    completed: false,
  },
];

export function getXpForLevel(level: number): number {
  return Math.floor(LEVEL_XP_BASE * Math.pow(1.25, level - 1));
}

export function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

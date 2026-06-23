export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface Theme {
  id: string;
  name: string;
  primary: string;
  accent: string;
  bg: string;
  surface: string;
  cost: number;
}

export interface Reward {
  coins: number;
  xp: number;
  badgeId?: string;
}

export const BADGES: Badge[] = [
  {
    id: "first-task",
    title: "First Step",
    description: "Complete your first task",
    icon: "🚀",
  },
  {
    id: "streak-3",
    title: "On Fire",
    description: "Reach a 3-day streak",
    icon: "🔥",
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Reach a 7-day streak",
    icon: "🏆",
  },
  {
    id: "streak-30",
    title: "Monthly Master",
    description: "Reach a 30-day streak",
    icon: "👑",
  },
  {
    id: "perfect-day",
    title: "Perfect Day",
    description: "Complete all daily challenges",
    icon: "⭐",
  },
  {
    id: "quiz-genius",
    title: "Quiz Genius",
    description: "Score 100% on a daily quiz",
    icon: "🧠",
  },
  {
    id: "level-5",
    title: "Rising Star",
    description: "Reach level 5",
    icon: "🌟",
  },
  {
    id: "level-10",
    title: "Legend",
    description: "Reach level 10",
    icon: "💎",
  },
  {
    id: "coin-collector",
    title: "Coin Collector",
    description: "Earn 500 coins",
    icon: "🪙",
  },
  {
    id: "task-machine",
    title: "Task Machine",
    description: "Complete 50 tasks total",
    icon: "⚙️",
  },
];

export const THEMES: Theme[] = [
  {
    id: "default",
    name: "Midnight",
    primary: "#ff6b6b",
    accent: "#a78bfa",
    bg: "#070707",
    surface: "#111111",
    cost: 0,
  },
  {
    id: "ocean",
    name: "Ocean",
    primary: "#38bdf8",
    accent: "#34d399",
    bg: "#031525",
    surface: "#0a1f2e",
    cost: 150,
  },
  {
    id: "sunset",
    name: "Sunset",
    primary: "#f59e0b",
    accent: "#f43f5e",
    bg: "#1a0b0b",
    surface: "#2a1515",
    cost: 150,
  },
  {
    id: "forest",
    name: "Forest",
    primary: "#34d399",
    accent: "#a3e635",
    bg: "#051a10",
    surface: "#0f291d",
    cost: 200,
  },
  {
    id: "royal",
    name: "Royal",
    primary: "#c084fc",
    accent: "#f0abfc",
    bg: "#120624",
    surface: "#1f1038",
    cost: 300,
  },
];

export interface StreakFreeze {
  count: number;
  usedDates: string[];
}

export const STREAK_FREEZE_COST = 100;

export function getLevelReward(level: number): Reward {
  return {
    coins: 50 + level * 10,
    xp: 0,
  };
}

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}

export function getThemeById(id: string): Theme | undefined {
  return THEMES.find((t) => t.id === id);
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useTaskStore } from "@/store/taskStore";
import { useNutritionStore } from "@/store/nutritionStore";
import { useWeatherStore } from "@/store/weatherStore";
import { useStreakStore } from "@/store/streakStore";
import { InteractiveSphere } from "@/components/InteractiveSphere";
import { DailyQuiz } from "@/components/DailyQuiz";
import { RetroProgressRing } from "@/components/RetroProgressRing";
import {
  Flame,
  Star,
  Coins,
  Zap,
  CheckCircle2,
  Cloud,
  Apple,
  ListTodo,
  Trophy,
  Target,
} from "lucide-react";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function isToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  const today = format(new Date(), "yyyy-MM-dd");
  return dateStr.startsWith(today);
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardContent() {
  const { tasks } = useTaskStore();
  const { getDay } = useNutritionStore();
  const { weather, loading, fetchWeather } = useWeatherStore();
  const streakState = useStreakStore();

  useEffect(() => {
    streakState.initializeDay();
  }, [streakState]);

  useEffect(() => {
    fetchWeather(40.7128, -74.006);
  }, [fetchWeather]);

  const todayKey = format(new Date(), "yyyy-MM-dd");
  const dayLog = getDay(todayKey);

  const todayTasks = useMemo(
    () => tasks.filter((t) => isToday(t.dueDate)),
    [tasks]
  );

  const completedToday = todayTasks.filter((t) => t.status === "completed").length;
  const totalToday = todayTasks.length;

  const caloriesPct = dayLog.goalCalories > 0
    ? Math.min((dayLog.totalCalories / dayLog.goalCalories) * 100, 100)
    : 0;

  const todayProgress = streakState.getTodayProgress();

  const challenges = streakState.challenges;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto p-s4 space-y-s4 pb-28 animate-pulse">
        <div className="h-8 w-40 bg-surface-variant rounded-lg" />
        <div className="h-80 bg-surface-variant rounded-3xl" />
        <div className="h-48 bg-surface-variant rounded-3xl" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-3xl mx-auto p-s4 space-y-s4 pb-28"
    >
      {/* Header */}
      <motion.header variants={itemVariants} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bauhaus text-cream">
            {getGreeting()}
          </h1>
          <p className="text-sm text-muted mt-s1">
            {format(new Date(), "EEEE, MMMM do")}
          </p>
        </div>
        <div className="flex items-center gap-s2">
          <div className="flex items-center gap-s1 px-3 py-1.5 rounded-full glass text-amber">
            <Coins className="w-4 h-4" />
            <span className="text-sm font-bold">{streakState.coins}</span>
          </div>
        </div>
      </motion.header>

      {/* Streak Hero */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl glass glow-coral"
      >
        <div className="absolute inset-0 opacity-40">
          <InteractiveSphere progress={todayProgress} />
        </div>
        <div className="relative z-10 p-s5">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-s2 text-coral mb-s2">
                <Flame className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider">Current Streak</span>
              </div>
              <h2 className="text-bauhaus-55 font-bauhaus text-cream">
                {streakState.streak}
                <span className="text-xl font-sans font-medium text-muted ml-2">days</span>
              </h2>
              <p className="text-sm text-muted mt-s1">
                Longest: {streakState.longestStreak} days
              </p>
            </div>
            <div className="text-right space-y-s2">
              <div className="flex items-center justify-end gap-s2 text-violet">
                <Star className="w-4 h-4" />
                <span className="text-sm font-bold">Level {streakState.level}</span>
              </div>
              <div className="flex items-center justify-end gap-s2 text-emerald">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-bold">{streakState.xp} XP</span>
              </div>
            </div>
          </div>

          <div className="mt-s5 space-y-s2">
            <div className="flex items-center justify-between text-xs text-muted">
              <span>Progress to Level {streakState.level + 1}</span>
              <span>{Math.round(streakState.getProgressToNextLevel())}%</span>
            </div>
            <div className="h-2.5 bg-surface-variant rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-coral via-coral-light to-amber rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${streakState.getProgressToNextLevel()}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Daily Challenges */}
      <motion.section variants={itemVariants} className="glass rounded-3xl p-s4">
        <div className="flex items-center gap-s2 mb-s4">
          <Target className="w-5 h-5 text-violet" />
          <h2 className="text-base font-bauhaus text-cream">Daily Challenges</h2>
          <span className="ml-auto text-xs font-bold text-muted">
            {challenges.filter((c) => c.completed).length}/{challenges.length}
          </span>
        </div>
        <div className="space-y-s2">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className={`flex items-center gap-s3 p-s3 rounded-2xl transition-all ${
                challenge.completed
                  ? "bg-emerald/5 border border-emerald/20"
                  : "bg-surface border border-border"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg ${
                  challenge.completed ? "bg-emerald/10" : "bg-surface-variant"
                }`}
              >
                {challenge.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald" />
                ) : (
                  <span>{challenge.icon}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${challenge.completed ? "text-emerald" : "text-cream"}`}>
                  {challenge.title}
                </p>
                <p className="text-[10px] text-muted truncate">{challenge.description}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-amber">+{challenge.coinReward}</p>
                <p className="text-[10px] text-muted">{challenge.xpReward} XP</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Quick Stats */}
      <motion.section variants={itemVariants}>
        <h2 className="text-base font-bauhaus text-cream mb-s3">Today's Snapshot</h2>
        <div className="grid grid-cols-3 gap-s3">
          <div className="glass rounded-3xl p-s4 flex flex-col items-center gap-s2">
            <RetroProgressRing
              value={completedToday}
              max={totalToday || 1}
              size={72}
              strokeWidth={5}
              color="var(--emerald)"
            >
              <ListTodo className="w-5 h-5 text-emerald" />
            </RetroProgressRing>
            <span className="text-xs font-bold text-cream">{completedToday}/{totalToday}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Tasks</span>
          </div>

          <div className="glass rounded-3xl p-s4 flex flex-col items-center gap-s2">
            <RetroProgressRing
              value={dayLog.totalCalories}
              max={dayLog.goalCalories || 1}
              size={72}
              strokeWidth={5}
              color="var(--amber)"
            >
              <Apple className="w-5 h-5 text-amber" />
            </RetroProgressRing>
            <span className="text-xs font-bold text-cream">{Math.round(caloriesPct)}%</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted">Calories</span>
          </div>

          <div className="glass rounded-3xl p-s4 flex flex-col items-center justify-center gap-s1">
            {loading ? (
              <div className="w-8 h-8 border-2 border-cream/20 border-t-cream rounded-full animate-spin" />
            ) : weather ? (
              <>
                <Cloud className="w-8 h-8 text-sky mb-s1" />
                <span className="text-bauhaus-21 font-bauhaus text-cream">
                  {Math.round(weather.temperature)}°
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted text-center truncate max-w-[80px]">
                  {weather.description}
                </span>
              </>
            ) : (
              <span className="text-[10px] uppercase tracking-wider text-subtle">No data</span>
            )}
          </div>
        </div>
      </motion.section>

      {/* Daily Quiz */}
      <motion.div variants={itemVariants}>
        <DailyQuiz />
      </motion.div>

      {/* Achievements teaser */}
      <motion.section variants={itemVariants} className="glass rounded-3xl p-s4">
        <div className="flex items-center gap-s2 mb-s3">
          <Trophy className="w-5 h-5 text-amber" />
          <h2 className="text-base font-bauhaus text-cream">Achievements</h2>
        </div>
        <div className="grid grid-cols-3 gap-s2">
          {[
            { label: "Perfect Days", value: streakState.perfectDays, color: "text-emerald" },
            { label: "Quizzes", value: streakState.quizzesTakenToday, color: "text-violet" },
            { label: "Level", value: streakState.level, color: "text-amber" },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface rounded-2xl p-s3 text-center">
              <p className={`text-bauhaus-21 font-bauhaus ${stat.color}`}>{stat.value}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider mt-s1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}

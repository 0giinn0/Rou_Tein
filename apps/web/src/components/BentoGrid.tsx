"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { GridLayout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { useTaskStore } from "@/store/taskStore";
import { useNutritionStore } from "@/store/nutritionStore";
import { useWeatherStore } from "@/store/weatherStore";
import { useStreakStore } from "@/store/streakStore";
import { useLayoutStore } from "@/store/layoutStore";
import { format } from "date-fns";
import { InteractiveSphere } from "./InteractiveSphere";
import { motion } from "framer-motion";
import {
  Flame,
  Trophy,
  Star,
  Coins,
  Cloud,
  ListTodo,
  Apple,
  Target,
  Brain,
  Zap,
  Droplets,
} from "lucide-react";

interface Section {
  number: string;
  label: string;
  href: string;
  span?: { col: number; row: number };
  widget: React.ReactNode;
  accent?: "coral" | "emerald" | "sky" | "amber" | "violet";
}

const accentColorMap: Record<string, string> = {
  coral: "#ff6b6b",
  emerald: "#34d399",
  sky: "#38bdf8",
  amber: "#fbbf24",
  violet: "#a78bfa",
};

export function BentoGrid({ onNavigate }: { onNavigate: (href: string, rect: DOMRect) => void }) {
  const { tasks } = useTaskStore();
  const today = format(new Date(), "yyyy-MM-dd");
  const day = useNutritionStore((s) => s.getDay(today));
  const { weather } = useWeatherStore();
  const streakState = useStreakStore();
  const { layouts, setLayouts } = useLayoutStore();
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    streakState.initializeDay();
  }, [streakState]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const todayTasks = tasks.filter((t) => t.dueDate?.startsWith(today));
  const completedTasks = todayTasks.filter((t) => t.status === "completed").length;
  const taskProgress = todayTasks.length > 0 ? Math.round((completedTasks / todayTasks.length) * 100) : 0;
  const calPct = day.goalCalories > 0 ? Math.round((day.totalCalories / day.goalCalories) * 100) : 0;
  const todayProgress = streakState.getTodayProgress();

  const sections: Section[] = [
    {
      number: "01",
      label: "Streak",
      href: "/",
      span: { col: 6, row: 4 },
      accent: "coral",
      widget: (
        <div className="w-full h-full flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <InteractiveSphere progress={todayProgress} />
          </div>
          <div className="relative z-10 flex flex-col h-full justify-between p-s4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-s2 text-coral mb-s1">
                  <Flame className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Streak</span>
                </div>
                <h2 className="text-bauhaus-34 font-bauhaus text-cream">
                  {streakState.streak}
                  <span className="text-lg font-sans font-medium text-muted ml-1">days</span>
                </h2>
                <p className="text-xs text-muted mt-s1">
                  Best: {streakState.longestStreak} days
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-s1 text-amber mb-s1">
                  <Coins className="w-4 h-4" />
                  <span className="text-sm font-bold">{streakState.coins}</span>
                </div>
                <div className="flex items-center justify-end gap-s1 text-violet">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-bold">Lv. {streakState.level}</span>
                </div>
              </div>
            </div>

            <div className="space-y-s2">
              <div className="flex items-center justify-between text-xs text-muted">
                <span>Level {streakState.level}</span>
                <span>{Math.round(streakState.getProgressToNextLevel())}%</span>
              </div>
              <div className="h-2 bg-surface-variant rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-coral to-coral-light rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${streakState.getProgressToNextLevel()}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
              <div className="flex items-center gap-s2 text-xs text-muted">
                <Zap className="w-3 h-3 text-amber" />
                <span>{streakState.xp} / {streakState.getXpToNextLevel()} XP</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      number: "02",
      label: "Tasks",
      href: "/tasks",
      span: { col: 3, row: 2 },
      accent: "emerald",
      widget: (
        <div className="flex flex-col items-center justify-center h-full p-s3 text-center">
          <div className="w-10 h-10 rounded-2xl bg-emerald/10 flex items-center justify-center mb-s2">
            <ListTodo className="w-5 h-5 text-emerald" />
          </div>
          <p className="text-bauhaus-21 font-bauhaus text-cream">{tasks.filter((t) => t.status !== "completed").length}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mt-s1">Remaining</p>
          <div className="mt-s2 h-1 w-16 bg-surface-variant rounded-full overflow-hidden">
            <div className="h-full bg-emerald rounded-full" style={{ width: `${taskProgress}%` }} />
          </div>
        </div>
      ),
    },
    {
      number: "03",
      label: "Weather",
      href: "/weather",
      span: { col: 3, row: 2 },
      accent: "sky",
      widget: (
        <div className="flex flex-col items-center justify-center h-full p-s3 text-center">
          <div className="w-10 h-10 rounded-2xl bg-sky/10 flex items-center justify-center mb-s2">
            <Cloud className="w-5 h-5 text-sky" />
          </div>
          {weather ? (
            <>
              <p className="text-bauhaus-21 font-bauhaus text-cream">{Math.round(weather.temperature)}°</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted mt-s1 truncate max-w-[100px]">
                {weather.description}
              </p>
            </>
          ) : (
            <p className="text-sm text-muted">--°</p>
          )}
        </div>
      ),
    },
    {
      number: "04",
      label: "Nutrition",
      href: "/nutrition",
      span: { col: 3, row: 2 },
      accent: "amber",
      widget: (
        <div className="flex flex-col items-center justify-center h-full p-s3 text-center">
          <div className="w-10 h-10 rounded-2xl bg-amber/10 flex items-center justify-center mb-s2">
            <Apple className="w-5 h-5 text-amber" />
          </div>
          <p className="text-bauhaus-21 font-bauhaus text-cream">{Math.round(day.totalCalories)}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mt-s1">{calPct}% of goal</p>
        </div>
      ),
    },
    {
      number: "05",
      label: "Challenges",
      href: "/",
      span: { col: 3, row: 2 },
      accent: "violet",
      widget: (
        <div className="flex flex-col items-center justify-center h-full p-s3 text-center">
          <div className="w-10 h-10 rounded-2xl bg-violet/10 flex items-center justify-center mb-s2">
            <Target className="w-5 h-5 text-violet" />
          </div>
          <p className="text-bauhaus-21 font-bauhaus text-cream">
            {streakState.challenges.filter((c) => c.completed).length}/{streakState.challenges.length}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mt-s1">Daily Challenges</p>
        </div>
      ),
    },
    {
      number: "06",
      label: "Quiz",
      href: "/",
      span: { col: 3, row: 2 },
      accent: "coral",
      widget: (
        <div className="flex flex-col items-center justify-center h-full p-s3 text-center">
          <div className="w-10 h-10 rounded-2xl bg-coral/10 flex items-center justify-center mb-s2">
            <Brain className="w-5 h-5 text-coral" />
          </div>
          <p className="text-bauhaus-21 font-bauhaus text-cream">
            {streakState.quizCompleted ? "Done" : "Play"}
          </p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mt-s1">Daily Quiz</p>
        </div>
      ),
    },
    {
      number: "07",
      label: "Hydration",
      href: "/nutrition",
      span: { col: 3, row: 2 },
      accent: "sky",
      widget: (
        <div className="flex flex-col items-center justify-center h-full p-s3 text-center">
          <div className="w-10 h-10 rounded-2xl bg-sky/10 flex items-center justify-center mb-s2">
            <Droplets className="w-5 h-5 text-sky" />
          </div>
          <p className="text-bauhaus-21 font-bauhaus text-cream">6</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mt-s1">Glasses</p>
        </div>
      ),
    },
    {
      number: "08",
      label: "Achievements",
      href: "/",
      span: { col: 3, row: 2 },
      accent: "amber",
      widget: (
        <div className="flex flex-col items-center justify-center h-full p-s3 text-center">
          <div className="w-10 h-10 rounded-2xl bg-amber/10 flex items-center justify-center mb-s2">
            <Trophy className="w-5 h-5 text-amber" />
          </div>
          <p className="text-bauhaus-21 font-bauhaus text-cream">{streakState.perfectDays}</p>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted mt-s1">Perfect Days</p>
        </div>
      ),
    },
  ];

  const defaultLayout = useMemo(
    () => [
      { i: "01", x: 0, y: 0, w: 6, h: 4 },
      { i: "02", x: 6, y: 0, w: 3, h: 2 },
      { i: "03", x: 9, y: 0, w: 3, h: 2 },
      { i: "04", x: 6, y: 2, w: 3, h: 2 },
      { i: "05", x: 9, y: 2, w: 3, h: 2 },
      { i: "06", x: 0, y: 4, w: 3, h: 2 },
      { i: "07", x: 3, y: 4, w: 3, h: 2 },
      { i: "08", x: 6, y: 4, w: 3, h: 2 },
    ],
    []
  );

  const handleLayoutChange = useCallback((layout: readonly any[]) => {
    setLayouts({ lg: layout as any });
  }, [setLayouts]);

  const currentLayout = layouts.lg?.length ? layouts.lg : defaultLayout;

  const handlePanelClick = useCallback((href: string, e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    onNavigate(href, rect);
  }, [onNavigate]);

  if (!mounted) {
    return (
      <div className="w-full h-full" style={{ minHeight: 500 }}>
        {sections.map((s) => (
          <div key={s.number} className="glass rounded-3xl" style={{ height: 120, marginBottom: 6 }} />
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full h-full p-s2">
      <GridLayout
        width={containerWidth}
        gridConfig={{
          cols: 12,
          rowHeight: 80,
          margin: [12, 12] as const,
          containerPadding: [0, 0] as const,
        }}
        dragConfig={{
          enabled: true,
          handle: ".drag-handle",
        }}
        resizeConfig={{
          enabled: true,
        }}
        layout={currentLayout as any}
        onLayoutChange={handleLayoutChange}
        autoSize
      >
        {sections.map((s) => (
          <div
            key={s.number}
            className="relative overflow-hidden rounded-3xl glass cursor-pointer group"
          >
            {/* Drag handle */}
            <div className="drag-handle absolute top-0 left-0 right-0 h-8 cursor-grab active:cursor-grabbing z-20 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Subtle accent glow */}
            <div
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-10 blur-3xl pointer-events-none"
              style={{ backgroundColor: accentColorMap[s.accent || "coral"] }}
            />

            {/* Panel number */}
            <div className="absolute top-3 left-4 text-[10px] font-bold uppercase tracking-wider text-muted/50 z-10">
              {s.number}
            </div>

            {/* Label */}
            <div className="absolute bottom-3 left-4 z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted group-hover:text-cream transition-colors">
                {s.label}
              </span>
            </div>

            {/* Click to navigate */}
            <div
              className="relative z-10 w-full h-full"
              onClick={(e) => handlePanelClick(s.href, e)}
            >
              {s.widget}
            </div>
          </div>
        ))}
      </GridLayout>
    </div>
  );
}

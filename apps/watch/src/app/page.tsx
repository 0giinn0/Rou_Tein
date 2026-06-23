"use client";

import { useState } from "react";

type Page = "home" | "tasks" | "weather";

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

interface Task {
  id: string;
  title: string;
  done: boolean;
}

export default function WatchPage() {
  const [page, setPage] = useState<Page>("home");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: generateId(), title: newTask.trim(), done: false }]);
    setNewTask("");
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  if (page === "tasks")
    return (
      <div className="flex flex-col h-full p-3">
        <button onClick={() => setPage("home")} className="text-white/60 text-[10px] font-bold mb-3 self-start">
          ← Back
        </button>
        <div className="flex gap-1 mb-3">
          <input
            className="flex-1 bg-white/10 rounded-full px-3 py-1.5 text-[11px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/30"
            placeholder="Add task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button onClick={addTask} className="w-7 h-7 rounded-full bg-[#f47b8e] text-white text-xs font-bold flex items-center justify-center active:scale-95">
            +
          </button>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1.5">
          {tasks.map((t) => (
            <button
              key={t.id}
              onClick={() => toggleTask(t.id)}
              className={`w-full text-left flex items-center gap-2 watch-card px-3 py-2 text-[11px] ${t.done ? "opacity-50" : ""}`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                t.done ? "bg-[#2abfbf] border-[#2abfbf]" : "border-white/30"
              }`}>
                {t.done && <span className="text-[8px] text-white">✓</span>}
              </div>
              <span className={t.done ? "line-through text-white/40" : ""}>{t.title}</span>
            </button>
          ))}
        </div>
      </div>
    );

  if (page === "weather")
    return (
      <WeatherView onBack={() => setPage("home")} />
    );

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 gap-5">
      {/* Logo */}
      <div className="text-center">
        <h1 className="text-base font-extrabold text-white tracking-wide">Rou_Tein</h1>
        <p className="text-[9px] text-white/50 mt-0.5">on your wrist</p>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-3 w-full max-w-[200px]">
        <WatchButton emoji="📋" label="Tasks" onClick={() => setPage("tasks")} />
        <WatchButton emoji="🌤️" label="Weather" onClick={() => setPage("weather")} />
        <WatchButton emoji="🍎" label="Food" onClick={() => {}} />
        <WatchButton emoji="✅" label="Check-in" onClick={() => {}} />
      </div>

      {/* Quick Stats */}
      <div className="flex gap-3">
        <div className="watch-card px-3 py-1.5 text-center">
          <p className="text-[10px] font-bold">{tasks.filter((t) => !t.done).length}</p>
          <p className="text-[8px] text-white/50">Tasks</p>
        </div>
        <div className="watch-card px-3 py-1.5 text-center">
          <p className="text-[10px] font-bold">{tasks.filter((t) => t.done).length}</p>
          <p className="text-[8px] text-white/50">Done</p>
        </div>
      </div>
    </div>
  );
}

function WatchButton({ emoji, label, onClick }: { emoji: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="watch-card flex flex-col items-center justify-center p-3 aspect-square active:bg-white/20 transition-colors"
    >
      <span className="text-xl">{emoji}</span>
      <span className="text-[9px] mt-1 text-white/70 font-bold">{label}</span>
    </button>
  );
}

function WeatherView({ onBack }: { onBack: () => void }) {
  const [weather, setWeather] = useState<{ temp: number; desc: string } | null>(null);
  useState(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006&current=temperature_2m,weather_code"
    )
      .then((r) => r.json())
      .then((d) => {
        const code = d.current.weather_code;
        const descs: Record<number, string> = { 0: "☀️", 1: "⛅", 2: "⛅", 45: "🌫️", 51: "🌧️", 61: "🌧️", 71: "❄️", 95: "⛈️" };
        setWeather({ temp: d.current.temperature_2m, desc: descs[code] || "🌤️" });
      })
      .catch(() => {});
  });
  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <button onClick={onBack} className="self-start text-white/60 text-[10px] font-bold mb-4">← Back</button>
      {weather ? (
        <div className="watch-card p-6 text-center w-full">
          <span className="text-3xl">{weather.desc}</span>
          <p className="text-2xl font-extrabold mt-2">{Math.round(weather.temp)}°</p>
          <p className="text-[10px] text-white/50 mt-1">New York</p>
        </div>
      ) : (
        <p className="text-[10px] text-white/40">Loading...</p>
      )}
    </div>
  );
}

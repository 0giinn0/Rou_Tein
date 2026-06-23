"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNutritionStore } from "@/store/nutritionStore";
import { useStreakStore } from "@/store/streakStore";
import { RetroProgressRing } from "@/components/RetroProgressRing";
import { Card, Button, Input, Select, Modal } from "@ticktick/ui";
import { Plus, Trash2, Trophy } from "lucide-react";
import { format } from "date-fns";
import type { MealEntry, MealType } from "@ticktick/shared";

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

const mealEmoji: Record<MealType, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  snack: "🍪",
};

const mealColors: Record<MealType, string> = {
  breakfast: "#fbbf24",
  lunch: "#38bdf8",
  dinner: "#a78bfa",
  snack: "#ff6b6b",
};

const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export function NutritionContent() {
  const today = format(new Date(), "yyyy-MM-dd");
  const { foodDatabase, addMeal, removeMeal, getDay } = useNutritionStore();
  const streakState = useStreakStore();
  const day = getDay(today);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>("breakfast");
  const [selectedFood, setSelectedFood] = useState(foodDatabase[0]?.id || "");
  const [servings, setServings] = useState(1);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    streakState.initializeDay();
  }, [streakState]);

  useEffect(() => {
    if (day.meals.length > 0) {
      streakState.completeChallenge("log-a-meal");
    }
  }, [day.meals.length, streakState]);

  const filteredFoods = foodDatabase.filter((f) =>
    f.name.toLowerCase().includes(filter.toLowerCase())
  );

  const handleAddMeal = () => {
    const food = foodDatabase.find((f) => f.id === selectedFood);
    if (!food) return;
    addMeal(today, {
      id: generateId(),
      mealType: selectedMealType,
      food,
      servings,
      date: today,
      time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }),
    });
    setModalOpen(false);
    setServings(1);
    setFilter("");
  };

  const macros = [
    { label: "Calories", value: Math.round(day.totalCalories), goal: day.goalCalories, unit: "kcal", color: "#fbbf24" },
    { label: "Protein", value: Math.round(day.totalProtein), goal: day.goalProtein, unit: "g", color: "#ff6b6b" },
    { label: "Carbs", value: Math.round(day.totalCarbs), goal: day.goalCarbs, unit: "g", color: "#38bdf8" },
    { label: "Fat", value: Math.round(day.totalFat), goal: day.goalFat, unit: "g", color: "#a78bfa" },
  ];

  const totalMealCals = day.meals.reduce((sum, m) => sum + m.food.calories * m.servings, 0);

  return (
    <div className="max-w-3xl mx-auto p-s4 space-y-s4 pb-28">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bauhaus text-cream">Nutrition</h1>
          <p className="text-sm text-muted mt-s1">
            {format(new Date(), "EEEE, MMMM d")}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setSelectedMealType("breakfast");
            setModalOpen(true);
          }}
          className="rounded-full"
        >
          <Plus className="w-4 h-4 mr-s1" />
          Log
        </Button>
      </header>

      {/* Macros */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-s4"
      >
        <div className="grid grid-cols-4 gap-s3">
          {macros.map((m) => (
            <div key={m.label} className="flex flex-col items-center text-center">
              <RetroProgressRing
                value={m.value}
                max={m.goal}
                size={68}
                strokeWidth={5}
                color={m.color}
                bgColor="var(--surface-variant)"
              >
                <span className="text-[10px] font-bold text-cream">
                  {Math.round((m.value / m.goal) * 100)}%
                </span>
              </RetroProgressRing>
              <p className="text-[10px] uppercase tracking-wider text-muted font-sans mt-s2">
                {m.label}
              </p>
              <p className="text-[10px] text-muted font-sans">
                {m.value}/{m.goal}{m.unit}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Daily Nutrition Challenge */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-3xl p-s4"
      >
        <div className="flex items-start gap-s3">
          <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center flex-shrink-0">
            <Trophy className="w-6 h-6 text-emerald" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bauhaus text-cream mb-s1">Nutrition Goal</h3>
            <p className="text-sm text-muted mb-s3">
              Log meals today to build healthy habits and earn rewards.
            </p>
            <div className="flex items-center gap-s4">
              <div className="flex items-center gap-s1 text-xs text-amber">
                <span className="font-bold">+5</span>
                <span className="text-muted">coins</span>
              </div>
              <div className="flex items-center gap-s1 text-xs text-violet">
                <span className="font-bold">+20</span>
                <span className="text-muted">XP</span>
              </div>
            </div>
          </div>
          {streakState.challenges.find((c) => c.id === "log-a-meal")?.completed ? (
            <div className="px-3 py-1.5 rounded-full bg-emerald/10 text-emerald text-xs font-bold">
              Completed
            </div>
          ) : null}
        </div>
      </motion.div>

      {/* Meals */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-s3"
      >
        {mealTypes.map((mealType) => {
          const meals = day.meals.filter((m) => m.mealType === mealType);
          const totalCals = meals.reduce(
            (sum, m) => sum + m.food.calories * m.servings,
            0
          );

          return (
            <Card key={mealType} className="p-s4 rounded-3xl glass">
              <div className="flex items-center justify-between mb-s3">
                <div className="flex items-center gap-s3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                    style={{ backgroundColor: `${mealColors[mealType]}15` }}
                  >
                    {mealEmoji[mealType]}
                  </div>
                  <div>
                    <p className="text-sm font-bauhaus text-cream capitalize">
                      {mealType}
                    </p>
                    <p className="text-[10px] text-muted font-sans">
                      {Math.round(totalCals)} kcal
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedMealType(mealType);
                    setModalOpen(true);
                  }}
                  className="rounded-full"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {meals.length === 0 ? (
                <p className="text-xs text-muted font-sans text-center py-s3 uppercase tracking-wider">
                  No meals logged
                </p>
              ) : (
                <div className="space-y-s2">
                  {meals.map((meal) => (
                    <div
                      key={meal.id}
                      className="flex items-center justify-between px-s3 py-s3 bg-surface rounded-2xl"
                    >
                      <div className="flex items-center gap-s2">
                        <span className="text-sm font-sans text-cream">
                          {meal.food.name}
                        </span>
                        <span className="text-[10px] text-muted font-sans">
                          x{meal.servings}
                        </span>
                      </div>
                      <div className="flex items-center gap-s2">
                        <span className="text-xs font-sans text-muted">
                          {Math.round(meal.food.calories * meal.servings)} kcal
                        </span>
                        <button
                          onClick={() => removeMeal(today, meal.id)}
                          className="text-muted hover:text-coral transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          );
        })}
      </motion.div>

      {/* Total */}
      <div className="glass rounded-3xl p-s4 flex items-center justify-between">
        <span className="text-sm font-bauhaus text-cream">Total Calories</span>
        <span className="text-2xl font-bauhaus text-amber">{Math.round(totalMealCals)}</span>
      </div>

      {/* Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log Meal"
        className="rounded-3xl"
      >
        <div className="space-y-s3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted font-sans mb-s2">
              Meal Type
            </p>
            <div className="flex gap-s2">
              {mealTypes.map((mt) => (
                <button
                  key={mt}
                  onClick={() => setSelectedMealType(mt)}
                  className={`flex-1 py-s2 text-[10px] uppercase tracking-wider font-sans rounded-xl transition-all ${
                    selectedMealType === mt
                      ? "text-ink font-bold"
                      : "bg-surface text-muted hover:text-cream"
                  }`}
                  style={
                    selectedMealType === mt
                      ? { backgroundColor: mealColors[mt] }
                      : undefined
                  }
                >
                  {mealEmoji[mt]} {mt}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Search Food"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search foods..."
            className="rounded-xl"
          />

          <div className="max-h-48 overflow-y-auto space-y-s1 rounded-2xl border border-border bg-surface p-s1">
            {filteredFoods.length === 0 ? (
              <p className="text-xs text-muted font-sans text-center py-s3">
                No foods found
              </p>
            ) : (
              filteredFoods.map((food) => (
                <button
                  key={food.id}
                  onClick={() => setSelectedFood(food.id)}
                  className={`w-full text-left px-s3 py-s2 text-sm font-sans transition-colors rounded-xl ${
                    selectedFood === food.id
                      ? "bg-cream text-ink"
                      : "text-cream hover:bg-surface-variant"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{food.name}</span>
                    <span className="text-[10px] opacity-70">
                      {food.calories} kcal / {food.servingSize}
                    </span>
                  </div>
                  <div className="text-[10px] opacity-60">
                    P: {food.protein}g · C: {food.carbs}g · F:{" "}
                    {food.fat}g
                  </div>
                </button>
              ))
            )}
          </div>

          <Input
            label="Servings"
            type="number"
            min={0.5}
            step={0.5}
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            className="rounded-xl"
          />

          <div className="flex justify-end gap-s2 pt-s2">
            <Button variant="ghost" onClick={() => setModalOpen(false)} className="rounded-full">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddMeal} className="rounded-full">
              Add
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

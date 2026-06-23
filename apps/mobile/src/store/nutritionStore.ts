import { create } from "zustand";
import type { MealEntry, FoodItem, DailyNutrition } from "@ticktick/shared";

interface NutritionStore {
  dailyLogs: Record<string, DailyNutrition>;
  foodDatabase: FoodItem[];
  addMeal: (date: string, entry: MealEntry) => void;
  removeMeal: (date: string, mealId: string) => void;
  getDay: (date: string) => DailyNutrition;
}

const defaultFoods: FoodItem[] = [
  { id: "f1", name: "Chicken Breast", servingSize: "100g", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: "f2", name: "Brown Rice", servingSize: "1 cup", calories: 216, protein: 5, carbs: 45, fat: 1.8 },
  { id: "f3", name: "Broccoli", servingSize: "1 cup", calories: 55, protein: 4, carbs: 11, fat: 0.6 },
  { id: "f6", name: "Banana", servingSize: "1 medium", calories: 105, protein: 1, carbs: 27, fat: 0.4 },
  { id: "f8", name: "Salmon", servingSize: "100g", calories: 208, protein: 20, carbs: 0, fat: 13 },
];

const defaultGoals = { goalCalories: 2000, goalProtein: 150, goalCarbs: 250, goalFat: 65 };

export const useNutritionStore = create<NutritionStore>((set, get) => ({
  dailyLogs: {},
  foodDatabase: defaultFoods,
  addMeal: (date, entry) =>
    set((state) => {
      const day = state.dailyLogs[date] || {
        date, ...defaultGoals, totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, meals: [],
      };
      return {
        dailyLogs: {
          ...state.dailyLogs,
          [date]: {
            ...day,
            totalCalories: day.totalCalories + entry.food.calories * entry.servings,
            totalProtein: day.totalProtein + entry.food.protein * entry.servings,
            totalCarbs: day.totalCarbs + entry.food.carbs * entry.servings,
            totalFat: day.totalFat + entry.food.fat * entry.servings,
            meals: [...day.meals, entry],
          },
        },
      };
    }),
  removeMeal: (date, mealId) =>
    set((state) => {
      const day = state.dailyLogs[date];
      if (!day) return state;
      const meal = day.meals.find((m) => m.id === mealId);
      if (!meal) return state;
      return {
        dailyLogs: {
          ...state.dailyLogs,
          [date]: {
            ...day,
            totalCalories: day.totalCalories - meal.food.calories * meal.servings,
            totalProtein: day.totalProtein - meal.food.protein * meal.servings,
            totalCarbs: day.totalCarbs - meal.food.carbs * meal.servings,
            totalFat: day.totalFat - meal.food.fat * meal.servings,
            meals: day.meals.filter((m) => m.id !== mealId),
          },
        },
      };
    }),
  getDay: (date) =>
    get().dailyLogs[date] || { date, ...defaultGoals, totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, meals: [] },
}));

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MealEntry, FoodItem, DailyNutrition } from "@ticktick/shared";

interface NutritionStore {
  dailyLogs: Record<string, DailyNutrition>;
  foodDatabase: FoodItem[];
  addMeal: (date: string, entry: MealEntry) => void;
  removeMeal: (date: string, entryId: string) => void;
  getDay: (date: string) => DailyNutrition;
}

const defaultFoods: FoodItem[] = [
  { id: "f1", name: "Chicken Breast", servingSize: "100g", calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { id: "f2", name: "Brown Rice", servingSize: "1 cup", calories: 216, protein: 5, carbs: 45, fat: 1.8 },
  { id: "f3", name: "Broccoli", servingSize: "1 cup", calories: 55, protein: 4, carbs: 11, fat: 0.6 },
  { id: "f4", name: "Eggs", servingSize: "2 large", calories: 143, protein: 12, carbs: 1, fat: 9.5 },
  { id: "f5", name: "Oatmeal", servingSize: "1 cup", calories: 154, protein: 5, carbs: 27, fat: 3 },
  { id: "f6", name: "Banana", servingSize: "1 medium", calories: 105, protein: 1, carbs: 27, fat: 0.4 },
  { id: "f7", name: "Greek Yogurt", servingSize: "200g", calories: 146, protein: 20, carbs: 8, fat: 3.8 },
  { id: "f8", name: "Salmon", servingSize: "100g", calories: 208, protein: 20, carbs: 0, fat: 13 },
  { id: "f9", name: "Sweet Potato", servingSize: "1 medium", calories: 103, protein: 2, carbs: 24, fat: 0.2 },
  { id: "f10", name: "Avocado", servingSize: "1/2 fruit", calories: 160, protein: 2, carbs: 8, fat: 14.7 },
  { id: "f11", name: "Almonds", servingSize: "28g", calories: 164, protein: 6, carbs: 6, fat: 14 },
  { id: "f12", name: "Apple", servingSize: "1 medium", calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
];

const defaultGoals = { goalCalories: 2000, goalProtein: 150, goalCarbs: 250, goalFat: 65 };

export const useNutritionStore = create<NutritionStore>()(
  persist(
    (set, get) => ({
      dailyLogs: {},
      foodDatabase: defaultFoods,

      addMeal: (date, entry) =>
        set((state) => {
          const day = state.dailyLogs[date] || {
            date,
            ...defaultGoals,
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            meals: [],
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

      removeMeal: (date, entryId) =>
        set((state) => {
          const day = state.dailyLogs[date];
          if (!day) return state;
          const entry = day.meals.find((m) => m.id === entryId);
          if (!entry) return state;
          return {
            dailyLogs: {
              ...state.dailyLogs,
              [date]: {
                ...day,
                totalCalories: day.totalCalories - entry.food.calories * entry.servings,
                totalProtein: day.totalProtein - entry.food.protein * entry.servings,
                totalCarbs: day.totalCarbs - entry.food.carbs * entry.servings,
                totalFat: day.totalFat - entry.food.fat * entry.servings,
                meals: day.meals.filter((m) => m.id !== entryId),
              },
            },
          };
        }),

      getDay: (date) => {
        const day = get().dailyLogs[date];
        return (
          day || {
            date,
            ...defaultGoals,
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            meals: [],
          }
        );
      },
    }),
    { name: "routtein-nutrition" }
  )
);

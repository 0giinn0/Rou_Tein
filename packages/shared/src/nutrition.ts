export interface FoodItem {
  id: string;
  name: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface MealEntry {
  id: string;
  mealType: MealType;
  food: FoodItem;
  servings: number;
  date: string;
  time: string;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface DailyNutrition {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: MealEntry[];
  goalCalories: number;
  goalProtein: number;
  goalCarbs: number;
  goalFat: number;
}

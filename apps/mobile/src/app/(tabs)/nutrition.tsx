import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNutritionStore } from "../../store/nutritionStore";
import { useStreakStore } from "../../store/streakStore";
import { ProgressRing } from "../../components/ProgressRing";
import { useThemeColors } from "../../theme/useThemeColors";
import { hapticLight, hapticSuccess } from "../../lib/haptics";
import { format } from "date-fns";
import type { MealType } from "@ticktick/shared";

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

const mealIcons: Record<MealType, keyof typeof Ionicons.glyphMap> = {
  breakfast: "sunny-outline",
  lunch: "restaurant-outline",
  dinner: "moon-outline",
  snack: "cafe-outline",
};

const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

export default function NutritionScreen() {
  const colors = useThemeColors();
  const mealColors: Record<MealType, string> = {
    breakfast: colors.amber,
    lunch: colors.sky,
    dinner: colors.violet,
    snack: colors.coral,
  };
  const today = format(new Date(), "yyyy-MM-dd");
  const { foodDatabase, addMeal, removeMeal, getDay } = useNutritionStore();
  const streakState = useStreakStore();
  const day = getDay(today);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>("breakfast");
  const [selectedFood, setSelectedFood] = useState(foodDatabase[0]?.id || "");
  const [servings, setServings] = useState("1");
  const [servingsError, setServingsError] = useState("");

  useEffect(() => {
    streakState.initializeDay();
  }, [streakState]);

  useEffect(() => {
    if (day.meals.length > 0) {
      streakState.completeChallenge("log-a-meal");
    }
  }, [day.meals.length, streakState]);

  const handleAdd = () => {
    const servingNum = Number(servings);
    if (isNaN(servingNum) || servingNum <= 0) {
      setServingsError("Enter a valid number greater than 0");
      hapticLight();
      return;
    }
    setServingsError("");
    hapticSuccess();
    const food = foodDatabase.find((f) => f.id === selectedFood);
    if (!food) return;
    addMeal(today, {
      id: generateId(),
      mealType: selectedMealType,
      food,
      servings: servingNum,
      date: today,
      time: new Date().toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }),
    });
    setModalVisible(false);
    setServings("1");
  };

  const macros = [
    { label: "Calories", value: day.totalCalories, goal: day.goalCalories, unit: "kcal", color: colors.amber },
    { label: "Protein", value: day.totalProtein, goal: day.goalProtein, unit: "g", color: colors.coral },
    { label: "Carbs", value: day.totalCarbs, goal: day.goalCarbs, unit: "g", color: colors.sky },
    { label: "Fat", value: day.totalFat, goal: day.goalFat, unit: "g", color: colors.violet },
  ];

  const totalMealCals = day.meals.reduce((sum, m) => sum + m.food.calories * m.servings, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <View style={{ flex: 1, padding: 20 }}>
        {/* Header */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: "800", color: colors.cream }}>Nutrition</Text>
        </View>

        {/* Macros */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, justifyContent: "space-between" }}>
            {macros.map((m) => (
              <View key={m.label} style={{ width: "22%", alignItems: "center" }}>
                <ProgressRing
                  value={m.value}
                  max={m.goal}
                  size={56}
                  strokeWidth={5}
                  color={m.color}
                >
                  <Text style={{ fontSize: 9, fontWeight: "700", color: colors.cream }}>
                    {Math.round((m.value / m.goal) * 100)}%
                  </Text>
                </ProgressRing>
                <Text style={{ fontSize: 10, color: colors.muted, marginTop: 6, textTransform: "uppercase" }}>{m.label}</Text>
                <Text style={{ fontSize: 9, color: colors.muted }}>
                  {Math.round(m.value)}/{m.goal}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Total */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 16,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 16,
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "700", color: colors.cream }}>Total Calories</Text>
          <Text style={{ fontSize: 24, fontWeight: "800", color: colors.amber }}>{Math.round(totalMealCals)}</Text>
        </View>

        {/* Meals */}
        <FlatList
          data={mealTypes}
          keyExtractor={(item) => item}
          contentContainerStyle={{ gap: 10, paddingBottom: 100 }}
          renderItem={({ item: mealType }) => {
            const meals = day.meals.filter((m) => m.mealType === mealType);
            const totalCals = meals.reduce((s, m) => s + m.food.calories * m.servings, 0);
            return (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 24,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      backgroundColor: `${mealColors[mealType]}15`,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name={mealIcons[mealType]} size={18} color={mealColors[mealType]} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 15, fontWeight: "700", color: colors.cream, textTransform: "capitalize" }}>
                    {mealType}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.muted }}>{Math.round(totalCals)} kcal</Text>
                  <TouchableOpacity
                    onPress={() => {
                      hapticLight();
                      setSelectedMealType(mealType);
                      setModalVisible(true);
                    }}
                  >
                    <Ionicons name="add-circle" size={24} color={mealColors[mealType]} />
                  </TouchableOpacity>
                </View>
                {meals.length === 0 ? (
                  <Text style={{ fontSize: 12, color: colors.muted }}>No meals logged</Text>
                ) : (
                  meals.map((meal) => (
                    <View
                      key={meal.id}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingVertical: 8,
                        borderTopWidth: 1,
                        borderTopColor: colors.border,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, color: colors.cream }}>{meal.food.name}</Text>
                        <Text style={{ fontSize: 11, color: colors.muted }}>x{meal.servings}</Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Text style={{ fontSize: 12, color: colors.muted }}>
                          {Math.round(meal.food.calories * meal.servings)} kcal
                        </Text>
                        <TouchableOpacity onPress={() => removeMeal(today, meal.id)}>
                          <Ionicons name="trash-outline" size={16} color={colors.muted} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </View>
            );
          }}
        />
      </View>

      {/* Add Meal Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              padding: 24,
              borderWidth: 1,
              borderColor: colors.border,
              maxHeight: "80%",
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "800", color: colors.cream, marginBottom: 16 }}>Log Meal</Text>

            <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
              {mealTypes.map((mt) => (
                <TouchableOpacity
                  key={mt}
                  onPress={() => {
                    hapticLight();
                    setSelectedMealType(mt);
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 12,
                    backgroundColor: selectedMealType === mt ? mealColors[mt] : colors.surfaceVariant,
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name={mealIcons[mt]}
                    size={18}
                    color={selectedMealType === mt ? colors.bg : colors.muted}
                  />
                  <Text
                    style={{
                      fontSize: 10,
                      color: selectedMealType === mt ? colors.bg : colors.muted,
                      marginTop: 2,
                      textTransform: "capitalize",
                    }}
                  >
                    {mt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <FlatList
              data={foodDatabase}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 200, marginBottom: 12 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    hapticLight();
                    setSelectedFood(item.id);
                  }}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: selectedFood === item.id ? colors.cream : colors.surfaceVariant,
                    marginBottom: 6,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: "600", color: selectedFood === item.id ? colors.bg : colors.cream }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 11, color: selectedFood === item.id ? colors.subtle : colors.muted }}>
                    {item.calories} kcal / {item.servingSize} · P:{item.protein}g C:{item.carbs}g F:{item.fat}g
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TextInput
              style={{
                backgroundColor: colors.surfaceVariant,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 15,
                color: colors.cream,
                marginBottom: servingsError ? 6 : 16,
                borderWidth: servingsError ? 1 : 0,
                borderColor: servingsError ? colors.coral : "transparent",
              }}
              placeholder="Servings"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              value={servings}
              onChangeText={(t) => { setServings(t); if (servingsError) setServingsError(""); }}
            />
            {servingsError ? <Text style={{ fontSize: 12, color: colors.coral, marginBottom: 16 }}>{servingsError}</Text> : null}

            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: colors.surfaceVariant, alignItems: "center" }}
              >
                <Text style={{ fontWeight: "700", color: colors.cream }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleAdd}
                style={{ flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: colors.cream, alignItems: "center" }}
              >
                <Text style={{ fontWeight: "700", color: colors.bg }}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

import { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkoutStore } from "../../store/workoutStore";
import { useStreakStore } from "../../store/streakStore";
import { useThemeColors } from "../../theme/useThemeColors";
import { WEEKLY_WORKOUT } from "@ticktick/shared";
import { hapticLight, hapticSuccess } from "../../lib/haptics";

export default function FitnessScreen() {
  const colors = useThemeColors();
  const workout = useWorkoutStore();
  const streak = useStreakStore();

  useEffect(() => {
    workout.initWeek();
  }, []);

  const weekProgress = workout.getWeekProgress();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <Text style={{ fontSize: 28, fontWeight: "800", color: colors.cream, marginBottom: 20 }}>Fitness</Text>

        {/* Week progress */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "700", color: colors.muted, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>
            This Week
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
            <View>
              <Text style={{ fontSize: 40, fontWeight: "800", color: colors.cream }}>{weekProgress}%</Text>
              <Text style={{ fontSize: 13, color: colors.muted }}>
                {workout.days.filter((d) => d.completed).length}/7 days completed
              </Text>
            </View>
            <Ionicons name={weekProgress === 100 ? "trophy" : "flame"} size={48} color={weekProgress === 100 ? colors.amber : colors.coral} />
          </View>
          {/* Week day dots */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            {WEEKLY_WORKOUT.map((day, i) => {
              const isDone = workout.days.find((d) => d.id === day.id)?.completed;
              return (
                <View key={day.id} style={{ alignItems: "center" }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: isDone ? colors.emerald : colors.surfaceVariant,
                      borderWidth: 2,
                      borderColor: isDone ? colors.emerald : colors.border,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isDone ? (
                      <Ionicons name="checkmark" size={18} color={colors.bg} />
                    ) : (
                      <Text style={{ fontSize: 13, fontWeight: "700", color: colors.muted }}>{i + 1}</Text>
                    )}
                  </View>
                  <Text style={{ fontSize: 9, color: isDone ? colors.emerald : colors.muted, marginTop: 4, fontWeight: "700" }}>
                    {["M", "T", "W", "T", "F", "S", "S"][i]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Day cards */}
        <Text style={{ fontSize: 18, fontWeight: "700", color: colors.cream, marginBottom: 12 }}>Workout Plan</Text>
        <View style={{ gap: 12 }}>
          {workout.days.map((day) => {
            const dayProgress = workout.getDayProgress(day.id);
            return (
              <View
                key={day.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 24,
                  padding: 18,
                  borderWidth: 1,
                  borderColor: day.completed ? `${colors.emerald}30` : colors.border,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 16,
                      backgroundColor: day.completed ? `${colors.emerald}15` : colors.surfaceVariant,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {day.completed ? (
                      <Ionicons name="checkmark-circle" size={22} color={colors.emerald} />
                    ) : (
                      <Ionicons name="barbell-outline" size={22} color={colors.coral} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: colors.cream }}>{day.label}</Text>
                    <Text style={{ fontSize: 12, color: colors.muted }}>{day.description}</Text>
                  </View>
                  {!day.completed && (
                    <TouchableOpacity
                      onPress={() => {
                        hapticSuccess();
                        workout.toggleDay(day.id);
                        streak.recordActivity("task");
                      }}
                      style={{
                        backgroundColor: colors.cream,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 14,
                      }}
                    >
                      <Text style={{ fontWeight: "800", color: colors.bg, fontSize: 13 }}>Done</Text>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Exercises */}
                <View style={{ gap: 6, paddingLeft: 56 }}>
                  {day.exercises.map((ex) => {
                    const done = workout.exerciseCompletions[`${day.id}-${ex.id}`];
                    return (
                      <TouchableOpacity
                        key={ex.id}
                        onPress={() => {
                          hapticLight();
                          workout.toggleExercise(day.id, ex.id);
                        }}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                          paddingVertical: 8,
                          paddingHorizontal: 10,
                          borderRadius: 12,
                          backgroundColor: done ? `${colors.emerald}10` : "transparent",
                        }}
                      >
                        <View
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 6,
                            borderWidth: 2,
                            borderColor: done ? colors.emerald : colors.muted,
                            backgroundColor: done ? colors.emerald : "transparent",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {done && <Ionicons name="checkmark" size={14} color={colors.bg} />}
                        </View>
                        <Text style={{ flex: 1, fontSize: 14, color: done ? colors.emerald : colors.cream }}>
                          {ex.icon} {ex.name}
                        </Text>
                        <Text style={{ fontSize: 12, color: colors.muted }}>
                          {ex.reps === 1 ? `${ex.sets} min` : `${ex.sets}x${ex.reps}`}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Day progress bar */}
                <View style={{ marginTop: 12, paddingLeft: 56 }}>
                  <View style={{ height: 4, backgroundColor: colors.surfaceVariant, borderRadius: 2 }}>
                    <View style={{ width: `${dayProgress}%`, height: 4, backgroundColor: colors.emerald, borderRadius: 2 }} />
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

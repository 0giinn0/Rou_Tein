import { useEffect, useState, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useWorkoutStore } from "../../store/workoutStore";
import { useStreakStore } from "../../store/streakStore";
import { useThemeColors } from "../../theme/useThemeColors";
import { FocusTimer } from "../../components/FocusTimer";
import { WEEKLY_WORKOUT, EXERCISES, EXERCISE_CATEGORIES } from "@ticktick/shared";
import type { Exercise, ExerciseCategory, CustomWorkout } from "@ticktick/shared";
import { hapticLight, hapticSuccess } from "../../lib/haptics";

export default function FitnessScreen() {
  const colors = useThemeColors();
  const workout = useWorkoutStore();
  const streak = useStreakStore();

  useEffect(() => { workout.initWeek(); }, []);

  const [builderVisible, setBuilderVisible] = useState(false);
  const [builderStep, setBuilderStep] = useState<"name" | "select">("name");
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const [builderCategory, setBuilderCategory] = useState<ExerciseCategory>("push");
  const [selectedExercises, setSelectedExercises] = useState<{ exerciseId: string; sets: number; reps: number }[]>([]);

  const weekProgress = workout.getWeekProgress();

  // ── Builder helpers ──
  const filteredExercises = useMemo(
    () => EXERCISES.filter((e) => e.category === builderCategory),
    [builderCategory]
  );

  const handleAddExercise = (ex: Exercise) => {
    if (selectedExercises.find((s) => s.exerciseId === ex.id)) return;
    hapticLight();
    setSelectedExercises((prev) => [...prev, { exerciseId: ex.id, sets: ex.suggestedSets, reps: ex.suggestedReps }]);
  };

  const handleRemoveExercise = (exId: string) => {
    hapticLight();
    setSelectedExercises((prev) => prev.filter((e) => e.exerciseId !== exId));
  };

  const handleCreate = () => {
    const name = newWorkoutName.trim();
    if (!name || selectedExercises.length === 0) return;
    workout.createCustomWorkout(name, selectedExercises);
    hapticSuccess();
    setBuilderVisible(false);
    setNewWorkoutName("");
    setSelectedExercises([]);
    setBuilderStep("name");
    setBuilderCategory("push");
  };

  // ── Active custom workout ──
  const activeCustom = workout.customWorkouts.find(
    (w) => w.id === workout.activeCustomWorkoutId
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <Text style={{ fontSize: 28, fontWeight: "800", color: colors.cream, marginBottom: 20 }}>Fitness</Text>

        {/* ── Focus Timer ── */}
        <FocusTimer />

        {/* ── Active Custom Workout ── */}
        {activeCustom && (
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 24,
              padding: 20,
              borderWidth: 1,
              borderColor: `${colors.violet}30`,
              marginBottom: 20,
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: colors.cream }}>{activeCustom.name}</Text>
                <Text style={{ fontSize: 12, color: colors.muted }}>
                  {activeCustom.exercises.length} exercises · {workout.getCustomWorkoutProgress(activeCustom.id)}% done
                </Text>
              </View>
              <TouchableOpacity onPress={() => {
                hapticLight();
                workout.setActiveCustomWorkout(null);
              }}>
                <Ionicons name="close-circle" size={28} color={colors.muted} />
              </TouchableOpacity>
            </View>

            <View style={{ height: 4, backgroundColor: colors.surfaceVariant, borderRadius: 2, marginBottom: 16 }}>
              <View style={{ width: `${workout.getCustomWorkoutProgress(activeCustom.id)}%`, height: 4, backgroundColor: colors.violet, borderRadius: 2 }} />
            </View>

            <View style={{ gap: 8 }}>
              {activeCustom.exercises.map((entry) => {
                const ex = EXERCISES.find((e) => e.id === entry.exerciseId);
                if (!ex) return null;
                const done = workout.customExerciseCompletions[`${activeCustom.id}-${ex.id}`];
                return (
                  <TouchableOpacity
                    key={entry.exerciseId}
                    onPress={() => {
                      hapticLight();
                      workout.toggleCustomExercise(activeCustom.id, ex.id);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      padding: 12,
                      borderRadius: 14,
                      backgroundColor: done ? `${colors.emerald}10` : colors.surfaceVariant,
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
                    <Text style={{ flex: 1, fontSize: 14, color: done ? colors.emerald : colors.cream }}>{ex.icon} {ex.name}</Text>
                    <Text style={{ fontSize: 12, color: colors.muted }}>{entry.sets}x{entry.reps}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ── My Workouts ── */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Ionicons name="barbell-outline" size={18} color={colors.violet} />
              <Text style={{ fontSize: 18, fontWeight: "700", color: colors.cream }}>My Workouts</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                hapticLight();
                setBuilderVisible(true);
                setBuilderStep("name");
                setNewWorkoutName("");
                setSelectedExercises([]);
              }}
              style={{
                backgroundColor: colors.violet,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 14,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Ionicons name="add" size={16} color={colors.bg} />
              <Text style={{ fontWeight: "800", color: colors.bg, fontSize: 13 }}>Create</Text>
            </TouchableOpacity>
          </View>

          {workout.customWorkouts.length === 0 ? (
            <View
              style={{
                backgroundColor: colors.surfaceVariant,
                borderRadius: 20,
                padding: 30,
                alignItems: "center",
                borderWidth: 1,
                borderColor: colors.border,
                borderStyle: "dashed",
              }}
            >
              <Ionicons name="fitness-outline" size={32} color={colors.muted} />
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.muted, marginTop: 10 }}>No custom workouts yet</Text>
              <Text style={{ fontSize: 12, color: colors.subtle, marginTop: 4, textAlign: "center" }}>
                Tap "Create" to build your own workout from 100+ exercises
              </Text>
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              {workout.customWorkouts.map((cw) => {
                const progress = workout.getCustomWorkoutProgress(cw.id);
                return (
                  <TouchableOpacity
                    key={cw.id}
                    onPress={() => {
                      hapticLight();
                      workout.setActiveCustomWorkout(cw.id);
                    }}
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 20,
                      padding: 16,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 15, fontWeight: "700", color: colors.cream }}>{cw.name}</Text>
                        <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
                          {cw.exercises.length} exercises
                        </Text>
                      </View>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <Text style={{ fontSize: 13, fontWeight: "700", color: progress === 100 ? colors.emerald : colors.violet }}>
                          {progress}%
                        </Text>
                        <TouchableOpacity onPress={() => {
                          hapticLight();
                          workout.deleteCustomWorkout(cw.id);
                        }}>
                          <Ionicons name="trash-outline" size={16} color={colors.muted} />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={{ height: 4, backgroundColor: colors.surfaceVariant, borderRadius: 2, marginTop: 8 }}>
                      <View style={{ width: `${progress}%`, height: 4, backgroundColor: colors.violet, borderRadius: 2 }} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* ── 7-Day Workout Plan ── */}
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
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            {WEEKLY_WORKOUT.map((day, i) => {
              const isDone = workout.days.find((d) => d.id === day.id)?.completed;
              return (
                <View key={day.id} style={{ alignItems: "center" }}>
                  <View
                    style={{
                      width: 36, height: 36, borderRadius: 18,
                      backgroundColor: isDone ? colors.emerald : colors.surfaceVariant,
                      borderWidth: 2,
                      borderColor: isDone ? colors.emerald : colors.border,
                      alignItems: "center", justifyContent: "center",
                    }}
                  >
                    {isDone ? <Ionicons name="checkmark" size={18} color={colors.bg} /> : <Text style={{ fontSize: 13, fontWeight: "700", color: colors.muted }}>{i + 1}</Text>}
                  </View>
                  <Text style={{ fontSize: 9, color: isDone ? colors.emerald : colors.muted, marginTop: 4, fontWeight: "700" }}>
                    {["M","T","W","T","F","S","S"][i]}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Daily Workout Cards ── */}
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
                  <View style={{ width: 44, height: 44, borderRadius: 16, backgroundColor: day.completed ? `${colors.emerald}15` : colors.surfaceVariant, alignItems: "center", justifyContent: "center" }}>
                    {day.completed ? <Ionicons name="checkmark-circle" size={22} color={colors.emerald} /> : <Ionicons name="barbell-outline" size={22} color={colors.coral} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: colors.cream }}>{day.label}</Text>
                    <Text style={{ fontSize: 12, color: colors.muted }}>{day.description}</Text>
                  </View>
                  {!day.completed && (
                    <TouchableOpacity
                      onPress={() => { hapticSuccess(); workout.toggleDay(day.id); streak.recordActivity("task"); }}
                      style={{ backgroundColor: colors.cream, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 14 }}
                    >
                      <Text style={{ fontWeight: "800", color: colors.bg, fontSize: 13 }}>Done</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={{ gap: 6, paddingLeft: 56 }}>
                  {day.exercises.map((ex) => {
                    const done = workout.exerciseCompletions[`${day.id}-${ex.id}`];
                    return (
                      <TouchableOpacity
                        key={ex.id}
                        onPress={() => { hapticLight(); workout.toggleExercise(day.id, ex.id); }}
                        style={{
                          flexDirection: "row", alignItems: "center", gap: 8,
                          paddingVertical: 8, paddingHorizontal: 10, borderRadius: 12,
                          backgroundColor: done ? `${colors.emerald}10` : "transparent",
                        }}
                      >
                        <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: done ? colors.emerald : colors.muted, backgroundColor: done ? colors.emerald : "transparent", alignItems: "center", justifyContent: "center" }}>
                          {done && <Ionicons name="checkmark" size={14} color={colors.bg} />}
                        </View>
                        <Text style={{ flex: 1, fontSize: 14, color: done ? colors.emerald : colors.cream }}>{ex.icon} {ex.name}</Text>
                        <Text style={{ fontSize: 12, color: colors.muted }}>{ex.reps === 1 ? `${ex.sets} min` : `${ex.sets}x${ex.reps}`}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

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

      {/* ── Builder Modal ── */}
      <Modal visible={builderVisible} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              padding: 24,
              borderWidth: 1,
              borderColor: colors.border,
              maxHeight: "90%",
            }}
          >
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Text style={{ fontSize: 20, fontWeight: "800", color: colors.cream }}>
                {builderStep === "name" ? "New Workout" : "Add Exercises"}
              </Text>
              <TouchableOpacity onPress={() => setBuilderVisible(false)}>
                <Ionicons name="close" size={24} color={colors.muted} />
              </TouchableOpacity>
            </View>

            {builderStep === "name" ? (
              <>
                <TextInput
                  style={{
                    backgroundColor: colors.surfaceVariant,
                    borderRadius: 16,
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    fontSize: 15,
                    color: colors.cream,
                    marginBottom: 20,
                  }}
                  placeholder="Workout name (e.g. Leg Day)"
                  placeholderTextColor={colors.muted}
                  value={newWorkoutName}
                  onChangeText={setNewWorkoutName}
                  autoFocus
                />
                <TouchableOpacity
                  onPress={() => {
                    if (!newWorkoutName.trim()) return;
                    hapticLight();
                    setBuilderStep("select");
                  }}
                  style={{ backgroundColor: colors.cream, paddingVertical: 14, borderRadius: 16, alignItems: "center" }}
                >
                  <Text style={{ fontWeight: "800", color: colors.bg }}>Continue</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* Category tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {EXERCISE_CATEGORIES.map((cat) => (
                      <TouchableOpacity
                        key={cat.key}
                        onPress={() => { hapticLight(); setBuilderCategory(cat.key); }}
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 8,
                          borderRadius: 14,
                          backgroundColor: builderCategory === cat.key ? colors.cream : colors.surfaceVariant,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Text style={{ fontSize: 12 }}>{cat.emoji}</Text>
                        <Text style={{ fontSize: 13, fontWeight: "700", color: builderCategory === cat.key ? colors.bg : colors.muted }}>
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>

                {/* Selected count */}
                <Text style={{ fontSize: 12, color: colors.violet, marginBottom: 12, fontWeight: "600" }}>
                  Selected: {selectedExercises.length} exercises
                </Text>

                {/* Exercise list */}
                <FlatList
                  data={filteredExercises}
                  keyExtractor={(item) => item.id}
                  style={{ maxHeight: 280, marginBottom: 16 }}
                  renderItem={({ item }) => {
                    const selected = selectedExercises.find((s) => s.exerciseId === item.id);
                    return (
                      <TouchableOpacity
                        onPress={() => (selected ? handleRemoveExercise(item.id) : handleAddExercise(item))}
                        style={{
                          padding: 12,
                          borderRadius: 12,
                          backgroundColor: selected ? `${colors.violet}15` : colors.surfaceVariant,
                          marginBottom: 6,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Text style={{ fontSize: 16 }}>{item.icon}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, fontWeight: "600", color: selected ? colors.violet : colors.cream }}>
                            {item.name}
                          </Text>
                          <Text style={{ fontSize: 11, color: colors.muted }}>
                            {item.difficulty} · {item.suggestedSets}x{item.suggestedReps}
                            {item.equipment ? ` · ${item.equipment}` : ""}
                          </Text>
                        </View>
                        <Ionicons name={selected ? "checkmark-circle" : "add-circle-outline"} size={22} color={selected ? colors.violet : colors.muted} />
                      </TouchableOpacity>
                    );
                  }}
                />

                {/* Actions */}
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity
                    onPress={() => { hapticLight(); setBuilderStep("name"); }}
                    style={{ flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: colors.surfaceVariant, alignItems: "center" }}
                  >
                    <Text style={{ fontWeight: "700", color: colors.cream }}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCreate}
                    style={{ flex: 1, paddingVertical: 14, borderRadius: 16, backgroundColor: selectedExercises.length > 0 ? colors.cream : colors.surfaceVariant, alignItems: "center" }}
                    disabled={selectedExercises.length === 0}
                  >
                    <Text style={{ fontWeight: "800", color: selectedExercises.length > 0 ? colors.bg : colors.muted }}>Create</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

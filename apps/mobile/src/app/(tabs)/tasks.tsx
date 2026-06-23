import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTaskStore } from "../../store/taskStore";
import { useStreakStore } from "../../store/streakStore";
import { useThemeColors } from "../../theme/useThemeColors";
import { hapticLight, hapticSuccess } from "../../lib/haptics";
import type { Task, TaskPriority } from "@ticktick/shared";
import { format } from "date-fns";

function generateId() {
  return Math.random().toString(36).substring(2, 11);
}

export default function TasksScreen() {
  const colors = useThemeColors();
  const { tasks, addTask, updateTask, deleteTask } = useTaskStore();
  const streakState = useStreakStore();
  const [newTitle, setNewTitle] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority>("medium");

  const priorityColors: Record<TaskPriority, string> = {
    high: colors.coral,
    medium: colors.amber,
    low: colors.emerald,
  };

  useEffect(() => {
    streakState.initializeDay();
  }, [streakState]);

  const today = format(new Date(), "yyyy-MM-dd");
  const todayCompleted = tasks.filter(
    (t) => t.status === "completed" && t.dueDate?.startsWith(today)
  ).length;

  useEffect(() => {
    if (todayCompleted >= 3) {
      streakState.completeChallenge("complete-3-tasks");
    }
  }, [todayCompleted, streakState]);

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    hapticLight();
    const task: Task = {
      id: generateId(),
      title: newTitle,
      priority: selectedPriority,
      status: "pending",
      listId: "inbox",
      subtasks: [],
      tags: [],
      recurrence: "none",
      dueDate: today,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addTask(task);
    setNewTitle("");
    setSelectedPriority("medium");
    setModalVisible(false);
  };

  const toggleTask = (id: string) => {
    hapticLight();
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const willComplete = task.status !== "completed";
    updateTask(id, { status: task.status === "completed" ? "pending" : "completed" });
    if (willComplete) {
      hapticSuccess();
      streakState.completeTask();
    }
  };

  const remaining = tasks.filter((t) => t.status !== "completed").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <View style={{ flex: 1, padding: 20 }}>
        <View style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 28, fontWeight: "800", color: colors.cream }}>Tasks</Text>
        </View>
        <Text style={{ fontSize: 13, color: colors.muted, marginBottom: 20, textAlign: "center" }}>
          {remaining} remaining · {completedCount} completed
        </Text>

        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 18,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 16,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
            <Text style={{ fontSize: 13, color: colors.muted }}>Daily Progress</Text>
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.cream }}>{Math.round(progress)}%</Text>
          </View>
          <View style={{ height: 8, backgroundColor: colors.surfaceVariant, borderRadius: 4 }}>
            <View style={{ width: `${progress}%`, height: 8, backgroundColor: colors.emerald, borderRadius: 4 }} />
          </View>
          <Text style={{ fontSize: 11, color: colors.muted, marginTop: 8 }}>
            Complete 3 tasks today to finish the Task Master challenge
          </Text>
        </View>

        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ gap: 10, paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 32,
                  backgroundColor: colors.surfaceVariant,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Ionicons name="checkbox-outline" size={36} color={colors.muted} />
              </View>
              <Text style={{ fontSize: 18, fontWeight: "700", color: colors.cream, marginBottom: 6 }}>No tasks yet</Text>
              <Text style={{ fontSize: 13, color: colors.muted, textAlign: "center" }}>
                Tap the + button to add your first task and start your streak.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                backgroundColor: colors.surface,
                padding: 16,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <TouchableOpacity onPress={() => toggleTask(item.id)}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: item.status === "completed" ? colors.emerald : colors.muted,
                    backgroundColor: item.status === "completed" ? colors.emerald : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.status === "completed" && <Ionicons name="checkmark" size={16} color={colors.bg} />}
                </View>
              </TouchableOpacity>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "500",
                    color: item.status === "completed" ? colors.muted : colors.cream,
                    textDecorationLine: item.status === "completed" ? "line-through" : "none",
                  }}
                >
                  {item.title}
                </Text>
                {item.dueDate && (
                  <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>
                    {format(new Date(item.dueDate), "MMM d")}
                  </Text>
                )}
              </View>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: priorityColors[item.priority] }} />
              <TouchableOpacity onPress={() => deleteTask(item.id)}>
                <Ionicons name="trash-outline" size={18} color={colors.muted} />
              </TouchableOpacity>
            </View>
          )}
        />

        <TouchableOpacity
          onPress={() => {
            hapticLight();
            setModalVisible(true);
          }}
          style={{
            position: "absolute",
            right: 20,
            bottom: 24,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: colors.cream,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: colors.cream,
            shadowOpacity: 0.2,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <Ionicons name="add" size={28} color={colors.bg} />
        </TouchableOpacity>
      </View>

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
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "800", color: colors.cream, marginBottom: 16 }}>New Task</Text>
            <TextInput
              style={{
                backgroundColor: colors.surfaceVariant,
                borderRadius: 16,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 15,
                color: colors.cream,
                marginBottom: 16,
              }}
              placeholder="What needs to be done?"
              placeholderTextColor={colors.muted}
              value={newTitle}
              onChangeText={setNewTitle}
              autoFocus
            />
            <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>
              Priority
            </Text>
            <View style={{ flexDirection: "row", gap: 8, marginBottom: 24 }}>
              {(["low", "medium", "high"] as TaskPriority[]).map((p) => (
                <TouchableOpacity
                  key={p}
                  onPress={() => {
                    hapticLight();
                    setSelectedPriority(p);
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 12,
                    backgroundColor: selectedPriority === p ? priorityColors[p] : colors.surfaceVariant,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color: selectedPriority === p ? colors.bg : colors.cream,
                      textTransform: "capitalize",
                    }}
                  >
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
                <Text style={{ fontWeight: "700", color: colors.bg }}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

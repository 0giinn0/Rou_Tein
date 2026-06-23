import { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTaskStore } from "../../store/taskStore";
import { useNutritionStore } from "../../store/nutritionStore";
import { useStreakStore } from "../../store/streakStore";
import { InteractiveSphere } from "../../components/InteractiveSphere";
import { ProgressRing } from "../../components/ProgressRing";
import { DailyQuiz } from "../../components/DailyQuiz";
import { colors } from "../../theme/colors";
import { format } from "date-fns";

const { width } = Dimensions.get("window");

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const links = [
  { href: "/tasks" as const, label: "Tasks", icon: "list-outline" as const, color: colors.emerald },
  { href: "/weather" as const, label: "Weather", icon: "cloud-outline" as const, color: colors.sky },
  { href: "/nutrition" as const, label: "Nutrition", icon: "nutrition-outline" as const, color: colors.amber },
];

export default function HomeScreen() {
  const router = useRouter();
  const streakState = useStreakStore();
  const { tasks } = useTaskStore();
  const { getDay } = useNutritionStore();

  useEffect(() => {
    streakState.initializeDay();
  }, [streakState]);

  const today = format(new Date(), "yyyy-MM-dd");
  const day = getDay(today);
  const todayTasks = tasks.filter((t) => t.dueDate?.startsWith(today));
  const completedTasks = todayTasks.filter((t) => t.status === "completed").length;
  const taskProgress = todayTasks.length > 0 ? (completedTasks / todayTasks.length) * 100 : 0;
  const calPct = day.goalCalories > 0 ? Math.min((day.totalCalories / day.goalCalories) * 100, 100) : 0;
  const todayProgress = streakState.getTodayProgress();
  const challenges = streakState.challenges;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <View>
            <Text style={{ fontSize: 26, fontWeight: "800", color: colors.cream }}>{getGreeting()}</Text>
            <Text style={{ fontSize: 14, color: colors.muted, marginTop: 4 }}>
              {format(new Date(), "EEEE, MMMM do")}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: `${colors.amber}15`,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
            }}
          >
            <Ionicons name={"coins-outline" as any} size={16} color={colors.amber} />
            <Text style={{ fontSize: 14, fontWeight: "700", color: colors.amber }}>{streakState.coins}</Text>
          </View>
        </View>

        {/* Streak Hero */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 28,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
            marginBottom: 20,
            overflow: "hidden",
          }}
        >
          <View style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, opacity: 0.4 }}>
            <InteractiveSphere progress={todayProgress} />
          </View>

          <View style={{ position: "relative", zIndex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
              <View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <Ionicons name="flame" size={18} color={colors.coral} />
                  <Text style={{ fontSize: 12, fontWeight: "700", color: colors.coral, textTransform: "uppercase", letterSpacing: 0.5 }}>
                    Current Streak
                  </Text>
                </View>
                <Text style={{ fontSize: 48, fontWeight: "800", color: colors.cream }}>
                  {streakState.streak}
                  <Text style={{ fontSize: 16, fontWeight: "500", color: colors.muted }}> days</Text>
                </Text>
                <Text style={{ fontSize: 13, color: colors.muted, marginTop: 4 }}>
                  Longest: {streakState.longestStreak} days
                </Text>
              </View>
              <View style={{ alignItems: "flex-end", gap: 6 }}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="star" size={14} color={colors.violet} />
                  <Text style={{ fontSize: 13, fontWeight: "700", color: colors.violet }}>Lv. {streakState.level}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Ionicons name="flash" size={14} color={colors.amber} />
                  <Text style={{ fontSize: 13, fontWeight: "700", color: colors.amber }}>{streakState.xp} XP</Text>
                </View>
              </View>
            </View>

            <View style={{ marginTop: 24 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                <Text style={{ fontSize: 12, color: colors.muted }}>Progress to Level {streakState.level + 1}</Text>
                <Text style={{ fontSize: 12, color: colors.cream, fontWeight: "700" }}>
                  {Math.round(streakState.getProgressToNextLevel())}%
                </Text>
              </View>
              <View style={{ height: 8, backgroundColor: colors.surfaceVariant, borderRadius: 4 }}>
                <View
                  style={{
                    width: `${streakState.getProgressToNextLevel()}%`,
                    height: 8,
                    backgroundColor: colors.coral,
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Daily Challenges */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Ionicons name={"target" as any} size={18} color={colors.violet} />
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.cream }}>Daily Challenges</Text>
            <Text style={{ marginLeft: "auto", fontSize: 12, color: colors.muted, fontWeight: "700" }}>
              {challenges.filter((c) => c.completed).length}/{challenges.length}
            </Text>
          </View>

          <View style={{ gap: 8 }}>
            {challenges.map((challenge) => (
              <View
                key={challenge.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  padding: 14,
                  borderRadius: 20,
                  backgroundColor: challenge.completed ? `${colors.emerald}10` : colors.surface,
                  borderWidth: 1,
                  borderColor: challenge.completed ? `${colors.emerald}30` : colors.border,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 14,
                    backgroundColor: challenge.completed ? `${colors.emerald}15` : colors.surfaceVariant,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {challenge.completed ? (
                    <Ionicons name="checkmark-circle" size={18} color={colors.emerald} />
                  ) : (
                    <Text style={{ fontSize: 16 }}>{challenge.icon}</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: challenge.completed ? colors.emerald : colors.cream }}>
                    {challenge.title}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.muted }}>{challenge.description}</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: colors.amber }}>+{challenge.coinReward}</Text>
                  <Text style={{ fontSize: 10, color: colors.muted }}>{challenge.xpReward} XP</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Stats */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.cream, marginBottom: 12 }}>Today's Snapshot</Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 24,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
              }}
            >
              <ProgressRing value={completedTasks} max={todayTasks.length || 1} size={60} color={colors.emerald}>
                <Ionicons name="list-outline" size={20} color={colors.emerald} />
              </ProgressRing>
              <Text style={{ fontSize: 13, fontWeight: "700", color: colors.cream, marginTop: 8 }}>
                {completedTasks}/{todayTasks.length}
              </Text>
              <Text style={{ fontSize: 10, color: colors.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Tasks</Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 24,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
              }}
            >
              <ProgressRing value={day.totalCalories} max={day.goalCalories || 1} size={60} color={colors.amber}>
                <Ionicons name="nutrition-outline" size={20} color={colors.amber} />
              </ProgressRing>
              <Text style={{ fontSize: 13, fontWeight: "700", color: colors.cream, marginTop: 8 }}>
                {Math.round(calPct)}%
              </Text>
              <Text style={{ fontSize: 10, color: colors.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Calories</Text>
            </View>

            <View
              style={{
                flex: 1,
                backgroundColor: colors.surface,
                borderRadius: 24,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: "center",
              }}
            >
              <Ionicons name="cloud-outline" size={28} color={colors.sky} style={{ marginTop: 8 }} />
              <Text style={{ fontSize: 13, fontWeight: "700", color: colors.cream, marginTop: 14 }}>Check</Text>
              <Text style={{ fontSize: 10, color: colors.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>Weather</Text>
            </View>
          </View>
        </View>

        {/* Navigation Cards */}
        <View style={{ gap: 10, marginBottom: 20 }}>
          {links.map((link) => (
            <TouchableOpacity
              key={link.href}
              onPress={() => router.navigate(link.href as any)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                backgroundColor: colors.surface,
                padding: 18,
                borderRadius: 24,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  backgroundColor: `${link.color}15`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={link.icon} size={24} color={link.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: colors.cream }}>{link.label}</Text>
                <Text style={{ fontSize: 12, color: colors.muted, marginTop: 2 }}>
                  {link.label === "Tasks" ? "Manage your tasks and projects" :
                   link.label === "Weather" ? "Check forecast and conditions" :
                   "Track calories and macros"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.muted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Daily Quiz */}
        <DailyQuiz />
      </ScrollView>
    </SafeAreaView>
  );
}

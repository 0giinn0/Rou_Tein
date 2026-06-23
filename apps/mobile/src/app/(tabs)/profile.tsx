import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useStreakStore } from "../../store/streakStore";
import { useTaskStore } from "../../store/taskStore";
import { useThemeColors } from "../../theme/useThemeColors";
import { hapticLight, hapticSuccess, hapticError } from "../../lib/haptics";
import { BADGES, THEMES, STREAK_FREEZE_COST } from "@ticktick/shared";
import { signIn, signUp, signOut, getSession } from "../../lib/auth";
import { syncTasks, fetchTasks, syncStreak, fetchStreak } from "../../lib/sync";

export default function ProfileScreen() {
  const colors = useThemeColors();
  const state = useStreakStore();
  const { tasks, setTasks } = useTaskStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getSession().then(({ session }) => {
      setUser(session?.user ?? null);
      setSessionChecked(true);
    });
  }, []);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    const { user: authUser, error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password);
    setLoading(false);
    if (error) {
      hapticError();
      Alert.alert("Auth Error", error.message);
    } else {
      hapticSuccess();
      setUser(authUser);
      setEmail("");
      setPassword("");
      Alert.alert("Success", isLogin ? "Welcome back!" : "Account created!");
    }
  };

  const handleSignOut = async () => {
    hapticLight();
    const { error } = await signOut();
    if (!error) setUser(null);
  };

  const handleSync = async () => {
    hapticLight();
    setLoading(true);
    const [tasksRes, streakRes] = await Promise.all([
      syncTasks(tasks),
      syncStreak({
        streak: state.streak,
        longestStreak: state.longestStreak,
        lastActiveDate: state.lastActiveDate,
        xp: state.xp,
        level: state.level,
        coins: state.coins,
        perfectDays: state.perfectDays,
        badges: state.badges,
        unlockedThemes: state.unlockedThemes,
        activeTheme: state.activeTheme,
        streakFreeze: state.streakFreeze,
        totalTasksCompleted: state.totalTasksCompleted,
      }),
    ]);
    setLoading(false);
    if (tasksRes.error || streakRes.error) {
      hapticError();
      Alert.alert("Sync failed", (tasksRes.error ?? streakRes.error)?.message ?? "Unknown error");
    } else {
      hapticSuccess();
      Alert.alert("Synced", "Your progress has been backed up.");
    }
  };

  const handleRestore = async () => {
    hapticLight();
    setLoading(true);
    const [tasksRes, streakRes] = await Promise.all([fetchTasks(), fetchStreak()]);
    setLoading(false);
    if (tasksRes.error || streakRes.error) {
      hapticError();
      Alert.alert("Restore failed", (tasksRes.error ?? streakRes.error)?.message ?? "Unknown error");
      return;
    }
    if (tasksRes.tasks.length > 0) setTasks(tasksRes.tasks);
    if (streakRes.streak) {
      useStreakStore.setState(streakRes.streak);
    }
    hapticSuccess();
    Alert.alert("Restored", "Your data has been restored from the cloud.");
  };

  const handleBuyTheme = (id: string) => {
    hapticLight();
    if (state.unlockedThemes.includes(id)) {
      state.setActiveTheme(id);
      hapticSuccess();
      return;
    }
    const success = state.buyTheme(id);
    if (success) {
      hapticSuccess();
    } else {
      hapticError();
      Alert.alert("Not enough coins", "Complete challenges to earn more coins.");
    }
  };

  const handleBuyFreeze = () => {
    hapticLight();
    const success = state.buyStreakFreeze();
    if (success) {
      hapticSuccess();
    } else {
      hapticError();
      Alert.alert("Not enough coins", `A streak freeze costs ${STREAK_FREEZE_COST} coins.`);
    }
  };

  if (!sessionChecked) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={colors.coral} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <Text style={{ fontSize: 28, fontWeight: "800", color: colors.cream, marginBottom: 20 }}>Profile</Text>

        {/* Auth */}
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
          {user ? (
            <>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 22,
                    backgroundColor: `${colors.emerald}15`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="cloud-done-outline" size={22} color={colors.emerald} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: colors.cream }}>Cloud Sync Active</Text>
                  <Text style={{ fontSize: 12, color: colors.muted }}>{user.email}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
                <TouchableOpacity
                  onPress={handleSync}
                  disabled={loading}
                  style={{ flex: 1, backgroundColor: colors.cream, paddingVertical: 14, borderRadius: 16, alignItems: "center" }}
                >
                  <Text style={{ fontWeight: "800", color: colors.bg }}>{loading ? "..." : "Backup"}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleRestore}
                  disabled={loading}
                  style={{ flex: 1, backgroundColor: colors.surfaceVariant, paddingVertical: 14, borderRadius: 16, alignItems: "center" }}
                >
                  <Text style={{ fontWeight: "800", color: colors.cream }}>{loading ? "..." : "Restore"}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={handleSignOut} style={{ alignItems: "center" }}>
                <Text style={{ color: colors.error, fontWeight: "700" }}>Sign Out</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 16, fontWeight: "700", color: colors.cream, marginBottom: 12 }}>Cloud Sync</Text>
              <TextInput
                style={{
                  backgroundColor: colors.surfaceVariant,
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 15,
                  color: colors.cream,
                  marginBottom: 12,
                }}
                placeholder="Email"
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={{
                  backgroundColor: colors.surfaceVariant,
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 15,
                  color: colors.cream,
                  marginBottom: 12,
                }}
                placeholder="Password"
                placeholderTextColor={colors.muted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={handleAuth}
                disabled={loading}
                style={{ backgroundColor: colors.cream, paddingVertical: 14, borderRadius: 16, alignItems: "center", marginBottom: 12 }}
              >
                <Text style={{ fontWeight: "800", color: colors.bg }}>{loading ? "..." : isLogin ? "Sign In" : "Create Account"}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                <Text style={{ color: colors.muted, textAlign: "center" }}>
                  {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Stats */}
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
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
            <Stat label="Level" value={state.level} colors={colors} />
            <Stat label="Coins" value={state.coins} colors={colors} />
            <Stat label="Streak" value={state.streak} colors={colors} />
            <Stat label="Longest" value={state.longestStreak} colors={colors} />
            <Stat label="Perfect Days" value={state.perfectDays} colors={colors} />
            <Stat label="Freeze" value={state.streakFreeze} colors={colors} />
          </View>
        </View>

        {/* Badges */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Ionicons name="trophy-outline" size={18} color={colors.amber} />
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.cream }}>Badges</Text>
            <Text style={{ marginLeft: "auto", fontSize: 12, color: colors.muted, fontWeight: "700" }}>
              {state.badges.length}/{BADGES.length}
            </Text>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {BADGES.map((badge) => {
              const unlocked = state.badges.includes(badge.id);
              return (
                <View
                  key={badge.id}
                  style={{
                    width: "31%",
                    backgroundColor: unlocked ? colors.surface : colors.surfaceVariant,
                    borderRadius: 20,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: unlocked ? `${colors.amber}30` : colors.border,
                    alignItems: "center",
                    opacity: unlocked ? 1 : 0.5,
                  }}
                >
                  <Text style={{ fontSize: 28, marginBottom: 8 }}>{badge.icon}</Text>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: unlocked ? colors.cream : colors.muted, textAlign: "center" }}>
                    {badge.title}
                  </Text>
                  <Text style={{ fontSize: 10, color: colors.muted, textAlign: "center", marginTop: 4 }}>{badge.description}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Themes */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Ionicons name="color-palette-outline" size={18} color={colors.violet} />
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.cream }}>Themes</Text>
          </View>
          <View style={{ gap: 10 }}>
            {THEMES.map((theme) => {
              const unlocked = state.unlockedThemes.includes(theme.id);
              const active = state.activeTheme === theme.id;
              return (
                <TouchableOpacity
                  key={theme.id}
                  onPress={() => handleBuyTheme(theme.id)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    padding: 14,
                    borderRadius: 20,
                    backgroundColor: colors.surface,
                    borderWidth: 2,
                    borderColor: active ? theme.primary : colors.border,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 14,
                      backgroundColor: theme.bg,
                      borderWidth: 2,
                      borderColor: theme.primary,
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: "700", color: colors.cream }}>{theme.name}</Text>
                    <Text style={{ fontSize: 12, color: colors.muted }}>{active ? "Active" : unlocked ? "Owned" : `${theme.cost} coins`}</Text>
                  </View>
                  {active && <Ionicons name="checkmark-circle" size={22} color={colors.emerald} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Streak Freeze */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 20,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                backgroundColor: `${colors.sky}15`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="snow-outline" size={24} color={colors.sky} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "700", color: colors.cream }}>Streak Freeze</Text>
              <Text style={{ fontSize: 12, color: colors.muted }}>Protect your streak on missed days</Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: "800", color: colors.cream }}>x{state.streakFreeze}</Text>
          </View>
          <TouchableOpacity
            onPress={handleBuyFreeze}
            style={{ backgroundColor: colors.cream, paddingVertical: 14, borderRadius: 16, alignItems: "center" }}
          >
            <Text style={{ fontSize: 15, fontWeight: "800", color: colors.bg }}>Buy for {STREAK_FREEZE_COST} coins</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ label, value, colors }: { label: string; value: number; colors: any }) {
  return (
    <View style={{ width: "31%", alignItems: "center", marginBottom: 8 }}>
      <Text style={{ fontSize: 20, fontWeight: "800", color: colors.cream }}>{value}</Text>
      <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>{label}</Text>
    </View>
  );
}

import { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Vibration, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useThemeColors } from "../theme/useThemeColors";
import { useStreakStore } from "../store/streakStore";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;
const LONG_BREAK_DURATION = 15 * 60;
const SESSIONS_BEFORE_LONG = 4;
const RADIUS = 72;
const STROKE = 8;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function FocusTimer() {
  const colors = useThemeColors();
  const streak = useStreakStore();

  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"focus" | "break">("focus");
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [sessionsToday, setSessionsToday] = useState(0);
  const totalRef = useRef(phase === "focus" ? WORK_DURATION : getBreakDuration(sessionsToday));
  const progress = useSharedValue(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function getBreakDuration(sessions: number) {
    return sessions > 0 && sessions % SESSIONS_BEFORE_LONG === 0 ? LONG_BREAK_DURATION : BREAK_DURATION;
  }

  useEffect(() => {
    if (running && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            handlePhaseEnd();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [running, timeLeft, phase]);

  useEffect(() => {
    const total = phase === "focus" ? WORK_DURATION : getBreakDuration(sessionsToday);
    totalRef.current = total;
    progress.value = withTiming(timeLeft / total, { duration: 1000, easing: Easing.linear });
  }, [timeLeft, phase]);

  function handlePhaseEnd() {
    Vibration.vibrate(500);
    if (phase === "focus") {
      const newSessions = sessionsToday + 1;
      setSessionsToday(newSessions);
      useStreakStore.setState((s) => ({ xp: s.xp + 10, coins: s.coins + 3 }));
      setPhase("break");
      const breakDur = getBreakDuration(newSessions);
      setTimeLeft(breakDur);
    } else {
      setPhase("focus");
      setTimeLeft(WORK_DURATION);
    }
  }

  function toggleRunning() {
    setRunning((r) => !r);
  }

  function reset() {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    setPhase("focus");
    setTimeLeft(WORK_DURATION);
  }

  function skip() {
    if (timerRef.current) clearInterval(timerRef.current);
    setRunning(false);
    handlePhaseEnd();
  }

  const total = phase === "focus" ? WORK_DURATION : getBreakDuration(sessionsToday);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  const svgProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  const strokeColor = phase === "focus" ? colors.coral : colors.emerald;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        marginBottom: 20,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <Text style={{ fontSize: 14, fontWeight: "700", color: colors.muted, textTransform: "uppercase", letterSpacing: 0.5 }}>
          {phase === "focus" ? "Focus" : "Break"}
        </Text>
        <Text style={{ fontSize: 12, color: colors.muted }}>
          Session {sessionsToday + 1}
        </Text>
      </View>

      <View style={{ width: RADIUS * 2 + STROKE, height: RADIUS * 2 + STROKE, alignItems: "center", justifyContent: "center" }}>
        <Svg
          width={RADIUS * 2 + STROKE}
          height={RADIUS * 2 + STROKE}
          viewBox={`0 0 ${RADIUS * 2 + STROKE} ${RADIUS * 2 + STROKE}`}
          style={{ position: "absolute" }}
        >
          <Circle
            cx={RADIUS + STROKE / 2}
            cy={RADIUS + STROKE / 2}
            r={RADIUS}
            stroke={colors.surfaceVariant}
            strokeWidth={STROKE}
            fill="none"
          />
          <AnimatedCircle
            cx={RADIUS + STROKE / 2}
            cy={RADIUS + STROKE / 2}
            r={RADIUS}
            stroke={strokeColor}
            strokeWidth={STROKE}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animatedProps={svgProps}
            rotation={-90}
            origin={`${RADIUS + STROKE / 2}, ${RADIUS + STROKE / 2}`}
          />
        </Svg>
        <Text style={{ fontSize: 30, fontWeight: "800", color: colors.cream, fontVariant: ["tabular-nums"] }}>
          {display}
        </Text>
      </View>

      <Text style={{ fontSize: 12, color: colors.muted, marginTop: 12 }}>
        {phase === "focus"
          ? `Focus for 25 min · Earn +10 XP, +3 coins`
          : sessionsToday > 0 && sessionsToday % SESSIONS_BEFORE_LONG === 0
          ? "Long break — 15 minutes"
          : "Short break — 5 minutes"}
      </Text>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 20 }}>
        <TouchableOpacity
          onPress={reset}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 16,
            backgroundColor: colors.surfaceVariant,
          }}
        >
          <Text style={{ fontWeight: "700", color: colors.cream }}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleRunning}
          style={{
            paddingHorizontal: 32,
            paddingVertical: 12,
            borderRadius: 16,
            backgroundColor: strokeColor,
          }}
        >
          <Text style={{ fontWeight: "800", color: colors.bg, fontSize: 15 }}>
            {running ? "Pause" : "Start"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={skip}
          style={{
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 16,
            backgroundColor: colors.surfaceVariant,
          }}
        >
          <Text style={{ fontWeight: "700", color: colors.cream }}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

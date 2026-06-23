import { useEffect, useMemo } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

type Season = "winter" | "spring" | "summer" | "fall";

export function getSeason(month?: number): Season {
  const m = month ?? new Date().getMonth();
  if (m === 11 || m <= 1) return "winter";
  if (m >= 2 && m <= 4) return "spring";
  if (m >= 5 && m <= 7) return "summer";
  return "fall";
}

// ─── Water Waves (Summer) ────────────────────────────────────────

function WaterWaves() {
  const { width, height } = useWindowDimensions();
  const w = width;
  const h = height || 700;

  const phase1 = useSharedValue(0);
  const phase2 = useSharedValue(0);
  const phase3 = useSharedValue(0);

  useEffect(() => {
    phase1.value = withRepeat(withTiming(Math.PI * 2, { duration: 4000, easing: Easing.linear }), -1, false);
    phase2.value = withRepeat(withTiming(Math.PI * 2, { duration: 5000, easing: Easing.linear }), -1, false);
    phase3.value = withRepeat(withTiming(Math.PI * 2, { duration: 3500, easing: Easing.linear }), -1, false);
  }, [phase1, phase2, phase3]);

  const wave1Props = useAnimatedProps(() => {
    const p = phase1.value;
    let d = `M 0 ${h * 0.45}`;
    for (let x = 0; x <= w; x += 4) {
      d += ` L ${x} ${h * 0.45 + Math.sin(x * 0.008 + p) * 30}`;
    }
    d += ` L ${w} ${h} L 0 ${h} Z`;
    return { d };
  });

  const wave2Props = useAnimatedProps(() => {
    const p = phase2.value;
    let d = `M 0 ${h * 0.5}`;
    for (let x = 0; x <= w; x += 4) {
      d += ` L ${x} ${h * 0.5 + Math.sin(x * 0.012 + p) * 20}`;
    }
    d += ` L ${w} ${h} L 0 ${h} Z`;
    return { d };
  });

  const wave3Props = useAnimatedProps(() => {
    const p = phase3.value;
    let d = `M 0 ${h * 0.55}`;
    for (let x = 0; x <= w; x += 4) {
      d += ` L ${x} ${h * 0.55 + Math.sin(x * 0.015 + p) * 15}`;
    }
    d += ` L ${w} ${h} L 0 ${h} Z`;
    return { d };
  });

  return (
    <Svg width={w} height={h} style={StyleSheet.absoluteFill}>
      <Defs>
        <LinearGradient id="summer1" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#38bdf8" stopOpacity={0.5} />
          <Stop offset="1" stopColor="#1e3a5f" stopOpacity={0.2} />
        </LinearGradient>
        <LinearGradient id="summer2" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#0ea5e9" stopOpacity={0.4} />
          <Stop offset="1" stopColor="#1e3a5f" stopOpacity={0.1} />
        </LinearGradient>
        <LinearGradient id="summer3" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#6366f1" stopOpacity={0.3} />
          <Stop offset="1" stopColor="#1e3a5f" stopOpacity={0.05} />
        </LinearGradient>
      </Defs>
      <AnimatedPath animatedProps={wave1Props} fill="url(#summer1)" />
      <AnimatedPath animatedProps={wave2Props} fill="url(#summer2)" />
      <AnimatedPath animatedProps={wave3Props} fill="url(#summer3)" />
    </Svg>
  );
}

// ─── Particle System ─────────────────────────────────────────────

interface ParticleDef {
  id: number;
  startX: number;
  startY: number;
  size: number;
  opacity: number;
  duration: number;
  drift: number;
  delay: number;
}

function generateParticles(count: number, w: number, h: number, sizeRange: [number, number]): ParticleDef[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    startX: Math.random() * w,
    startY: -Math.random() * h * 1.2,
    size: sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]),
    opacity: 0.3 + Math.random() * 0.7,
    duration: 4000 + Math.random() * 8000,
    drift: 20 + Math.random() * 60,
    delay: Math.random() * 5000,
  }));
}

function Particle({
  startX,
  startY,
  size,
  opacity,
  duration,
  drift,
  delay,
  color,
  shape,
  w,
}: ParticleDef & { color: string; shape: "circle" | "petal" | "leaf"; w: number }) {
  const y = useSharedValue(startY);
  const x = useSharedValue(0);
  const rot = useSharedValue(0);

  useEffect(() => {
    const t = setTimeout(() => {
      y.value = withRepeat(withTiming(w * 1.3, { duration, easing: Easing.linear }), -1, false);
      x.value = withRepeat(
        withTiming(drift, { duration: duration * 0.5, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      );
      if (shape !== "circle") {
        rot.value = withRepeat(
          withTiming(360, { duration: 3000 + Math.random() * 4000, easing: Easing.linear }),
          -1,
          false
        );
      }
    }, delay);
    return () => clearTimeout(t);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: y.value },
      { translateX: x.value },
      { rotate: `${rot.value}deg` },
    ],
    opacity,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: startX - size / 2,
          top: startY,
          width: size,
          height: shape === "leaf" ? size * 1.6 : size,
          backgroundColor: color,
          borderRadius: shape === "circle" ? size / 2 : shape === "petal" ? size * 0.4 : 1,
        },
        animStyle,
      ]}
    />
  );
}

// ─── Snowfall ────────────────────────────────────────────────────

function Snowfall() {
  const { width, height } = useWindowDimensions();
  const w = width;
  const h = height || 700;
  const flakes = useMemo(() => generateParticles(50, w, h, [3, 9]), [w, h]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {flakes.map((p) => (
        <Particle key={p.id} {...p} color="#ffffff" shape="circle" w={w} />
      ))}
    </View>
  );
}

// ─── Cherry Blossoms ─────────────────────────────────────────────

function CherryBlossoms() {
  const { width, height } = useWindowDimensions();
  const w = width;
  const h = height || 700;
  const petals = useMemo(() => generateParticles(40, w, h, [6, 14]), [w, h]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {petals.map((p) => (
        <Particle key={p.id} {...p} color="#f9a8d4" shape="petal" w={w} />
      ))}
    </View>
  );
}

// ─── Falling Leaves ──────────────────────────────────────────────

function FallingLeaves() {
  const { width, height } = useWindowDimensions();
  const w = width;
  const h = height || 700;
  const leaves = useMemo(() => generateParticles(35, w, h, [10, 22]), [w, h]);

  const colors = ["#f59e0b", "#fbbf24", "#d97706", "#ea580c", "#fcd34d"];

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {leaves.map((p) => (
        <Particle key={p.id} {...p} color={colors[p.id % colors.length]} shape="leaf" w={w} />
      ))}
    </View>
  );
}

// ─── Seasonal Overlay ────────────────────────────────────────────

export function SeasonalEffects() {
  const month = new Date().getMonth();
  const season = getSeason(month);

  switch (season) {
    case "summer":
      return <WaterWaves />;
    case "winter":
      return <Snowfall />;
    case "spring":
      return <CherryBlossoms />;
    case "fall":
      return <FallingLeaves />;
    default:
      return null;
  }
}

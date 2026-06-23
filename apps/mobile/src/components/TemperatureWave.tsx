import { useEffect, useMemo } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import Svg, { Path, Defs, LinearGradient, Stop, Circle, Text as SvgText } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { useThemeColors } from "../theme/useThemeColors";

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface TempPoint {
  label: string;
  tempHigh: number;
  tempLow: number;
}

interface TemperatureWaveProps {
  data: TempPoint[];
}

function catmullRomToBezier(points: { x: number; y: number }[]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export function TemperatureWave({ data }: TemperatureWaveProps) {
  const colors = useThemeColors();
  const { width: screenW } = useWindowDimensions();
  const w = screenW - 40;
  const h = 180;
  const phase = useSharedValue(0);

  useEffect(() => {
    phase.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );
  }, [phase]);

  const { highPath, lowPath, areaPath, dots } = useMemo(() => {
    const pad = { top: 32, bottom: 28, left: 20, right: 20 };
    const cw = w - pad.left - pad.right;
    const ch = h - pad.top - pad.bottom;
    const temps = data.flatMap((d) => [d.tempHigh, d.tempLow]);
    const minTemp = Math.min(...temps) - 5;
    const maxTemp = Math.max(...temps) + 5;
    const range = maxTemp - minTemp || 1;

    const highPoints = data.map((d, i) => ({
      x: pad.left + (i * cw) / (data.length - 1 || 1),
      y: pad.top + ch - ((d.tempHigh - minTemp) / range) * ch,
      temp: d.tempHigh,
      label: d.label,
    }));
    const lowPoints = data.map((d, i) => ({
      x: pad.left + (i * cw) / (data.length - 1 || 1),
      y: pad.top + ch - ((d.tempLow - minTemp) / range) * ch,
      temp: d.tempLow,
      label: d.label,
    }));

    const highPathD = catmullRomToBezier(highPoints);
    const lowPathD = catmullRomToBezier(lowPoints);

    const areaD =
      highPathD +
      ` L ${lowPoints[lowPoints.length - 1].x} ${lowPoints[lowPoints.length - 1].y}` +
      catmullRomToBezier([...lowPoints].reverse()).replace("M", "L") +
      " Z";

    return { highPath: highPathD, lowPath: lowPathD, areaPath: areaD, dots: highPoints };
  }, [data, w]);

  const areaProps = useAnimatedProps(() => ({
    opacity: interpolate(Math.sin(phase.value), [-1, 1], [0.3, 0.55]),
  }));

  const highProps = useAnimatedProps(() => ({
    opacity: interpolate(Math.sin(phase.value + 0.5), [-1, 1], [0.7, 1]),
  }));

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 24,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: 16,
        overflow: "hidden",
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <Text style={{ fontSize: 14, fontWeight: "700", color: colors.cream }}>Temperature Wave</Text>
        <Text style={{ fontSize: 11, color: colors.muted }}>7-day range</Text>
      </View>

      <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        <Defs>
          <LinearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.coral} stopOpacity={0.6} />
            <Stop offset="1" stopColor={colors.sky} stopOpacity={0.1} />
          </LinearGradient>
          <LinearGradient id="lakeGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.sky} stopOpacity={0.5} />
            <Stop offset="1" stopColor={colors.sky} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {/* water fill under */}
        <AnimatedPath d={areaPath} fill="url(#tempGrad)" animatedProps={areaProps} />

        {/* High temp line */}
        <AnimatedPath
          d={highPath}
          stroke={colors.coral}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          animatedProps={highProps}
        />

        {/* Low temp line */}
        <Path d={lowPath} stroke={colors.sky} strokeWidth={1.5} fill="none" strokeDasharray="6 4" opacity={0.6} />

        {/* Dots on high line */}
        {dots.map((dot, i) => (
          <Circle key={i} cx={dot.x} cy={dot.y} r={4} fill={colors.coral} />
        ))}

        {/* Labels */}
        {dots.map((dot, i) => (
          <SvgText
            key={`lbl-${i}`}
            x={dot.x}
            y={h - 8}
            fontSize={10}
            fill={colors.muted}
            textAnchor="middle"
          >
            {dot.label}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}

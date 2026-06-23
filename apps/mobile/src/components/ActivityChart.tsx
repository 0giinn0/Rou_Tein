import { useRef, useMemo } from "react";
import { View, Text } from "react-native";
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";
import { useThemeColors } from "../theme/useThemeColors";
import { format, subDays } from "date-fns";

interface ActivityChartProps {
  data: { date: string; count: number }[];
}

export function ActivityChart({ data }: ActivityChartProps) {
  const colors = useThemeColors();

  // Fill in missing days for the last 7 days
  const last7Days = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");
      const existing = data.find((d) => d.date === date);
      days.push({ date, count: existing?.count ?? 0, label: format(subDays(new Date(), i), "EEE") });
    }
    return days;
  }, [data]);

  const maxCount = Math.max(...last7Days.map((d) => d.count), 1);

  const w = 300;
  const h = 160;
  const pad = { top: 20, right: 16, bottom: 28, left: 24 };
  const chartW = w - pad.left - pad.right;
  const chartH = h - pad.top - pad.bottom;
  const barWidth = Math.min(28, (chartW / last7Days.length) - 12);
  const gap = (chartW - barWidth * last7Days.length) / (last7Days.length + 1);

  return (
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
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <Text style={{ fontSize: 16, fontWeight: "700", color: colors.cream }}>Activity</Text>
        <Text style={{ fontSize: 12, color: colors.muted, fontWeight: "600" }}>
          Tasks completed
        </Text>
      </View>

      <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((pct) => {
          const y = pad.top + chartH - (chartH * pct) / 100;
          return (
            <Line
              key={pct}
              x1={pad.left}
              y1={y}
              x2={w - pad.right}
              y2={y}
              stroke={colors.border}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Bars */}
        {last7Days.map((day, i) => {
          const barH = maxCount > 0 ? (day.count / maxCount) * chartH : 0;
          const x = pad.left + gap + i * (barWidth + gap);
          const y = pad.top + chartH - barH;
          const isToday = day.date === format(new Date(), "yyyy-MM-dd");
          return (
            <View key={day.date}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barH, 2)}
                rx={6}
                fill={isToday ? colors.coral : colors.emerald}
                opacity={day.count > 0 ? 1 : 0.3}
              />
              <SvgText
                x={x + barWidth / 2}
                y={h - 6}
                fontSize={10}
                fill={colors.muted}
                textAnchor="middle"
                fontWeight="600"
              >
                {day.label}
              </SvgText>
            </View>
          );
        })}
      </Svg>
    </View>
  );
}

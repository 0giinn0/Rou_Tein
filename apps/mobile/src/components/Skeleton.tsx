import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { useThemeColors } from "../theme/useThemeColors";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export function Skeleton({ width = "100%", height = 20, borderRadius = 8, style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  const colors = useThemeColors();

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.surfaceVariant,
          opacity,
        },
        style,
      ]}
    />
  );
}

export function WeatherSkeleton() {
  const colors = useThemeColors();
  return (
    <View style={{ gap: 16, padding: 20 }}>
      <Skeleton height={28} width="40%" />
      <View style={{ gap: 12 }}>
        <Skeleton height={220} borderRadius={28} />
        <View style={{ flexDirection: "row", gap: 12 }}>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} height={130} width={90} borderRadius={20} />
          ))}
        </View>
      </View>
    </View>
  );
}

export function ProfileSkeleton() {
  const colors = useThemeColors();
  return (
    <View style={{ gap: 16, padding: 20 }}>
      <Skeleton height={28} width="30%" />
      <Skeleton height={180} borderRadius={24} />
      <Skeleton height={120} borderRadius={24} />
      <Skeleton height={200} borderRadius={24} />
    </View>
  );
}

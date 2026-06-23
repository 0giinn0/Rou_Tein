import { useEffect, useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStreakStore } from "../../store/streakStore";
import { useThemeColors } from "../../theme/useThemeColors";
import { WeatherSkeleton } from "../../components/Skeleton";
import { TemperatureWave } from "../../components/TemperatureWave";
import { SeasonalEffects } from "../../components/SeasonalEffects";
import type { WeatherData } from "@ticktick/shared";

const weatherIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  "Clear sky": "sunny-outline",
  "Partly cloudy": "partly-sunny-outline",
  "Foggy": "cloud-outline",
  "Drizzle": "rainy-outline",
  "Rain": "rainy-outline",
  "Snow": "snow-outline",
  "Snow showers": "snow-outline",
  "Rain showers": "rainy-outline",
  "Thunderstorm": "thunderstorm-outline",
};

const weatherDescs: Record<number, string> = {
  0: "Clear sky", 1: "Partly cloudy", 2: "Partly cloudy", 3: "Partly cloudy",
  45: "Foggy", 48: "Foggy", 51: "Drizzle", 61: "Rain", 71: "Snow", 95: "Thunderstorm",
};

export default function WeatherScreen() {
  const colors = useThemeColors();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const streakState = useStreakStore();

  useEffect(() => {
    streakState.initializeDay();
  }, [streakState]);

  const fetchWeather = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=40.7128&longitude=-74.006&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=auto"
      );
      const data = await res.json();
      const c = data.current;
      const forecast = (data.daily.time as string[]).map((date: string, i: number) => ({
        date,
        tempHigh: data.daily.temperature_2m_max[i],
        tempLow: data.daily.temperature_2m_min[i],
        description: weatherDescs[data.daily.weather_code[i]] || "Partly cloudy",
        icon: "02d",
        precipitation: data.daily.precipitation_sum[i],
      }));
      setWeather({
        temperature: c.temperature_2m,
        feelsLike: c.apparent_temperature,
        humidity: c.relative_humidity_2m,
        description: weatherDescs[c.weather_code] || "Unknown",
        icon: "01d",
        windSpeed: c.wind_speed_10m,
        location: "New York, NY",
        forecast,
      });
    } catch { /* ignore */ }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  useEffect(() => {
    if (weather) {
      streakState.completeChallenge("check-weather");
    }
  }, [weather, streakState]);

  const weatherChallenge = streakState.challenges.find((c) => c.id === "check-weather");

  if (loading) {
    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
        <WeatherSkeleton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <SeasonalEffects />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchWeather(true)}
            tintColor={colors.sky}
            colors={[colors.sky]}
          />
        }
      >
        {/* Header */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: "800", color: colors.cream }}>Weather</Text>
        </View>

        {weather && (
          <>
            {/* Main Card */}
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 28,
                padding: 24,
                borderWidth: 1,
                borderColor: colors.border,
                marginBottom: 16,
                alignItems: "center",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12 }}>
                <Ionicons name="location-outline" size={14} color={colors.sky} />
                <Text style={{ fontSize: 12, fontWeight: "700", color: colors.sky, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  {weather.location}
                </Text>
              </View>
              <Ionicons name={weatherIcons[weather.description] || "partly-sunny-outline"} size={64} color={colors.sky} />
              <Text style={{ fontSize: 64, fontWeight: "800", color: colors.cream, marginTop: 8 }}>
                {Math.round(weather.temperature)}°
              </Text>
              <Text style={{ fontSize: 16, color: colors.muted, textTransform: "capitalize" }}>{weather.description}</Text>

              <View style={{ flexDirection: "row", gap: 10, marginTop: 24, width: "100%" }}>
                {[
                  { icon: "thermometer-outline" as const, label: "Feels Like", value: `${Math.round(weather.feelsLike)}°` },
                  { icon: "water-outline" as const, label: "Humidity", value: `${weather.humidity}%` },
                  { icon: "wind-outline" as const, label: "Wind", value: `${weather.windSpeed} km/h` },
                ].map((item) => (
                  <View
                    key={item.label}
                    style={{
                      flex: 1,
                      backgroundColor: colors.surfaceVariant,
                      borderRadius: 16,
                      padding: 12,
                      alignItems: "center",
                    }}
                  >
                    <Ionicons name={item.icon as any} size={18} color={colors.sky} />
                    <Text style={{ fontSize: 13, fontWeight: "700", color: colors.cream, marginTop: 4 }}>{item.value}</Text>
                    <Text style={{ fontSize: 10, color: colors.muted }}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Weather Challenge */}
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
              <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 16,
                    backgroundColor: `${colors.amber}15`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="umbrella-outline" size={22} color={colors.amber} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: colors.cream, marginBottom: 4 }}>Weather Explorer</Text>
                  <Text style={{ fontSize: 12, color: colors.muted, marginBottom: 10 }}>
                    Check the weather and plan your outfit for today's conditions.
                  </Text>
                  <View style={{ flexDirection: "row", gap: 16 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <Ionicons name={"coins-outline" as any} size={12} color={colors.amber} />
                      <Text style={{ fontSize: 12, fontWeight: "700", color: colors.amber }}>+5</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                      <Ionicons name="star-outline" size={12} color={colors.violet} />
                      <Text style={{ fontSize: 12, fontWeight: "700", color: colors.violet }}>+15 XP</Text>
                    </View>
                  </View>
                </View>
                {weatherChallenge?.completed && (
                  <View
                    style={{
                      backgroundColor: `${colors.emerald}15`,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      borderRadius: 12,
                    }}
                  >
                    <Text style={{ fontSize: 11, fontWeight: "700", color: colors.emerald }}>Done</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Temperature Wave */}
            <TemperatureWave
              data={weather.forecast.map((d) => ({
                label: new Date(d.date).toLocaleDateString("en", { weekday: "short" }),
                tempHigh: d.tempHigh,
                tempLow: d.tempLow,
              }))}
            />

            {/* Forecast */}
            <Text style={{ fontSize: 18, fontWeight: "700", color: colors.cream, marginBottom: 12 }}>7-Day Forecast</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 8 }}>
              {weather.forecast.map((day, i) => (
                <View
                  key={day.date}
                  style={{
                    width: 90,
                    backgroundColor: colors.surface,
                    borderRadius: 20,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 11, color: colors.muted, fontWeight: "700", textTransform: "uppercase" }}>
                    {i === 0 ? "Today" : new Date(day.date).toLocaleDateString("en", { weekday: "short" })}
                  </Text>
                  <Ionicons
                    name={weatherIcons[day.description] || "partly-sunny-outline"}
                    size={24}
                    color={colors.sky}
                    style={{ marginVertical: 8 }}
                  />
                  <Text style={{ fontSize: 18, fontWeight: "800", color: colors.cream }}>{Math.round(day.tempHigh)}°</Text>
                  <Text style={{ fontSize: 11, color: colors.muted }}>{Math.round(day.tempLow)}°</Text>
                </View>
              ))}
            </ScrollView>

            {/* Fun Fact */}
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 24,
                padding: 18,
                borderWidth: 1,
                borderColor: colors.border,
                marginTop: 16,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Ionicons name="eye-outline" size={16} color={colors.violet} />
                <Text style={{ fontSize: 14, fontWeight: "700", color: colors.cream }}>Did you know?</Text>
              </View>
              <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 20 }}>
                {weather.description.includes("Rain")
                  ? "Raindrops fall at an average speed of 14 mph. The smell of rain is called 'petrichor'."
                  : weather.description.includes("Snow")
                  ? "Every snowflake has a unique structure, and snow can fall at speeds up to 9 mph."
                  : weather.description.includes("Thunder")
                  ? "A bolt of lightning is five times hotter than the surface of the sun!"
                  : weather.description.includes("Fog")
                  ? "Fog is basically a cloud at ground level, formed when air cools to its dew point."
                  : "Sunlight takes about 8 minutes and 20 seconds to reach Earth."}
              </Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

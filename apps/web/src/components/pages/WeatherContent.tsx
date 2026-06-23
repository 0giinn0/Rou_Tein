"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useWeatherStore } from "@/store/weatherStore";
import { useStreakStore } from "@/store/streakStore";
import { RetroProgressRing } from "@/components/RetroProgressRing";
import { Card, Button } from "@ticktick/ui";
import {
  MapPin,
  RefreshCw,
  Droplets,
  Wind,
  Thermometer,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Cloud,
  Umbrella,
  Eye,
  Star,
  Coins,
} from "lucide-react";

const weatherEmoji: Record<string, string> = {
  "Clear sky": "☀️",
  "Partly cloudy": "⛅",
  "Foggy": "🌫️",
  "Drizzle": "🌦️",
  "Rain": "🌧️",
  "Snow": "❄️",
  "Snow showers": "🌨️",
  "Rain showers": "🌦️",
  "Thunderstorm": "⛈️",
};

const weatherIcon: Record<string, React.ElementType> = {
  "Clear sky": Sun,
  "Partly cloudy": Cloud,
  "Foggy": CloudFog,
  "Drizzle": CloudRain,
  "Rain": CloudRain,
  "Snow": CloudSnow,
  "Snow showers": CloudSnow,
  "Rain showers": CloudRain,
  "Thunderstorm": CloudLightning,
};

const weatherChallenge = {
  title: "Weather Explorer",
  description: "Check the weather and plan your outfit for today's conditions.",
  xpReward: 15,
  coinReward: 5,
};

export function WeatherContent() {
  const { weather, loading, error, fetchWeather } = useWeatherStore();
  const streakState = useStreakStore();
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    streakState.initializeDay();
  }, [streakState]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setLocation(loc);
        fetchWeather(loc.lat, loc.lon);
      },
      () => fetchWeather(40.7128, -74.006)
    );
  }, [fetchWeather]);

  useEffect(() => {
    if (weather) {
      streakState.completeChallenge("check-weather");
    }
  }, [weather, streakState]);

  const getEmoji = (desc: string) => weatherEmoji[desc] || "🌤️";
  const WeatherIcon = weather ? weatherIcon[weather.description] || Cloud : Cloud;

  return (
    <div className="max-w-3xl mx-auto p-s4 space-y-s4 pb-28">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bauhaus text-cream">Weather</h1>
          <p className="text-sm text-muted mt-s1">Plan your day around the forecast</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => location && fetchWeather(location.lat, location.lon)}
          disabled={loading}
          className="rounded-full"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </header>

      {error && (
        <Card className="p-s4 rounded-3xl border-coral/20 bg-coral/5">
          <p className="text-coral text-sm font-sans">{error}</p>
        </Card>
      )}

      {loading && !weather && (
        <div className="glass rounded-3xl flex flex-col items-center justify-center py-s6 gap-s3">
          <RefreshCw className="w-8 h-8 text-cream animate-spin" />
          <p className="text-muted text-xs uppercase tracking-wider font-sans">
            Fetching weather...
          </p>
        </div>
      )}

      {weather && (
        <>
          {/* Main Weather Card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl glass glow-sky"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="relative p-s5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-s2 text-sky mb-s3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">{weather.location}</span>
                  </div>
                  <p className="font-bauhaus text-[72px] leading-none text-cream">
                    {Math.round(weather.temperature)}°
                  </p>
                  <p className="text-lg text-cream/80 mt-s2 capitalize">
                    {weather.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="w-20 h-20 rounded-3xl bg-sky/10 flex items-center justify-center mb-s2">
                    <WeatherIcon className="w-10 h-10 text-sky" />
                  </div>
                  <p className="text-3xl">{getEmoji(weather.description)}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-s3 mt-s5">
                <div className="bg-surface/50 rounded-2xl p-s3 text-center">
                  <Thermometer className="w-5 h-5 text-coral mx-auto mb-s1" />
                  <p className="text-sm font-bold text-cream">{Math.round(weather.feelsLike)}°</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Feels Like</p>
                </div>
                <div className="bg-surface/50 rounded-2xl p-s3 text-center">
                  <Droplets className="w-5 h-5 text-sky mx-auto mb-s1" />
                  <p className="text-sm font-bold text-cream">{weather.humidity}%</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Humidity</p>
                </div>
                <div className="bg-surface/50 rounded-2xl p-s3 text-center">
                  <Wind className="w-5 h-5 text-emerald mx-auto mb-s1" />
                  <p className="text-sm font-bold text-cream">{weather.windSpeed}</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider">km/h</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Weather Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-3xl p-s4"
          >
            <div className="flex items-start gap-s3">
              <div className="w-12 h-12 rounded-2xl bg-amber/10 flex items-center justify-center flex-shrink-0">
                <Umbrella className="w-6 h-6 text-amber" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bauhaus text-cream mb-s1">{weatherChallenge.title}</h3>
                <p className="text-sm text-muted mb-s3">{weatherChallenge.description}</p>
                <div className="flex items-center gap-s4">
                  <div className="flex items-center gap-s1 text-xs text-amber">
                    <Coins className="w-3 h-3" />
                    <span className="font-bold">+{weatherChallenge.coinReward}</span>
                  </div>
                  <div className="flex items-center gap-s1 text-xs text-violet">
                    <Star className="w-3 h-3" />
                    <span className="font-bold">+{weatherChallenge.xpReward} XP</span>
                  </div>
                </div>
              </div>
              {streakState.challenges.find((c) => c.id === "check-weather")?.completed ? (
                <div className="px-3 py-1.5 rounded-full bg-emerald/10 text-emerald text-xs font-bold">
                  Completed
                </div>
              ) : null}
            </div>
          </motion.div>

          {/* Forecast */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-base font-bauhaus text-cream mb-s3">7-Day Forecast</h2>
            <div className="flex gap-s3 overflow-x-auto pb-s2">
              {weather.forecast.map((day, i) => {
                const DayIcon = weatherIcon[day.description] || Cloud;
                return (
                  <Card
                    key={day.date}
                    className="flex-shrink-0 w-[110px] p-s3 text-center rounded-3xl glass"
                  >
                    <p className="text-[10px] uppercase tracking-wider text-muted font-sans mb-s2">
                      {i === 0
                        ? "Today"
                        : new Date(day.date).toLocaleDateString("en", {
                            weekday: "short",
                          })}
                    </p>
                    <div className="w-10 h-10 rounded-2xl bg-sky/10 flex items-center justify-center mx-auto mb-s2">
                      <DayIcon className="w-5 h-5 text-sky" />
                    </div>
                    <p className="text-xl font-bauhaus text-cream">
                      {Math.round(day.tempHigh)}°
                    </p>
                    <p className="text-[10px] text-muted font-sans">
                      {Math.round(day.tempLow)}°
                    </p>
                    {day.precipitation > 0 && (
                      <p className="text-[10px] text-sky mt-s1">
                        {Math.round(day.precipitation)}mm
                      </p>
                    )}
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Weather Fun Fact */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-3xl p-s4"
          >
            <div className="flex items-center gap-s2 mb-s2">
              <Eye className="w-4 h-4 text-violet" />
              <h3 className="text-sm font-bauhaus text-cream">Did you know?</h3>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              {weather.description.includes("Rain")
                ? "Raindrops fall at an average speed of 14 mph. The smell of rain is called 'petrichor'."
                : weather.description.includes("Snow")
                ? "Every snowflake has a unique structure, and snow can fall at speeds up to 9 mph."
                : weather.description.includes("Thunder")
                ? "A bolt of lightning is five times hotter than the surface of the sun!"
                : weather.description.includes("Fog")
                ? "Fog is basically a cloud at ground level, formed when air cools to its dew point."
                : "Sunlight takes about 8 minutes and 20 seconds to reach Earth."}
            </p>
          </motion.div>
        </>
      )}
    </div>
  );
}

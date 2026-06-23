import { create } from "zustand";
import type { WeatherData } from "@ticktick/shared";

interface WeatherStore {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  fetchWeather: (lat: number, lon: number) => Promise<void>;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  weather: null,
  loading: false,
  error: null,

  fetchWeather: async (lat, lon) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=auto`
      );
      const data = await res.json();

      const weatherCodeToDesc = (code: number): { desc: string; icon: string } => {
        if (code === 0) return { desc: "Clear sky", icon: "01d" };
        if (code <= 3) return { desc: "Partly cloudy", icon: "02d" };
        if (code <= 48) return { desc: "Foggy", icon: "50d" };
        if (code <= 57) return { desc: "Drizzle", icon: "09d" };
        if (code <= 67) return { desc: "Rain", icon: "10d" };
        if (code <= 77) return { desc: "Snow", icon: "13d" };
        if (code <= 82) return { desc: "Rain showers", icon: "09d" };
        if (code <= 86) return { desc: "Snow showers", icon: "13d" };
        return { desc: "Thunderstorm", icon: "11d" };
      };

      const current = data.current;
      const wc = weatherCodeToDesc(current.weather_code);

      const forecast = (data.daily.time as string[]).map((date: string, i: number) => ({
        date,
        tempHigh: data.daily.temperature_2m_max[i],
        tempLow: data.daily.temperature_2m_min[i],
        description: weatherCodeToDesc(data.daily.weather_code[i]).desc,
        icon: weatherCodeToDesc(data.daily.weather_code[i]).icon,
        precipitation: data.daily.precipitation_sum[i],
      }));

      set({
        weather: {
          temperature: current.temperature_2m,
          feelsLike: current.apparent_temperature,
          humidity: current.relative_humidity_2m,
          description: wc.desc,
          icon: wc.icon,
          windSpeed: current.wind_speed_10m,
          location: `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
          forecast,
        },
        loading: false,
      });
    } catch {
      set({ error: "Failed to fetch weather", loading: false });
    }
  },
}));

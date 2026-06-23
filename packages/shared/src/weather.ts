export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  location: string;
  forecast: WeatherForecast[];
}

export interface WeatherForecast {
  date: string;
  tempHigh: number;
  tempLow: number;
  description: string;
  icon: string;
  precipitation: number;
}

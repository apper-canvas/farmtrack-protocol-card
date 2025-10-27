import weatherData from "@/services/mockData/weather.json";

class WeatherService {
  constructor() {
    this.cache = null;
    this.cacheTime = null;
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes
  }

  async getForecast() {
    await this.delay(500);
    
    // Check cache
    if (this.cache && this.cacheTime && (Date.now() - this.cacheTime < this.cacheExpiry)) {
      return [...this.cache];
    }

    // Simulate weather API call
    const forecast = weatherData.map(day => ({ ...day }));
    
    // Cache the result
    this.cache = forecast;
    this.cacheTime = Date.now();
    
    return forecast;
  }

  async getCurrentWeather() {
    await this.delay(300);
    const forecast = await this.getForecast();
    return forecast.length > 0 ? { ...forecast[0] } : null;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new WeatherService();
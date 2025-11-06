import { getApperClient } from '@/services/apperClient';

class WeatherService {
  constructor() {
    this.cache = null;
    this.cacheTime = null;
    this.cacheExpiry = 30 * 60 * 1000; // 30 minutes
  }

  async getForecast() {
    try {
      // Check cache
      if (this.cache && this.cacheTime && (Date.now() - this.cacheTime < this.cacheExpiry)) {
        return [...this.cache];
      }

      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        return [];
      }

      const response = await apperClient.fetchRecords('weather_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "condition_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "humidity_c"}},
          {"field": {"Name": "precipitation_c"}},
          {"field": {"Name": "temperature_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error('Weather fetch error:', response.message);
        return [];
      }

      // Transform data to match UI expectations
      const forecast = response.data.map(item => ({
        Id: item.Id,
        date: item.date_c,
        condition: item.condition_c || 'sunny',
        humidity: item.humidity_c || 0,
        precipitation: item.precipitation_c || 0,
        // Parse temperature field if it contains JSON-like structure
        temperature: this.parseTemperature(item.temperature_c)
      }));

      // Cache the result
      this.cache = forecast;
      this.cacheTime = Date.now();
      
      return forecast;
    } catch (error) {
      console.error('Error fetching weather forecast:', error);
      return [];
    }
  }

  async getCurrentWeather() {
    try {
      const forecast = await this.getForecast();
      return forecast.length > 0 ? { ...forecast[0] } : null;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      return null;
    }
  }

  parseTemperature(temperatureField) {
    try {
      // Try to parse as JSON if it contains temperature range
      if (typeof temperatureField === 'string' && temperatureField.includes('{')) {
        return JSON.parse(temperatureField);
      }
      // Default structure if not parseable
      return { high: 75, low: 60 };
    } catch {
      return { high: 75, low: 60 };
    }
  }
}

export default new WeatherService();

export default new WeatherService();
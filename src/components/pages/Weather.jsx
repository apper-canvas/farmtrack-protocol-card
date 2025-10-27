import { useState, useEffect } from "react";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import WeatherCard from "@/components/molecules/WeatherCard";
import ApperIcon from "@/components/ApperIcon";
import weatherService from "@/services/api/weatherService";

const Weather = () => {
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await weatherService.getForecast();
      setWeather(data);
    } catch (err) {
      setError("Failed to load weather forecast");
    } finally {
      setLoading(false);
    }
  };

  const getWeatherInsights = (forecastData) => {
    if (!forecastData.length) return [];

    const insights = [];
    const today = forecastData[0];
    
    // Rain insights
    const rainyDays = forecastData.filter(day => day.precipitation > 50).length;
    if (rainyDays >= 3) {
      insights.push({
        icon: "CloudRain",
        type: "warning",
        title: "Heavy Rain Expected",
        description: `${rainyDays} days of rain forecasted. Consider delaying outdoor planting activities.`,
      });
    } else if (rainyDays >= 1) {
      insights.push({
        icon: "Droplets",
        type: "info",
        title: "Rain Opportunity",
        description: `${rainyDays} rainy day(s) ahead. Good for recently planted crops.`,
      });
    }

    // Temperature insights
    const hotDays = forecastData.filter(day => day.temperature.high >= 85).length;
    if (hotDays >= 3) {
      insights.push({
        icon: "Thermometer",
        type: "warning", 
        title: "Hot Weather Alert",
        description: `${hotDays} days above 85°F. Increase watering frequency and check for heat stress.`,
      });
    }

    // Sunny days for harvest
    const sunnyDays = forecastData.filter(day => day.condition === "sunny").length;
    if (sunnyDays >= 3) {
      insights.push({
        icon: "Sun",
        type: "success",
        title: "Ideal Harvest Conditions",
        description: `${sunnyDays} sunny days ahead. Perfect for harvesting and drying crops.`,
      });
    }

    // Dry period warning
    const dryDays = forecastData.filter(day => day.precipitation < 10).length;
    if (dryDays >= 4) {
      insights.push({
        icon: "AlertTriangle",
        type: "warning",
        title: "Dry Period Ahead",
        description: `${dryDays} days with minimal rain. Plan irrigation accordingly.`,
      });
    }

    return insights;
  };

  const insights = getWeatherInsights(weather);

  if (loading) return <Loading className="min-h-[calc(100vh-4rem)]" />;
  if (error) return <Error message={error} onRetry={loadWeather} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Weather Forecast</h1>
        <p className="text-gray-600">5-day weather forecast to help plan your farm activities</p>
      </div>

      {/* Weather Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {weather.map((day, index) => (
          <WeatherCard 
            key={day.date} 
            weather={day} 
            isToday={index === 0}
          />
        ))}
      </div>

      {/* Weather Insights */}
      {insights.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <ApperIcon name="Lightbulb" className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">Weather Insights</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => {
              const colors = {
                info: "bg-blue-50 border-blue-200 text-blue-800",
                success: "bg-green-50 border-green-200 text-green-800", 
                warning: "bg-orange-50 border-orange-200 text-orange-800"
              };

              return (
                <div key={index} className={`p-4 rounded-lg border ${colors[insight.type]}`}>
                  <div className="flex items-start space-x-3">
                    <ApperIcon name={insight.icon} className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium mb-1">{insight.title}</h3>
                      <p className="text-sm opacity-90">{insight.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Weather Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Forecast</h2>
        
        <div className="space-y-4">
          {weather.map((day, index) => (
            <div key={day.date} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {index === 0 ? "Today" : new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <ApperIcon 
                    name={day.condition === "sunny" ? "Sun" : day.condition === "rainy" ? "CloudRain" : "Cloud"} 
                    className="w-6 h-6 text-primary-600" 
                  />
                  <span className="text-sm capitalize text-gray-600">
                    {day.condition.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-6 text-sm">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Temperature</div>
                  <div className="font-medium">
                    {day.temperature.high}° / {day.temperature.low}°
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Precipitation</div>
                  <div className="font-medium">{day.precipitation}%</div>
                </div>
                
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Humidity</div>
                  <div className="font-medium">{day.humidity}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;
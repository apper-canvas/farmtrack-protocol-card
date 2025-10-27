import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import { format } from "date-fns";

const WeatherCard = ({ weather, isToday = false }) => {
  const getWeatherIcon = (condition) => {
    const iconMap = {
      sunny: "Sun",
      cloudy: "Cloud",
      rainy: "CloudRain",
      stormy: "CloudLightning",
      snowy: "CloudSnow",
      partly_cloudy: "CloudSun"
    };
    return iconMap[condition] || "Sun";
  };

  const getWeatherColor = (condition) => {
    const colorMap = {
      sunny: "text-yellow-500",
      cloudy: "text-gray-500",
      rainy: "text-blue-500",
      stormy: "text-purple-500",
      snowy: "text-gray-300",
      partly_cloudy: "text-yellow-400"
    };
    return colorMap[condition] || "text-yellow-500";
  };

  return (
    <Card className={`text-center ${isToday ? "border-primary-500 bg-primary-50" : ""}`}>
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-600">
          {isToday ? "Today" : format(new Date(weather.date), "EEE")}
        </div>
        
        <div className="text-xs text-gray-500">
          {format(new Date(weather.date), "MMM d")}
        </div>

        <div className="flex justify-center">
          <ApperIcon 
            name={getWeatherIcon(weather.condition)} 
            className={`w-8 h-8 ${getWeatherColor(weather.condition)}`}
          />
        </div>

        <div className="space-y-1">
          <div className="text-lg font-bold text-gray-900">
            {weather.temperature.high}°
          </div>
          <div className="text-sm text-gray-500">
            {weather.temperature.low}°
          </div>
        </div>

        <div className="text-xs text-gray-500 capitalize">
          {weather.condition.replace("_", " ")}
        </div>

        {weather.precipitation > 0 && (
          <div className="flex items-center justify-center space-x-1 text-xs text-blue-600">
            <ApperIcon name="CloudRain" className="w-3 h-3" />
            <span>{weather.precipitation}%</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default WeatherCard;
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = "primary",
  trend,
  trendLabel,
  onClick,
  className 
}) => {
  const colors = {
    primary: "bg-gradient-to-br from-primary-500 to-primary-600 text-white",
    secondary: "bg-gradient-to-br from-secondary-500 to-secondary-600 text-white",
    success: "bg-gradient-to-br from-success to-green-600 text-white",
    warning: "bg-gradient-to-br from-warning to-orange-600 text-white",
    info: "bg-gradient-to-br from-info to-blue-600 text-white"
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transform hover:scale-105 transition-all duration-200",
        colors[color],
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm opacity-90 mb-1">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <div className="flex items-center space-x-1 mt-2">
              <ApperIcon 
                name={trend > 0 ? "TrendingUp" : "TrendingDown"} 
                className="w-4 h-4" 
              />
              <span className="text-sm opacity-90">{trendLabel}</span>
            </div>
          )}
        </div>
        <div className="bg-white/20 p-3 rounded-lg">
          <ApperIcon name={icon} className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
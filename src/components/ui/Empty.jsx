import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  className,
  title = "No data found",
  description = "Get started by adding your first item",
  actionLabel = "Add Item",
  onAction,
  icon = "Inbox"
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-12 text-center space-y-6",
      className
    )}>
      <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center">
        <ApperIcon name={icon} className="w-10 h-10 text-primary-400" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-500 max-w-md">{description}</p>
      </div>
      
      {onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
        >
          <ApperIcon name="Plus" className="w-4 h-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};

export default Empty;
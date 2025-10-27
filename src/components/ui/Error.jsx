import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Error = ({ 
  className, 
  message = "Something went wrong", 
  onRetry, 
  showRetry = true 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center space-y-4",
      className
    )}>
      <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">Oops!</h3>
        <p className="text-gray-600 max-w-md">{message}</p>
      </div>
      
      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 flex items-center space-x-2"
        >
          <ApperIcon name="RotateCcw" className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default Error;
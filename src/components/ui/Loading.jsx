import { cn } from "@/utils/cn";

const Loading = ({ className, variant = "default" }) => {
  if (variant === "skeleton") {
    return (
      <div className={cn("animate-pulse space-y-4", className)}>
        <div className="bg-gray-200 rounded-xl h-32 w-full"></div>
        <div className="bg-gray-200 rounded-lg h-6 w-3/4"></div>
        <div className="bg-gray-200 rounded-lg h-4 w-1/2"></div>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse", className)}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="bg-gray-200 rounded-lg h-6 w-3/4 mb-4"></div>
            <div className="bg-gray-200 rounded h-4 w-1/2 mb-2"></div>
            <div className="bg-gray-200 rounded h-4 w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-primary-700 font-medium">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
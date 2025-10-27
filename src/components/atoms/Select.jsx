import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  className, 
  label,
  error,
  children,
  ...props 
}, ref) => {
  const id = props.id || props.name;

  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      
      <select
        id={id}
        className={cn(
          "w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white",
          "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "transition-colors duration-200",
          error && "border-error focus:ring-error",
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;
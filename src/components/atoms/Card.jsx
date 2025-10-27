import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ 
  className, 
  children,
  hover = false,
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-100 p-6",
        hover && "hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;
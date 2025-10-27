import { NavLink } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const NavItem = ({ to, icon, label, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => cn(
        "flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200",
        isActive 
          ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-sm" 
          : "text-gray-700 hover:bg-primary-50 hover:text-primary-700",
        className
      )}
    >
      <ApperIcon name={icon} className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

export default NavItem;
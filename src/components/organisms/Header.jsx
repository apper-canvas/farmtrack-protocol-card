import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import NavItem from "@/components/molecules/NavItem";
import { cn } from "@/utils/cn";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", to: "", icon: "LayoutDashboard" },
    { name: "Farms", to: "farms", icon: "MapPin" },
    { name: "Crops", to: "crops", icon: "Sprout" },
    { name: "Tasks", to: "tasks", icon: "CheckSquare" },
    { name: "Weather", to: "weather", icon: "Cloud" },
    { name: "Expenses", to: "expenses", icon: "DollarSign" }
  ];

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Sprout" className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  FarmTrack
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => (
                <NavItem
                  key={item.name}
                  to={item.to}
                  icon={item.icon}
                  label={item.name}
                  className="px-4 py-2"
                />
              ))}
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ApperIcon 
                  name={isMobileMenuOpen ? "X" : "Menu"} 
                  className="w-6 h-6" 
                />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded-md flex items-center justify-center">
                    <ApperIcon name="Sprout" className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-primary-700">FarmTrack</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:text-gray-700"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2">
                {navigation.map((item) => (
                  <NavItem
                    key={item.name}
                    to={item.to}
                    icon={item.icon}
                    label={item.name}
                    className="w-full justify-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                ))}
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
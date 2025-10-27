import { Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <ApperIcon name="Sprout" className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for. The page may have been moved or doesn't exist.
          </p>
        </div>

        <div className="space-y-4">
          <Link to="/">
            <Button className="w-full">
              <ApperIcon name="Home" className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
          <div className="flex justify-center space-x-4">
            <Link to="/farms">
              <Button variant="outline" size="sm">
                <ApperIcon name="MapPin" className="w-4 h-4 mr-2" />
                Farms
              </Button>
            </Link>
            
            <Link to="/crops">
              <Button variant="outline" size="sm">
                <ApperIcon name="Sprout" className="w-4 h-4 mr-2" />
                Crops
              </Button>
            </Link>
            
            <Link to="/tasks">
              <Button variant="outline" size="sm">
                <ApperIcon name="CheckSquare" className="w-4 h-4 mr-2" />
                Tasks
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? Check out our other farm management tools or return to the main dashboard.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
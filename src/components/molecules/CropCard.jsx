import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { format, differenceInDays } from "date-fns";

const CropCard = ({ crop, farm, onEdit, onDelete, onViewDetails }) => {
  const statusColors = {
    planted: "info",
    growing: "success",
    ready: "warning",
    harvested: "primary"
  };

  const daysSincePlanting = differenceInDays(new Date(), new Date(crop.plantingDate));
  const daysUntilHarvest = differenceInDays(new Date(crop.expectedHarvest), new Date());

  return (
    <Card hover className="relative">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Sprout" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{crop.cropType}</h3>
            <p className="text-sm text-gray-500">{farm?.name || "Unknown Farm"}</p>
          </div>
        </div>
        
        <Badge variant={statusColors[crop.status]}>
          {crop.status}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Field Location:</span>
          <span className="font-medium">{crop.fieldLocation}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Planted:</span>
          <span className="font-medium">
            {format(new Date(crop.plantingDate), "MMM d, yyyy")}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Days Growing:</span>
          <span className="font-medium">{daysSincePlanting} days</span>
        </div>

        {crop.status !== "harvested" && (
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Harvest in:</span>
            <span className={`font-medium ${daysUntilHarvest < 0 ? "text-warning" : ""}`}>
              {daysUntilHarvest < 0 
                ? `${Math.abs(daysUntilHarvest)} days overdue` 
                : `${daysUntilHarvest} days`
              }
            </span>
          </div>
        )}

        {crop.notes && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-sm text-gray-600">{crop.notes}</p>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <Button variant="ghost" size="sm" onClick={() => onViewDetails(crop)}>
          <ApperIcon name="Eye" className="w-4 h-4 mr-2" />
          View Details
        </Button>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(crop)}>
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(crop.Id)}>
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CropCard;
import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const TaskItem = ({ task, onComplete, onEdit, onDelete }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await onComplete(task.Id);
    } finally {
      setIsCompleting(false);
    }
  };

  const priorityColors = {
    high: "error",
    medium: "warning", 
    low: "success"
  };

  const isOverdue = new Date(task.dueDate) < new Date() && !task.completed;

  return (
    <div className={cn(
      "bg-white rounded-xl p-4 shadow-sm border-l-4 transition-all duration-200",
      task.completed ? "border-l-success bg-gray-50 opacity-75" : "border-l-primary-500",
      isOverdue && !task.completed && "border-l-error bg-red-50"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={handleComplete}
            disabled={task.completed || isCompleting}
            className={cn(
              "mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
              task.completed 
                ? "bg-success border-success text-white" 
                : "border-gray-300 hover:border-primary-500"
            )}
          >
            {(task.completed || isCompleting) && (
              <ApperIcon name="Check" className="w-3 h-3" />
            )}
          </button>

          <div className="flex-1 min-w-0">
            <h4 className={cn(
              "font-medium text-gray-900 mb-1",
              task.completed && "line-through text-gray-500"
            )}>
              {task.title}
            </h4>
            
            {task.description && (
              <p className={cn(
                "text-sm text-gray-600 mb-2",
                task.completed && "text-gray-400"
              )}>
                {task.description}
              </p>
            )}

            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Calendar" className="w-4 h-4" />
                <span className={cn(
                  isOverdue && !task.completed && "text-error font-medium"
                )}>
                  {format(new Date(task.dueDate), "MMM d, yyyy")}
                </span>
              </div>
              
              <Badge variant={priorityColors[task.priority]}>
                {task.priority} priority
              </Badge>
            </div>
          </div>
        </div>

        {!task.completed && (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(task)}
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.Id)}
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
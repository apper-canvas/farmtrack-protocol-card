import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import taskService from "@/services/api/taskService";
import farmService from "@/services/api/farmService";
import { format } from "date-fns";

const TaskForm = ({ task = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    farmId: "",
    title: "",
    description: "",
    dueDate: "",
    priority: "medium"
  });
  const [farms, setFarms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadFarms();
    
    if (task) {
      setFormData({
        farmId: task.farmId || "",
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
        priority: task.priority || "medium"
      });
    }
  }, [task]);

  const loadFarms = async () => {
    try {
      const farmsData = await farmService.getAll();
      setFarms(farmsData);
    } catch (error) {
      toast.error("Failed to load farms");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.farmId) {
      newErrors.farmId = "Please select a farm";
    }
    
    if (!formData.title.trim()) {
      newErrors.title = "Task title is required";
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const taskData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
        completed: task?.completed || false
      };

      let result;
      if (task) {
        result = await taskService.update(task.Id, taskData);
        toast.success("Task updated successfully!");
      } else {
        result = await taskService.create(taskData);
        toast.success("Task created successfully!");
      }
      
      onSave(result);
    } catch (error) {
      toast.error(task ? "Failed to update task" : "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Select
          label="Farm"
          name="farmId"
          value={formData.farmId}
          onChange={(e) => handleChange("farmId", e.target.value)}
          error={errors.farmId}
        >
          <option value="">Select a farm</option>
          {farms.map((farm) => (
            <option key={farm.Id} value={farm.Id}>
              {farm.name} - {farm.location}
            </option>
          ))}
        </Select>

        <Input
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={errors.title}
          placeholder="e.g., Water tomatoes, Apply fertilizer"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="Add task details and instructions..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            error={errors.dueDate}
          />

          <Select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
              {task ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              {task ? "Update Task" : "Create Task"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
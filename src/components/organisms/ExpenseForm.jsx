import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import expenseService from "@/services/api/expenseService";
import farmService from "@/services/api/farmService";
import { format } from "date-fns";

const ExpenseForm = ({ expense = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    farmId: "",
    amount: "",
    category: "other",
    date: format(new Date(), "yyyy-MM-dd"),
    description: ""
  });
  const [farms, setFarms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadFarms();
    
    if (expense) {
      setFormData({
        farmId: expense.farmId || "",
        amount: expense.amount?.toString() || "",
        category: expense.category || "other",
        date: expense.date ? format(new Date(expense.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd"),
        description: expense.description || ""
      });
    }
  }, [expense]);

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
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString()
      };

      let result;
      if (expense) {
        result = await expenseService.update(expense.Id, expenseData);
        toast.success("Expense updated successfully!");
      } else {
        result = await expenseService.create(expenseData);
        toast.success("Expense added successfully!");
      }
      
      onSave(result);
    } catch (error) {
      toast.error(expense ? "Failed to update expense" : "Failed to add expense");
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Amount ($)"
            name="amount"
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            error={errors.amount}
            placeholder="0.00"
          />

          <Select
            label="Category"
            name="category"
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
          >
            <option value="seeds">Seeds</option>
            <option value="fertilizer">Fertilizer</option>
            <option value="equipment">Equipment</option>
            <option value="fuel">Fuel</option>
            <option value="labor">Labor</option>
            <option value="other">Other</option>
          </Select>
        </div>

        <Input
          label="Date"
          name="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          error={errors.date}
        />

        <Input
          label="Description"
          name="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          error={errors.description}
          placeholder="e.g., Purchased corn seeds, Hired seasonal workers"
        />
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
              {expense ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              {expense ? "Update Expense" : "Add Expense"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;
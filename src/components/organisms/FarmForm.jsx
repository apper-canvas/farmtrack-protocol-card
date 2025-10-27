import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import farmService from "@/services/api/farmService";

const FarmForm = ({ farm = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    size: "",
    unit: "acres"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (farm) {
      setFormData({
        name: farm.name || "",
        location: farm.location || "",
        size: farm.size?.toString() || "",
        unit: farm.unit || "acres"
      });
    }
  }, [farm]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Farm name is required";
    }
    
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }
    
    if (!formData.size || parseFloat(formData.size) <= 0) {
      newErrors.size = "Size must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const farmData = {
        ...formData,
        size: parseFloat(formData.size)
      };

      let result;
      if (farm) {
        result = await farmService.update(farm.Id, farmData);
        toast.success("Farm updated successfully!");
      } else {
        result = await farmService.create(farmData);
        toast.success("Farm created successfully!");
      }
      
      onSave(result);
    } catch (error) {
      toast.error(farm ? "Failed to update farm" : "Failed to create farm");
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
        <Input
          label="Farm Name"
          name="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          error={errors.name}
          placeholder="Enter farm name"
        />

        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          error={errors.location}
          placeholder="Enter farm location"
        />

        <div className="flex space-x-3">
          <div className="flex-1">
            <Input
              label="Size"
              name="size"
              type="number"
              step="0.1"
              min="0"
              value={formData.size}
              onChange={(e) => handleChange("size", e.target.value)}
              error={errors.size}
              placeholder="0.0"
            />
          </div>
          
          <div className="w-32">
            <Select
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={(e) => handleChange("unit", e.target.value)}
            >
              <option value="acres">Acres</option>
              <option value="hectares">Hectares</option>
              <option value="sq_feet">Sq Feet</option>
              <option value="sq_meters">Sq Meters</option>
            </Select>
          </div>
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
              {farm ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              {farm ? "Update Farm" : "Create Farm"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FarmForm;
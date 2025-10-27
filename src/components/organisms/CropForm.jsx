import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import cropService from "@/services/api/cropService";
import farmService from "@/services/api/farmService";
import { format } from "date-fns";

const CropForm = ({ crop = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    farmId: "",
    cropType: "",
    plantingDate: "",
    fieldLocation: "",
    status: "planted",
    expectedHarvest: "",
    notes: ""
  });
  const [farms, setFarms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadFarms();
    
    if (crop) {
      setFormData({
        farmId: crop.farmId || "",
        cropType: crop.cropType || "",
        plantingDate: crop.plantingDate ? format(new Date(crop.plantingDate), "yyyy-MM-dd") : "",
        fieldLocation: crop.fieldLocation || "",
        status: crop.status || "planted",
        expectedHarvest: crop.expectedHarvest ? format(new Date(crop.expectedHarvest), "yyyy-MM-dd") : "",
        notes: crop.notes || ""
      });
    }
  }, [crop]);

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
    
    if (!formData.cropType.trim()) {
      newErrors.cropType = "Crop type is required";
    }
    
    if (!formData.plantingDate) {
      newErrors.plantingDate = "Planting date is required";
    }
    
    if (!formData.fieldLocation.trim()) {
      newErrors.fieldLocation = "Field location is required";
    }
    
    if (!formData.expectedHarvest) {
      newErrors.expectedHarvest = "Expected harvest date is required";
    }

    if (formData.plantingDate && formData.expectedHarvest) {
      if (new Date(formData.expectedHarvest) <= new Date(formData.plantingDate)) {
        newErrors.expectedHarvest = "Harvest date must be after planting date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const cropData = {
        ...formData,
        plantingDate: new Date(formData.plantingDate).toISOString(),
        expectedHarvest: new Date(formData.expectedHarvest).toISOString()
      };

      let result;
      if (crop) {
        result = await cropService.update(crop.Id, cropData);
        toast.success("Crop updated successfully!");
      } else {
        result = await cropService.create(cropData);
        toast.success("Crop added successfully!");
      }
      
      onSave(result);
    } catch (error) {
      toast.error(crop ? "Failed to update crop" : "Failed to add crop");
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
          label="Crop Type"
          name="cropType"
          value={formData.cropType}
          onChange={(e) => handleChange("cropType", e.target.value)}
          error={errors.cropType}
          placeholder="e.g., Corn, Wheat, Tomatoes"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Planting Date"
            name="plantingDate"
            type="date"
            value={formData.plantingDate}
            onChange={(e) => handleChange("plantingDate", e.target.value)}
            error={errors.plantingDate}
          />

          <Input
            label="Expected Harvest Date"
            name="expectedHarvest"
            type="date"
            value={formData.expectedHarvest}
            onChange={(e) => handleChange("expectedHarvest", e.target.value)}
            error={errors.expectedHarvest}
          />
        </div>

        <Input
          label="Field Location"
          name="fieldLocation"
          value={formData.fieldLocation}
          onChange={(e) => handleChange("fieldLocation", e.target.value)}
          error={errors.fieldLocation}
          placeholder="e.g., North Field, Greenhouse 2"
        />

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="planted">Planted</option>
          <option value="growing">Growing</option>
          <option value="ready">Ready for Harvest</option>
          <option value="harvested">Harvested</option>
        </Select>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Add any additional notes about this crop..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors duration-200"
          />
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
              {crop ? "Updating..." : "Adding..."}
            </>
          ) : (
            <>
              <ApperIcon name="Save" className="w-4 h-4 mr-2" />
              {crop ? "Update Crop" : "Add Crop"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default CropForm;
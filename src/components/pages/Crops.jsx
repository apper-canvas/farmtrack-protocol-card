import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Modal from "@/components/organisms/Modal";
import CropForm from "@/components/organisms/CropForm";
import CropCard from "@/components/molecules/CropCard";
import ApperIcon from "@/components/ApperIcon";
import cropService from "@/services/api/cropService";
import farmService from "@/services/api/farmService";
import { toast } from "react-toastify";

const Crops = () => {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [selectedFarm, setSelectedFarm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [cropsData, farmsData] = await Promise.all([
        cropService.getAll(),
        farmService.getAll()
      ]);
      setCrops(cropsData);
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load crops");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (savedCrop) => {
    if (editingCrop) {
      setCrops(prev => prev.map(crop => 
        crop.Id === savedCrop.Id ? savedCrop : crop
      ));
    } else {
      setCrops(prev => [...prev, savedCrop]);
    }
    
    setIsModalOpen(false);
    setEditingCrop(null);
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setIsModalOpen(true);
  };

  const handleDelete = async (cropId) => {
    if (window.confirm("Are you sure you want to delete this crop? This action cannot be undone.")) {
      try {
        await cropService.delete(cropId);
        setCrops(prev => prev.filter(crop => crop.Id !== cropId));
        toast.success("Crop deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete crop");
      }
    }
  };

  const handleViewDetails = (crop) => {
    setEditingCrop(crop);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingCrop(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCrop(null);
  };

  // Filter crops
  const filteredCrops = crops.filter(crop => {
    if (selectedFarm && crop.farmId !== selectedFarm) return false;
    if (selectedStatus && crop.status !== selectedStatus) return false;
    return true;
  });

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm ? farm : null;
  };

  if (loading) return <Loading className="min-h-[calc(100vh-4rem)]" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Crops</h1>
          <p className="text-gray-600">Track your crop planting, growth, and harvest cycles</p>
        </div>
        
        <Button onClick={openAddModal}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Crop
        </Button>
      </div>

      {/* Filters */}
      {crops.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Filter by Farm"
              value={selectedFarm}
              onChange={(e) => setSelectedFarm(e.target.value)}
            >
              <option value="">All Farms</option>
              {farms.map((farm) => (
                <option key={farm.Id} value={farm.Id}>
                  {farm.name}
                </option>
              ))}
            </Select>

            <Select
              label="Filter by Status"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="planted">Planted</option>
              <option value="growing">Growing</option>
              <option value="ready">Ready for Harvest</option>
              <option value="harvested">Harvested</option>
            </Select>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFarm("");
                  setSelectedStatus("");
                }}
              >
                <ApperIcon name="X" className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {crops.length === 0 ? (
        <Empty
          title="No crops planted yet"
          description="Start tracking your crops by logging your first planting"
          actionLabel="Log Your First Crop"
          onAction={openAddModal}
          icon="Sprout"
        />
      ) : filteredCrops.length === 0 ? (
        <Empty
          title="No crops match your filters"
          description="Try adjusting your filter criteria to see more crops"
          actionLabel="Clear Filters"
          onAction={() => {
            setSelectedFarm("");
            setSelectedStatus("");
          }}
          icon="Filter"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCrops.map((crop) => (
            <CropCard
              key={crop.Id}
              crop={crop}
              farm={getFarmName(crop.farmId)}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCrop ? "Edit Crop" : "Add New Crop"}
      >
        <CropForm
          crop={editingCrop}
          onSave={handleSave}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Crops;
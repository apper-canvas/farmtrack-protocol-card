import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Modal from "@/components/organisms/Modal";
import FarmForm from "@/components/organisms/FarmForm";
import ApperIcon from "@/components/ApperIcon";
import farmService from "@/services/api/farmService";
import { toast } from "react-toastify";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await farmService.getAll();
      setFarms(data);
    } catch (err) {
      setError("Failed to load farms");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (savedFarm) => {
    if (editingFarm) {
      setFarms(prev => prev.map(farm => 
        farm.Id === savedFarm.Id ? savedFarm : farm
      ));
    } else {
      setFarms(prev => [...prev, savedFarm]);
    }
    
    setIsModalOpen(false);
    setEditingFarm(null);
  };

  const handleEdit = (farm) => {
    setEditingFarm(farm);
    setIsModalOpen(true);
  };

  const handleDelete = async (farmId) => {
    if (window.confirm("Are you sure you want to delete this farm? This action cannot be undone.")) {
      try {
        await farmService.delete(farmId);
        setFarms(prev => prev.filter(farm => farm.Id !== farmId));
        toast.success("Farm deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete farm");
      }
    }
  };

  const openAddModal = () => {
    setEditingFarm(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFarm(null);
  };

  if (loading) return <Loading className="min-h-[calc(100vh-4rem)]" />;
  if (error) return <Error message={error} onRetry={loadFarms} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Farms</h1>
          <p className="text-gray-600">Manage your farm locations and properties</p>
        </div>
        
        <Button onClick={openAddModal}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Farm
        </Button>
      </div>

      {farms.length === 0 ? (
        <Empty
          title="No farms yet"
          description="Start by adding your first farm to begin tracking your agricultural operations"
          actionLabel="Add Your First Farm"
          onAction={openAddModal}
          icon="MapPin"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <Card key={farm.Id} hover>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                    <ApperIcon name="MapPin" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{farm.name}</h3>
                    <p className="text-sm text-gray-500">{farm.location}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Size:</span>
                  <span className="font-medium text-gray-900">
                    {farm.size} {farm.unit}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(farm.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                  <span>Active</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(farm)}>
                    <ApperIcon name="Edit2" className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(farm.Id)}>
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingFarm ? "Edit Farm" : "Add New Farm"}
      >
        <FarmForm
          farm={editingFarm}
          onSave={handleSave}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Farms;
import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Modal from "@/components/organisms/Modal";
import TaskForm from "@/components/organisms/TaskForm";
import TaskItem from "@/components/molecules/TaskItem";
import ApperIcon from "@/components/ApperIcon";
import taskService from "@/services/api/taskService";
import farmService from "@/services/api/farmService";
import { toast } from "react-toastify";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedFarm, setSelectedFarm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [selectedPriority, setSelectedPriority] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [tasksData, farmsData] = await Promise.all([
        taskService.getAll(),
        farmService.getAll()
      ]);
      setTasks(tasksData);
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (savedTask) => {
    if (editingTask) {
      setTasks(prev => prev.map(task => 
        task.Id === savedTask.Id ? savedTask : task
      ));
    } else {
      setTasks(prev => [...prev, savedTask]);
    }
    
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.update(taskId, { 
        completed: true, 
        completedAt: new Date().toISOString() 
      });
      setTasks(prev => prev.map(task => 
        task.Id === taskId ? updatedTask : task
      ));
      toast.success("Task completed!");
    } catch (error) {
      toast.error("Failed to complete task");
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task? This action cannot be undone.")) {
      try {
        await taskService.delete(taskId);
        setTasks(prev => prev.filter(task => task.Id !== taskId));
        toast.success("Task deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const openAddModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (selectedFarm && task.farmId !== selectedFarm) return false;
    if (selectedStatus === "pending" && task.completed) return false;
    if (selectedStatus === "completed" && !task.completed) return false;
    if (selectedStatus === "overdue" && (task.completed || new Date(task.dueDate) >= new Date())) return false;
    if (selectedPriority && task.priority !== selectedPriority) return false;
    return true;
  });

  // Sort tasks: overdue first, then by due date
  const sortedTasks = filteredTasks.sort((a, b) => {
    if (!a.completed && !b.completed) {
      const aOverdue = new Date(a.dueDate) < new Date();
      const bOverdue = new Date(b.dueDate) < new Date();
      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    return a.completed - b.completed;
  });

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm?.name || "Unknown Farm";
  };

  const getTaskCounts = () => {
    const pending = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    const overdue = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length;
    return { pending, completed, overdue };
  };

  const counts = getTaskCounts();

  if (loading) return <Loading className="min-h-[calc(100vh-4rem)]" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-600">Manage your farm tasks and activities</p>
        </div>
        
        <Button onClick={openAddModal}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Task Summary */}
      {tasks.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pending Tasks</p>
                <p className="text-2xl font-bold text-primary-600">{counts.pending}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <ApperIcon name="Clock" className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Overdue</p>
                <p className="text-2xl font-bold text-warning">{counts.overdue}</p>
              </div>
              <div className="bg-warning/10 p-3 rounded-lg">
                <ApperIcon name="AlertTriangle" className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-success">{counts.completed}</p>
              </div>
              <div className="bg-success/10 p-3 rounded-lg">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {tasks.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              <option value="">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="completed">Completed</option>
            </Select>

            <Select
              label="Filter by Priority"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </Select>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFarm("");
                  setSelectedStatus("pending");
                  setSelectedPriority("");
                }}
              >
                <ApperIcon name="X" className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <Empty
          title="No tasks created yet"
          description="Start organizing your farm work by creating your first task"
          actionLabel="Create Your First Task"
          onAction={openAddModal}
          icon="CheckSquare"
        />
      ) : filteredTasks.length === 0 ? (
        <Empty
          title="No tasks match your filters"
          description="Try adjusting your filter criteria to see more tasks"
          actionLabel="Clear Filters"
          onAction={() => {
            setSelectedFarm("");
            setSelectedStatus("pending");
            setSelectedPriority("");
          }}
          icon="Filter"
        />
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <div key={task.Id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-1">
              <div className="flex items-start justify-between p-4">
                <div className="flex-1">
                  <TaskItem
                    task={task}
                    onComplete={handleComplete}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
                <div className="ml-4 text-right">
                  <Badge variant="primary" className="mb-2">
                    {getFarmName(task.farmId)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <TaskForm
          task={editingTask}
          onSave={handleSave}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Tasks;
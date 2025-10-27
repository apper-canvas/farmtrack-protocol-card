import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "@/components/molecules/StatCard";
import WeatherCard from "@/components/molecules/WeatherCard";
import TaskItem from "@/components/molecules/TaskItem";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import farmService from "@/services/api/farmService";
import cropService from "@/services/api/cropService";
import taskService from "@/services/api/taskService";
import expenseService from "@/services/api/expenseService";
import weatherService from "@/services/api/weatherService";
import { toast } from "react-toastify";
import { format, startOfMonth, endOfMonth } from "date-fns";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    farms: [],
    crops: [],
    tasks: [],
    expenses: [],
    weather: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setError("");

    try {
      const [farmsData, cropsData, tasksData, expensesData, weatherData] = await Promise.all([
        farmService.getAll(),
        cropService.getAll(),
        taskService.getAll(),
        expenseService.getAll(),
        weatherService.getForecast()
      ]);

      setData({
        farms: farmsData,
        crops: cropsData,
        tasks: tasksData,
        expenses: expensesData,
        weather: weatherData
      });
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      await taskService.update(taskId, { completed: true, completedAt: new Date().toISOString() });
      toast.success("Task completed!");
      loadDashboardData();
    } catch (error) {
      toast.error("Failed to complete task");
    }
  };

  if (loading) return <Loading className="min-h-[calc(100vh-4rem)]" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  // Calculate statistics
  const activeCrops = data.crops.filter(crop => crop.status !== "harvested").length;
  const pendingTasks = data.tasks.filter(task => !task.completed).length;
  const overdueTasks = data.tasks.filter(task => 
    !task.completed && new Date(task.dueDate) < new Date()
  ).length;

  // Calculate monthly expenses
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthlyExpenses = data.expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    })
    .reduce((total, expense) => total + expense.amount, 0);

  const recentTasks = data.tasks
    .filter(task => !task.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  const todayWeather = data.weather[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Farm Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening on your farms today.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Farms"
          value={data.farms.length}
          icon="MapPin"
          color="primary"
          onClick={() => navigate("farms")}
        />
        <StatCard
          title="Active Crops"
          value={activeCrops}
          icon="Sprout"
          color="success"
          onClick={() => navigate("crops")}
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon="CheckSquare"
          color={overdueTasks > 0 ? "warning" : "info"}
          trendLabel={overdueTasks > 0 ? `${overdueTasks} overdue` : "On track"}
          onClick={() => navigate("tasks")}
        />
        <StatCard
          title="Monthly Expenses"
          value={`$${monthlyExpenses.toLocaleString()}`}
          icon="DollarSign"
          color="secondary"
          onClick={() => navigate("expenses")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("tasks")}
              >
                <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>

            {recentTasks.length === 0 ? (
              <Empty
                title="No pending tasks"
                description="All caught up! Add a new task to keep track of farm activities."
                actionLabel="Add Task"
                onAction={() => navigate("tasks")}
                icon="CheckCircle"
              />
            ) : (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <TaskItem
                    key={task.Id}
                    task={task}
                    onComplete={handleTaskComplete}
                    onEdit={() => navigate("tasks")}
                    onDelete={() => navigate("tasks")}
                  />
                ))}
                
                {pendingTasks > 5 && (
                  <div className="text-center pt-4 border-t">
                    <Button variant="ghost" onClick={() => navigate("tasks")}>
                      View {pendingTasks - 5} more tasks
                      <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Weather & Quick Actions */}
        <div className="space-y-6">
          {/* Today's Weather */}
          {todayWeather && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Today's Weather</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("weather")}
                >
                  <ApperIcon name="ExternalLink" className="w-4 h-4" />
                </Button>
              </div>
              
              <WeatherCard weather={todayWeather} isToday />
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("farms")}
              >
                <ApperIcon name="MapPin" className="w-4 h-4 mr-3" />
                Add New Farm
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("crops")}
              >
                <ApperIcon name="Sprout" className="w-4 h-4 mr-3" />
                Log New Crop
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("tasks")}
              >
                <ApperIcon name="CheckSquare" className="w-4 h-4 mr-3" />
                Create Task
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("expenses")}
              >
                <ApperIcon name="DollarSign" className="w-4 h-4 mr-3" />
                Record Expense
              </Button>
            </div>
          </div>

          {/* Farm Summary */}
          {data.farms.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Farm Overview</h3>
              <div className="space-y-3">
                {data.farms.slice(0, 3).map((farm) => {
                  const farmCrops = data.crops.filter(crop => crop.farmId === farm.Id).length;
                  const farmTasks = data.tasks.filter(task => task.farmId === farm.Id && !task.completed).length;
                  
                  return (
                    <div key={farm.Id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{farm.name}</p>
                        <p className="text-sm text-gray-500">{farm.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{farmCrops} crops</p>
                        <p className="text-sm text-gray-600">{farmTasks} tasks</p>
                      </div>
                    </div>
                  );
                })}
                
                {data.farms.length > 3 && (
                  <Button variant="ghost" size="sm" onClick={() => navigate("farms")}>
                    View {data.farms.length - 3} more farms
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
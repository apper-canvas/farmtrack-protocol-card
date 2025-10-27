import { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Modal from "@/components/organisms/Modal";
import ExpenseForm from "@/components/organisms/ExpenseForm";
import ExpenseRow from "@/components/molecules/ExpenseRow";
import ApperIcon from "@/components/ApperIcon";
import expenseService from "@/services/api/expenseService";
import farmService from "@/services/api/farmService";
import { toast } from "react-toastify";
import { format, startOfMonth, endOfMonth } from "date-fns";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedFarm, setSelectedFarm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [expensesData, farmsData] = await Promise.all([
        expenseService.getAll(),
        farmService.getAll()
      ]);
      setExpenses(expensesData);
      setFarms(farmsData);
    } catch (err) {
      setError("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = (savedExpense) => {
    if (editingExpense) {
      setExpenses(prev => prev.map(expense => 
        expense.Id === savedExpense.Id ? savedExpense : expense
      ));
    } else {
      setExpenses(prev => [...prev, savedExpense]);
    }
    
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const handleDelete = async (expenseId) => {
    if (window.confirm("Are you sure you want to delete this expense? This action cannot be undone.")) {
      try {
        await expenseService.delete(expenseId);
        setExpenses(prev => prev.filter(expense => expense.Id !== expenseId));
        toast.success("Expense deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete expense");
      }
    }
  };

  const openAddModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
  };

  // Filter expenses
  const filteredExpenses = expenses.filter(expense => {
    if (selectedFarm && expense.farmId !== selectedFarm) return false;
    if (selectedCategory && expense.category !== selectedCategory) return false;
    
    if (selectedMonth) {
      const expenseDate = new Date(expense.date);
      const [year, month] = selectedMonth.split("-");
      const monthStart = startOfMonth(new Date(parseInt(year), parseInt(month) - 1));
      const monthEnd = endOfMonth(new Date(parseInt(year), parseInt(month) - 1));
      if (expenseDate < monthStart || expenseDate > monthEnd) return false;
    }
    
    return true;
  });

  // Sort expenses by date (newest first)
  const sortedExpenses = filteredExpenses.sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  const getFarmName = (farmId) => {
    const farm = farms.find(f => f.Id === farmId);
    return farm?.name || "Unknown Farm";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  // Calculate totals
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const categoryTotals = filteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  if (loading) return <Loading className="min-h-[calc(100vh-4rem)]" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expenses</h1>
          <p className="text-gray-600">Track and manage your farm-related expenses</p>
        </div>
        
        <Button onClick={openAddModal}>
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      {expenses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Total Filtered</p>
                <p className="text-2xl font-bold">{formatCurrency(totalExpenses)}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-lg">
                <ApperIcon name="DollarSign" className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Records</p>
                <p className="text-2xl font-bold text-gray-900">{filteredExpenses.length}</p>
              </div>
              <div className="bg-gray-100 p-3 rounded-lg">
                <ApperIcon name="Receipt" className="w-6 h-6 text-gray-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Per Entry</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalExpenses / (filteredExpenses.length || 1))}
                </p>
              </div>
              <div className="bg-secondary-100 p-3 rounded-lg">
                <ApperIcon name="TrendingUp" className="w-6 h-6 text-secondary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Top Category</p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {Object.keys(categoryTotals).length > 0 
                    ? Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0]
                    : "N/A"}
                </p>
              </div>
              <div className="bg-success/10 p-3 rounded-lg">
                <ApperIcon name="BarChart3" className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {expenses.length > 0 && (
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
              label="Filter by Category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="seeds">Seeds</option>
              <option value="fertilizer">Fertilizer</option>
              <option value="equipment">Equipment</option>
              <option value="fuel">Fuel</option>
              <option value="labor">Labor</option>
              <option value="other">Other</option>
            </Select>

            <Input
              label="Filter by Month"
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFarm("");
                  setSelectedCategory("");
                  setSelectedMonth(format(new Date(), "yyyy-MM"));
                }}
              >
                <ApperIcon name="X" className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
      )}

      {expenses.length === 0 ? (
        <Empty
          title="No expenses recorded yet"
          description="Start tracking your farm expenses by recording your first expense"
          actionLabel="Record Your First Expense"
          onAction={openAddModal}
          icon="Receipt"
        />
      ) : filteredExpenses.length === 0 ? (
        <Empty
          title="No expenses match your filters"
          description="Try adjusting your filter criteria to see more expenses"
          actionLabel="Clear Filters"
          onAction={() => {
            setSelectedFarm("");
            setSelectedCategory("");
            setSelectedMonth(format(new Date(), "yyyy-MM"));
          }}
          icon="Filter"
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedExpenses.map((expense) => (
                  <ExpenseRow
                    key={expense.Id}
                    expense={expense}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingExpense ? "Edit Expense" : "Record New Expense"}
      >
        <ExpenseForm
          expense={editingExpense}
          onSave={handleSave}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Expenses;
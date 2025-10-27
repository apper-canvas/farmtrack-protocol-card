import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const ExpenseRow = ({ expense, onEdit, onDelete }) => {
  const categoryColors = {
    seeds: "primary",
    fertilizer: "success",
    equipment: "warning",
    fuel: "info",
    labor: "secondary",
    other: "default"
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {format(new Date(expense.date), "MMM d, yyyy")}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <Badge variant={categoryColors[expense.category]}>
          {expense.category}
        </Badge>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{expense.description}</div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {formatCurrency(expense.amount)}
        </div>
      </td>
      
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <Button variant="ghost" size="sm" onClick={() => onEdit(expense)}>
            <ApperIcon name="Edit2" className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(expense.Id)}>
            <ApperIcon name="Trash2" className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default ExpenseRow;
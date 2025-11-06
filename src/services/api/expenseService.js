import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class ExpenseService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        return [];
      }

      const response = await apperClient.fetchRecords('expense_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}}
        ]
      });

      if (!response.success) {
        console.error('Expenses fetch error:', response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        farmId: item.farm_id_c?.Id || item.farm_id_c,
        amount: item.amount_c,
        category: item.category_c,
        date: item.date_c,
        description: item.description_c
      }));
    } catch (error) {
      console.error('Error fetching expenses:', error);
      return [];
    }
  }

  async getById(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        return null;
      }

      const response = await apperClient.getRecordById('expense_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}}
        ]
      });

      if (!response.success) {
        console.error('Expense fetch error:', response.message);
        return null;
      }

      const item = response.data;
      return {
        Id: item.Id,
        farmId: item.farm_id_c?.Id || item.farm_id_c,
        amount: item.amount_c,
        category: item.category_c,
        date: item.date_c,
        description: item.description_c
      };
    } catch (error) {
      console.error('Error fetching expense:', error);
      return null;
    }
  }

  async getByFarmId(farmId) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        return [];
      }

      const response = await apperClient.fetchRecords('expense_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "farm_id_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}}
        ],
        where: [{"FieldName": "farm_id_c", "Operator": "EqualTo", "Values": [parseInt(farmId)]}]
      });

      if (!response.success) {
        console.error('Expenses fetch error:', response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        farmId: item.farm_id_c?.Id || item.farm_id_c,
        amount: item.amount_c,
        category: item.category_c,
        date: item.date_c,
        description: item.description_c
      }));
    } catch (error) {
      console.error('Error fetching expenses by farm:', error);
      return [];
    }
  }

  async create(expenseData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        throw new Error('Service unavailable');
      }

      const payload = {
        records: [{
          Name: `${expenseData.category} - ${expenseData.amount}`,
          farm_id_c: parseInt(expenseData.farmId),
          amount_c: parseFloat(expenseData.amount),
          category_c: expenseData.category,
          date_c: expenseData.date,
          description_c: expenseData.description
        }]
      };

      const response = await apperClient.createRecord('expense_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} expenses:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            farmId: item.farm_id_c?.Id || item.farm_id_c,
            amount: item.amount_c,
            category: item.category_c,
            date: item.date_c,
            description: item.description_c
          };
        }
      }
      throw new Error('Create operation failed');
    } catch (error) {
      console.error('Error creating expense:', error);
      throw error;
    }
  }

  async update(id, expenseData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        throw new Error('Service unavailable');
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          Name: `${expenseData.category} - ${expenseData.amount}`,
          farm_id_c: parseInt(expenseData.farmId),
          amount_c: parseFloat(expenseData.amount),
          category_c: expenseData.category,
          date_c: expenseData.date,
          description_c: expenseData.description
        }]
      };

      const response = await apperClient.updateRecord('expense_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} expenses:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            farmId: item.farm_id_c?.Id || item.farm_id_c,
            amount: item.amount_c,
            category: item.category_c,
            date: item.date_c,
            description: item.description_c
          };
        }
      }
      throw new Error('Update operation failed');
    } catch (error) {
      console.error('Error updating expense:', error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        throw new Error('Service unavailable');
      }

      const response = await apperClient.deleteRecord('expense_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} expenses:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error('Error deleting expense:', error);
      throw error;
    }
  }
}

export default new ExpenseService();
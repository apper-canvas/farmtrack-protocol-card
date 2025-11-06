import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class TaskService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        return [];
      }

      const response = await apperClient.fetchRecords('task_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      });

      if (!response.success) {
        console.error('Tasks fetch error:', response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        title: item.title_c,
        description: item.description_c,
        dueDate: item.due_date_c,
        priority: item.priority_c,
        completed: item.completed_c || false,
        completedAt: item.completed_at_c,
        farmId: item.farm_id_c?.Id || item.farm_id_c
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
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

      const response = await apperClient.getRecordById('task_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      });

      if (!response.success) {
        console.error('Task fetch error:', response.message);
        return null;
      }

      const item = response.data;
      return {
        Id: item.Id,
        title: item.title_c,
        description: item.description_c,
        dueDate: item.due_date_c,
        priority: item.priority_c,
        completed: item.completed_c || false,
        completedAt: item.completed_at_c,
        farmId: item.farm_id_c?.Id || item.farm_id_c
      };
    } catch (error) {
      console.error('Error fetching task:', error);
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

      const response = await apperClient.fetchRecords('task_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "completed_at_c"}},
          {"field": {"Name": "farm_id_c"}}
        ],
        where: [{"FieldName": "farm_id_c", "Operator": "EqualTo", "Values": [parseInt(farmId)]}]
      });

      if (!response.success) {
        console.error('Tasks fetch error:', response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        title: item.title_c,
        description: item.description_c,
        dueDate: item.due_date_c,
        priority: item.priority_c,
        completed: item.completed_c || false,
        completedAt: item.completed_at_c,
        farmId: item.farm_id_c?.Id || item.farm_id_c
      }));
    } catch (error) {
      console.error('Error fetching tasks by farm:', error);
      return [];
    }
  }

  async create(taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        throw new Error('Service unavailable');
      }

      const payload = {
        records: [{
          Name: taskData.title || 'New Task',
          title_c: taskData.title,
          description_c: taskData.description,
          due_date_c: taskData.dueDate,
          priority_c: taskData.priority,
          completed_c: false,
          farm_id_c: parseInt(taskData.farmId)
        }]
      };

      const response = await apperClient.createRecord('task_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            title: item.title_c,
            description: item.description_c,
            dueDate: item.due_date_c,
            priority: item.priority_c,
            completed: item.completed_c || false,
            completedAt: item.completed_at_c,
            farmId: item.farm_id_c?.Id || item.farm_id_c
          };
        }
      }
      throw new Error('Create operation failed');
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async update(id, taskData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        throw new Error('Service unavailable');
      }

      const updateData = {
        Id: parseInt(id),
        Name: taskData.title || 'Updated Task',
        title_c: taskData.title,
        description_c: taskData.description,
        due_date_c: taskData.dueDate,
        priority_c: taskData.priority,
        farm_id_c: parseInt(taskData.farmId)
      };

      // Only include completion fields if they're provided
      if (taskData.hasOwnProperty('completed')) {
        updateData.completed_c = taskData.completed;
      }
      if (taskData.completedAt) {
        updateData.completed_at_c = taskData.completedAt;
      }

      const payload = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord('task_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            title: item.title_c,
            description: item.description_c,
            dueDate: item.due_date_c,
            priority: item.priority_c,
            completed: item.completed_c || false,
            completedAt: item.completed_at_c,
            farmId: item.farm_id_c?.Id || item.farm_id_c
          };
        }
      }
      throw new Error('Update operation failed');
    } catch (error) {
      console.error('Error updating task:', error);
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

      const response = await apperClient.deleteRecord('task_c', {
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
          console.error(`Failed to delete ${failed.length} tasks:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}

export default new TaskService();
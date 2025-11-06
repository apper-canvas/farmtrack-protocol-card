import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class FarmService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        return [];
      }

      const response = await apperClient.fetchRecords('farm_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "unit_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      });

      if (!response.success) {
        console.error('Farms fetch error:', response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        name: item.name_c,
        location: item.location_c,
        size: item.size_c,
        unit: item.unit_c,
        createdAt: item.created_at_c
      }));
    } catch (error) {
      console.error('Error fetching farms:', error);
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

      const response = await apperClient.getRecordById('farm_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "unit_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      });

      if (!response.success) {
        console.error('Farm fetch error:', response.message);
        return null;
      }

      const item = response.data;
      return {
        Id: item.Id,
        name: item.name_c,
        location: item.location_c,
        size: item.size_c,
        unit: item.unit_c,
        createdAt: item.created_at_c
      };
    } catch (error) {
      console.error('Error fetching farm:', error);
      return null;
    }
  }

  async create(farmData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        throw new Error('Service unavailable');
      }

      const payload = {
        records: [{
          Name: farmData.name || 'New Farm',
          name_c: farmData.name,
          location_c: farmData.location,
          size_c: parseFloat(farmData.size),
          unit_c: farmData.unit,
          created_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('farm_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} farms:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            name: item.name_c,
            location: item.location_c,
            size: item.size_c,
            unit: item.unit_c,
            createdAt: item.created_at_c
          };
        }
      }
      throw new Error('Create operation failed');
    } catch (error) {
      console.error('Error creating farm:', error);
      throw error;
    }
  }

  async update(id, farmData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        throw new Error('Service unavailable');
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          Name: farmData.name || 'Updated Farm',
          name_c: farmData.name,
          location_c: farmData.location,
          size_c: parseFloat(farmData.size),
          unit_c: farmData.unit
        }]
      };

      const response = await apperClient.updateRecord('farm_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} farms:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            name: item.name_c,
            location: item.location_c,
            size: item.size_c,
            unit: item.unit_c,
            createdAt: item.created_at_c
          };
        }
      }
      throw new Error('Update operation failed');
    } catch (error) {
      console.error('Error updating farm:', error);
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

      const response = await apperClient.deleteRecord('farm_c', {
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
          console.error(`Failed to delete ${failed.length} farms:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error('Error deleting farm:', error);
      throw error;
    }
  }
}

export default new FarmService();
export default new FarmService();
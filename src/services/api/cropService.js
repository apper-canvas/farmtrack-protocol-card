import { getApperClient } from '@/services/apperClient';
import { toast } from 'react-toastify';

class CropService {
  async getAll() {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        return [];
      }

      const response = await apperClient.fetchRecords('crop_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "crop_type_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "field_location_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      });

      if (!response.success) {
        console.error('Crops fetch error:', response.message);
        return [];
      }

      // Transform data to match UI expectations
      return response.data.map(item => ({
        Id: item.Id,
        cropType: item.crop_type_c,
        plantingDate: item.planting_date_c,
        fieldLocation: item.field_location_c,
        status: item.status_c,
        expectedHarvest: item.expected_harvest_c,
        notes: item.notes_c,
        farmId: item.farm_id_c?.Id || item.farm_id_c
      }));
    } catch (error) {
      console.error('Error fetching crops:', error);
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

      const response = await apperClient.getRecordById('crop_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "crop_type_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "field_location_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farm_id_c"}}
        ]
      });

      if (!response.success) {
        console.error('Crop fetch error:', response.message);
        return null;
      }

      const item = response.data;
      return {
        Id: item.Id,
        cropType: item.crop_type_c,
        plantingDate: item.planting_date_c,
        fieldLocation: item.field_location_c,
        status: item.status_c,
        expectedHarvest: item.expected_harvest_c,
        notes: item.notes_c,
        farmId: item.farm_id_c?.Id || item.farm_id_c
      };
    } catch (error) {
      console.error('Error fetching crop:', error);
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

      const response = await apperClient.fetchRecords('crop_c', {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "crop_type_c"}},
          {"field": {"Name": "planting_date_c"}},
          {"field": {"Name": "field_location_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "farm_id_c"}}
        ],
        where: [{"FieldName": "farm_id_c", "Operator": "EqualTo", "Values": [parseInt(farmId)]}]
      });

      if (!response.success) {
        console.error('Crops fetch error:', response.message);
        return [];
      }

      return response.data.map(item => ({
        Id: item.Id,
        cropType: item.crop_type_c,
        plantingDate: item.planting_date_c,
        fieldLocation: item.field_location_c,
        status: item.status_c,
        expectedHarvest: item.expected_harvest_c,
        notes: item.notes_c,
        farmId: item.farm_id_c?.Id || item.farm_id_c
      }));
    } catch (error) {
      console.error('Error fetching crops by farm:', error);
      return [];
    }
  }

  async create(cropData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        throw new Error('Service unavailable');
      }

      // Only include updateable fields
      const payload = {
        records: [{
          Name: cropData.cropType || 'New Crop',
          crop_type_c: cropData.cropType,
          planting_date_c: cropData.plantingDate,
          field_location_c: cropData.fieldLocation,
          status_c: cropData.status,
          expected_harvest_c: cropData.expectedHarvest,
          notes_c: cropData.notes,
          farm_id_c: parseInt(cropData.farmId)
        }]
      };

      const response = await apperClient.createRecord('crop_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} crops:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            cropType: item.crop_type_c,
            plantingDate: item.planting_date_c,
            fieldLocation: item.field_location_c,
            status: item.status_c,
            expectedHarvest: item.expected_harvest_c,
            notes: item.notes_c,
            farmId: item.farm_id_c?.Id || item.farm_id_c
          };
        }
      }
      throw new Error('Create operation failed');
    } catch (error) {
      console.error('Error creating crop:', error);
      throw error;
    }
  }

  async update(id, cropData) {
    try {
      const apperClient = getApperClient();
      if (!apperClient) {
        console.error('ApperClient not available');
        throw new Error('Service unavailable');
      }

      const payload = {
        records: [{
          Id: parseInt(id),
          Name: cropData.cropType || 'Updated Crop',
          crop_type_c: cropData.cropType,
          planting_date_c: cropData.plantingDate,
          field_location_c: cropData.fieldLocation,
          status_c: cropData.status,
          expected_harvest_c: cropData.expectedHarvest,
          notes_c: cropData.notes,
          farm_id_c: parseInt(cropData.farmId)
        }]
      };

      const response = await apperClient.updateRecord('crop_c', payload);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} crops:`, failed);
          failed.forEach(record => {
            record.errors?.forEach(error => toast.error(`${error.fieldLabel}: ${error}`));
            if (record.message) toast.error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const item = successful[0].data;
          return {
            Id: item.Id,
            cropType: item.crop_type_c,
            plantingDate: item.planting_date_c,
            fieldLocation: item.field_location_c,
            status: item.status_c,
            expectedHarvest: item.expected_harvest_c,
            notes: item.notes_c,
            farmId: item.farm_id_c?.Id || item.farm_id_c
          };
        }
      }
      throw new Error('Update operation failed');
    } catch (error) {
      console.error('Error updating crop:', error);
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

      const response = await apperClient.deleteRecord('crop_c', {
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
          console.error(`Failed to delete ${failed.length} crops:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        
        return successful.length > 0;
      }
      return false;
    } catch (error) {
      console.error('Error deleting crop:', error);
      throw error;
    }
  }
}

export default new CropService();
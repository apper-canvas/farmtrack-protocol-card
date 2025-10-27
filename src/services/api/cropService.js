import cropsData from "@/services/mockData/crops.json";

class CropService {
  constructor() {
    this.storageKey = "farmtrack_crops";
    this.initializeData();
  }

  initializeData() {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      localStorage.setItem(this.storageKey, JSON.stringify(cropsData));
    }
  }

  getData() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  async getAll() {
    await this.delay(300);
    return [...this.getData()];
  }

  async getById(id) {
    await this.delay(200);
    const data = this.getData();
    const crop = data.find(item => item.Id === parseInt(id));
    return crop ? { ...crop } : null;
  }

  async getByFarmId(farmId) {
    await this.delay(200);
    const data = this.getData();
    return data.filter(crop => crop.farmId === farmId).map(crop => ({ ...crop }));
  }

  async create(cropData) {
    await this.delay(400);
    const data = this.getData();
    const newId = Math.max(...data.map(item => item.Id), 0) + 1;
    
    const newCrop = {
      Id: newId,
      ...cropData,
      createdAt: new Date().toISOString()
    };
    
    data.push(newCrop);
    this.saveData(data);
    return { ...newCrop };
  }

  async update(id, cropData) {
    await this.delay(400);
    const data = this.getData();
    const index = data.findIndex(item => item.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Crop not found");
    }

    const updatedCrop = {
      ...data[index],
      ...cropData,
      Id: parseInt(id)
    };
    
    data[index] = updatedCrop;
    this.saveData(data);
    return { ...updatedCrop };
  }

  async delete(id) {
    await this.delay(300);
    const data = this.getData();
    const filteredData = data.filter(item => item.Id !== parseInt(id));
    
    if (filteredData.length === data.length) {
      throw new Error("Crop not found");
    }
    
    this.saveData(filteredData);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new CropService();
import farmsData from "@/services/mockData/farms.json";

class FarmService {
  constructor() {
    this.storageKey = "farmtrack_farms";
    this.initializeData();
  }

  initializeData() {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      localStorage.setItem(this.storageKey, JSON.stringify(farmsData));
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
    const farm = data.find(item => item.Id === parseInt(id));
    return farm ? { ...farm } : null;
  }

  async create(farmData) {
    await this.delay(400);
    const data = this.getData();
    const newId = Math.max(...data.map(item => item.Id), 0) + 1;
    
    const newFarm = {
      Id: newId,
      ...farmData,
      createdAt: new Date().toISOString()
    };
    
    data.push(newFarm);
    this.saveData(data);
    return { ...newFarm };
  }

  async update(id, farmData) {
    await this.delay(400);
    const data = this.getData();
    const index = data.findIndex(item => item.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Farm not found");
    }

    const updatedFarm = {
      ...data[index],
      ...farmData,
      Id: parseInt(id)
    };
    
    data[index] = updatedFarm;
    this.saveData(data);
    return { ...updatedFarm };
  }

  async delete(id) {
    await this.delay(300);
    const data = this.getData();
    const filteredData = data.filter(item => item.Id !== parseInt(id));
    
    if (filteredData.length === data.length) {
      throw new Error("Farm not found");
    }
    
    this.saveData(filteredData);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new FarmService();
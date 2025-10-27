import tasksData from "@/services/mockData/tasks.json";

class TaskService {
  constructor() {
    this.storageKey = "farmtrack_tasks";
    this.initializeData();
  }

  initializeData() {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) {
      localStorage.setItem(this.storageKey, JSON.stringify(tasksData));
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
    const task = data.find(item => item.Id === parseInt(id));
    return task ? { ...task } : null;
  }

  async getByFarmId(farmId) {
    await this.delay(200);
    const data = this.getData();
    return data.filter(task => task.farmId === farmId).map(task => ({ ...task }));
  }

  async create(taskData) {
    await this.delay(400);
    const data = this.getData();
    const newId = Math.max(...data.map(item => item.Id), 0) + 1;
    
    const newTask = {
      Id: newId,
      ...taskData,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString()
    };
    
    data.push(newTask);
    this.saveData(data);
    return { ...newTask };
  }

  async update(id, taskData) {
    await this.delay(400);
    const data = this.getData();
    const index = data.findIndex(item => item.Id === parseInt(id));
    
    if (index === -1) {
      throw new Error("Task not found");
    }

    const updatedTask = {
      ...data[index],
      ...taskData,
      Id: parseInt(id)
    };
    
    data[index] = updatedTask;
    this.saveData(data);
    return { ...updatedTask };
  }

  async delete(id) {
    await this.delay(300);
    const data = this.getData();
    const filteredData = data.filter(item => item.Id !== parseInt(id));
    
    if (filteredData.length === data.length) {
      throw new Error("Task not found");
    }
    
    this.saveData(filteredData);
    return true;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new TaskService();
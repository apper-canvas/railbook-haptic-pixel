import stationsData from "@/services/mockData/stations.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const stationService = {
  async getAll() {
    await delay(300);
    return [...stationsData];
  },

  async search(query) {
    await delay(200);
    if (!query || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase();
    return stationsData.filter(station => 
      station.name.toLowerCase().includes(searchTerm) ||
      station.city.toLowerCase().includes(searchTerm) ||
      station.code.toLowerCase().includes(searchTerm)
    );
  },

  async getById(id) {
    await delay(200);
    return stationsData.find(station => station.Id === parseInt(id));
  },

  async getByCode(code) {
    await delay(200);
    return stationsData.find(station => station.code === code);
  }
};

export default stationService;
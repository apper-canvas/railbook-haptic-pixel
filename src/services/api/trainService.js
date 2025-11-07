import trainsData from "@/services/mockData/trains.json";
import stationService from "@/services/api/stationService";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const trainService = {
  async searchTrains(searchParams) {
    await delay(500);
    const { origin, destination, journeyDate, travelClass } = searchParams;
    
    if (!origin || !destination) {
      return [];
    }

    // Find trains matching the route
    const matchingTrains = trainsData.filter(train => {
      const routeMatch = (train.origin === origin && train.destination === destination);
      const classMatch = !travelClass || train.classes.includes(travelClass);
      return routeMatch && classMatch;
    });

    // Add some randomization to seat availability for demo
    return matchingTrains.map(train => ({
      ...train,
      availableSeats: {
        ...train.availableSeats,
        // Randomly reduce available seats to simulate booking
        ...Object.keys(train.availableSeats).reduce((acc, cls) => {
          const original = train.availableSeats[cls];
          acc[cls] = Math.max(0, original - Math.floor(Math.random() * 20));
          return acc;
        }, {})
      }
    }));
  },

  async getById(id) {
    await delay(300);
    return trainsData.find(train => train.Id === parseInt(id));
  },

  async getByTrainNumber(trainNumber) {
    await delay(300);
    return trainsData.find(train => train.trainNumber === trainNumber);
  },

  async getSeatLayout(trainId, travelClass) {
    await delay(400);
    const train = trainsData.find(t => t.Id === parseInt(trainId));
    if (!train || !train.classes.includes(travelClass)) {
      return null;
    }

    // Generate seat layout based on class
    const layouts = {
      '1A': this.generateSeatLayout('1A', 4, 6), // 4 coaches, 6 seats per coach
      '2A': this.generateSeatLayout('2A', 6, 8), // 6 coaches, 8 seats per coach  
      '3A': this.generateSeatLayout('3A', 8, 9), // 8 coaches, 9 seats per coach
      'SL': this.generateSeatLayout('SL', 12, 8), // 12 coaches, 8 seats per coach
      'CC': this.generateSeatLayout('CC', 4, 12), // 4 coaches, 12 seats per coach
      'EC': this.generateSeatLayout('EC', 2, 12)  // 2 coaches, 12 seats per coach
    };

    return layouts[travelClass] || null;
  },

  generateSeatLayout(travelClass, coachCount, seatsPerCoach) {
    const coaches = [];
    
    for (let i = 1; i <= coachCount; i++) {
      const coachName = `${travelClass.charAt(0)}${i}`;
      const seats = [];
      
      for (let j = 1; j <= seatsPerCoach; j++) {
        seats.push({
          seatNumber: `${coachName}-${j}`,
          status: Math.random() > 0.3 ? 'available' : 'occupied', // 70% available
          type: this.getSeatType(travelClass, j)
        });
      }
      
      coaches.push({
        coachName,
        seats
      });
    }
    
    return coaches;
  },

  getSeatType(travelClass, seatNumber) {
    if (travelClass === 'CC' || travelClass === 'EC') {
      return 'chair';
    }
    
    const berths = ['Lower', 'Middle', 'Upper', 'Side Lower', 'Side Upper'];
    return berths[seatNumber % berths.length];
  },

  async getTrainStatus(trainNumber) {
    await delay(400);
    const train = trainsData.find(t => t.trainNumber === trainNumber);
    if (!train) return null;

    // Mock live status
    const statuses = ['On Time', 'Delayed by 15 min', 'Delayed by 30 min', 'Delayed by 1 hr', 'Cancelled'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      ...train,
      currentStatus: randomStatus,
      lastUpdated: new Date().toISOString(),
      nextStation: 'Intermediate Station',
      platform: Math.floor(Math.random() * 10) + 1
    };
  }
};

export default trainService;
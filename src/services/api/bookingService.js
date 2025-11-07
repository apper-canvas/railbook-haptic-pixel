import bookingsData from "@/services/mockData/bookings.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let bookings = [...bookingsData];

const bookingService = {
  async getAll() {
    await delay(400);
    return [...bookings];
  },

  async getByPnr(pnr) {
    await delay(300);
    return bookings.find(booking => booking.pnr === pnr);
  },

  async getUserBookings() {
    await delay(400);
    // In a real app, this would filter by user ID
    return [...bookings];
  },

  async createBooking(bookingData) {
    await delay(600);
    
    const newBooking = {
      Id: Math.max(...bookings.map(b => b.Id)) + 1,
      pnr: this.generatePnr(),
      ...bookingData,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'Confirmed'
    };

    bookings.unshift(newBooking);
    return newBooking;
  },

  async cancelBooking(pnr) {
    await delay(500);
    const bookingIndex = bookings.findIndex(b => b.pnr === pnr);
    
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }

    const booking = bookings[bookingIndex];
    const refundAmount = this.calculateRefund(booking);
    
    bookings[bookingIndex] = {
      ...booking,
      status: 'Cancelled'
    };

    return {
      booking: bookings[bookingIndex],
      refundAmount
    };
  },

  generatePnr() {
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  },

  calculateRefund(booking) {
    const journeyDate = new Date(booking.journeyDate);
    const today = new Date();
    const daysUntilJourney = Math.ceil((journeyDate - today) / (1000 * 60 * 60 * 24));
    
    let refundPercentage = 0;
    if (daysUntilJourney >= 1) {
      refundPercentage = 0.9; // 90% refund
    } else if (daysUntilJourney >= 0) {
      refundPercentage = 0.5; // 50% refund
    } else {
      refundPercentage = 0; // No refund for past journeys
    }
    
    return Math.floor(booking.fare * refundPercentage);
  },

  async calculateFare(trainId, travelClass, passengerCount) {
    await delay(300);
    const trainsData = await import("@/services/mockData/trains.json");
    const train = trainsData.default.find(t => t.Id === parseInt(trainId));
    
    if (!train || !train.fare[travelClass]) {
      return { baseFare: 0, taxes: 0, total: 0 };
    }

    const baseFare = train.fare[travelClass] * passengerCount;
    const taxes = Math.floor(baseFare * 0.05); // 5% tax
    const total = baseFare + taxes;

    return { baseFare, taxes, total };
  }
};

export default bookingService;
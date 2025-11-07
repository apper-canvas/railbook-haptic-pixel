import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import trainService from "@/services/api/trainService";
import bookingService from "@/services/api/bookingService";
import { toast } from "react-toastify";

const ReviewPayment = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [train, setTrain] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  
  const bookingData = {
    trainId: searchParams.get("trainId"),
    origin: searchParams.get("origin"),
    destination: searchParams.get("destination"),
    journeyDate: searchParams.get("journeyDate"),
    class: searchParams.get("class"),
    seats: searchParams.get("seats")?.split(",") || [],
    passengerCount: parseInt(searchParams.get("passengers")) || 1
  };

  useEffect(() => {
    loadTrain();
    loadPassengers();
  }, []);

  const loadTrain = async () => {
    try {
      const trainData = await trainService.getById(bookingData.trainId);
      setTrain(trainData);
    } catch (err) {
      console.error("Error loading train:", err);
      toast.error("Failed to load train details");
    }
  };

  const loadPassengers = () => {
    try {
      const passengerData = searchParams.get("passengers");
      if (passengerData) {
        setPassengers(JSON.parse(passengerData));
      }
    } catch (err) {
      console.error("Error parsing passenger data:", err);
      toast.error("Failed to load passenger details");
    }
  };

  const getFare = () => {
    return train?.fare?.[bookingData.class] || 0;
  };

  const getBaseFare = () => {
    return getFare() * bookingData.passengerCount;
  };

  const getTaxes = () => {
    return Math.floor(getBaseFare() * 0.05); // 5% tax
  };

  const getTotalFare = () => {
    return getBaseFare() + getTaxes();
  };

  const handleBooking = async () => {
    setLoading(true);
    
    try {
      const booking = await bookingService.createBooking({
        trainNumber: train.trainNumber,
        trainName: train.trainName,
        journeyDate: bookingData.journeyDate,
        origin: bookingData.origin,
        destination: bookingData.destination,
        departureTime: train.departureTime,
        arrivalTime: train.arrivalTime,
        passengers: passengers,
        seatNumbers: bookingData.seats,
        class: bookingData.class,
        fare: getTotalFare()
      });

      toast.success("Booking confirmed successfully!");
      
      // Navigate to confirmation page
      navigate(`/booking-confirmation?pnr=${booking.pnr}`);
      
    } catch (err) {
      console.error("Booking error:", err);
      toast.error("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    {
      id: "credit-card",
      name: "Credit/Debit Card",
      icon: "CreditCard",
      description: "Visa, Mastercard, Rupay"
    },
    {
      id: "upi",
      name: "UPI Payment",
      icon: "Smartphone",
      description: "PhonePe, GPay, Paytm"
    },
    {
      id: "netbanking",
      name: "Net Banking",
      icon: "Building",
      description: "All major banks"
    },
    {
      id: "wallet",
      name: "Digital Wallet",
      icon: "Wallet",
      description: "Paytm, MobiKwik, Freecharge"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-success to-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <span className="ml-2 text-sm font-medium text-success">Search</span>
          </div>
          <div className="w-12 h-px bg-gradient-to-r from-success to-success"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-success to-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <span className="ml-2 text-sm font-medium text-success">Seats</span>
          </div>
          <div className="w-12 h-px bg-gradient-to-r from-success to-success"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-success to-green-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
              ✓
            </div>
            <span className="ml-2 text-sm font-medium text-success">Details</span>
          </div>
          <div className="w-12 h-px bg-gradient-to-r from-success to-primary"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center text-sm font-medium">
              4
            </div>
            <span className="ml-2 text-sm font-medium text-primary">Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Review & Payment */}
        <div className="lg:col-span-2 space-y-6">
          {/* Journey Details */}
          {train && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                  <ApperIcon name="Train" className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">Journey Details</h2>
              </div>

              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-6 border border-blue-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {train.trainNumber} - {train.trainName}
                    </h3>
                    <p className="text-gray-600">
                      {bookingData.journeyDate}
                    </p>
                  </div>
                  <Badge variant="primary">{bookingData.class}</Badge>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {train.departureTime}
                    </p>
                    <p className="text-sm text-gray-600">{bookingData.origin}</p>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <div className="w-16 h-px bg-gradient-to-r from-primary to-secondary"></div>
                      <ApperIcon name="Train" className="w-5 h-5 text-secondary" />
                      <div className="w-16 h-px bg-gradient-to-r from-secondary to-primary"></div>
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{train.duration}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      {train.arrivalTime}
                    </p>
                    <p className="text-sm text-gray-600">{bookingData.destination}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Seats: {bookingData.seats.join(", ")}</span>
                  <span>Duration: {train.duration}</span>
                </div>
              </div>
            </div>
          )}

          {/* Passenger Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Users" className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Passenger Details</h2>
            </div>

            <div className="space-y-4">
              {passengers.map((passenger, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{passenger.name}</p>
                      <p className="text-sm text-gray-600">
                        {passenger.age} years, {passenger.gender}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Seat</p>
                    <p className="font-medium text-gray-900">{bookingData.seats[index]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="CreditCard" className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    paymentMethod === method.id
                      ? "border-primary bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md"
                      : "border-gray-200 hover:border-primary hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                      <ApperIcon name={method.icon} className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{method.name}</p>
                      <p className="text-xs text-gray-600">{method.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Payment Summary
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Base Fare:</span>
                <span className="font-medium">₹{getBaseFare().toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes & Service Fee:</span>
                <span className="font-medium">₹{getTaxes().toLocaleString()}</span>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total Amount:</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    ₹{getTotalFare().toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-6 border border-green-200">
              <div className="flex items-center">
                <ApperIcon name="Shield" className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-sm font-medium text-green-800">Secure Payment</p>
                  <p className="text-xs text-green-600">Your payment is protected with 256-bit SSL encryption</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleBooking}
              disabled={loading}
              className="w-full mb-3"
              variant="secondary"
              size="lg"
            >
              {loading ? (
                <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
              )}
              {loading ? "Processing..." : `Pay ₹${getTotalFare().toLocaleString()}`}
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full"
              disabled={loading}
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
              Back to Details
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By completing this booking, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewPayment;
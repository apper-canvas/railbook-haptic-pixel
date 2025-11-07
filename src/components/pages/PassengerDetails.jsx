import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import trainService from "@/services/api/trainService";
import { toast } from "react-toastify";

const PassengerDetails = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [train, setTrain] = useState(null);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
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
    initializePassengers();
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

  const initializePassengers = () => {
    const passengerList = [];
    for (let i = 0; i < bookingData.passengerCount; i++) {
      passengerList.push({
        name: "",
        age: "",
        gender: "",
        idType: "Aadhar",
        idNumber: "",
        seatPreference: "No Preference"
      });
    }
    setPassengers(passengerList);
  };

  const updatePassenger = (index, field, value) => {
    setPassengers(prev => prev.map((passenger, i) => 
      i === index ? { ...passenger, [field]: value } : passenger
    ));
    
    // Clear error for this field
    const errorKey = `passenger${index}.${field}`;
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    passengers.forEach((passenger, index) => {
      const prefix = `passenger${index}`;
      
      if (!passenger.name.trim()) {
        newErrors[`${prefix}.name`] = "Name is required";
      } else if (passenger.name.trim().length < 2) {
        newErrors[`${prefix}.name`] = "Name must be at least 2 characters";
      }
      
      if (!passenger.age) {
        newErrors[`${prefix}.age`] = "Age is required";
      } else {
        const age = parseInt(passenger.age);
        if (age < 1 || age > 120) {
          newErrors[`${prefix}.age`] = "Age must be between 1 and 120";
        }
      }
      
      if (!passenger.gender) {
        newErrors[`${prefix}.gender`] = "Gender is required";
      }
      
      if (!passenger.idNumber.trim()) {
        newErrors[`${prefix}.idNumber`] = "ID number is required";
      } else if (passenger.idNumber.trim().length < 6) {
        newErrors[`${prefix}.idNumber`] = "ID number must be at least 6 characters";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    const params = new URLSearchParams({
      ...Object.fromEntries(searchParams),
      passengers: JSON.stringify(passengers)
    });
    navigate(`/review-payment?${params.toString()}`);
  };

  const getFare = () => {
    return train?.fare?.[bookingData.class] || 0;
  };

  const getTotalFare = () => {
    return getFare() * bookingData.passengerCount;
  };

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
          <div className="w-12 h-px bg-gradient-to-r from-success to-primary"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="ml-2 text-sm font-medium text-primary">Details</span>
          </div>
          <div className="w-12 h-px bg-gray-200"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
              4
            </div>
            <span className="ml-2 text-sm text-gray-500">Payment</span>
          </div>
        </div>
      </div>

      {/* Journey Summary */}
      {train && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                {train.trainNumber} - {train.trainName}
              </h1>
              <p className="text-gray-600">
                {bookingData.origin} → {bookingData.destination} • {bookingData.journeyDate}
              </p>
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <div className="text-center">
                <p className="text-sm text-gray-500">Class</p>
                <p className="font-semibold text-gray-900">{bookingData.class}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Seats</p>
                <p className="font-semibold text-gray-900">{bookingData.seats.join(", ")}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Fare</p>
                <p className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  ₹{getTotalFare().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Passenger Details Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="Users" className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Passenger Details
              </h2>
            </div>

            <div className="space-y-8">
              {passengers.map((passenger, index) => (
                <div key={index} className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-6 border border-blue-100">
                  <div className="flex items-center mb-4">
                    <div className="w-6 h-6 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">
                      Passenger {index + 1}
                    </h3>
                    <div className="ml-auto">
                      <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                        Seat: {bookingData.seats[index]}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      label="Full Name"
                      icon="User"
                      required
                      error={errors[`passenger${index}.name`]}
                    >
                      <Input
                        value={passenger.name}
                        onChange={(e) => updatePassenger(index, "name", e.target.value)}
                        placeholder="Enter full name"
                      />
                    </FormField>

                    <FormField
                      label="Age"
                      icon="Calendar"
                      required
                      error={errors[`passenger${index}.age`]}
                    >
                      <Input
                        type="number"
                        min="1"
                        max="120"
                        value={passenger.age}
                        onChange={(e) => updatePassenger(index, "age", e.target.value)}
                        placeholder="Enter age"
                      />
                    </FormField>

                    <FormField
                      label="Gender"
                      icon="Users"
                      required
                      error={errors[`passenger${index}.gender`]}
                    >
                      <Select
                        value={passenger.gender}
                        onChange={(e) => updatePassenger(index, "gender", e.target.value)}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </Select>
                    </FormField>

                    <FormField
                      label="ID Type"
                      icon="CreditCard"
                    >
                      <Select
                        value={passenger.idType}
                        onChange={(e) => updatePassenger(index, "idType", e.target.value)}
                      >
                        <option value="Aadhar">Aadhar Card</option>
                        <option value="PAN">PAN Card</option>
                        <option value="Passport">Passport</option>
                        <option value="Driving License">Driving License</option>
                        <option value="Voter ID">Voter ID</option>
                      </Select>
                    </FormField>

                    <FormField
                      label="ID Number"
                      icon="Hash"
                      required
                      error={errors[`passenger${index}.idNumber`]}
                    >
                      <Input
                        value={passenger.idNumber}
                        onChange={(e) => updatePassenger(index, "idNumber", e.target.value)}
                        placeholder="Enter ID number"
                      />
                    </FormField>

                    <FormField
                      label="Seat Preference"
                      icon="Armchair"
                    >
                      <Select
                        value={passenger.seatPreference}
                        onChange={(e) => updatePassenger(index, "seatPreference", e.target.value)}
                      >
                        <option value="No Preference">No Preference</option>
                        <option value="Lower Berth">Lower Berth</option>
                        <option value="Upper Berth">Upper Berth</option>
                        <option value="Window">Window Seat</option>
                        <option value="Aisle">Aisle Seat</option>
                      </Select>
                    </FormField>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Booking Summary
            </h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Passengers:</span>
                <span className="font-medium">{bookingData.passengerCount}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Class:</span>
                <span className="font-medium">{bookingData.class}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Seats:</span>
                <span className="font-medium">{bookingData.seats.join(", ")}</span>
              </div>
              
              <div className="border-t pt-3 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Base Fare:</span>
                  <span className="font-medium">₹{getTotalFare().toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Taxes & Fees:</span>
                  <span className="font-medium">₹0</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      ₹{getTotalFare().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              className="w-full mb-3"
              variant="secondary"
              size="lg"
              disabled={loading}
            >
              <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
              Proceed to Payment
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
              Back to Seat Selection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDetails;
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SeatLayout from "@/components/organisms/SeatLayout";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import trainService from "@/services/api/trainService";
import { toast } from "react-toastify";

const SeatSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [train, setTrain] = useState(null);
  const [seatLayout, setSeatLayout] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [loading, setLoading] = useState(true);
  const [seatLoading, setSeatLoading] = useState(false);
  const [error, setError] = useState("");
  
  const searchCriteria = {
    trainId: searchParams.get("trainId"),
    origin: searchParams.get("origin"),
    destination: searchParams.get("destination"),
    journeyDate: searchParams.get("journeyDate"),
    passengers: parseInt(searchParams.get("passengers")) || 1
  };

  useEffect(() => {
    if (searchCriteria.trainId) {
      loadTrain();
    }
  }, [searchCriteria.trainId]);

  useEffect(() => {
    if (train && selectedClass) {
      loadSeatLayout();
    }
  }, [train, selectedClass]);

  const loadTrain = async () => {
    setLoading(true);
    setError("");
    
    try {
      const trainData = await trainService.getById(searchCriteria.trainId);
      if (!trainData) {
        throw new Error("Train not found");
      }
      setTrain(trainData);
      // Set default class to first available class
      if (trainData.classes.length > 0) {
        setSelectedClass(trainData.classes[0]);
      }
    } catch (err) {
      console.error("Error loading train:", err);
      setError("Failed to load train details. Please try again.");
      toast.error("Failed to load train details");
    } finally {
      setLoading(false);
    }
  };

  const loadSeatLayout = async () => {
    if (!train || !selectedClass) return;
    
    setSeatLoading(true);
    try {
      const layout = await trainService.getSeatLayout(train.Id, selectedClass);
      setSeatLayout(layout);
      setSelectedSeats([]); // Clear selections when changing class
    } catch (err) {
      console.error("Error loading seat layout:", err);
      toast.error("Failed to load seat layout");
      setSeatLayout(null);
    } finally {
      setSeatLoading(false);
    }
  };

  const handleClassChange = (newClass) => {
    setSelectedClass(newClass);
    setSelectedSeats([]);
  };

  const handleContinue = () => {
    if (selectedSeats.length !== searchCriteria.passengers) {
      toast.error(`Please select exactly ${searchCriteria.passengers} seat(s)`);
      return;
    }

    const params = new URLSearchParams({
      ...searchCriteria,
      class: selectedClass,
      seats: selectedSeats.join(",")
    });
    navigate(`/passenger-details?${params.toString()}`);
  };

  const getFareForClass = (travelClass) => {
    return train?.fare?.[travelClass] || 0;
  };

  const getTotalFare = () => {
    const baseFare = getFareForClass(selectedClass) * searchCriteria.passengers;
    return baseFare;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Seat Selection...</h1>
        </div>
        <Loading type="seats" />
      </div>
    );
  }

  if (error || !train) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorView 
          message={error}
          onRetry={loadTrain}
        />
      </div>
    );
  }

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
          <div className="w-12 h-px bg-gradient-to-r from-success to-primary"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <span className="ml-2 text-sm font-medium text-primary">Seats</span>
          </div>
          <div className="w-12 h-px bg-gray-200"></div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <span className="ml-2 text-sm text-gray-500">Details</span>
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

      {/* Train Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {train.trainNumber} - {train.trainName}
            </h1>
            <p className="text-gray-600 mb-4 md:mb-0">
              {train.origin} → {train.destination} • {searchCriteria.journeyDate}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Departure</p>
              <p className="text-lg font-semibold text-gray-900">{train.departureTime}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Duration</p>
              <p className="text-lg font-semibold text-gray-900">{train.duration}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Class Selection & Seat Layout */}
        <div className="lg:col-span-2">
          {/* Class Selection */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Select Travel Class
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {train.classes.map((travelClass) => {
                const available = train.availableSeats[travelClass] || 0;
                const fare = getFareForClass(travelClass);
                return (
                  <div
                    key={travelClass}
                    onClick={() => available > 0 && handleClassChange(travelClass)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      selectedClass === travelClass
                        ? "border-primary bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md"
                        : available > 0
                        ? "border-gray-200 hover:border-primary hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
                        : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{travelClass}</h3>
                      {available > 0 ? (
                        <Badge variant="success" className="text-xs">
                          {available} left
                        </Badge>
                      ) : (
                        <Badge variant="error" className="text-xs">
                          Sold Out
                        </Badge>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-primary mb-1">
                      ₹{fare.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">per person</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Seat Layout */}
          {selectedClass && (
            seatLoading ? (
              <Loading type="seats" />
            ) : seatLayout ? (
              <SeatLayout
                coaches={seatLayout}
                maxSeats={searchCriteria.passengers}
                selectedSeats={selectedSeats}
                onSeatSelect={setSelectedSeats}
              />
            ) : (
              <Empty type="seats" />
            )
          )}
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Booking Summary
            </h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Passengers:</span>
                <span className="font-medium">{searchCriteria.passengers}</span>
              </div>
              
              {selectedClass && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Travel Class:</span>
                  <span className="font-medium">{selectedClass}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Selected Seats:</span>
                <span className="font-medium">
                  {selectedSeats.length} of {searchCriteria.passengers}
                </span>
              </div>
              
              {selectedSeats.length > 0 && (
                <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg p-3">
                  <p className="text-sm font-medium text-gray-900 mb-1">Seat Numbers:</p>
                  <p className="text-sm text-gray-700">
                    {selectedSeats.join(", ")}
                  </p>
                </div>
              )}
            </div>

            {selectedClass && (
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Base Fare:</span>
                  <span className="font-medium">
                    ₹{(getFareForClass(selectedClass) * searchCriteria.passengers).toLocaleString()}
                  </span>
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
            )}

            <Button
              onClick={handleContinue}
              disabled={!selectedClass || selectedSeats.length !== searchCriteria.passengers}
              className="w-full"
              variant="secondary"
              size="lg"
            >
              <ApperIcon name="ArrowRight" className="w-5 h-5 mr-2" />
              Continue to Details
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full mt-3"
            >
              <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
              Back to Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
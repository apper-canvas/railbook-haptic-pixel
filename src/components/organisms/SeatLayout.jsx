import React, { useState, useEffect } from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const SeatLayout = ({ coaches, maxSeats, onSeatSelect, selectedSeats }) => {
  const [currentCoach, setCurrentCoach] = useState(0);

  const getSeatStatusColor = (status, isSelected) => {
    if (isSelected) return "bg-gradient-to-r from-secondary to-accent text-white border-secondary";
    
    switch (status) {
      case "available": return "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200 hover:from-green-100 hover:to-green-200 cursor-pointer";
      case "occupied": return "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-500 border-gray-300 cursor-not-allowed";
      case "reserved": return "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 cursor-not-allowed";
      default: return "bg-white border-gray-300";
    }
  };

  const getSeatIcon = (type, status) => {
    if (status === "occupied") return "X";
    
    switch (type) {
      case "chair": return "Armchair";
      case "Lower": return "Bed";
      case "Middle": return "Bed";
      case "Upper": return "Bed";
      case "Side Lower": return "Bed";
      case "Side Upper": return "Bed";
      default: return "Square";
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.status !== "available") return;
    
    const isSelected = selectedSeats.includes(seat.seatNumber);
    
    if (isSelected) {
      // Deselect seat
      onSeatSelect(selectedSeats.filter(s => s !== seat.seatNumber));
    } else {
      // Select seat if under limit
      if (selectedSeats.length < maxSeats) {
        onSeatSelect([...selectedSeats, seat.seatNumber]);
      }
    }
  };

  const currentCoachData = coaches[currentCoach];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="Train" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Select Seats - {currentCoachData?.coachName}
            </h3>
            <p className="text-sm text-gray-600">
              Selected: {selectedSeats.length} of {maxSeats}
            </p>
          </div>
        </div>

        <Badge variant="primary" className="px-3 py-1">
          Coach {currentCoach + 1} of {coaches.length}
        </Badge>
      </div>

      {/* Coach Navigation */}
      {coaches.length > 1 && (
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentCoach(Math.max(0, currentCoach - 1))}
            disabled={currentCoach === 0}
          >
            <ApperIcon name="ChevronLeft" className="w-4 h-4" />
          </Button>
          
          <div className="flex space-x-1">
            {coaches.map((coach, index) => (
              <button
                key={index}
                onClick={() => setCurrentCoach(index)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded transition-all duration-200",
                  index === currentCoach
                    ? "bg-gradient-to-r from-primary to-secondary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                )}
              >
                {coach.coachName}
              </button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentCoach(Math.min(coaches.length - 1, currentCoach + 1))}
            disabled={currentCoach === coaches.length - 1}
          >
            <ApperIcon name="ChevronRight" className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Seat Legend */}
      <div className="flex items-center justify-center space-x-6 mb-6 p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded"></div>
          <span className="text-sm text-gray-700">Available</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-secondary to-accent border border-secondary rounded"></div>
          <span className="text-sm text-gray-700">Selected</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded"></div>
          <span className="text-sm text-gray-700">Occupied</span>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 mb-6">
        {currentCoachData?.seats.map((seat) => {
          const isSelected = selectedSeats.includes(seat.seatNumber);
          return (
            <button
              key={seat.seatNumber}
              onClick={() => handleSeatClick(seat)}
              disabled={seat.status !== "available" && !isSelected}
              className={cn(
                "relative h-12 w-full rounded-lg border-2 text-sm font-medium transition-all duration-200 flex flex-col items-center justify-center transform hover:scale-105",
                getSeatStatusColor(seat.status, isSelected)
              )}
              title={`${seat.seatNumber} - ${seat.type} (${seat.status})`}
            >
              <ApperIcon 
                name={getSeatIcon(seat.type, seat.status)} 
                className="w-4 h-4 mb-0.5" 
              />
              <span className="text-xs">
                {seat.seatNumber.split('-')[1]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selection Summary */}
      {selectedSeats.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Selected Seats</h4>
              <p className="text-sm text-gray-600">
                {selectedSeats.join(", ")}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSeatSelect([])}
              className="text-error hover:bg-red-50"
            >
              Clear All
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeatLayout;
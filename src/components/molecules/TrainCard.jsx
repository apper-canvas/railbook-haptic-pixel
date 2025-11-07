import React from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";

const TrainCard = ({ train, onBookNow, onViewDetails }) => {
  const getAvailabilityColor = (count) => {
    if (count === 0) return "text-error";
    if (count < 10) return "text-warning";
    return "text-success";
  };

  const getAvailabilityText = (count) => {
    if (count === 0) return "Waiting List";
    if (count < 10) return "Few Seats Left";
    return "Available";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02] p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">
              {train.trainNumber}
            </h3>
            <div className="h-4 w-px bg-gray-300"></div>
            <Badge variant="primary" className="text-xs">
              {train.classes.join(", ")}
            </Badge>
          </div>
          <p className="text-gray-700 font-medium">
            {train.trainName}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 mb-1">Duration</p>
          <p className="font-semibold text-gray-900">{train.duration}</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {train.departureTime}
            </p>
            <p className="text-sm text-gray-600">{train.origin}</p>
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
            <p className="text-sm text-gray-600">{train.destination}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
            {Object.entries(train.availableSeats).map(([classType, count]) => (
              <div key={classType} className="text-center">
                <p className="text-xs text-gray-500 mb-1">{classType}</p>
                <p className={`font-semibold ${getAvailabilityColor(count)}`}>
                  {count > 0 ? count : "WL"}
                </p>
                <p className={`text-xs ${getAvailabilityColor(count)}`}>
                  {getAvailabilityText(count)}
                </p>
              </div>
            ))}
          </div>
          
          <div className="flex space-x-3">
            {onViewDetails && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewDetails(train)}
              >
                <ApperIcon name="Info" className="w-4 h-4 mr-1" />
                Details
              </Button>
            )}
            <Button 
              variant="secondary"
              onClick={() => onBookNow(train)}
              disabled={Object.values(train.availableSeats).every(count => count === 0)}
            >
              <ApperIcon name="Ticket" className="w-4 h-4 mr-2" />
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainCard;
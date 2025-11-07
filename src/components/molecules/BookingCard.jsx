import React from "react";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const BookingCard = ({ booking, onViewDetails, onCancel, onDownloadTicket }) => {
  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'confirmed';
      case 'waitlisted': return 'waitlisted';
      case 'cancelled': return 'cancelled';
      case 'completed': return 'completed';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const isUpcoming = () => {
    const journeyDate = new Date(booking.journeyDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return journeyDate >= today;
  };

  const canCancel = () => {
    return booking.status.toLowerCase() === 'confirmed' && isUpcoming();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <p className="text-sm text-gray-500">PNR: {booking.pnr}</p>
            <Badge variant={getStatusVariant(booking.status)}>
              {booking.status}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {booking.trainNumber} - {booking.trainName}
          </h3>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ₹{booking.fare.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Total Fare</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Journey Date</p>
          <p className="font-medium text-gray-900">
            {formatDate(booking.journeyDate)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Route</p>
          <p className="font-medium text-gray-900">
            {booking.origin} → {booking.destination}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Time</p>
          <p className="font-medium text-gray-900">
            {booking.departureTime} - {booking.arrivalTime}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Passengers</p>
          <p className="font-medium text-gray-900">
            {booking.passengers.length} passenger(s)
          </p>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Armchair" className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Class: {booking.class}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="MapPin" className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Seats: {booking.seatNumbers.join(", ")}
              </span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            {onViewDetails && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onViewDetails(booking)}
              >
                <ApperIcon name="Eye" className="w-4 h-4 mr-1" />
                View
              </Button>
            )}
            
            {booking.status.toLowerCase() === 'confirmed' && onDownloadTicket && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onDownloadTicket(booking)}
              >
                <ApperIcon name="Download" className="w-4 h-4 mr-1" />
                Ticket
              </Button>
            )}
            
            {canCancel() && onCancel && (
              <Button 
                variant="error" 
                size="sm"
                onClick={() => onCancel(booking)}
              >
                <ApperIcon name="X" className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
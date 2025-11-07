import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import bookingService from "@/services/api/bookingService";
import { toast } from "react-toastify";

const BookingConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const pnr = searchParams.get("pnr");
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    if (pnr) {
      loadBooking();
    } else {
      setError("PNR not found");
      setLoading(false);
    }
  }, [pnr]);

  const loadBooking = async () => {
    setLoading(true);
    setError("");
    
    try {
      const bookingData = await bookingService.getByPnr(pnr);
      if (!bookingData) {
        throw new Error("Booking not found");
      }
      setBooking(bookingData);
    } catch (err) {
      console.error("Error loading booking:", err);
      setError("Failed to load booking details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = async () => {
    if (!booking) return;
    
    setDownloadingPdf(true);
    try {
      await bookingService.downloadTicketPdf(booking);
      toast.success("Ticket downloaded successfully!");
    } catch (err) {
      console.error("Error downloading ticket:", err);
      toast.error("Failed to download ticket. Please try again.");
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loading />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorView 
          message={error}
          onRetry={() => navigate("/")}
          type="booking"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-success to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <ApperIcon name="CheckCircle" className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Booking Confirmed!
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Your train ticket has been successfully booked
        </p>
        <p className="text-lg">
          PNR: <span className="font-mono font-bold text-primary">{booking.pnr}</span>
        </p>
      </div>

      {/* Booking Details */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {booking.trainNumber} - {booking.trainName}
              </h2>
              <p className="text-blue-100">
                {booking.journeyDate}
              </p>
            </div>
            <Badge variant="confirmed" className="bg-white text-green-700 border-green-200">
              {booking.status}
            </Badge>
          </div>
        </div>

        <div className="p-6">
          {/* Journey Details */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {booking.departureTime}
              </p>
              <p className="text-gray-600 font-medium">{booking.origin}</p>
              <p className="text-sm text-gray-500">Departure</p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <div className="w-24 h-px bg-gradient-to-r from-primary to-secondary"></div>
                <ApperIcon name="Train" className="w-6 h-6 text-secondary" />
                <div className="w-24 h-px bg-gradient-to-r from-secondary to-primary"></div>
                <div className="w-3 h-3 bg-primary rounded-full"></div>
              </div>
              <p className="text-sm text-gray-500 mt-3 font-medium">Journey Duration</p>
              <p className="text-gray-700 font-semibold">
                {booking.arrivalTime && booking.departureTime ? "Duration not available" : "Duration not available"}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {booking.arrivalTime}
              </p>
              <p className="text-gray-600 font-medium">{booking.destination}</p>
              <p className="text-sm text-gray-500">Arrival</p>
            </div>
          </div>

          {/* Passenger & Seat Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Users" className="w-5 h-5 mr-2 text-primary" />
                Passengers ({booking.passengers.length})
              </h3>
              <div className="space-y-3">
                {booking.passengers.map((passenger, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-blue-100">
                    <div>
                      <p className="font-medium text-gray-900">{passenger.name}</p>
                      <p className="text-sm text-gray-600">
                        Age: {passenger.age}, {passenger.gender}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Seat</p>
                      <p className="font-semibold text-primary">{booking.seatNumbers[index]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Receipt" className="w-5 h-5 mr-2 text-primary" />
                Booking Summary
              </h3>
              <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-blue-100 p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Travel Class:</span>
                  <span className="font-medium text-gray-900">{booking.class}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Seats:</span>
                  <span className="font-medium text-gray-900">{booking.seatNumbers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Seat Numbers:</span>
                  <span className="font-medium text-gray-900">{booking.seatNumbers.join(", ")}</span>
                </div>
                <div className="border-t border-blue-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total Fare:</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      ₹{booking.fare.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <ApperIcon name="Info" className="w-6 h-6 text-amber-600 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-2">Important Information</h4>
                <ul className="text-sm text-amber-700 space-y-2">
                  <li>• Please carry a valid ID proof during your journey</li>
                  <li>• Arrive at the station at least 30 minutes before departure</li>
                  <li>• Keep your PNR number handy for future reference</li>
                  <li>• You can check your train status using the PNR number</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

{/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="primary"
          size="lg"
          onClick={handleDownloadTicket}
          disabled={downloadingPdf}
          className="flex-1 sm:flex-initial"
        >
          <ApperIcon name={downloadingPdf ? "Loader2" : "Download"} className={`w-5 h-5 mr-2 ${downloadingPdf ? 'animate-spin' : ''}`} />
          {downloadingPdf ? "Generating PDF..." : "Download Ticket"}
        </Button>
        
        <Link to="/my-bookings">
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <ApperIcon name="Ticket" className="w-5 h-5 mr-2" />
            View All Bookings
          </Button>
        </Link>
        
        <Link to="/">
          <Button variant="secondary" size="lg" className="w-full sm:w-auto">
            <ApperIcon name="Search" className="w-5 h-5 mr-2" />
            Book Another Ticket
          </Button>
        </Link>
      </div>

      {/* Success Message */}
      <div className="text-center mt-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <p className="text-green-800 font-medium">
          A confirmation SMS and email have been sent to your registered mobile number and email address.
        </p>
      </div>
    </div>
  );
};

export default BookingConfirmation;
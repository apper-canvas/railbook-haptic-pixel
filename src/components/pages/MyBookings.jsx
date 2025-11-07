import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BookingCard from "@/components/molecules/BookingCard";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import bookingService from "@/services/api/bookingService";
import { toast } from "react-toastify";

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchPnr, setSearchPnr] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingBooking, setCancellingBooking] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [bookings, searchPnr, statusFilter]);

  const loadBookings = async () => {
    setLoading(true);
    setError("");
    
    try {
      const userBookings = await bookingService.getUserBookings();
      setBookings(userBookings);
    } catch (err) {
      console.error("Error loading bookings:", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...bookings];

    // Filter by PNR
    if (searchPnr) {
      filtered = filtered.filter(booking => 
        booking.pnr.toLowerCase().includes(searchPnr.toLowerCase()) ||
        booking.trainNumber.includes(searchPnr) ||
        booking.trainName.toLowerCase().includes(searchPnr.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(booking => 
        booking.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Sort by booking date (newest first)
    filtered.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));

    setFilteredBookings(filtered);
  };

  const handleCancelBooking = (booking) => {
    setCancellingBooking(booking);
    setShowCancelModal(true);
  };

  const confirmCancellation = async () => {
    if (!cancellingBooking) return;

    try {
      const result = await bookingService.cancelBooking(cancellingBooking.pnr);
      
      // Update the booking in the list
      setBookings(prev => prev.map(booking => 
        booking.Id === cancellingBooking.Id 
          ? { ...booking, status: "Cancelled" }
          : booking
      ));

      toast.success(`Booking cancelled. Refund of ₹${result.refundAmount} will be processed in 5-7 business days.`);
      setShowCancelModal(false);
      setCancellingBooking(null);
    } catch (err) {
      console.error("Error cancelling booking:", err);
      toast.error("Failed to cancel booking. Please try again.");
    }
  };

  const handleViewDetails = (booking) => {
    navigate(`/booking-confirmation?pnr=${booking.pnr}`);
  };

const handleDownloadTicket = async (booking) => {
    try {
      await bookingService.downloadTicketPdf(booking);
      toast.success("Ticket downloaded successfully!");
    } catch (err) {
      console.error("Error downloading ticket:", err);
      toast.error("Failed to download ticket. Please try again.");
    }
  };

  const getBookingStats = () => {
    const stats = bookings.reduce((acc, booking) => {
      acc[booking.status.toLowerCase()] = (acc[booking.status.toLowerCase()] || 0) + 1;
      return acc;
    }, {});

    return {
      total: bookings.length,
      confirmed: stats.confirmed || 0,
      waitlisted: stats.waitlisted || 0,
      cancelled: stats.cancelled || 0,
      completed: stats.completed || 0
    };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">My Bookings</h1>
        </div>
        <Loading type="bookings" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorView 
          message={error}
          onRetry={loadBookings}
        />
      </div>
    );
  }

  const stats = getBookingStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">Manage and track all your train reservations</p>
        </div>
        <Button 
          onClick={() => navigate("/")}
          variant="secondary"
          className="mt-4 md:mt-0"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          Book New Ticket
        </Button>
      </div>

      {/* Stats */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
            <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
            <p className="text-sm text-blue-600">Total Bookings</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <p className="text-2xl font-bold text-green-700">{stats.confirmed}</p>
            <p className="text-sm text-green-600">Confirmed</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-100">
            <p className="text-2xl font-bold text-yellow-700">{stats.waitlisted}</p>
            <p className="text-sm text-yellow-600">Waitlisted</p>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-4 border border-gray-100">
            <p className="text-2xl font-bold text-gray-700">{stats.completed}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg p-4 border border-red-100">
            <p className="text-2xl font-bold text-red-700">{stats.cancelled}</p>
            <p className="text-sm text-red-600">Cancelled</p>
          </div>
        </div>
      )}

      {/* Filters */}
      {bookings.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by PNR, train number, or train name..."
                value={searchPnr}
                onChange={(e) => setSearchPnr(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="md:w-48">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="waitlisted">Waitlisted</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
            {(searchPnr || statusFilter !== "all") && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchPnr("");
                  setStatusFilter("all");
                }}
              >
                Clear
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <Empty 
          type="bookings"
          onAction={() => navigate("/")}
          actionLabel="Book Your First Ticket"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
          </div>
          
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.Id}
              booking={booking}
              onViewDetails={handleViewDetails}
              onCancel={handleCancelBooking}
              onDownloadTicket={handleDownloadTicket}
            />
          ))}
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && cancellingBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-error to-red-600 rounded-lg flex items-center justify-center mr-3">
                <ApperIcon name="AlertTriangle" className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Cancel Booking</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to cancel this booking?
              </p>
              
              <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-red-800">PNR:</span>
                  <span className="font-mono font-medium text-red-900">{cancellingBooking.pnr}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-red-800">Train:</span>
                  <span className="font-medium text-red-900">{cancellingBooking.trainNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-red-800">Journey:</span>
                  <span className="font-medium text-red-900">{cancellingBooking.journeyDate}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mt-4">
                Refund will be processed in 5-7 business days based on cancellation policy.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
                className="flex-1"
              >
                Keep Booking
              </Button>
              <Button
                variant="error"
                onClick={confirmCancellation}
                className="flex-1"
              >
                Cancel Booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
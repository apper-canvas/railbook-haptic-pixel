import React, { useState } from "react";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import trainService from "@/services/api/trainService";
import { toast } from "react-toastify";

const TrainStatus = () => {
  const [trainNumber, setTrainNumber] = useState("");
  const [trainStatus, setTrainStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!trainNumber.trim()) {
      toast.error("Please enter a train number");
      return;
    }

    setLoading(true);
    setError("");
    setSearchAttempted(true);
    
    try {
      const status = await trainService.getTrainStatus(trainNumber.trim());
      if (status) {
        setTrainStatus(status);
      } else {
        setTrainStatus(null);
        setError("Train not found. Please check the train number and try again.");
      }
    } catch (err) {
      console.error("Error fetching train status:", err);
      setError("Failed to fetch train status. Please try again.");
      setTrainStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (!status) return "default";
    const statusLower = status.toLowerCase();
    if (statusLower.includes("on time")) return "success";
    if (statusLower.includes("delayed")) return "warning";
    if (statusLower.includes("cancelled")) return "error";
    return "info";
  };

  const getStatusIcon = (status) => {
    if (!status) return "Clock";
    const statusLower = status.toLowerCase();
    if (statusLower.includes("on time")) return "CheckCircle";
    if (statusLower.includes("delayed")) return "Clock";
    if (statusLower.includes("cancelled")) return "XCircle";
    return "Info";
  };

  const recentSearches = [
    "12951", "12302", "12621", "12649", "22691"
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="Clock" className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Train Live Status
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Get real-time updates on train schedules, delays, and platform information
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
        <form onSubmit={handleSearch} className="space-y-6">
          <FormField
            label="Train Number"
            icon="Train"
            required
          >
            <Input
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              placeholder="Enter train number (e.g., 12951, 22691)"
              className="text-center text-lg font-mono"
            />
          </FormField>

          <div className="flex justify-center">
            <Button
              type="submit"
              variant="secondary"
              size="lg"
              disabled={loading}
              className="px-12"
            >
              {loading ? (
                <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <ApperIcon name="Search" className="w-5 h-5 mr-2" />
              )}
              {loading ? "Checking Status..." : "Check Status"}
            </Button>
          </div>
        </form>

        {/* Recent Searches */}
        {!searchAttempted && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Search:</h3>
            <div className="flex flex-wrap gap-3">
              {recentSearches.map((number) => (
                <button
                  key={number}
                  onClick={() => setTrainNumber(number)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-primary border border-blue-200 rounded-lg text-sm font-medium hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
                >
                  {number}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <Loading />
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <ErrorView 
            message={error}
            type="search"
            onRetry={() => handleSearch({ preventDefault: () => {} })}
          />
        </div>
      )}

      {/* Empty State */}
      {!trainStatus && !loading && !error && searchAttempted && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <Empty 
            type="search"
            onAction={() => setSearchAttempted(false)}
            actionLabel="Try Another Search"
          />
        </div>
      )}

      {/* Train Status Results */}
      {trainStatus && !loading && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {trainStatus.trainNumber} - {trainStatus.trainName}
                </h2>
                <p className="text-blue-100">
                  {trainStatus.origin} → {trainStatus.destination}
                </p>
              </div>
              <Badge 
                variant={getStatusColor(trainStatus.currentStatus)}
                className="bg-white text-gray-800 border-gray-200"
              >
                <ApperIcon name={getStatusIcon(trainStatus.currentStatus)} className="w-4 h-4 mr-1" />
                {trainStatus.currentStatus}
              </Badge>
            </div>
          </div>

          <div className="p-6">
            {/* Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-blue-100">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Clock" className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Current Status</h3>
                <p className="text-sm text-gray-600">{trainStatus.currentStatus}</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-blue-100">
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="MapPin" className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Next Station</h3>
                <p className="text-sm text-gray-600">{trainStatus.nextStation}</p>
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-blue-100">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-3">
                  <ApperIcon name="Navigation" className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Platform</h3>
                <p className="text-sm text-gray-600">Platform {trainStatus.platform}</p>
              </div>
            </div>

            {/* Journey Details */}
            <div className="flex items-center justify-between mb-8 p-6 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-blue-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {trainStatus.departureTime}
                </p>
                <p className="text-gray-600 font-medium">{trainStatus.origin}</p>
                <p className="text-sm text-gray-500">Departure</p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="w-24 h-px bg-gradient-to-r from-primary to-secondary"></div>
                  <ApperIcon name="Train" className="w-6 h-6 text-secondary" />
                  <div className="w-24 h-px bg-gradient-to-r from-secondary to-primary"></div>
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <p className="text-xs text-gray-500 mt-2 font-medium">{trainStatus.duration}</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {trainStatus.arrivalTime}
                </p>
                <p className="text-gray-600 font-medium">{trainStatus.destination}</p>
                <p className="text-sm text-gray-500">Arrival</p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Last Updated</h4>
                  <p className="text-sm text-blue-700">
                    {new Date(trainStatus.lastUpdated).toLocaleString()}
                  </p>
                </div>
                <Button
                  onClick={() => handleSearch({ preventDefault: () => {} })}
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>

            {/* Search Again */}
            <div className="text-center mt-8">
              <Button
                onClick={() => {
                  setTrainNumber("");
                  setTrainStatus(null);
                  setSearchAttempted(false);
                  setError("");
                }}
                variant="primary"
              >
                <ApperIcon name="Search" className="w-5 h-5 mr-2" />
                Check Another Train
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Information Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mt-8">
        <div className="flex items-start">
          <ApperIcon name="Info" className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">About Train Status</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Status information is updated in real-time from railway systems</li>
              <li>• Delays are common during peak hours and weather conditions</li>
              <li>• Platform information may change, please verify at the station</li>
              <li>• For urgent queries, contact railway helpline: 139</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainStatus;
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import TrainCard from "@/components/molecules/TrainCard";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import trainService from "@/services/api/trainService";
import stationService from "@/services/api/stationService";
import { toast } from "react-toastify";

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [trains, setTrains] = useState([]);
  const [filteredTrains, setFilteredTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [filters, setFilters] = useState({
    class: "",
    departureTime: "",
    duration: "",
    availability: ""
  });

  const [sortBy, setSortBy] = useState("departure");
  const [searchCriteria, setSearchCriteria] = useState({});
  const [stationNames, setStationNames] = useState({});

  useEffect(() => {
    const params = {
      origin: searchParams.get("origin") || "",
      destination: searchParams.get("destination") || "",
      journeyDate: searchParams.get("journeyDate") || "",
      travelClass: searchParams.get("travelClass") || "",
      passengers: parseInt(searchParams.get("passengers")) || 1
    };
    
    setSearchCriteria(params);
    if (params.origin && params.destination) {
      loadTrains(params);
      loadStationNames(params.origin, params.destination);
    }
  }, [searchParams]);

  const loadStationNames = async (origin, destination) => {
    try {
      const [originStation, destStation] = await Promise.all([
        stationService.getByCode(origin),
        stationService.getByCode(destination)
      ]);
      
      setStationNames({
        origin: originStation?.name || origin,
        destination: destStation?.name || destination
      });
    } catch (err) {
      console.error("Error loading station names:", err);
      setStationNames({
        origin: origin,
        destination: destination
      });
    }
  };

  const loadTrains = async (searchData) => {
    setLoading(true);
    setError("");
    
    try {
      const results = await trainService.searchTrains(searchData);
      setTrains(results);
      setFilteredTrains(results);
    } catch (err) {
      console.error("Error searching trains:", err);
      setError("Failed to search trains. Please try again.");
      toast.error("Failed to search trains");
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSort = () => {
    let filtered = [...trains];

    // Apply filters
    if (filters.class) {
      filtered = filtered.filter(train => train.classes.includes(filters.class));
    }

    if (filters.departureTime) {
      filtered = filtered.filter(train => {
        const hour = parseInt(train.departureTime.split(':')[0]);
        switch (filters.departureTime) {
          case 'morning':
            return hour >= 6 && hour < 12;
          case 'afternoon':
            return hour >= 12 && hour < 17;
          case 'evening':
            return hour >= 17 && hour < 21;
          case 'night':
            return hour >= 21 || hour < 6;
          default:
            return true;
        }
      });
    }

    if (filters.duration) {
      filtered = filtered.filter(train => {
        const duration = parseDuration(train.duration);
        switch (filters.duration) {
          case 'short':
            return duration <= 6;
          case 'medium':
            return duration > 6 && duration <= 12;
          case 'long':
            return duration > 12;
          default:
            return true;
        }
      });
    }

    if (filters.availability) {
      filtered = filtered.filter(train => {
        const totalSeats = Object.values(train.availableSeats).reduce((sum, count) => sum + count, 0);
        switch (filters.availability) {
          case 'high':
            return totalSeats > 50;
          case 'medium':
            return totalSeats >= 20 && totalSeats <= 50;
          case 'low':
            return totalSeats > 0 && totalSeats < 20;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'departure':
          return a.departureTime.localeCompare(b.departureTime);
        case 'arrival':
          return a.arrivalTime.localeCompare(b.arrivalTime);
        case 'duration':
          return parseDuration(a.duration) - parseDuration(b.duration);
        case 'availability':
          const aSeats = Object.values(a.availableSeats).reduce((sum, count) => sum + count, 0);
          const bSeats = Object.values(b.availableSeats).reduce((sum, count) => sum + count, 0);
          return bSeats - aSeats;
        default:
          return 0;
      }
    });

    setFilteredTrains(filtered);
  };

  const parseDuration = (duration) => {
    const match = duration.match(/(\d+)h\s*(\d+)?m?/);
    if (!match) return 0;
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    return hours + minutes / 60;
  };

  useEffect(() => {
    applyFiltersAndSort();
  }, [filters, sortBy, trains]);

  const handleBookNow = (train) => {
    const params = new URLSearchParams({
      trainId: train.Id,
      ...searchCriteria
    });
    navigate(`/seat-selection?${params.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      class: "",
      departureTime: "",
      duration: "",
      availability: ""
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Searching Trains...</h1>
        </div>
        <Loading type="search" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorView 
          type="search"
          message={error}
          onRetry={() => loadTrains(searchCriteria)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Summary */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {stationNames.origin} → {stationNames.destination}
            </h1>
            <p className="text-gray-600 mb-4 md:mb-0">
              {searchCriteria.journeyDate} • {searchCriteria.passengers} passenger{searchCriteria.passengers > 1 ? 's' : ''}
              {searchCriteria.travelClass && ` • ${searchCriteria.travelClass} Class`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="success" className="px-3 py-1">
              {filteredTrains.length} trains found
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/")}
            >
              <ApperIcon name="Search" className="w-4 h-4 mr-2" />
              New Search
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              {(filters.class || filters.departureTime || filters.duration || filters.availability) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Travel Class
                </label>
                <Select
                  value={filters.class}
                  onChange={(e) => setFilters(prev => ({ ...prev, class: e.target.value }))}
                >
                  <option value="">All Classes</option>
                  <option value="1A">First AC (1A)</option>
                  <option value="2A">Second AC (2A)</option>
                  <option value="3A">Third AC (3A)</option>
                  <option value="SL">Sleeper (SL)</option>
                  <option value="CC">Chair Car (CC)</option>
                  <option value="EC">Executive Chair (EC)</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departure Time
                </label>
                <Select
                  value={filters.departureTime}
                  onChange={(e) => setFilters(prev => ({ ...prev, departureTime: e.target.value }))}
                >
                  <option value="">Any Time</option>
                  <option value="morning">Morning (6 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                  <option value="evening">Evening (5 PM - 9 PM)</option>
                  <option value="night">Night (9 PM - 6 AM)</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Journey Duration
                </label>
                <Select
                  value={filters.duration}
                  onChange={(e) => setFilters(prev => ({ ...prev, duration: e.target.value }))}
                >
                  <option value="">Any Duration</option>
                  <option value="short">Short (Up to 6 hours)</option>
                  <option value="medium">Medium (6-12 hours)</option>
                  <option value="long">Long (12+ hours)</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seat Availability
                </label>
                <Select
                  value={filters.availability}
                  onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
                >
                  <option value="">All Trains</option>
                  <option value="high">High (50+ seats)</option>
                  <option value="medium">Medium (20-50 seats)</option>
                  <option value="low">Low (1-20 seats)</option>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          {/* Sort Options */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredTrains.length} of {trains.length} trains
              </p>
              <div className="flex items-center space-x-3">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-48"
                >
                  <option value="departure">Departure Time</option>
                  <option value="arrival">Arrival Time</option>
                  <option value="duration">Journey Duration</option>
                  <option value="availability">Seat Availability</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Train List */}
          {filteredTrains.length === 0 ? (
            <Empty 
              type="search" 
              onAction={() => navigate("/")}
              actionLabel="Search Again"
            />
          ) : (
            <div className="space-y-4">
              {filteredTrains.map((train) => (
                <TrainCard
                  key={train.Id}
                  train={train}
                  onBookNow={handleBookNow}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
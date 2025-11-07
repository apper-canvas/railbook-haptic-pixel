import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import stationService from "@/services/api/stationService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const SearchForm = ({ initialData, onSearch }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    origin: initialData?.origin || "",
    destination: initialData?.destination || "",
    journeyDate: initialData?.journeyDate || format(new Date(), "yyyy-MM-dd"),
    travelClass: initialData?.travelClass || "",
    passengers: initialData?.passengers || 1
  });

  const [stationSuggestions, setStationSuggestions] = useState([]);
  const [activeField, setActiveField] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const travelClasses = [
    { value: "", label: "All Classes" },
    { value: "1A", label: "First AC (1A)" },
    { value: "2A", label: "Second AC (2A)" },
    { value: "3A", label: "Third AC (3A)" },
    { value: "SL", label: "Sleeper (SL)" },
    { value: "CC", label: "Chair Car (CC)" },
    { value: "EC", label: "Executive Chair (EC)" }
  ];

  const handleStationSearch = async (query, field) => {
    if (query.length < 2) {
      setStationSuggestions([]);
      return;
    }

    try {
      const suggestions = await stationService.search(query);
      setStationSuggestions(suggestions);
      setActiveField(field);
    } catch (error) {
      console.error("Error searching stations:", error);
      setStationSuggestions([]);
    }
  };

  const handleStationSelect = (station, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: station.code
    }));
    setStationSuggestions([]);
    setActiveField(null);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.origin) {
      newErrors.origin = "Please select origin station";
    }
    if (!formData.destination) {
      newErrors.destination = "Please select destination station";
    }
    if (formData.origin === formData.destination) {
      newErrors.destination = "Origin and destination cannot be same";
    }
    if (!formData.journeyDate) {
      newErrors.journeyDate = "Please select journey date";
    } else {
      const selectedDate = new Date(formData.journeyDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.journeyDate = "Journey date cannot be in the past";
      }
    }
    if (formData.passengers < 1 || formData.passengers > 6) {
      newErrors.passengers = "Passengers must be between 1 and 6";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setIsLoading(true);
    
    try {
      // If onSearch is provided (for embedded use), call it
      if (onSearch) {
        await onSearch(formData);
      } else {
        // Navigate to search results page with query params
        const searchParams = new URLSearchParams(formData).toString();
        navigate(`/search?${searchParams}`);
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to search trains. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const swapStations = () => {
    setFormData(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mr-3">
          <ApperIcon name="Search" className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Search Trains
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <FormField
              label="From"
              icon="MapPin"
              required
              error={errors.origin}
            >
              <SearchBar
                placeholder="Enter origin station..."
                value={formData.origin}
                onChange={(value) => {
                  setFormData(prev => ({ ...prev, origin: value }));
                  handleStationSearch(value, "origin");
                }}
                suggestions={activeField === "origin" ? stationSuggestions : []}
                onSuggestionClick={(station) => handleStationSelect(station, "origin")}
              />
            </FormField>
          </div>

          <div className="relative">
            <FormField
              label="To"
              icon="MapPin"
              required
              error={errors.destination}
            >
              <div className="relative">
                <SearchBar
                  placeholder="Enter destination station..."
                  value={formData.destination}
                  onChange={(value) => {
                    setFormData(prev => ({ ...prev, destination: value }));
                    handleStationSearch(value, "destination");
                  }}
                  suggestions={activeField === "destination" ? stationSuggestions : []}
                  onSuggestionClick={(station) => handleStationSelect(station, "destination")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={swapStations}
                  className="absolute -left-8 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hidden md:flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200"
                >
                  <ApperIcon name="ArrowUpDown" className="w-4 h-4 text-primary" />
                </Button>
              </div>
            </FormField>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Journey Date"
            icon="Calendar"
            required
            error={errors.journeyDate}
          >
            <Input
              type="date"
              value={formData.journeyDate}
              onChange={(e) => setFormData(prev => ({ ...prev, journeyDate: e.target.value }))}
              min={format(new Date(), "yyyy-MM-dd")}
            />
          </FormField>

          <FormField
            label="Class"
            icon="Armchair"
          >
            <Select
              value={formData.travelClass}
              onChange={(e) => setFormData(prev => ({ ...prev, travelClass: e.target.value }))}
            >
              {travelClasses.map(cls => (
                <option key={cls.value} value={cls.value}>
                  {cls.label}
                </option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Passengers"
            icon="Users"
            required
            error={errors.passengers}
          >
            <Select
              value={formData.passengers}
              onChange={(e) => setFormData(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} Passenger{num > 1 ? 's' : ''}
                </option>
              ))}
            </Select>
          </FormField>
        </div>

        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            disabled={isLoading}
            className="px-12"
          >
            {isLoading ? (
              <ApperIcon name="Loader2" className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <ApperIcon name="Search" className="w-5 h-5 mr-2" />
            )}
            {isLoading ? "Searching..." : "Search Trains"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
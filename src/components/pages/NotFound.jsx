import React from "react";
import { Link } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  return (
    <div className="min-h-[600px] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-md mx-auto">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
          <ApperIcon name="MapPin" className="w-12 h-12 text-gray-400" />
        </div>
        
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Route Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you're looking for seems to have taken a different route. 
          Let's get you back on track to your destination.
        </p>
        
        <div className="space-y-4">
          <Link to="/">
            <Button variant="secondary" size="lg" className="w-full">
              <ApperIcon name="Home" className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <Link to="/my-bookings">
            <Button variant="outline" size="lg" className="w-full">
              <ApperIcon name="Ticket" className="w-5 h-5 mr-2" />
              My Bookings
            </Button>
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Popular destinations:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link 
              to="/" 
              className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-primary px-3 py-1 rounded-full border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
            >
              Search Trains
            </Link>
            <Link 
              to="/train-status" 
              className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 text-primary px-3 py-1 rounded-full border border-blue-200 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200"
            >
              Train Status
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
import React from "react";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ message, onRetry, type = "general" }) => {
  const getErrorContent = () => {
    switch (type) {
      case "search":
        return {
          icon: "Search",
          title: "Search Failed",
          description: message || "Unable to search trains. Please check your connection and try again.",
        };
      case "booking":
        return {
          icon: "AlertTriangle",
          title: "Booking Error",
          description: message || "We couldn't complete your booking. Please try again.",
        };
      case "network":
        return {
          icon: "Wifi",
          title: "Connection Error",
          description: message || "Please check your internet connection and try again.",
        };
      default:
        return {
          icon: "AlertCircle",
          title: "Something went wrong",
          description: message || "An unexpected error occurred. Please try again.",
        };
    }
  };

  const { icon, title, description } = getErrorContent();

  return (
    <div className="min-h-[300px] flex items-center justify-center p-8">
      <div className="text-center max-w-md mx-auto">
        <div className="w-16 h-16 bg-gradient-to-br from-red-50 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name={icon} className="w-8 h-8 text-red-500" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-blue-700 text-white font-medium rounded-lg hover:from-blue-800 hover:to-blue-900 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="RotateCcw" className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}
        
        <div className="mt-6 text-sm text-gray-500">
          If the problem persists, please contact our support team.
        </div>
      </div>
    </div>
  );
};

export default ErrorView;
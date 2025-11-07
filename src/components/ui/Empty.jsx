import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ type = "general", onAction, actionLabel = "Get Started" }) => {
  const getEmptyContent = () => {
    switch (type) {
      case "search":
        return {
          icon: "Search",
          title: "No trains found",
          description: "We couldn't find any trains for your search criteria. Try adjusting your route or travel date.",
          suggestions: [
            "Check if station names are spelled correctly",
            "Try searching for alternate dates",
            "Consider nearby stations"
          ]
        };
      case "bookings":
        return {
          icon: "Ticket",
          title: "No bookings yet",
          description: "You haven't made any train bookings yet. Start planning your journey!",
          suggestions: [
            "Search for trains on popular routes",
            "Book tickets in advance for better prices",
            "Check train schedules and availability"
          ]
        };
      case "seats":
        return {
          icon: "Armchair",
          title: "No seats available",
          description: "All seats in this class are currently occupied. Try selecting a different class or date.",
          suggestions: [
            "Check other available classes",
            "Try different travel dates",
            "Consider waitlist booking"
          ]
        };
      default:
        return {
          icon: "FileText",
          title: "Nothing here yet",
          description: "There's no data to display right now.",
          suggestions: []
        };
    }
  };

  const { icon, title, description, suggestions } = getEmptyContent();

  return (
    <div className="min-h-[400px] flex items-center justify-center p-8">
      <div className="text-center max-w-lg mx-auto">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-50 to-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <ApperIcon name={icon} className="w-12 h-12 text-gray-400" />
        </div>
        
        <h3 className="text-2xl font-semibold text-gray-900 mb-4">
          {title}
        </h3>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>
        
        {suggestions.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Suggestions:</h4>
            <ul className="text-sm text-gray-700 space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <ApperIcon name="Check" className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  {suggestion}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-secondary to-accent text-white font-semibold rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default Empty;
import React from "react";

const Loading = ({ type = "default" }) => {
  if (type === "search") {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48"></div>
              </div>
              <div className="h-8 bg-gradient-to-r from-secondary/20 to-accent/20 rounded w-24"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex space-x-8">
                <div className="text-center">
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 mb-1"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                </div>
                <div className="text-center">
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16 mb-1"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                </div>
                <div className="text-center">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12 mb-1"></div>
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                </div>
              </div>
              <div className="h-10 bg-gradient-to-r from-primary/20 to-secondary/20 rounded w-32"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "seats") {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 mb-4"></div>
          <div className="grid grid-cols-8 gap-2">
            {[...Array(32)].map((_, i) => (
              <div key={i} className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "bookings") {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48"></div>
              </div>
              <div className="h-6 bg-gradient-to-r from-success/20 to-success/30 rounded w-20"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
              </div>
              <div className="space-y-1">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-12"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-[200px] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <svg className="animate-spin h-12 w-12 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32 mx-auto animate-pulse"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
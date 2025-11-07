import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchForm from "@/components/organisms/SearchForm";

const Home = () => {
  const navigate = useNavigate();

  const handleRouteClick = (route) => {
    // Parse route string like "Delhi to Mumbai" into origin and destination
    const routeParts = route.route.split(' to ');
    if (routeParts.length === 2) {
      const [origin, destination] = routeParts;
      // Navigate to search results with pre-populated route data
      navigate(`/search-results?from=${encodeURIComponent(origin.trim())}&to=${encodeURIComponent(destination.trim())}`);
    }
  };
  const [recentSearches] = useState([
    { origin: "NDLS", destination: "BCT", route: "Delhi → Mumbai" },
    { origin: "BCT", destination: "MAS", route: "Mumbai → Chennai" },
    { origin: "NDLS", destination: "HWH", route: "Delhi → Kolkata" }
  ]);

  const [popularRoutes] = useState([
    { origin: "NDLS", destination: "BCT", route: "Delhi → Mumbai", trains: 15 },
    { origin: "NDLS", destination: "HWH", route: "Delhi → Kolkata", trains: 12 },
    { origin: "BCT", destination: "BLR", route: "Mumbai → Bangalore", trains: 8 },
    { origin: "NDLS", destination: "MAS", route: "Delhi → Chennai", trains: 10 },
    { origin: "HWH", destination: "NDLS", route: "Kolkata → Delhi", trains: 11 },
    { origin: "MAS", destination: "BCT", route: "Chennai → Mumbai", trains: 9 }
  ]);

  const features = [
    {
      icon: "Search",
      title: "Easy Search",
      description: "Find trains with real-time availability across all classes"
    },
    {
      icon: "Ticket",
      title: "Quick Booking",
      description: "Book tickets in just a few clicks with instant confirmation"
    },
    {
      icon: "Shield",
      title: "Secure Payment",
      description: "Safe and secure payment gateway with multiple options"
    },
    {
      icon: "Clock",
      title: "Live Status",
      description: "Track your train status and get real-time updates"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Book Railway Tickets
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Experience seamless train booking with real-time availability, instant confirmation, 
          and convenient seat selection across all major routes in India.
        </p>
        
        <div className="flex items-center justify-center space-x-8 mb-8">
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              50M+
            </div>
            <p className="text-sm text-gray-600">Happy Travelers</p>
          </div>
          <div className="w-px h-12 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              10,000+
            </div>
            <p className="text-sm text-gray-600">Daily Bookings</p>
          </div>
          <div className="w-px h-12 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              99.9%
            </div>
            <p className="text-sm text-gray-600">Uptime</p>
          </div>
        </div>
      </div>

      {/* Search Form */}
      <div className="mb-12">
        <SearchForm />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
            <ApperIcon name="Clock" className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Train Status</h3>
          <p className="text-gray-600 mb-4">Check live running status of your train</p>
          <Link to="/train-status">
            <Button variant="outline" size="sm" className="w-full">
              Check Status
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
          <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mb-4">
            <ApperIcon name="Ticket" className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">My Bookings</h3>
          <p className="text-gray-600 mb-4">View and manage your train bookings</p>
          <Link to="/my-bookings">
            <Button variant="outline" size="sm" className="w-full">
              View Bookings
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-4">
            <ApperIcon name="Phone" className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Support</h3>
          <p className="text-gray-600 mb-4">Get help with your booking queries</p>
<Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => {
              window.open('mailto:support@railbook.com?subject=RailBook Customer Support - Booking Assistance', '_self');
              toast.info('Opening email client for customer support contact');
            }}
          >
            Contact Us
          </Button>
        </div>
      </div>

      {/* Popular Routes */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-12">
        <div className="flex items-center mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mr-3">
            <ApperIcon name="TrendingUp" className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Popular Routes</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
{popularRoutes.map((route, index) => (
            <div 
              key={index}
              className="p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group"
              onClick={() => handleRouteClick(route)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                    {route.route}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {route.trains} trains available
                  </p>
                </div>
                <ApperIcon name="ArrowRight" className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Choose RailBook?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the most convenient way to book train tickets with our modern platform 
            designed for travelers across India.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-200">
                <ApperIcon name={feature.icon} className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mt-12">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mr-3">
              <ApperIcon name="History" className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Recent Searches</h2>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {recentSearches.map((search, index) => (
              <Badge 
                key={index}
                variant="primary" 
                className="px-4 py-2 text-sm cursor-pointer hover:from-primary/20 hover:to-secondary/20 transition-all duration-200"
              >
                {search.route}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
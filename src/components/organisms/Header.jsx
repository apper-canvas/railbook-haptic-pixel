import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", path: "/", icon: "Home" },
    { name: "My Bookings", path: "/my-bookings", icon: "Ticket" },
    { name: "Train Status", path: "/train-status", icon: "Clock" }
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
              <ApperIcon name="Train" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                RailBook
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">Railway Reservations</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive(item.path)
                    ? "text-primary bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm"
                    : "text-gray-600 hover:text-primary hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
                )}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(item.path)
                      ? "text-primary bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm"
                      : "text-gray-600 hover:text-primary hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ className, variant = "primary", size = "default", children, ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-blue-700 text-white hover:from-blue-800 hover:to-blue-900 focus:ring-primary shadow-md hover:shadow-lg transform hover:scale-105",
    secondary: "bg-gradient-to-r from-secondary to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:ring-secondary shadow-md hover:shadow-lg transform hover:scale-105",
    outline: "border-2 border-primary text-primary bg-white hover:bg-primary hover:text-white focus:ring-primary",
    ghost: "text-gray-600 bg-transparent hover:bg-gray-50 hover:text-gray-900 focus:ring-gray-300",
    success: "bg-gradient-to-r from-success to-green-600 text-white hover:from-green-600 hover:to-green-700 focus:ring-success shadow-md hover:shadow-lg transform hover:scale-105",
    warning: "bg-gradient-to-r from-warning to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700 focus:ring-warning shadow-md hover:shadow-lg transform hover:scale-105",
    error: "bg-gradient-to-r from-error to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-error shadow-md hover:shadow-lg transform hover:scale-105"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
    xl: "px-10 py-5 text-lg"
  };

  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
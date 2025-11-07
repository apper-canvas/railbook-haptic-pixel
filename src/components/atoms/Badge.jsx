import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    primary: "bg-gradient-to-r from-primary/10 to-blue-100 text-primary border-primary/20",
    secondary: "bg-gradient-to-r from-secondary/10 to-orange-100 text-secondary border-secondary/20",
    success: "bg-gradient-to-r from-success/10 to-green-100 text-success border-success/20",
    warning: "bg-gradient-to-r from-warning/10 to-yellow-100 text-warning border-warning/20",
    error: "bg-gradient-to-r from-error/10 to-red-100 text-error border-error/20",
    confirmed: "bg-gradient-to-r from-success/10 to-green-100 text-green-700 border-green-200",
    waitlisted: "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border-yellow-200",
    cancelled: "bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200",
    completed: "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Badge.displayName = "Badge";

export default Badge;
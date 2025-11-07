import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const FormField = ({ 
  label, 
  type = "text", 
  error, 
  required = false, 
  className, 
  children,
  icon,
  ...props 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="flex items-center">
          {icon && <ApperIcon name={icon} className="w-4 h-4 mr-2 text-gray-500" />}
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </Label>
      )}
      
      {children || (
        <Input
          type={type}
          className={cn(
            error && "border-error focus:border-error focus:ring-error/20"
          )}
          {...props}
        />
      )}
      
      {error && (
        <p className="text-sm text-error flex items-center mt-1">
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
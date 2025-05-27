"use client";

import React, { useRef, useState, useEffect } from "react";
import Select, { MultiValue, StylesConfig, components } from "react-select";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface Option {
  label: string;
  value: string;
}

interface ReactSelectMultiProps {
  options: Option[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  isDisabled?: boolean;
  maxDisplayValues?: number;
  width?: string;
}

// Custom dropdown indicator to match the rest of the UI
const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </components.DropdownIndicator>
  );
};

export function ReactSelectMulti({
  options,
  values,
  onChange,
  placeholder = "Select options",
  className,
  isDisabled = false,
  maxDisplayValues = 2,
  width = "100%",
}: ReactSelectMultiProps) {
  // Convert string values to Option objects for react-select
  const selectedValues = options.filter((option) =>
    values.includes(option.value)
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const [effectiveMaxDisplayValues, setEffectiveMaxDisplayValues] =
    useState(maxDisplayValues);

  // Use ResizeObserver to dynamically adjust max display values based on width
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const containerWidth = entries[0].contentRect.width;
      // Adjust threshold as needed based on testing
      if (containerWidth < 300) {
        setEffectiveMaxDisplayValues(1);
      } else {
        setEffectiveMaxDisplayValues(maxDisplayValues);
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [maxDisplayValues]);

  // Create a custom MultiValue component that uses the effectiveMaxDisplayValues
  const MultiValue = (props: any) => {
    const { data, index } = props;
    const allValues = props.selectProps.value || [];

    // Only show the first effectiveMaxDisplayValues values
    if (index >= effectiveMaxDisplayValues) {
      // For the last visible item, show a +X more indicator
      if (index === effectiveMaxDisplayValues) {
        const remaining = allValues.length - effectiveMaxDisplayValues;
        return (
          <div className="bg-[#e6f0ff] text-[#0052CC] px-2 py-0.5 m-1 rounded text-xs flex items-center font-medium">
            +{remaining} more
          </div>
        );
      }
      return null; // Hide other items
    }

    // Regular display for items within the effectiveMaxDisplayValues limit
    return <components.MultiValue {...props} />;
  };

  // Custom styles for react-select
  const customStyles: StylesConfig<Option, true> = {
    control: (base, state) => ({
      ...base,
      minHeight: "2rem",
      height: "2rem",
      backgroundColor: "white",
      borderColor: state.isFocused ? "#2563eb" : "#e2e8f0",
      borderRadius: "0.375rem", // Matches Shadcn rounded-md
      boxShadow: state.isFocused ? "0 0 0 2px rgba(37, 99, 235, 0.2)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#2563eb" : "#cbd5e1",
      },
      cursor: isDisabled ? "not-allowed" : "pointer",
      opacity: isDisabled ? 0.7 : 1,
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 8px",
      fontSize: "0.875rem",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#e6f0ff",
      borderRadius: "0.25rem",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#0052CC",
      padding: "0 4px",
      fontSize: "0.75rem",
      fontWeight: 500,
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#0052CC",
      "&:hover": {
        backgroundColor: "#cce0ff",
        color: "#003D99",
      },
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999, // Ensure the menu always appears at the front
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid #e2e8f0",
      position: "absolute",
      width: "auto",
      minWidth: "100%",
      borderRadius: "0.375rem", // Matches Shadcn rounded-md
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base, { isSelected, isFocused }) => ({
      ...base,
      backgroundColor: isSelected
        ? "#2563eb" // Primary blue color
        : isFocused
          ? "#f1f5f9" // Light gray background on hover
          : "white",
      color: isSelected ? "white" : "#1e293b",
      fontSize: "0.875rem",
      padding: "8px 12px",
      cursor: "pointer",
      "&:active": {
        backgroundColor: isSelected ? "#2563eb" : "#e2e8f0",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#6b7280", // Match the Shadcn placeholder color
      fontSize: "0.875rem",
      fontWeight: 400,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "0 4px",
      color: "#64748b", // Match the dropdown indicator color
      "&:hover": {
        color: "#334155",
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: "0 4px",
      color: "#64748b",
      "&:hover": {
        color: "#334155",
      },
    }),
    indicatorSeparator: () => ({
      display: "none", // Hide the separator to match the UI
    }),
  };

  const handleChange = (newValue: MultiValue<Option>) => {
    onChange(newValue.map((option) => option.value));
  };

  return (
    <div className={cn(className)} style={{ width }} ref={containerRef}>
      <Select
        isMulti
        options={options}
        value={selectedValues}
        onChange={handleChange}
        placeholder={placeholder}
        styles={customStyles}
        isDisabled={isDisabled}
        components={{
          DropdownIndicator,
          MultiValue,
        }}
        closeMenuOnSelect={false}
        classNames={{
          control: () => "!min-h-8 h-8 text-sm",
        }}
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : undefined
        }
        menuPosition="fixed"
      />
    </div>
  );
}

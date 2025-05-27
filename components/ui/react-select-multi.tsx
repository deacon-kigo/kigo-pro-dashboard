"use client";

import React from "react";
import Select, { MultiValue, StylesConfig } from "react-select";
import { cn } from "@/lib/utils";

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

const formatOptionLabel = ({ label, value }: Option) => (
  <div className="flex items-center">
    <span>{label}</span>
  </div>
);

export function ReactSelectMulti({
  options,
  values,
  onChange,
  placeholder = "Select options",
  className,
  isDisabled = false,
  maxDisplayValues = 3,
  width = "100%",
}: ReactSelectMultiProps) {
  // Convert string values to Option objects for react-select
  const selectedValues = options.filter((option) =>
    values.includes(option.value)
  );

  // Custom styles for react-select
  const customStyles: StylesConfig<Option, true> = {
    control: (base, state) => ({
      ...base,
      minHeight: "2rem",
      height: "2rem",
      backgroundColor: "white",
      borderColor: state.isFocused ? "#0066CC" : "#e2e8f0",
      boxShadow: state.isFocused ? "0 0 0 1px #0066CC" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#0066CC" : "#cbd5e1",
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
      borderRadius: "4px",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#0052CC",
      padding: "0 4px",
      fontSize: "0.75rem",
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
      zIndex: 50,
    }),
    option: (base, { isSelected, isFocused }) => ({
      ...base,
      backgroundColor: isSelected ? "#0052CC" : isFocused ? "#e6f0ff" : "white",
      color: isSelected ? "white" : "#1e293b",
      fontSize: "0.875rem",
      "&:active": {
        backgroundColor: isSelected ? "#0052CC" : "#cce0ff",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "#94a3b8",
      fontSize: "0.875rem",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "0 4px",
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: "0 4px",
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  // Format the display value to show maxDisplayValues and +X more
  const formatMultiValueDisplay = (selected: MultiValue<Option>) => {
    if (selected.length <= maxDisplayValues) {
      return null; // Let react-select handle the default display
    }

    // Only show the first maxDisplayValues options and a +X indicator
    const visible = selected.slice(0, maxDisplayValues);
    const remaining = selected.length - maxDisplayValues;

    return (
      <div className="flex items-center gap-1">
        {visible.map((option) => (
          <div
            key={option.value}
            className="bg-[#e6f0ff] text-[#0052CC] px-2 py-0.5 rounded text-xs flex items-center"
          >
            {option.label}
          </div>
        ))}
        <div className="bg-[#e6f0ff] text-[#0052CC] px-2 py-0.5 rounded text-xs flex items-center font-medium">
          +{remaining}
        </div>
      </div>
    );
  };

  const handleChange = (newValue: MultiValue<Option>) => {
    onChange(newValue.map((option) => option.value));
  };

  return (
    <div className={cn(className)} style={{ width }}>
      <Select
        isMulti
        options={options}
        value={selectedValues}
        onChange={handleChange}
        placeholder={placeholder}
        styles={customStyles}
        isDisabled={isDisabled}
        formatOptionLabel={formatOptionLabel}
        components={{
          MultiValueContainer: (props) => {
            // If we have more than maxDisplayValues, use our custom display
            if (
              props.selectProps.value &&
              props.selectProps.value.length > maxDisplayValues
            ) {
              // This will only be rendered once for the whole component
              if (props.index === 0) {
                return formatMultiValueDisplay(props.selectProps.value);
              }
              // Don't render other values
              return null;
            }
            // Default behavior for <= maxDisplayValues
            return (
              <div className="flex items-center gap-1">{props.children}</div>
            );
          },
        }}
        classNames={{
          control: () => "!min-h-8 h-8 text-sm",
        }}
      />
    </div>
  );
}

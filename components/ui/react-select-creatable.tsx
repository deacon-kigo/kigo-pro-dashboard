"use client";

import React from "react";
import type { StylesConfig } from "react-select";
import { components } from "react-select";
import * as CreatableModule from "react-select/creatable";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

const Creatable = (CreatableModule as any).default || CreatableModule;

export interface Option {
  label: string;
  value: string;
}

interface ReactSelectCreatableProps {
  options: Option[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
  isDisabled?: boolean;
  formatCreateLabel?: (inputValue: string) => string;
  onCreateOption?: (inputValue: string) => void;
  formatOptionLabel?: (option: Option) => React.ReactNode;
  isValidNewOption?: (inputValue: string) => boolean;
  helperText?: string;
}

// Custom dropdown indicator to match the rest of the UI
const DropdownIndicator = (props: any) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </components.DropdownIndicator>
  );
};

export function ReactSelectCreatable({
  options,
  value,
  onChange,
  placeholder = "Select or create...",
  className,
  isDisabled = false,
  formatCreateLabel = (inputValue: string) => `Create "${inputValue}"`,
  onCreateOption,
  formatOptionLabel,
  isValidNewOption,
  helperText,
}: ReactSelectCreatableProps) {
  // Convert string value to Option object for react-select
  const selectedValue =
    options.find((option) => option.value === value) || null;

  // Custom styles for react-select matching Shadcn UI
  const customStyles: StylesConfig<Option, false> = {
    control: (base, state) => ({
      ...base,
      minHeight: "2.5rem",
      backgroundColor: "white",
      borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--input))",
      borderRadius: "0.375rem",
      boxShadow: state.isFocused ? "0 0 0 2px hsl(var(--ring) / 0.3)" : "none",
      "&:hover": {
        borderColor: state.isFocused ? "hsl(var(--ring))" : "hsl(var(--input))",
      },
      cursor: isDisabled ? "not-allowed" : "pointer",
      opacity: isDisabled ? 0.5 : 1,
      padding: "0",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0.25rem 0.75rem",
      fontSize: "0.875rem",
    }),
    singleValue: (base) => ({
      ...base,
      color: "hsl(var(--foreground))",
      fontSize: "0.875rem",
    }),
    menu: (base) => ({
      ...base,
      zIndex: 9999,
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      border: "1px solid hsl(var(--border))",
      borderRadius: "0.375rem",
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
    option: (base, { isSelected, isFocused }) => ({
      ...base,
      backgroundColor: isSelected
        ? "hsl(var(--primary))"
        : isFocused
          ? "hsl(var(--accent))"
          : "white",
      color: isSelected
        ? "hsl(var(--primary-foreground))"
        : "hsl(var(--foreground))",
      fontSize: "0.875rem",
      padding: "0.5rem 0.75rem",
      cursor: "pointer",
      "&:active": {
        backgroundColor: isSelected
          ? "hsl(var(--primary))"
          : "hsl(var(--accent))",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "hsl(var(--muted-foreground))",
      fontSize: "0.875rem",
      fontWeight: 400,
    }),
    input: (base) => ({
      ...base,
      color: "hsl(var(--foreground))",
      fontSize: "0.875rem",
      margin: 0,
      padding: 0,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "0.5rem",
      color: "hsl(var(--muted-foreground))",
      "&:hover": {
        color: "hsl(var(--foreground))",
      },
    }),
    clearIndicator: (base) => ({
      ...base,
      padding: "0.5rem",
      color: "hsl(var(--muted-foreground))",
      "&:hover": {
        color: "hsl(var(--foreground))",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  const handleChange = (newValue: Option | null) => {
    onChange(newValue ? newValue.value : null);
  };

  const handleCreate = (inputValue: string) => {
    // Transform to uppercase and replace spaces with underscores
    const transformedValue = inputValue.toUpperCase().replace(/\s+/g, "_");

    if (onCreateOption) {
      onCreateOption(transformedValue);
    }

    onChange(transformedValue);
  };

  // Default validation: uppercase, underscores only, 3-60 chars
  const defaultIsValidNewOption = (inputValue: string) => {
    if (!inputValue || inputValue.trim().length < 3) return false;
    if (inputValue.length > 60) return false;

    // Allow only letters, numbers, spaces (will be converted to underscores)
    // and underscores
    const validPattern = /^[A-Za-z0-9_\s]+$/;
    return validPattern.test(inputValue);
  };

  return (
    <div className={cn("w-full", className)}>
      <Creatable
        options={options}
        value={selectedValue}
        onChange={handleChange}
        onCreateOption={handleCreate}
        placeholder={placeholder}
        styles={customStyles}
        isDisabled={isDisabled}
        formatCreateLabel={formatCreateLabel}
        formatOptionLabel={formatOptionLabel}
        isValidNewOption={isValidNewOption || defaultIsValidNewOption}
        components={{
          DropdownIndicator,
        }}
        classNames={{
          control: () => "!min-h-10",
        }}
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : undefined
        }
        menuPosition="fixed"
        isClearable
      />
      {helperText && (
        <p className="text-muted-foreground text-sm mt-1">{helperText}</p>
      )}
    </div>
  );
}

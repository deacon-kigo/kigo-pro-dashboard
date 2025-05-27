"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface MultiSelectComboboxProps {
  options: { label: string; value: string }[];
  values: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  popoverClassName?: string;
  searchPlaceholder?: string;
  maxDisplayItems?: number;
  width?: string;
  disabled?: boolean;
}

export function MultiSelectCombobox({
  options,
  values,
  onChange,
  placeholder = "Select options",
  emptyText = "No options found.",
  className,
  popoverClassName,
  searchPlaceholder = "Search...",
  maxDisplayItems = 2,
  width = "300px",
  disabled = false,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery.trim()) return options;

    const lowerSearchQuery = searchQuery.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(lowerSearchQuery) ||
        option.value.toLowerCase().includes(lowerSearchQuery)
    );
  }, [options, searchQuery]);

  // Find the selected option labels
  const selectedOptions = React.useMemo(() => {
    return options.filter((option) => values.includes(option.value));
  }, [options, values]);

  // Toggle a value in the selection
  const toggleValue = (value: string) => {
    if (values.includes(value)) {
      onChange(values.filter((v) => v !== value));
    } else {
      onChange([...values, value]);
    }
  };

  // Remove a value from selection
  const removeValue = (value: string, e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    onChange(values.filter((v) => v !== value));
  };

  // Clear all selected values
  const clearValues = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange([]);
  };

  // Display values in trigger button
  const displayValues = () => {
    if (selectedOptions.length === 0) {
      return <span className="text-gray-500">{placeholder}</span>;
    }

    if (selectedOptions.length <= maxDisplayItems) {
      return (
        <div className="flex gap-1 flex-wrap items-center max-w-[calc(100%-24px)]">
          {selectedOptions.map((option) => (
            <Badge
              key={option.value}
              variant="outline"
              className="flex items-center gap-1 truncate max-w-[150px] bg-blue-50 text-blue-800 border-blue-200"
            >
              <span className="truncate">{option.label}</span>
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={(e) => removeValue(option.value, e)}
              />
            </Badge>
          ))}
        </div>
      );
    }

    return (
      <div className="flex gap-1 flex-wrap items-center max-w-[calc(100%-24px)]">
        <Badge
          variant="outline"
          className="flex items-center gap-1 truncate max-w-[150px] bg-blue-50 text-blue-800 border-blue-200"
        >
          <span className="truncate">{selectedOptions.length} selected</span>
          <X className="h-3 w-3 cursor-pointer" onClick={clearValues} />
        </Badge>
      </div>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between text-sm font-normal bg-white text-gray-800 h-10 px-3 py-2",
            "border border-gray-200 rounded-md",
            className
          )}
          style={{ width }}
          disabled={disabled}
        >
          <div className="flex flex-1 flex-wrap overflow-hidden">
            {displayValues()}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0 border-gray-300 shadow-md", popoverClassName)}
        align="start"
        style={{ width }}
        sideOffset={5}
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9 text-gray-800 font-normal"
            disabled={disabled}
          />
          <CommandList>
            <CommandEmpty className="py-3 text-gray-600">
              {emptyText}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => {
                const isSelected = values.includes(option.value);
                return (
                  <div key={option.value} className="cursor-pointer">
                    <CommandItem
                      value={option.value}
                      onSelect={() => toggleValue(option.value)}
                      className="hover:bg-gray-100 text-gray-800 p-2"
                      disabled={disabled}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <Checkbox
                          checked={isSelected}
                          id={`option-${option.value}`}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          onCheckedChange={() => toggleValue(option.value)}
                          disabled={disabled}
                        />
                        <label
                          htmlFor={`option-${option.value}`}
                          className={cn(
                            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full",
                            disabled && "opacity-70 cursor-not-allowed"
                          )}
                        >
                          {option.label}
                        </label>
                      </div>
                    </CommandItem>
                  </div>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

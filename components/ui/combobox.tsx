"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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

interface ComboboxProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  popoverClassName?: string;
  searchPlaceholder?: string;
  searchFirst?: boolean;
  maxDisplayItems?: number; // Limit the number of items displayed
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  emptyText = "No options found.",
  className,
  popoverClassName,
  searchPlaceholder = "Search...",
  searchFirst = false,
  maxDisplayItems,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [triggerWidth, setTriggerWidth] = React.useState<number>(0);

  // Update trigger width when opened
  React.useEffect(() => {
    if (open && triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth);
    }
  }, [open]);

  // For searchFirst mode, only open when there's a search query
  React.useEffect(() => {
    if (searchFirst) {
      if (searchQuery.trim().length > 0) {
        setOpen(true);
      } else {
        setOpen(false);
      }
    }
  }, [searchQuery, searchFirst]);

  // Filter options based on search query and limit display
  const { filteredOptions, hasMoreItems, totalCount } = React.useMemo(() => {
    let result = options;

    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      const lowerSearchQuery = searchQuery.toLowerCase();
      result = options.filter(
        (option) =>
          option.label.toLowerCase().includes(lowerSearchQuery) ||
          option.value.toLowerCase().includes(lowerSearchQuery)
      );
    }

    const totalCount = result.length;
    let hasMoreItems = false;

    // Apply display limit if specified
    if (maxDisplayItems && result.length > maxDisplayItems) {
      result = result.slice(0, maxDisplayItems);
      hasMoreItems = true;
    }

    return {
      filteredOptions: result,
      hasMoreItems,
      totalCount,
    };
  }, [options, searchQuery, maxDisplayItems]);

  // Find the selected option label
  const selectedOption = React.useMemo(() => {
    return options.find((option) => option.value === value);
  }, [options, value]);

  // Highlight matching text in options
  const highlightMatch = (text: string) => {
    if (!searchQuery) return text;

    const lowerText = text.toLowerCase();
    const lowerSearchQuery = searchQuery.toLowerCase();
    const index = lowerText.indexOf(lowerSearchQuery);

    if (index === -1) return text;

    return (
      <>
        {text.substring(0, index)}
        <span className="bg-amber-200 text-black font-medium">
          {text.substring(index, index + searchQuery.length)}
        </span>
        {text.substring(index + searchQuery.length)}
      </>
    );
  };

  // Handle key down events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!searchFirst && !open && (e.key === "ArrowDown" || e.key === "Enter")) {
      e.preventDefault();
      setOpen(true);
    }
  };

  // Handle selection directly
  const handleSelect = (optionValue: string) => {
    const option = options.find((opt) => opt.value === optionValue);
    if (option) {
      onChange(option.value);
      setOpen(false);
      if (searchFirst) {
        setSearchQuery(""); // Clear search in searchFirst mode
      } else {
        setSearchQuery("");
      }
    }
  };

  // Handle trigger click - different behavior for searchFirst mode
  const handleTriggerClick = () => {
    if (searchFirst) {
      // In searchFirst mode, focus the hidden input to allow typing
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } else {
      // Original behavior - open dropdown immediately
      setOpen(true);
    }
  };

  // Handle input change for searchFirst mode
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle input focus for searchFirst mode
  const handleInputFocus = () => {
    if (searchFirst && searchQuery.trim().length > 0) {
      setOpen(true);
    }
  };

  // Handle input blur for searchFirst mode
  const handleInputBlur = (e: React.FocusEvent) => {
    if (searchFirst) {
      // Check if the focus is moving to the popover content
      const relatedTarget = e.relatedTarget as HTMLElement;
      if (
        relatedTarget &&
        relatedTarget.closest("[data-radix-popover-content]")
      ) {
        return; // Don't close if focus is moving to popover content
      }
      // Delay closing to allow for selection
      setTimeout(() => {
        setOpen(false);
      }, 200);
    }
  };

  if (searchFirst) {
    return (
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={selectedOption ? selectedOption.label : placeholder}
          className={cn(
            "w-full px-3 py-2 pr-8 text-sm border border-gray-300 rounded-md bg-white",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none",
            "placeholder:text-text-muted text-text-dark",
            className
          )}
        />
        <ChevronsUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 shrink-0 opacity-50 pointer-events-none" />

        {open && (
          <div
            className={cn(
              "absolute z-50 mt-1 w-full p-0 border border-gray-300 rounded-md bg-white shadow-md",
              popoverClassName
            )}
            onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking in dropdown
          >
            <Command
              shouldFilter={false}
              value={value}
              onValueChange={handleSelect}
            >
              <CommandList>
                <CommandEmpty className="py-6 px-4 text-center text-text-muted text-sm">
                  {emptyText}
                </CommandEmpty>
                <CommandGroup>
                  {filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className="cursor-pointer"
                    >
                      <CommandItem
                        value={option.value}
                        onSelect={() => handleSelect(option.value)}
                        className="hover:bg-gray-100 aria-selected:bg-gray-200 aria-selected:text-text-dark text-text-dark"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 text-blue-600",
                            value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {highlightMatch(option.label)}
                      </CommandItem>
                    </div>
                  ))}
                  {hasMoreItems && (
                    <div className="px-3 py-2 text-xs text-text-muted border-t bg-gray-50">
                      Showing {filteredOptions.length} of {totalCount} items
                      {!searchQuery && " • Type to search for more"}
                    </div>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
      </div>
    );
  }

  // Original implementation for backward compatibility
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          onKeyDown={handleKeyDown}
          onClick={handleTriggerClick}
          className={cn(
            "w-full justify-between text-sm font-normal bg-white text-text-dark",
            !value && "text-text-muted",
            className
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0 border-gray-300 shadow-md", popoverClassName)}
        align="start"
        style={{
          width:
            triggerWidth > 0
              ? `${triggerWidth}px`
              : "var(--radix-popover-trigger-width)",
        }}
        sideOffset={5}
      >
        <Command
          shouldFilter={false}
          value={value}
          onValueChange={handleSelect}
        >
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9 text-text-dark font-normal"
            autoFocus
          />
          <CommandList>
            <CommandEmpty className="py-6 px-4 text-center text-text-muted text-sm">
              {emptyText}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className="cursor-pointer"
                >
                  <CommandItem
                    value={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className="hover:bg-gray-100 aria-selected:bg-gray-200 aria-selected:text-text-dark text-text-dark"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-blue-600",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {highlightMatch(option.label)}
                  </CommandItem>
                </div>
              ))}
              {hasMoreItems && (
                <div className="px-3 py-2 text-xs text-text-muted border-t bg-gray-50">
                  Showing {filteredOptions.length} of {totalCount} items
                  {!searchQuery && " • Type to search for more"}
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

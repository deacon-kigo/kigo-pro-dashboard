"use client";

import * as React from "react";
import { createPortal } from "react-dom";
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
  const [dropdownPosition, setDropdownPosition] = React.useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);

  // Track user interaction to prevent auto-selection
  const [userInteracted, setUserInteracted] = React.useState(false);

  // Update trigger width and position when opened
  React.useEffect(() => {
    if (open && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4, // 4px gap
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [open]);

  // For searchFirst mode, only open when there's a search query
  React.useEffect(() => {
    if (searchFirst) {
      if (searchQuery.trim().length > 0) {
        setOpen(true);
        // Reset user interaction when opening dropdown
        setUserInteracted(false);
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

  // Handle selection directly - only allow when user has interacted
  const handleSelect = (optionValue: string) => {
    // Only proceed with selection if user has actually interacted
    if (!userInteracted) {
      return;
    }

    const option = options.find((opt) => opt.value === optionValue);
    if (option) {
      onChange(option.value);
      setOpen(false);
      setSearchQuery(""); // Clear search query to show selected value
      setUserInteracted(false); // Reset interaction flag
    }
  };

  // Handle Command component's onValueChange (which fires on auto-focus)
  const handleCommandValueChange = (optionValue: string) => {
    // This gets called on auto-focus, but we only want to select on user interaction
    // The actual selection happens in handleSelect when user clicks/presses Enter
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
    const newValue = e.target.value;
    setSearchQuery(newValue);

    // If user is typing and we have a selected value, clear it to enable search
    if (
      newValue &&
      value &&
      selectedOption &&
      newValue !== selectedOption.label
    ) {
      onChange("");
    }
  };

  // Handle input focus for searchFirst mode
  const handleInputFocus = () => {
    // If there's a selected value, select all text for easy replacement
    if (selectedOption && !searchQuery && inputRef.current) {
      inputRef.current.select();
    }

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
        setUserInteracted(false); // Reset interaction flag
      }, 200);
    }
  };

  // Handle user clicks on options
  const handleOptionClick = (optionValue: string) => {
    setUserInteracted(true); // Mark that user has interacted
    handleSelect(optionValue);
  };

  // Handle selection for non-searchFirst mode - directly call onChange
  const handleRegularSelect = (optionValue: string) => {
    const option = options.find((opt) => opt.value === optionValue);
    if (option) {
      onChange(option.value);
      setOpen(false);
      setSearchQuery(""); // Clear search query to show selected value
    }
  };

  if (searchFirst) {
    return (
      <>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchQuery || (selectedOption ? selectedOption.label : "")}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pr-8 text-base text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              className
            )}
          />
          <ChevronsUpDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 shrink-0 opacity-50 pointer-events-none" />
        </div>

        {open &&
          dropdownPosition &&
          typeof window !== "undefined" &&
          createPortal(
            <div
              className={cn(
                "fixed z-[9999] p-0 border border-input rounded-md bg-background shadow-lg",
                popoverClassName
              )}
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: dropdownPosition.width,
                maxHeight: "300px",
              }}
              onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking in dropdown
            >
              <Command
                shouldFilter={false}
                value={value}
                onValueChange={handleCommandValueChange}
              >
                <CommandList>
                  <CommandEmpty className="py-6 px-4 text-center text-muted-foreground text-sm">
                    {emptyText}
                  </CommandEmpty>
                  <CommandGroup>
                    {filteredOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => handleOptionClick(option.value)}
                        className="cursor-pointer"
                      >
                        <CommandItem
                          value={option.value}
                          onSelect={() => handleOptionClick(option.value)}
                          className="hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground"
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4 text-primary",
                              value === option.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {highlightMatch(option.label)}
                        </CommandItem>
                      </div>
                    ))}
                    {hasMoreItems && (
                      <div className="px-3 py-2 text-xs text-muted-foreground border-t bg-muted">
                        Showing {filteredOptions.length} of {totalCount} items
                        {!searchQuery && " • Type to search for more"}
                      </div>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </div>,
            document.body
          )}
      </>
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
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-base text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0 border-input shadow-md", popoverClassName)}
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
          onValueChange={handleRegularSelect}
        >
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9 font-normal"
            autoFocus
          />
          <CommandList>
            <CommandEmpty className="py-6 px-4 text-center text-muted-foreground text-sm">
              {emptyText}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleRegularSelect(option.value)}
                  className="cursor-pointer"
                >
                  <CommandItem
                    value={option.value}
                    onSelect={() => handleRegularSelect(option.value)}
                    className="hover:bg-accent hover:text-accent-foreground aria-selected:bg-accent aria-selected:text-accent-foreground"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4 text-primary",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {highlightMatch(option.label)}
                  </CommandItem>
                </div>
              ))}
              {hasMoreItems && (
                <div className="px-3 py-2 text-xs text-muted-foreground border-t bg-muted">
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

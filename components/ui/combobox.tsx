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
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter options based on search query
  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;

    const lowerSearchQuery = searchQuery.toLowerCase();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(lowerSearchQuery) ||
        option.value.toLowerCase().includes(lowerSearchQuery)
    );
  }, [options, searchQuery]);

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

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between text-sm font-normal bg-white text-gray-800",
            !value && "text-gray-600",
            className
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "p-0 min-w-[200px] border-gray-300 shadow-md",
          popoverClassName
        )}
        align="start"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={searchQuery}
            onValueChange={setSearchQuery}
            className="h-9 text-gray-800 font-normal"
            autoFocus
          />
          <CommandList>
            <CommandEmpty className="py-3 text-gray-600">
              {emptyText}
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange(option.value);
                    setOpen(false);
                    setSearchQuery("");
                  }}
                  className="hover:bg-gray-100 aria-selected:bg-gray-200 aria-selected:text-gray-900 text-gray-800"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-blue-600",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {highlightMatch(option.label)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

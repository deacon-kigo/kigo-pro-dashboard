"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/atoms/Label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, X, Filter, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Ad } from "./adColumns";

interface AdvancedFiltersProps {
  ads: Ad[];
  onFiltersChange: (filters: {
    adNames: string[];
    merchants: string[];
    offers: string[];
  }) => void;
  initialFilters?: {
    adNames: string[];
    merchants: string[];
    offers: string[];
  };
}

interface FilterSelectorProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder: string;
}

function FilterSelector({
  label,
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
}: FilterSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search]);

  const handleSelect = useCallback(
    (value: string) => {
      if (selectedValues.includes(value)) {
        onSelectionChange(selectedValues.filter((v) => v !== value));
      } else {
        onSelectionChange([...selectedValues, value]);
      }
    },
    [selectedValues, onSelectionChange]
  );

  const removeSelection = useCallback(
    (value: string) => {
      onSelectionChange(selectedValues.filter((v) => v !== value));
    },
    [selectedValues, onSelectionChange]
  );

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-left font-normal"
          >
            <span className="truncate">
              {selectedValues.length > 0
                ? `${selectedValues.length} selected`
                : placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput
              placeholder={`Search ${label.toLowerCase()}...`}
              value={search}
              onValueChange={setSearch}
            />
            <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
            <CommandGroup className="max-h-48 overflow-y-auto">
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option}
                  onSelect={() => handleSelect(option)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedValues.includes(option)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <span className="truncate">{option}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected Values */}
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {selectedValues.map((value) => (
            <Badge
              key={value}
              variant="secondary"
              className="text-sm px-2 py-1"
            >
              <span className="truncate max-w-[120px]">{value}</span>
              <button
                onClick={() => removeSelection(value)}
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export function AdvancedFilters({
  ads,
  onFiltersChange,
  initialFilters = { adNames: [], merchants: [], offers: [] },
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  // Extract unique options from ads data
  const uniqueOptions = useMemo(() => {
    const adNames = [...new Set(ads.map((ad) => ad.name))].sort();
    const merchants = [...new Set(ads.map((ad) => ad.merchantName))].sort();
    const offers = [...new Set(ads.map((ad) => ad.offerName))].sort();

    return { adNames, merchants, offers };
  }, [ads]);

  const handleFilterChange = useCallback(
    (type: keyof typeof filters, values: string[]) => {
      const newFilters = { ...filters, [type]: values };
      setFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  const clearAllFilters = useCallback(() => {
    const emptyFilters = { adNames: [], merchants: [], offers: [] };
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  }, [onFiltersChange]);

  const hasActiveFilters = Object.values(filters).some((arr) => arr.length > 0);
  const totalActiveFilters = Object.values(filters).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  return (
    <div className="space-y-2">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "flex items-center gap-2",
              hasActiveFilters && "border-blue-500 bg-blue-50"
            )}
          >
            <Filter className="h-4 w-4" />
            Advanced Filters
            {totalActiveFilters > 0 && (
              <Badge variant="secondary" className="text-sm px-1.5 py-0.5">
                {totalActiveFilters}
              </Badge>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96 p-4" align="start">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-base">Filter Ads</h4>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-8 text-sm"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            <FilterSelector
              label="Ad Names"
              options={uniqueOptions.adNames}
              selectedValues={filters.adNames}
              onSelectionChange={(values) =>
                handleFilterChange("adNames", values)
              }
              placeholder="Select ad names..."
            />

            <FilterSelector
              label="Merchants"
              options={uniqueOptions.merchants}
              selectedValues={filters.merchants}
              onSelectionChange={(values) =>
                handleFilterChange("merchants", values)
              }
              placeholder="Select merchants..."
            />

            <FilterSelector
              label="Offers"
              options={uniqueOptions.offers}
              selectedValues={filters.offers}
              onSelectionChange={(values) =>
                handleFilterChange("offers", values)
              }
              placeholder="Select offers..."
            />

            <div className="flex justify-end pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Done
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1">
          {filters.adNames.map((name) => (
            <Badge key={`ad-${name}`} variant="outline" className="text-sm">
              Ad: {name}
              <button
                onClick={() =>
                  handleFilterChange(
                    "adNames",
                    filters.adNames.filter((n) => n !== name)
                  )
                }
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.merchants.map((merchant) => (
            <Badge
              key={`merchant-${merchant}`}
              variant="outline"
              className="text-sm"
            >
              Merchant: {merchant}
              <button
                onClick={() =>
                  handleFilterChange(
                    "merchants",
                    filters.merchants.filter((m) => m !== merchant)
                  )
                }
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {filters.offers.map((offer) => (
            <Badge key={`offer-${offer}`} variant="outline" className="text-sm">
              Offer: {offer}
              <button
                onClick={() =>
                  handleFilterChange(
                    "offers",
                    filters.offers.filter((o) => o !== offer)
                  )
                }
                className="ml-1 hover:text-red-600"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

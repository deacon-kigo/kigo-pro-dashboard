"use client";

import React, {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  memo,
} from "react";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/atoms/Label";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, X, Filter, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Ad } from "./adColumns";

// Utility function to calculate smart positioning within viewport
function calculateSmartPosition(
  buttonRect: DOMRect,
  dropdownWidth: number,
  dropdownHeight: number
) {
  const viewport = {
    width: window.innerWidth,
    height: window.innerHeight,
  };
  const padding = 16;

  // Calculate horizontal position
  let left = buttonRect.left;
  if (left + dropdownWidth > viewport.width - padding) {
    // If dropdown would overflow right, align to right edge of button
    left = buttonRect.right - dropdownWidth;
  }
  if (left < padding) {
    // If dropdown would overflow left, align to left edge with padding
    left = padding;
  }

  // Calculate vertical position
  let top = buttonRect.bottom + 8;
  if (top + dropdownHeight > viewport.height - padding) {
    // If dropdown would overflow bottom, position above button
    top = buttonRect.top - dropdownHeight - 8;
  }
  if (top < padding) {
    // If still overflowing top, position at top with padding
    top = padding;
  }

  return { top, left };
}

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

// Custom Filter Selector Component
const FilterSelector = memo(function FilterSelector({
  label,
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
}: FilterSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  useEffect(() => {
    if (open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = Math.max(rect.width, 320);
      const dropdownHeight = 240; // Approximate height for filter options

      const position = calculateSmartPosition(
        rect,
        dropdownWidth,
        dropdownHeight
      );

      setDropdownPosition({
        top: position.top,
        left: position.left,
        width: dropdownWidth,
      });
    }
  }, [open]);

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

      {/* Custom Dropdown Button */}
      <Button
        ref={buttonRef}
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between text-left font-normal"
        onClick={() => setOpen(!open)}
      >
        <span className="truncate">
          {selectedValues.length > 0
            ? `${selectedValues.length} selected`
            : placeholder}
        </span>
        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      {/* Custom Dropdown Content */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed bg-white rounded-md shadow-lg border z-[9999] p-0"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
            }}
          >
            {/* Search Input */}
            <div className="p-3 border-b">
              <Input
                placeholder={`Search ${label.toLowerCase()}...`}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Options List */}
            <div className="max-h-48 overflow-y-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-gray-500">
                  No {label.toLowerCase()} found.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 flex items-center rounded-sm cursor-pointer"
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
                  </button>
                ))
              )}
            </div>
          </div>
        </>
      )}

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
});

// Custom Advanced Filters Component
export const AdvancedFilters = memo(function AdvancedFilters({
  ads,
  onFiltersChange,
  initialFilters = { adNames: [], merchants: [], offers: [] },
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownWidth = 384; // w-96 = 384px
      const dropdownHeight = 400; // Approximate height for all filter sections

      const position = calculateSmartPosition(
        rect,
        dropdownWidth,
        dropdownHeight
      );

      setDropdownPosition({
        top: position.top,
        left: position.left,
      });
    }
  }, [isOpen]);

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
      {/* Main Filter Button */}
      <Button
        ref={buttonRef}
        variant="outline"
        className={cn(
          "flex items-center gap-1",
          hasActiveFilters && "border-blue-500 bg-blue-50"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter className="h-4 w-4" />
        {totalActiveFilters > 0 && (
          <Badge variant="secondary" className="text-sm px-1.5 py-0.5">
            {totalActiveFilters}
          </Badge>
        )}
        <ChevronDown className="h-4 w-4" />
      </Button>

      {/* Custom Dropdown Content */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />
          <div
            className="fixed w-96 bg-white rounded-md shadow-lg border z-[9999] p-4"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
          >
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
          </div>
        </>
      )}

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
});

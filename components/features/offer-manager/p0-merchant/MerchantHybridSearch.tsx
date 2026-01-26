"use client";

import React, { useState, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MagnifyingGlassIcon,
  MapPinIcon,
  BuildingStorefrontIcon,
  XMarkIcon,
  StarIcon,
  ArrowPathIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

// Available merchant sources (for display labels)
const MERCHANT_SOURCES = [
  { value: "MCM", label: "MCM" },
  { value: "Augeo", label: "Augeo" },
  { value: "CashStar", label: "CashStar" },
  { value: "Blackhawk", label: "Blackhawk" },
  { value: "InComm", label: "InComm" },
  { value: "Other", label: "Other" },
];

// Available merchant categories (for display labels)
const MERCHANT_CATEGORIES = [
  { label: "Food & Dining", value: "dining" },
  { label: "Shopping", value: "shopping" },
  { label: "Travel", value: "travel" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Health & Wellness", value: "health" },
  { label: "Services", value: "services" },
  { label: "Grocery", value: "grocery" },
  { label: "Gas & Auto", value: "gas" },
  { label: "Electronics", value: "electronics" },
  { label: "Fashion", value: "fashion" },
  { label: "Beauty", value: "beauty" },
  { label: "Home & Garden", value: "home" },
  { label: "Sports & Outdoors", value: "sports" },
  { label: "Pets", value: "pets" },
  { label: "Other", value: "other" },
];

// Mock existing merchants (in production, fetch from API)
const EXISTING_MERCHANTS = [
  { id: "M001", name: "Deacon's Pizza", address: "123 Main St, Denver, CO" },
  {
    id: "M002",
    name: "Tony's Italian Restaurant",
    address: "456 Oak Ave, Denver, CO",
  },
  { id: "M003", name: "Burger Haven", address: "789 Elm St, Denver, CO" },
  { id: "M004", name: "Sushi Palace", address: "321 Pine Rd, Denver, CO" },
  {
    id: "M005",
    name: "Coffee Corner Cafe",
    address: "654 Maple Dr, Denver, CO",
  },
];

export interface MerchantData {
  id?: string;
  // Required fields for new merchant creation
  dbaName: string;
  logo?: File | null;
  logoPreview?: string | null;
  categories?: string[]; // Merchant categories (required for new merchants)
  merchantSource?: string; // Where the merchant comes from: MCM, Augeo, etc. (required for new merchants)
  // Optional fields
  bannerImage?: File | null;
  bannerPreview?: string | null;
  corpName?: string; // Corporate name (optional)
  address?: string;
  geolocation?: { lat: number; lng: number } | null;
  url?: string;
  highlights?: string;
  // Legacy/display fields
  phone?: string;
  rating?: number;
  reviewCount?: number;
  category?: string; // Single category for display (from Google)
  // Source tracking
  source: "existing" | "google" | "manual";
  placeId?: string;
}

// Backend API response for place details
interface PlaceDetailsResponse {
  business_status?: string;
  name?: string;
  weekday_text?: string[];
  place_id?: string;
  rating?: number;
  user_ratings_total?: number;
}

interface MerchantHybridSearchProps {
  onMerchantSelect: (merchant: MerchantData) => void;
  onManualEntry: (searchQuery?: string) => void;
  selectedMerchant: MerchantData | null;
  onClearSelection: () => void;
}

export default function MerchantHybridSearch({
  onMerchantSelect,
  onManualEntry,
  selectedMerchant,
  onClearSelection,
}: MerchantHybridSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [existingResults, setExistingResults] = useState<
    typeof EXISTING_MERCHANTS
  >([]);
  const [googleResult, setGoogleResult] = useState<PlaceDetailsResponse | null>(
    null
  );
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Search using backend API
  const searchPlaceDetails = async (
    query: string
  ): Promise<PlaceDetailsResponse | null> => {
    try {
      // Backend API URL - configured via environment variable
      const apiBaseUrl = process.env.NEXT_PUBLIC_KIGO_CORE_SERVER_URL || "";

      if (!apiBaseUrl) {
        // Backend not configured - skip API call
        console.warn(
          "Backend API URL not configured (NEXT_PUBLIC_KIGO_CORE_SERVER_URL)"
        );
        return null;
      }

      const response = await fetch(
        `${apiBaseUrl}/api/v1/utils/place-details?input=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        if (response.status === 404) {
          return null; // No place found
        }
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching place details:", error);
      // Don't show error to user if API just isn't configured
      return null;
    }
  };

  // Search both sources
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setApiError(null);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query.trim()) {
      setExistingResults([]);
      setGoogleResult(null);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    setShowResults(true);

    debounceRef.current = setTimeout(async () => {
      // Search existing merchants
      let existingMatches;

      // Check for id: prefix for exact ID match
      if (query.toLowerCase().startsWith("id:")) {
        const idQuery = query.slice(3).trim().toUpperCase();
        existingMatches = EXISTING_MERCHANTS.filter(
          (m) => m.id.toUpperCase() === idQuery
        );
      } else {
        // Regular name/address search
        existingMatches = EXISTING_MERCHANTS.filter(
          (m) =>
            m.name.toLowerCase().includes(query.toLowerCase()) ||
            m.address.toLowerCase().includes(query.toLowerCase()) ||
            m.id.toLowerCase().includes(query.toLowerCase())
        );
      }
      setExistingResults(existingMatches);

      // Search Google Places via backend API (skip for ID lookups)
      const isIdSearch = query.toLowerCase().startsWith("id:");
      if (!isIdSearch && query.length >= 3) {
        const placeDetails = await searchPlaceDetails(query);
        setGoogleResult(placeDetails);
      } else {
        setGoogleResult(null);
      }

      setIsSearching(false);
    }, 300);
  }, []);

  // Handle selecting an existing merchant
  const handleSelectExisting = (merchant: (typeof EXISTING_MERCHANTS)[0]) => {
    onMerchantSelect({
      id: merchant.id,
      dbaName: merchant.name,
      corpName: merchant.name,
      address: merchant.address,
      geolocation: null,
      url: "",
      source: "existing",
    });
    setShowResults(false);
    setSearchQuery("");
  };

  // Handle selecting a Google result
  const handleSelectGoogle = (place: PlaceDetailsResponse) => {
    setIsLoadingDetails(true);

    // Create merchant data from place details
    const merchantData: MerchantData = {
      dbaName: place.name || "",
      corpName: place.name || "",
      address: "", // Backend doesn't return address in this endpoint
      geolocation: null,
      url: "",
      rating: place.rating,
      reviewCount: place.user_ratings_total,
      source: "google",
      placeId: place.place_id,
    };

    onMerchantSelect(merchantData);
    setShowResults(false);
    setSearchQuery("");
    setIsLoadingDetails(false);
  };

  // If a merchant is selected, show the compact card
  if (selectedMerchant) {
    // Get category labels for display
    const categoryLabels =
      selectedMerchant.categories?.map(
        (cat) => MERCHANT_CATEGORIES.find((c) => c.value === cat)?.label || cat
      ) || [];
    const sourceLabel =
      MERCHANT_SOURCES.find((s) => s.value === selectedMerchant.merchantSource)
        ?.label || selectedMerchant.merchantSource;

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Selected Business</Label>
        <Card className="p-4 border-2 border-green-200 bg-green-50/50">
          <div className="flex items-start gap-4">
            {/* Logo */}
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden border">
              {selectedMerchant.logoPreview ? (
                <img
                  src={selectedMerchant.logoPreview}
                  alt={selectedMerchant.dbaName}
                  className="w-full h-full object-contain"
                />
              ) : (
                <BuildingStorefrontIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>

            {/* Details - Aligned with required schema */}
            <div className="flex-1 min-w-0">
              {/* Row 1: Name + Source Badge */}
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-gray-900 truncate">
                  {selectedMerchant.dbaName}
                </h4>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                    selectedMerchant.source === "existing"
                      ? "bg-green-100 text-green-700"
                      : selectedMerchant.source === "google"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {selectedMerchant.source === "existing"
                    ? "In System"
                    : selectedMerchant.source === "google"
                      ? "Google"
                      : "New"}
                </span>
              </div>

              {/* Row 2: Categories */}
              {categoryLabels.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {categoryLabels.slice(0, 3).map((label) => (
                    <span
                      key={label}
                      className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded"
                    >
                      {label}
                    </span>
                  ))}
                  {categoryLabels.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{categoryLabels.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Row 3: Source + Rating (if available) */}
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                {sourceLabel && <span>Source: {sourceLabel}</span>}
                {selectedMerchant.rating && (
                  <>
                    {sourceLabel && <span className="text-gray-300">•</span>}
                    <span className="flex items-center gap-0.5">
                      <StarIcon className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                      {selectedMerchant.rating}
                    </span>
                  </>
                )}
                {selectedMerchant.address && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="truncate">{selectedMerchant.address}</span>
                  </>
                )}
              </div>
            </div>

            {/* Change button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="flex-shrink-0 text-xs h-8"
            >
              Change
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Render search interface
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">Find your business</Label>

      <div className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search by business name or address..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery && setShowResults(true)}
            className="pl-10 pr-10"
          />
          {isSearching && (
            <ArrowPathIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
          )}
          {searchQuery && !isSearching && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setShowResults(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <XMarkIcon className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-1">
          Search by name, or use id: prefix for exact ID match
          {process.env.NEXT_PUBLIC_KIGO_CORE_SERVER_URL ? (
            <span className="text-green-600"> • Backend API</span>
          ) : (
            <span className="text-amber-600"> • Backend not configured</span>
          )}
        </p>

        {/* Search Results Dropdown */}
        {showResults && searchQuery.length > 0 && (
          <div className="absolute z-50 w-full mt-2 bg-white border rounded-lg shadow-lg max-h-96 overflow-auto">
            {isLoadingDetails && (
              <div className="p-4 text-center">
                <ArrowPathIcon className="w-6 h-6 animate-spin mx-auto text-primary" />
                <p className="text-sm text-gray-500 mt-2">
                  Loading business details...
                </p>
              </div>
            )}

            {!isLoadingDetails && (
              <>
                {/* API Error */}
                {apiError && (
                  <div className="px-3 py-2 bg-red-50 text-red-600 text-sm">
                    {apiError}
                  </div>
                )}

                {/* Existing Merchants */}
                {existingResults.length > 0 && (
                  <div>
                    <div className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      In Our System
                    </div>
                    {existingResults.map((merchant) => (
                      <button
                        key={merchant.id}
                        type="button"
                        onClick={() => handleSelectExisting(merchant)}
                        className="w-full px-3 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b last:border-b-0"
                      >
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <BuildingStorefrontIcon className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {merchant.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {merchant.address}
                          </p>
                        </div>
                        <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                          Ready
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Google Result (single result from backend) */}
                {googleResult && googleResult.name && (
                  <div>
                    <div className="px-3 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
                      From Google
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectGoogle(googleResult)}
                      className="w-full px-3 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b last:border-b-0"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPinIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {googleResult.name}
                        </p>
                        {googleResult.business_status && (
                          <p className="text-sm text-gray-500 truncate">
                            {googleResult.business_status}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-0.5">
                          {googleResult.rating && (
                            <span className="text-xs text-gray-500 flex items-center gap-0.5">
                              <StarIcon className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                              {googleResult.rating}
                              {googleResult.user_ratings_total &&
                                ` (${googleResult.user_ratings_total})`}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* No results */}
                {!isSearching &&
                  existingResults.length === 0 &&
                  !googleResult &&
                  searchQuery.length > 2 && (
                    <div className="p-4 text-center">
                      <p className="text-gray-500">No businesses found</p>
                    </div>
                  )}
              </>
            )}
          </div>
        )}

        {/* Manual entry option - Always visible */}
        <button
          type="button"
          onClick={() => onManualEntry(searchQuery)}
          className="mt-3 w-full py-2 px-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 border border-dashed border-gray-300 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <PencilIcon className="w-4 h-4" />
          Can't find it? Enter details manually
        </button>
      </div>
    </div>
  );
}

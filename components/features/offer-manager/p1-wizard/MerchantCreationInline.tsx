"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  BuildingStorefrontIcon,
  PhotoIcon,
  MapPinIcon,
  GlobeAltIcon,
  SparklesIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

declare global {
  interface Window {
    google: any;
  }
}

export interface MerchantData {
  corpName: string;
  dbaName: string;
  logo: File | null;
  logoPreview: string | null;
  address: string;
  geolocation: { lat: number; lng: number } | null;
  url: string;
  highlights: string;
}

interface MerchantCreationInlineProps {
  onSave: (merchant: MerchantData) => void;
  onCancel: () => void;
  initialData?: Partial<MerchantData>;
}

interface PlacePrediction {
  description: string;
  place_id: string;
}

interface UrlSuggestion {
  title: string;
  url: string;
}

export default function MerchantCreationInline({
  onSave,
  onCancel,
  initialData,
}: MerchantCreationInlineProps) {
  const [formData, setFormData] = useState<MerchantData>({
    corpName: initialData?.corpName || "",
    dbaName: initialData?.dbaName || "",
    logo: initialData?.logo || null,
    logoPreview: initialData?.logoPreview || null,
    address: initialData?.address || "",
    geolocation: initialData?.geolocation || null,
    url: initialData?.url || "",
    highlights: initialData?.highlights || "",
  });

  const [addressSuggestions, setAddressSuggestions] = useState<
    PlacePrediction[]
  >([]);
  const [urlSuggestions, setUrlSuggestions] = useState<UrlSuggestion[]>([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [showUrlSuggestions, setShowUrlSuggestions] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  const addressInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);
  const addressDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const urlDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Load Google Maps script
  useEffect(() => {
    if (window.google?.maps?.places) {
      setGoogleLoaded(true);
      initializeGoogleServices();
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.warn("Google Maps API key not found");
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com"]`
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        setGoogleLoaded(true);
        initializeGoogleServices();
      });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setGoogleLoaded(true);
      initializeGoogleServices();
    };
    document.head.appendChild(script);

    return () => {
      if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current);
      if (urlDebounceRef.current) clearTimeout(urlDebounceRef.current);
    };
  }, []);

  const initializeGoogleServices = () => {
    if (window.google?.maps?.places) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      // Create a dummy div for PlacesService (required but not displayed)
      const dummyDiv = document.createElement("div");
      placesService.current = new window.google.maps.places.PlacesService(
        dummyDiv
      );
    }
  };

  // Validate required fields
  const isValid =
    formData.corpName.trim() && formData.dbaName.trim() && formData.logo;

  // Handle field updates
  const handleUpdate = (field: keyof MerchantData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpdate("logo", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdate("logoPreview", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Google Places autocomplete for address
  const handleAddressChange = (value: string) => {
    handleUpdate("address", value);

    if (addressDebounceRef.current) {
      clearTimeout(addressDebounceRef.current);
    }

    if (!value.trim() || !autocompleteService.current) {
      setAddressSuggestions([]);
      setShowAddressSuggestions(false);
      return;
    }

    setIsLoadingAddress(true);
    addressDebounceRef.current = setTimeout(() => {
      autocompleteService.current.getPlacePredictions(
        {
          input: value,
          types: ["establishment", "geocode"],
          componentRestrictions: { country: "us" },
        },
        (predictions: PlacePrediction[] | null, status: string) => {
          setIsLoadingAddress(false);
          if (status === "OK" && predictions) {
            setAddressSuggestions(predictions.slice(0, 5));
            setShowAddressSuggestions(true);
          } else {
            setAddressSuggestions([]);
            setShowAddressSuggestions(false);
          }
        }
      );
    }, 300);
  };

  // Handle address suggestion selection
  const handleAddressSelect = (prediction: PlacePrediction) => {
    handleUpdate("address", prediction.description);
    setShowAddressSuggestions(false);

    // Get place details for geolocation
    if (placesService.current) {
      placesService.current.getDetails(
        {
          placeId: prediction.place_id,
          fields: ["geometry", "formatted_address"],
        },
        (place: any, status: string) => {
          if (status === "OK" && place?.geometry?.location) {
            handleUpdate("geolocation", {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
          }
        }
      );
    }
  };

  // Simulated Google Search suggestions for URL
  // In production, this would call a backend API that uses Google Custom Search
  const handleUrlSearch = useCallback((businessName: string) => {
    if (urlDebounceRef.current) {
      clearTimeout(urlDebounceRef.current);
    }

    if (!businessName.trim()) {
      setUrlSuggestions([]);
      setShowUrlSuggestions(false);
      return;
    }

    setIsLoadingUrl(true);
    urlDebounceRef.current = setTimeout(() => {
      // Simulated suggestions based on business name
      // In production, replace with actual Google Custom Search API call
      const sanitized = businessName.toLowerCase().replace(/[^a-z0-9]/g, "");
      const suggestions: UrlSuggestion[] = [
        {
          title: `${businessName} - Official Website`,
          url: `https://www.${sanitized}.com`,
        },
        {
          title: `${businessName} on Yelp`,
          url: `https://www.yelp.com/biz/${sanitized}`,
        },
        {
          title: `${businessName} on Google Maps`,
          url: `https://maps.google.com/maps?q=${encodeURIComponent(businessName)}`,
        },
      ];
      setUrlSuggestions(suggestions);
      setShowUrlSuggestions(true);
      setIsLoadingUrl(false);
    }, 300);
  }, []);

  // Trigger URL search when DBA name changes
  const handleUrlFocus = () => {
    if (formData.dbaName && !formData.url) {
      handleUrlSearch(formData.dbaName);
    } else if (formData.url) {
      setShowUrlSuggestions(false);
    }
  };

  // Handle URL suggestion selection
  const handleUrlSelect = (suggestion: UrlSuggestion) => {
    handleUpdate("url", suggestion.url);
    setShowUrlSuggestions(false);
  };

  // Handle save
  const handleSave = () => {
    if (isValid) {
      onSave(formData);
    }
  };

  return (
    <Card className="p-4 border-2 border-primary/20 bg-primary/5 animate-in slide-in-from-top-2 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <BuildingStorefrontIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Create New Merchant</h3>
            <p className="text-xs text-muted-foreground">
              Add merchant details to create your offer
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <XMarkIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column - Required Fields */}
        <div className="space-y-4">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Required Fields
          </div>

          {/* Corp Name */}
          <div>
            <Label htmlFor="corpName" className="text-sm">
              Corporate Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="corpName"
              placeholder="e.g., Acme Corporation Inc."
              value={formData.corpName}
              onChange={(e) => handleUpdate("corpName", e.target.value)}
              className="mt-1"
            />
          </div>

          {/* DBA Name */}
          <div>
            <Label htmlFor="dbaName" className="text-sm">
              DBA Name (Doing Business As){" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dbaName"
              placeholder="e.g., Acme Pizza"
              value={formData.dbaName}
              onChange={(e) => handleUpdate("dbaName", e.target.value)}
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This is the name customers will see
            </p>
          </div>

          {/* Logo Upload */}
          <div>
            <Label className="text-sm">
              Logo <span className="text-destructive">*</span>
            </Label>
            <div className="mt-1">
              {formData.logoPreview ? (
                <div className="relative inline-block">
                  <img
                    src={formData.logoPreview}
                    alt="Logo preview"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                    onClick={() => {
                      handleUpdate("logo", null);
                      handleUpdate("logoPreview", null);
                    }}
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors"
                >
                  <PhotoIcon className="w-6 h-6 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">Upload</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Right Column - Optional Fields */}
        <div className="space-y-4">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
            Optional Fields
          </div>

          {/* Address with Google Places */}
          <div className="relative">
            <Label
              htmlFor="address"
              className="text-sm flex items-center gap-1"
            >
              <MapPinIcon className="w-3.5 h-3.5" />
              Address
              {googleLoaded && (
                <span className="text-xs text-green-600 ml-1">
                  (Google Places)
                </span>
              )}
            </Label>
            <Input
              ref={addressInputRef}
              id="address"
              placeholder="Start typing to search..."
              value={formData.address}
              onChange={(e) => handleAddressChange(e.target.value)}
              onFocus={() =>
                formData.address && handleAddressChange(formData.address)
              }
              onBlur={() =>
                setTimeout(() => setShowAddressSuggestions(false), 200)
              }
              className="mt-1"
            />
            {isLoadingAddress && (
              <ArrowPathIcon className="w-4 h-4 absolute right-3 top-8 animate-spin text-muted-foreground" />
            )}

            {/* Address Suggestions Dropdown */}
            {showAddressSuggestions && addressSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {addressSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.place_id}
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                    onClick={() => handleAddressSelect(suggestion)}
                  >
                    <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{suggestion.description}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Geolocation indicator */}
            {formData.geolocation && (
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <CheckCircleIcon className="w-3 h-3" />
                Location captured: {formData.geolocation.lat.toFixed(4)},{" "}
                {formData.geolocation.lng.toFixed(4)}
              </p>
            )}
          </div>

          {/* URL with Google Search Suggestions */}
          <div className="relative">
            <Label htmlFor="url" className="text-sm flex items-center gap-1">
              <GlobeAltIcon className="w-3.5 h-3.5" />
              Website URL
              <span className="text-xs text-blue-600 ml-1">(Suggestions)</span>
            </Label>
            <Input
              ref={urlInputRef}
              id="url"
              type="url"
              placeholder="https://www.example.com"
              value={formData.url}
              onChange={(e) => {
                handleUpdate("url", e.target.value);
                setShowUrlSuggestions(false);
              }}
              onFocus={handleUrlFocus}
              onBlur={() => setTimeout(() => setShowUrlSuggestions(false), 200)}
              className="mt-1"
            />
            {isLoadingUrl && (
              <ArrowPathIcon className="w-4 h-4 absolute right-3 top-8 animate-spin text-muted-foreground" />
            )}

            {/* URL Suggestions Dropdown */}
            {showUrlSuggestions && urlSuggestions.length > 0 && (
              <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
                {urlSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                    onClick={() => handleUrlSelect(suggestion)}
                  >
                    <div className="font-medium text-gray-900 truncate">
                      {suggestion.title}
                    </div>
                    <div className="text-xs text-blue-600 truncate">
                      {suggestion.url}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Merchant Highlights */}
          <div>
            <Label
              htmlFor="highlights"
              className="text-sm flex items-center gap-1"
            >
              <SparklesIcon className="w-3.5 h-3.5" />
              Merchant Highlights
            </Label>
            <Textarea
              id="highlights"
              placeholder="e.g., Family-owned since 1985, Award-winning pizza, Outdoor seating available"
              value={formData.highlights}
              onChange={(e) => handleUpdate("highlights", e.target.value)}
              className="mt-1"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Key features that make this merchant special
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <div className="text-xs text-muted-foreground">
          <span className="text-destructive">*</span> Required fields
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isValid}
            className="flex items-center gap-1"
          >
            <CheckCircleIcon className="w-4 h-4" />
            Save & Continue
          </Button>
        </div>
      </div>
    </Card>
  );
}

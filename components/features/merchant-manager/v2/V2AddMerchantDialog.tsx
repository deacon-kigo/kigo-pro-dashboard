"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select";
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

export interface NewMerchantData {
  name: string;
  category: string;
  source: string;
  contact: string;
  notes: string;
  // Extended fields from offer-manager MerchantCreationInline
  corpName: string;
  dbaName: string;
  logo: File | null;
  logoPreview: string | null;
  address: string;
  geolocation: { lat: number; lng: number } | null;
  url: string;
}

interface PlacePrediction {
  description: string;
  place_id: string;
}

interface UrlSuggestion {
  title: string;
  url: string;
}

const CATEGORIES = [
  "Retail",
  "Entertainment",
  "Health & Wellness",
  "Food & Dining",
  "Travel",
] as const;

const SOURCES = [
  "Augeo",
  "Entertainment Benefits Group",
  "Direct Partnership",
] as const;

const initialFormState: NewMerchantData = {
  name: "",
  category: "",
  source: "",
  contact: "",
  notes: "",
  corpName: "",
  dbaName: "",
  logo: null,
  logoPreview: null,
  address: "",
  geolocation: null,
  url: "",
};

interface V2AddMerchantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (data: NewMerchantData) => void;
}

export default function V2AddMerchantDialog({
  open,
  onOpenChange,
  onAdd,
}: V2AddMerchantDialogProps) {
  const [form, setForm] = useState<NewMerchantData>(initialFormState);
  const [showMore, setShowMore] = useState(false);

  // Google Places state
  const [addressSuggestions, setAddressSuggestions] = useState<
    PlacePrediction[]
  >([]);
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // URL suggestions state
  const [urlSuggestions, setUrlSuggestions] = useState<UrlSuggestion[]>([]);
  const [showUrlSuggestions, setShowUrlSuggestions] = useState(false);
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);
  const addressDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const urlDebounceRef = useRef<NodeJS.Timeout | null>(null);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setForm(initialFormState);
      setShowMore(false);
      setAddressSuggestions([]);
      setUrlSuggestions([]);
    }
  }, [open]);

  // Load Google Maps script
  useEffect(() => {
    if (!open) return;

    if (window.google?.maps?.places) {
      setGoogleLoaded(true);
      initializeGoogleServices();
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) return;

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
  }, [open]);

  const initializeGoogleServices = () => {
    if (window.google?.maps?.places) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      const dummyDiv = document.createElement("div");
      placesService.current = new window.google.maps.places.PlacesService(
        dummyDiv
      );
    }
  };

  const update = (field: keyof NewMerchantData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Validation: name and category are required (matching John's design)
  const isValid = form.name.trim() && form.category;

  // Logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      update("logo", file);
      const reader = new FileReader();
      reader.onloadend = () => update("logoPreview", reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Google Places autocomplete for address
  const handleAddressChange = (value: string) => {
    update("address", value);
    if (addressDebounceRef.current) clearTimeout(addressDebounceRef.current);

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

  const handleAddressSelect = (prediction: PlacePrediction) => {
    update("address", prediction.description);
    setShowAddressSuggestions(false);

    if (placesService.current) {
      placesService.current.getDetails(
        {
          placeId: prediction.place_id,
          fields: ["geometry", "formatted_address"],
        },
        (place: any, status: string) => {
          if (status === "OK" && place?.geometry?.location) {
            update("geolocation", {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
          }
        }
      );
    }
  };

  // URL suggestions based on merchant name
  const handleUrlSearch = useCallback((businessName: string) => {
    if (urlDebounceRef.current) clearTimeout(urlDebounceRef.current);
    if (!businessName.trim()) {
      setUrlSuggestions([]);
      setShowUrlSuggestions(false);
      return;
    }

    setIsLoadingUrl(true);
    urlDebounceRef.current = setTimeout(() => {
      const sanitized = businessName.toLowerCase().replace(/[^a-z0-9]/g, "");
      setUrlSuggestions([
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
      ]);
      setShowUrlSuggestions(true);
      setIsLoadingUrl(false);
    }, 300);
  }, []);

  const handleUrlFocus = () => {
    if (form.name && !form.url) handleUrlSearch(form.name);
    else if (form.url) setShowUrlSuggestions(false);
  };

  const handleSubmit = () => {
    if (isValid) {
      onAdd(form);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <BuildingStorefrontIcon className="w-5 h-5 text-primary" />
            </div>
            Add New Merchant
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Merchant Name — primary field from John's design */}
          <div>
            <Label htmlFor="merchant-name" className="text-sm">
              Merchant Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="merchant-name"
              placeholder="e.g. Papa John's"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              className="mt-1"
              autoFocus
            />
          </div>

          {/* Category — from John's design */}
          <div>
            <Label className="text-sm">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select
              value={form.category}
              onValueChange={(v) => update("category", v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Offer Source — from John's design */}
          <div>
            <Label className="text-sm">Offer Source</Label>
            <Select
              value={form.source}
              onValueChange={(v) => update("source", v)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {SOURCES.map((src) => (
                  <SelectItem key={src} value={src}>
                    {src}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Account Contact — from John's design */}
          <div>
            <Label htmlFor="merchant-contact" className="text-sm">
              Account Contact
            </Label>
            <Input
              id="merchant-contact"
              placeholder="Contact name or email"
              value={form.contact}
              onChange={(e) => update("contact", e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Notes — from John's design */}
          <div>
            <Label htmlFor="merchant-notes" className="text-sm">
              Notes
            </Label>
            <Textarea
              id="merchant-notes"
              placeholder="Any relevant notes about this merchant..."
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
              className="mt-1"
              rows={3}
            />
          </div>

          {/* Expandable section — extended fields from offer-manager MerchantCreationInline */}
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-1.5 text-sm text-primary hover:underline w-fit"
          >
            <SparklesIcon className="w-4 h-4" />
            {showMore ? "Hide" : "Show"} additional details (logo, address, URL)
          </button>

          {showMore && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg border bg-muted/30 animate-in slide-in-from-top-1 duration-200">
              {/* Corporate Name */}
              <div>
                <Label htmlFor="corpName" className="text-sm">
                  Corporate Name
                </Label>
                <Input
                  id="corpName"
                  placeholder="e.g., Acme Corporation Inc."
                  value={form.corpName}
                  onChange={(e) => update("corpName", e.target.value)}
                  className="mt-1"
                />
              </div>

              {/* DBA Name */}
              <div>
                <Label htmlFor="dbaName" className="text-sm">
                  DBA Name
                </Label>
                <Input
                  id="dbaName"
                  placeholder="e.g., Acme Pizza"
                  value={form.dbaName}
                  onChange={(e) => update("dbaName", e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Name customers will see
                </p>
              </div>

              {/* Logo Upload */}
              <div>
                <Label className="text-sm">Logo</Label>
                <div className="mt-1">
                  {form.logoPreview ? (
                    <div className="relative inline-block">
                      <img
                        src={form.logoPreview}
                        alt="Logo preview"
                        className="w-16 h-16 object-cover rounded-lg border"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 w-5 h-5 p-0 rounded-full"
                        onClick={() => {
                          update("logo", null);
                          update("logoPreview", null);
                        }}
                      >
                        <XMarkIcon className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <PhotoIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-[10px] text-gray-500 mt-0.5">
                        Upload
                      </span>
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

              {/* Website URL with suggestions */}
              <div className="relative">
                <Label
                  htmlFor="merchant-url"
                  className="text-sm flex items-center gap-1"
                >
                  <GlobeAltIcon className="w-3.5 h-3.5" />
                  Website URL
                </Label>
                <Input
                  id="merchant-url"
                  type="url"
                  placeholder="https://www.example.com"
                  value={form.url}
                  onChange={(e) => {
                    update("url", e.target.value);
                    setShowUrlSuggestions(false);
                  }}
                  onFocus={handleUrlFocus}
                  onBlur={() =>
                    setTimeout(() => setShowUrlSuggestions(false), 200)
                  }
                  className="mt-1"
                />
                {isLoadingUrl && (
                  <ArrowPathIcon className="w-4 h-4 absolute right-3 top-8 animate-spin text-muted-foreground" />
                )}
                {showUrlSuggestions && urlSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg">
                    {urlSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100"
                        onClick={() => {
                          update("url", suggestion.url);
                          setShowUrlSuggestions(false);
                        }}
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

              {/* Address with Google Places */}
              <div className="relative sm:col-span-2">
                <Label
                  htmlFor="merchant-address"
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
                  id="merchant-address"
                  placeholder="Start typing to search..."
                  value={form.address}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  onFocus={() =>
                    form.address && handleAddressChange(form.address)
                  }
                  onBlur={() =>
                    setTimeout(() => setShowAddressSuggestions(false), 200)
                  }
                  className="mt-1"
                />
                {isLoadingAddress && (
                  <ArrowPathIcon className="w-4 h-4 absolute right-3 top-8 animate-spin text-muted-foreground" />
                )}
                {showAddressSuggestions && addressSuggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                    {addressSuggestions.map((suggestion) => (
                      <button
                        key={suggestion.place_id}
                        type="button"
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2"
                        onClick={() => handleAddressSelect(suggestion)}
                      >
                        <MapPinIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">
                          {suggestion.description}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                {form.geolocation && (
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <CheckCircleIcon className="w-3 h-3" />
                    Location captured: {form.geolocation.lat.toFixed(4)},{" "}
                    {form.geolocation.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!isValid}>
            Add Merchant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

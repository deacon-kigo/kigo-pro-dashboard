"use client";

import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReactSelectMulti } from "@/components/ui/react-select-multi";
import {
  ArrowLeftIcon,
  PhotoIcon,
  XMarkIcon,
  CheckCircleIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import { MerchantData } from "./MerchantHybridSearch";

// Merchant Sources (per ticket: MCM, Augeo, etc)
const MERCHANT_SOURCES = [
  { value: "MCM", label: "MCM (Merchant Commerce Manager)" },
  { value: "Augeo", label: "Augeo" },
  { value: "CashStar", label: "CashStar" },
  { value: "Blackhawk", label: "Blackhawk Network" },
  { value: "InComm", label: "InComm" },
  { value: "Other", label: "Other" },
];

// Merchant Categories (per ticket: could be one or more)
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

// Quick-pick category pills
const CATEGORY_QUICK_PICKS = [
  { label: "Restaurant", value: "dining", icon: "🍽️" },
  { label: "Retail Store", value: "shopping", icon: "🛍️" },
  { label: "Grocery", value: "grocery", icon: "🛒" },
  { label: "Coffee/Cafe", value: "dining", icon: "☕" },
  { label: "Hotel", value: "travel", icon: "🏨" },
  { label: "Salon/Spa", value: "beauty", icon: "💇" },
  { label: "Fitness/Gym", value: "health", icon: "💪" },
  { label: "Auto Service", value: "gas", icon: "🚗" },
  { label: "Entertainment", value: "entertainment", icon: "🎬" },
  { label: "Electronics", value: "electronics", icon: "📱" },
  { label: "Fashion", value: "fashion", icon: "👗" },
  { label: "Home/Garden", value: "home", icon: "🏠" },
];

// Smart category inference
const inferCategories = (name: string): string[] => {
  const lowerName = name.toLowerCase();
  const inferred: string[] = [];

  if (
    /pizza|burger|sushi|taco|coffee|cafe|restaurant|grill|kitchen|diner|bistro|bakery|bar\b/.test(
      lowerName
    )
  ) {
    inferred.push("dining");
  }
  if (/store|shop|mart|outlet|boutique|market/.test(lowerName)) {
    inferred.push("shopping");
  }
  if (/hotel|motel|inn|resort|airline|travel|vacation|cruise/.test(lowerName)) {
    inferred.push("travel");
  }
  if (
    /cinema|theater|theatre|movie|game|arcade|entertainment|concert/.test(
      lowerName
    )
  ) {
    inferred.push("entertainment");
  }
  if (/gym|fitness|spa|wellness|health|yoga|clinic|medical/.test(lowerName)) {
    inferred.push("health");
  }
  if (/auto|car|tire|oil|gas|fuel|mechanic/.test(lowerName)) {
    inferred.push("gas");
  }
  if (/tech|electronic|computer|phone|mobile|digital/.test(lowerName)) {
    inferred.push("electronics");
  }
  if (/salon|beauty|hair|nail|cosmetic|makeup/.test(lowerName)) {
    inferred.push("beauty");
  }
  if (/grocery|supermarket|food mart|fresh/.test(lowerName)) {
    inferred.push("grocery");
  }

  return inferred;
};

// Generate Clearbit logo URL
const generateLogoUrl = (name: string): string => {
  if (!name.trim()) return "";
  const sanitized = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "");
  return sanitized ? `https://logo.clearbit.com/${sanitized}.com` : "";
};

interface MerchantManualEntryProps {
  onSave: (merchant: MerchantData) => void;
  onBack: () => void;
  initialSearchQuery?: string;
}

export default function MerchantManualEntry({
  onSave,
  onBack,
  initialSearchQuery = "",
}: MerchantManualEntryProps) {
  // === REQUIRED FIELDS (per ticket) ===
  const [dbaName, setDbaName] = useState(initialSearchQuery);
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]); // Multi-select per ticket
  const [source, setSource] = useState("");

  // === OPTIONAL FIELDS (per ticket) ===
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [corpName, setCorpName] = useState("");
  const [address, setAddress] = useState("");
  const [url, setUrl] = useState("");
  const [highlights, setHighlights] = useState("");

  // UI state
  const [showOptional, setShowOptional] = useState(false);
  const [suggestedLogoUrl, setSuggestedLogoUrl] = useState("");
  const [suggestedCategories, setSuggestedCategories] = useState<string[]>([]);
  const [useLogoUrl, setUseLogoUrl] = useState(false);
  const [logoSuggestionFailed, setLogoSuggestionFailed] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Validation - Required: DBA Name, Logo, Categories (1+), Source
  const isValid =
    dbaName.trim() && (logo || useLogoUrl) && categories.length > 0 && source;

  // Smart suggestions when DBA name changes
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (dbaName.trim().length >= 2) {
        setSuggestedLogoUrl(generateLogoUrl(dbaName));
        setLogoSuggestionFailed(false);

        if (categories.length === 0) {
          const inferred = inferCategories(dbaName);
          setSuggestedCategories(inferred);
        }
      } else {
        setSuggestedLogoUrl("");
        setSuggestedCategories([]);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [dbaName, categories.length]);

  const acceptSuggestedCategories = () => {
    if (suggestedCategories.length > 0) {
      setCategories(suggestedCategories);
      setSuggestedCategories([]);
    }
  };

  const handleQuickPickCategory = (value: string) => {
    // Toggle: click to select, click again to deselect
    if (categories.includes(value)) {
      setCategories(categories.filter((c) => c !== value));
    } else {
      setCategories([...categories, value]);
    }
  };

  const handleUseLogoUrl = () => {
    setUseLogoUrl(true);
    setLogoPreview(suggestedLogoUrl);
    setLogo(null);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setUseLogoUrl(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (isValid) {
      onSave({
        dbaName,
        logo,
        logoPreview: useLogoUrl ? suggestedLogoUrl : logoPreview,
        categories,
        merchantSource: source,
        bannerImage,
        bannerPreview,
        corpName,
        address,
        url,
        highlights,
        source: "manual",
      });
    }
  };

  return (
    <Card className="p-4 border border-gray-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 pb-3 border-b">
        <Button variant="ghost" size="sm" onClick={onBack} className="p-1">
          <ArrowLeftIcon className="w-5 h-5" />
        </Button>
        <div>
          <h3 className="font-medium text-gray-900">Create New Merchant</h3>
          <p className="text-sm text-gray-600">
            Add merchant details to create your offer
          </p>
        </div>
      </div>

      {/* Quick Category Selection - Compact inline pills */}
      <div className="mb-4">
        <Label className="text-xs font-medium text-gray-600 mb-1.5 block">
          Quick Select
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORY_QUICK_PICKS.map((pick) => (
            <button
              key={pick.label}
              type="button"
              onClick={() => handleQuickPickCategory(pick.value)}
              className={`px-2 py-1 rounded-md text-xs border transition-all flex items-center gap-1 ${
                categories.includes(pick.value)
                  ? "bg-primary text-white border-primary"
                  : "bg-white hover:bg-gray-50 border-gray-200 hover:border-primary/50"
              }`}
            >
              <span className="text-[10px]">{pick.icon}</span>
              <span>{pick.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Grid - Required Fields */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
        {/* === LEFT COLUMN === */}
        <div className="space-y-5">
          {/* DBA Name - Required */}
          <div>
            <Label htmlFor="dbaName">DBA Name (Brand Name)*</Label>
            <Input
              id="dbaName"
              placeholder="e.g., Joe's Pizza, Best Buy"
              value={dbaName}
              onChange={(e) => setDbaName(e.target.value)}
              autoFocus
            />
            <p className="mt-2 text-gray-600 text-sm">
              The name customers will see
            </p>
          </div>

          {/* Categories - Required (multi-select per ticket) */}
          <div>
            <Label htmlFor="categories">Merchant Categories*</Label>
            {suggestedCategories.length > 0 && categories.length === 0 && (
              <div className="mt-1 mb-2 p-2 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SparklesIcon className="w-4 h-4 text-blue-600" />
                  <span className="text-xs text-blue-700">
                    Suggested:{" "}
                    {suggestedCategories
                      .map(
                        (c) =>
                          MERCHANT_CATEGORIES.find((cat) => cat.value === c)
                            ?.label
                      )
                      .join(", ")}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={acceptSuggestedCategories}
                  className="text-xs h-6"
                >
                  Accept
                </Button>
              </div>
            )}
            <ReactSelectMulti
              options={MERCHANT_CATEGORIES}
              values={categories}
              onChange={(values) => setCategories(values)}
              placeholder="Select one or more categories..."
              maxDisplayValues={3}
            />
            <p className="mt-2 text-gray-600 text-sm">Could be one or more</p>
          </div>

          {/* Source - Required */}
          <div>
            <Label htmlFor="source">Source*</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger id="source">
                <SelectValue placeholder="Where is this merchant from?" />
              </SelectTrigger>
              <SelectContent>
                {MERCHANT_SOURCES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-gray-600 text-sm">MCM, Augeo, etc.</p>
          </div>
        </div>

        {/* === RIGHT COLUMN: Logo === */}
        <div className="space-y-5">
          {/* Logo - Required */}
          <div>
            <Label>Merchant Logo*</Label>
            <div className="mt-2">
              {logoPreview ? (
                <div className="relative inline-block">
                  <img
                    src={logoPreview}
                    alt="Logo"
                    className="w-24 h-24 object-contain rounded-lg border bg-white"
                    onError={() => {
                      if (useLogoUrl) {
                        setLogoPreview(null);
                        setUseLogoUrl(false);
                        setLogoSuggestionFailed(true);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setLogo(null);
                      setLogoPreview(null);
                      setUseLogoUrl(false);
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                  >
                    <XMarkIcon className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors bg-white"
                >
                  <PhotoIcon className="w-6 h-6 text-gray-500" />
                  <span className="text-xs text-gray-600 mt-1">Upload</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />

              {/* Logo Suggestion */}
              {suggestedLogoUrl && !logoPreview && !logoSuggestionFailed && (
                <div className="mt-3 flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-3">
                    <img
                      src={suggestedLogoUrl}
                      alt="Suggested logo"
                      className="w-10 h-10 object-contain rounded border bg-white"
                      onError={() => setLogoSuggestionFailed(true)}
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <SparklesIcon className="w-3.5 h-3.5 text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">
                          Suggested
                        </span>
                      </div>
                      <span className="text-xs text-blue-600">
                        Found matching logo
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleUseLogoUrl}
                    className="text-xs h-7 bg-white"
                  >
                    Use this
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === OPTIONAL FIELDS (Collapsed) === */}
      <div className="mt-6 pt-4 border-t">
        <button
          type="button"
          onClick={() => setShowOptional(!showOptional)}
          className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
        >
          {showOptional ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
          <span className="font-medium">Optional Fields</span>
          <span className="text-xs text-gray-500">
            (Banner, Corp Name, Address, URL, Highlights)
          </span>
        </button>

        {showOptional && (
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
            {/* Banner Image */}
            <div>
              <Label>Merchant Banner Image</Label>
              <div className="mt-2">
                {bannerPreview ? (
                  <div className="relative">
                    <img
                      src={bannerPreview}
                      alt="Banner"
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setBannerImage(null);
                        setBannerPreview(null);
                      }}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="w-full h-24 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors bg-white"
                  >
                    <PhotoIcon className="w-6 h-6 text-gray-500" />
                    <span className="text-xs text-gray-600 mt-1">
                      Upload Banner
                    </span>
                  </button>
                )}
                <input
                  ref={bannerInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleBannerUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Corp Name */}
            <div>
              <Label htmlFor="corpName">Corp Name</Label>
              <Input
                id="corpName"
                placeholder="Legal entity name"
                value={corpName}
                onChange={(e) => setCorpName(e.target.value)}
              />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Business street address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* URL */}
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://www.example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            {/* Highlights */}
            <div className="lg:col-span-2">
              <Label htmlFor="highlights">Merchant Highlights</Label>
              <Textarea
                id="highlights"
                placeholder="What makes this merchant special?"
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                rows={2}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t">
        <span className="text-xs text-gray-600">
          <span className="text-red-500">*</span> Required fields
        </span>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onBack}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!isValid}
            size="sm"
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

"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface OfferDetailsStepProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
}

// Available offer sources
const OFFER_SOURCES = [
  { label: "MCM (Merchant Commerce Manager)", value: "MCM" },
  { label: "FMTC (FlexOffers)", value: "FMTC" },
  { label: "EBG (Enterprise Business Group)", value: "EBG" },
  { label: "RN (Retail Network)", value: "RN" },
  { label: "AUGEO (Augeo Platform)", value: "AUGEO" },
  { label: "Create New Offer", value: "NEW" },
];

// Available categories
const AVAILABLE_CATEGORIES = [
  { label: "Food & Dining", value: "food" },
  { label: "Retail", value: "retail" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Services", value: "services" },
  { label: "Health & Wellness", value: "health" },
  { label: "Automotive", value: "automotive" },
  { label: "Travel", value: "travel" },
  { label: "Home & Garden", value: "home" },
];

export default function OfferDetailsStepV1({
  formData,
  onUpdate,
  onNext,
}: OfferDetailsStepProps) {
  // Initialize categories and commodities arrays if not exists
  const categories = formData.categories || [];
  const commodities = formData.commodities || [];

  const handleAddCategory = () => {
    const newCategories = [...categories, { category: "", subcategory: "" }];
    onUpdate("categories", newCategories);
  };

  const handleRemoveCategory = (index: number) => {
    const newCategories = categories.filter((_: any, i: number) => i !== index);
    onUpdate("categories", newCategories);
  };

  const handleCategoryChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const newCategories = [...categories];
    newCategories[index] = { ...newCategories[index], [field]: value };
    onUpdate("categories", newCategories);
  };

  const handleAddCommodity = () => {
    const newCommodities = [...commodities, ""];
    onUpdate("commodities", newCommodities);
  };

  const handleRemoveCommodity = (index: number) => {
    const newCommodities = commodities.filter(
      (_: any, i: number) => i !== index
    );
    onUpdate("commodities", newCommodities);
  };

  const handleCommodityChange = (index: number, value: string) => {
    const newCommodities = [...commodities];
    newCommodities[index] = value;
    onUpdate("commodities", newCommodities);
  };

  return (
    <div className="space-y-6">
      {/* Offer Source Selection */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-3">Offer Source</h3>
          <p className="text-sm text-gray-500 mb-4">
            Select whether to use an existing offer or create a new one
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="offerSource">
            Source <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.offerSource || "NEW"}
            onValueChange={(value) => onUpdate("offerSource", value)}
          >
            <SelectTrigger id="offerSource">
              <SelectValue placeholder="Select offer source" />
            </SelectTrigger>
            <SelectContent>
              {OFFER_SOURCES.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500">
            Choose a source to import from, or create a new offer
          </p>
        </div>

        {formData.offerSource && formData.offerSource !== "NEW" && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Source selected:</strong>{" "}
              {
                OFFER_SOURCES.find((s) => s.value === formData.offerSource)
                  ?.label
              }
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Offer details will be imported from this source
            </p>
          </div>
        )}
      </div>

      {/* Basic Offer Information */}
      <div className="space-y-4 pt-6 border-t">
        <div>
          <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
          <p className="text-sm text-gray-500 mb-4">
            Provide the core details about your offer
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="offerName">
            Offer Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="offerName"
            placeholder="Brief offer name for listing view (e.g., '20% Off Dinner')"
            value={formData.offerName || formData.shortText || ""}
            onChange={(e) => {
              onUpdate("offerName", e.target.value);
              // Keep backward compatibility with shortText
              onUpdate("shortText", e.target.value);
            }}
            maxLength={60}
          />
          <p className="text-sm text-gray-500">
            {(formData.offerName || formData.shortText || "").length}/60
            characters - Shown in listing view
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            placeholder="Detailed offer description for detail view"
            value={formData.description || formData.longText || ""}
            onChange={(e) => {
              onUpdate("description", e.target.value);
              // Keep backward compatibility with longText
              onUpdate("longText", e.target.value);
            }}
            rows={4}
            maxLength={500}
          />
          <p className="text-sm text-gray-500">
            {(formData.description || formData.longText || "").length}/500
            characters - Shown in detail view
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">
              Start Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => onUpdate("startDate", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => onUpdate("endDate", e.target.value)}
              min={formData.startDate}
            />
            <p className="text-sm text-gray-500">
              Leave blank for no expiration
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="maxDiscount">Max Discount Amount</Label>
          <Input
            id="maxDiscount"
            type="text"
            placeholder="e.g., $50"
            value={formData.maxDiscount}
            onChange={(e) => onUpdate("maxDiscount", e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Maximum discount value if applicable
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="termsConditions">
            Terms & Conditions <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="termsConditions"
            placeholder="Enter the terms and conditions for this offer"
            value={formData.termsConditions}
            onChange={(e) => onUpdate("termsConditions", e.target.value)}
            rows={4}
          />
        </div>
      </div>

      {/* Classification */}
      <div className="space-y-4 pt-6 border-t">
        <div>
          <h3 className="text-lg font-semibold mb-3">Classification</h3>
          <p className="text-sm text-gray-500 mb-4">
            Help customers find your offer through search and filtering
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="offerType">
            Offer Type <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.offerType}
            onValueChange={(value) => onUpdate("offerType", value)}
          >
            <SelectTrigger id="offerType">
              <SelectValue placeholder="Select offer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bogo">BOGO (Buy One Get One)</SelectItem>
              <SelectItem value="percent_off">Percentage Off</SelectItem>
              <SelectItem value="dollar_off">Dollar Amount Off</SelectItem>
              <SelectItem value="free">Free Item/Service</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="discountValue">
            Discount Value (Auto-calculated or Manual)
          </Label>
          <Input
            id="discountValue"
            placeholder="e.g., 20% or $10"
            value={formData.discountValue}
            onChange={(e) => onUpdate("discountValue", e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Can be auto-extracted from offer text
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cuisineType">Cuisine Type (Optional)</Label>
          <Select
            value={formData.cuisineType}
            onValueChange={(value) => onUpdate("cuisineType", value)}
          >
            <SelectTrigger id="cuisineType">
              <SelectValue placeholder="Select cuisine type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="american">American</SelectItem>
              <SelectItem value="italian">Italian</SelectItem>
              <SelectItem value="mexican">Mexican</SelectItem>
              <SelectItem value="asian">Asian</SelectItem>
              <SelectItem value="mediterranean">Mediterranean</SelectItem>
              <SelectItem value="fast_food">Fast Food</SelectItem>
              <SelectItem value="cafe">Café/Bakery</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="keywords">Keywords (Optional)</Label>
          <Input
            id="keywords"
            placeholder="e.g., dinner, lunch, drinks, pizza"
            value={formData.keywords}
            onChange={(e) => onUpdate("keywords", e.target.value)}
          />
          <p className="text-sm text-gray-500">
            Comma-separated keywords for search
          </p>
        </div>

        {/* Categories - Flexible System */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label>Categories</Label>
              <p className="text-sm text-gray-500">
                Add one or more categories. Categories can have subcategories.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCategory}
              className="flex items-center gap-1"
            >
              <PlusIcon className="h-4 w-4" />
              Add Category
            </Button>
          </div>

          {categories.length === 0 && (
            <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-sm text-gray-500">
                No categories added yet. Click "Add Category" to get started.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {categories.map((cat: any, index: number) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor={`category-${index}`} className="text-sm">
                      Category
                    </Label>
                    <Select
                      value={cat.category}
                      onValueChange={(value) =>
                        handleCategoryChange(index, "category", value)
                      }
                    >
                      <SelectTrigger id={`category-${index}`} className="h-9">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {AVAILABLE_CATEGORIES.map((category) => (
                          <SelectItem
                            key={category.value}
                            value={category.value}
                          >
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor={`subcategory-${index}`} className="text-sm">
                      Subcategory
                    </Label>
                    <Input
                      id={`subcategory-${index}`}
                      placeholder="e.g., Pizza, Burgers"
                      value={cat.subcategory}
                      onChange={(e) =>
                        handleCategoryChange(
                          index,
                          "subcategory",
                          e.target.value
                        )
                      }
                      className="h-9"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCategory(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-6"
                >
                  <XMarkIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Commodities - Flexible Tags */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <Label>Commodities</Label>
              <p className="text-sm text-gray-500">
                Add specific items, products, or services included in this
                offer.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddCommodity}
              className="flex items-center gap-1"
            >
              <PlusIcon className="h-4 w-4" />
              Add Commodity
            </Button>
          </div>

          {commodities.length === 0 && (
            <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-sm text-gray-500">
                No commodities added yet. Click "Add Commodity" to get started.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {commodities.map((commodity: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md"
              >
                <Input
                  placeholder="e.g., Entrees, Appetizers"
                  value={commodity}
                  onChange={(e) => handleCommodityChange(index, e.target.value)}
                  className="h-7 w-40 text-sm border-none bg-transparent focus-visible:ring-0"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCommodity(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

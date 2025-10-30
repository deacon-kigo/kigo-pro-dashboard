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
import { ReactSelectMulti } from "@/components/ui/react-select-multi";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDownIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

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

// Available categories (from config.categorisation table)
// In production, these would be fetched from GET /api/categories
// Structured as tree with parent-child relationships
const CATEGORY_TREE = [
  {
    id: "1",
    name: "Food & Dining",
    children: [
      { id: "2", name: "Pizza" },
      { id: "3", name: "Burgers" },
      { id: "4", name: "Fine Dining" },
      { id: "5", name: "Fast Food" },
      { id: "6", name: "Cafe & Bakery" },
    ],
  },
  {
    id: "7",
    name: "Retail",
    children: [
      { id: "8", name: "Clothing" },
      { id: "9", name: "Electronics" },
      { id: "10", name: "Home Goods" },
    ],
  },
  {
    id: "11",
    name: "Entertainment",
    children: [
      { id: "12", name: "Movies" },
      { id: "13", name: "Sports Events" },
    ],
  },
  {
    id: "14",
    name: "Services",
    children: [
      { id: "15", name: "Auto Repair" },
      { id: "16", name: "Home Services" },
    ],
  },
  { id: "17", name: "Health & Wellness", children: [] },
  { id: "18", name: "Automotive", children: [] },
  { id: "19", name: "Travel", children: [] },
];

// Available commodities (from config.commodities table)
// In production, these would be fetched from GET /api/commodities
const AVAILABLE_COMMODITIES = [
  { label: "Entrees", value: "1" },
  { label: "Appetizers", value: "2" },
  { label: "Desserts", value: "3" },
  { label: "Beverages", value: "4" },
  { label: "Alcohol", value: "5" },
  { label: "Gift Cards", value: "6" },
  { label: "Merchandise", value: "7" },
  { label: "Services", value: "8" },
];

export default function OfferDetailsStepV1({
  formData,
  onUpdate,
  onNext,
}: OfferDetailsStepProps) {
  // Initialize category_ids and commodity_ids arrays (matching API structure)
  const categoryIds = formData.category_ids || [];
  const commodityIds = formData.commodity_ids || [];

  // State for expanded parent categories
  const [expandedCategories, setExpandedCategories] = React.useState<
    Set<string>
  >(new Set());

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleCategorySelection = (categoryId: string) => {
    const newIds = categoryIds.includes(categoryId)
      ? categoryIds.filter((id: string) => id !== categoryId)
      : [...categoryIds, categoryId];
    onUpdate("category_ids", newIds);
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

        {/* Categories - Hierarchical Checkbox Tree */}
        <div className="space-y-3">
          <div>
            <Label>Categories</Label>
            <p className="text-sm text-gray-500">
              Select one or more categories. Click arrows to expand
              subcategories.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 max-h-80 overflow-y-auto">
            <div className="space-y-1">
              {CATEGORY_TREE.map((parentCategory) => (
                <div key={parentCategory.id}>
                  {/* Parent Category */}
                  <div className="flex items-center gap-2 py-2 hover:bg-gray-100 rounded px-2">
                    {parentCategory.children.length > 0 && (
                      <button
                        type="button"
                        onClick={() => toggleCategory(parentCategory.id)}
                        className="p-0.5 hover:bg-gray-200 rounded"
                      >
                        {expandedCategories.has(parentCategory.id) ? (
                          <ChevronDownIcon className="h-4 w-4 text-gray-600" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    )}
                    {parentCategory.children.length === 0 && (
                      <div className="w-5" />
                    )}
                    <Checkbox
                      id={`cat-${parentCategory.id}`}
                      checked={categoryIds.includes(parentCategory.id)}
                      onCheckedChange={() =>
                        toggleCategorySelection(parentCategory.id)
                      }
                    />
                    <label
                      htmlFor={`cat-${parentCategory.id}`}
                      className="text-sm font-medium text-gray-900 cursor-pointer flex-1"
                    >
                      {parentCategory.name}
                    </label>
                  </div>

                  {/* Child Categories */}
                  {expandedCategories.has(parentCategory.id) &&
                    parentCategory.children.length > 0 && (
                      <div className="ml-8 space-y-1 mt-1">
                        {parentCategory.children.map((childCategory) => (
                          <div
                            key={childCategory.id}
                            className="flex items-center gap-2 py-1.5 hover:bg-gray-100 rounded px-2"
                          >
                            <Checkbox
                              id={`cat-${childCategory.id}`}
                              checked={categoryIds.includes(childCategory.id)}
                              onCheckedChange={() =>
                                toggleCategorySelection(childCategory.id)
                              }
                            />
                            <label
                              htmlFor={`cat-${childCategory.id}`}
                              className="text-sm text-gray-700 cursor-pointer flex-1"
                            >
                              {childCategory.name}
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>

          {categoryIds.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <span className="text-sm font-medium text-blue-900">
                Selected:
              </span>
              {categoryIds.map((id: string) => {
                const category =
                  CATEGORY_TREE.find((c) => c.id === id) ||
                  CATEGORY_TREE.flatMap((c) => c.children).find(
                    (c) => c?.id === id
                  );
                return category ? (
                  <span
                    key={id}
                    className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium"
                  >
                    {category.name}
                  </span>
                ) : null;
              })}
            </div>
          )}
        </div>

        {/* Commodities - Multi-Select from Existing */}
        <div className="space-y-2">
          <Label htmlFor="commodities">Commodities</Label>
          <ReactSelectMulti
            options={AVAILABLE_COMMODITIES}
            values={commodityIds}
            onChange={(values) => onUpdate("commodity_ids", values)}
            placeholder="Select commodities..."
            maxDisplayValues={3}
          />
          <p className="text-sm text-gray-500">
            Select specific items, products, or services included in this offer.
          </p>
        </div>
      </div>
    </div>
  );
}

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
import {
  HierarchicalTreeSelector,
  TreeNode,
} from "@/components/ui/hierarchical-tree-selector";
import { Card } from "@/components/ui/card";
import {
  FileTextIcon,
  InformationCircleIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

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
const CATEGORY_TREE: TreeNode[] = [
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

        {/* Categories - Hierarchical Tree Selector */}
        <div className="space-y-2">
          <Label>Categories</Label>
          <p className="text-sm text-gray-500 mb-2">
            Select one or more categories. Click arrows to expand subcategories.
          </p>
          <HierarchicalTreeSelector
            data={CATEGORY_TREE}
            selectedIds={categoryIds}
            onChange={(ids) => onUpdate("category_ids", ids)}
            placeholder="No categories available"
            showSelectedBadge={true}
          />
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

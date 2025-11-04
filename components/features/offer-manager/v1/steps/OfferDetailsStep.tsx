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
import { ReactSelectCreatable } from "@/components/ui/react-select-creatable";
import {
  HierarchicalTreeSelector,
  TreeNode,
} from "@/components/ui/hierarchical-tree-selector";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DocumentTextIcon,
  InformationCircleIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

interface OfferDetailsStepProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
}

// Available offer sources (external reference values)
const OFFER_SOURCES = [
  { label: "MCM (Merchant Commerce Manager)", value: "MCM" },
  { label: "FMTC (FlexOffers)", value: "FMTC" },
  { label: "EBG (Enterprise Business Group)", value: "EBG" },
  { label: "RN (Retail Network)", value: "RN" },
  { label: "AUGEO (Augeo Platform)", value: "AUGEO" },
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
}: OfferDetailsStepProps) {
  // Initialize category_ids and commodity_ids arrays (matching API structure)
  const categoryIds = formData.category_ids || [];
  const commodityIds = formData.commodity_ids || [];

  return (
    <div className="space-y-4">
      {/* Offer Source Section */}
      <Accordion
        className="rounded-md border"
        collapsible
        defaultValue="offer-source"
        type="single"
      >
        <AccordionItem value="offer-source">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <DocumentTextIcon className="size-4" />
              <span>Offer Source</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5">
            <div>
              <Label htmlFor="offerSource">Offer Source*</Label>
              <ReactSelectCreatable
                options={OFFER_SOURCES}
                value={formData.offerSource || null}
                onChange={(value) => onUpdate("offerSource", value)}
                placeholder="Select existing or create new source"
                formatCreateLabel={(inputValue) =>
                  `Create new source "${inputValue.toUpperCase().replace(/\s+/g, "_")}"`
                }
                helperText="Select from existing sources (MCM, FMTC, EBG, RN, AUGEO) or type to create a new one. Only uppercase letters, numbers, and underscores allowed (3-60 characters)"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Basic Information Section */}
      <Accordion
        className="rounded-md border"
        collapsible
        defaultValue="basic-info"
        type="single"
      >
        <AccordionItem value="basic-info">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <InformationCircleIcon className="size-4" />
              <span>Basic Information</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5">
            <div>
              <Label htmlFor="offerName">Offer Name*</Label>
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
              <p className="mt-2 text-muted-foreground text-sm">
                {(formData.offerName || formData.shortText || "").length}/60
                characters - Shown in listing view
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description*</Label>
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
              <p className="mt-2 text-muted-foreground text-sm">
                {(formData.description || formData.longText || "").length}/500
                characters - Shown in detail view
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date*</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => onUpdate("startDate", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => onUpdate("endDate", e.target.value)}
                  min={formData.startDate}
                />
                <p className="mt-2 text-muted-foreground text-sm">
                  Leave blank for no expiration
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="maxDiscount">Max Discount Amount</Label>
                <Input
                  id="maxDiscount"
                  type="text"
                  placeholder="e.g., $50"
                  value={formData.maxDiscount}
                  onChange={(e) => onUpdate("maxDiscount", e.target.value)}
                />
                <p className="mt-2 text-muted-foreground text-sm">
                  Maximum discount value if applicable
                </p>
              </div>

              <div>
                <Label htmlFor="discountValue">Discount Value</Label>
                <Input
                  id="discountValue"
                  placeholder="e.g., 20% or $10"
                  value={formData.discountValue}
                  onChange={(e) => onUpdate("discountValue", e.target.value)}
                />
                <p className="mt-2 text-muted-foreground text-sm">
                  Can be auto-extracted from offer text
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="termsConditions">Terms & Conditions*</Label>
              <Textarea
                id="termsConditions"
                placeholder="Enter the terms and conditions for this offer"
                value={formData.termsConditions}
                onChange={(e) => onUpdate("termsConditions", e.target.value)}
                rows={4}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Classification Section */}
      <Accordion
        className="rounded-md border"
        collapsible
        defaultValue="classification"
        type="single"
      >
        <AccordionItem value="classification">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <TagIcon className="size-4" />
              <span>Classification</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-5">
            <div>
              <Label htmlFor="offerType">Offer Type*</Label>
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

            <div>
              <Label htmlFor="cuisineType">Cuisine Type</Label>
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

            <div>
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                placeholder="e.g., dinner, lunch, drinks, pizza"
                value={formData.keywords}
                onChange={(e) => onUpdate("keywords", e.target.value)}
              />
              <p className="mt-2 text-muted-foreground text-sm">
                Comma-separated keywords for search
              </p>
            </div>

            {/* Categories - Hierarchical Tree Selector */}
            <div>
              <Label>Categories</Label>
              <p className="mt-1 mb-2 text-muted-foreground text-sm">
                Select one or more categories. Click arrows to expand
                subcategories.
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
            <div>
              <Label htmlFor="commodities">Commodities</Label>
              <ReactSelectMulti
                options={AVAILABLE_COMMODITIES}
                values={commodityIds}
                onChange={(values) => onUpdate("commodity_ids", values)}
                placeholder="Select commodities..."
                maxDisplayValues={3}
              />
              <p className="mt-2 text-muted-foreground text-sm">
                Select specific items, products, or services included in this
                offer.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

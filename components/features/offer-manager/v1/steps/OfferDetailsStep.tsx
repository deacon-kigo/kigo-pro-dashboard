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

interface OfferDetailsStepProps {
  formData: any;
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
}

export default function OfferDetailsStepV1({
  formData,
  onUpdate,
  onNext,
}: OfferDetailsStepProps) {
  return (
    <div className="space-y-6">
      {/* Basic Offer Information */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
          <p className="text-sm text-gray-500 mb-4">
            Provide the core details about your offer
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="shortText">
            Short Text <span className="text-red-500">*</span>
          </Label>
          <Input
            id="shortText"
            placeholder="Brief offer description for listing view (e.g., '20% Off Dinner')"
            value={formData.shortText}
            onChange={(e) => onUpdate("shortText", e.target.value)}
            maxLength={60}
          />
          <p className="text-sm text-gray-500">
            {formData.shortText.length}/60 characters - Shown in listing view
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="longText">
            Long Text <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="longText"
            placeholder="Detailed offer description for detail view"
            value={formData.longText}
            onChange={(e) => onUpdate("longText", e.target.value)}
            rows={4}
            maxLength={500}
          />
          <p className="text-sm text-gray-500">
            {formData.longText.length}/500 characters - Shown in detail view
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstCategory">First Category</Label>
            <Select
              value={formData.firstCategory}
              onValueChange={(value) => onUpdate("firstCategory", value)}
            >
              <SelectTrigger id="firstCategory">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food & Dining</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="health">Health & Wellness</SelectItem>
                <SelectItem value="automotive">Automotive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondCategory">Second Category</Label>
            <Select
              value={formData.secondCategory}
              onValueChange={(value) => onUpdate("secondCategory", value)}
            >
              <SelectTrigger id="secondCategory">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">Food & Dining</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="health">Health & Wellness</SelectItem>
                <SelectItem value="automotive">Automotive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

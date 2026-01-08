"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  InformationCircleIcon,
  TagIcon,
  DevicePhoneMobileIcon,
  EyeIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface ReviewPreviewPanelProps {
  formData: any;
  currentStep?: string;
}

/**
 * Review Preview Panel
 *
 * Displays a live preview/review of the offer form data as users fill it out.
 * ALWAYS shows all sections with completion indicators.
 * Shows placeholder text for empty fields.
 * Matches catalog filter and campaign preview patterns.
 * Reactively expands sections as user fills them out.
 */
export function ReviewPreviewPanel({
  formData,
  currentStep,
}: ReviewPreviewPanelProps) {
  const isFieldFilled = (value: any) => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === "string") return value.trim().length > 0;
    if (typeof value === "number") return true;
    if (typeof value === "object" && value !== null) return true;
    return !!value;
  };

  // Check section completion
  const hasBasicInfo =
    isFieldFilled(formData.merchant) ||
    isFieldFilled(formData.offerName) ||
    isFieldFilled(formData.description) ||
    isFieldFilled(formData.offerImagePreview);

  const hasClassification =
    isFieldFilled(formData.offerType) ||
    isFieldFilled(formData.category_ids) ||
    isFieldFilled(formData.keywords);

  const hasRedemption =
    isFieldFilled(formData.redemptionTypes) ||
    isFieldFilled(formData.promoCode);

  // Dynamically expand sections that have data
  const expandedSections = [];
  if (hasBasicInfo) expandedSections.push("basic-info");
  if (hasClassification) expandedSections.push("classification");
  if (hasRedemption) expandedSections.push("redemption");

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-muted/20 flex-shrink-0">
        <EyeIcon className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-medium">Offer Preview</h3>
          <p className="text-sm text-muted-foreground">
            Live preview as you create
          </p>
        </div>
      </div>

      {/* Content - Always show all sections */}
      <div className="flex-1 overflow-auto p-4">
        <Accordion
          type="multiple"
          value={expandedSections}
          className="space-y-4"
        >
          {/* Basic Information Section - Always visible */}
          <AccordionItem value="basic-info" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2 flex-1">
                <InformationCircleIcon className="size-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm font-medium">Basic Information</span>
                <CheckCircleIcon
                  className={`size-4 ml-auto mr-2 transition-colors ${
                    hasBasicInfo ? "text-green-600" : "text-gray-300"
                  }`}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-3 text-sm">
                {/* Offer Image */}
                {formData.offerImagePreview && (
                  <div>
                    <span className="text-sm font-medium text-slate-700">
                      Offer Image
                    </span>
                    <div className="mt-2">
                      <img
                        src={formData.offerImagePreview}
                        alt={formData.offerImageAlt || "Offer image"}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      {formData.offerImageAlt && (
                        <p className="text-xs text-gray-500 mt-1">
                          Alt text: {formData.offerImageAlt}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Merchant */}
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    Merchant
                  </span>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {isFieldFilled(formData.merchant) ? (
                      typeof formData.merchant === "object" ? (
                        formData.merchant.label
                      ) : (
                        formData.merchant
                      )
                    ) : (
                      <span className="text-gray-400 italic">(Not set)</span>
                    )}
                  </p>
                </div>

                {/* Offer Name */}
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    Offer Name
                  </span>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {formData.offerName || (
                      <span className="text-gray-400 italic">(Not set)</span>
                    )}
                  </p>
                </div>

                {/* Description */}
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    Description
                  </span>
                  <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">
                    {formData.description || (
                      <span className="text-gray-400 italic">(Not set)</span>
                    )}
                  </p>
                </div>

                {/* Validity Period */}
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    Validity Period
                  </span>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {formData.startDate ? (
                      <>
                        <span>
                          {new Date(formData.startDate).toLocaleDateString()}
                        </span>
                        {" → "}
                        {formData.endDate ? (
                          <span>
                            {new Date(formData.endDate).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="text-gray-500 italic">
                            (No expiration)
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400 italic">(Not set)</span>
                    )}
                  </p>
                </div>

                {/* Terms */}
                {isFieldFilled(formData.termsConditions) && (
                  <div>
                    <span className="text-sm font-medium text-slate-700">
                      Terms & Conditions
                    </span>
                    <p className="text-sm text-gray-700 mt-0.5 leading-relaxed">
                      {formData.termsConditions.substring(0, 100)}
                      {formData.termsConditions.length > 100 && "..."}
                    </p>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Classification Section - Always visible */}
          <AccordionItem value="classification" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2 flex-1">
                <TagIcon className="size-4 text-purple-600 flex-shrink-0" />
                <span className="text-sm font-medium">Classification</span>
                <CheckCircleIcon
                  className={`size-4 ml-auto mr-2 transition-colors ${
                    hasClassification ? "text-green-600" : "text-gray-300"
                  }`}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-3 text-sm">
                {/* Offer Type */}
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    Offer Type
                  </span>
                  <div className="mt-1">
                    {isFieldFilled(formData.offerType) ? (
                      <Badge variant="secondary" className="text-xs">
                        {formData.offerType === "bogo" && "BOGO"}
                        {formData.offerType === "percent_off" &&
                          "Percentage Off"}
                        {formData.offerType === "dollar_off" &&
                          "Dollar Amount Off"}
                        {formData.offerType === "free" && "Free Item/Service"}
                        {formData.offerType === "clk" && "CLK"}
                        {formData.offerType === "other" && "Other"}
                      </Badge>
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        (Not set)
                      </span>
                    )}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    Categories
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {isFieldFilled(formData.category_ids) ? (
                      formData.category_ids.map((id: string) => (
                        <Badge key={id} variant="outline" className="text-xs">
                          Category {id}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        (Not set)
                      </span>
                    )}
                  </div>
                </div>

                {/* Keywords */}
                {isFieldFilled(formData.keywords) && (
                  <div>
                    <span className="text-sm font-medium text-slate-700">
                      Keywords
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.keywords.map((keyword: any, index: number) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {typeof keyword === "string"
                            ? keyword
                            : keyword.label || keyword.value}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Redemption Section - Always visible */}
          <AccordionItem value="redemption" className="border rounded-md">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2 flex-1">
                <DevicePhoneMobileIcon className="size-4 text-green-600 flex-shrink-0" />
                <span className="text-sm font-medium">Redemption</span>
                <CheckCircleIcon
                  className={`size-4 ml-auto mr-2 transition-colors ${
                    hasRedemption ? "text-green-600" : "text-gray-300"
                  }`}
                />
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-3 text-sm">
                {/* Redemption Types */}
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    Redemption Methods
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {isFieldFilled(formData.redemptionTypes) ? (
                      formData.redemptionTypes.map((type: string) => (
                        <Badge
                          key={type}
                          variant="secondary"
                          className="text-xs"
                        >
                          {type === "mobile" && "Mobile"}
                          {type === "online_print" && "Online Print"}
                          {type === "in_store" && "In-Store"}
                          {type === "external_url" && "External Link"}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        (Not set)
                      </span>
                    )}
                  </div>
                </div>

                {/* Promo Code */}
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    Promo Code
                  </span>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {formData.promoCode ? (
                      <span className="font-mono">{formData.promoCode}</span>
                    ) : (
                      <span className="text-gray-400 italic">(Not set)</span>
                    )}
                  </p>
                </div>

                {/* External URL */}
                {isFieldFilled(formData.externalUrl) && (
                  <div>
                    <span className="text-sm font-medium text-slate-700">
                      External URL
                    </span>
                    <p className="text-blue-600 mt-0.5 break-all text-sm">
                      {formData.externalUrl}
                    </p>
                  </div>
                )}

                {/* Usage Limits */}
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    Usage Limit Per Customer
                  </span>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {formData.usageLimitPerCustomer || (
                      <span className="text-gray-400 italic">(Not set)</span>
                    )}
                  </p>
                </div>

                {/* Location Scope */}
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    Location Scope
                  </span>
                  <p className="text-sm text-gray-700 mt-0.5">
                    {formData.locationScope === "all" ? (
                      "All Locations"
                    ) : formData.locationScope === "specific" ? (
                      <>
                        Specific Locations
                        {isFieldFilled(formData.location_ids) && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({formData.location_ids.length} selected)
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-gray-400 italic">(Not set)</span>
                    )}
                  </p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

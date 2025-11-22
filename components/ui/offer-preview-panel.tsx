"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, Calendar, DollarSign, MapPin, Ticket } from "lucide-react";
import { ShinyBorder } from "@/components/ui/shiny-border";

interface OfferPreviewPanelProps {
  // Form data to preview
  formData: Record<string, any>;

  // Children (typically AI enhancer section)
  children?: React.ReactNode;

  // Custom className
  className?: string;
}

export function OfferPreviewPanel({
  formData,
  children,
  className = "",
}: OfferPreviewPanelProps) {
  // Calculate completion percentage
  const requiredFields = [
    "merchant",
    "offerName",
    "description",
    "offerType",
    "startDate",
    "termsConditions",
  ];

  const completedFields = requiredFields.filter(
    (field) => formData[field] && formData[field].toString().trim() !== ""
  );

  const completionPercentage = Math.round(
    (completedFields.length / requiredFields.length) * 100
  );

  // Get offer type badge variant
  const getOfferTypeBadge = (type: string) => {
    const badgeMap: Record<string, { variant: string; label: string }> = {
      bogo: { variant: "default", label: "BOGO" },
      percent_off: { variant: "default", label: "% Off" },
      dollar_off: { variant: "default", label: "$ Off" },
      free: { variant: "default", label: "Free" },
      clk: { variant: "default", label: "CLK" },
      other: { variant: "outline", label: "Other" },
    };

    return badgeMap[type] || { variant: "outline", label: type };
  };

  const offerTypeBadge = formData.offerType
    ? getOfferTypeBadge(formData.offerType)
    : null;

  return (
    <div className={`flex flex-col w-full h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/20 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-medium">Offer Preview</h3>
            <p className="text-xs text-muted-foreground">
              Live preview of your offer
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {completionPercentage}% Complete
        </Badge>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="px-4 py-3 space-y-4">
          {/* Offer Card Preview */}
          <ShinyBorder isActive={completionPercentage > 50} borderRadius={8}>
            <Card className="p-4 bg-gradient-to-br from-white to-slate-50">
              {/* Merchant Logo Placeholder */}
              {formData.offerImagePreview && (
                <div className="mb-3">
                  <img
                    src={formData.offerImagePreview}
                    alt={formData.offerImageAlt || "Offer image"}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                </div>
              )}

              {/* Merchant Name */}
              {formData.merchant && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">
                      {formData.merchant.value?.[0]?.toUpperCase() ||
                        formData.merchant[0]?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-slate-700">
                    {formData.merchant.label || formData.merchant}
                  </span>
                </div>
              )}

              {/* Offer Title */}
              <h4 className="text-lg font-bold text-slate-900 mb-2">
                {formData.offerName || "Offer Title"}
              </h4>

              {/* Offer Type Badge */}
              {offerTypeBadge && (
                <Badge variant="default" className="mb-3">
                  {offerTypeBadge.label}
                </Badge>
              )}

              {/* Description */}
              <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                {formData.description ||
                  "Offer description will appear here..."}
              </p>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                {formData.startDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-blue-600" />
                    <span>
                      Start: {new Date(formData.startDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {formData.endDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-orange-600" />
                    <span>
                      End: {new Date(formData.endDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {formData.maxDiscount && formData.maxDiscount !== "0" && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3 text-green-600" />
                    <span>Max: ${formData.maxDiscount}</span>
                  </div>
                )}
                {formData.redemptionTypes &&
                  formData.redemptionTypes.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Ticket className="h-3 w-3 text-purple-600" />
                      <span>
                        {formData.redemptionTypes.length} redemption
                        {formData.redemptionTypes.length > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
              </div>

              {/* CTA Button Preview */}
              <button className="w-full mt-3 py-2 px-4 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                {formData.redemptionTypes?.includes("external_url")
                  ? "Get Offer"
                  : "Redeem Now"}
              </button>
            </Card>
          </ShinyBorder>

          {/* Offer Stats */}
          <ShinyBorder isActive={completionPercentage >= 80} borderRadius={8}>
            <Card className="p-3 bg-slate-50">
              <h4 className="text-sm font-medium text-slate-700 mb-2">
                Offer Summary
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-600">Type:</span>
                  <span className="ml-1 font-medium">
                    {offerTypeBadge?.label || "Not set"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600">Status:</span>
                  <span className="ml-1 font-medium text-orange-600">
                    Draft
                  </span>
                </div>
                <div>
                  <span className="text-slate-600">Duration:</span>
                  <span className="ml-1 font-medium">
                    {formData.startDate && formData.endDate
                      ? `${Math.ceil(
                          (new Date(formData.endDate).getTime() -
                            new Date(formData.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        )} days`
                      : formData.endDate
                        ? "Until " +
                          new Date(formData.endDate).toLocaleDateString()
                        : "Ongoing"}
                  </span>
                </div>
                <div>
                  <span className="text-slate-600">Redemptions:</span>
                  <span className="ml-1 font-medium">
                    {formData.usageLimitPerCustomer === "unlimited"
                      ? "Unlimited"
                      : formData.usageLimitPerCustomer || "1"}{" "}
                    per user
                  </span>
                </div>
              </div>
            </Card>
          </ShinyBorder>

          {/* AI Enhancement Section (passed as children) */}
          {children}

          {/* Empty State */}
          {!formData.merchant && !formData.offerName && (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-6 text-center">
              <Eye className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600 mb-1">
                No offer details yet
              </p>
              <p className="text-xs text-slate-500">
                Fill in the form to see a live preview here
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default OfferPreviewPanel;

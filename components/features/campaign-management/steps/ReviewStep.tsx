"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircleIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  RectangleGroupIcon,
  TagIcon,
  ClockIcon,
  DocumentTextIcon,
  MapPinIcon,
  DocumentArrowUpIcon,
} from "@heroicons/react/24/outline";

interface ReviewStepProps {
  formData: {
    name: string;
    partner_name: string;
    program_name: string;
    type: "promotional" | "targeted" | "seasonal";
    description: string;
    start_date: string;
    end_date: string;
    active: boolean;
    auto_activate: boolean;
    auto_deactivate: boolean;
    targeting_rules_filename?: string;
  };
  onSubmit: () => void;
  onPrevious: () => void;
}

export default function ReviewStep({
  formData,
  onSubmit,
  onPrevious,
}: ReviewStepProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return (
      date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Use 24-hour format for UTC
        timeZone: "UTC", // UTC timezone
      }) + " UTC"
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "promotional":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "targeted":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "seasonal":
        return "bg-orange-100 text-orange-800 border-orange-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case "promotional":
        return "🎉";
      case "targeted":
        return "🎯";
      case "seasonal":
        return "🗓️";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Campaign Summary */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <RectangleGroupIcon className="size-4" />
              <span>Campaign Summary</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0 space-y-5">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {formData.name}
            </h3>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`capitalize ${getTypeColor(formData.type)}`}
              >
                {getTypeEmoji(formData.type)} {formData.type}
              </Badge>
              <Badge
                variant="outline"
                className={
                  formData.active
                    ? "bg-green-100 text-green-800 border-green-300"
                    : "bg-gray-100 text-gray-800 border-gray-300"
                }
              >
                {formData.active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <BuildingOfficeIcon className="size-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Partner
                </p>
                <p className="text-sm text-foreground">
                  {formData.partner_name}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TagIcon className="size-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Program
                </p>
                <p className="text-sm text-foreground">
                  {formData.program_name}
                </p>
              </div>
            </div>
          </div>

          {formData.description && (
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-start gap-2 mb-2">
                <DocumentTextIcon className="size-4 text-muted-foreground mt-0.5" />
                <p className="text-sm font-medium text-muted-foreground">
                  Description
                </p>
              </div>
              <p className="text-sm text-foreground">{formData.description}</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Information */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-4" />
              <span>Campaign Schedule</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0 space-y-5">
          <div className="flex items-start gap-3">
            <CalendarIcon className="size-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Campaign Period
              </p>
              <p className="text-sm text-foreground">
                {formatDate(formData.start_date)} →{" "}
                {formatDate(formData.end_date)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Automation Settings */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <ClockIcon className="size-4" />
              <span>Automation Settings</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0 space-y-3">
          <div className="flex items-center gap-2">
            {formData.auto_activate ? (
              <CheckCircleIcon className="size-4 text-green-600" />
            ) : (
              <div className="size-4 rounded-full border-2 border-gray-300" />
            )}
            <span className="text-sm text-foreground">
              Auto-activate on start date
            </span>
          </div>
          <div className="flex items-center gap-2">
            {formData.auto_deactivate ? (
              <CheckCircleIcon className="size-4 text-green-600" />
            ) : (
              <div className="size-4 rounded-full border-2 border-gray-300" />
            )}
            <span className="text-sm text-foreground">
              Auto-deactivate on end date
            </span>
          </div>
        </div>
      </div>

      {/* Targeting Rules */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-4" />
              <span>Targeting Rules</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0">
          {formData.targeting_rules_filename ? (
            <div className="flex items-start gap-3">
              <DocumentArrowUpIcon className="size-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {formData.targeting_rules_filename}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Targeting rules file uploaded
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <MapPinIcon className="size-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground italic">
                  No targeting rules configured
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircleIcon className="size-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 mb-1">
              Ready to Create
            </h4>
            <p className="text-xs text-blue-800">
              Your campaign is configured and ready to be created. Click "Create
              Campaign" to finalize, or go back to make changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

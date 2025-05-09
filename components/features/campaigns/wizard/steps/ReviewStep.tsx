"use client";

import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/atoms/Badge";
import {
  XIcon,
  CheckIcon,
  CalendarIcon,
  UsersIcon,
  BanknoteIcon,
  ShareIcon,
  ImageIcon,
  ShoppingBagIcon,
} from "lucide-react";
import { CampaignState } from "@/lib/redux/slices/campaignSlice";
import Card from "@/components/atoms/Card/Card";

interface ReviewStepProps {
  formData: CampaignState["formData"];
}

// Safe access helper to handle possible undefined values
const safeAccess = <T,>(obj: any, path: string, defaultValue: T): T => {
  try {
    const keys = path.split(".");
    let result = obj;
    for (const key of keys) {
      if (result === undefined || result === null) return defaultValue;
      result = result[key];
    }
    return result === undefined || result === null
      ? defaultValue
      : (result as T);
  } catch (e) {
    console.warn(`Error accessing path: ${path}`, e);
    return defaultValue;
  }
};

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  // Make sure formData exists to avoid crashes
  const data = formData || {
    basicInfo: {},
    targeting: {},
    distribution: { channels: [], programs: [] },
    ads: [],
    budget: {},
  };

  // Format dates for display
  const startDate = safeAccess<string | null>(data, "basicInfo.startDate", null)
    ? format(
        new Date(safeAccess<string>(data, "basicInfo.startDate", "")),
        "MMMM d, yyyy"
      )
    : "Not set";

  const endDate = safeAccess<string | null>(data, "basicInfo.endDate", null)
    ? format(
        new Date(safeAccess<string>(data, "basicInfo.endDate", "")),
        "MMMM d, yyyy"
      )
    : "Not set";

  // Get estimated reach based on campaign weight
  const getEstimatedReach = () => {
    let baseReach = 0;
    switch (safeAccess<string>(data, "targeting.campaignWeight", "medium")) {
      case "small":
        baseReach = 50000;
        break;
      case "medium":
        baseReach = 100000;
        break;
      case "large":
        baseReach = 200000;
        break;
      default:
        baseReach = 100000;
    }

    // Safely access array lengths
    const programLength = safeAccess<any[]>(
      data,
      "distribution.programs",
      []
    ).length;
    const adLength = safeAccess<any[]>(data, "ads", []).length;

    // Adjust based on program count and ad count
    const programMultiplier = 1 + programLength * 0.1;
    const adMultiplier = 1 + adLength * 0.05;

    return Math.round(
      baseReach * programMultiplier * adMultiplier
    ).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="border rounded-md p-4 space-y-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h4 className="font-medium">Basic Information</h4>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground">Name:</span>
            <span className="col-span-2 font-medium">
              {safeAccess<string>(data, "basicInfo.name", "Untitled Campaign")}
            </span>

            <span className="text-muted-foreground">Type:</span>
            <span className="col-span-2">
              {safeAccess<string>(
                data,
                "basicInfo.campaignType",
                "Advertising"
              )}
            </span>

            <span className="text-muted-foreground">Description:</span>
            <span className="col-span-2">
              {safeAccess<string>(
                data,
                "basicInfo.description",
                "No description"
              )}
            </span>

            <span className="text-muted-foreground">Start Date:</span>
            <span className="col-span-2">{startDate}</span>

            <span className="text-muted-foreground">End Date:</span>
            <span className="col-span-2">{endDate}</span>
          </div>
        </div>

        {/* Targeting Information */}
        <div className="border rounded-md p-4 space-y-3">
          <div className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5 text-primary" />
            <h4 className="font-medium">Targeting</h4>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Locations:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {safeAccess<any[]>(data, "targeting.locations", []).length >
                0 ? (
                  safeAccess<any[]>(data, "targeting.locations", []).map(
                    (loc) => (
                      <Badge
                        key={loc.id}
                        variant="secondary"
                        className="text-xs"
                      >
                        {loc.type === "state"
                          ? "State"
                          : loc.type === "msa"
                            ? "MSA"
                            : "ZIP"}
                        : {loc.value}
                      </Badge>
                    )
                  )
                ) : (
                  <span className="text-gray-500">None specified</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-muted-foreground">Gender:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {safeAccess<any[]>(data, "targeting.gender", []).length > 0 ? (
                  safeAccess<any[]>(data, "targeting.gender", []).map((g) => (
                    <Badge key={g} variant="secondary" className="text-xs">
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">All genders</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <span className="text-muted-foreground">Campaign Weight:</span>
              <span className="col-span-2 capitalize">
                {safeAccess<string>(data, "targeting.campaignWeight", "medium")}
              </span>
            </div>
          </div>
        </div>

        {/* Distribution Information */}
        <div className="border rounded-md p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ShareIcon className="w-5 h-5 text-primary" />
            <h4 className="font-medium">Distribution</h4>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <span className="text-muted-foreground">Channels:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {safeAccess<any[]>(data, "distribution.channels", []).length >
                0 ? (
                  safeAccess<any[]>(data, "distribution.channels", []).map(
                    (channel) => (
                      <Badge
                        key={channel}
                        variant="secondary"
                        className="text-xs"
                      >
                        {channel.charAt(0).toUpperCase() + channel.slice(1)}
                      </Badge>
                    )
                  )
                ) : (
                  <span className="text-gray-500">None specified</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-muted-foreground">Programs:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {safeAccess<any[]>(data, "distribution.programs", []).length >
                0 ? (
                  safeAccess<any[]>(data, "distribution.programs", []).map(
                    (program) => (
                      <Badge
                        key={program}
                        variant="secondary"
                        className="text-xs"
                      >
                        {program.charAt(0).toUpperCase() + program.slice(1)}
                      </Badge>
                    )
                  )
                ) : (
                  <span className="text-gray-500">None specified</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ads Information */}
        <div className="border rounded-md p-4 space-y-3">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <h4 className="font-medium">Advertisements</h4>
          </div>

          <div className="space-y-3 text-sm">
            {safeAccess<any[]>(data, "ads", []).length > 0 ? (
              safeAccess<any[]>(data, "ads", []).map((ad, index) => (
                <Card key={ad.id} className="p-3 border">
                  <div className="flex justify-between">
                    <div className="font-medium">
                      Ad #{index + 1}: {ad.merchantName}
                    </div>
                    <Badge variant="outline">
                      {safeAccess<any[]>(ad, "mediaAssets", []).length} asset
                      {safeAccess<any[]>(ad, "mediaAssets", []).length !== 1
                        ? "s"
                        : ""}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <div>
                      Media Types:{" "}
                      {safeAccess<any[]>(ad, "mediaType", []).join(", ") ||
                        "None"}
                    </div>
                    <div className="mt-1">
                      Activation: $
                      {safeAccess<number>(ad, "costPerActivation", 0).toFixed(
                        2
                      )}{" "}
                      | Redemption: $
                      {safeAccess<number>(ad, "costPerRedemption", 0).toFixed(
                        2
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="py-2 text-center text-gray-500">
                <div className="flex justify-center mb-2">
                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                </div>
                No advertisements created
              </div>
            )}
          </div>
        </div>

        {/* Budget Information */}
        <div className="border rounded-md p-4 space-y-3 md:col-span-2">
          <div className="flex items-center gap-2">
            <BanknoteIcon className="w-5 h-5 text-primary" />
            <h4 className="font-medium">Budget</h4>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 text-sm">
            <div className="col-span-3">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Maximum Budget:</span>
                <span className="col-span-2 font-medium">
                  $
                  {safeAccess<number>(
                    data,
                    "budget.maxBudget",
                    0
                  ).toLocaleString()}
                </span>

                <span className="text-muted-foreground">Estimated Reach:</span>
                <span className="col-span-2">
                  {getEstimatedReach()} impressions
                </span>

                <span className="text-muted-foreground">
                  Cost Per Impression:
                </span>
                <span className="col-span-2">
                  $
                  {(
                    safeAccess<number>(data, "budget.maxBudget", 0) /
                    (parseInt(getEstimatedReach().replace(/,/g, "")) || 1)
                  ) // Avoid division by zero
                    .toFixed(4)}
                </span>
              </div>
            </div>

            <div className="col-span-3">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-muted-foreground">Loyalty Programs:</span>
                <span className="col-span-2">
                  {safeAccess<any[]>(data, "distribution.programs", []).length}{" "}
                  selected
                </span>

                <span className="text-muted-foreground">Advertisements:</span>
                <span className="col-span-2">
                  {safeAccess<any[]>(data, "ads", []).length} created
                </span>

                <span className="text-muted-foreground">
                  Distribution Channels:
                </span>
                <span className="col-span-2">
                  {safeAccess<any[]>(data, "distribution.channels", []).length}{" "}
                  selected
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-start">
          <div className="p-1 rounded-full bg-blue-100 mr-3 mt-0.5">
            <CheckIcon className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h5 className="font-medium text-blue-800">Ready to Launch</h5>
            <p className="text-sm text-blue-700 mt-1">
              Your campaign details are complete. Click "Create Campaign" below
              to launch your campaign.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;

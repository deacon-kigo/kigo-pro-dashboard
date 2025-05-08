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
} from "lucide-react";
import { CampaignState } from "@/lib/redux/slices/campaignSlice";

interface ReviewStepProps {
  formData: CampaignState["formData"];
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  // Format dates for display
  const startDate = formData.basicInfo.startDate
    ? format(new Date(formData.basicInfo.startDate), "MMMM d, yyyy")
    : "Not set";

  const endDate = formData.basicInfo.endDate
    ? format(new Date(formData.basicInfo.endDate), "MMMM d, yyyy")
    : "Not set";

  // Get estimated reach based on campaign weight
  const getEstimatedReach = () => {
    switch (formData.targeting.campaignWeight) {
      case "small":
        return "50,000";
      case "medium":
        return "100,000";
      case "large":
        return "200,000";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Review Your Campaign</h3>
      <p className="text-sm text-muted-foreground mb-6">
        Please review your campaign details before creating.
      </p>

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
              {formData.basicInfo.name}
            </span>

            <span className="text-muted-foreground">Type:</span>
            <span className="col-span-2">
              {formData.basicInfo.campaignType}
            </span>

            <span className="text-muted-foreground">Description:</span>
            <span className="col-span-2">{formData.basicInfo.description}</span>

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
                {formData.targeting.locations.length > 0 ? (
                  formData.targeting.locations.map((loc) => (
                    <Badge key={loc.id} variant="secondary" className="text-xs">
                      {loc.type === "state"
                        ? "State"
                        : loc.type === "msa"
                          ? "MSA"
                          : "ZIP"}
                      : {loc.value}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">None specified</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-muted-foreground">Gender:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.targeting.gender.length > 0 ? (
                  formData.targeting.gender.map((g) => (
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
                {formData.targeting.campaignWeight}
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
                {formData.distribution.channels.length > 0 ? (
                  formData.distribution.channels.map((channel) => (
                    <Badge
                      key={channel}
                      variant="secondary"
                      className="text-xs"
                    >
                      {channel.charAt(0).toUpperCase() + channel.slice(1)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">None specified</span>
                )}
              </div>
            </div>

            <div>
              <span className="text-muted-foreground">Partners:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.distribution.partners.length > 0 ? (
                  formData.distribution.partners.map((partner) => (
                    <Badge
                      key={partner}
                      variant="secondary"
                      className="text-xs"
                    >
                      {partner.charAt(0).toUpperCase() + partner.slice(1)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-gray-500">None specified</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Budget Information */}
        <div className="border rounded-md p-4 space-y-3">
          <div className="flex items-center gap-2">
            <BanknoteIcon className="w-5 h-5 text-primary" />
            <h4 className="font-medium">Budget</h4>
          </div>

          <div className="grid grid-cols-3 gap-2 text-sm">
            <span className="text-muted-foreground">Maximum Budget:</span>
            <span className="col-span-2 font-medium">
              ${formData.budget.maxBudget.toLocaleString()}
            </span>

            <span className="text-muted-foreground">Estimated Reach:</span>
            <span className="col-span-2">
              {getEstimatedReach()} impressions
            </span>

            <span className="text-muted-foreground">Cost Per Impression:</span>
            <span className="col-span-2">
              $
              {(
                formData.budget.maxBudget /
                parseInt(getEstimatedReach().replace(/,/g, ""))
              ).toFixed(4)}
            </span>
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

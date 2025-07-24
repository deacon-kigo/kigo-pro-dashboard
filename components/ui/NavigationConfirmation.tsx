/**
 * Navigation Confirmation Component
 *
 * Generative UI component that renders in chat to confirm navigation actions.
 * Inspired by CopilotKit demo-banking patterns.
 */

import React from "react";
import { Button } from "./button";
import { Badge } from "./badge";
import { ArrowRightIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface NavigationConfirmationProps {
  destination: string;
  intent: string;
  title: string;
  description: string;
  context?: {
    preActions?: string[];
    postActions?: string[];
    guidance?: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

export function NavigationConfirmation({
  destination,
  intent,
  title,
  description,
  context,
  onConfirm,
  onCancel,
}: NavigationConfirmationProps) {
  const getIntentIcon = (intent: string) => {
    switch (intent) {
      case "create_ad":
        return "🚀";
      case "view_analytics":
        return "📊";
      case "manage_campaigns":
        return "📋";
      case "edit_filters":
        return "🎯";
      default:
        return "🔗";
    }
  };

  const getDestinationName = (destination: string) => {
    const pathNames: Record<string, string> = {
      "/campaign-manager/ads-create": "Ad Creation Page",
      "/analytics": "Analytics Dashboard",
      "/campaigns": "Campaign Manager",
      "/filters": "Product Filters",
      "/dashboard": "Dashboard",
    };
    return pathNames[destination] || destination;
  };

  return (
    <div className="navigation-confirmation bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 my-3 max-w-md">
      <div className="flex items-start gap-3">
        <div className="text-2xl">{getIntentIcon(intent)}</div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-gray-900">{title}</h4>
            <Badge variant="outline" className="text-xs">
              Navigation
            </Badge>
          </div>

          <p className="text-sm text-gray-600 mb-3">{description}</p>

          <div className="bg-white rounded-md p-3 mb-3 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-medium text-gray-500">
                  Destination
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {getDestinationName(destination)}
                </div>
              </div>
              <ArrowRightIcon className="w-4 h-4 text-blue-500" />
            </div>
          </div>

          {context?.guidance && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-2 mb-3">
              <div className="text-xs font-medium text-amber-800 mb-1">
                What happens next:
              </div>
              <div className="text-xs text-amber-700">{context.guidance}</div>
            </div>
          )}

          {(context?.preActions?.length || context?.postActions?.length) && (
            <div className="text-xs text-gray-500 mb-3">
              {context.preActions?.length && (
                <div>Before: {context.preActions.join(", ")}</div>
              )}
              {context.postActions?.length && (
                <div>After: {context.postActions.join(", ")}</div>
              )}
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={onConfirm}
              size="sm"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <span>Take me there</span>
              <ArrowRightIcon className="w-3 h-3 ml-1" />
            </Button>

            <Button
              onClick={onCancel}
              variant="outline"
              size="sm"
              className="px-3"
            >
              <XMarkIcon className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

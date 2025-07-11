"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/atoms/Button";
import {
  X,
  Calendar,
  MapPin,
  Target,
  DollarSign,
  BarChart3,
  Image,
} from "lucide-react";
import { Ad, formatDateTime, formatChannels } from "./adColumns";

interface AdDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ad: Ad | null;
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 border-green-200";
    case "Published":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Paused":
      return "bg-orange-100 text-orange-800 border-orange-200";
    case "Draft":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "Ended":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export function AdDetailModal({ isOpen, onClose, ad }: AdDetailModalProps) {
  if (!ad) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-semibold">
              {ad.name}
            </DialogTitle>
            <DialogDescription>
              Detailed information about this advertisement
            </DialogDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-base font-medium text-gray-500">
                Status
              </label>
              <div className="mt-1">
                <Badge className={getStatusBadgeColor(ad.status)}>
                  {ad.status}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-base font-medium text-gray-500">
                Created By
              </label>
              <p className="mt-1 text-base text-gray-900">{ad.createdBy}</p>
            </div>
          </div>

          {/* Merchant and Offer */}
          <div className="space-y-4">
            <div>
              <label className="text-base font-medium text-gray-500 flex items-center">
                <Target className="h-4 w-4 mr-2" />
                Merchant and Offer
              </label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900">{ad.merchantName}</p>
                <p className="text-base text-gray-600">{ad.offerName}</p>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="space-y-4">
            <label className="text-base font-medium text-gray-500 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Start Date & Time
                </p>
                <p className="mt-1 text-base text-gray-900">
                  {formatDateTime(ad.startDateTime)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  End Date & Time
                </p>
                <p className="mt-1 text-base text-gray-900">
                  {formatDateTime(ad.endDateTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Budget (v2 feature) */}
          {ad.totalBudgetCap && (
            <div>
              <label className="text-base font-medium text-gray-500 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Budget Cap
              </label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-900">
                  ${ad.totalBudgetCap.toLocaleString()}
                </p>
              </div>
            </div>
          )}

          {/* Reach (v2 feature) */}
          {ad.reach && (
            <div>
              <label className="text-base font-medium text-gray-500 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2" />
                Reach
              </label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-semibold text-gray-900">
                  {ad.reach.toLocaleString()} people
                </p>
              </div>
            </div>
          )}

          {/* Channels */}
          <div>
            <label className="text-base font-medium text-gray-500 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Distribution Channels
            </label>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex flex-wrap gap-2">
                {ad.channels && ad.channels.length > 0 ? (
                  ad.channels.map((channel, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {channel}
                    </Badge>
                  ))
                ) : (
                  <p className="text-base text-gray-500">
                    No channels configured
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Assets */}
          <div>
            <label className="text-base font-medium text-gray-500 flex items-center">
              <Image className="h-4 w-4 mr-2" />
              Creative Assets
            </label>
            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-base text-gray-900">
                  {ad.numberOfAssets} asset{ad.numberOfAssets !== 1 ? "s" : ""}{" "}
                  uploaded
                </p>
                <Badge variant="outline" className="text-sm">
                  {ad.numberOfAssets > 0 ? "Complete" : "Pending"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <p className="font-medium">Created</p>
                <p>{formatDateTime(ad.createdDate)}</p>
              </div>
              <div>
                <p className="font-medium">Last Modified</p>
                <p>{formatDateTime(ad.lastModified)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={() => {
              console.log("Navigate to edit:", ad.id);
              // TODO: Navigate to edit interface
            }}
          >
            Edit Ad
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

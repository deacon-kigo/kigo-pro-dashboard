"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { CheckCircle, RocketIcon, PauseIcon } from "lucide-react";

interface AdGroupCreationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: () => void;
  onViewAdGroups: () => void;
  adGroupName: string;
  selectedAdsCount: number;
  assignedProgramsCount: number;
}

const AdGroupCreationSuccessModal: React.FC<
  AdGroupCreationSuccessModalProps
> = ({
  isOpen,
  onClose,
  onPublish,
  onViewAdGroups,
  adGroupName,
  selectedAdsCount,
  assignedProgramsCount,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
            <CheckCircle className="w-8 h-8 text-green-700" />
          </div>
          <DialogTitle className="text-center text-xl font-semibold">
            Ad Group Created Successfully!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Ad Group Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Ad Group Name:
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {adGroupName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Ads Included:
              </span>
              <Badge variant="outline" className="text-xs">
                {selectedAdsCount} ads
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Program Assignments:
              </span>
              <Badge variant="outline" className="text-xs">
                {assignedProgramsCount} programs
              </Badge>
            </div>
          </div>

          {/* Status Information */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <PauseIcon className="w-5 h-5 text-amber-700 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-amber-900 mb-1">
                  Ad Group Created (Not Published)
                </h4>
                <p className="text-sm text-amber-900">
                  Your ad group has been successfully created and program
                  assignments have been completed. However, it's currently in
                  draft status and won't be visible to users until published.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              onClick={onPublish}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <RocketIcon className="w-4 h-4 mr-2" />
              Publish Ad Group Now
            </Button>

            <Button
              variant="outline"
              onClick={onViewAdGroups}
              className="w-full"
            >
              View in Ad Groups List
            </Button>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500 text-center">
            You can always publish or manage your ad group later from the Ad
            Groups list.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdGroupCreationSuccessModal;

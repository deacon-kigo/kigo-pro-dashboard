"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/molecules/alert-dialog/AlertDialog";
import { Button } from "@/components/atoms/Button";

interface AdGroupCreationConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAndPublish: () => void;
  onCreateWithoutPublish: () => void;
  adGroupName: string;
  selectedAdsCount: number;
  assignedProgramsCount: number;
}

const AdGroupCreationConfirmModal: React.FC<
  AdGroupCreationConfirmModalProps
> = ({
  isOpen,
  onClose,
  onCreateAndPublish,
  onCreateWithoutPublish,
  adGroupName,
  selectedAdsCount,
  assignedProgramsCount,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-lg">
        <AlertDialogHeader className="pb-6">
          <AlertDialogTitle>Create Ad Group</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 pt-2">
            <div>
              Ready to create <strong>"{adGroupName}"</strong> with{" "}
              <strong>{selectedAdsCount} ads</strong> and{" "}
              <strong>{assignedProgramsCount} program assignments</strong>?
            </div>
            <div>
              Create and publish will make the ad group live immediately. Create
              without publishing will save it as inactive for later review.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="outline" onClick={onCreateAndPublish}>
            Create and Publish
          </Button>
          <AlertDialogAction onClick={onCreateWithoutPublish}>
            Create without Publishing
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdGroupCreationConfirmModal;

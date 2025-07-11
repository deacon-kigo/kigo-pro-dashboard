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
import { Ad } from "./adColumns";

interface StatusChangeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  ad: Ad | null;
  newStatus: string;
}

const getStatusChangeMessage = (
  currentStatus: string,
  newStatus: string,
  adName: string
) => {
  const statusMessages = {
    Active: "activate and start delivering",
    Paused: "pause and stop delivering",
    Published: "publish and make available for activation",
    Ended: "end and permanently stop",
    Draft: "move back to draft status",
  };

  const action =
    statusMessages[newStatus as keyof typeof statusMessages] ||
    `change to ${newStatus}`;

  return {
    title: `Confirm Status Change`,
    description: `Are you sure you want to ${action} the ad "${adName}"?`,
    actionText: newStatus === "Ended" ? "End Ad" : `Change to ${newStatus}`,
    isDestructive: newStatus === "Ended",
  };
};

export function StatusChangeDialog({
  isOpen,
  onClose,
  onConfirm,
  ad,
  newStatus,
}: StatusChangeDialogProps) {
  if (!ad) return null;

  const { title, description, actionText, isDestructive } =
    getStatusChangeMessage(ad.status, newStatus, ad.name);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
            {newStatus === "Active" && (
              <div className="mt-2 text-base text-gray-600">
                This ad will start delivering immediately based on its schedule
                and targeting settings.
              </div>
            )}
            {newStatus === "Paused" && (
              <div className="mt-2 text-base text-gray-600">
                This ad will stop delivering but can be reactivated later.
              </div>
            )}
            {newStatus === "Ended" && (
              <div className="mt-2 text-base text-red-600 font-medium">
                This action cannot be undone. The ad will be permanently
                stopped.
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={isDestructive ? "bg-red-600 hover:bg-red-700" : ""}
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

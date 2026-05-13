"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/molecules/dialog";
import MerchantCreationInline, {
  type MerchantData,
} from "@/components/features/offer-manager/p0-merchant/MerchantCreationInline";

interface AddMerchantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (merchant: MerchantData) => void;
}

export default function AddMerchantDialog({
  open,
  onOpenChange,
  onSave,
}: AddMerchantDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white border border-gray-200 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Add Merchant
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Create a new merchant. Logo, address, and website help downstream
            offer creation.
          </DialogDescription>
        </DialogHeader>

        {/* MerchantCreationInline owns its own Save/Cancel footer,
            so we intentionally do NOT render a DialogFooter here. */}
        <div className="max-h-[70vh] overflow-y-auto">
          <MerchantCreationInline
            onSave={onSave}
            onCancel={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

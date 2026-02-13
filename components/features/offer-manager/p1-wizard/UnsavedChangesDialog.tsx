"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/molecules/alert-dialog/AlertDialog";
import { Button } from "@/components/ui/button";

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveDraft: () => void;
  onDiscard: () => void;
  isSaving?: boolean;
}

export function UnsavedChangesDialog({
  isOpen,
  onClose,
  onSaveDraft,
  onDiscard,
  isSaving = false,
}: UnsavedChangesDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes that will be lost if you leave. Would you
            like to save your progress as a draft?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel disabled={isSaving}>Cancel</AlertDialogCancel>
          <Button
            variant="outline"
            onClick={onDiscard}
            disabled={isSaving}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Discard
          </Button>
          <AlertDialogAction onClick={onSaveDraft} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save as Draft"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

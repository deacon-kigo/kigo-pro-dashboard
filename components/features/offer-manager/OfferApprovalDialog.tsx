"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

interface OfferApprovalDialogProps {
  isOpen: boolean;
  offerConfig: any;
  campaignSetup: any;
  validationResults: any[];
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
}

export default function OfferApprovalDialog({
  isOpen,
  offerConfig,
  campaignSetup,
  validationResults,
  onApprove,
  onReject,
  onClose,
}: OfferApprovalDialogProps) {
  const hasBlockingIssues = validationResults.some(
    (v) => v.status === "failed"
  );
  const hasWarnings = validationResults.some((v) => v.status === "warning");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Offer Approval Required
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Review the offer details and validation results before launching
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Offer Summary */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded flex items-center justify-center bg-blue-100 text-blue-600 text-sm">
                📋
              </span>
              Offer Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Business Objective</p>
                <p className="text-gray-900 font-medium">
                  {offerConfig?.objective || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Program Type</p>
                <p className="text-gray-900 font-medium">
                  {offerConfig?.program_type || "General"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Offer Type</p>
                <p className="text-gray-900 font-medium">
                  {offerConfig?.offer_type || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Offer Value</p>
                <p className="text-gray-900 font-medium">
                  {offerConfig?.offer_value || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Delivery Channel</p>
                <p className="text-gray-900 font-medium">
                  {campaignSetup?.delivery_channel || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Campaign Duration</p>
                <p className="text-gray-900 font-medium">
                  {campaignSetup?.campaign_duration || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Validation Results */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded flex items-center justify-center bg-green-100 text-green-600 text-sm">
                ✓
              </span>
              Validation Results
            </h3>
            <div className="space-y-2">
              {validationResults.length > 0 ? (
                validationResults.map((result, index) => (
                  <div
                    key={index}
                    className={`
                      flex items-start gap-3 p-3 rounded-lg border
                      ${
                        result.status === "passed"
                          ? "bg-green-50 border-green-200"
                          : result.status === "warning"
                            ? "bg-yellow-50 border-yellow-200"
                            : "bg-red-50 border-red-200"
                      }
                    `}
                  >
                    {result.status === "passed" ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : result.status === "warning" ? (
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-medium text-sm text-gray-900">
                        {result.check || "Validation Check"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {result.message || "No details available"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      All Checks Passed
                    </p>
                    <p className="text-sm text-gray-600">
                      No validation issues found
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Warnings */}
          {hasWarnings && !hasBlockingIssues && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-900">Warning</p>
                  <p className="text-sm text-yellow-700">
                    Some non-critical issues were found. You can proceed with
                    approval, but consider reviewing the warnings.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Blocking Issues */}
          {hasBlockingIssues && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">
                    Blocking Issues Found
                  </p>
                  <p className="text-sm text-red-700">
                    Critical validation errors must be resolved before this
                    offer can be approved.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onReject}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Reject & Revise
          </Button>
          <Button
            onClick={onApprove}
            disabled={hasBlockingIssues}
            className={
              hasBlockingIssues
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }
          >
            {hasBlockingIssues ? "Cannot Approve" : "Approve & Launch"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

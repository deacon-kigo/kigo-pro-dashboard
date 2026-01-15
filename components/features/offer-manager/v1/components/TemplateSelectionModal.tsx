"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BoltIcon,
  Cog6ToothIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface TemplateSelectionModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (template: "express" | "custom") => void;
}

export function TemplateSelectionModal({
  open,
  onClose,
  onSelect,
}: TemplateSelectionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Choose Offer Template
          </DialogTitle>
          <DialogDescription className="text-base">
            Select a template to get started creating your offer
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          {/* Express Template */}
          <Card
            className="relative p-6 border-2 border-blue-200 bg-blue-50/50 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => onSelect("express")}
          >
            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                RECOMMENDED
              </span>
            </div>

            <div className="mb-4 mt-2">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <BoltIcon className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Express Template
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Quick and easy offer creation for online US offers with static
                promo codes
              </p>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Online-only redemption
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  United States only
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Single static promo code
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Simplified 2-step process
                </span>
              </div>
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 group-hover:bg-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                onSelect("express");
              }}
            >
              <BoltIcon className="h-4 w-4 mr-2" />
              Start with Express
            </Button>
          </Card>

          {/* Custom Template (V2 Advanced) */}
          <Card
            className="relative p-6 border-2 border-gray-200 hover:border-gray-400 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => onSelect("custom")}
          >
            <div className="mb-4">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                <Cog6ToothIcon className="h-7 w-7 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Custom Template
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Full control with advanced features for complex offer
                configurations
              </p>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Multiple redemption methods
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Location-specific offers
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Unique/batch promo codes
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircleIcon className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">
                  Advanced customization
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50 group-hover:bg-gray-50"
              onClick={(e) => {
                e.stopPropagation();
                onSelect("custom");
              }}
            >
              <Cog6ToothIcon className="h-4 w-4 mr-2" />
              Start with Custom
            </Button>
          </Card>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-500 text-center">
            Need help choosing?{" "}
            <span className="font-medium text-blue-600">
              Use Express for most offers
            </span>{" "}
            - it covers 80% of use cases
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

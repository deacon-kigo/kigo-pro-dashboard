"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  PrinterIcon,
} from "@heroicons/react/24/outline";

/**
 * Step 4: Redemption Details
 *
 * Simple step for external URL and promo code.
 */

interface StepRedemptionProps {
  formData: {
    externalUrl?: string;
    promoCode?: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export default function StepRedemption({
  formData,
  onUpdate,
}: StepRedemptionProps) {
  return (
    <div className="space-y-6">
      {/* Redemption Method Section */}
      <div className="rounded-md border">
        <div className="flex items-center gap-2 px-4 py-3 font-medium border-b bg-muted/30">
          <DevicePhoneMobileIcon className="size-4" />
          <span>Redemption Method</span>
        </div>
        <div className="px-4 pb-4 pt-4 space-y-5">
          <div>
            <Label>Redemption Types* (Pre-selected for Express)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              {/* Mobile - Disabled */}
              <Card className="p-3 opacity-50 cursor-not-allowed bg-gray-50 border border-gray-200">
                <div className="flex items-start gap-2">
                  <input type="checkbox" disabled className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <DevicePhoneMobileIcon className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-sm text-gray-500">
                        Mobile
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Show in mobile app
                    </p>
                  </div>
                </div>
              </Card>

              {/* Online Print - Disabled */}
              <Card className="p-3 opacity-50 cursor-not-allowed bg-gray-50 border border-gray-200">
                <div className="flex items-start gap-2">
                  <input type="checkbox" disabled className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <PrinterIcon className="h-4 w-4 text-gray-400" />
                      <span className="font-medium text-sm text-gray-500">
                        Online Print
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Print from website
                    </p>
                  </div>
                </div>
              </Card>

              {/* External URL - Selected */}
              <Card className="p-3 bg-blue-50 border-primary border-2">
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked disabled className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <GlobeAltIcon className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">External Link</span>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Redirect to website
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Two Column Grid for URL and Code */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <Label htmlFor="externalUrl">External URL*</Label>
              <Input
                id="externalUrl"
                type="url"
                placeholder="https://example.com/offer"
                value={formData.externalUrl || ""}
                onChange={(e) => onUpdate("externalUrl", e.target.value)}
              />
              <p className="text-muted-foreground text-sm mt-2">
                Customers redirected here when they click "Redeem"
              </p>
            </div>

            <div>
              <Label htmlFor="promoCode">Static Promo Code*</Label>
              <Input
                id="promoCode"
                placeholder="e.g., SAVE20"
                value={formData.promoCode || ""}
                onChange={(e) =>
                  onUpdate("promoCode", e.target.value.toUpperCase())
                }
                className="font-mono text-lg"
                maxLength={20}
              />
              <p className="text-muted-foreground text-sm mt-2">
                This single code will be shown to all customers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Box */}
      <div className="rounded-md border">
        <div className="flex items-center gap-2 px-4 py-3 font-medium border-b bg-muted/30">
          <GlobeAltIcon className="size-4" />
          <span>Preview</span>
        </div>
        <div className="px-4 pb-4 pt-4">
          <p className="text-muted-foreground text-sm mb-3">
            Customer will see:
          </p>
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-md border">
            <div>
              <p className="text-sm text-muted-foreground">
                Use code at checkout:
              </p>
              <p className="font-mono text-lg font-bold text-primary">
                {formData.promoCode || "CODE"}
              </p>
            </div>
            <button
              type="button"
              className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md"
              disabled
            >
              Redeem Online
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { StepRedemption };

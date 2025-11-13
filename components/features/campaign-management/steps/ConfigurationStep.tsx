"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

interface ConfigurationStepProps {
  formData: {
    start_date: string;
    end_date: string;
    active: boolean;
    auto_activate: boolean;
    auto_deactivate: boolean;
  };
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function ConfigurationStep({
  formData,
  onUpdate,
  onNext,
  onPrevious,
}: ConfigurationStepProps) {
  // Calculate if dates are valid
  const startDate = formData.start_date ? new Date(formData.start_date) : null;
  const endDate = formData.end_date ? new Date(formData.end_date) : null;
  const datesValid = !startDate || !endDate || startDate <= endDate;

  return (
    <div className="space-y-4">
      {/* Campaign Configuration - Single Group */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <Cog6ToothIcon className="size-4" />
              <span>Campaign Configuration</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date & Time*</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={(e) => onUpdate("start_date", e.target.value)}
              />
              <p className="mt-2 text-muted-foreground text-sm">
                When the campaign becomes active (CST timezone)
              </p>
            </div>

            <div>
              <Label htmlFor="end_date">End Date & Time*</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e) => onUpdate("end_date", e.target.value)}
                min={formData.start_date || undefined}
              />
              <p className="mt-2 text-muted-foreground text-sm">
                When the campaign ends (CST timezone)
              </p>
            </div>
          </div>

          {!datesValid && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive">
                End date must be after start date
              </p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex-1">
              <Label htmlFor="active">Active Status</Label>
              <p className="mt-2 text-muted-foreground text-sm">
                Set whether this campaign is currently active
              </p>
            </div>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => onUpdate("active", checked)}
            />
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="auto_activate"
              checked={formData.auto_activate}
              onCheckedChange={(checked) => onUpdate("auto_activate", checked)}
            />
            <div className="flex-1">
              <Label htmlFor="auto_activate" className="cursor-pointer">
                Auto-Activate
              </Label>
              <p className="mt-2 text-muted-foreground text-sm">
                Automatically activate campaign on start date
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="auto_deactivate"
              checked={formData.auto_deactivate}
              onCheckedChange={(checked) =>
                onUpdate("auto_deactivate", checked)
              }
            />
            <div className="flex-1">
              <Label htmlFor="auto_deactivate" className="cursor-pointer">
                Auto-Deactivate
              </Label>
              <p className="mt-2 text-muted-foreground text-sm">
                Automatically deactivate campaign on end date
              </p>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-blue-900">
              Automation Tips
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Enable auto-activate to ensure your campaign starts on time
              </li>
              <li>
                • Enable auto-deactivate to prevent campaigns from running past
                their end date
              </li>
              <li>
                • You can manually override these settings at any time from the
                dashboard
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

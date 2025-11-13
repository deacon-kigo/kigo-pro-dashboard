"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
  Cog6ToothIcon,
  DocumentArrowUpIcon,
  XCircleIcon,
  CheckCircleIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

interface ConfigurationStepProps {
  formData: {
    start_date: string;
    end_date: string;
    has_end_date: boolean;
    active: boolean;
    auto_activate: boolean;
    auto_deactivate: boolean;
    targeting_rules_file?: File | null;
    targeting_rules_filename?: string;
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
  const datesValid =
    !formData.has_end_date || !startDate || !endDate || startDate <= endDate;

  const [uploadError, setUploadError] = useState<string | null>(null);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (Excel files)
    const validTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".xlsx",
      ".xls",
    ];
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const isValidType =
      validTypes.includes(file.type) ||
      fileExtension === "xlsx" ||
      fileExtension === "xls";

    if (!isValidType) {
      setUploadError("Please upload a valid Excel file (.xlsx or .xls)");
      setTimeout(() => setUploadError(null), 5000);
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File size should be less than 10MB");
      setTimeout(() => setUploadError(null), 5000);
      return;
    }

    onUpdate("targeting_rules_file", file);
    onUpdate("targeting_rules_filename", file.name);
    setUploadError(null);
  };

  // Handle file removal
  const handleFileRemove = () => {
    onUpdate("targeting_rules_file", null);
    onUpdate("targeting_rules_filename", "");
  };

  // Convert string dates to Date objects for DateTimePicker
  const startDateTime = formData.start_date
    ? new Date(formData.start_date)
    : undefined;
  const endDateTime = formData.end_date
    ? new Date(formData.end_date)
    : undefined;

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      onUpdate("start_date", date.toISOString());
    } else {
      onUpdate("start_date", "");
    }
  };

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      onUpdate("end_date", date.toISOString());
    } else {
      onUpdate("end_date", "");
    }
  };

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
          <div>
            <Label htmlFor="start_date">Start Date & Time*</Label>
            <DateTimePicker
              date={startDateTime}
              onSelect={handleStartDateChange}
            />
            <p className="mt-2 text-muted-foreground text-sm">
              When the campaign becomes active (24-hour UTC)
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Checkbox
                id="has_end_date"
                checked={formData.has_end_date}
                onCheckedChange={(checked) => {
                  onUpdate("has_end_date", checked);
                  // Clear end date if unchecking
                  if (!checked) {
                    onUpdate("end_date", "");
                  }
                }}
              />
              <div className="flex-1">
                <Label htmlFor="has_end_date" className="cursor-pointer">
                  Set End Date
                </Label>
                <p className="mt-1 text-muted-foreground text-sm">
                  Specify when the campaign should end (leave unchecked for
                  ongoing campaigns)
                </p>
              </div>
            </div>

            {formData.has_end_date && (
              <div className="pl-7">
                <Label htmlFor="end_date">End Date & Time</Label>
                <DateTimePicker
                  date={endDateTime}
                  onSelect={handleEndDateChange}
                />
                <p className="mt-2 text-muted-foreground text-sm">
                  When the campaign ends (24-hour UTC)
                </p>
              </div>
            )}
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

      {/* Targeting Rules Configuration */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-4" />
              <span>Targeting Rules</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0 space-y-5">
          <div>
            <Label htmlFor="targeting_rules">
              Upload Targeting Rules (Optional)
            </Label>
            <div className="mt-2">
              {!formData.targeting_rules_filename ? (
                <div className="border-2 border-dashed rounded-lg border-gray-300 p-6 text-center hover:border-blue-400 transition-colors">
                  <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-3">
                    <label
                      htmlFor="targeting-rules-upload"
                      className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                    >
                      <span className="text-sm">Upload Excel file</span>
                      <input
                        id="targeting-rules-upload"
                        name="targeting-rules-upload"
                        type="file"
                        className="sr-only"
                        accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={handleFileUpload}
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      or drag and drop
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Excel files (.xlsx, .xls) up to 10MB
                  </p>
                </div>
              ) : (
                <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">
                          {formData.targeting_rules_filename}
                        </p>
                        <p className="text-xs text-green-700">
                          File uploaded successfully
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFileRemove}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <XCircleIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <p className="mt-2 text-muted-foreground text-sm">
              Upload an Excel file containing targeting rules for different
              offers in different locations
            </p>
          </div>

          {uploadError && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive">{uploadError}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-blue-900">
              Targeting Rules Format
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                • Excel file should contain columns for offer ID, location, and
                targeting criteria
              </li>
              <li>
                • Each row represents a targeting rule for a specific offer and
                location
              </li>
              <li>
                • Leave blank if you want to configure targeting rules later
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

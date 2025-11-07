"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface BasicInfoStepProps {
  formData: {
    name: string;
    partner_id: string;
    partner_name: string;
    program_id: string;
    program_name: string;
    type: "promotional" | "targeted" | "seasonal";
    description: string;
  };
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
}

// Mock data - replace with actual API calls
const mockPartners = [
  { id: "1", name: "Acme Corp" },
  { id: "2", name: "Beta Inc" },
  { id: "3", name: "Gamma LLC" },
  { id: "4", name: "Delta Corp" },
];

const mockPrograms = [
  { id: "1", name: "Rewards Plus", partner_id: "1" },
  { id: "2", name: "Premium Program", partner_id: "1" },
  { id: "3", name: "Beta Rewards", partner_id: "2" },
  { id: "4", name: "Gamma Benefits", partner_id: "3" },
  { id: "5", name: "Delta Loyalty", partner_id: "4" },
];

export default function BasicInfoStep({
  formData,
  onUpdate,
  onNext,
}: BasicInfoStepProps) {
  const handlePartnerChange = (partnerId: string) => {
    const partner = mockPartners.find((p) => p.id === partnerId);
    if (partner) {
      onUpdate("partner_id", partnerId);
      onUpdate("partner_name", partner.name);
      // Reset program when partner changes
      onUpdate("program_id", "");
      onUpdate("program_name", "");
    }
  };

  const handleProgramChange = (programId: string) => {
    const program = mockPrograms.find((p) => p.id === programId);
    if (program) {
      onUpdate("program_id", programId);
      onUpdate("program_name", program.name);
    }
  };

  const availablePrograms = formData.partner_id
    ? mockPrograms.filter((p) => p.partner_id === formData.partner_id)
    : [];

  return (
    <div className="space-y-4">
      {/* Campaign Details - Single Group */}
      <div className="rounded-md border border-b">
        <div className="flex">
          <div className="flex flex-1 items-center justify-between px-4 py-3 font-medium">
            <div className="flex items-center gap-2">
              <InformationCircleIcon className="size-4" />
              <span>Campaign Details</span>
            </div>
          </div>
        </div>
        <div className="px-4 pb-4 pt-0 space-y-5">
          <div>
            <Label htmlFor="name">Campaign Name*</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onUpdate("name", e.target.value)}
              placeholder="e.g., Summer Savings 2025"
            />
            <p className="mt-2 text-muted-foreground text-sm">
              Give your campaign a clear, descriptive name
            </p>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onUpdate("description", e.target.value)}
              placeholder="Enter a detailed description of this campaign..."
              rows={4}
            />
            <p className="mt-2 text-muted-foreground text-sm">
              Provide additional context and details about this campaign
            </p>
          </div>

          <div>
            <Label htmlFor="partner">Partner*</Label>
            <Select
              value={formData.partner_id}
              onValueChange={handlePartnerChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a partner" />
              </SelectTrigger>
              <SelectContent>
                {mockPartners.map((partner) => (
                  <SelectItem key={partner.id} value={partner.id}>
                    {partner.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-muted-foreground text-sm">
              Choose the partner organization for this campaign
            </p>
          </div>

          <div>
            <Label htmlFor="program">Program*</Label>
            <Select
              value={formData.program_id}
              onValueChange={handleProgramChange}
              disabled={!formData.partner_id}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    formData.partner_id
                      ? "Select a program"
                      : "Select a partner first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availablePrograms.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="mt-2 text-muted-foreground text-sm">
              Select the specific program within the partner organization
            </p>
          </div>

          <div>
            <Label htmlFor="type">Campaign Type*</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => onUpdate("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select campaign type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promotional">Promotional</SelectItem>
                <SelectItem value="targeted">Targeted</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
              </SelectContent>
            </Select>
            <p className="mt-2 text-muted-foreground text-sm">
              Choose the type that best describes this campaign
            </p>
          </div>

          {/* Type descriptions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-blue-900">
              Campaign Type Guide
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>
                <strong>🎉 Promotional:</strong> General promotions and offers
                for broad audiences
              </li>
              <li>
                <strong>🎯 Targeted:</strong> Campaigns aimed at specific user
                segments or demographics
              </li>
              <li>
                <strong>🗓️ Seasonal:</strong> Time-sensitive campaigns tied to
                holidays, events, or seasons
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

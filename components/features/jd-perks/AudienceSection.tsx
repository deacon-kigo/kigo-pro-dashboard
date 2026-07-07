"use client";

import React, { useRef } from "react";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import {
  UsersIcon,
  ArrowUpTrayIcon,
  DocumentCheckIcon,
} from "@heroicons/react/24/outline";
import type { PremadeCampaign, AudienceSelection } from "./types";
import { formatNumber } from "./utils";

/** Default (empty) audience — a customer list must be uploaded before activation. */
export function defaultAudience(
  _campaign?: PremadeCampaign
): AudienceSelection {
  return { estimatedReach: 0 };
}

interface AudienceSectionProps {
  campaign: PremadeCampaign;
  value: AudienceSelection;
  onChange: (next: AudienceSelection) => void;
  readOnly?: boolean;
}

export default function AudienceSection({
  value,
  onChange,
  readOnly = false,
}: AudienceSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      // Count rows that look like emails — parsed locally, nothing is uploaded.
      const count = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.includes("@") && l.includes(".")).length;
      onChange({
        uploadFileName: file.name,
        uploadCount: count,
        estimatedReach: count,
      });
    };
    reader.readAsText(file);
  };

  // Read-only summary (after activation)
  if (readOnly) {
    return (
      <div className="rounded-lg border border-border-light bg-white p-5 shadow-sm">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-text-dark">
          <UsersIcon className="h-4 w-4" /> Audience
        </h3>
        <p className="mt-2 text-sm text-text-dark">
          {value.uploadFileName
            ? `Uploaded list — ${value.uploadFileName}`
            : "Uploaded customer list"}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          {formatNumber(value.estimatedReach)} customers
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border-light bg-white p-5 shadow-sm">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-text-dark">
        <UsersIcon className="h-4 w-4" /> Audience
      </h3>
      <p className="mt-0.5 text-xs text-text-muted">
        Upload the customer list that should receive this campaign.
      </p>

      <div className="mt-4 space-y-3">
        <input
          ref={fileRef}
          type="file"
          accept=".csv,.txt"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0] || null)}
        />
        <Button
          variant="outline"
          icon={<ArrowUpTrayIcon className="h-4 w-4" />}
          onClick={() => fileRef.current?.click()}
        >
          {value.uploadFileName
            ? "Replace customer list"
            : "Upload customer list (CSV)"}
        </Button>
        {value.uploadFileName ? (
          <div className="flex items-center gap-2 rounded-md bg-pastel-green px-3 py-2 text-sm text-green-800">
            <DocumentCheckIcon className="h-4 w-4" />
            <span className="font-medium">{value.uploadFileName}</span>
            <Badge variant="success" size="sm">
              {formatNumber(value.uploadCount ?? 0)} emails
            </Badge>
          </div>
        ) : (
          <p className="text-xs text-text-muted">
            CSV with one email per row. Your file is read in the browser and
            matched against John Deere customer records — nothing is uploaded in
            this prototype.
          </p>
        )}
      </div>
    </div>
  );
}

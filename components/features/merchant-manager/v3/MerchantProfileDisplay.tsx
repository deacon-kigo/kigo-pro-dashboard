"use client";

import React from "react";
import { Badge } from "@/components/atoms/Badge";
import { MerchantLogo } from "./MerchantLogo";
import type { Merchant, MerchantStatus } from "./types";

const STATUS_LABEL: Record<MerchantStatus, string> = {
  published: "Active",
  unpublished: "Unpublished",
  closed: "Closed",
};

const statusVariant = (s: MerchantStatus) =>
  s === "published"
    ? ("success" as const)
    : s === "unpublished"
      ? ("warning" as const)
      : ("error" as const);

interface MerchantProfileDisplayProps {
  merchant: Merchant;
  status: MerchantStatus;
}

export default function MerchantProfileDisplay({
  merchant,
  status,
}: MerchantProfileDisplayProps) {
  return (
    <>
      <dl className="divide-y divide-gray-200">
        <DisplayRow
          label="Status"
          value={
            <Badge variant={statusVariant(status)} className="font-medium">
              {STATUS_LABEL[status]}
            </Badge>
          }
        />

        <DisplayRow label="DBA Name" value={merchant.name} />

        <DisplayRow
          label="Logo"
          value={
            <div className="flex items-center gap-2">
              <MerchantLogo merchant={merchant} size={40} />
              <span className="text-gray-500">
                Auto-detected from {merchant.website || "merchant name"}
              </span>
            </div>
          }
        />

        <DisplayRow label="Source" value={merchant.source || <NotProvided />} />

        <DisplayRow
          label="Categories"
          value={merchant.category || <NotProvided />}
        />

        <DisplayRow label="Locations" value={<NotProvided />} />
      </dl>

      <SectionBreak
        id="merchant-additional-details"
        label="Additional details"
      />

      <dl
        aria-labelledby="merchant-additional-details"
        className="divide-y divide-gray-200 border-t border-gray-200"
      >
        <DisplayRow
          label="Website"
          value={
            merchant.website ? (
              <a
                href={
                  merchant.website.startsWith("http")
                    ? merchant.website
                    : `https://${merchant.website}`
                }
                target="_blank"
                rel="noreferrer noopener"
                className="text-primary hover:underline"
              >
                {merchant.website}
              </a>
            ) : (
              <NotProvided />
            )
          }
        />

        <DisplayRow
          label="Primary contact"
          value={merchant.contact || <NotProvided />}
        />

        <DisplayRow label="Corporation Name" value={<NotProvided />} />

        <DisplayRow label="Banner Image" value={<NotProvided />} />

        <DisplayRow
          label="About"
          value={
            merchant.merchantDetail ? (
              <p className="max-w-prose text-sm leading-relaxed text-gray-700">
                {merchant.merchantDetail}
              </p>
            ) : (
              <NotProvided />
            )
          }
        />
      </dl>
    </>
  );
}

function DisplayRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="py-5">
      <dt className="text-sm font-medium text-gray-900">{label}</dt>
      <dd className="mt-1 text-sm text-gray-600">{value}</dd>
    </div>
  );
}

function NotProvided() {
  return <span className="italic text-gray-500">Not provided</span>;
}

function SectionBreak({ id, label }: { id: string; label: string }) {
  return (
    <div className="pb-2 pt-8">
      <h4
        id={id}
        className="text-sm font-semibold uppercase tracking-wide text-gray-700"
      >
        {label}
      </h4>
    </div>
  );
}

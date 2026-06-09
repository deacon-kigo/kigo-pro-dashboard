"use client";

import React from "react";
import { Badge } from "@/components/atoms/Badge";
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

const subGroupStatusVariant = (s: string) => {
  switch (s) {
    case "Active":
      return "success" as const;
    case "Review":
      return "warning" as const;
    case "Paused":
      return "neutral" as const;
    default:
      return "neutral" as const;
  }
};

interface MerchantProfileDisplayProps {
  merchant: Merchant;
  status: MerchantStatus;
}

export default function MerchantProfileDisplay({
  merchant,
  status,
}: MerchantProfileDisplayProps) {
  const offerTypes = merchant.supportedOfferTypes ?? [];
  const restrictions = merchant.restrictions ?? [];
  const subGroups = merchant.subGroups ?? [];

  return (
    <>
      {/* Identity — fields that uniquely tag this merchant in the system. */}
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
          label="Merchant ID"
          value={<span className="font-mono text-gray-900">{merchant.id}</span>}
        />
        <DisplayRow label="Source" value={merchant.source} />
        <DisplayRow label="Categories" value={merchant.category} />
        {merchant.isParent && (
          <DisplayRow
            label="Hierarchy"
            value={
              <Badge variant="info" rounded="md" className="font-medium">
                Parent merchant
              </Badge>
            }
          />
        )}
      </dl>

      {/* Contact — phone/email/website fan-in. */}
      {(merchant.website || merchant.contact) && (
        <>
          <SectionBreak id="merchant-contact" label="Contact" />
          <dl
            aria-labelledby="merchant-contact"
            className="divide-y divide-gray-200 border-t border-gray-200"
          >
            {merchant.website && (
              <DisplayRow
                label="Website"
                value={
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
                }
              />
            )}
            {merchant.contact && (
              <DisplayRow label="Primary contact" value={merchant.contact} />
            )}
          </dl>
        </>
      )}

      {/* About — narrative description (merchantDetail). */}
      {merchant.merchantDetail && (
        <>
          <SectionBreak id="merchant-about" label="About" />
          <p className="max-w-prose pt-3 text-sm leading-relaxed text-gray-700">
            {merchant.merchantDetail}
          </p>
        </>
      )}

      {/* Capabilities — what this merchant can offer + commercial terms. */}
      <SectionBreak id="merchant-capabilities" label="Capabilities" />
      <dl
        aria-labelledby="merchant-capabilities"
        className="divide-y divide-gray-200 border-t border-gray-200"
      >
        <DisplayRow
          label="Supported offer types"
          value={
            offerTypes.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {offerTypes.map((t) => (
                  <Badge
                    key={t}
                    variant="neutral"
                    rounded="md"
                    className="font-medium"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            ) : (
              <NotProvided />
            )
          }
        />
        <DisplayRow
          label="Commissionable offers"
          value={merchant.commissionOffers ? "Yes" : "No"}
        />
        {merchant.revShare && (
          <DisplayRow label="Revenue share" value={merchant.revShare} />
        )}
      </dl>

      {/* Restrictions — competitor merchants this one excludes. */}
      {restrictions.length > 0 && (
        <>
          <SectionBreak id="merchant-restrictions" label="Restrictions" />
          <div className="pt-3">
            <p className="mb-2 text-sm text-gray-600">
              Offers cannot run alongside the following merchants:
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {restrictions.map((r) => (
                <li key={r.id}>
                  <Badge variant="neutral" rounded="md" className="font-medium">
                    {r.name}
                    <span className="ml-1.5 font-mono text-gray-500">
                      {r.id}
                    </span>
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Sub-groups — regional / franchise breakouts for parent merchants. */}
      {merchant.isParent && subGroups.length > 0 && (
        <>
          <SectionBreak id="merchant-subgroups" label="Sub-groups" />
          <ul
            aria-labelledby="merchant-subgroups"
            className="divide-y divide-gray-200 border-t border-gray-200"
          >
            {subGroups.map((sg) => (
              <li
                key={sg.id}
                className="flex flex-wrap items-start justify-between gap-3 py-4"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {sg.name}
                    </span>
                    <Badge variant="neutral" rounded="md" className="font-mono">
                      {sg.id}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-600">{sg.contact}</p>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <Badge
                    variant={subGroupStatusVariant(sg.status)}
                    className="font-medium"
                  >
                    {sg.status}
                  </Badge>
                  <span>
                    <strong className="tabular-nums text-gray-900">
                      {sg.activeOffers}
                    </strong>{" "}
                    active {sg.activeOffers === 1 ? "offer" : "offers"}
                  </span>
                  {typeof sg.locations === "number" && (
                    <span>
                      <strong className="tabular-nums text-gray-900">
                        {sg.locations}
                      </strong>{" "}
                      {sg.locations === 1 ? "location" : "locations"}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
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

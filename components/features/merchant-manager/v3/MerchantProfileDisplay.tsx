"use client";

import React from "react";
import { Badge } from "@/components/atoms/Badge";
import {
  IdentificationIcon,
  AtSymbolIcon,
  DocumentTextIcon,
  NoSymbolIcon,
  RectangleGroupIcon,
  PhotoIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
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
  const restrictions = merchant.restrictions ?? [];
  const subGroups = merchant.subGroups ?? [];

  return (
    <div className="divide-y divide-gray-200">
      <Section
        icon={IdentificationIcon}
        title="Overview"
        description="Identity and lifecycle of this merchant record."
      >
        <dl>
          <Row label="Status">
            <Badge variant={statusVariant(status)} className="font-medium">
              {STATUS_LABEL[status]}
            </Badge>
          </Row>
          <Row label="DBA Name">{merchant.name}</Row>
          <Row label="Corporation Name">
            <NotProvided />
          </Row>
          <Row label="Merchant ID">
            <span className="font-mono text-gray-900">{merchant.id}</span>
          </Row>
          <Row label="Source">{merchant.source}</Row>
          <Row label="Categories">{merchant.category}</Row>
          {merchant.isParent && (
            <Row label="Hierarchy">
              <Badge variant="info" rounded="md" className="font-medium">
                Parent merchant
              </Badge>
            </Row>
          )}
        </dl>
      </Section>

      <Section
        icon={PhotoIcon}
        title="Branding"
        description="Customer-facing imagery used across the marketplace."
      >
        <dl>
          <Row label="Logo">
            <div className="flex items-center gap-3">
              <MerchantLogo merchant={merchant} size={40} />
              <span className="text-gray-500">
                Auto-detected from {merchant.website || "merchant name"}
              </span>
            </div>
          </Row>
          <Row label="Banner image">
            <NotProvided />
          </Row>
        </dl>
      </Section>

      <Section
        icon={MapPinIcon}
        title="Locations"
        description="Physical addresses where offers redeem."
      >
        <NotProvided />
      </Section>

      <Section
        icon={AtSymbolIcon}
        title="Contact"
        description="Where customers find this merchant online."
      >
        <dl>
          <Row label="Website">
            {merchant.website ? (
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
            )}
          </Row>
        </dl>
      </Section>

      <Section
        icon={DocumentTextIcon}
        title="About"
        description="Public-facing description shown to ops reviewing this merchant."
      >
        {merchant.merchantDetail ? (
          <p className="max-w-prose text-sm leading-relaxed text-gray-700">
            {merchant.merchantDetail}
          </p>
        ) : (
          <NotProvided />
        )}
      </Section>

      {restrictions.length > 0 && (
        <Section
          icon={NoSymbolIcon}
          title="Restrictions"
          description="Offers cannot run alongside the following merchants."
        >
          <ul className="flex flex-wrap gap-1.5">
            {restrictions.map((r) => (
              <li key={r.id}>
                <Badge variant="neutral" rounded="md" className="font-medium">
                  {r.name}
                  <span className="ml-1.5 font-mono text-gray-500">{r.id}</span>
                </Badge>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {merchant.isParent && subGroups.length > 0 && (
        <Section
          icon={RectangleGroupIcon}
          title="Sub-groups"
          description="Regional and franchise breakouts owned by this parent."
        >
          <ul className="divide-y divide-gray-100 rounded-md border border-gray-200">
            {subGroups.map((sg) => (
              <li
                key={sg.id}
                className="flex flex-wrap items-start justify-between gap-3 px-4 py-3"
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
                  <p className="mt-0.5 text-sm text-gray-500">{sg.contact}</p>
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
        </Section>
      )}
    </div>
  );
}

// Section anchors the eye with an icon + sentence-cased title + helper
// subtitle. The h3 nests under the page header's merchant name (h3 in the
// detail card chrome), giving screen readers a clear "section / merchant"
// path. divide-y on the parent draws the separator so sections never
// double-up borders.
function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof IdentificationIcon;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  const headingId = `merchant-section-${title.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <section aria-labelledby={headingId} className="py-8 first:pt-0 last:pb-0">
      <header className="mb-5">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          <h3 id={headingId} className="text-base font-semibold text-gray-900">
            {title}
          </h3>
        </div>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </header>
      {children}
    </section>
  );
}

// Row is a definition pair (label : value). The horizontal grid keeps the
// label quiet and right-aligned next to a prominent value so the eye can
// scan a column of facts. Stacks on mobile.
function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-y-1 py-2.5 sm:grid-cols-[180px_1fr] sm:gap-x-6 sm:gap-y-0">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{children}</dd>
    </div>
  );
}

function NotProvided() {
  return <span className="font-normal italic text-gray-400">Not provided</span>;
}

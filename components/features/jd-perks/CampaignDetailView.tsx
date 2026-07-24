"use client";

import React, { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Input } from "@/components/atoms/Input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/lib/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { activateCampaign } from "@/lib/redux/slices/jdPerksSlice";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ClipboardIcon,
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  ChartBarIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { getCampaignById, DEALER_LOCATIONS } from "./mockData";
import type { Activation } from "./types";
import type { ActivationChannel } from "./utils";
import { CampaignCreative, downloadCreativePng } from "./CampaignCreative";
import EligiblePartsTable from "./EligiblePartsTable";
import QrPoster from "./QrPoster";
import {
  discountLabel,
  formatCurrency,
  formatDate,
  buildCmsUrl,
  buildChannelUrl,
  ACTIVATION_CHANNELS,
  todayIso,
} from "./utils";

const CHANNEL_ICONS: Record<
  ActivationChannel,
  React.ComponentType<{ className?: string }>
> = {
  email: EnvelopeIcon,
  sms: DevicePhoneMobileIcon,
  social: ShareIcon,
  qr: ArrowTopRightOnSquareIcon,
};

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border-light py-2.5 last:border-0">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="text-right text-sm font-medium text-text-dark">
        {value}
      </span>
    </div>
  );
}

export default function CampaignDetailView({
  campaignId,
}: {
  campaignId: string;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const creativeRef = useRef<SVGSVGElement>(null);

  const campaign = getCampaignById(campaignId);
  const existing = useAppSelector((s) => s.jdPerks.activations[campaignId]);

  const [startDate, setStartDate] = useState(
    existing?.startDate || campaign?.suggestedStart || todayIso()
  );
  const [endDate, setEndDate] = useState(
    existing?.endDate || campaign?.suggestedEnd || todayIso()
  );
  const [allLocations, setAllLocations] = useState(
    existing ? existing.locationIds.length === 0 : true
  );
  const [locationIds, setLocationIds] = useState<string[]>(
    existing?.locationIds || []
  );
  const [justActivated, setJustActivated] = useState(false);

  const isActive = Boolean(existing) || justActivated;

  const dateError = useMemo(() => {
    if (!startDate || !endDate) return "Select both a start and end date.";
    if (endDate < startDate) return "End date must be after the start date.";
    return null;
  }, [startDate, endDate]);

  const locationError =
    !allLocations && locationIds.length === 0
      ? "Select at least one location, or choose all."
      : null;

  if (!campaign) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          icon={<ArrowLeftIcon className="h-4 w-4" />}
          onClick={() => router.push("/campaign-manager/john-deere")}
        >
          Back to Campaign Manager
        </Button>
        <div className="rounded-lg border border-dashed border-border-light bg-white p-12 text-center text-text-muted">
          Campaign not found.
        </div>
      </div>
    );
  }

  const cmsUrl = existing?.cmsUrl || buildCmsUrl(campaign);
  const expirationIso = existing?.endDate || endDate;

  const toggleLocation = (id: string) => {
    setLocationIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    if (dateError || locationError) return;
    const activation: Activation = {
      campaignId: campaign.id,
      startDate,
      endDate,
      locationIds: allLocations ? [] : locationIds,
      activatedAt: new Date().toISOString(),
      cmsUrl: buildCmsUrl(campaign),
    };
    dispatch(activateCampaign(activation));
    setJustActivated(true);
    toast({
      title: "Campaign activated",
      description: `${campaign.name} is live ${formatDate(startDate)} – ${formatDate(
        endDate
      )}.`,
    });
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: `${label} link copied`, description: text });
    } catch {
      toast({ title: "Copy failed", description: "Copy the link manually." });
    }
  };

  const handleDownload = async () => {
    if (!creativeRef.current) return;
    try {
      await downloadCreativePng(creativeRef.current, `${campaign.id}.png`);
      toast({ title: "Image downloaded", description: `${campaign.id}.png` });
    } catch {
      toast({ title: "Download failed", description: "Please try again." });
    }
  };

  const locationsLabel = allLocations
    ? "All locations"
    : locationIds.length
      ? `${locationIds.length} location${locationIds.length > 1 ? "s" : ""}`
      : "None selected";

  return (
    <div className="space-y-5">
      <Button
        variant="outline"
        size="sm"
        icon={<ArrowLeftIcon className="h-4 w-4" />}
        onClick={() => router.push("/campaign-manager/john-deere")}
      >
        Back to Campaign Manager
      </Button>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* LEFT: campaign details */}
        <div className="space-y-5 lg:col-span-3">
          <div className="overflow-hidden rounded-lg border border-border-light bg-white shadow-sm">
            <CampaignCreative
              ref={creativeRef}
              campaign={campaign}
              width={900}
              className="w-full"
            />
          </div>

          <div className="rounded-lg border border-border-light bg-white p-5 shadow-sm">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge
                variant={campaign.builtBy === "John Deere" ? "success" : "info"}
                size="sm"
              >
                Built by {campaign.builtBy}
              </Badge>
              <Badge variant="outline" size="sm">
                {campaign.category}
              </Badge>
              {isActive && (
                <Badge variant="success" size="sm" className="gap-1">
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                  Active
                </Badge>
              )}
            </div>
            <h1 className="text-xl font-bold text-text-dark">
              {campaign.name}
            </h1>
            <p className="mt-1 text-sm text-text-muted">
              {campaign.description}
            </p>

            <div className="mt-4">
              <h3 className="mb-1 text-sm font-semibold text-text-dark">
                Offer mechanics
              </h3>
              <DetailRow label="Discount" value={discountLabel(campaign)} />
              <DetailRow
                label="Minimum spend"
                value={
                  campaign.constraints.minSpend != null
                    ? formatCurrency(campaign.constraints.minSpend)
                    : "None"
                }
              />
              <DetailRow
                label="Maximum discount"
                value={
                  campaign.constraints.maxDiscount != null
                    ? formatCurrency(campaign.constraints.maxDiscount)
                    : "Uncapped"
                }
              />
              <DetailRow
                label="Suggested window"
                value={`${formatDate(campaign.suggestedStart)} – ${formatDate(
                  campaign.suggestedEnd
                )}`}
              />
            </div>
            <p className="mt-3 text-xs text-text-muted">
              Mechanics are set by {campaign.builtBy} and can't be edited. You
              control the dates and the locations where it runs.
            </p>
          </div>

          {/* Eligible parts (set by John Deere) */}
          <EligiblePartsTable campaignId={campaign.id} />
        </div>

        {/* RIGHT: activation panel */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-4 rounded-lg border border-border-light bg-white p-5 shadow-sm">
            {!isActive ? (
              <>
                <div>
                  <h2 className="text-base font-semibold text-text-dark">
                    Activate this campaign
                  </h2>
                  <p className="mt-0.5 text-sm text-text-muted">
                    Choose when and where it runs, then confirm. Activation
                    generates ready-to-share links and a printable QR code — no
                    customer list required.
                  </p>
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-dark">
                    Campaign dates
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      aria-label="Start date"
                    />
                    <span className="text-text-muted">–</span>
                    <Input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      aria-label="End date"
                    />
                  </div>
                  {dateError && (
                    <p className="text-xs text-red-600">{dateError}</p>
                  )}
                </div>

                {/* Locations */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-text-dark">
                    Redemption locations
                  </label>
                  <label className="flex items-center gap-2 text-sm text-text-dark">
                    <Checkbox
                      checked={allLocations}
                      onCheckedChange={(v) => setAllLocations(Boolean(v))}
                    />
                    All Everglades Equipment locations
                  </label>
                  {!allLocations && (
                    <div className="space-y-1.5 rounded-md border border-border-light p-2.5">
                      {DEALER_LOCATIONS.map((loc) => (
                        <label
                          key={loc.id}
                          className="flex items-start gap-2 text-sm text-text-dark"
                        >
                          <Checkbox
                            className="mt-0.5"
                            checked={locationIds.includes(loc.id)}
                            onCheckedChange={() => toggleLocation(loc.id)}
                          />
                          <span className="flex flex-col leading-tight">
                            <span className="font-medium">{loc.name}</span>
                            <span className="text-xs text-text-muted">
                              {loc.street}, {loc.city}, {loc.state} {loc.zip}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                  {locationError && (
                    <p className="text-xs text-red-600">{locationError}</p>
                  )}
                </div>

                {/* Summary */}
                <div className="rounded-md bg-bg-light p-3 text-sm">
                  <div className="flex justify-between py-0.5">
                    <span className="text-text-muted">Offer</span>
                    <span className="font-medium">
                      {discountLabel(campaign)}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-text-muted">Runs</span>
                    <span className="font-medium">
                      {formatDate(startDate)} – {formatDate(endDate)}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-text-muted">Where</span>
                    <span className="font-medium">{locationsLabel}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  disabled={Boolean(dateError || locationError)}
                  onClick={handleConfirm}
                >
                  Confirm activation
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 rounded-md bg-pastel-green p-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-700" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">
                      Campaign is active
                    </p>
                    <p className="text-xs text-green-700">
                      {formatDate(existing?.startDate || startDate)} –{" "}
                      {formatDate(existing?.endDate || endDate)} ·{" "}
                      {locationsLabel}
                    </p>
                  </div>
                </div>

                {/* CMS assets */}
                <div>
                  <h2 className="text-base font-semibold text-text-dark">
                    Marketing assets
                  </h2>
                  <p className="mt-0.5 text-sm text-text-muted">
                    Drop these into your website or CMS as a call to action.
                  </p>
                </div>

                <div className="overflow-hidden rounded-md border border-border-light">
                  <CampaignCreative
                    campaign={campaign}
                    width={520}
                    className="w-full"
                  />
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  icon={<ArrowDownTrayIcon className="h-4 w-4" />}
                  onClick={handleDownload}
                >
                  Download static image (PNG)
                </Button>

                {/* Per-medium activation links */}
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-text-dark">
                      Activation links
                    </label>
                    <p className="text-xs text-text-muted">
                      Each medium gets its own tracked link so redemptions are
                      attributed to the channel that drove them.
                    </p>
                  </div>
                  {ACTIVATION_CHANNELS.map((ch) => {
                    const url = buildChannelUrl(campaign, ch.id);
                    const Icon = CHANNEL_ICONS[ch.id];
                    return (
                      <div key={ch.id} className="space-y-1">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-text-dark">
                          {Icon && <Icon className="h-4 w-4 text-text-muted" />}
                          {ch.label}
                        </span>
                        <div className="flex items-center gap-2">
                          <Input value={url} readOnly className="text-xs" />
                          <Button
                            variant="outline"
                            size="sm"
                            icon={<ClipboardIcon className="h-4 w-4" />}
                            onClick={() => handleCopy(url, ch.label)}
                          >
                            Copy
                          </Button>
                        </div>
                        <p className="text-[11px] text-text-muted">{ch.hint}</p>
                      </div>
                    );
                  })}
                  <a
                    href={cmsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    <ArrowTopRightOnSquareIcon className="h-3.5 w-3.5" />
                    Preview landing page
                  </a>
                </div>

                {/* Printable QR code with Deere logo + expiration */}
                <QrPoster
                  url={buildChannelUrl(campaign, "qr")}
                  campaignName={campaign.name}
                  expirationIso={expirationIso}
                />

                <Button
                  variant="primary"
                  className="w-full"
                  icon={<ChartBarIcon className="h-4 w-4" />}
                  onClick={() => router.push("/dashboard/john-deere")}
                >
                  View reporting
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

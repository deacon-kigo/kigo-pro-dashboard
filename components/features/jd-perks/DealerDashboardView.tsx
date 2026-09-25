"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { useAppSelector } from "@/lib/redux/hooks";
import { useToast } from "@/lib/hooks/use-toast";
import {
  UserGroupIcon,
  ArrowPathIcon,
  CursorArrowRaysIcon,
  InboxArrowDownIcon,
  CheckBadgeIcon,
  ReceiptPercentIcon,
  BanknotesIcon,
  ArrowDownTrayIcon,
  EnvelopeIcon,
  DevicePhoneMobileIcon,
  ShareIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { getCampaignById, DEALER, DEALER_USER_METRICS } from "./mockData";
import type { PremadeCampaign } from "./types";
import {
  formatCurrency,
  formatNumber,
  formatDate,
  transactionFee,
  TRANSACTION_FEE_RATE,
  pct,
  activationStatus,
  STATUS_LABEL,
} from "./utils";
import type { ActivationStatus } from "./utils";
import { Checkbox } from "@/components/ui/checkbox";

const STATUS_PILL: Record<ActivationStatus, string> = {
  active: "bg-green-100 text-green-800",
  queued: "bg-amber-100 text-amber-800",
  ended: "bg-gray-100 text-gray-700",
  available: "bg-gray-100 text-gray-700",
};

type TableScope = "all" | "active" | "past";

interface ActiveRow {
  campaign: PremadeCampaign;
  status: ActivationStatus;
  startDate: string;
  endDate: string;
  clicks: number;
  email: number;
  sms: number;
  social: number;
  qr: number;
  delivered: number;
  activated: number;
  applied: number;
  discount: number;
  sales: number;
  fee: number;
}

function MetricCard({
  label,
  value,
  icon,
  sub,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-border-light bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-muted">{label}</span>
        <span className="text-primary">{icon}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-text-dark">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-text-muted">{sub}</p>}
    </div>
  );
}

/** One stage of the click-to-redemption funnel. */
function FunnelStage({
  label,
  value,
  icon,
  conversion,
  width,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  conversion?: string;
  width: number;
}) {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-1.5 text-xs font-medium text-text-muted">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <p className="mt-1 text-xl font-bold text-text-dark">
        {formatNumber(value)}
      </p>
      <div className="mt-1.5 h-1.5 w-full rounded-full bg-bg-light">
        <div
          className="h-1.5 rounded-full bg-[#367C2B]"
          style={{ width: `${Math.max(width, 2)}%` }}
        />
      </div>
      <p className="mt-1 text-[11px] text-text-muted">
        {conversion ?? "Top of funnel"}
      </p>
    </div>
  );
}

export default function DealerDashboardView() {
  const router = useRouter();
  const { toast } = useToast();
  const activations = useAppSelector((s) => s.jdPerks.activations);

  const rows: ActiveRow[] = useMemo(() => {
    return Object.values(activations)
      .map((a) => {
        const campaign = getCampaignById(a.campaignId);
        if (!campaign) return null;
        const status = activationStatus(a);
        const p = campaign.performance;
        // A queued campaign hasn't run yet, so it has nothing to report.
        const z = status === "queued";
        const clicks = z
          ? 0
          : p.clicks.email + p.clicks.sms + p.clicks.social + p.clicks.qr;
        return {
          campaign,
          status,
          startDate: a.startDate,
          endDate: a.endDate,
          clicks,
          email: z ? 0 : p.clicks.email,
          sms: z ? 0 : p.clicks.sms,
          social: z ? 0 : p.clicks.social,
          qr: z ? 0 : p.clicks.qr,
          delivered: z ? 0 : p.tokensDelivered,
          activated: z ? 0 : p.tokensActivated,
          applied: z ? 0 : p.tokensApplied,
          discount: z ? 0 : p.discount,
          sales: z ? 0 : p.sales,
          fee: z ? 0 : transactionFee(p.sales),
        } as ActiveRow;
      })
      .filter((r): r is ActiveRow => r !== null)
      .sort((a, b) => b.sales - a.sales);
  }, [activations]);

  // Scope of the table: everything, only what's running now, or only what has
  // finished. Queued campaigns show under "all" — they're committed but have
  // no data yet.
  const [scope, setScope] = useState<TableScope>("all");

  const visibleRows = useMemo(() => {
    if (scope === "active") return rows.filter((r) => r.status === "active");
    if (scope === "past") return rows.filter((r) => r.status === "ended");
    return rows;
  }, [rows, scope]);

  // null means "nothing explicitly picked" → treat every visible row as chosen.
  const [selectedIds, setSelectedIds] = useState<string[] | null>(null);

  const isSelected = (id: string) =>
    selectedIds === null ? true : selectedIds.includes(id);

  const selectedRows = useMemo(
    () => visibleRows.filter((r) => isSelected(r.campaign.id)),
    [visibleRows, selectedIds]
  );

  const toggleRow = (id: string) => {
    const base =
      selectedIds === null
        ? visibleRows.map((r) => r.campaign.id)
        : selectedIds;
    setSelectedIds(
      base.includes(id) ? base.filter((x) => x !== id) : [...base, id]
    );
  };

  const allVisibleSelected =
    visibleRows.length > 0 &&
    visibleRows.every((r) => isSelected(r.campaign.id));

  const toggleAll = () =>
    setSelectedIds(
      allVisibleSelected ? [] : visibleRows.map((r) => r.campaign.id)
    );

  const aggregate = (list: ActiveRow[]) =>
    list.reduce(
      (acc, r) => ({
        clicks: acc.clicks + r.clicks,
        email: acc.email + r.email,
        sms: acc.sms + r.sms,
        social: acc.social + r.social,
        qr: acc.qr + r.qr,
        delivered: acc.delivered + r.delivered,
        activated: acc.activated + r.activated,
        applied: acc.applied + r.applied,
        discount: acc.discount + r.discount,
        sales: acc.sales + r.sales,
        fee: acc.fee + r.fee,
      }),
      {
        clicks: 0,
        email: 0,
        sms: 0,
        social: 0,
        qr: 0,
        delivered: 0,
        activated: 0,
        applied: 0,
        discount: 0,
        sales: 0,
        fee: 0,
      }
    );

  const totals = useMemo(() => aggregate(rows), [rows]);

  // Everything in "Campaign performance" reflects the rows ticked in the table.
  const view = useMemo(() => aggregate(selectedRows), [selectedRows]);

  const selectedLabel =
    selectedRows.length === 0
      ? "No campaigns selected"
      : selectedRows.length === rows.length
        ? `All campaigns (${rows.length})`
        : selectedRows.length === 1
          ? selectedRows[0].campaign.name
          : `${selectedRows.length} campaigns selected`;

  // Attributed sales returned for every dollar discounted. Ranks campaigns by
  // how hard the discount worked, which is the "run it again?" question.
  const chartData = useMemo(
    () =>
      visibleRows
        .filter((r) => r.discount > 0)
        .map((r) => ({
          name: r.campaign.name,
          efficiency: r.sales / r.discount,
          sales: r.sales,
          discount: r.discount,
        }))
        .sort((a, b) => a.efficiency - b.efficiency),
    [visibleRows]
  );

  const avgEfficiency = useMemo(() => {
    const d = visibleRows.reduce((acc, r) => acc + r.discount, 0);
    const s = visibleRows.reduce((acc, r) => acc + r.sales, 0);
    return d ? s / d : 0;
  }, [visibleRows]);

  const channels = [
    {
      label: "Social media",
      value: view.social,
      icon: <ShareIcon className="h-4 w-4" />,
    },
    {
      label: "Email",
      value: view.email,
      icon: <EnvelopeIcon className="h-4 w-4" />,
    },
    {
      label: "Text / SMS",
      value: view.sms,
      icon: <DevicePhoneMobileIcon className="h-4 w-4" />,
    },
    {
      label: "QR code",
      value: view.qr,
      icon: <QrCodeIcon className="h-4 w-4" />,
    },
  ];

  const returningRate = pct(
    DEALER_USER_METRICS.returningAccounts,
    DEALER_USER_METRICS.uniqueAccounts
  );

  const handleExportCsv = () => {
    try {
      const summaryAoa: (string | number)[][] = [
        ["Everglades Equipment — John Deere Perks Report"],
        ["Generated", new Date().toLocaleString("en-US")],
        [],
        ["User metrics", "Value"],
        ["Unique accounts", DEALER_USER_METRICS.uniqueAccounts],
        [
          "Returning accounts (>1 session)",
          DEALER_USER_METRICS.returningAccounts,
        ],
        ["Returning rate (%)", Number(returningRate.toFixed(1))],
        [],
        ["Campaign funnel", "Value"],
        ["Activation link clicks", totals.clicks],
        ["— Social media", totals.social],
        ["— Email", totals.email],
        ["— Text / SMS", totals.sms],
        ["— QR code", totals.qr],
        ["Tokens delivered to hub", totals.delivered],
        ["Tokens activated", totals.activated],
        ["Tokens applied (PDAP)", totals.applied],
        [],
        ["Financials", "Value"],
        ["Total sales ($)", totals.sales],
        ["Total discount ($)", totals.discount],
        [
          `Transaction fee ($, ${TRANSACTION_FEE_RATE * 100}% of sales)`,
          Number(totals.fee.toFixed(2)),
        ],
      ];

      const detailHeader = [
        "Campaign",
        "Built by",
        "Category",
        "Start",
        "End",
        "Clicks",
        "Clicks — social",
        "Clicks — email",
        "Clicks — SMS",
        "Clicks — QR",
        "Tokens delivered",
        "Tokens activated",
        "Tokens applied",
        "Discount ($)",
        "Sales ($)",
        "Transaction fee ($)",
      ];
      const detailRows = rows.map((r) => [
        r.campaign.name,
        r.campaign.builtBy,
        r.campaign.category,
        r.startDate,
        r.endDate,
        r.clicks,
        r.social,
        r.email,
        r.sms,
        r.qr,
        r.delivered,
        r.activated,
        r.applied,
        r.discount,
        r.sales,
        Number(r.fee.toFixed(2)),
      ]);

      const escapeCell = (value: string | number) => {
        const str = String(value ?? "");
        return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
      };
      const toCsv = (matrix: (string | number)[][]) =>
        matrix.map((row) => row.map(escapeCell).join(",")).join("\r\n");

      const csv = toCsv([...summaryAoa, [], detailHeader, ...detailRows]);

      const today = new Date().toISOString().slice(0, 10);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `everglades-perks-report-${today}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "Report exported",
        description: "CSV file downloaded. This send can be automated.",
      });
    } catch {
      toast({
        title: "Export failed",
        description: "Could not generate the CSV file.",
      });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${DEALER.contactName}`}
        description={`${DEALER.name} · ${rows.length} active campaign${
          rows.length === 1 ? "" : "s"
        }`}
        emoji="📊"
        variant="aurora"
        actions={
          <Button
            variant="primary"
            icon={<ArrowDownTrayIcon className="h-4 w-4" />}
            onClick={handleExportCsv}
          >
            Export CSV report
          </Button>
        }
      />

      {/* -------------------------------------------------- User metrics */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-dark">Users</h2>
        <Badge variant="info" size="sm">
          Automated weekly CSV delivery enabled
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <MetricCard
          label="Unique accounts"
          value={formatNumber(DEALER_USER_METRICS.uniqueAccounts)}
          sub="Distinct accounts that logged in"
          icon={<UserGroupIcon className="h-5 w-5" />}
        />
        <MetricCard
          label="Returning accounts"
          value={formatNumber(DEALER_USER_METRICS.returningAccounts)}
          sub={`${returningRate.toFixed(1)}% returned for more than one session`}
          icon={<ArrowPathIcon className="h-5 w-5" />}
        />
      </div>

      {/* -------------------------------------------------- Funnel */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-text-dark">
          Campaign performance
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-muted">
            Showing{" "}
            <span className="font-medium text-text-dark">{selectedLabel}</span>
          </span>
          {selectedIds !== null && (
            <button
              type="button"
              onClick={() => setSelectedIds(null)}
              className="text-sm font-medium text-primary hover:underline"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      <p className="-mt-3 text-xs text-text-muted">
        Tick campaigns in the table below to combine their results here.
      </p>

      <div className="rounded-lg border border-border-light bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-text-dark">
          Funnel · {selectedLabel}
        </h3>
        {rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-text-muted">
            Activate a campaign to start seeing results.
          </p>
        ) : (
          <div className="flex flex-col gap-6 sm:flex-row">
            <FunnelStage
              label="Link clicks"
              value={view.clicks}
              icon={<CursorArrowRaysIcon className="h-4 w-4" />}
              width={100}
            />
            <FunnelStage
              label="Delivered to hub"
              value={view.delivered}
              icon={<InboxArrowDownIcon className="h-4 w-4" />}
              conversion={`${pct(view.delivered, view.clicks).toFixed(0)}% of clicks`}
              width={pct(view.delivered, view.clicks)}
            />
            <FunnelStage
              label="Activated"
              value={view.activated}
              icon={<CheckBadgeIcon className="h-4 w-4" />}
              conversion={`${pct(view.activated, view.delivered).toFixed(0)}% of delivered`}
              width={pct(view.activated, view.clicks)}
            />
            <FunnelStage
              label="Applied (PDAP)"
              value={view.applied}
              icon={<ReceiptPercentIcon className="h-4 w-4" />}
              conversion={`${pct(view.applied, view.activated).toFixed(0)}% of activated`}
              width={pct(view.applied, view.clicks)}
            />
          </div>
        )}
      </div>

      {/* -------------------------------------------------- Clicks by channel */}
      <div className="rounded-lg border border-border-light bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-text-dark">
          Activation link clicks by type · {selectedLabel}
        </h3>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {channels.map((c) => (
            <div key={c.label}>
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <span className="text-primary">{c.icon}</span>
                {c.label}
              </div>
              <p className="mt-1 text-xl font-bold text-text-dark">
                {formatNumber(c.value)}
              </p>
              <p className="text-[11px] text-text-muted">
                {pct(c.value, view.clicks).toFixed(0)}% of clicks
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* -------------------------------------------------- Financials */}
      <h2 className="text-lg font-semibold text-text-dark">
        Financials · {selectedLabel}
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          label="Total sales"
          value={formatCurrency(view.sales)}
          icon={<BanknotesIcon className="h-5 w-5" />}
        />
        <MetricCard
          label="Total discount"
          value={formatCurrency(view.discount)}
          icon={<ReceiptPercentIcon className="h-5 w-5" />}
        />
        <MetricCard
          label="Transaction fee"
          value={formatCurrency(view.fee)}
          sub={`${TRANSACTION_FEE_RATE * 100}% of total sales`}
          icon={<ReceiptPercentIcon className="h-5 w-5" />}
        />
      </div>

      {/* -------------------------------------------------- Chart */}
      <div className="rounded-lg border border-border-light bg-white p-5 shadow-sm">
        <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold text-text-dark">
            Discount efficiency by campaign
          </h3>
          {rows.length > 0 && (
            <span className="text-xs text-text-muted">
              Average across all campaigns:{" "}
              <span className="font-semibold text-text-dark">
                ${avgEfficiency.toFixed(2)}
              </span>{" "}
              per $1
            </span>
          )}
        </div>
        <p className="mb-4 text-xs text-text-muted">
          Attributed sales returned for every $1 given away in discount. Higher
          bars earned more revenue per dollar of margin spent.
        </p>
        {chartData.length === 0 ? (
          <p className="py-12 text-center text-sm text-text-muted">
            No active campaigns yet.
          </p>
        ) : (
          <div
            style={{
              width: "100%",
              height: Math.max(200, chartData.length * 56),
            }}
          >
            <ResponsiveContainer>
              <BarChart
                layout="vertical"
                data={chartData}
                margin={{ top: 8, right: 56, left: 8, bottom: 8 }}
              >
                <CartesianGrid
                  horizontal={false}
                  strokeDasharray="3 3"
                  stroke="#E4E5E7"
                />
                <XAxis
                  type="number"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `$${v}`}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={170}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "rgba(54,124,43,0.06)" }}
                  formatter={(v: number, _n, item) => [
                    `$${v.toFixed(2)} back per $1 · ${formatCurrency(
                      item.payload.sales
                    )} sales on ${formatCurrency(item.payload.discount)} discount`,
                    "Efficiency",
                  ]}
                />
                <Bar
                  dataKey="efficiency"
                  fill="#367C2B"
                  radius={[0, 4, 4, 0]}
                  label={{
                    position: "right",
                    fontSize: 12,
                    fill: "#4B5563",
                    formatter: (v: number) => `$${v.toFixed(2)}`,
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* -------------------------------------------------- Per-campaign table */}
      <div className="overflow-hidden rounded-lg border border-border-light bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-light px-4 py-3">
          <h3 className="text-sm font-semibold text-text-dark">
            Campaigns
            <span className="ml-2 font-normal text-text-muted">
              {selectedRows.length} of {visibleRows.length} selected
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <label htmlFor="table-scope" className="text-sm text-text-muted">
              Show
            </label>
            <select
              id="table-scope"
              value={scope}
              onChange={(e) => {
                setScope(e.target.value as TableScope);
                setSelectedIds(null);
              }}
              className="rounded-md border border-border-light bg-white px-3 py-1.5 text-sm font-medium text-text-dark shadow-sm focus:border-primary focus:outline-none"
            >
              <option value="all">All campaigns</option>
              <option value="active">Active campaigns</option>
              <option value="past">Past campaigns</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light bg-bg-light text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="w-10 px-4 py-3">
                  <Checkbox
                    checked={allVisibleSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Select all campaigns"
                  />
                </th>
                <th className="px-4 py-3 font-medium">Campaign</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Active Dates</th>
                <th className="px-4 py-3 text-right font-medium">Clicks</th>
                <th className="px-4 py-3 text-right font-medium">Delivered</th>
                <th className="px-4 py-3 text-right font-medium">Activated</th>
                <th className="px-4 py-3 text-right font-medium">
                  Applied (PDAP)
                </th>
                <th className="px-4 py-3 text-right font-medium">Discount</th>
                <th className="px-4 py-3 text-right font-medium">Sales</th>
                <th className="px-4 py-3 text-right font-medium">Fee</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="px-4 py-8 text-center text-text-muted"
                  >
                    {rows.length === 0
                      ? "Activate a campaign to start seeing results."
                      : "No campaigns match this filter."}
                  </td>
                </tr>
              ) : (
                visibleRows.map((r) => (
                  <tr
                    key={r.campaign.id}
                    className="border-b border-border-light last:border-0 hover:bg-bg-light"
                  >
                    <td
                      className="px-4 py-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Checkbox
                        checked={isSelected(r.campaign.id)}
                        onCheckedChange={() => toggleRow(r.campaign.id)}
                        aria-label={`Include ${r.campaign.name}`}
                      />
                    </td>
                    <td
                      className="cursor-pointer px-4 py-3"
                      onClick={() =>
                        router.push(
                          `/campaign-manager/john-deere/${r.campaign.id}`
                        )
                      }
                    >
                      <div className="font-medium text-text-dark">
                        {r.campaign.name}
                      </div>
                      <div className="text-xs text-text-muted">
                        Built by {r.campaign.builtBy} · {r.campaign.category}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_PILL[r.status]}`}
                      >
                        {STATUS_LABEL[r.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {formatDate(r.startDate)} – {formatDate(r.endDate)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(r.clicks)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(r.delivered)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(r.activated)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(r.applied)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(r.discount)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-text-dark">
                      {formatCurrency(r.sales)}
                    </td>
                    <td className="px-4 py-3 text-right text-text-muted">
                      {formatCurrency(r.fee)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-text-muted">
        Reporting shown here can also be delivered as an automated CSV file on a
        recurring schedule — the same data, emailed to your team.
      </p>
    </div>
  );
}

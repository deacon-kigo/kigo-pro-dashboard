"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/molecules/PageHeader";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { useAppSelector } from "@/lib/redux/hooks";
import { useToast } from "@/lib/hooks/use-toast";
import {
  PaperAirplaneIcon,
  EnvelopeOpenIcon,
  TicketIcon,
  ReceiptPercentIcon,
  BanknotesIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { getCampaignById, DEALER } from "./mockData";
import type { PremadeCampaign } from "./types";
import { formatCurrency, formatNumber, formatDate } from "./utils";

interface ActiveRow {
  campaign: PremadeCampaign;
  startDate: string;
  endDate: string;
  sent: number;
  opened: number;
  used: number;
  discount: number;
  sales: number;
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

export default function DealerDashboardView() {
  const router = useRouter();
  const { toast } = useToast();
  const activations = useAppSelector((s) => s.jdPerks.activations);

  const rows: ActiveRow[] = useMemo(() => {
    return Object.values(activations)
      .map((a) => {
        const campaign = getCampaignById(a.campaignId);
        if (!campaign) return null;
        const p = campaign.performance;
        return {
          campaign,
          startDate: a.startDate,
          endDate: a.endDate,
          sent: p.sent,
          opened: p.opened,
          used: p.used,
          discount: p.discount,
          sales: p.sales,
        } as ActiveRow;
      })
      .filter((r): r is ActiveRow => r !== null)
      .sort((a, b) => b.sales - a.sales);
  }, [activations]);

  const totals = useMemo(() => {
    return rows.reduce(
      (acc, r) => ({
        sent: acc.sent + r.sent,
        opened: acc.opened + r.opened,
        used: acc.used + r.used,
        discount: acc.discount + r.discount,
        sales: acc.sales + r.sales,
      }),
      { sent: 0, opened: 0, used: 0, discount: 0, sales: 0 }
    );
  }, [rows]);

  const chartData = useMemo(
    () =>
      rows.map((r) => ({
        name:
          r.campaign.name.length > 16
            ? r.campaign.name.slice(0, 15) + "…"
            : r.campaign.name,
        Sales: r.sales,
        Discount: r.discount,
      })),
    [rows]
  );

  const openRate = totals.sent ? (totals.opened / totals.sent) * 100 : 0;
  const useRate = totals.sent ? (totals.used / totals.sent) * 100 : 0;

  const handleExportExcel = async () => {
    try {
      const XLSX = await import("xlsx");

      const summaryAoa = [
        ["Everglades Equipment — John Deere Perks Report"],
        ["Generated", new Date().toLocaleString("en-US")],
        [],
        ["Metric", "Value"],
        ["Messages sent", totals.sent],
        ["Opened", totals.opened],
        ["Redemptions (used)", totals.used],
        ["Total discount ($)", totals.discount],
        ["Attributed sales ($)", totals.sales],
        ["Open rate (%)", Number(openRate.toFixed(1))],
        ["Redemption rate (%)", Number(useRate.toFixed(1))],
      ];

      const detailHeader = [
        "Campaign",
        "Built by",
        "Category",
        "Start",
        "End",
        "Sent",
        "Opened",
        "Used",
        "Discount ($)",
        "Sales ($)",
      ];
      const detailRows = rows.map((r) => [
        r.campaign.name,
        r.campaign.builtBy,
        r.campaign.category,
        r.startDate,
        r.endDate,
        r.sent,
        r.opened,
        r.used,
        r.discount,
        r.sales,
      ]);

      const wb = XLSX.utils.book_new();
      const wsSummary = XLSX.utils.aoa_to_sheet(summaryAoa);
      wsSummary["!cols"] = [{ wch: 22 }, { wch: 28 }];
      XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

      const wsDetail = XLSX.utils.aoa_to_sheet([detailHeader, ...detailRows]);
      wsDetail["!cols"] = [
        { wch: 26 },
        { wch: 12 },
        { wch: 14 },
        { wch: 12 },
        { wch: 12 },
        { wch: 10 },
        { wch: 10 },
        { wch: 10 },
        { wch: 14 },
        { wch: 14 },
      ];
      XLSX.utils.book_append_sheet(wb, wsDetail, "By Campaign");

      const today = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `everglades-perks-report-${today}.xlsx`);
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
            onClick={handleExportExcel}
          >
            Export CSV report
          </Button>
        }
      />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-dark">
          Campaign performance
        </h2>
        <Badge variant="info" size="sm">
          Automated weekly CSV delivery enabled
        </Badge>
      </div>

      {/* Five MVP metrics */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <MetricCard
          label="Sent"
          value={formatNumber(totals.sent)}
          icon={<PaperAirplaneIcon className="h-5 w-5" />}
        />
        <MetricCard
          label="Opened"
          value={formatNumber(totals.opened)}
          sub={`${openRate.toFixed(1)}% open rate`}
          icon={<EnvelopeOpenIcon className="h-5 w-5" />}
        />
        <MetricCard
          label="Used"
          value={formatNumber(totals.used)}
          sub={`${useRate.toFixed(1)}% redemption`}
          icon={<TicketIcon className="h-5 w-5" />}
        />
        <MetricCard
          label="Discount given"
          value={formatCurrency(totals.discount)}
          icon={<ReceiptPercentIcon className="h-5 w-5" />}
        />
        <MetricCard
          label="Attributed sales"
          value={formatCurrency(totals.sales)}
          icon={<BanknotesIcon className="h-5 w-5" />}
        />
      </div>

      {/* Chart */}
      <div className="rounded-lg border border-border-light bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-text-dark">
          Sales vs. discount by campaign
        </h3>
        {chartData.length === 0 ? (
          <p className="py-12 text-center text-sm text-text-muted">
            No active campaigns yet.
          </p>
        ) : (
          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E4E5E7" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => `$${(v / 1000).toLocaleString()}k`}
                />
                <Tooltip
                  formatter={(v: number) => formatCurrency(v)}
                  cursor={{ fill: "rgba(54,124,43,0.06)" }}
                />
                <Legend />
                <Bar dataKey="Sales" fill="#367C2B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Discount" fill="#FFAE34" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Per-campaign table */}
      <div className="overflow-hidden rounded-lg border border-border-light bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border-light bg-bg-light text-left text-xs uppercase tracking-wide text-text-muted">
                <th className="px-4 py-3 font-medium">Campaign</th>
                <th className="px-4 py-3 font-medium">Window</th>
                <th className="px-4 py-3 text-right font-medium">Sent</th>
                <th className="px-4 py-3 text-right font-medium">Opened</th>
                <th className="px-4 py-3 text-right font-medium">Used</th>
                <th className="px-4 py-3 text-right font-medium">Discount</th>
                <th className="px-4 py-3 text-right font-medium">Sales</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-text-muted"
                  >
                    Activate a campaign to start seeing results.
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr
                    key={r.campaign.id}
                    className="cursor-pointer border-b border-border-light last:border-0 hover:bg-bg-light"
                    onClick={() =>
                      router.push(
                        `/campaign-manager/john-deere/${r.campaign.id}`
                      )
                    }
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-text-dark">
                        {r.campaign.name}
                      </div>
                      <div className="text-xs text-text-muted">
                        Built by {r.campaign.builtBy} · {r.campaign.category}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {formatDate(r.startDate)} – {formatDate(r.endDate)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(r.sent)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(r.opened)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatNumber(r.used)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {formatCurrency(r.discount)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-text-dark">
                      {formatCurrency(r.sales)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-text-muted">
        Reporting shown here can also be delivered as an automated CSV file on
        a recurring schedule — the same data, emailed to your team.
      </p>
    </div>
  );
}

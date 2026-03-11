"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingPageConfig } from "@/types/tmt-campaign";
import { getCampaignStatus, CampaignStatus } from "./campaignListColumns";

// ---------------------------------------------------------------------------
// Hook: measure container width via ResizeObserver
// ---------------------------------------------------------------------------
function useContainerSize() {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const { width, height } = entry.contentRect;
        setSize((prev) =>
          prev.width === Math.floor(width) && prev.height === Math.floor(height)
            ? prev
            : { width: Math.floor(width), height: Math.floor(height) }
        );
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { ref, ...size };
}

// ---------------------------------------------------------------------------
// Kigo Pro brand palette
// ---------------------------------------------------------------------------
const K = {
  blue: "#328FE5",
  darkSkyBlue: "#25BDFE",
  purple: "#8941EB",
  green: "#77D898",
  red: "#DC1021",
  orange: "#FF8717",
  black: "#231F20",
  charcoal: "#5A5858",
  gray100: "#E4E5E7",
  gray500: "#717585",
  stone: "#f6f5f1",
  pastelBlue: "#E1F0FF",
  pastelPurple: "#F3E8FF",
  pastelGreen: "#DCFCE7",
  pastelOrange: "#FFEDD5",
  pastelRed: "#FEE2E2",
  blue50: "#EFF6FF",
  gridStroke: "#eef2f6",
} as const;

const STATUS_META: Record<CampaignStatus, { color: string; label: string }> = {
  active: { color: K.green, label: "Active" },
  expired: { color: K.red, label: "Expired" },
  inactive: { color: K.gray500, label: "Inactive" },
};

const TYPE_META: Record<
  string,
  { fill: string; stroke: string; label: string }
> = {
  "": { fill: K.pastelBlue, stroke: K.blue, label: "Standard" },
  pos: { fill: K.pastelPurple, stroke: K.purple, label: "POS" },
  "with-timer": { fill: K.pastelOrange, stroke: K.orange, label: "Timer" },
  online: { fill: K.blue50, stroke: K.darkSkyBlue, label: "Online" },
  "direct-link": { fill: K.pastelGreen, stroke: K.green, label: "Direct" },
};

// ---------------------------------------------------------------------------
// Custom tooltip
// ---------------------------------------------------------------------------
function ChartTooltipContent({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white p-2.5 shadow-lg rounded-lg border border-gray-100 text-xs">
      {label && <p className="font-semibold mb-1 text-gray-900">{label}</p>}
      {payload.map((entry: any, i: number) => (
        <div key={i} className="flex items-center gap-1.5 mb-0.5">
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: entry.color || entry.payload?.fill }}
          />
          <span className="text-gray-500">{entry.name}:</span>
          <span className="font-semibold text-gray-900">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
interface CampaignAnalyticsProps {
  campaigns: LandingPageConfig[];
}

export default function CampaignAnalytics({
  campaigns,
}: CampaignAnalyticsProps) {
  const donutContainer = useContainerSize();
  const barContainer = useContainerSize();
  const areaContainer = useContainerSize();

  const stats = useMemo(() => {
    const total = campaigns.length;
    const byStat = { active: 0, expired: 0, inactive: 0 };
    for (const c of campaigns) byStat[getCampaignStatus(c)]++;
    const expiringSoon = campaigns.filter((c) => {
      if (!c.endCampaignDate || getCampaignStatus(c) !== "active") return false;
      const d = Math.ceil(
        (new Date(c.endCampaignDate).getTime() - Date.now()) / 864e5
      );
      return d > 0 && d <= 7;
    }).length;
    return { total, ...byStat, expiringSoon };
  }, [campaigns]);

  const donutData = useMemo(
    () =>
      (["active", "expired", "inactive"] as CampaignStatus[])
        .map((s) => ({
          status: s,
          value: stats[s],
          fill: STATUS_META[s].color,
        }))
        .filter((d) => d.value > 0),
    [stats]
  );

  const barData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const c of campaigns) {
      if (getCampaignStatus(c) !== "active") continue;
      const t = c.getCode || "";
      counts[t] = (counts[t] || 0) + 1;
    }
    return Object.entries(counts)
      .map(([type, count]) => ({
        name: TYPE_META[type]?.label ?? type,
        count,
        fill: TYPE_META[type]?.fill ?? K.gray100,
        stroke: TYPE_META[type]?.stroke ?? K.charcoal,
      }))
      .sort((a, b) => b.count - a.count);
  }, [campaigns]);

  const timelineData = useMemo(() => {
    const now = Date.now();
    const buckets = [
      { name: "Wk 1", count: 0 },
      { name: "Wk 2", count: 0 },
      { name: "Wk 3", count: 0 },
      { name: "Wk 4", count: 0 },
    ];
    const ranges = [
      [0, 7],
      [7, 14],
      [14, 21],
      [21, 30],
    ];
    for (const c of campaigns) {
      if (!c.endCampaignDate || getCampaignStatus(c) !== "active") continue;
      const d = Math.ceil(
        (new Date(c.endCampaignDate).getTime() - now) / 864e5
      );
      if (d < 0) continue;
      for (let i = 0; i < ranges.length; i++) {
        if (d >= ranges[i][0] && d < ranges[i][1]) {
          buckets[i].count++;
          break;
        }
      }
    }
    return buckets;
  }, [campaigns]);

  const hasTimelineData = timelineData.some((b) => b.count > 0);

  const gaps = useMemo(() => {
    const inactive = campaigns.filter(
      (c) => getCampaignStatus(c) === "inactive"
    );
    if (!inactive.length) return [];
    return [
      {
        label: "Missing form",
        count: inactive.filter((c) => !c.showForm).length,
        color: K.blue,
        bg: K.pastelBlue,
      },
      {
        label: "No images",
        count: inactive.filter((c) => !c.logo?.url && !c.image?.url).length,
        color: K.purple,
        bg: K.pastelPurple,
      },
      {
        label: "No end date",
        count: inactive.filter((c) => !c.endCampaignDate).length,
        color: K.orange,
        bg: K.pastelOrange,
      },
    ].filter((g) => g.count > 0);
  }, [campaigns]);

  const activePct =
    stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0;

  const DONUT_H = 120;
  const CHART_H = 110;

  return (
    <div className="grid grid-cols-4 gap-3">
      {/* ── Card 1: Total Campaigns — Donut ────────────────────────── */}
      <Card
        className="overflow-hidden transition-shadow duration-200 hover:shadow-md"
        style={{
          borderTop: `2.5px solid ${K.blue}`,
          background: `linear-gradient(180deg, ${K.pastelBlue}40 0%, white 60%)`,
        }}
      >
        <CardHeader className="pb-0 pt-3 px-4">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Campaigns
          </CardTitle>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tabular-nums leading-none tracking-tight">
              {stats.total}
            </span>
            <span className="text-xs text-muted-foreground">campaigns</span>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-2">
          <div
            ref={donutContainer.ref}
            style={{ width: "100%", height: DONUT_H, overflow: "hidden" }}
          >
            {stats.total > 0 && donutContainer.width > 0 ? (
              <PieChart width={donutContainer.width} height={DONUT_H}>
                <Tooltip content={<ChartTooltipContent />} />
                <Pie
                  data={donutData}
                  dataKey="value"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius="55%"
                  outerRadius="85%"
                  paddingAngle={4}
                  startAngle={90}
                  endAngle={-270}
                  stroke="none"
                >
                  {donutData.map((d) => (
                    <Cell key={d.status} fill={d.fill} />
                  ))}
                </Pie>
              </PieChart>
            ) : stats.total === 0 ? (
              <div className="flex items-center justify-center h-full">
                <span className="text-sm text-muted-foreground">
                  No campaigns
                </span>
              </div>
            ) : null}
          </div>
          {donutData.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-1">
              {donutData.map((d) => (
                <div key={d.status} className="flex items-center gap-1.5">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: d.fill }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {STATUS_META[d.status as CampaignStatus].label}
                  </span>
                  <span className="text-sm font-bold tabular-nums">
                    {d.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Card 2: Active by Type — Bar chart ─────────────────────── */}
      <Card
        className="overflow-hidden transition-shadow duration-200 hover:shadow-md"
        style={{
          borderTop: `2.5px solid ${K.green}`,
          background: `linear-gradient(180deg, ${K.pastelGreen}40 0%, white 60%)`,
        }}
      >
        <CardHeader className="pb-0 pt-3 px-4">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Active by Type
            </CardTitle>
            <span
              className="text-[11px] font-bold rounded-full px-1.5 py-[1px] text-white"
              style={{ backgroundColor: K.green }}
            >
              {activePct}%
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tabular-nums leading-none tracking-tight">
              {stats.active}
            </span>
            <span className="text-xs text-muted-foreground">active</span>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-3">
          {barData.length > 0 ? (
            <div className="mt-2 space-y-3">
              {/* Stacked horizontal bar */}
              <div className="w-full h-3 rounded-full overflow-hidden flex">
                {barData.map((b) => {
                  const pct =
                    stats.active > 0 ? (b.count / stats.active) * 100 : 0;
                  return (
                    <div
                      key={b.name}
                      className="h-full first:rounded-l-full last:rounded-r-full"
                      style={{
                        width: `${Math.max(pct, 3)}%`,
                        backgroundColor: b.stroke,
                        transition: "width 0.8s cubic-bezier(0.22,1,0.36,1)",
                      }}
                      title={`${b.name}: ${b.count}`}
                    />
                  );
                })}
              </div>
              {/* Legend */}
              <div className="flex flex-wrap gap-x-3 gap-y-1.5">
                {barData.map((b) => (
                  <div key={b.name} className="flex items-center gap-1.5">
                    <span
                      className="w-3 h-3 rounded-[2px] shrink-0"
                      style={{ backgroundColor: b.stroke }}
                    />
                    <span className="text-sm text-muted-foreground">
                      {b.name}
                    </span>
                    <span className="text-sm font-bold tabular-nums">
                      {b.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center py-6">
              <span className="text-sm text-muted-foreground">
                No active campaigns
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Card 3: Expiry Timeline — Area chart ───────────────────── */}
      <Card
        className="overflow-hidden transition-shadow duration-200 hover:shadow-md"
        style={{
          borderTop: `2.5px solid ${K.orange}`,
          background: `linear-gradient(180deg, ${K.pastelOrange}40 0%, white 60%)`,
        }}
      >
        <CardHeader className="pb-0 pt-3 px-4">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Expiry Timeline
            </CardTitle>
            {stats.expiringSoon > 0 && (
              <span
                className="text-[11px] font-bold rounded-full px-1.5 py-[1px] text-white"
                style={{ backgroundColor: K.orange }}
              >
                {stats.expiringSoon} this wk
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tabular-nums leading-none tracking-tight">
              {stats.expired}
            </span>
            <span className="text-xs text-muted-foreground">expired</span>
          </div>
        </CardHeader>
        <CardContent className="px-2 pb-2">
          <div
            ref={areaContainer.ref}
            style={{ width: "100%", height: CHART_H, overflow: "hidden" }}
          >
            {areaContainer.width > 0 ? (
              hasTimelineData ? (
                <AreaChart
                  width={areaContainer.width}
                  height={CHART_H}
                  data={timelineData}
                  margin={{ top: 4, right: 8, bottom: 4, left: -12 }}
                >
                  <defs>
                    <linearGradient id="fillExpiry" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={K.orange}
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor={K.orange}
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={K.gridStroke}
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#64748B" }}
                    tickMargin={4}
                    interval={0}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: "#64748B" }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke={K.orange}
                    strokeWidth={2.5}
                    fill="url(#fillExpiry)"
                    dot={{
                      r: 3.5,
                      fill: "#ffffff",
                      stroke: K.orange,
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 5,
                      fill: K.orange,
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                </AreaChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-sm text-muted-foreground">
                    No upcoming expirations
                  </span>
                </div>
              )
            ) : null}
          </div>
        </CardContent>
      </Card>

      {/* ── Card 4: Inactive — Config gaps ─────────────────────────── */}
      <Card
        className="overflow-hidden transition-shadow duration-200 hover:shadow-md"
        style={{
          borderTop: `2.5px solid ${K.gray500}`,
          background: `linear-gradient(180deg, ${K.stone}80 0%, white 60%)`,
        }}
      >
        <CardHeader className="pb-0 pt-3 px-4">
          <div className="flex items-center justify-between w-full">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Inactive
            </CardTitle>
            {gaps.length > 0 && (
              <span
                className="text-[11px] font-bold rounded-full px-1.5 py-[1px]"
                style={{ color: K.gray500, backgroundColor: K.stone }}
              >
                {gaps.length} gap{gaps.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold tabular-nums leading-none tracking-tight">
              {stats.inactive}
            </span>
            <span className="text-xs text-muted-foreground">inactive</span>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-2">
          <div className="mt-2">
            {gaps.length > 0 ? (
              <div className="space-y-3">
                {gaps.map((g) => {
                  const pct =
                    stats.inactive > 0
                      ? Math.round((g.count / stats.inactive) * 100)
                      : 0;
                  return (
                    <div key={g.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {g.label}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold tabular-nums">
                            {g.count}
                          </span>
                          <span
                            className="text-[10px] font-bold px-1 py-0.5 rounded-full"
                            style={{ color: g.color, backgroundColor: g.bg }}
                          >
                            {pct}%
                          </span>
                        </div>
                      </div>
                      <div
                        className="w-full h-[7px] rounded-full overflow-hidden"
                        style={{ backgroundColor: g.bg }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.max(pct, 6)}%`,
                            backgroundColor: g.color,
                            transition:
                              "width 0.8s cubic-bezier(0.22,1,0.36,1)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <span className="text-sm text-muted-foreground">
                All campaigns are active or expired
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

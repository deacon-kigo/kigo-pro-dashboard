"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Public types — keep the API small + extension-friendly.
// ---------------------------------------------------------------------------

/** Item must expose at least an id + a start/end string. Anything else is
 * carried through the generic <T> so callers can render it however they want. */
export interface TimelineItem {
  id: string;
  /** Start date — anything Date.parse() accepts (e.g. "Mar 1, 2026"). */
  start: string;
  /** End date. */
  end: string;
}

/** Per-item visual variant. Caller decides which class names to use so the
 * component stays decoupled from any palette. */
export interface TimelineStatusVariant {
  /** Background utility class for the duration bar. */
  bar: string;
  /** Background utility class for the small dot. */
  dot: string;
  /** When true, the bar drops shadow + hover affordance (e.g. expired). */
  demoted?: boolean;
}

const DEFAULT_VARIANT: TimelineStatusVariant = {
  bar: "bg-primary",
  dot: "bg-primary",
};

export interface TimelineProps<T extends TimelineItem> {
  items: T[];

  /** Render the left label column for each row. Receives the full item so
   * callers can show name, meta, badges — whatever fits the surface. */
  renderLabel: (item: T) => React.ReactNode;

  /** Per-item visual variant (bar + dot color, demoted state). */
  getStatusVariant?: (item: T) => TimelineStatusVariant;

  /** When provided, each row becomes a navigable Link. */
  getHref?: (item: T) => string;

  /** Fires on click. Useful for side-effects (analytics, prefetch,
   * stashing item data in localStorage before navigation, etc.). */
  onItemClick?: (item: T) => void;

  /** Year to show by default. Defaults to the current calendar year. */
  defaultYear?: number;

  /** Show the year jump bar in the top-right. Defaults to true. */
  showYearJumps?: boolean;

  /** Render a "today" marker line across rows. Defaults to true. */
  showTodayMarker?: boolean;

  /** Width of the label column. Defaults to 260px. */
  labelWidth?: number;

  /** Height of the timeline track per row (controls bar centering). Defaults to 36px. */
  rowHeight?: number;

  /** aria-label for the timeline region. */
  "aria-label"?: string;
}

// ---------------------------------------------------------------------------
// Range / axis math
// ---------------------------------------------------------------------------

interface TimelineRange {
  minTime: number;
  maxTime: number;
  spanMs: number;
  months: { year: number; monthIndex: number; label: string; pct: number }[];
}

function startOfMonth(d: Date) {
  const r = new Date(d);
  r.setDate(1);
  r.setHours(0, 0, 0, 0);
  return r.getTime();
}

function startOfNextMonth(d: Date) {
  const r = new Date(d);
  r.setMonth(r.getMonth() + 1, 1);
  r.setHours(0, 0, 0, 0);
  return r.getTime();
}

/** Window covering all of Jan 1 → Dec 31 of the given year. */
function yearWindow(year: number): { minTime: number; maxTime: number } {
  return {
    minTime: new Date(year, 0, 1).getTime(),
    maxTime: new Date(year + 1, 0, 1).getTime(),
  };
}

/** Years that appear in the items' start/end dates, ascending. */
function extractYears(items: TimelineItem[]): number[] {
  const years = new Set<number>();
  for (const item of items) {
    const s = Date.parse(item.start);
    const e = Date.parse(item.end);
    if (!isNaN(s)) years.add(new Date(s).getFullYear());
    if (!isNaN(e)) years.add(new Date(e).getFullYear());
  }
  return Array.from(years).sort((a, b) => a - b);
}

function buildRangeFromWindow(minTime: number, maxTime: number): TimelineRange {
  const spanMs = Math.max(maxTime - minTime, 1);

  // Adaptive axis density so wide ranges don't get noisy.
  const months: TimelineRange["months"] = [];
  const totalMonths = Math.round(spanMs / (30 * 24 * 60 * 60 * 1000));
  const step = totalMonths > 24 ? 3 : totalMonths > 14 ? 2 : 1;

  // Start at the first month boundary at or after minTime so ticks align.
  const cursor = new Date(minTime);
  cursor.setDate(1);
  cursor.setHours(0, 0, 0, 0);
  if (cursor.getTime() < minTime) cursor.setMonth(cursor.getMonth() + 1);

  let i = 0;
  while (cursor.getTime() < maxTime) {
    if (i % step === 0) {
      months.push({
        year: cursor.getFullYear(),
        monthIndex: cursor.getMonth(),
        label: cursor.toLocaleString("en-US", { month: "short" }).toUpperCase(),
        pct: ((cursor.getTime() - minTime) / spanMs) * 100,
      });
    }
    cursor.setMonth(cursor.getMonth() + 1);
    i++;
  }

  return { minTime, maxTime, spanMs, months };
}

/** Return a raw percentage — may be negative or >100 when the time falls
 * outside the visible window. Callers clip via CSS `overflow-hidden` on the
 * track, which preserves the bar's true geometry: a bar that overflows on
 * the left reads as "continues from earlier", on the right as "extends past
 * the window". */
function pctOf(time: number, range: TimelineRange): number {
  return ((time - range.minTime) / range.spanMs) * 100;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function YearJumps({
  years,
  activeYear,
  onJump,
}: {
  years: number[];
  activeYear: number | null;
  onJump: (year: number) => void;
}) {
  if (years.length === 0) return null;
  return (
    <div className="flex items-center justify-end gap-1 text-sm">
      {years.map((year) => {
        const isActive = year === activeYear;
        return (
          <button
            key={year}
            type="button"
            onClick={() => onJump(year)}
            className={`rounded-md px-2.5 py-1 font-semibold tabular-nums transition-colors ${
              isActive
                ? "bg-pastel-blue text-primary"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            aria-pressed={isActive}
          >
            {year}
          </button>
        );
      })}
    </div>
  );
}

function TimelineAxis({ range }: { range: TimelineRange }) {
  return (
    <div className="relative h-6">
      {range.months.map((m, idx) => {
        const showYear =
          idx === 0 ||
          m.year !== range.months[idx - 1].year ||
          m.monthIndex === 0;
        return (
          <div
            key={`${m.year}-${m.monthIndex}`}
            className="absolute bottom-0 -translate-x-1/2 whitespace-nowrap text-xs font-semibold uppercase tracking-wider tabular-nums text-gray-500"
            style={{ left: `${m.pct}%` }}
          >
            {showYear && <span className="mr-1 text-gray-900">{m.year}</span>}
            {m.label}
          </div>
        );
      })}
    </div>
  );
}

function TimelineRow<T extends TimelineItem>({
  item,
  range,
  variant,
  rowHeight,
  gridStyle,
  renderLabel,
  showTodayMarker,
}: {
  item: T;
  range: TimelineRange;
  variant: TimelineStatusVariant;
  rowHeight: number;
  gridStyle: React.CSSProperties;
  renderLabel: (item: T) => React.ReactNode;
  showTodayMarker: boolean;
}) {
  const startMs = Date.parse(item.start);
  const endMs = Date.parse(item.end);
  const valid = !isNaN(startMs) && !isNaN(endMs) && endMs > startMs;
  const leftPct = valid ? pctOf(startMs, range) : 0;
  const rightPct = valid ? pctOf(endMs, range) : 0;
  const widthPct = Math.max(rightPct - leftPct, 1.5);

  const now = Date.now();
  const todayPct =
    showTodayMarker && now >= range.minTime && now <= range.maxTime
      ? pctOf(now, range)
      : null;

  return (
    <div className="grid items-center gap-x-6 py-3" style={gridStyle}>
      <div className="min-w-0">{renderLabel(item)}</div>
      <div className="relative overflow-hidden" style={{ height: rowHeight }}>
        {range.months.map((m) => (
          <div
            key={`tick-${m.year}-${m.monthIndex}`}
            className="absolute inset-y-0 w-px bg-gray-100"
            style={{ left: `${m.pct}%` }}
            aria-hidden="true"
          />
        ))}

        {valid && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 h-5 rounded transition-shadow ${variant.bar} ${
              variant.demoted ? "" : "shadow-sm group-hover:shadow-md"
            }`}
            style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
            title={`${item.start} → ${item.end}`}
          />
        )}

        {todayPct !== null && (
          <div
            className="pointer-events-none absolute inset-y-0 z-10 w-px bg-coral"
            style={{ left: `${todayPct}%` }}
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export function Timeline<T extends TimelineItem>({
  items,
  renderLabel,
  getStatusVariant,
  getHref,
  onItemClick,
  defaultYear,
  showYearJumps = true,
  showTodayMarker = true,
  labelWidth = 260,
  rowHeight = 36,
  "aria-label": ariaLabel,
}: TimelineProps<T>) {
  // Years derived from data — drives the jump bar.
  const years = useMemo(() => extractYears(items), [items]);

  // Pick a sensible default year: caller override → current year if data has
  // it → most recent year with data → current year regardless.
  const initialYear = useMemo(() => {
    if (defaultYear) return defaultYear;
    const currentYear = new Date().getFullYear();
    if (years.includes(currentYear)) return currentYear;
    return years[years.length - 1] ?? currentYear;
  }, [defaultYear, years]);

  // Track the visible window as an absolute {minTime, maxTime} pair so drag
  // can update it directly without going through preset state.
  const [viewWindow, setViewWindow] = useState(() => yearWindow(initialYear));

  // A year is "active" iff the current view exactly matches its Jan–Dec
  // window. Drag breaks that match (which is correct — the user has moved
  // off the preset).
  const activeYear = useMemo(() => {
    for (const y of years) {
      const w = yearWindow(y);
      if (
        w.minTime === viewWindow.minTime &&
        w.maxTime === viewWindow.maxTime
      ) {
        return y;
      }
    }
    return null;
  }, [years, viewWindow.minTime, viewWindow.maxTime]);

  const range = useMemo(
    () => buildRangeFromWindow(viewWindow.minTime, viewWindow.maxTime),
    [viewWindow.minTime, viewWindow.maxTime]
  );

  // Sort by start ascending so bars step diagonally down-and-right.
  const sortedItems = useMemo(
    () =>
      [...items].sort(
        (a, b) => (Date.parse(a.start) || 0) - (Date.parse(b.start) || 0)
      ),
    [items]
  );

  const gridStyle: React.CSSProperties = {
    gridTemplateColumns: `${labelWidth}px minmax(0, 1fr)`,
  };

  // ---- Drag-to-pan ----
  // The track is the right column of the grid. Capturing the drag on a wrapper
  // div around axis + rows lets the user grab anywhere in the timeline area.
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStateRef = useRef<{
    startX: number;
    startMin: number;
    startMax: number;
    trackWidth: number;
  } | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Ignore drags that begin on interactive elements inside rows (links,
      // buttons) so clicks still navigate.
      const target = e.target as HTMLElement;
      if (target.closest("a, button")) return;

      const trackWidth = trackRef.current?.getBoundingClientRect().width ?? 0;
      if (trackWidth <= 0) return;

      dragStateRef.current = {
        startX: e.clientX,
        startMin: viewWindow.minTime,
        startMax: viewWindow.maxTime,
        trackWidth,
      };
      setIsDragging(true);
      e.preventDefault();
    },
    [viewWindow.minTime, viewWindow.maxTime]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e: MouseEvent) => {
      const drag = dragStateRef.current;
      if (!drag) return;
      const span = drag.startMax - drag.startMin;
      const deltaX = e.clientX - drag.startX;
      // Drag right → see earlier time (content moves right, range shifts left)
      const deltaTime = (deltaX / drag.trackWidth) * span;
      setViewWindow({
        minTime: Math.round(drag.startMin - deltaTime),
        maxTime: Math.round(drag.startMax - deltaTime),
      });
    };

    const handleUp = () => {
      dragStateRef.current = null;
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const handleYearJump = useCallback(
    (year: number) => setViewWindow(yearWindow(year)),
    []
  );

  return (
    <section className="space-y-4" aria-label={ariaLabel}>
      {showYearJumps && (
        <YearJumps
          years={years}
          activeYear={activeYear}
          onJump={handleYearJump}
        />
      )}

      <div className="relative select-none">
        {/* Axis */}
        <div
          className="grid items-end gap-x-6 border-b border-gray-200 pb-1.5"
          style={gridStyle}
        >
          <div />
          <TimelineAxis range={range} />
        </div>

        {/* Draggable track wrapper — wraps the rows so the user can grab
            anywhere on the timeline side to pan through time. */}
        <div
          ref={trackRef}
          onMouseDown={handleMouseDown}
          className={isDragging ? "cursor-grabbing" : "cursor-grab"}
          aria-label="Drag to pan through time"
        >
          <ul className="divide-y divide-gray-100">
            {sortedItems.map((item) => {
              const variant = getStatusVariant?.(item) ?? DEFAULT_VARIANT;
              const href = getHref?.(item);
              const rowChildren = (
                <TimelineRow
                  item={item}
                  range={range}
                  variant={variant}
                  rowHeight={rowHeight}
                  gridStyle={gridStyle}
                  renderLabel={renderLabel}
                  showTodayMarker={showTodayMarker}
                />
              );
              return (
                <li key={item.id}>
                  {href && !isDragging ? (
                    <Link
                      href={href}
                      onClick={() => onItemClick?.(item)}
                      className="group block transition-colors hover:bg-gray-50/80 focus-visible:bg-gray-50 focus-visible:outline-none"
                      draggable={false}
                    >
                      {rowChildren}
                    </Link>
                  ) : (
                    <div className="group">{rowChildren}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

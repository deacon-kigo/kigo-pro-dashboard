"use client";

import { useEffect, useMemo, useState } from "react";

import { DataTable } from "@/components/organisms/DataTable";
import { Button } from "@/components/prod/button";
import { Card } from "@/components/prod/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/prod/tabs";
import { toProHref } from "@/components/prod/_runtime/link";
import { useRouter } from "@/components/prod/_runtime/navigation";
import PublisherFilterBar from "@/components/features/publisher-manager/PublisherFilterBar";
import {
  parseFilters,
  statusTag,
  type FilterTag,
} from "@/components/features/publisher-manager/filterLogic";

import {
  DISPUTES,
  DISPUTE_STATUS,
  INVOICES,
  INVOICE_STATUS,
  invoiceDecision,
  type DisputeStatus,
  type InvoiceStatus,
} from "./data";
import { disputeColumns, invoiceColumns } from "./columns";
import { EVENT, readDecisions } from "./decisions";
import { JOHN_DEERE } from "./partner";

interface Overrides {
  invoices: Record<string, InvoiceStatus>;
  disputes: Record<string, DisputeStatus>;
}

const INVOICE_STATUS_OPTIONS = (
  Object.keys(INVOICE_STATUS) as InvoiceStatus[]
).map((key) => ({
  label: INVOICE_STATUS[key].label,
  value: key,
}));

const DISPUTE_STATUS_OPTIONS = (
  Object.keys(DISPUTE_STATUS) as DisputeStatus[]
).map((key) => ({
  label: DISPUTE_STATUS[key].label,
  value: key,
}));

const INVOICE_PENDING_TAG: FilterTag = {
  ...statusTag("pending"),
  label: INVOICE_STATUS.pending.label,
};
const DISPUTE_PENDING_TAG: FilterTag = {
  ...statusTag("pending"),
  label: DISPUTE_STATUS.pending.label,
};

const queueHref = (next: "invoices" | "disputes") =>
  toProHref(
    next === "disputes" ? "/john-deere?tab=disputes" : "/john-deere"
  ) as string;

const onlyPending = (filters: FilterTag[]) =>
  filters.length === 1 &&
  filters[0].category === "status" &&
  filters[0].value === "status:pending";

const minutes = (time: string) => {
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) return 0;
  const hour = Number(match[1]) % 12;
  const offset = match[3].toUpperCase() === "PM" ? 12 : 0;
  return (hour + offset) * 60 + Number(match[2]);
};

const queueOrder = <T extends { status: string; date: string; time: string }>(
  a: T,
  b: T
) => {
  const waiting = a.status === "pending" ? 0 : 1;
  const other = b.status === "pending" ? 0 : 1;
  if (waiting !== other) return waiting - other;
  const oldestFirst =
    a.date.localeCompare(b.date) || minutes(a.time) - minutes(b.time);
  return waiting === 0 ? oldestFirst : -oldestFirst;
};

const Stat = ({
  label,
  onClick,
  value,
}: {
  label: string;
  onClick: () => void;
  value: number;
}) => (
  <button
    className="min-h-8 rounded-md px-2 py-1 text-left hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    onClick={onClick}
    type="button"
  >
    <span className="block text-sm font-medium text-gray-600">{label}</span>
    <span className="block font-mono text-2xl font-semibold text-gray-900 tabular-nums">
      {value}
    </span>
  </button>
);

const ReviewQueue = ({
  initialTab = "invoices",
}: {
  initialTab?: "invoices" | "disputes";
}) => {
  const router = useRouter();
  const [tab, setTab] = useState(
    initialTab === "disputes" ? "disputes" : "invoices"
  );
  const [overrides, setOverrides] = useState<Overrides>({
    disputes: {},
    invoices: {},
  });
  const [filters, setFilters] = useState<FilterTag[]>([INVOICE_PENDING_TAG]);
  const [dFilters, setDFilters] = useState<FilterTag[]>([DISPUTE_PENDING_TAG]);

  useEffect(() => {
    const sync = () => setOverrides(readDecisions());
    sync();
    window.addEventListener(EVENT, sync);
    return () => window.removeEventListener(EVENT, sync);
  }, []);

  const invoiceSource = useMemo(
    () =>
      INVOICES.map((row) =>
        overrides.invoices[row.invoice]
          ? { ...row, status: overrides.invoices[row.invoice] }
          : row
      ),
    [overrides]
  );
  const disputeSource = useMemo(
    () =>
      DISPUTES.map((row) =>
        overrides.disputes[row.invoice]
          ? { ...row, status: overrides.disputes[row.invoice] }
          : row
      ),
    [overrides]
  );
  const pendingCount = invoiceSource.filter(
    (row) => row.status === "pending"
  ).length;
  const openCount = disputeSource.filter(
    (row) => row.status === "pending"
  ).length;

  const invoiceParsed = useMemo(() => parseFilters(filters), [filters]);
  const disputeParsed = useMemo(() => parseFilters(dFilters), [dFilters]);

  const invoices = useMemo(() => {
    return invoiceSource
      .filter((row) => {
        if (
          invoiceParsed.statuses.size > 0 &&
          !invoiceParsed.statuses.has(row.status)
        )
          return false;
        return invoiceParsed.searchTerms.every((term) =>
          [
            row.invoice,
            row.dealership,
            row.city,
            row.submitter,
            row.email,
          ].some((value) => value.toLowerCase().includes(term))
        );
      })
      .sort(queueOrder);
  }, [invoiceSource, invoiceParsed]);

  const disputes = useMemo(() => {
    return disputeSource
      .filter((row) => {
        if (
          disputeParsed.statuses.size > 0 &&
          !disputeParsed.statuses.has(row.status)
        )
          return false;
        return disputeParsed.searchTerms.every((term) =>
          [
            row.promotion,
            row.dealership,
            row.city,
            row.submitter,
            row.email,
          ].some((value) => value.toLowerCase().includes(term))
        );
      })
      .sort(queueOrder);
  }, [disputeSource, disputeParsed]);

  const goToQueue = (next: "invoices" | "disputes") => {
    setTab(next);
    router.replace(queueHref(next));
    if (next === "disputes") setDFilters([DISPUTE_PENDING_TAG]);
    else setFilters([INVOICE_PENDING_TAG]);
  };

  return (
    <div>
      <Card
        className="mb-4 overflow-hidden px-6 py-5"
        roundness="lg"
        style={{ borderTop: `3px solid ${JOHN_DEERE.green}` }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img
              alt={JOHN_DEERE.name}
              className="h-8 w-auto shrink-0"
              src="/logos/john-deere.svg"
            />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                John Deere support
              </h1>
              <p className="mt-1 text-base text-gray-600">
                Dealer-submitted invoices and disputes for the John Deere
                reimbursement program.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Stat
              label="Invoices pending"
              onClick={() => goToQueue("invoices")}
              value={pendingCount}
            />
            <div className="h-8 w-px bg-gray-200" />
            <Stat
              label="Disputes open"
              onClick={() => goToQueue("disputes")}
              value={openCount}
            />
          </div>
        </div>
      </Card>

      <Tabs
        className="mt-4"
        onValueChange={(value) => {
          setTab(value);
          router.replace(
            queueHref(value === "disputes" ? "disputes" : "invoices")
          );
        }}
        value={tab}
      >
        <TabsList className="w-[280px]">
          <TabsTrigger value="invoices">
            Invoices · {INVOICES.length}
          </TabsTrigger>
          <TabsTrigger value="disputes">
            Disputes · {DISPUTES.length}
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "invoices" ? (
        <section className="mt-4">
          <div className="mb-4">
            <PublisherFilterBar
              offerTypeOptions={[]}
              onFiltersChange={setFilters}
              placeholder="Filter by status or search invoices…"
              selectedFilters={filters}
              statusOptions={INVOICE_STATUS_OPTIONS}
            />
          </div>
          <DataTable
            columns={invoiceColumns}
            data={invoices}
            emptyState={
              <EmptyState
                noun="invoices"
                onClear={() => setFilters([])}
                waiting={onlyPending(filters)}
              />
            }
            enableColumnDrag
            onRowClick={(row) =>
              router.push(
                toProHref(
                  `/john-deere/invoices/${row.invoice}?decision=${invoiceDecision(row.status)}`
                ) as string
              )
            }
          />
        </section>
      ) : (
        <section className="mt-4">
          <div className="mb-4">
            <PublisherFilterBar
              offerTypeOptions={[]}
              onFiltersChange={setDFilters}
              placeholder="Filter by status or search disputes…"
              selectedFilters={dFilters}
              statusOptions={DISPUTE_STATUS_OPTIONS}
            />
          </div>
          <DataTable
            columns={disputeColumns}
            data={disputes}
            emptyState={
              <EmptyState
                noun="disputes"
                onClear={() => setDFilters([])}
                waiting={onlyPending(dFilters)}
              />
            }
            enableColumnDrag
            onRowClick={(row) =>
              router.push(
                toProHref(
                  `/john-deere/disputes/${row.invoice}?decision=${row.status}`
                ) as string
              )
            }
          />
        </section>
      )}
    </div>
  );
};

const EmptyState = ({
  noun,
  onClear,
  waiting,
}: {
  noun: string;
  onClear: () => void;
  waiting: boolean;
}) => (
  <div className="py-6">
    <p className="text-sm font-medium text-gray-900">
      {waiting ? "Nothing waiting for review" : `No ${noun} match this view`}
    </p>
    <p className="mt-1 text-sm text-gray-600">
      {waiting
        ? "Clear the filter to see everything in the queue."
        : "Clear the search or choose another status."}
    </p>
    <Button
      className="mt-3"
      color="secondary"
      onClick={onClear}
      size="sm"
      variant="outline"
    >
      Clear filters
    </Button>
  </div>
);

export { ReviewQueue };

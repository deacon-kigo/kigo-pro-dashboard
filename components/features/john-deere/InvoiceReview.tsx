"use client";

import type { CSSProperties, KeyboardEvent } from "react";

import { useEffect, useMemo, useState } from "react";

import { Provider as TooltipProvider } from "@radix-ui/react-tooltip";
import { ListChecks } from "lucide-react";

import { Badge } from "@/components/prod/badge";
import { Button } from "@/components/prod/button";
import { Card } from "@/components/prod/card";
import { Tooltip } from "@/components/prod/tooltip";
import { cn } from "@/components/prod/utils/cn";
import { toProHref } from "@/components/prod/_runtime/link";
import { useRouter } from "@/components/prod/_runtime/navigation";
import { toast } from "@/components/prod/hooks/use-toast";

import { ActivityRail } from "./ActivityRail";
import { ChecklistRow, ROW_INPUT, type RowStatus } from "./ChecklistRow";
import { Crumb } from "./Crumb";
import { FactList } from "./FactList";
import {
  ApproveInvoiceDialog,
  RejectInvoiceDialog,
} from "./InvoiceDecisionDialogs";
import { LineItemsEditor, type Line } from "./LineItemsEditor";
import { ResultBanner } from "./ResultBanner";
import { ReviewHeader } from "./ReviewHeader";
import { ScanViewer } from "./ScanViewer";
import { Section } from "./Section";
import {
  INVOICES,
  INVOICE_REASONS,
  invoiceActivity,
  invoiceDecision,
  invoiceFields,
  money,
  plural,
  reviewFacts,
  waitingLabel,
  type Fact,
  type InvoiceDecision,
  type InvoiceField,
} from "./data";
import { readDecisions, saveInvoice } from "./decisions";
import { TONE, type Tone } from "./tone";
import { useChecklist } from "./useChecklist";

const CANONICAL = INVOICES[0];

const QUEUE_HREF = toProHref("/john-deere") as string;

const CHIP: Record<InvoiceDecision, { label: string; tone: Tone }> = {
  approved: { label: "Manually approved", tone: "success" },
  auto_approved: { label: "Auto-approved", tone: "success" },
  auto_rejected: { label: "Auto-rejected", tone: "destructive" },
  pending: { label: "Pending review", tone: "warning" },
  rejected: { label: "Manually rejected", tone: "destructive" },
};

const BANNER: Record<
  InvoiceDecision,
  { title: string; detail: string; tone: Tone }
> = {
  approved: {
    detail: "All six fields were verified against the scan before approval.",
    title: "Manually approved and sent for reimbursement",
    tone: "success",
  },
  auto_approved: {
    detail: "Approved at scan time. No manual review was needed.",
    title: "Auto-approved and sent for reimbursement",
    tone: "success",
  },
  auto_rejected: {
    detail: "Rejected at scan time. No manual review was needed.",
    title: "Auto-rejected and returned to the dealer",
    tone: "destructive",
  },
  pending: { detail: "", title: "", tone: "warning" },
  rejected: {
    detail: "The invoice was rejected before field validation finished.",
    title: "Manually rejected and returned to the dealer",
    tone: "destructive",
  },
};

const CITY_LINE = /^(.*),\s*([A-Z]{2})\s+(\d{5}(?:-\d{4})?)$/;

const parseDealer = (text: string) => {
  const lines = text.split("\n").filter((line) => line.trim());
  const phone = lines.find((line) => /^\(\d{3}\)/.test(line)) ?? "";
  const cityLine = lines.find((line) => CITY_LINE.test(line)) ?? "";
  const [, city = "", state = "", zip = ""] = CITY_LINE.exec(cityLine) ?? [];
  const street = lines.filter((line) => line !== phone && line !== cityLine);
  return {
    city,
    line1: street[0] ?? "",
    line2: street[1] ?? "",
    phone,
    state,
    zip,
  };
};

const DEALER_PARTS = [
  "line1",
  "line2",
  "city",
  "state",
  "zip",
  "phone",
] as const;
const DEALER_LABELS: Record<(typeof DEALER_PARTS)[number], string> = {
  city: "City",
  line1: "Street address",
  line2: "Suite or unit",
  phone: "Phone",
  state: "State",
  zip: "ZIP",
};

const itemsSummary = (lines: Line[]) =>
  `${plural(lines.length, "item")} · ${money(lines)} eligible`;

const scanNote = (field: InvoiceField) =>
  field.dealerEdited && field.scanned
    ? `Scan read ${field.scanned} · dealer entered ${field.value}`
    : undefined;

const InvoiceReview = ({
  decision,
  invoiceId,
}: {
  decision: InvoiceDecision;
  invoiceId: string;
}) => {
  const record = INVOICES.find((row) => row.invoice === invoiceId) ?? {
    ...CANONICAL,
    invoice: invoiceId,
  };
  const router = useRouter();
  const [outcome, setOutcome] = useState(decision);
  const pending = outcome === "pending";
  const [eventsOpen, setEventsOpen] = useState(!pending);
  const [stuck, setStuck] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [note, setNote] = useState("");
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [lines, setLines] = useState<Line[]>(() =>
    record.extracted.lines.map((line) => ({ ...line }))
  );
  const [linesSnapshot, setLinesSnapshot] = useState<Line[]>(lines);
  const [dealer, setDealer] = useState(() =>
    parseDealer(record.extracted.dealer)
  );

  /* A decision taken earlier in the session wins over the URL's ?decision=.
     Read after mount so the server and client render the same first pass. */
  useEffect(() => {
    const stored = readDecisions().invoices[record.invoice];
    if (stored) setOutcome(invoiceDecision(stored));
  }, [record.invoice]);

  const dealerText = [
    dealer.line1,
    dealer.line2,
    `${dealer.city}, ${dealer.state} ${dealer.zip}`,
    dealer.phone,
  ]
    .filter((part) => part.trim())
    .join("\n");

  const fieldList = useMemo(
    () => invoiceFields(record.extracted),
    [record.extracted]
  );
  const seeds = useMemo(
    () => [
      ...fieldList.map((field) => ({ key: field.key, value: field.value })),
      { key: "items", value: itemsSummary(record.extracted.lines) },
    ],
    [fieldList, record.extracted]
  );
  const checklist = useChecklist(seeds);
  const { allDone, done, fields, total } = checklist;
  const activity = useMemo(
    () => invoiceActivity(outcome, record),
    [outcome, record]
  );

  const recordedFacts: Fact[] = [
    ...fieldList.map((field) => ({
      label: field.label,
      mono: field.mono,
      note: scanNote(field),
      value: fields[field.key]?.value ?? field.value,
    })),
    { label: "Line items", value: itemsSummary(lines) },
  ];

  const rowStatus = (key: string): RowStatus => {
    const state = fields[key];
    if (!state) return "missing";
    if (state.status === "editing") return "editing";
    if (state.status === "confirmed") return "verified";
    return state.value.trim() ? "unverified" : "missing";
  };

  const startEdit = (key: string, value: string) => {
    setDrafts((state) => ({ ...state, [key]: value }));
    checklist.edit(key);
  };

  const saveField = (key: string) =>
    checklist.save(key, key === "dealer" ? dealerText : (drafts[key] ?? ""));

  const fieldKeys = (key: string) => ({
    onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        saveField(key);
      }
      if (event.key === "Escape") {
        event.preventDefault();
        checklist.cancel(key);
      }
    },
  });

  const approveRows: InvoiceField[] = [
    ...fieldList,
    {
      hint: "",
      key: "items",
      label: "Line items",
      value: itemsSummary(lines),
    },
  ];
  const allRows = approveRows.map((field) => ({
    key: field.key,
    label: field.label,
  }));
  const guardedKeys = fieldList
    .filter((field) => field.dealerEdited && field.scanned)
    .map((field) => field.key);
  const eligible = allRows.filter(
    (row) =>
      rowStatus(row.key) === "unverified" && !guardedKeys.includes(row.key)
  );
  const remaining = allRows.filter((row) => rowStatus(row.key) !== "verified");
  const onlyLeft = remaining.length === 1 ? remaining[0] : undefined;

  const progress = allDone
    ? "Ready to approve"
    : onlyLeft
      ? `1 field left: ${onlyLeft.label}`
      : `${done} of ${total} confirmed`;

  const decisionActions = (size: "default" | "sm") => (
    <>
      <Button
        color="destructive"
        onClick={() => setRejectOpen(true)}
        size={size}
        variant="outline"
      >
        Reject invoice
      </Button>
      {allDone ? (
        <Button onClick={() => setApproveOpen(true)} size={size}>
          Approve invoice
        </Button>
      ) : (
        <Tooltip
          content={`Confirm all ${total} fields against the scan before approving`}
        >
          <span>
            <Button disabled size={size}>
              Approve invoice
            </Button>
          </span>
        </Tooltip>
      )}
    </>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <Crumb label={record.invoice} segment={invoiceId} />
      <ReviewHeader
        actions={pending ? decisionActions("default") : undefined}
        backHref="/john-deere"
        backLabel="Back to invoices"
        compactActions={pending ? decisionActions("sm") : undefined}
        id={record.invoice}
        onStuckChange={setStuck}
        groups={reviewFacts(record, !pending)}
        progress={pending ? progress : undefined}
        status={{ label: CHIP[outcome].label, tone: CHIP[outcome].tone }}
        summary={
          pending ? (
            <span className="text-sm text-gray-600">
              {waitingLabel(record.date, record.time)}
            </span>
          ) : null
        }
      />

      <div
        className={cn(
          "grid gap-6 transition-[grid-template-columns] duration-200",
          eventsOpen
            ? "xl:grid-cols-[240px_minmax(0,1fr)_minmax(400px,460px)]"
            : "xl:grid-cols-[56px_minmax(0,1fr)_minmax(400px,460px)]"
        )}
        style={{ "--sticky-top": stuck ? "64px" : "0px" } as CSSProperties}
      >
        <ActivityRail
          events={activity}
          onOpenChange={setEventsOpen}
          open={eventsOpen}
        />

        <ScanViewer
          caption="invoice scan"
          className="h-[calc(100vh-21rem)] min-h-[440px] xl:sticky xl:top-[var(--sticky-top)] transition-[top] duration-200"
          document={record.document}
          thumbnails={false}
        />

        <div className="flex flex-col gap-6 self-start">
          <Card roundness="lg">
            {pending ? (
              <Section
                action={
                  eligible.length > 0 ? (
                    <Tooltip content="Skips fields the dealer edited and fields with no value.">
                      <Button
                        color="secondary"
                        onClick={() => checklist.confirmAll(guardedKeys)}
                        size="sm"
                        variant="outline"
                      >
                        Confirm {plural(eligible.length, "unchanged field")}
                      </Button>
                    </Tooltip>
                  ) : undefined
                }
                count={`${done} of ${total}`}
                icon={ListChecks}
                title="Checklist"
              >
                <div
                  aria-label="Fields confirmed"
                  aria-valuemax={total}
                  aria-valuemin={0}
                  aria-valuenow={done}
                  className="h-1 rounded-full bg-gray-100"
                  role="progressbar"
                >
                  <div
                    className="bg-primary h-1 rounded-full transition-[width] duration-200"
                    style={{ width: `${Math.round((done / total) * 100)}%` }}
                  />
                </div>
                <div className="divide-y divide-gray-100">
                  {fieldList.map((field) => {
                    const state = fields[field.key];
                    if (!state) return null;
                    return (
                      <ChecklistRow
                        badge={
                          field.dealerEdited ? (
                            <Badge
                              className="text-sm"
                              color="neutral"
                              roundness="md"
                              size="sm"
                              variant="outline"
                            >
                              Edited by dealer
                            </Badge>
                          ) : undefined
                        }
                        editor={
                          field.key === "dealer" ? (
                            <div className="flex flex-wrap gap-2">
                              {DEALER_PARTS.map((part, index) => (
                                <label
                                  className="flex min-w-[130px] flex-1 flex-col text-sm text-gray-500"
                                  key={part}
                                >
                                  {DEALER_LABELS[part]}
                                  <input
                                    autoFocus={index === 0}
                                    className={cn("mt-1", ROW_INPUT)}
                                    onChange={(event) =>
                                      setDealer((current) => ({
                                        ...current,
                                        [part]: event.target.value,
                                      }))
                                    }
                                    value={dealer[part]}
                                    {...fieldKeys(field.key)}
                                  />
                                </label>
                              ))}
                            </div>
                          ) : (
                            <input
                              autoFocus
                              className={cn("w-full", ROW_INPUT)}
                              onChange={(event) =>
                                setDrafts((current) => ({
                                  ...current,
                                  [field.key]: event.target.value,
                                }))
                              }
                              value={drafts[field.key] ?? state.value}
                              {...fieldKeys(field.key)}
                            />
                          )
                        }
                        display={scanNote(field)}
                        hint={field.hint}
                        key={field.key}
                        label={field.label}
                        mono={field.mono}
                        note={scanNote(field)}
                        onCancel={() => checklist.cancel(field.key)}
                        onConfirm={() => checklist.confirm(field.key)}
                        onEdit={() => startEdit(field.key, state.value)}
                        onSave={() => saveField(field.key)}
                        preLine={field.key === "dealer"}
                        status={rowStatus(field.key)}
                        value={state.value}
                      />
                    );
                  })}

                  <ChecklistRow
                    editor={
                      <LineItemsEditor lines={lines} onChange={setLines} />
                    }
                    label="Line items"
                    onCancel={() => {
                      setLines(linesSnapshot);
                      checklist.cancel("items");
                    }}
                    onConfirm={() => checklist.confirm("items")}
                    onEdit={() => {
                      setLinesSnapshot(lines.map((line) => ({ ...line })));
                      checklist.edit("items");
                    }}
                    onSave={() => checklist.save("items", itemsSummary(lines))}
                    status={rowStatus("items")}
                    value={itemsSummary(lines)}
                  />
                </div>
              </Section>
            ) : (
              <Section
                icon={ListChecks}
                title={
                  outcome === "approved"
                    ? "Validated fields"
                    : "Extracted fields"
                }
              >
                <ResultBanner
                  className="mb-4"
                  detail={BANNER[outcome].detail}
                  title={BANNER[outcome].title}
                  tone={BANNER[outcome].tone}
                />
                <FactList facts={recordedFacts} />
                {(outcome === "rejected" || outcome === "auto_rejected") && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-500">
                      Reason for rejection (external)
                    </p>
                    <p className="mt-1 text-base text-gray-900">
                      {outcome === "rejected"
                        ? reason === "Other"
                          ? custom.trim()
                          : (reason ??
                            "Items do not qualify for this promotion")
                        : "Duplicate of a previously submitted invoice"}
                    </p>
                  </div>
                )}
                {(outcome === "approved" || outcome === "rejected") && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-500">
                      Reviewer note (internal)
                    </p>
                    <p className="mt-1 text-base text-gray-700">
                      {note.trim() ||
                        (outcome === "approved"
                          ? "The dealer's edited discount of $1,240.00 reconciles with the eligible line items. Confirmed the promo code with the dealership by phone."
                          : "Two of the four line items are attachments, not fluids or filters. Eligible spend falls below the promotion minimum.")}
                    </p>
                  </div>
                )}
              </Section>
            )}
          </Card>
        </div>
      </div>

      <RejectInvoiceDialog
        custom={custom}
        note={note}
        onConfirm={() => {
          saveInvoice(record.invoice, "man_rejected");
          setOutcome("rejected");
          setEventsOpen(true);
          setRejectOpen(false);
          toast({
            description: reason === "Other" ? custom.trim() : (reason ?? ""),
            title: `${record.invoice} rejected`,
            variant: "destructive",
          });
          router.push(QUEUE_HREF);
        }}
        onCustomChange={setCustom}
        onNoteChange={setNote}
        onOpenChange={(next) => {
          setRejectOpen(next);
          if (!next) {
            setReason(null);
            setCustom("");
            setNote("");
          }
        }}
        onReasonChange={setReason}
        open={rejectOpen}
        reason={reason}
      />

      <ApproveInvoiceDialog
        fields={fields}
        rows={approveRows}
        onConfirm={() => {
          saveInvoice(record.invoice, "man_approved");
          setOutcome("approved");
          setEventsOpen(true);
          setApproveOpen(false);
          toast({
            description:
              "Sent for reimbursement. The dealer has been notified.",
            title: `${record.invoice} approved`,
            variant: "success",
          });
          router.push(QUEUE_HREF);
        }}
        note={note}
        onNoteChange={setNote}
        onOpenChange={(next) => {
          setApproveOpen(next);
          if (!next) setNote("");
        }}
        open={approveOpen}
        total={total}
      />
    </TooltipProvider>
  );
};

export { InvoiceReview };

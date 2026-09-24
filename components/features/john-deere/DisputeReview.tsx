"use client";

import { useEffect, useMemo, useState } from "react";

import { ArrowLeftRight, History, Receipt } from "lucide-react";

import { Button } from "@/components/prod/button";
import { Card } from "@/components/prod/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/prod/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/prod/dialog";
import { cn } from "@/components/prod/utils/cn";
import { toProHref } from "@/components/prod/_runtime/link";
import { useRouter } from "@/components/prod/_runtime/navigation";
import { toast } from "@/components/prod/hooks/use-toast";

import { Crumb } from "./Crumb";
import { FactList } from "./FactList";
import { ResultBanner } from "./ResultBanner";
import { ReviewHeader } from "./ReviewHeader";
import { ScanViewer } from "./ScanViewer";
import { Section } from "./Section";
import { Timeline } from "./Timeline";
import {
  DISPUTES,
  DISPUTE_REASONS,
  activitySummary,
  disputeActivity,
  formatSubmitted,
  plural,
  waitingLabel,
  type DisputeStatus,
  type Fact,
} from "./data";
import { readDecisions, saveDispute } from "./decisions";
import { TONE, type Tone } from "./tone";

const CANONICAL = DISPUTES[0];

const QUEUE_HREF = toProHref("/john-deere?tab=disputes") as string;

const CHIP: Record<DisputeStatus, { label: string; tone: Tone }> = {
  approved: { label: "Approved", tone: "success" },
  pending: { label: "Pending review", tone: "warning" },
  rejected: { label: "Rejected", tone: "destructive" },
};

const BANNER: Record<
  DisputeStatus,
  { title: string; detail: string; tone: Tone }
> = {
  approved: {
    detail:
      "Invoice number and discount amount were replaced with the requested values.",
    title: "Dispute approved and the PDAP entry updated",
    tone: "success",
  },
  pending: { detail: "", title: "", tone: "warning" },
  rejected: {
    detail: "The requested values were not applied.",
    title: "Dispute rejected and the PDAP entry left unchanged",
    tone: "destructive",
  },
};

const DisputeReview = ({
  decision,
  invoiceId,
}: {
  decision: DisputeStatus;
  invoiceId: string;
}) => {
  const record = DISPUTES.find((row) => row.invoice === invoiceId) ?? {
    ...CANONICAL,
    invoice: invoiceId,
  };
  const router = useRouter();
  const [outcome, setOutcome] = useState(decision);
  const pending = outcome === "pending";
  const approved = outcome === "approved";
  const [eventsOpen, setEventsOpen] = useState(!pending);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [note, setNote] = useState("");

  /* A decision taken earlier in the session wins over the URL's ?decision=.
     Read after mount so the server and client render the same first pass. */
  useEffect(() => {
    const stored = readDecisions().disputes[record.invoice];
    if (stored) setOutcome(stored);
  }, [record.invoice]);

  const closeReject = (next: boolean) => {
    setRejectOpen(next);
    if (!next) {
      setReason(null);
      setCustom("");
      setNote("");
    }
  };

  const activity = useMemo(
    () => disputeActivity(outcome, record),
    [outcome, record]
  );
  const summary = activitySummary(record);

  const claimFacts: Fact[] = [
    { label: "Promotion", value: record.promotion },
    { label: "Promo code", mono: true, value: "ABC123" },
    {
      label: "Submitted",
      value: `${formatSubmitted(record.date)} · ${record.time}`,
    },
    { label: "Submitter", value: `${record.submitter} · ${record.email}` },
    { label: "Dealership", value: `${record.dealership} · ${record.city}` },
  ];

  const decisionActions = (size: "default" | "sm") => (
    <>
      <Button
        color="destructive"
        onClick={() => setRejectOpen(true)}
        size={size}
        variant="outline"
      >
        Reject dispute
      </Button>
      <Button onClick={() => setApproveOpen(true)} size={size}>
        Approve dispute
      </Button>
    </>
  );

  return (
    <>
      <Crumb label={record.invoice} segment={invoiceId} />
      <ReviewHeader
        actions={pending ? decisionActions("default") : undefined}
        backHref="/john-deere?tab=disputes"
        backLabel="Back to disputes"
        compactActions={pending ? decisionActions("sm") : undefined}
        id={record.invoice}
        meta={[
          `${record.dealership} · ${record.city}`,
          waitingLabel(record.date, record.time),
        ]}
        status={{ label: CHIP[outcome].label, tone: CHIP[outcome].tone }}
        summary={
          <span className="text-gray-700">
            Dispute · {record.promotion} ·{" "}
            {plural(record.changes.length, "requested change")}
          </span>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[240px_minmax(0,1fr)_minmax(380px,420px)]">
        <Card className="self-start" roundness="lg">
          <Section icon={History} title="Activity">
            {pending && (
              <p className="flex items-start gap-2 text-base text-gray-900">
                <span
                  aria-hidden
                  className={cn(
                    "mt-2 size-1.5 shrink-0 rounded-full",
                    TONE[summary.tone].dot
                  )}
                />
                <span className="min-w-0">{summary.text}</span>
              </p>
            )}
            <Collapsible onOpenChange={setEventsOpen} open={eventsOpen}>
              <CollapsibleTrigger asChild>
                <Button
                  className="px-0"
                  color="secondary"
                  size="sm"
                  variant="link"
                >
                  {eventsOpen
                    ? "Hide events"
                    : `Show ${plural(activity.length, "event")}`}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Timeline compact events={activity} />
              </CollapsibleContent>
            </Collapsible>
          </Section>
        </Card>

        <ScanViewer
          caption="invoice photo"
          className="h-[calc(100vh-21rem)] min-h-[440px] xl:sticky xl:top-[88px]"
          document={record.document}
          thumbnails={false}
        />

        <div className="flex flex-col gap-6 self-start">
          <Card roundness="lg">
            <Section icon={Receipt} title="Claim">
              <FactList facts={claimFacts} />
            </Section>
          </Card>

          <Card roundness="lg">
            <Section
              count={plural(record.changes.length, "change")}
              description="What the dealer entered in PDAP and what they ask to change it to."
              icon={ArrowLeftRight}
              title="Requested changes"
            >
              {!pending && (
                <ResultBanner
                  className="mb-4"
                  detail={BANNER[outcome].detail}
                  title={BANNER[outcome].title}
                  tone={BANNER[outcome].tone}
                />
              )}
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="flex gap-3 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500">
                  <div className="w-32">Field</div>
                  <div className="flex-1">Entered in PDAP</div>
                  <div className="flex-1">Dealer requests</div>
                </div>
                {record.changes.map((change) => (
                  <div
                    className="flex items-baseline gap-3 border-t border-gray-100 px-4 py-3 text-base"
                    key={change.field}
                  >
                    <div className="w-32 text-gray-500">{change.label}</div>
                    <div
                      className={cn(
                        "flex-1 text-gray-500 line-through",
                        change.mono && "font-mono"
                      )}
                    >
                      {change.from}
                    </div>
                    <div
                      className={cn(
                        "flex-1 font-semibold text-gray-900",
                        change.mono && "font-mono"
                      )}
                    >
                      {change.to}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Dealer&apos;s reason for dispute
                </p>
                <p className="mt-1.5 rounded-lg bg-gray-50 p-3 text-base leading-relaxed text-gray-800">
                  {record.explanation}
                </p>
              </div>
              {!pending && (
                <div className="mt-4 flex flex-col gap-4 border-t border-gray-200 pt-4">
                  {!approved && (
                    <div>
                      <p className="text-sm text-gray-500">
                        Reason for rejection (external)
                      </p>
                      <p className="mt-1 text-base text-gray-900">
                        {reason === "Other"
                          ? custom.trim()
                          : (reason ??
                            "Invoice does not match. The attached invoice does not support the requested change.")}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">
                      Reviewer note (internal)
                    </p>
                    <p className="mt-1 text-base text-gray-700">
                      {approved
                        ? "Invoice photo matches the requested number and the discount line totals $1,780.00."
                        : note.trim() ||
                          "The attached invoice is for a different transaction than the one being corrected. Asked the dealer to resubmit with the correct document."}
                    </p>
                  </div>
                </div>
              )}
            </Section>
          </Card>
        </div>
      </div>

      <Dialog onOpenChange={setApproveOpen} open={approveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve dispute</DialogTitle>
            <DialogDescription>
              The PDAP entry is updated with the requested values and the dealer
              is notified.
            </DialogDescription>
          </DialogHeader>
          <div className="overflow-hidden rounded-lg border border-gray-200 text-base">
            <div className="bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-500">
              Updated values
            </div>
            {record.changes.map((change) => (
              <div
                className="flex items-baseline justify-between border-t border-gray-100 px-4 py-2.5"
                key={change.field}
              >
                <span className="text-gray-500">{change.label}</span>
                <span
                  className={cn(
                    "flex items-baseline gap-2",
                    change.mono && "font-mono"
                  )}
                >
                  <span className="text-gray-400 line-through">
                    {change.from}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {change.to}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button color="secondary" onClick={() => setApproveOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                saveDispute(record.invoice, "approved");
                setOutcome("approved");
                setEventsOpen(true);
                setApproveOpen(false);
                toast({
                  description:
                    "PDAP entry updated. The dealer has been notified.",
                  title: `Dispute ${record.invoice} approved`,
                  variant: "success",
                });
                router.push(QUEUE_HREF);
              }}
            >
              Approve and update entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={closeReject} open={rejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject dispute</DialogTitle>
            <DialogDescription>
              The PDAP entry keeps its original values and the dealer is
              notified.
            </DialogDescription>
          </DialogHeader>
          <fieldset className="flex max-h-[260px] flex-col gap-2 overflow-y-auto">
            <legend className="mb-2 text-base font-medium text-gray-900">
              Reason (external, shown to dealer as reason for rejection)
            </legend>
            {DISPUTE_REASONS.map((item) => (
              <label
                className={cn(
                  "flex min-h-11 items-start gap-3 rounded-md border px-3.5 py-2.5 text-base",
                  "has-[:focus-visible]:border-primary",
                  reason === item.label
                    ? "border-primary bg-blue-50"
                    : "border-gray-200"
                )}
                key={item.label}
              >
                <input
                  checked={reason === item.label}
                  className="mt-1 size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  name="dispute-reject-reason"
                  onChange={() => setReason(item.label)}
                  type="radio"
                  value={item.label}
                />
                <span>
                  <span className="block font-medium text-gray-900">
                    {item.label}
                  </span>
                  {item.desc && (
                    <span className="mt-0.5 block text-sm text-gray-500">
                      {item.desc}
                    </span>
                  )}
                </span>
              </label>
            ))}
          </fieldset>
          {reason === "Other" && (
            <textarea
              className="w-full rounded-md border border-gray-300 p-3 text-base"
              onChange={(event) => setCustom(event.target.value)}
              placeholder="Describe why this dispute was rejected"
              rows={3}
              value={custom}
            />
          )}
          <label className="text-base">
            Reviewer note (internal, optional)
            <textarea
              className="mt-1 w-full rounded-md border border-gray-300 p-3 text-base"
              onChange={(event) => setNote(event.target.value)}
              placeholder="Add any additional detail about this decision for internal reference"
              rows={3}
              value={note}
            />
          </label>
          <DialogFooter>
            <Button color="secondary" onClick={() => closeReject(false)}>
              Cancel
            </Button>
            <Button
              color="destructive"
              disabled={!reason || (reason === "Other" && !custom.trim())}
              onClick={() => {
                saveDispute(record.invoice, "rejected");
                setOutcome("rejected");
                setEventsOpen(true);
                setRejectOpen(false);
                toast({
                  description:
                    reason === "Other" ? custom.trim() : (reason ?? ""),
                  title: `Dispute ${record.invoice} rejected`,
                  variant: "destructive",
                });
                router.push(QUEUE_HREF);
              }}
            >
              Reject dispute
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export { DisputeReview };

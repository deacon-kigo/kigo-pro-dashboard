import { Button } from "@/components/prod/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/prod/dialog";
import { cn } from "@/components/prod/utils/cn";

import { INVOICE_REASONS, type InvoiceField } from "./data";
import { TONE } from "./tone";
import { type FieldState } from "./useChecklist";

interface RejectInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: string | null;
  onReasonChange: (reason: string) => void;
  custom: string;
  onCustomChange: (custom: string) => void;
  note: string;
  onNoteChange: (note: string) => void;
  onConfirm: () => void;
}

const RejectInvoiceDialog = ({
  custom,
  note,
  onConfirm,
  onCustomChange,
  onNoteChange,
  onOpenChange,
  onReasonChange,
  open,
  reason,
}: RejectInvoiceDialogProps) => (
  <Dialog onOpenChange={onOpenChange} open={open}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Reject invoice</DialogTitle>
        <DialogDescription>
          The dealer is notified and can submit a dispute within 30 days.
        </DialogDescription>
      </DialogHeader>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-base font-medium text-gray-900">
          Reason (external, shown to dealer as reason for rejection)
        </legend>
        {INVOICE_REASONS.map((item) => (
          <label
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md border px-3.5 py-2.5 text-base",
              "has-[:focus-visible]:border-primary",
              reason === item ? "border-primary bg-blue-50" : "border-gray-200"
            )}
            key={item}
          >
            <input
              checked={reason === item}
              className="size-4 shrink-0 accent-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              name="invoice-reject-reason"
              onChange={() => onReasonChange(item)}
              type="radio"
              value={item}
            />
            {item}
          </label>
        ))}
      </fieldset>
      {reason === "Other" && (
        <textarea
          className="w-full rounded-md border border-gray-300 p-3 text-base"
          onChange={(event) => onCustomChange(event.target.value)}
          placeholder="Describe why this invoice was rejected"
          rows={3}
          value={custom}
        />
      )}
      <label className="text-base">
        Reviewer note (internal, optional)
        <textarea
          className="mt-1 w-full rounded-md border border-gray-300 p-3 text-base"
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Add any additional detail about this decision for internal reference"
          rows={3}
          value={note}
        />
      </label>
      <DialogFooter>
        <Button color="secondary" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          color="destructive"
          disabled={!reason || (reason === "Other" && !custom.trim())}
          onClick={onConfirm}
        >
          Reject invoice
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

interface ApproveInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fields: Record<string, FieldState>;
  rows: InvoiceField[];
  total: number;
  note: string;
  onNoteChange: (note: string) => void;
  onConfirm: () => void;
}

const ApproveInvoiceDialog = ({
  fields,
  note,
  onConfirm,
  onNoteChange,
  onOpenChange,
  open,
  rows,
  total,
}: ApproveInvoiceDialogProps) => (
  <Dialog onOpenChange={onOpenChange} open={open}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Approve invoice</DialogTitle>
        <DialogDescription>
          Confirm the validated values below. The dealer is notified and the
          claim is sent for reimbursement.
        </DialogDescription>
      </DialogHeader>
      <div className="overflow-hidden rounded-lg border border-gray-200 text-base">
        <div className="flex bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-500">
          Validated fields
          <span className={cn("ml-auto", TONE.success.text)}>
            All {total} verified
          </span>
        </div>
        {rows.map((field) => (
          <div
            className="flex justify-between gap-3 border-t border-gray-100 px-4 py-2.5"
            key={field.key}
          >
            <span className="text-gray-500">{field.label}</span>
            <span
              className={cn(
                "text-right whitespace-pre-line text-gray-900",
                field.mono && "font-mono"
              )}
            >
              {fields[field.key]?.value || "—"}
            </span>
          </div>
        ))}
        <div
          className={cn(
            "flex justify-between px-4 py-3 font-medium",
            TONE.success.bg,
            TONE.success.text
          )}
        >
          Discount amount to reimburse
          <span className="font-mono font-semibold">
            {fields.discount?.value || "—"}
          </span>
        </div>
      </div>
      <label className="text-base">
        Reviewer note (internal, optional)
        <textarea
          className="mt-1 w-full rounded-md border border-gray-300 p-3 text-base"
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="Add any additional detail about this decision for internal reference"
          rows={3}
          value={note}
        />
      </label>
      <DialogFooter>
        <Button color="secondary" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Approve and send for reimbursement</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export {
  ApproveInvoiceDialog,
  RejectInvoiceDialog,
  type ApproveInvoiceDialogProps,
  type RejectInvoiceDialogProps,
};

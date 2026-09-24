import type { ReactNode } from "react";

import { Check, CircleCheck, Pencil, TriangleAlert, X } from "lucide-react";

import { Button } from "@/components/prod/button";
import { cn } from "@/components/prod/utils/cn";

import { TONE } from "./tone";

type RowStatus = "missing" | "unverified" | "editing" | "verified";

interface ChecklistRowProps {
  label: string;
  value: string;
  status: RowStatus;
  mono?: boolean;
  preLine?: boolean;
  badge?: ReactNode;
  hint?: string;
  note?: ReactNode;
  display?: ReactNode;
  editor: ReactNode;
  onConfirm: () => void;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

const ICON_BUTTON = "w-9 px-0";

const ChecklistRow = ({
  badge,
  display,
  editor,
  hint,
  label,
  mono,
  note,
  onCancel,
  onConfirm,
  onEdit,
  onSave,
  preLine,
  status,
  value,
}: ChecklistRowProps) => {
  const editing = status === "editing";
  const verified = status === "verified";

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 py-3">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          {label}
          {badge}
        </div>
        {editing ? (
          <div className="mt-1.5">
            {editor}
            {note && (
              <div className={cn("mt-1.5 text-sm", TONE.warning.text)}>
                {note}
              </div>
            )}
            {hint && <p className="mt-1.5 text-sm text-gray-500">{hint}</p>}
          </div>
        ) : (
          <>
            <div
              className={cn(
                "mt-0.5 flex items-start gap-1.5 text-base font-medium",
                verified ? "text-gray-700" : "text-gray-900"
              )}
            >
              {verified && (
                <>
                  <CircleCheck
                    aria-hidden
                    className={cn("mt-1 size-4 shrink-0", TONE.success.text)}
                  />
                  <span className="sr-only">Verified</span>
                </>
              )}
              <span
                className={cn(
                  "min-w-0 break-words",
                  mono && status !== "missing" && "font-mono",
                  preLine && "whitespace-pre-line",
                  status === "missing" && "font-normal text-gray-500"
                )}
              >
                {status === "missing" ? "Not provided" : value}
              </span>
            </div>
            {display && (status === "unverified" || verified) && (
              <div
                className={cn(
                  "mt-1 flex items-start gap-1.5 text-sm",
                  TONE.warning.text
                )}
              >
                <TriangleAlert
                  aria-hidden
                  className="mt-0.5 size-3.5 shrink-0"
                />
                <span className="min-w-0 break-words">{display}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex items-center gap-1 self-start pt-4">
        {status === "unverified" && (
          <>
            <Button
              color="secondary"
              onClick={onConfirm}
              size="sm"
              variant="outline"
            >
              Confirm
            </Button>
            <Button
              aria-label={`Edit ${label}`}
              className={ICON_BUTTON}
              color="secondary"
              onClick={onEdit}
              size="sm"
              variant="ghost"
            >
              <Pencil />
            </Button>
          </>
        )}
        {verified && (
          <Button
            aria-label={`Edit ${label}`}
            className={ICON_BUTTON}
            color="secondary"
            onClick={onEdit}
            size="sm"
            variant="ghost"
          >
            <Pencil />
          </Button>
        )}
        {status === "missing" && (
          <Button onClick={onEdit} size="sm">
            Add
          </Button>
        )}
        {editing && (
          <>
            <Button
              aria-label="Cancel"
              className={ICON_BUTTON}
              color="secondary"
              onClick={onCancel}
              size="sm"
              variant="ghost"
            >
              <X />
            </Button>
            <Button
              aria-label={`Save ${label}`}
              className={ICON_BUTTON}
              onClick={onSave}
              size="sm"
            >
              <Check />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

const ROW_INPUT =
  "h-8 rounded-md border border-gray-300 px-2 text-base text-gray-900";

export { ChecklistRow, ROW_INPUT, type ChecklistRowProps, type RowStatus };

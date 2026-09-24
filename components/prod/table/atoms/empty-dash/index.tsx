import { cn } from "@/components/prod/utils/cn";

interface EmptyDashProps {
  className?: string;
  /** Accessible label announced by screen readers in place of the em-dash. */
  label?: string;
}

/**
 * Em-dash placeholder for empty table cells. The visible "—" is hidden from
 * assistive tech (`aria-hidden`) and paired with a visually-hidden label so
 * screen readers announce a meaningful "no data" message instead of the
 * ambiguous glyph.
 */
const EmptyDash = ({ className, label = "No data" }: EmptyDashProps) => (
  <>
    <span aria-hidden="true" className={cn("text-muted-foreground", className)}>
      —
    </span>
    <span className="sr-only">{label}</span>
  </>
);

EmptyDash.displayName = "EmptyDash";

export { EmptyDash };

import { InvoiceReview } from "@/components/features/john-deere/InvoiceReview";
import type { InvoiceDecision } from "@/components/features/john-deere/data";

const DECISIONS: InvoiceDecision[] = [
  "pending",
  "approved",
  "rejected",
  "auto_approved",
  "auto_rejected",
];

export default async function InvoicePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    decision?: string;
    dialog?: string;
    verify?: string;
  }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const decision =
    DECISIONS.find((item) => item === query.decision) ?? "pending";
  const dialog =
    query.dialog === "approve" || query.dialog === "reject"
      ? query.dialog
      : undefined;
  return (
    <InvoiceReview
      decision={decision}
      dialog={dialog}
      invoiceId={decodeURIComponent(id)}
      verify={query.verify === "all"}
    />
  );
}

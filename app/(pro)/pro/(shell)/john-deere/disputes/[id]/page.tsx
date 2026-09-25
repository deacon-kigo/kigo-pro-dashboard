import { DisputeReview } from "@/components/features/john-deere/DisputeReview";
import type { DisputeStatus } from "@/components/features/john-deere/data";

const DECISIONS: DisputeStatus[] = ["pending", "approved", "rejected"];

export default async function DisputePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ decision?: string; dialog?: string }>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const decision =
    DECISIONS.find((item) => item === query.decision) ?? "pending";
  const dialog =
    query.dialog === "approve" || query.dialog === "reject"
      ? query.dialog
      : undefined;
  return (
    <DisputeReview
      decision={decision}
      dialog={dialog}
      invoiceId={decodeURIComponent(id)}
    />
  );
}

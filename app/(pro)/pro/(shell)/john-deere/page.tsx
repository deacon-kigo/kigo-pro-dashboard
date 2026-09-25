import { ReviewQueue } from "@/components/features/john-deere/ReviewQueue";

export default async function JohnDeerePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; tab?: string }>;
}) {
  const params = await searchParams;
  return (
    <ReviewQueue
      initialStatus={params.status === "all" ? "all" : "pending"}
      initialTab={params.tab === "disputes" ? "disputes" : "invoices"}
    />
  );
}

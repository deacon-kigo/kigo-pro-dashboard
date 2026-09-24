import { ReviewQueue } from "@/components/features/john-deere/ReviewQueue";

export default async function JohnDeerePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  return (
    <ReviewQueue
      initialTab={params.tab === "disputes" ? "disputes" : "invoices"}
    />
  );
}

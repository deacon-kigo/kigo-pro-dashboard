import { redirect } from "next/navigation";

export default async function EditMerchantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/merchants/${encodeURIComponent(id)}?tab=edit`);
}

"use client";

import OfferCreationView from "@/components/features/dashboard/views/OfferCreationView";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/templates/AppLayout/AppLayout";

export default function OfferCreationPage() {
  const router = useRouter();

  return (
    <AppLayout>
      <OfferCreationView
        onCancel={() => router.push("/dashboard")}
        onSave={(data) => {
          console.log("Offer saved:", data);
          router.push("/dashboard");
        }}
      />
    </AppLayout>
  );
}

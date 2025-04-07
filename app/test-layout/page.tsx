"use client";

import React from "react";
import AppLayout from "@/components/templates/AppLayout/AppLayout";

export default function TestLayoutPage() {
  return (
    <AppLayout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">AppLayout Test Page</h1>
        <p className="mb-4">
          This page is using the AppLayout component directly to verify
          it&apos;s working correctly.
        </p>
        <p>
          If you see this content with the standard header and sidebar, the
          AppLayout component is functioning as expected.
        </p>
      </div>
    </AppLayout>
  );
}

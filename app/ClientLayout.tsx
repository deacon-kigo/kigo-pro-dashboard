"use client";

/**
 * @deprecated This component is kept for backward compatibility but is no longer the preferred way to use the layout.
 * Import and use AppLayout directly from '@/components/templates/AppLayout/AppLayout' instead.
 *
 * This component will be removed in a future update once all references have been updated.
 */

import { ReactNode } from "react";
import AppLayout from "@/components/templates/AppLayout/AppLayout";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}

import type { ReactNode } from "react";

import { Breadcrumbs } from "@/components/prod/breadcrumbs";
import { BreadcrumbProvider } from "@/components/prod/breadcrumbs/breadcrumb-context";
import { Header } from "@/components/prod/header";
import { Sidebar } from "@/components/prod/sidebar";
import { parseCollapsedGroups } from "@/components/prod/sidebar/utils/collapsed-groups";
import { Toaster } from "@/components/prod/toast/atoms/toaster";

import { inter } from "../../fonts";

/*
 * Copy of SOURCE src/app/(protected)/layout.tsx and src/app/layout.tsx wrapper
 * markup, minus the session lookup and InactivityTracker. There is no session in
 * the prototype, so the admin role and a placeholder name are fixed, and the
 * sidebar starts in production's first-visit state (no cookies). The Toaster is
 * production's own, mounted here the way src/app/providers/wrapper.tsx mounts it.
 */
export default function ProShellLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div
      className={`${inter.className} text-foreground h-screen min-h-screen overflow-hidden`}
    >
      <div className="bg-bg-light flex h-screen">
        <Sidebar
          initiallyCollapsedGroups={parseCollapsedGroups(undefined)}
          isInitiallyCollapsed={false}
          userName="Admin User"
          userRole="admin"
        />
        <Header userRole="admin" />
        <main className="mx-auto mt-[72px] max-h-full w-full max-w-[1600px] overflow-scroll p-6 transition-all duration-300">
          <BreadcrumbProvider>
            <Breadcrumbs />
            {children}
          </BreadcrumbProvider>
        </main>
      </div>
      <Toaster />
    </div>
  );
}

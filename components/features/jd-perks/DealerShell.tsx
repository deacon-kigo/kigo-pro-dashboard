"use client";

import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";
import { useDemoActions } from "@/lib/redux/hooks";
import { getCampaignById } from "./mockData";

const CM_HOME = "/campaign-manager/john-deere";
const DASH_HOME = "/dashboard/john-deere";

/**
 * Wraps the John Deere dealer (Dealer Dan) routes. Sets the demo persona to the
 * John Deere context once on mount — which drives the dealer-specific sidebar nav
 * and branding — and renders the standard Kigo Pro app shell with breadcrumbs
 * that stay entirely inside the dealer experience (so the dealer never lands on
 * the default Kigo dashboard).
 */
export default function DealerShell({ children }: { children: ReactNode }) {
  const { setClientId, setRole } = useDemoActions();
  const initialized = useRef(false);
  const pathname = usePathname() || "";

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    setClientId("johndeere");
    setRole("dealer");
  }, [setClientId, setRole]);

  const breadcrumb = useMemo(() => {
    type Crumb = { label: string; href?: string };
    let crumbs: Crumb[] = [];

    if (pathname.startsWith("/dashboard/john-deere")) {
      crumbs = [{ label: "Dashboard" }];
    } else if (pathname.startsWith("/pdap/john-deere")) {
      crumbs = [{ label: "Perks Admin Portal" }];
    } else if (pathname.startsWith("/campaign-manager/john-deere/")) {
      const id = pathname.split("/").filter(Boolean).pop() || "";
      const campaign = getCampaignById(id);
      crumbs = [
        { label: "Campaign Manager", href: CM_HOME },
        { label: campaign?.name || "Campaign" },
      ];
    } else if (pathname.startsWith("/campaign-manager/john-deere")) {
      crumbs = [{ label: "Campaign Manager" }];
    }

    if (crumbs.length === 0) return undefined;

    return (
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={DASH_HOME}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          {crumbs.map((c, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <React.Fragment key={`${c.label}-${i}`}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast || !c.href ? (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={c.href}>{c.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }, [pathname]);

  return <AppLayout customBreadcrumb={breadcrumb}>{children}</AppLayout>;
}

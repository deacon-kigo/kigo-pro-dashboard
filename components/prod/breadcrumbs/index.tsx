"use client";

import type { ReactNode } from "react";
import { Fragment } from "react";

import { capitalCase } from "change-case";
import { usePathname } from "@/components/prod/_runtime/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbText,
} from "./atoms";
import { useBreadcrumbContext } from "./breadcrumb-context";
import { SEGMENT_ALIASES } from "./constants/segment-aliases";
import { isKnownWebRoute } from "./utils/is-known-web-route";

const Breadcrumbs = () => {
  const pathname = usePathname();
  const context = useBreadcrumbContext();

  if (pathname === "/")
    return (
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    );

  const pathSegments = pathname.split("/").filter(Boolean);

  if (pathSegments.length === 0) return null;

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const accumulatedHref = `/${pathSegments.slice(0, index + 1).join("/")}`;

          /*
           * Resolve label and href in precedence order:
           *   page-registered override → static wrapper alias → registry.
           * The href falls through to `undefined` when the accumulated path is
           * not a real page, so structural wrapper segments (e.g. `edit-offer`)
           * render as non-navigable text instead of a 404 link.
           */
          const contextOverride = context?.overrides[segment];
          const alias = SEGMENT_ALIASES[accumulatedHref];

          const label =
            contextOverride?.label ?? alias?.label ?? capitalCase(segment);
          const href =
            contextOverride?.href ??
            alias?.href ??
            (isKnownWebRoute(accumulatedHref) ? accumulatedHref : undefined);

          let content: ReactNode;

          if (isLast) {
            content = <BreadcrumbPage>{label}</BreadcrumbPage>;
          } else if (href) {
            content = <BreadcrumbLink href={href}>{label}</BreadcrumbLink>;
          } else {
            content = <BreadcrumbText>{label}</BreadcrumbText>;
          }

          return (
            <Fragment key={accumulatedHref}>
              <BreadcrumbItem>{content}</BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export { Breadcrumbs };

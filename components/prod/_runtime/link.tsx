"use client";

/*
 * Replaces `next/link` inside the ported production code so production hrefs
 * (`/support-manager`) land on the ported shell (`/pro/support-manager`).
 */
import type { LinkProps } from "next/link";
import type { ComponentProps } from "react";
import { forwardRef } from "react";
import NextLink from "next/link";

import { PRO_PREFIX } from "./navigation";

type NextLinkProps = ComponentProps<typeof NextLink>;

const toProHref = (href: NextLinkProps["href"]): NextLinkProps["href"] => {
  if (typeof href === "string") {
    if (
      !href.startsWith("/") ||
      href === PRO_PREFIX ||
      href.startsWith(`${PRO_PREFIX}/`)
    )
      return href;
    return href === "/" ? PRO_PREFIX : `${PRO_PREFIX}${href}`;
  }
  if (
    href.pathname &&
    href.pathname.startsWith("/") &&
    !href.pathname.startsWith(PRO_PREFIX)
  ) {
    return {
      ...href,
      pathname: `${PRO_PREFIX}${href.pathname === "/" ? "" : href.pathname}`,
    };
  }
  return href;
};

const Link = forwardRef<HTMLAnchorElement, NextLinkProps>(
  ({ href, ...props }, ref) => (
    <NextLink href={toProHref(href)} ref={ref} {...props} />
  )
);

Link.displayName = "ProLink";

export default Link;
export { toProHref };
export type { LinkProps };

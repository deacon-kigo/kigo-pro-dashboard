"use client";

/*
 * Replaces `next/navigation` inside the ported production code. Production
 * routes live at `/<basePath>`; the ported shell lives at `/pro/<basePath>`.
 * `usePathname` strips the `/pro` prefix so the copied code keeps comparing
 * against production paths, and the parity harness can pin the pathname and
 * search params a story declares through `ParityNavigationContext`.
 */
import { createContext, useContext, useMemo } from "react";
import {
  usePathname as useNextPathname,
  useRouter as useNextRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation";

export * from "next/navigation";

const PRO_PREFIX = "/pro";

interface ParityNavigation {
  pathname: string;
  searchParams?: URLSearchParams;
  /*
   * Present only inside a parity story. Search writes go here so a story that
   * declares `pathname: '/merchants'` cannot router.replace the real app.
   */
  onHref?: (href: string) => void;
}

const ParityNavigationContext = createContext<ParityNavigation | null>(null);

const stripProPrefix = (pathname: string) => {
  if (pathname === PRO_PREFIX) return "/";
  if (pathname.startsWith(`${PRO_PREFIX}/`))
    return pathname.slice(PRO_PREFIX.length);
  return pathname;
};

const usePathname = (): string => {
  const override = useContext(ParityNavigationContext);
  const pathname = useNextPathname();
  return override?.pathname ?? stripProPrefix(pathname);
};

const useSearchParams = () => {
  const override = useContext(ParityNavigationContext);
  const searchParams = useNextSearchParams();
  return override?.searchParams ?? searchParams;
};

const useRouter = () => {
  const nextRouter = useNextRouter();
  const onHref = useContext(ParityNavigationContext)?.onHref;
  return useMemo(() => {
    if (!onHref) return nextRouter;
    return {
      ...nextRouter,
      push: (href: string) => onHref(href),
      replace: (href: string) => onHref(href),
    };
  }, [nextRouter, onHref]);
};

export {
  PRO_PREFIX,
  ParityNavigationContext,
  stripProPrefix,
  usePathname,
  useRouter,
  useSearchParams,
};

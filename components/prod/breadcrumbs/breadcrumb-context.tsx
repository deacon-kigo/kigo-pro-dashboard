"use client";

import type { PropsWithChildren } from "react";
import { createContext, useCallback, useMemo, useState } from "react";
import { use } from "@/components/prod/_runtime/react-use";

interface BreadcrumbContextValue {
  overrides: Record<string, BreadcrumbOverrideDescriptor>;
  registerOverride: (
    segment: string,
    override: BreadcrumbOverrideDescriptor
  ) => void;
  unregisterOverride: (segment: string) => void;
}

interface BreadcrumbOverrideDescriptor {
  href?: string;
  label: string;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

/*
 * Page-registered overrides for breadcrumb segments. Detail pages mount
 * a <BreadcrumbOverride/> to swap the raw URL segment (typically a
 * UUID) for the entity's friendly name. The map is keyed by the
 * segment text so the breadcrumb component can apply overrides without
 * knowing which dynamic param each route uses.
 *
 * The register/unregister callbacks are reference-stable (useCallback
 * with empty deps + functional setState) so consumers that wire them
 * into a useEffect don't fall into a register/cleanup loop when the
 * provider re-renders. The `overrides` map IS included in the value so
 * the Breadcrumbs component re-renders to pick up registrations.
 */
const BreadcrumbProvider = ({ children }: PropsWithChildren) => {
  const [overrides, setOverrides] = useState<
    Record<string, BreadcrumbOverrideDescriptor>
  >({});

  const registerOverride = useCallback(
    (segment: string, override: BreadcrumbOverrideDescriptor) => {
      setOverrides((prev) => {
        const current = prev[segment];

        if (
          current?.label === override.label &&
          current.href === override.href
        ) {
          return prev;
        }

        return { ...prev, [segment]: override };
      });
    },
    []
  );

  const unregisterOverride = useCallback((segment: string) => {
    setOverrides((prev) => {
      if (!(segment in prev)) {
        return prev;
      }

      const { [segment]: _removed, ...rest } = prev;

      return rest;
    });
  }, []);

  const value = useMemo<BreadcrumbContextValue>(
    () => ({ overrides, registerOverride, unregisterOverride }),
    [overrides, registerOverride, unregisterOverride]
  );

  return (
    <BreadcrumbContext.Provider value={value}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

const useBreadcrumbContext = (): BreadcrumbContextValue | null =>
  use(BreadcrumbContext);

export { BreadcrumbProvider, useBreadcrumbContext };

"use client";

import { useEffect } from "react";

import { useBreadcrumbContext } from "@/components/prod/breadcrumbs/breadcrumb-context";

const Crumb = ({ segment, label }: { segment: string; label: string }) => {
  const context = useBreadcrumbContext();
  const register = context?.registerOverride;
  const unregister = context?.unregisterOverride;

  useEffect(() => {
    if (!register || !unregister) return;
    register(segment, { label });
    return () => unregister(segment);
  }, [register, unregister, segment, label]);

  return null;
};

export { Crumb };

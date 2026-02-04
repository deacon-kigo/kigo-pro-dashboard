"use client";

/**
 * PreviewOfferContext - Context provider for preview offer data
 *
 * Provides offer data to child components without needing API hooks.
 * This allows the ported SDK components to access offer data through
 * context instead of the original useOffer hook.
 */

import { createContext, useContext, ReactNode } from "react";

/**
 * Preview offer data structure - simplified version of SDK Offer type
 * containing only the fields needed for visual preview
 */
export interface PreviewOffer {
  // Basic info
  description: string;
  estimated_savings?: number;
  max_discount?: number;

  // Merchant info
  merchant_name?: string;
  merchant?: {
    name?: string;
    image?: { url?: string }; // Merchant Logo
    banner?: { url?: string }; // Merchant Banner
    stub_copy?: string;
  };

  // Offer Images (custom uploads override merchant images)
  banner?: { url?: string }; // Offer Banner
  image?: { url?: string }; // Offer Image

  // Redemption
  redemption_methods?: string[];
  conditions?: string;

  // Validity
  start_date?: string;
  end_date?: string;
}

interface PreviewOfferContextValue {
  offer: PreviewOffer;
}

const PreviewOfferContext = createContext<PreviewOfferContextValue | null>(
  null
);

export function PreviewOfferProvider({
  offer,
  children,
}: {
  offer: PreviewOffer;
  children: ReactNode;
}) {
  return (
    <PreviewOfferContext.Provider value={{ offer }}>
      {children}
    </PreviewOfferContext.Provider>
  );
}

/**
 * Hook to access preview offer data
 * Mirrors the SDK's useOffer hook interface
 */
export function usePreviewOffer(): PreviewOffer {
  const context = useContext(PreviewOfferContext);
  if (!context) {
    throw new Error(
      "usePreviewOffer must be used within a PreviewOfferProvider"
    );
  }
  return context.offer;
}

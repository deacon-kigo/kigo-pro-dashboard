import type { PartRow } from "./types";

/**
 * Eligible parts per campaign. In production this list is owned by John Deere
 * and the dealer can only view it. Part numbers here are representative sample
 * data for the prototype.
 */
export const ELIGIBLE_PARTS: Record<string, PartRow[]> = {
  "spring-parts-savings": [
    {
      partNumber: "GX20072",
      size: "48 in",
      product: "Mower Blade",
      description: "Mulching deck blade, 100 Series",
    },
    {
      partNumber: "GY20577",
      size: "—",
      product: "Deck Drive Belt",
      description: "V-belt for 42 in mower deck",
    },
    {
      partNumber: "AM125424",
      size: "—",
      product: "Air Filter",
      description: "Engine air filter element",
    },
    {
      partNumber: "AM116304",
      size: "—",
      product: "Spark Plug",
      description: "Standard ignition spark plug",
    },
    {
      partNumber: "AUC12872",
      size: "—",
      product: "Fuel Filter",
      description: "In-line fuel filter, gas engines",
    },
    {
      partNumber: "GY22075",
      size: "—",
      product: "Blade Bolt Kit",
      description: "Mounting hardware for deck blades",
    },
  ],
  "oil-fluids-refresh": [
    {
      partNumber: "TY26674",
      size: "1 gal",
      product: "Plus-50 II Engine Oil",
      description: "15W-40 premium diesel engine oil",
    },
    {
      partNumber: "TY26673",
      size: "2.5 gal",
      product: "Plus-50 II Engine Oil",
      description: "15W-40 premium diesel engine oil",
    },
    {
      partNumber: "AT63224",
      size: "—",
      product: "Engine Oil Filter",
      description: "Spin-on oil filter, 3E/4 Series",
    },
    {
      partNumber: "M806418",
      size: "—",
      product: "Oil Filter",
      description: "Compact utility tractor oil filter",
    },
    {
      partNumber: "AR45253",
      size: "—",
      product: "Hydraulic Filter",
      description: "Hydraulic / transmission filter",
    },
    {
      partNumber: "TY22035",
      size: "1 gal",
      product: "Hy-Gard Fluid",
      description: "Transmission & hydraulic fluid",
    },
  ],
  "mower-season-tuneup": [
    {
      partNumber: "AM131054",
      size: "—",
      product: "Tune-Up Kit",
      description: "Air filter, fuel filter, spark plug kit",
    },
    {
      partNumber: "GX20072",
      size: "48 in",
      product: "Mower Blade",
      description: "Mulching deck blade, 100 Series",
    },
    {
      partNumber: "AM116304",
      size: "—",
      product: "Spark Plug",
      description: "Standard ignition spark plug",
    },
    {
      partNumber: "AM125424",
      size: "—",
      product: "Air Filter",
      description: "Engine air filter element",
    },
    {
      partNumber: "AUC12872",
      size: "—",
      product: "Fuel Filter",
      description: "In-line fuel filter, gas engines",
    },
  ],
  "gator-accessories-bonus": [
    {
      partNumber: "BUC10522",
      size: "—",
      product: "Cargo Box Liner",
      description: "Molded liner for Gator cargo box",
    },
    {
      partNumber: "BM23184",
      size: "—",
      product: "Rearview Mirror Kit",
      description: "Side mirror set, Gator XUV",
    },
    {
      partNumber: "BM25372",
      size: "—",
      product: "LED Light Kit",
      description: "Front auxiliary LED work lights",
    },
    {
      partNumber: "LP67483",
      size: "Full",
      product: "Windshield",
      description: "Poly full windshield, XUV models",
    },
    {
      partNumber: "BM26092",
      size: "—",
      product: "Gun / Tool Rack",
      description: "Overhead utility rack",
    },
  ],
  "loyalty-member-appreciation": [
    {
      partNumber: "LVB25632",
      size: "—",
      product: "Front Loader Bucket",
      description: "54 in material bucket attachment",
    },
    {
      partNumber: "BW16066",
      size: "60 in",
      product: "Mid-Mount Mower Deck",
      description: "Drive-over mower deck",
    },
    {
      partNumber: "LP22884",
      size: "—",
      product: "Ballast Box",
      description: "3-point ballast box, Category 1",
    },
    {
      partNumber: "TY26674",
      size: "1 gal",
      product: "Plus-50 II Engine Oil",
      description: "15W-40 premium diesel engine oil",
    },
    {
      partNumber: "AT63224",
      size: "—",
      product: "Engine Oil Filter",
      description: "Spin-on oil filter, 3E/4 Series",
    },
  ],
  "new-customer-welcome": [
    {
      partNumber: "AM125424",
      size: "—",
      product: "Air Filter",
      description: "Engine air filter element",
    },
    {
      partNumber: "AT63224",
      size: "—",
      product: "Engine Oil Filter",
      description: "Spin-on oil filter, 3E/4 Series",
    },
    {
      partNumber: "GY20577",
      size: "—",
      product: "Deck Drive Belt",
      description: "V-belt for 42 in mower deck",
    },
    {
      partNumber: "GX20072",
      size: "48 in",
      product: "Mower Blade",
      description: "Mulching deck blade, 100 Series",
    },
    {
      partNumber: "TY26674",
      size: "1 gal",
      product: "Plus-50 II Engine Oil",
      description: "15W-40 premium diesel engine oil",
    },
  ],
};

export function getEligibleParts(campaignId: string): PartRow[] {
  return ELIGIBLE_PARTS[campaignId] || [];
}

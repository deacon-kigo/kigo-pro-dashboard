"use client";

import React, { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import PageHeader from "@/components/molecules/PageHeader/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { OffersTable } from "./components/OffersTable";

interface OfferManagerDashboardV1Props {
  onCreateOffer: () => void;
}

// Mock data for V1
const mockOffersV1 = [
  {
    id: "1",
    title: "20% Off Dinner Entrees",
    description: "Get 20% off any dinner entree when you dine in",
    programType: "john_deere" as const,
    programLabel: "John Deere",
    status: "active" as const,
    redemptionMethod: "Mobile",
    redemptionCount: 47,
    ctr: "15%",
    daysRemaining: 45,
    offerType: "Percentage Savings",
    campaignCount: 2,
  },
  {
    id: "2",
    title: "Buy One Get One Free Appetizer",
    description: "Purchase any appetizer and get a second one free",
    programType: "yardi" as const,
    programLabel: "Yardi",
    status: "active" as const,
    redemptionMethod: "Online Print",
    redemptionCount: 23,
    ctr: "23%",
    daysRemaining: 21,
    offerType: "BOGO",
    campaignCount: 1,
  },
  {
    id: "3",
    title: "$10 Off Your Next Visit",
    description: "Save $10 on any purchase of $50 or more",
    programType: "general" as const,
    programLabel: "General",
    status: "draft" as const,
    redemptionMethod: "Mobile",
    redemptionCount: 0,
    ctr: "—",
    daysRemaining: null,
    offerType: "Dollars Off",
    campaignCount: 0,
  },
  {
    id: "4",
    title: "Free Dessert with Entree",
    description: "Enjoy a complimentary dessert with any entree purchase",
    programType: "john_deere" as const,
    programLabel: "John Deere",
    status: "scheduled" as const,
    redemptionMethod: "External URL",
    redemptionCount: 0,
    ctr: "—",
    daysRemaining: null,
    scheduledDate: "Apr 1, 2026",
    offerType: "Free with Purchase",
    campaignCount: 1,
  },
  {
    id: "5",
    title: "Happy Hour Special",
    description: "50% off drinks and appetizers 3-6pm weekdays",
    programType: "yardi" as const,
    programLabel: "Yardi",
    status: "paused" as const,
    redemptionMethod: "Mobile",
    redemptionCount: 156,
    ctr: "31%",
    daysRemaining: null,
    offerType: "Percentage Savings",
    campaignCount: 3,
  },
  {
    id: "6",
    title: "Loyalty Points Multiplier",
    description: "Earn 3x points on all purchases this week",
    programType: "yardi" as const,
    programLabel: "Yardi",
    status: "active" as const,
    redemptionMethod: "Hub Airdrop",
    redemptionCount: 89,
    ctr: "18%",
    daysRemaining: 7,
    offerType: "Loyalty Points",
    campaignCount: 1,
  },
];

export default function OfferManagerDashboardV1({
  onCreateOffer,
}: OfferManagerDashboardV1Props) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("searchQuery") ?? "";
  const statusFilter = searchParams.get("statusFilter") ?? "";
  const typeFilter = searchParams.get("typeFilter") ?? "";
  const programFilter = searchParams.get("programFilter") ?? "";

  // Filter offers based on URL parameters
  const filteredOffers = useMemo(() => {
    return mockOffersV1.filter((offer) => {
      // Search filter
      const matchesSearch =
        !searchQuery ||
        offer.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const statusFilters = statusFilter ? statusFilter.split(",") : [];
      const matchesStatus =
        statusFilters.length === 0 || statusFilters.includes(offer.status);

      // Type filter (map offer types to filter values)
      const typeFilters = typeFilter ? typeFilter.split(",") : [];
      const offerTypeMap: Record<string, string> = {
        "Percentage Savings": "percentage_savings",
        "Dollars Off": "dollars_off",
        BOGO: "bogo",
        "Free with Purchase": "free_with_purchase",
        "Loyalty Points": "loyalty_points",
      };
      const offerTypeValue = offerTypeMap[offer.offerType];
      const matchesType =
        typeFilters.length === 0 || typeFilters.includes(offerTypeValue);

      // Program filter
      const programFilters = programFilter ? programFilter.split(",") : [];
      const matchesProgram =
        programFilters.length === 0 ||
        programFilters.includes(offer.programType);

      return matchesSearch && matchesStatus && matchesType && matchesProgram;
    });
  }, [searchQuery, statusFilter, typeFilter, programFilter]);

  return (
    <div className="space-y-4">
      {/* Page Header with Aurora variant */}
      <PageHeader
        title="Offer Manager"
        description="Create and manage promotional offers across all programs"
        emoji="🎁"
        variant="aurora"
        actions={
          <Button onClick={onCreateOffer} className="flex items-center gap-2">
            <PlusIcon className="h-5 w-5" />
            Create Offer
          </Button>
        }
      />

      {/* Search only - no filters for now */}
      <div className="flex gap-2">
        <SearchBar
          id="offer-manager-search"
          placeholder="Search offers by name..."
          className="flex-1"
        />
      </div>

      {/* Offers Table */}
      <OffersTable offers={filteredOffers} searchQuery={searchQuery} />
    </div>
  );
}

"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PageHeader from "@/components/molecules/PageHeader/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { Button } from "@/components/atoms/Button";
import { useToast } from "@/lib/hooks/use-toast";
import { PlusIcon } from "@heroicons/react/24/outline";
import { CampaignsTable } from "./components/CampaignsTable";
import { Campaign } from "./components/campaignColumns";

interface CampaignManagementDashboardProps {
  onCreateCampaign: () => void;
}

// Mock data based on BRD
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Summer Savings 2025",
    partner_name: "Acme Corp",
    program_name: "Rewards Plus",
    type: "promotional",
    description: "Limited time summer promotion",
    start_date: "2025-06-01",
    end_date: "2025-08-31",
    active: true,
    has_products: false,
    status: "active",
    created_at: "2025-05-01",
  },
  {
    id: "2",
    name: "Holiday Campaign 2025",
    partner_name: "Beta Inc",
    program_name: "Loyalty Program",
    type: "seasonal",
    description: "End of year holiday promotions",
    start_date: "2025-12-01",
    end_date: "2025-12-31",
    active: false,
    has_products: true,
    status: "scheduled",
    created_at: "2025-05-15",
  },
  {
    id: "3",
    name: "Spring Flash Sale",
    partner_name: "Gamma LLC",
    program_name: "Premium Members",
    type: "promotional",
    description: "48-hour flash sale event",
    start_date: "2025-04-15",
    end_date: "2025-04-17",
    active: false,
    has_products: true,
    status: "ended",
    created_at: "2025-04-01",
  },
  {
    id: "4",
    name: "Customer Appreciation Week",
    partner_name: "Acme Corp",
    program_name: "Standard Program",
    type: "targeted",
    description: "Special offers for loyal customers",
    start_date: "2025-06-15",
    end_date: "2025-06-22",
    active: true,
    has_products: true,
    status: "active",
    created_at: "2025-05-20",
  },
  {
    id: "5",
    name: "Back to School",
    partner_name: "Delta Co",
    program_name: "Education Plus",
    type: "seasonal",
    description: "Student and teacher discounts",
    start_date: "2025-08-01",
    end_date: "2025-09-30",
    active: false,
    has_products: false,
    status: "scheduled",
    created_at: "2025-05-25",
  },
  {
    id: "6",
    name: "Black Friday Mega Sale",
    partner_name: "Beta Inc",
    program_name: "Loyalty Program",
    type: "promotional",
    description: "Biggest sale of the year",
    start_date: "2025-11-24",
    end_date: "2025-11-26",
    active: false,
    has_products: true,
    status: "scheduled",
    created_at: "2025-05-28",
  },
  {
    id: "7",
    name: "VIP Members Only",
    partner_name: "Gamma LLC",
    program_name: "Premium Members",
    type: "targeted",
    description: "Exclusive deals for VIP members",
    start_date: "2025-05-01",
    end_date: "2025-05-15",
    active: false,
    has_products: true,
    status: "ended",
    created_at: "2025-04-15",
  },
  {
    id: "8",
    name: "Spring Cleaning Sale",
    partner_name: "Acme Corp",
    program_name: "Rewards Plus",
    type: "seasonal",
    description: "Clear out winter inventory",
    start_date: "2025-03-01",
    end_date: "2025-03-31",
    active: false,
    has_products: true,
    status: "ended",
    created_at: "2025-02-15",
  },
];

export function CampaignManagementDashboard({
  onCreateCampaign,
}: CampaignManagementDashboardProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [highlightedCampaignId, setHighlightedCampaignId] = useState<
    string | null
  >(null);

  // Handle new campaign from creation flow
  useEffect(() => {
    const success = searchParams.get("success");
    const newCampaignData = searchParams.get("newCampaign");

    if (success === "created" && newCampaignData) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(newCampaignData));

        // Add new campaign to the list
        setCampaigns((prev) => [decodedData, ...prev]);

        // Highlight the new campaign
        setHighlightedCampaignId(decodedData.id);

        // Show success toast
        toast({
          title: "✅ Campaign Created Successfully",
          description: `"${decodedData.name}" has been created${decodedData.active ? " and is now active" : ""}.`,
        });

        // Remove highlight after 3 seconds
        setTimeout(() => {
          setHighlightedCampaignId(null);
        }, 3000);

        // Clean up URL
        router.replace("/campaign-management", { scroll: false });
      } catch (error) {
        console.error("Failed to parse new campaign data:", error);
      }
    }
  }, [searchParams, router, toast]);
  const searchQuery = searchParams.get("searchQuery") ?? "";
  const statusFilter = searchParams.get("statusFilter") ?? "";
  const partnerFilter = searchParams.get("partnerFilter") ?? "";
  const typeFilter = searchParams.get("typeFilter") ?? "";

  // Filter campaigns based on search and filters
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((campaign) => {
      const matchesSearch =
        !searchQuery ||
        campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = !statusFilter || campaign.status === statusFilter;

      const matchesPartner =
        !partnerFilter || campaign.partner_name === partnerFilter;

      const matchesType = !typeFilter || campaign.type === typeFilter;

      return matchesSearch && matchesStatus && matchesPartner && matchesType;
    });
  }, [campaigns, searchQuery, statusFilter, partnerFilter, typeFilter]);

  // Handle row click to edit campaign
  const handleRowClick = useCallback(
    (campaign: Campaign) => {
      console.log("Edit campaign:", campaign);
      // TODO: Navigate to edit page or open edit modal
      toast({
        title: "Edit Campaign",
        description: `Opening editor for "${campaign.name}"`,
      });
    },
    [toast]
  );

  // Handle edit action from dropdown
  const handleEdit = useCallback(
    (campaign: Campaign) => {
      console.log("Edit campaign:", campaign);
      // TODO: Navigate to edit page or open edit modal
      toast({
        title: "Edit Campaign",
        description: `Opening editor for "${campaign.name}"`,
      });
    },
    [toast]
  );

  // Handle delete action from dropdown
  const handleDelete = useCallback(
    (campaign: Campaign) => {
      console.log("Delete campaign:", campaign);
      // TODO: Show delete confirmation dialog
      toast({
        title: "Delete Campaign",
        description: `Preparing to delete "${campaign.name}"`,
        variant: "destructive",
      });
    },
    [toast]
  );

  return (
    <div className="space-y-6">
      {/* Page Header with Create Button */}
      <PageHeader
        emoji="🎯"
        title="Campaign Management"
        description="Create and manage promotional campaigns across all programs"
        variant="aurora"
        actions={
          <Button
            onClick={onCreateCampaign}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Create Campaign
          </Button>
        }
      />

      {/* Search Bar */}
      <SearchBar
        id="campaign-search"
        placeholder="Search campaigns by name or description..."
        debounceMs={300}
        minLength={2}
      />

      {/* Campaigns Table */}
      <CampaignsTable
        campaigns={filteredCampaigns}
        searchQuery={searchQuery}
        highlightedId={highlightedCampaignId}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onRowClick={handleRowClick}
      />
    </div>
  );
}

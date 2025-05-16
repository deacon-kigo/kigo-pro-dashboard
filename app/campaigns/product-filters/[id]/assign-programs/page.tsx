"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/molecules/PageHeader";
import AppLayout from "@/components/templates/AppLayout/AppLayout";

// This function is needed for static site generation
export const generateStaticParams = async () => {
  // Hardcode some example IDs for static generation
  // In a real app, this would fetch all possible filter IDs from an API
  return [{ id: "filter-123" }, { id: "filter-456" }, { id: "filter-789" }];
};

// Mock data for program campaigns
// This would typically come from an API call
const mockProgramCampaigns = [
  {
    id: "pc-001",
    name: "Summer Holiday Campaign",
    description: "Special offers for summer vacation packages",
    category: "Seasonal",
    active: true,
    currentFilters: ["filter-123"],
  },
  {
    id: "pc-002",
    name: "Winter Wonderland",
    description: "Winter season promotional campaign",
    category: "Seasonal",
    active: true,
    currentFilters: [],
  },
  {
    id: "pc-003",
    name: "Anniversary Special",
    description: "Celebrating our 10th anniversary with special offers",
    category: "Special Event",
    active: true,
    currentFilters: ["filter-456"],
  },
  {
    id: "pc-004",
    name: "Family Package Promotion",
    description: "Special rates for family packages",
    category: "Demographic",
    active: false,
    currentFilters: [],
  },
  {
    id: "pc-005",
    name: "Weekend Getaway",
    description: "Special offers for weekend trips",
    category: "Travel Type",
    active: true,
    currentFilters: [],
  },
];

// Mock data for product filter details
// This would typically come from an API call
const fetchFilterDetails = async (filterId) => {
  // Simulate API call
  return {
    id: filterId,
    name: "Top Pizza Offers",
    description: "A curated selection of our best pizza offers",
    status: "Active",
    createdBy: "Admin User",
    createdDate: "2023-05-15",
  };
};

// Mock function to save filter assignments
// This would typically be an API call
const saveFilterAssignments = async (filterId, programIds) => {
  console.log("Assigning filter", filterId, "to programs:", programIds);
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  // Return success
  return { success: true };
};

export default function AssignProgramsPage() {
  const router = useRouter();
  const params = useParams();
  const filterId = params.id as string;

  const [filter, setFilter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrograms, setSelectedPrograms] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Categories for grouping programs
  const categories = [
    ...new Set(mockProgramCampaigns.map((pc) => pc.category)),
  ];

  // Fetch filter details on load
  useEffect(() => {
    const getFilterDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchFilterDetails(filterId);
        setFilter(data);

        // Initialize selected programs from current assignments
        const initialSelected = {};
        mockProgramCampaigns.forEach((campaign) => {
          if (campaign.currentFilters.includes(filterId)) {
            initialSelected[campaign.id] = true;
          }
        });
        setSelectedPrograms(initialSelected);
      } catch (err) {
        setError(err.message || "Failed to load filter details");
      } finally {
        setLoading(false);
      }
    };

    getFilterDetails();
  }, [filterId]);

  // Handle program selection
  const handleProgramSelection = (programId, checked) => {
    setSelectedPrograms((prev) => ({
      ...prev,
      [programId]: checked,
    }));
  };

  // Handle category selection (select/deselect all in category)
  const handleCategorySelection = (category, checked) => {
    const updatedSelection = { ...selectedPrograms };

    // Get all programs in this category
    const programsInCategory = mockProgramCampaigns.filter(
      (pc) => pc.category === category && pc.active
    );

    // Update all programs in this category
    programsInCategory.forEach((program) => {
      updatedSelection[program.id] = checked;
    });

    setSelectedPrograms(updatedSelection);
  };

  // Filter campaigns by search query
  const filteredPrograms = mockProgramCampaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Check if a category is fully selected
  const isCategoryFullySelected = (category) => {
    const programsInCategory = mockProgramCampaigns.filter(
      (pc) => pc.category === category && pc.active
    );
    return programsInCategory.every((program) => selectedPrograms[program.id]);
  };

  // Check if a category is partially selected
  const isCategoryPartiallySelected = (category) => {
    const programsInCategory = mockProgramCampaigns.filter(
      (pc) => pc.category === category && pc.active
    );
    const selectedCount = programsInCategory.filter(
      (program) => selectedPrograms[program.id]
    ).length;
    return selectedCount > 0 && selectedCount < programsInCategory.length;
  };

  // Get count of selected programs
  const selectedCount = Object.values(selectedPrograms).filter(Boolean).length;

  // Handle save
  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      setSaveError(null);

      // Get list of selected program IDs
      const selectedProgramIds = Object.keys(selectedPrograms).filter(
        (id) => selectedPrograms[id]
      );

      // Call API to save assignments
      const result = await saveFilterAssignments(filterId, selectedProgramIds);

      if (result.success) {
        setSaveSuccess(true);
        // Wait a moment before navigating back
        setTimeout(() => {
          router.push(`/campaigns/product-filters/${filterId}`);
        }, 1500);
      } else {
        setSaveError("Failed to save assignments");
      }
    } catch (err) {
      setSaveError(err.message || "Failed to save assignments");
    } finally {
      setSaving(false);
    }
  };

  // Custom breadcrumb
  const customBreadcrumb = (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaigns">Campaigns</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaigns/product-filters">
            Product Filters
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href={`/campaigns/product-filters/${filterId}`}>
            {filter?.name || "Filter Details"}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Assign to Program Campaigns</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

  return (
    <AppLayout customBreadcrumb={customBreadcrumb}>
      <div className="space-y-6">
        <PageHeader
          title="Assign to Program Campaigns"
          description={`Assign "${filter?.name || "Loading..."}" to program campaigns to control where offers will be displayed.`}
          actions={
            <Button
              variant="outline"
              className="flex items-center gap-1"
              onClick={() => router.back()}
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </Button>
          }
        />

        {loading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center text-red-500 gap-2">
              <ExclamationCircleIcon className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filter search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-4">
                <Input
                  type="text"
                  placeholder="Search program campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-md"
                />
              </div>

              {/* Selected count */}
              <div className="mb-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">
                  {selectedCount} program campaign
                  {selectedCount !== 1 ? "s" : ""} selected
                </span>
                {selectedCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedPrograms({})}
                  >
                    Clear All
                  </Button>
                )}
              </div>

              {/* Program campaigns by category */}
              <div className="space-y-6">
                {categories.map((category) => {
                  const programsInCategory = filteredPrograms.filter(
                    (p) => p.category === category
                  );

                  if (programsInCategory.length === 0) return null;

                  const isFullySelected = isCategoryFullySelected(category);
                  const isPartiallySelected =
                    isCategoryPartiallySelected(category);

                  return (
                    <div key={category} className="space-y-3">
                      {/* Category header with checkbox */}
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={isFullySelected}
                          indeterminate={
                            !isFullySelected && isPartiallySelected
                          }
                          onCheckedChange={(checked) =>
                            handleCategorySelection(category, checked === true)
                          }
                        />
                        <label
                          htmlFor={`category-${category}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {category}
                        </label>
                      </div>

                      {/* Programs in this category */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                        {programsInCategory.map((program) => (
                          <div
                            key={program.id}
                            className={`flex items-center space-x-3 rounded-md border p-3 ${
                              !program.active ? "opacity-60" : ""
                            }`}
                          >
                            <Checkbox
                              id={`program-${program.id}`}
                              checked={!!selectedPrograms[program.id]}
                              disabled={!program.active}
                              onCheckedChange={(checked) =>
                                handleProgramSelection(
                                  program.id,
                                  checked === true
                                )
                              }
                            />
                            <div className="flex flex-1 items-center justify-between">
                              <div>
                                <label
                                  htmlFor={`program-${program.id}`}
                                  className={`block font-medium text-sm ${
                                    program.active
                                      ? "cursor-pointer"
                                      : "cursor-not-allowed"
                                  }`}
                                >
                                  {program.name}
                                </label>
                                <p className="text-xs text-gray-500">
                                  {program.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {!program.active && (
                                  <Badge
                                    variant="outline"
                                    className="bg-gray-100"
                                  >
                                    Inactive
                                  </Badge>
                                )}
                                {program.currentFilters.includes(filterId) && (
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700"
                                  >
                                    Current
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end">
              <div className="flex items-center gap-3">
                {saveSuccess && (
                  <div className="flex items-center text-green-600 gap-1">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span>Assignments saved successfully!</span>
                  </div>
                )}
                {saveError && (
                  <div className="flex items-center text-red-500 gap-1">
                    <ExclamationCircleIcon className="h-5 w-5" />
                    <span>{saveError}</span>
                  </div>
                )}
                <Button
                  onClick={() => router.back()}
                  variant="outline"
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving} loading={saving}>
                  Save Assignments
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

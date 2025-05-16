"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

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

// Mock function to save filter assignments
// This would typically be an API call
const saveFilterAssignments = async (filterId, programIds) => {
  console.log("Assigning filter", filterId, "to programs:", programIds);
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  // Return success
  return { success: true };
};

interface AssignToProgramsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filterId: string;
  filterName: string;
}

export function AssignToProgramsSheet({
  isOpen,
  onClose,
  filterId,
  filterName,
}: AssignToProgramsSheetProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrograms, setSelectedPrograms] = useState<
    Record<string, boolean>
  >({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(false);

  // Categories for grouping programs
  const categories = [
    ...new Set(mockProgramCampaigns.map((pc) => pc.category)),
  ];

  // Initialize selected programs when the sheet opens
  useEffect(() => {
    if (isOpen) {
      const initialSelected: Record<string, boolean> = {};
      mockProgramCampaigns.forEach((campaign) => {
        if (campaign.currentFilters.includes(filterId)) {
          initialSelected[campaign.id] = true;
        }
      });
      setSelectedPrograms(initialSelected);
      setSaveSuccess(false);
      setSaveError(null);
    }
  }, [isOpen, filterId]);

  // Handle program selection
  const handleProgramSelection = (programId: string, checked: boolean) => {
    setSelectedPrograms((prev) => ({
      ...prev,
      [programId]: checked,
    }));
  };

  // Handle category selection (select/deselect all in category)
  const handleCategorySelection = (category: string, checked: boolean) => {
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
  const isCategoryFullySelected = (category: string) => {
    const programsInCategory = mockProgramCampaigns.filter(
      (pc) => pc.category === category && pc.active
    );
    return programsInCategory.every((program) => selectedPrograms[program.id]);
  };

  // Check if a category is partially selected
  const isCategoryPartiallySelected = (category: string) => {
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
        // Close the sheet after a short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setSaveError("Failed to save assignments");
      }
    } catch (err: any) {
      setSaveError(err.message || "Failed to save assignments");
    } finally {
      setSaving(false);
    }
  };

  // Handle AI assistant toggle
  const handleAiAssistantToggle = () => {
    setAiAssistantEnabled(!aiAssistantEnabled);
    // If enabling AI assistant, we could trigger AI suggestions here
    if (!aiAssistantEnabled) {
      // This would be replaced with actual AI logic
      console.log("AI assistant enabled for filter", filterId);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md md:max-w-lg" side="right">
        <SheetHeader className="mb-6">
          <div className="flex justify-between items-center">
            <SheetTitle>Assign to Program Campaigns</SheetTitle>
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 ${aiAssistantEnabled ? "bg-blue-50 text-blue-700 border-blue-200" : ""}`}
              onClick={handleAiAssistantToggle}
            >
              <SparklesIcon className="h-4 w-4" />
              {aiAssistantEnabled ? "AI Enabled" : "Enable AI Assistant"}
            </Button>
          </div>
          <SheetDescription>
            Assign "{filterName}" to program campaigns to control where offers
            will be displayed.
            {aiAssistantEnabled && (
              <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md text-sm">
                <p className="flex items-center gap-1">
                  <SparklesIcon className="h-4 w-4" />
                  AI Assistant is analyzing your filter and suggesting optimal
                  program campaigns.
                </p>
              </div>
            )}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Search input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
            </div>
            <Input
              type="text"
              placeholder="Search program campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected count */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {selectedCount} program campaign{selectedCount !== 1 ? "s" : ""}{" "}
              selected
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

          {/* Scrollable program list area */}
          <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-280px)]">
            {categories.map((category) => {
              const programsInCategory = filteredPrograms.filter(
                (p) => p.category === category
              );

              if (programsInCategory.length === 0) return null;

              const isFullySelected = isCategoryFullySelected(category);
              const isPartiallySelected = isCategoryPartiallySelected(category);

              return (
                <div key={category} className="space-y-3">
                  {/* Category header with checkbox */}
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`sheet-category-${category}`}
                      checked={isFullySelected}
                      // Support indeterminate state
                      ref={(checkbox) => {
                        if (checkbox) {
                          // Use HTMLInputElement to properly set indeterminate
                          const inputEl =
                            checkbox as unknown as HTMLInputElement;
                          inputEl.indeterminate =
                            !isFullySelected && isPartiallySelected;
                        }
                      }}
                      onCheckedChange={(checked) =>
                        handleCategorySelection(category, !!checked)
                      }
                    />
                    <label
                      htmlFor={`sheet-category-${category}`}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {category}
                    </label>
                  </div>

                  {/* Programs in this category */}
                  <div className="space-y-2 pl-6">
                    {programsInCategory.map((program) => (
                      <div
                        key={program.id}
                        className={`flex items-center space-x-3 rounded-md border p-3 ${
                          !program.active ? "opacity-60" : ""
                        }`}
                      >
                        <Checkbox
                          id={`sheet-program-${program.id}`}
                          checked={!!selectedPrograms[program.id]}
                          disabled={!program.active}
                          onCheckedChange={(checked) =>
                            handleProgramSelection(program.id, !!checked)
                          }
                        />
                        <div className="flex flex-1 items-center justify-between">
                          <div>
                            <label
                              htmlFor={`sheet-program-${program.id}`}
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
                              <Badge variant="outline" className="bg-gray-100">
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

        {/* Feedback and action buttons */}
        <SheetFooter className="pt-6 flex justify-between items-center">
          <div className="flex-1">
            {saveSuccess && (
              <div className="flex items-center text-green-600 gap-1">
                <CheckCircleIcon className="h-5 w-5" />
                <span>Assignments saved!</span>
              </div>
            )}
            {saveError && (
              <div className="flex items-center text-red-500 gap-1">
                <ExclamationCircleIcon className="h-5 w-5" />
                <span>{saveError}</span>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Assignments"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

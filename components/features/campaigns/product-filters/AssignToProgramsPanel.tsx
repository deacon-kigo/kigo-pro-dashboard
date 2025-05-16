"use client";

import React, { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Label } from "@/components/atoms/Label";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDown,
  ChevronRight,
  Building,
  Briefcase,
  LayoutGrid,
  CheckCircle,
} from "lucide-react";

// Define the hierarchical structure based on Kigo Pro glossary
interface Campaign {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
  currentFilters?: string[];
}

interface Program {
  id: string;
  name: string;
  campaigns: Campaign[];
}

interface Partner {
  id: string;
  name: string;
  programs: Program[];
}

// Mock data for the nested hierarchy - using exact structure from ads-create
// This would typically come from an API call
const mockPartners: Partner[] = [
  {
    id: "partner1",
    name: "Augeo",
    programs: [
      {
        id: "prog1",
        name: "LexisNexis",
        campaigns: [
          {
            id: "camp1",
            name: "Legal Research Promotion",
            description:
              "Promotional offers for legal research tools and services",
            active: true,
            currentFilters: ["filter-123"],
          },
          {
            id: "camp2",
            name: "Student Discount Initiative",
            description: "Special discounts for law students",
            active: true,
            currentFilters: [],
          },
        ],
      },
      {
        id: "prog2",
        name: "Fidelity Investments",
        campaigns: [
          {
            id: "camp3",
            name: "Retirement Planning",
            description: "Offers related to retirement planning services",
            active: true,
            currentFilters: [],
          },
          {
            id: "camp4",
            name: "Wealth Management",
            description: "Premium offers for wealth management clients",
            active: true,
            currentFilters: ["filter-456"],
          },
        ],
      },
    ],
  },
  {
    id: "partner2",
    name: "ampliFI",
    programs: [
      {
        id: "prog3",
        name: "Chase",
        campaigns: [
          {
            id: "camp5",
            name: "Credit Card Rewards",
            description: "Exclusive offers for Chase credit card holders",
            active: true,
            currentFilters: [],
          },
          {
            id: "camp6",
            name: "Business Banking Solutions",
            description: "Promotions for small business banking customers",
            active: false,
            currentFilters: [],
          },
        ],
      },
    ],
  },
  {
    id: "partner3",
    name: "John Deere",
    programs: [
      {
        id: "prog4",
        name: "Dealer Network",
        campaigns: [
          {
            id: "camp7",
            name: "Oil Promotion",
            description: "Special offers on oil changes and maintenance",
            active: true,
            currentFilters: [],
          },
          {
            id: "camp8",
            name: "Parts Discount",
            description: "Discounts on genuine John Deere parts",
            active: true,
            currentFilters: [],
          },
          {
            id: "camp9",
            name: "Service Special",
            description: "Seasonal service specials for equipment maintenance",
            active: true,
            currentFilters: ["filter-789"],
          },
        ],
      },
    ],
  },
];

// Mock function to save filter assignments
// This would typically be an API call
const saveFilterAssignments = async (
  filterId: string,
  campaignIds: string[]
) => {
  console.log(
    "Assigning filter",
    filterId,
    "to program campaigns:",
    campaignIds
  );
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  // Return success
  return { success: true };
};

interface AssignToProgramsPanelProps {
  filterId: string;
  filterName: string;
  onClose: () => void;
}

export function AssignToProgramsPanel({
  filterId,
  filterName,
  onClose,
}: AssignToProgramsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaigns, setSelectedCampaigns] = useState<
    Record<string, boolean>
  >({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(false);
  const [recentlySelectedIds, setRecentlySelectedIds] = useState<string[]>([]);

  // Keep track of expanded items
  const [expandedPartners, setExpandedPartners] = useState<string[]>([]);
  const [expandedPrograms, setExpandedPrograms] = useState<string[]>([]);

  // Initialize selected campaigns when the panel opens
  useEffect(() => {
    const initialSelected: Record<string, boolean> = {};

    mockPartners.forEach((partner) => {
      partner.programs.forEach((program) => {
        program.campaigns.forEach((campaign) => {
          if (campaign.currentFilters?.includes(filterId)) {
            initialSelected[campaign.id] = true;
          }
        });
      });
    });

    setSelectedCampaigns(initialSelected);
    setSaveSuccess(false);
    setSaveError(null);
  }, [filterId]);

  // Toggle expansion of a partner
  const togglePartner = (partnerId: string) => {
    setExpandedPartners((prev) =>
      prev.includes(partnerId)
        ? prev.filter((id) => id !== partnerId)
        : [...prev, partnerId]
    );
  };

  // Toggle expansion of a program
  const toggleProgram = (programId: string) => {
    setExpandedPrograms((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId]
    );
  };

  // Check if all campaigns in a program are selected
  const isAllCampaignsSelected = (campaigns: Campaign[]) => {
    return campaigns
      .filter((campaign) => campaign.active !== false)
      .every((campaign) => selectedCampaigns[campaign.id]);
  };

  // Check if some campaigns in a program are selected
  const isSomeCampaignsSelected = (campaigns: Campaign[]) => {
    const activeCampaigns = campaigns.filter(
      (campaign) => campaign.active !== false
    );
    return (
      activeCampaigns.some((campaign) => selectedCampaigns[campaign.id]) &&
      !isAllCampaignsSelected(activeCampaigns)
    );
  };

  // Check if all programs in a partner are selected
  const isAllProgramsSelected = (programs: Program[]) => {
    return programs.every((program) =>
      isAllCampaignsSelected(program.campaigns)
    );
  };

  // Check if some programs in a partner are selected
  const isSomeProgramsSelected = (partner: Partner) => {
    return (
      partner.programs.some(
        (program) =>
          isSomeCampaignsSelected(program.campaigns) ||
          isAllCampaignsSelected(program.campaigns)
      ) && !isAllProgramsSelected(partner.programs)
    );
  };

  // Handle campaign selection with visual feedback
  const handleCampaignSelection = (campaignId: string, checked: boolean) => {
    setSelectedCampaigns((prev) => ({
      ...prev,
      [campaignId]: checked,
    }));

    // Add visual feedback by tracking recently selected items
    setRecentlySelectedIds((prev) => [...prev, campaignId]);
    setTimeout(() => {
      setRecentlySelectedIds((prev) => prev.filter((id) => id !== campaignId));
    }, 1000);
  };

  // Handle program selection (select/deselect all campaigns in program)
  const handleProgramSelection = (program: Program, checked: boolean) => {
    const updatedSelection = { ...selectedCampaigns };

    // Update all active campaigns in this program
    program.campaigns
      .filter((campaign) => campaign.active !== false)
      .forEach((campaign) => {
        updatedSelection[campaign.id] = checked;
      });

    setSelectedCampaigns(updatedSelection);
  };

  // Handle partner selection (select/deselect all campaigns in all programs)
  const handlePartnerSelection = (partner: Partner, checked: boolean) => {
    const updatedSelection = { ...selectedCampaigns };

    // Update all active campaigns in all programs of this partner
    partner.programs.forEach((program) => {
      program.campaigns
        .filter((campaign) => campaign.active !== false)
        .forEach((campaign) => {
          updatedSelection[campaign.id] = checked;
        });
    });

    setSelectedCampaigns(updatedSelection);
  };

  // Filter partners, programs and campaigns by search query
  const getFilteredPartners = () => {
    if (!searchQuery.trim()) return mockPartners;

    const query = searchQuery.toLowerCase();

    return mockPartners
      .map((partner) => {
        // Filter programs in this partner
        const filteredPrograms = partner.programs
          .map((program) => {
            // Filter campaigns in this program
            const filteredCampaigns = program.campaigns.filter(
              (campaign) =>
                campaign.name.toLowerCase().includes(query) ||
                (campaign.description &&
                  campaign.description.toLowerCase().includes(query))
            );

            if (filteredCampaigns.length === 0) return null;

            return {
              ...program,
              campaigns: filteredCampaigns,
            };
          })
          .filter(Boolean) as Program[];

        if (filteredPrograms.length === 0) return null;

        return {
          ...partner,
          programs: filteredPrograms,
        };
      })
      .filter(Boolean) as Partner[];
  };

  const filteredPartners = getFilteredPartners();

  // Get count of selected campaigns
  const selectedCount = Object.values(selectedCampaigns).filter(Boolean).length;

  // Handle AI assistant toggle
  const handleAiAssistantToggle = () => {
    setAiAssistantEnabled(!aiAssistantEnabled);
    // If enabling AI assistant, we could trigger AI suggestions here
    if (!aiAssistantEnabled) {
      // This would be replaced with actual AI logic
      console.log("AI assistant enabled for filter", filterId);
    }
  };

  // Select all campaigns
  const selectAll = () => {
    const allSelected: Record<string, boolean> = {};
    mockPartners.forEach((partner) => {
      partner.programs.forEach((program) => {
        program.campaigns
          .filter((campaign) => campaign.active !== false)
          .forEach((campaign) => {
            allSelected[campaign.id] = true;
          });
      });
    });
    setSelectedCampaigns(allSelected);
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedCampaigns({});
  };

  // Handle save with improved feedback
  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      setSaveError(null);

      // Get list of selected campaign IDs
      const selectedCampaignIds = Object.keys(selectedCampaigns).filter(
        (id) => selectedCampaigns[id]
      );

      // Get campaign names for feedback message
      const selectedCampaignDetails = selectedCampaignIds.map((id) => {
        let campaignName = "";
        let programName = "";
        let partnerName = "";

        mockPartners.forEach((partner) => {
          partner.programs.forEach((program) => {
            program.campaigns.forEach((campaign) => {
              if (campaign.id === id) {
                campaignName = campaign.name;
                programName = program.name;
                partnerName = partner.name;
              }
            });
          });
        });

        return { id, campaignName, programName, partnerName };
      });

      // Call API to save assignments
      const result = await saveFilterAssignments(filterId, selectedCampaignIds);

      if (result.success) {
        setSaveSuccess(true);

        // Store details for success message
        const successDetails = {
          count: selectedCampaignIds.length,
          campaigns: selectedCampaignDetails,
        };

        localStorage.setItem(
          `filter_assignment_${filterId}`,
          JSON.stringify(successDetails)
        );

        // Close the panel after a short delay
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

  // Get recently selected visual indicator className
  const getSelectionFeedbackClass = (campaignId: string) => {
    return recentlySelectedIds.includes(campaignId)
      ? "bg-blue-50 transition-colors duration-500"
      : "";
  };

  return (
    <div className="flex flex-col h-full max-h-full overflow-hidden">
      {/* Header */}
      <div className="border-b border-border-light pb-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Assign to Program Campaigns</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 ${aiAssistantEnabled ? "bg-blue-50 text-blue-700 border-blue-200" : ""}`}
              onClick={handleAiAssistantToggle}
            >
              <SparklesIcon className="h-4 w-4" />
              Enable AI Assistant
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="rounded-full h-8 w-8 p-0 flex items-center justify-center"
            >
              <XMarkIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Assign "{filterName}" to program campaigns to control where offers
          will be displayed within partners and programs.
        </p>
        {aiAssistantEnabled && (
          <div className="mt-2 p-2 bg-blue-50 text-blue-700 rounded-md text-sm">
            <p className="flex items-center gap-1">
              <SparklesIcon className="h-4 w-4" />
              AI Assistant is analyzing your filter and suggesting optimal
              program campaigns.
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Search input */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search partners, programs or campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Selected count and buttons */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            {selectedCount} program campaign{selectedCount !== 1 ? "s" : ""}{" "}
            selected
          </span>
          <div className="flex space-x-2">
            {selectedCount > 0 && (
              <Button variant="outline" size="sm" onClick={clearAll}>
                Clear All
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={selectAll}>
              <CheckCircle className="mr-1 h-4 w-4" />
              Select All
            </Button>
          </div>
        </div>

        {/* Scrollable program list area */}
        <div className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-1 border rounded-md overflow-hidden">
            {filteredPartners.map((partner) => (
              <div key={partner.id} className="border-b last:border-b-0">
                {/* Partner level */}
                <div
                  className={`flex items-center p-3 bg-slate-50 hover:bg-slate-100 cursor-pointer ${
                    expandedPartners.includes(partner.id) ? "border-b" : ""
                  }`}
                  onClick={() => togglePartner(partner.id)}
                >
                  <div className="mr-2">
                    {expandedPartners.includes(partner.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>

                  <div className="flex items-center flex-1">
                    <div className="mr-2">
                      <Checkbox
                        id={`partner-${partner.id}`}
                        checked={isAllProgramsSelected(partner.programs)}
                        ref={(checkbox) => {
                          if (checkbox) {
                            const inputEl =
                              checkbox as unknown as HTMLInputElement;
                            inputEl.indeterminate =
                              !isAllProgramsSelected(partner.programs) &&
                              isSomeProgramsSelected(partner);
                          }
                        }}
                        onCheckedChange={(checked) =>
                          handlePartnerSelection(partner, !!checked)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-blue-600" />
                      <Label
                        htmlFor={`partner-${partner.id}`}
                        className="font-medium cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {partner.name}
                      </Label>
                    </div>
                  </div>

                  <Badge variant="outline" className="text-xs">
                    {partner.programs.length} program
                    {partner.programs.length !== 1 ? "s" : ""}
                  </Badge>
                </div>

                {/* Programs under this partner */}
                {expandedPartners.includes(partner.id) && (
                  <div className="pl-9">
                    {partner.programs.map((program) => (
                      <div key={program.id} className="border-t">
                        {/* Program level */}
                        <div
                          className={`flex items-center p-3 hover:bg-slate-50 cursor-pointer ${
                            expandedPrograms.includes(program.id)
                              ? "border-b"
                              : ""
                          }`}
                          onClick={() => toggleProgram(program.id)}
                        >
                          <div className="mr-2">
                            {expandedPrograms.includes(program.id) ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </div>

                          <div className="flex items-center flex-1">
                            <div className="mr-2">
                              <Checkbox
                                id={`program-${program.id}`}
                                checked={isAllCampaignsSelected(
                                  program.campaigns
                                )}
                                ref={(checkbox) => {
                                  if (checkbox) {
                                    const inputEl =
                                      checkbox as unknown as HTMLInputElement;
                                    inputEl.indeterminate =
                                      !isAllCampaignsSelected(
                                        program.campaigns
                                      ) &&
                                      isSomeCampaignsSelected(
                                        program.campaigns
                                      );
                                  }
                                }}
                                onCheckedChange={(checked) =>
                                  handleProgramSelection(program, !!checked)
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>

                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-2 text-green-600" />
                              <Label
                                htmlFor={`program-${program.id}`}
                                className="font-medium cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {program.name}
                              </Label>
                            </div>
                          </div>

                          <Badge variant="outline" className="text-xs">
                            {program.campaigns.length} campaign
                            {program.campaigns.length !== 1 ? "s" : ""}
                          </Badge>
                        </div>

                        {/* Campaigns under this program */}
                        {expandedPrograms.includes(program.id) && (
                          <div className="pl-9">
                            {program.campaigns.map((campaign) => (
                              <div
                                key={campaign.id}
                                className={`flex items-center p-3 hover:bg-slate-50 border-t ${
                                  campaign.active === false ? "opacity-60" : ""
                                } ${getSelectionFeedbackClass(campaign.id)}`}
                              >
                                <div className="mr-2">
                                  <Checkbox
                                    id={`campaign-${campaign.id}`}
                                    checked={!!selectedCampaigns[campaign.id]}
                                    disabled={campaign.active === false}
                                    onCheckedChange={(checked) =>
                                      handleCampaignSelection(
                                        campaign.id,
                                        !!checked
                                      )
                                    }
                                  />
                                </div>

                                <div className="flex flex-1 items-center justify-between">
                                  <div className="flex items-center">
                                    <LayoutGrid className="h-4 w-4 mr-2 text-purple-600" />
                                    <div>
                                      <Label
                                        htmlFor={`campaign-${campaign.id}`}
                                        className={`block font-medium text-sm ${
                                          campaign.active === false
                                            ? "cursor-not-allowed"
                                            : "cursor-pointer"
                                        }`}
                                      >
                                        {campaign.name}
                                      </Label>
                                      {campaign.description && (
                                        <p className="text-xs text-gray-500">
                                          {campaign.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {campaign.active === false && (
                                      <Badge
                                        variant="outline"
                                        className="bg-gray-100"
                                      >
                                        Inactive
                                      </Badge>
                                    )}
                                    {campaign.currentFilters?.includes(
                                      filterId
                                    ) && (
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
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredPartners.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No matching partners, programs or campaigns found.
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="pt-4 mt-4 border-t border-border-light flex justify-between items-center">
          <div className="flex-1">
            {saveSuccess && (
              <div className="flex items-center text-green-600 gap-1">
                <CheckCircleIcon className="h-5 w-5" />
                <span>
                  Filter successfully assigned to {selectedCount} campaign
                  {selectedCount !== 1 ? "s" : ""}
                </span>
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
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Assignments"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

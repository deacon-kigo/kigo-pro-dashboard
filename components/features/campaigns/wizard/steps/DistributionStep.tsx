"use client";

import React, { useEffect, useState } from "react";
import { Label } from "@/components/atoms/Label";
import { Checkbox } from "@/components/ui/checkbox";
import { CampaignDistribution } from "@/lib/redux/slices/campaignSlice";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import {
  ChevronDown,
  ChevronRight,
  Check,
  Building,
  Briefcase,
  LayoutGrid,
  CheckSquare,
  CheckCircle,
} from "lucide-react";

interface DistributionStepProps {
  formData: CampaignDistribution;
  updateDistribution: (data: Partial<CampaignDistribution>) => void;
  setStepValidation: (isValid: boolean) => void;
}

// Define the hierarchical structure
interface Campaign {
  id: string;
  name: string;
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

const DistributionStep: React.FC<DistributionStepProps> = ({
  formData,
  updateDistribution,
  setStepValidation,
}) => {
  // Mock data for the nested hierarchy - in a real app, this would come from an API
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: "partner1",
      name: "Augeo",
      programs: [
        {
          id: "prog1",
          name: "LexisNexis",
          campaigns: [
            { id: "camp1", name: "Legal Research Promotion" },
            { id: "camp2", name: "Student Discount Initiative" },
          ],
        },
        {
          id: "prog2",
          name: "Fidelity Investments",
          campaigns: [
            { id: "camp3", name: "Retirement Planning" },
            { id: "camp4", name: "Wealth Management" },
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
            { id: "camp5", name: "Credit Card Rewards" },
            { id: "camp6", name: "Business Banking Solutions" },
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
            { id: "camp7", name: "Oil Promotion" },
            { id: "camp8", name: "Parts Discount" },
            { id: "camp9", name: "Service Special" },
          ],
        },
      ],
    },
  ]);

  // Keep track of expanded items
  const [expandedPartners, setExpandedPartners] = useState<string[]>([]);
  const [expandedPrograms, setExpandedPrograms] = useState<string[]>([]);

  // Keep track of checked items for the UI
  const [checkedPartners, setCheckedPartners] = useState<string[]>([]);
  const [checkedPrograms, setCheckedPrograms] = useState<string[]>([]);
  const [checkedCampaigns, setCheckedCampaigns] = useState<string[]>(
    formData.programCampaigns || []
  );

  // This step is optional, so it's always valid
  useEffect(() => {
    setStepValidation(true);
  }, [setStepValidation]);

  // Initialize state from formData
  useEffect(() => {
    if (formData.programCampaigns.length > 0) {
      setCheckedCampaigns(formData.programCampaigns);

      // Determine which programs and partners should be checked based on campaigns
      const programs = new Set<string>();
      const partnerIds = new Set<string>();

      partners.forEach((partner) => {
        partner.programs.forEach((program) => {
          program.campaigns.forEach((campaign) => {
            if (formData.programCampaigns.includes(campaign.id)) {
              programs.add(program.id);
              partnerIds.add(partner.id);
            }
          });
        });
      });

      setCheckedPrograms(Array.from(programs));
      setCheckedPartners(Array.from(partnerIds));
    }
  }, []);

  // Toggle expansion of a partner
  const togglePartner = (partnerId: string) => {
    setExpandedPartners((prevExpanded) =>
      prevExpanded.includes(partnerId)
        ? prevExpanded.filter((id) => id !== partnerId)
        : [...prevExpanded, partnerId]
    );
  };

  // Toggle expansion of a program
  const toggleProgram = (programId: string) => {
    setExpandedPrograms((prevExpanded) =>
      prevExpanded.includes(programId)
        ? prevExpanded.filter((id) => id !== programId)
        : [...prevExpanded, programId]
    );
  };

  // Check if all campaigns in a program are checked
  const isAllCampaignsChecked = (campaigns: Campaign[]) => {
    return campaigns.every((campaign) =>
      checkedCampaigns.includes(campaign.id)
    );
  };

  // Check if some campaigns in a program are checked
  const isSomeCampaignsChecked = (campaigns: Campaign[]) => {
    return (
      campaigns.some((campaign) => checkedCampaigns.includes(campaign.id)) &&
      !isAllCampaignsChecked(campaigns)
    );
  };

  // Check if all programs in a partner are checked
  const isAllProgramsChecked = (programs: Program[]) => {
    return programs.every((program) =>
      isAllCampaignsChecked(program.campaigns)
    );
  };

  // Check if some programs in a partner are checked
  const isSomeProgramsChecked = (partner: Partner) => {
    return (
      partner.programs.some(
        (program) =>
          isSomeCampaignsChecked(program.campaigns) ||
          isAllCampaignsChecked(program.campaigns)
      ) && !isAllProgramsChecked(partner.programs)
    );
  };

  // Handle campaign checkbox change
  const handleCampaignChange = (campaignId: string, checked: boolean) => {
    let newCheckedCampaigns;

    if (checked) {
      newCheckedCampaigns = [...checkedCampaigns, campaignId];
    } else {
      newCheckedCampaigns = checkedCampaigns.filter((id) => id !== campaignId);
    }

    setCheckedCampaigns(newCheckedCampaigns);
    updateDistribution({ programCampaigns: newCheckedCampaigns });
  };

  // Handle program checkbox change
  const handleProgramChange = (program: Program, checked: boolean) => {
    let newCheckedCampaigns = [...checkedCampaigns];

    if (checked) {
      // Add all campaigns from this program
      program.campaigns.forEach((campaign) => {
        if (!newCheckedCampaigns.includes(campaign.id)) {
          newCheckedCampaigns.push(campaign.id);
        }
      });

      // Add program to checked programs
      if (!checkedPrograms.includes(program.id)) {
        setCheckedPrograms([...checkedPrograms, program.id]);
      }
    } else {
      // Remove all campaigns from this program
      newCheckedCampaigns = newCheckedCampaigns.filter(
        (id) => !program.campaigns.some((campaign) => campaign.id === id)
      );

      // Remove program from checked programs
      setCheckedPrograms(checkedPrograms.filter((id) => id !== program.id));
    }

    setCheckedCampaigns(newCheckedCampaigns);
    updateDistribution({ programCampaigns: newCheckedCampaigns });
  };

  // Handle partner checkbox change
  const handlePartnerChange = (partner: Partner, checked: boolean) => {
    let newCheckedCampaigns = [...checkedCampaigns];
    let newCheckedPrograms = [...checkedPrograms];

    if (checked) {
      // Add all campaigns from all programs of this partner
      partner.programs.forEach((program) => {
        program.campaigns.forEach((campaign) => {
          if (!newCheckedCampaigns.includes(campaign.id)) {
            newCheckedCampaigns.push(campaign.id);
          }
        });

        // Add program to checked programs
        if (!newCheckedPrograms.includes(program.id)) {
          newCheckedPrograms.push(program.id);
        }
      });

      // Add partner to checked partners
      if (!checkedPartners.includes(partner.id)) {
        setCheckedPartners([...checkedPartners, partner.id]);
      }
    } else {
      // Remove all campaigns from all programs of this partner
      partner.programs.forEach((program) => {
        newCheckedCampaigns = newCheckedCampaigns.filter(
          (id) => !program.campaigns.some((campaign) => campaign.id === id)
        );

        // Remove program from checked programs
        newCheckedPrograms = newCheckedPrograms.filter(
          (id) => id !== program.id
        );
      });

      // Remove partner from checked partners
      setCheckedPartners(checkedPartners.filter((id) => id !== partner.id));
    }

    setCheckedCampaigns(newCheckedCampaigns);
    setCheckedPrograms(newCheckedPrograms);
    updateDistribution({ programCampaigns: newCheckedCampaigns });
  };

  // Select all partners, programs, and campaigns
  const selectAll = () => {
    const allCampaignIds: string[] = [];
    const allProgramIds: string[] = [];
    const allPartnerIds: string[] = [];

    partners.forEach((partner) => {
      allPartnerIds.push(partner.id);

      partner.programs.forEach((program) => {
        allProgramIds.push(program.id);

        program.campaigns.forEach((campaign) => {
          allCampaignIds.push(campaign.id);
        });
      });
    });

    setCheckedCampaigns(allCampaignIds);
    setCheckedPrograms(allProgramIds);
    setCheckedPartners(allPartnerIds);
    updateDistribution({ programCampaigns: allCampaignIds });
  };

  // Count total selected campaigns
  const selectedCount = checkedCampaigns.length;

  return (
    <div className="space-y-6">
      {/* Distribution Channels */}
      <div className="border rounded-md p-4 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h4 className="font-medium">Distribution Channels</h4>
            <p className="text-sm text-muted-foreground">
              Select the partners, programs, and campaigns through which your
              campaign will be distributed.
            </p>
          </div>
          <div className="flex space-x-2">
            <Badge variant="secondary" className="px-2 py-1 bg-primary/10">
              {selectedCount} selected
            </Badge>
            <Button variant="outline" size="sm" onClick={selectAll}>
              <CheckCircle className="mr-1 h-4 w-4" />
              Select All
            </Button>
          </div>
        </div>

        <div className="space-y-1 mt-3 border rounded-md overflow-hidden">
          {partners.map((partner) => (
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
                      checked={isAllProgramsChecked(partner.programs)}
                      onCheckedChange={(checked) =>
                        handlePartnerChange(partner, !!checked)
                      }
                      className={
                        isSomeProgramsChecked(partner) ? "bg-primary/40" : ""
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
                  {partner.programs.length} programs
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
                              checked={isAllCampaignsChecked(program.campaigns)}
                              onCheckedChange={(checked) =>
                                handleProgramChange(program, !!checked)
                              }
                              className={
                                isSomeCampaignsChecked(program.campaigns)
                                  ? "bg-primary/40"
                                  : ""
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
                          {program.campaigns.length} campaigns
                        </Badge>
                      </div>

                      {/* Campaigns under this program */}
                      {expandedPrograms.includes(program.id) && (
                        <div className="pl-9">
                          {program.campaigns.map((campaign) => (
                            <div
                              key={campaign.id}
                              className="flex items-center p-3 hover:bg-slate-50 border-t"
                            >
                              <div className="mr-2">
                                <Checkbox
                                  id={`campaign-${campaign.id}`}
                                  checked={checkedCampaigns.includes(
                                    campaign.id
                                  )}
                                  onCheckedChange={(checked) =>
                                    handleCampaignChange(campaign.id, !!checked)
                                  }
                                />
                              </div>

                              <div className="flex items-center">
                                <LayoutGrid className="h-4 w-4 mr-2 text-purple-600" />
                                <Label
                                  htmlFor={`campaign-${campaign.id}`}
                                  className="cursor-pointer"
                                >
                                  {campaign.name}
                                </Label>
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

        {checkedCampaigns.length === 0 && (
          <div className="text-xs text-amber-600 mt-2">
            Please select at least one distribution channel for your campaign.
          </div>
        )}
      </div>
    </div>
  );
};

export default DistributionStep;

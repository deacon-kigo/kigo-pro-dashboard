"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Label } from "@/components/atoms/Label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card/Card";
import {
  CampaignDistribution,
  CampaignAd,
} from "@/lib/redux/slices/campaignSlice";
import {
  ChevronDown,
  ChevronRight,
  Building,
  Briefcase,
  LayoutGrid,
  CheckCircle,
  Search,
  GripVertical,
  ArrowUpDown,
  Target,
  Share2,
} from "lucide-react";

interface DistributionStepProps {
  formData: CampaignDistribution;
  updateDistribution: (data: Partial<CampaignDistribution>) => void;
  setStepValidation: (isValid: boolean) => void;
  ads?: CampaignAd[]; // Pass in the created ads for prioritization
}

// Define the hierarchical structure for distribution channels
interface PromotedProgram {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
}

interface Program {
  id: string;
  name: string;
  promotedPrograms: PromotedProgram[];
}

interface Partner {
  id: string;
  name: string;
  programs: Program[];
}

// Ad with priority for drag-and-drop
interface PrioritizedAd extends CampaignAd {
  priority: number;
}

// Reusable Campaign Asset Card Component - matches CampaignCompletionChecklist design
interface CampaignAssetCardProps {
  ad: PrioritizedAd;
  priorityBadge?: React.ReactNode;
  dragHandleProps?: any;
  isDragging?: boolean;
  getOfferText: (offerId: string) => string;
}

const CampaignAssetCard: React.FC<CampaignAssetCardProps> = ({
  ad,
  priorityBadge,
  dragHandleProps,
  isDragging,
  getOfferText,
}) => {
  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 p-2.5 hover:bg-blue-50/30 cursor-pointer transition-colors shadow-sm ${
        isDragging ? "shadow-lg border-blue-300 rotate-1" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        {/* Drag Handle */}
        {dragHandleProps && (
          <div
            {...dragHandleProps}
            className="mr-2 mt-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </div>
        )}

        {/* Priority Badge */}
        {priorityBadge && <div className="mr-2 mt-1">{priorityBadge}</div>}

        {/* Ad Content - matches CampaignCompletionChecklist exactly */}
        <div className="flex-1 min-w-0 mr-3">
          <p className="text-sm font-medium text-slate-900 leading-tight">
            {ad.name || ad.merchantName}
          </p>
          <p className="text-xs text-slate-600 mt-0.5 leading-tight">
            {ad.merchantName} • {getOfferText(ad.offerId)}
          </p>
        </div>

        {/* Stats - matches CampaignCompletionChecklist exactly */}
        <div className="flex-shrink-0 flex items-center space-x-2">
          <div className="text-xs text-slate-500 text-right">
            <div>
              {ad.mediaType.length} type
              {ad.mediaType.length !== 1 ? "s" : ""}
            </div>
            <div>
              {ad.mediaAssets?.length || 0} asset
              {ad.mediaAssets?.length !== 1 ? "s" : ""}
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-slate-400" />
        </div>
      </div>
    </div>
  );
};

const DistributionStep: React.FC<DistributionStepProps> = ({
  formData,
  updateDistribution,
  setStepValidation,
  ads = [],
}) => {
  // Mock distribution partners data - reusing the polished structure from AssignToProgramsPanel
  const [partners] = useState<Partner[]>([
    {
      id: "partner1",
      name: "Augeo",
      programs: [
        {
          id: "prog1",
          name: "LexisNexis",
          promotedPrograms: [
            {
              id: "pp1",
              name: "Legal Research Promotion",
              active: true,
              description: "Professional legal research platform",
            },
            {
              id: "pp2",
              name: "Student Discount Initiative",
              active: true,
              description: "Educational discounts for students",
            },
            {
              id: "pp3",
              name: "Professional Certification",
              active: true,
              description: "Continuing education programs",
            },
          ],
        },
        {
          id: "prog2",
          name: "Fidelity Investments",
          promotedPrograms: [
            {
              id: "pp4",
              name: "Retirement Planning",
              active: true,
              description: "401k and retirement services",
            },
            {
              id: "pp5",
              name: "Wealth Management",
              active: true,
              description: "Investment advisory services",
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
          promotedPrograms: [
            {
              id: "pp6",
              name: "Credit Card Rewards",
              active: true,
              description: "Chase Ultimate Rewards program",
            },
            {
              id: "pp7",
              name: "Business Banking Solutions",
              active: true,
              description: "Small business banking services",
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
          promotedPrograms: [
            {
              id: "pp8",
              name: "Oil Promotion",
              active: true,
              description: "Equipment maintenance oils",
            },
            {
              id: "pp9",
              name: "Parts Discount",
              active: true,
              description: "Genuine John Deere parts",
            },
            {
              id: "pp10",
              name: "Service Special",
              active: true,
              description: "Professional equipment service",
            },
          ],
        },
      ],
    },
  ]);

  // State for distribution selection UI
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPartners, setExpandedPartners] = useState<string[]>([
    "partner1",
    "partner2",
    "partner3",
  ]);
  const [expandedPrograms, setExpandedPrograms] = useState<string[]>([
    "prog1",
    "prog2",
    "prog3",
    "prog4",
  ]);
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>(
    formData.programCampaigns || []
  );

  // State for accordion
  const [isDistributionExpanded, setIsDistributionExpanded] = useState(true);

  // State for ad prioritization
  const [prioritizedAds, setPrioritizedAds] = useState<PrioritizedAd[]>([]);

  // Mock offer text mapping - reusing from CampaignCompletionChecklist pattern
  const getOfferText = (offerId: string): string => {
    const textMap: { [key: string]: string } = {
      mcm_o1_2023: "30% off select vitamins",
      mcm_o2_2023: "Buy 1 Get 1 on cough & cold",
      mcm_o3_2023: "$5 off $25 grocery purchase",
      mcm_o4_2023: "15% off laptops",
      mcm_o5_2023: "$10 off monthly bill",
      mcm_o6_2023: "Free guacamole with entrée",
      mcm_o7_2023: "$10 off $50 purchase",
      mcm_o8_2023: "15% off home decor",
      mcm_o9_2023: "Free shipping on orders $25+",
      mcm_o10_2023: "$50 off new iPhone",
      mcm_o11_2023: "Free drink with food purchase",
    };
    return textMap[offerId] || "Promotion";
  };

  // Initialize prioritized ads when ads prop changes
  useEffect(() => {
    if (ads.length > 0) {
      const adsWithPriority = ads.map((ad, index) => ({
        ...ad,
        priority: index + 1,
      }));
      setPrioritizedAds(adsWithPriority);
    }
  }, [ads]);

  // Filter partners based on search
  const filteredPartners = useMemo(() => {
    if (!searchQuery.trim()) return partners;

    return partners.filter((partner) => {
      const partnerMatch = partner.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const programMatch = partner.programs.some(
        (program) =>
          program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          program.promotedPrograms.some((pp) =>
            pp.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      return partnerMatch || programMatch;
    });
  }, [partners, searchQuery]);

  // This step is optional, so it's always valid
  useEffect(() => {
    setStepValidation(true);
  }, [setStepValidation]);

  // Helper functions for checkbox states
  const isAllPromotedProgramsSelected = (
    promotedPrograms: PromotedProgram[]
  ) => {
    const activePrograms = promotedPrograms.filter((pp) => pp.active !== false);
    return (
      activePrograms.length > 0 &&
      activePrograms.every((pp) => selectedPrograms.includes(pp.id))
    );
  };

  const isSomePromotedProgramsSelected = (
    promotedPrograms: PromotedProgram[]
  ) => {
    const activePrograms = promotedPrograms.filter((pp) => pp.active !== false);
    return (
      activePrograms.some((pp) => selectedPrograms.includes(pp.id)) &&
      !isAllPromotedProgramsSelected(activePrograms)
    );
  };

  const isAllProgramsSelected = (programs: Program[]) => {
    return programs.every((program) =>
      isAllPromotedProgramsSelected(program.promotedPrograms)
    );
  };

  const isSomeProgramsSelected = (partner: Partner) => {
    return (
      partner.programs.some(
        (program) =>
          isSomePromotedProgramsSelected(program.promotedPrograms) ||
          isAllPromotedProgramsSelected(program.promotedPrograms)
      ) && !isAllProgramsSelected(partner.programs)
    );
  };

  // Handle program selection
  const handlePromotedProgramSelection = (
    programId: string,
    checked: boolean
  ) => {
    let newSelected;
    if (checked) {
      newSelected = [...selectedPrograms, programId];
    } else {
      newSelected = selectedPrograms.filter((id) => id !== programId);
    }
    setSelectedPrograms(newSelected);
    updateDistribution({ programCampaigns: newSelected });
  };

  const handleProgramSelection = (program: Program, checked: boolean) => {
    const programIds = program.promotedPrograms
      .filter((pp) => pp.active !== false)
      .map((pp) => pp.id);

    let newSelected;
    if (checked) {
      newSelected = [...new Set([...selectedPrograms, ...programIds])];
    } else {
      newSelected = selectedPrograms.filter((id) => !programIds.includes(id));
    }
    setSelectedPrograms(newSelected);
    updateDistribution({ programCampaigns: newSelected });
  };

  const handlePartnerSelection = (partner: Partner, checked: boolean) => {
    const allProgramIds: string[] = [];
    partner.programs.forEach((program) => {
      program.promotedPrograms
        .filter((pp) => pp.active !== false)
        .forEach((pp) => allProgramIds.push(pp.id));
    });

    let newSelected;
    if (checked) {
      newSelected = [...new Set([...selectedPrograms, ...allProgramIds])];
    } else {
      newSelected = selectedPrograms.filter(
        (id) => !allProgramIds.includes(id)
      );
    }
    setSelectedPrograms(newSelected);
    updateDistribution({ programCampaigns: newSelected });
  };

  // Toggle expansion
  const togglePartner = (partnerId: string) => {
    setExpandedPartners((prev) =>
      prev.includes(partnerId)
        ? prev.filter((id) => id !== partnerId)
        : [...prev, partnerId]
    );
  };

  const toggleProgram = (programId: string) => {
    setExpandedPrograms((prev) =>
      prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId]
    );
  };

  // Select/Clear all functions
  const selectAll = () => {
    const allIds: string[] = [];
    partners.forEach((partner) => {
      partner.programs.forEach((program) => {
        program.promotedPrograms
          .filter((pp) => pp.active !== false)
          .forEach((pp) => allIds.push(pp.id));
      });
    });
    setSelectedPrograms(allIds);
    updateDistribution({ programCampaigns: allIds });
  };

  const clearAll = () => {
    setSelectedPrograms([]);
    updateDistribution({ programCampaigns: [] });
  };

  // Drag and drop handlers for ad prioritization
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(prioritizedAds);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update priorities
    const updatedItems = items.map((item, index) => ({
      ...item,
      priority: index + 1,
    }));

    setPrioritizedAds(updatedItems);

    // Note: Ad priorities are managed locally in this component
    // In a real implementation, this would be stored separately or as part of the campaign ads
  };

  const selectedCount = selectedPrograms.length;

  return (
    <div className="space-y-4">
      {/* Distribution Channels Accordion */}
      <Card className="overflow-hidden border border-slate-200">
        <div
          className="border-b border-slate-200 px-4 py-3 bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors"
          onClick={() => setIsDistributionExpanded(!isDistributionExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Share2 className="h-4 w-4 text-blue-600 mr-2" />
              <h3 className="text-xs font-medium text-blue-800">
                Distribution Channels
              </h3>
              {selectedCount > 0 && (
                <Badge variant="outline" className="text-xs ml-2 bg-white">
                  {selectedCount} selected
                </Badge>
              )}
            </div>
            {isDistributionExpanded ? (
              <ChevronDown className="h-4 w-4 text-blue-600" />
            ) : (
              <ChevronRight className="h-4 w-4 text-blue-600" />
            )}
          </div>
        </div>

        {isDistributionExpanded && (
          <div className="p-4">
            {/* Search */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search partners, programs or promoted programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-8 text-xs"
              />
            </div>

            {/* Header actions */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-gray-500">
                {selectedCount} program{selectedCount !== 1 ? "s" : ""} selected
              </span>
              <div className="flex space-x-2">
                {selectedCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                    className="h-6 text-xs px-2"
                  >
                    Clear All
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectAll}
                  className="h-6 text-xs px-2"
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setExpandedPartners(partners.map((p) => p.id));
                    setExpandedPrograms(
                      partners.flatMap((p) => p.programs.map((pr) => pr.id))
                    );
                  }}
                  className="h-6 text-xs px-2"
                >
                  <ChevronDown className="mr-1 h-3 w-3" />
                  Expand All
                </Button>
              </div>
            </div>

            {/* Partners list */}
            <div className="max-h-80 overflow-y-auto border rounded">
              {filteredPartners.map((partner) => (
                <div
                  key={partner.id}
                  className="border-b border-gray-100 last:border-b-0"
                >
                  {/* Partner header */}
                  <div
                    className="flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer"
                    onClick={() => togglePartner(partner.id)}
                  >
                    <div className="flex items-center flex-1">
                      <div
                        className="mr-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          id={`partner-${partner.id}`}
                          checked={isAllProgramsSelected(partner.programs)}
                          onCheckedChange={(checked) =>
                            handlePartnerSelection(partner, !!checked)
                          }
                          className={
                            isSomeProgramsSelected(partner)
                              ? "bg-primary/40 data-[state=checked]:bg-primary"
                              : ""
                          }
                        />
                      </div>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2 text-blue-600" />
                        <Label
                          htmlFor={`partner-${partner.id}`}
                          className="font-medium cursor-pointer text-xs"
                        >
                          {partner.name}
                        </Label>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="text-xs mr-2">
                        {partner.programs.length} program
                        {partner.programs.length !== 1 ? "s" : ""}
                      </Badge>
                      {expandedPartners.includes(partner.id) ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Programs under this partner */}
                  {expandedPartners.includes(partner.id) && (
                    <div className="pl-6 border-t border-gray-50">
                      {partner.programs.map((program) => (
                        <div
                          key={program.id}
                          className="border-b border-gray-50 last:border-b-0"
                        >
                          {/* Program header */}
                          <div
                            className="flex items-center justify-between p-3 hover:bg-slate-50 cursor-pointer"
                            onClick={() => toggleProgram(program.id)}
                          >
                            <div className="flex items-center flex-1">
                              <div
                                className="mr-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Checkbox
                                  id={`program-${program.id}`}
                                  checked={isAllPromotedProgramsSelected(
                                    program.promotedPrograms
                                  )}
                                  onCheckedChange={(checked) =>
                                    handleProgramSelection(program, !!checked)
                                  }
                                  className={
                                    isSomePromotedProgramsSelected(
                                      program.promotedPrograms
                                    )
                                      ? "bg-primary/40 data-[state=checked]:bg-primary"
                                      : ""
                                  }
                                />
                              </div>
                              <div className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-2 text-green-600" />
                                <Label
                                  htmlFor={`program-${program.id}`}
                                  className="font-medium cursor-pointer text-xs"
                                >
                                  {program.name}
                                </Label>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Badge variant="outline" className="text-xs mr-2">
                                {program.promotedPrograms.length} promoted
                                program
                                {program.promotedPrograms.length !== 1
                                  ? "s"
                                  : ""}
                              </Badge>
                              {expandedPrograms.includes(program.id) ? (
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                          </div>

                          {/* Promoted Programs under this program */}
                          {expandedPrograms.includes(program.id) && (
                            <div className="pl-6 bg-slate-25">
                              {program.promotedPrograms.map(
                                (promotedProgram) => (
                                  <div
                                    key={promotedProgram.id}
                                    className={`flex items-center p-3 hover:bg-slate-50 border-t border-gray-50 ${
                                      promotedProgram.active === false
                                        ? "opacity-60"
                                        : ""
                                    }`}
                                  >
                                    <div
                                      className="mr-2"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Checkbox
                                        id={`promoted-program-${promotedProgram.id}`}
                                        checked={selectedPrograms.includes(
                                          promotedProgram.id
                                        )}
                                        disabled={
                                          promotedProgram.active === false
                                        }
                                        onCheckedChange={(checked) =>
                                          handlePromotedProgramSelection(
                                            promotedProgram.id,
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
                                            htmlFor={`promoted-program-${promotedProgram.id}`}
                                            className={`block font-medium text-xs ${
                                              promotedProgram.active === false
                                                ? "cursor-default"
                                                : "cursor-pointer"
                                            }`}
                                          >
                                            {promotedProgram.name}
                                          </Label>
                                          {promotedProgram.description && (
                                            <p className="text-xs text-gray-500 mt-0.5">
                                              {promotedProgram.description}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Ad Prioritization - Main Focus */}
      {ads.length > 0 && (
        <Card className="overflow-hidden border border-slate-200">
          <div className="border-b border-slate-200 px-4 py-3 bg-green-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="h-4 w-4 text-green-600 mr-2" />
                <h3 className="text-xs font-medium text-green-800">
                  Ad Prioritization
                </h3>
              </div>
              <Badge variant="outline" className="text-xs">
                {ads.length} ad{ads.length !== 1 ? "s" : ""} to prioritize
              </Badge>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-3">
              <div className="flex items-center text-xs text-gray-600 mb-2">
                <ArrowUpDown className="h-3 w-3 mr-1" />
                Drag and drop to reorder ad priority for distribution
              </div>
              <p className="text-xs text-gray-500">
                Ads at the top will be served first when multiple ads are
                available for distribution.
              </p>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="ads">
                {(provided, snapshot) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={`space-y-2 ${snapshot.isDraggingOver ? "bg-blue-50" : ""} transition-colors rounded p-2`}
                  >
                    {prioritizedAds.map((ad, index) => (
                      <Draggable key={ad.id} draggableId={ad.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            <CampaignAssetCard
                              ad={ad}
                              priorityBadge={
                                <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                                  {ad.priority}
                                </div>
                              }
                              dragHandleProps={provided.dragHandleProps}
                              isDragging={snapshot.isDragging}
                              getOfferText={getOfferText}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DistributionStep;

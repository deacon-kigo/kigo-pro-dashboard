"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/atoms/Button";
import { Badge } from "@/components/atoms/Badge";
import { Label } from "@/components/atoms/Label";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
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
import { AccordionContent } from "@/components/ui/accordion";

// Define the hierarchical structure based on Kigo Pro glossary
interface PromotedProgram {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
  currentFilters?: string[];
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
        promotedPrograms: [
          {
            id: "pp1",
            name: "Legal Research Promotion",
            description:
              "Promotional offers for legal research tools and services",
            active: true,
            currentFilters: ["filter-123"],
          },
          {
            id: "pp2",
            name: "Student Discount Initiative",
            description: "Special discounts for law students",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp3",
            name: "Professional Certification",
            description: "Offers for legal certification programs",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp4",
            name: "Law Firm Solutions",
            description: "Special services for law practices",
            active: false,
            currentFilters: [],
          },
        ],
      },
      {
        id: "prog2",
        name: "Fidelity Investments",
        promotedPrograms: [
          {
            id: "pp5",
            name: "Retirement Planning",
            description: "Offers related to retirement planning services",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp6",
            name: "Wealth Management",
            description: "Premium offers for wealth management clients",
            active: true,
            currentFilters: ["filter-456"],
          },
          {
            id: "pp7",
            name: "Investment Advisory",
            description: "Personalized investment consultation services",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp8",
            name: "Financial Education",
            description: "Educational resources for financial literacy",
            active: true,
            currentFilters: [],
          },
        ],
      },
      {
        id: "prog3",
        name: "American Express",
        promotedPrograms: [
          {
            id: "pp9",
            name: "Premium Card Offers",
            description: "Exclusive offers for premium cardholders",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp10",
            name: "Travel Promotions",
            description: "Special travel deals for members",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp11",
            name: "Dining Rewards",
            description: "Exclusive dining experiences and rewards",
            active: true,
            currentFilters: [],
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
        id: "prog4",
        name: "Chase",
        promotedPrograms: [
          {
            id: "pp12",
            name: "Credit Card Rewards",
            description: "Exclusive offers for Chase credit card holders",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp13",
            name: "Business Banking Solutions",
            description: "Promotions for small business banking customers",
            active: false,
            currentFilters: [],
          },
          {
            id: "pp14",
            name: "Home Lending",
            description: "Special offers for mortgage and home equity",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp15",
            name: "Auto Finance",
            description: "Promotions for auto loans and leasing",
            active: true,
            currentFilters: [],
          },
        ],
      },
      {
        id: "prog5",
        name: "Bank of America",
        promotedPrograms: [
          {
            id: "pp16",
            name: "Preferred Rewards",
            description: "Special offers for preferred banking customers",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp17",
            name: "Cash Rewards Cards",
            description: "Promotions for cash rewards credit cards",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp18",
            name: "Travel Rewards",
            description: "Travel benefits for premium customers",
            active: true,
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
        id: "prog6",
        name: "Dealer Network",
        promotedPrograms: [
          {
            id: "pp19",
            name: "Oil Promotion",
            description: "Special offers on oil changes and maintenance",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp20",
            name: "Parts Discount",
            description: "Discounts on genuine John Deere parts",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp21",
            name: "Service Special",
            description: "Seasonal service specials for equipment maintenance",
            active: true,
            currentFilters: ["filter-789"],
          },
          {
            id: "pp22",
            name: "New Equipment Financing",
            description: "Special financing offers on new equipment",
            active: true,
            currentFilters: [],
          },
        ],
      },
      {
        id: "prog7",
        name: "Agricultural Solutions",
        promotedPrograms: [
          {
            id: "pp23",
            name: "Crop Management",
            description: "Tools and services for better crop yield",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp24",
            name: "Precision Technology",
            description: "Advanced tech solutions for farming",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp25",
            name: "Farm Equipment",
            description: "Essential equipment for modern farming",
            active: true,
            currentFilters: [],
          },
        ],
      },
    ],
  },
  {
    id: "partner4",
    name: "Mastercard",
    programs: [
      {
        id: "prog8",
        name: "Global Benefits",
        promotedPrograms: [
          {
            id: "pp26",
            name: "Travel Insurance",
            description: "Comprehensive travel protection services",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp27",
            name: "Shopping Protection",
            description: "Extended warranties and purchase protection",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp28",
            name: "Identity Theft Protection",
            description: "Services to protect against identity theft",
            active: true,
            currentFilters: [],
          },
        ],
      },
      {
        id: "prog9",
        name: "World Elite",
        promotedPrograms: [
          {
            id: "pp29",
            name: "Airport Lounge Access",
            description: "Exclusive access to VIP airport lounges",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp30",
            name: "Concierge Services",
            description: "Premium 24/7 concierge assistance",
            active: true,
            currentFilters: [],
          },
          {
            id: "pp31",
            name: "Luxury Hotel Collection",
            description: "Exclusive hotel offers and upgrades",
            active: true,
            currentFilters: [],
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
  promotedProgramIds: string[]
) => {
  console.log(
    "Assigning filter",
    filterId,
    "to promoted programs:",
    promotedProgramIds
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
  onSelectionChange?: (count: number) => void;
}

// Helper function to generate mock partner data dynamically
const generateMockPartners = (count = 10, currentFilterId = "") => {
  const partners = [...mockPartners]; // Start with existing partners

  // Company name prefixes for variety
  const companyPrefixes = [
    "Global",
    "Advanced",
    "United",
    "Premier",
    "Elite",
    "Strategic",
    "Innovative",
    "Dynamic",
    "Omni",
    "Peak",
  ];
  // Company name suffixes for variety
  const companySuffixes = [
    "Partners",
    "Solutions",
    "Technologies",
    "Enterprises",
    "Services",
    "Industries",
    "Networks",
    "Systems",
    "Ventures",
    "Brands",
  ];
  // Program types for variety
  const programTypes = [
    "Rewards",
    "Loyalty",
    "Premium",
    "Discount",
    "Membership",
    "VIP",
    "Affiliate",
    "Referral",
    "Benefits",
    "Partnership",
  ];
  // Promotion types for variety
  const promotionTypes = [
    "Offer",
    "Deal",
    "Bundle",
    "Package",
    "Savings",
    "Exclusive",
    "Limited Time",
    "Seasonal",
    "Special",
    "Featured",
  ];

  // Generate additional partners
  for (let i = 4; i < count + 4; i++) {
    const partnerId = `partner${i}`;
    const partnerName = `${companyPrefixes[i % 10]} ${companySuffixes[i % 10]}`;

    // Generate 2-4 programs per partner
    const programCount = 2 + Math.floor(Math.random() * 3);
    const programs: Program[] = [];

    for (let j = 0; j < programCount; j++) {
      const programId = `prog${i * 10 + j}`;
      const programName = `${programTypes[j % 10]} Program ${j + 1}`;

      // Generate 3-8 promoted programs per program
      const promotedProgramCount = 3 + Math.floor(Math.random() * 6);
      const promotedPrograms: PromotedProgram[] = [];

      for (let k = 0; k < promotedProgramCount; k++) {
        const promotedProgramId = `pp${i * 100 + j * 10 + k}`;
        const promotedProgramName = `${promotionTypes[k % 10]} ${k + 1}`;

        promotedPrograms.push({
          id: promotedProgramId,
          name: promotedProgramName,
          description: `${partnerName} ${programName} promotion details for ${promotedProgramName}`,
          active: Math.random() > 0.1, // 90% chance of being active
          currentFilters: Math.random() > 0.8 ? [currentFilterId] : [], // 20% chance of having the current filter
        });
      }

      programs.push({
        id: programId,
        name: programName,
        promotedPrograms,
      });
    }

    partners.push({
      id: partnerId,
      name: partnerName,
      programs,
    });
  }

  return partners;
};

export function AssignToProgramsPanel({
  filterId,
  filterName,
  onClose,
  onSelectionChange,
}: AssignToProgramsPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPromotedPrograms, setSelectedPromotedPrograms] = useState<
    Record<string, boolean>
  >({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [recentlySelectedIds, setRecentlySelectedIds] = useState<string[]>([]);

  // Keep track of expanded items
  const [expandedPartners, setExpandedPartners] = useState<string[]>([]);
  const [expandedPrograms, setExpandedPrograms] = useState<string[]>([]);

  // Add a state to detect if we're embedded in the product filter creation form
  const [isEmbedded, setIsEmbedded] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  // State for infinite scrolling
  const [visiblePartners, setVisiblePartners] = useState<Partner[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track when sections are expanded for better scroll management
  const [isExpanding, setIsExpanding] = useState(false);

  // Generate extended mock data
  const allPartners = useRef(generateMockPartners(30, filterId));

  // Filter partners, programs and promoted programs by search query
  const getFilteredPartners = useCallback(() => {
    if (!searchQuery.trim()) return allPartners.current;

    const query = searchQuery.toLowerCase();

    return allPartners.current
      .map((partner) => {
        // Filter programs in this partner
        const filteredPrograms = partner.programs
          .map((program) => {
            // Filter promoted programs in this program
            const filteredPromotedPrograms = program.promotedPrograms.filter(
              (promotedProgram) =>
                promotedProgram.name.toLowerCase().includes(query) ||
                (promotedProgram.description &&
                  promotedProgram.description.toLowerCase().includes(query))
            );

            if (filteredPromotedPrograms.length === 0) return null;

            return {
              ...program,
              promotedPrograms: filteredPromotedPrograms,
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
  }, [searchQuery]);

  // Check if the component is embedded in the product filter creation form
  useEffect(() => {
    if (componentRef.current) {
      // If the onClose function is empty and we're inside an AccordionContent, we're embedded
      if (
        onClose.toString().includes("{}") &&
        componentRef.current.closest('[data-state="open"]')
      ) {
        setIsEmbedded(true);
      }
    }
  }, [onClose]);

  // Initialize selected promoted programs when the panel opens
  useEffect(() => {
    const initialSelected: Record<string, boolean> = {};

    mockPartners.forEach((partner) => {
      partner.programs.forEach((program) => {
        program.promotedPrograms.forEach((promotedProgram) => {
          if (promotedProgram.currentFilters?.includes(filterId)) {
            initialSelected[promotedProgram.id] = true;
          }
        });
      });
    });

    setSelectedPromotedPrograms(initialSelected);
    setSaveSuccess(false);
    setSaveError(null);
  }, [filterId]);

  // Toggle expansion of a partner
  const togglePartner = (partnerId: string) => {
    setIsExpanding(true);
    setExpandedPartners((prev) => {
      const newExpandedPartners = prev.includes(partnerId)
        ? prev.filter((id) => id !== partnerId)
        : [...prev, partnerId];

      // Reset expanding state after a short delay to allow DOM to update
      setTimeout(() => setIsExpanding(false), 150);
      return newExpandedPartners;
    });
  };

  // Toggle expansion of a program
  const toggleProgram = (programId: string) => {
    setIsExpanding(true);
    setExpandedPrograms((prev) => {
      const newExpandedPrograms = prev.includes(programId)
        ? prev.filter((id) => id !== programId)
        : [...prev, programId];

      // Reset expanding state after a short delay to allow DOM to update
      setTimeout(() => setIsExpanding(false), 150);
      return newExpandedPrograms;
    });
  };

  // Check if all promoted programs in a program are selected
  const isAllPromotedProgramsSelected = (
    promotedPrograms: PromotedProgram[]
  ) => {
    return promotedPrograms
      .filter((promotedProgram) => promotedProgram.active !== false)
      .every((promotedProgram) => selectedPromotedPrograms[promotedProgram.id]);
  };

  // Check if some promoted programs in a program are selected
  const isSomePromotedProgramsSelected = (
    promotedPrograms: PromotedProgram[]
  ) => {
    const activePromotedPrograms = promotedPrograms.filter(
      (promotedProgram) => promotedProgram.active !== false
    );
    return (
      activePromotedPrograms.some(
        (promotedProgram) => selectedPromotedPrograms[promotedProgram.id]
      ) && !isAllPromotedProgramsSelected(activePromotedPrograms)
    );
  };

  // Check if all programs in a partner are selected
  const isAllProgramsSelected = (programs: Program[]) => {
    return programs.every((program) =>
      isAllPromotedProgramsSelected(program.promotedPrograms)
    );
  };

  // Check if some programs in a partner are selected
  const isSomeProgramsSelected = (partner: Partner) => {
    return (
      partner.programs.some(
        (program) =>
          isSomePromotedProgramsSelected(program.promotedPrograms) ||
          isAllPromotedProgramsSelected(program.promotedPrograms)
      ) && !isAllProgramsSelected(partner.programs)
    );
  };

  // Handle promoted program selection with visual feedback
  const handlePromotedProgramSelection = (
    promotedProgramId: string,
    checked: boolean
  ) => {
    setSelectedPromotedPrograms((prev) => ({
      ...prev,
      [promotedProgramId]: checked,
    }));

    // Add visual feedback by tracking recently selected items
    setRecentlySelectedIds((prev) => [...prev, promotedProgramId]);
    setTimeout(() => {
      setRecentlySelectedIds((prev) =>
        prev.filter((id) => id !== promotedProgramId)
      );
    }, 1000);
  };

  // Handle program selection (select/deselect all promoted programs in program)
  const handleProgramSelection = (program: Program, checked: boolean) => {
    const updatedSelection = { ...selectedPromotedPrograms };

    // Update all active promoted programs in this program
    program.promotedPrograms
      .filter((promotedProgram) => promotedProgram.active !== false)
      .forEach((promotedProgram) => {
        updatedSelection[promotedProgram.id] = checked;
      });

    setSelectedPromotedPrograms(updatedSelection);
  };

  // Handle partner selection (select/deselect all promoted programs in all programs)
  const handlePartnerSelection = (partner: Partner, checked: boolean) => {
    const updatedSelection = { ...selectedPromotedPrograms };

    // Update all active promoted programs in all programs of this partner
    partner.programs.forEach((program) => {
      program.promotedPrograms
        .filter((promotedProgram) => promotedProgram.active !== false)
        .forEach((promotedProgram) => {
          updatedSelection[promotedProgram.id] = checked;
        });
    });

    setSelectedPromotedPrograms(updatedSelection);
  };

  // Handle infinite scroll
  const loadMorePartners = useCallback(() => {
    if (loading || !hasMore || isExpanding) return;

    setLoading(true);

    // Simulate API fetch delay
    setTimeout(() => {
      const filteredPartnersData = getFilteredPartners();
      const itemsPerPage = 10;
      const startIndex = 0;
      const endIndex = page * itemsPerPage;
      const newVisiblePartners = filteredPartnersData.slice(
        startIndex,
        endIndex
      );

      setVisiblePartners(newVisiblePartners);
      setHasMore(endIndex < filteredPartnersData.length);
      setPage((prevPage) => prevPage + 1);
      setLoading(false);
    }, 200); // Shorter delay for better responsiveness
  }, [page, loading, hasMore, getFilteredPartners, isExpanding]);

  // Detect when user scrolls to bottom to load more
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isExpanding) return;

    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;

    // Load more when scrolling near the bottom
    if (scrollTop + clientHeight >= scrollHeight - 250 && hasMore && !loading) {
      loadMorePartners();
    }
  }, [loadMorePartners, hasMore, loading, isExpanding]);

  // Initialize first set of partners and set up scroll listener
  useEffect(() => {
    loadMorePartners();

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [loadMorePartners, handleScroll]);

  // Reset pagination when search query changes
  useEffect(() => {
    setPage(1);
    setHasMore(true);

    const filteredPartnersData = getFilteredPartners();
    const newVisiblePartners = filteredPartnersData.slice(0, 10);

    setVisiblePartners(newVisiblePartners);
    setHasMore(newVisiblePartners.length < filteredPartnersData.length);
  }, [searchQuery, getFilteredPartners]);

  // Get count of selected promoted programs
  const selectedCount = Object.values(selectedPromotedPrograms).filter(
    Boolean
  ).length;

  // Notify parent component when selection count changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedCount);
    }
  }, [selectedCount, onSelectionChange]);

  // Select all promoted programs
  const selectAll = () => {
    const allSelected: Record<string, boolean> = {};
    mockPartners.forEach((partner) => {
      partner.programs.forEach((program) => {
        program.promotedPrograms
          .filter((promotedProgram) => promotedProgram.active !== false)
          .forEach((promotedProgram) => {
            allSelected[promotedProgram.id] = true;
          });
      });
    });
    setSelectedPromotedPrograms(allSelected);
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedPromotedPrograms({});
  };

  // Handle save with improved feedback
  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveSuccess(false);
      setSaveError(null);

      // Get list of selected promoted program IDs
      const selectedPromotedProgramIds = Object.keys(
        selectedPromotedPrograms
      ).filter((id) => selectedPromotedPrograms[id]);

      // Get promoted program names for feedback message
      const selectedPromotedProgramDetails = selectedPromotedProgramIds.map(
        (id) => {
          let promotedProgramName = "";
          let programName = "";
          let partnerName = "";

          mockPartners.forEach((partner) => {
            partner.programs.forEach((program) => {
              program.promotedPrograms.forEach((promotedProgram) => {
                if (promotedProgram.id === id) {
                  promotedProgramName = promotedProgram.name;
                  programName = program.name;
                  partnerName = partner.name;
                }
              });
            });
          });

          return { id, promotedProgramName, programName, partnerName };
        }
      );

      // Call API to save assignments
      const result = await saveFilterAssignments(
        filterId,
        selectedPromotedProgramIds
      );

      if (result.success) {
        setSaveSuccess(true);

        // Store details for success message
        const successDetails = {
          count: selectedPromotedProgramIds.length,
          promotedPrograms: selectedPromotedProgramDetails,
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
  const getSelectionFeedbackClass = (promotedProgramId: string) => {
    return recentlySelectedIds.includes(promotedProgramId)
      ? "bg-blue-50 transition-colors duration-500"
      : "";
  };

  return (
    <div className="flex flex-col h-full" ref={componentRef}>
      <div className="flex-1 flex flex-col">
        {/* Search input */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder="Search partners, programs or promoted programs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Selected count and buttons */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-500">
            {selectedCount} promoted program{selectedCount !== 1 ? "s" : ""}{" "}
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

        {/* Scrollable program list area - with fixed height for modal */}
        <div
          className="flex-1 overflow-y-auto pr-2 h-[500px] max-h-[60vh] relative"
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={{ willChange: "scroll-position" }}
        >
          {/* Partner/Program list container */}
          <div className="space-y-1">
            {visiblePartners.map((partner) => (
              <div key={partner.id} className="mb-1 border rounded-md">
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
                    <div className="mr-2" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        id={`partner-${partner.id}`}
                        checked={isAllProgramsSelected(partner.programs)}
                        onCheckedChange={(checked) => {
                          handlePartnerSelection(partner, !!checked);
                        }}
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
                            <div
                              className="mr-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Checkbox
                                id={`program-${program.id}`}
                                checked={isAllPromotedProgramsSelected(
                                  program.promotedPrograms
                                )}
                                onCheckedChange={(checked) => {
                                  handleProgramSelection(program, !!checked);
                                }}
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
                                className="font-medium cursor-pointer"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {program.name}
                              </Label>
                            </div>
                          </div>

                          <Badge variant="outline" className="text-xs">
                            {program.promotedPrograms.length} promoted program
                            {program.promotedPrograms.length !== 1 ? "s" : ""}
                          </Badge>
                        </div>

                        {/* Promoted Programs under this program */}
                        {expandedPrograms.includes(program.id) && (
                          <div className="pl-9">
                            {program.promotedPrograms.map((promotedProgram) => (
                              <div
                                key={promotedProgram.id}
                                className={`flex items-center p-3 hover:bg-slate-50 border-t ${
                                  promotedProgram.active === false
                                    ? "opacity-60"
                                    : ""
                                } ${getSelectionFeedbackClass(promotedProgram.id)}`}
                              >
                                <div
                                  className="mr-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Checkbox
                                    id={`promoted-program-${promotedProgram.id}`}
                                    checked={
                                      !!selectedPromotedPrograms[
                                        promotedProgram.id
                                      ]
                                    }
                                    disabled={promotedProgram.active === false}
                                    onCheckedChange={(checked) => {
                                      handlePromotedProgramSelection(
                                        promotedProgram.id,
                                        !!checked
                                      );
                                    }}
                                  />
                                </div>

                                <div className="flex flex-1 items-center justify-between">
                                  <div className="flex items-center">
                                    <LayoutGrid className="h-4 w-4 mr-2 text-purple-600" />
                                    <div>
                                      <Label
                                        htmlFor={`promoted-program-${promotedProgram.id}`}
                                        className={`block font-medium text-sm ${
                                          promotedProgram.active === false
                                            ? "cursor-not-allowed"
                                            : "cursor-pointer"
                                        }`}
                                      >
                                        {promotedProgram.name}
                                      </Label>
                                      {promotedProgram.description && (
                                        <p className="text-xs text-gray-500">
                                          {promotedProgram.description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {promotedProgram.active === false && (
                                      <Badge
                                        variant="outline"
                                        className="bg-gray-100"
                                      >
                                        Inactive
                                      </Badge>
                                    )}
                                    {promotedProgram.currentFilters?.includes(
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

            {/* Loading indicator */}
            {loading && (
              <div className="py-4 text-center flex items-center justify-center">
                <div
                  className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"
                  role="status"
                ></div>
                <p className="text-sm text-muted-foreground ml-2">
                  Loading more...
                </p>
              </div>
            )}

            {/* End of list message */}
            {!hasMore && visiblePartners.length > 0 && (
              <div className="py-3 text-center text-sm text-muted-foreground border border-t rounded-md mt-1">
                ✓ All partners loaded
              </div>
            )}
          </div>

          {visiblePartners.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              No matching partners, programs or promoted programs found.
            </div>
          )}
        </div>

        {/* Feedback and actions */}
        <div className="mt-4 pt-4 border-t">
          {/* Save error message */}
          {saveError && (
            <div className="mb-4 p-2 bg-red-50 text-red-600 rounded-md flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">{saveError}</span>
            </div>
          )}

          {/* Save success message */}
          {saveSuccess && (
            <div className="mb-4 p-2 bg-green-50 text-green-600 rounded-md flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              <span className="text-sm">
                {selectedCount > 0
                  ? `Successfully assigned to ${selectedCount} promoted programs`
                  : "All assignments were cleared successfully"}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            {!isEmbedded && (
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={saving}
              className="relative"
              aria-disabled={saving}
            >
              {saving ? (
                <div className="flex items-center">
                  <span className="animate-spin mr-2">
                    <svg
                      className="h-4 w-4"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                  Saving...
                </div>
              ) : (
                <span>Save Assignments</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

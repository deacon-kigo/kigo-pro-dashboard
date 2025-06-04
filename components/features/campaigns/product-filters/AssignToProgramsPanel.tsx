"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
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
  XCircle,
  Clock,
  Loader2,
  AlertTriangle,
  X,
} from "lucide-react";
import { AccordionContent } from "@/components/ui/accordion";
import { AssignmentItem } from "./BulkAssignmentProgress";

// Redux imports
import { selectSelectedProgramIds } from "@/lib/redux/selectors/programSelectionSelectors";
import {
  selectProgram,
  deselectProgram,
  selectMultiplePrograms,
  deselectMultiplePrograms,
  clearAllSelections,
} from "@/lib/redux/slices/programSelectionSlice";

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
export const mockPartners: Partner[] = [
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
  onClose: (selectedIds?: string[]) => void;
  onSelectionChange?: (count: number) => void;
  onStartAssignment?: (items: AssignmentItem[]) => void;
  initialSelection?: string[];
  partnerData?: Partner[];
  statusMode?: boolean;
  assignmentItems?: AssignmentItem[];
  onRetryFailed?: () => void;
}

// Helper function to generate mock partner data dynamically
const generateMockPartners = (count = 50, currentFilterId = "") => {
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
    "Universal",
    "Apex",
    "Precision",
    "Excelsior",
    "Pinnacle",
    "Superior",
    "Capital",
    "First",
    "National",
    "Modern",
    "Digital",
    "Pacific",
    "Atlantic",
    "Northern",
    "Southern",
    "Eastern",
    "Western",
    "Central",
    "Metro",
    "Urban",
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
    "Group",
    "Financial",
    "Alliance",
    "Associates",
    "Corporation",
    "Holdings",
    "Investments",
    "International",
    "Cooperative",
    "Exchange",
    "Media",
    "Logistics",
    "Healthcare",
    "Education",
    "Retail",
    "Banking",
    "Insurance",
    "Consulting",
    "Energy",
    "Transportation",
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
    "Platinum",
    "Gold",
    "Silver",
    "Bronze",
    "Elite",
    "Executive",
    "Business",
    "Consumer",
    "Student",
    "Senior",
    "Family",
    "Lifestyle",
    "Travel",
    "Dining",
    "Shopping",
    "Entertainment",
    "Wellness",
    "Education",
    "Technology",
    "Professional",
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
    "Premium",
    "Discount",
    "Bonus",
    "Reward",
    "Gift",
    "Trial",
    "Subscription",
    "Membership",
    "Cashback",
    "Points",
    "Holiday",
    "Summer",
    "Winter",
    "Spring",
    "Fall",
    "Weekend",
    "Weekday",
    "Flash",
    "Clearance",
    "New Customer",
  ];

  // Additional industry keywords for more realistic searches
  const industryKeywords = [
    "Financial",
    "Travel",
    "Retail",
    "Food",
    "Dining",
    "Automotive",
    "Technology",
    "Health",
    "Wellness",
    "Fashion",
    "Home",
    "Garden",
    "Sports",
    "Fitness",
    "Entertainment",
    "Education",
    "Professional",
    "Legal",
    "Medical",
    "Insurance",
    "Banking",
    "Investment",
    "Telecom",
    "Utilities",
    "Real Estate",
    "Construction",
    "Manufacturing",
    "Hospitality",
    "Transportation",
    "Logistics",
  ];

  // Generate additional partners
  for (let i = 4; i < count + 4; i++) {
    const partnerId = `partner${i}`;

    // Create more varied partner names
    const useIndustry = Math.random() > 0.7;
    const industryKeyword = useIndustry
      ? ` ${industryKeywords[i % industryKeywords.length]}`
      : "";
    const partnerName = `${companyPrefixes[i % companyPrefixes.length]}${industryKeyword} ${companySuffixes[i % companySuffixes.length]}`;

    // Generate 2-5 programs per partner for more variety
    const programCount = 2 + Math.floor(Math.random() * 4);
    const programs: Program[] = [];

    for (let j = 0; j < programCount; j++) {
      const programId = `prog${i * 10 + j}`;
      const programIndex = (i * 3 + j) % programTypes.length;
      const programName = `${programTypes[programIndex]} Program ${j + 1}`;

      // Generate 3-10 promoted programs per program for more test data
      const promotedProgramCount = 3 + Math.floor(Math.random() * 8);
      const promotedPrograms: PromotedProgram[] = [];

      for (let k = 0; k < promotedProgramCount; k++) {
        const promotedProgramId = `pp${i * 100 + j * 10 + k}`;
        const promotionIndex = (i + j + k) % promotionTypes.length;

        // Add industry keyword to some program names for better search testing
        const useIndustryInPromo = Math.random() > 0.8;
        const industryInPromo = useIndustryInPromo
          ? ` ${industryKeywords[(i + k) % industryKeywords.length]}`
          : "";

        const promotedProgramName = `${promotionTypes[promotionIndex]}${industryInPromo} ${k + 1}`;

        // Create more detailed descriptions for better search matching
        const description = `${partnerName} ${programName} promotion: ${promotedProgramName} - ${
          Math.random() > 0.5
            ? `Special offers for ${industryKeywords[(i + j + k) % industryKeywords.length].toLowerCase()} customers`
            : `Exclusive ${promotionTypes[promotionIndex].toLowerCase()} deals and savings`
        }`;

        promotedPrograms.push({
          id: promotedProgramId,
          name: promotedProgramName,
          description: description,
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
  onStartAssignment,
  initialSelection = [],
  partnerData = [],
  statusMode = false,
  assignmentItems = [],
  onRetryFailed,
}: AssignToProgramsPanelProps) {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  // Use Redux for selected programs instead of local state
  const selectedPromotedPrograms = useSelector(selectSelectedProgramIds);
  const selectedPromotedProgramsRecord = useMemo(() => {
    const record: Record<string, boolean> = {};
    selectedPromotedPrograms.forEach((id) => {
      record[id] = true;
    });
    return record;
  }, [selectedPromotedPrograms]);

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [recentlySelectedIds, setRecentlySelectedIds] = useState<string[]>([]);

  // Generate extended mock data
  const allPartners = useMemo(() => {
    if (partnerData.length > 0) {
      return partnerData;
    } else {
      // Generate more mock partners to ensure we have a good selection
      return generateMockPartners(75, filterId);
    }
  }, [partnerData, filterId]);

  // Keep track of expanded items (auto-expand the first few partners by default)
  const [expandedPartners, setExpandedPartners] = useState<string[]>(() => {
    // Expand the first 6 partners by default for better visibility
    return [
      "partner1",
      "partner2",
      "partner3",
      "partner4",
      "partner5",
      "partner6",
    ];
  });
  const [expandedPrograms, setExpandedPrograms] = useState<string[]>(() => {
    // Expand the first program of each default expanded partner
    return ["prog1", "prog4", "prog6", "prog8", "prog50", "prog60"];
  });

  // Add a state to detect if we're embedded in the product filter creation form
  const [isEmbedded, setIsEmbedded] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  // State for infinite scrolling
  const [visiblePartners, setVisiblePartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track when sections are expanded for better scroll management
  const [isExpanding, setIsExpanding] = useState(false);

  // Filter partners, programs and promoted programs by search query
  const getFilteredPartners = useCallback(() => {
    if (!searchQuery.trim()) return allPartners;

    const query = searchQuery.toLowerCase();

    return allPartners
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
  }, [searchQuery, allPartners]);

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
      .every(
        (promotedProgram) => selectedPromotedProgramsRecord[promotedProgram.id]
      );
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
        (promotedProgram) => selectedPromotedProgramsRecord[promotedProgram.id]
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

  // Handle promoted program selection using Redux
  const handlePromotedProgramSelection = (
    promotedProgramId: string,
    checked: boolean
  ) => {
    if (checked) {
      dispatch(
        selectProgram({
          programId: promotedProgramId,
          context: "program_selection_panel",
        })
      );
    } else {
      dispatch(
        deselectProgram({
          programId: promotedProgramId,
          context: "program_selection_panel",
        })
      );
    }

    // Add visual feedback by tracking recently selected items
    setRecentlySelectedIds((prev) => [...prev, promotedProgramId]);
    setTimeout(() => {
      setRecentlySelectedIds((prev) =>
        prev.filter((id) => id !== promotedProgramId)
      );
    }, 1000);

    // Update parent component count (if still needed)
    if (onSelectionChange) {
      const newCount = checked
        ? selectedPromotedPrograms.length + 1
        : selectedPromotedPrograms.length - 1;
      onSelectionChange(newCount);
    }
  };

  // Handle program selection (select/deselect all promoted programs in program) using Redux
  const handleProgramSelection = (program: Program, checked: boolean) => {
    const programIds = program.promotedPrograms
      .filter((promotedProgram) => promotedProgram.active !== false)
      .map((promotedProgram) => promotedProgram.id);

    if (checked) {
      dispatch(
        selectMultiplePrograms({
          programIds,
          context: "bulk_program_selection",
        })
      );
    } else {
      dispatch(
        deselectMultiplePrograms({
          programIds,
          context: "bulk_program_deselection",
        })
      );
    }
  };

  // Handle partner selection (select/deselect all promoted programs in all programs) using Redux
  const handlePartnerSelection = (partner: Partner, checked: boolean) => {
    const programIds: string[] = [];

    // Collect all active promoted programs in all programs of this partner
    partner.programs.forEach((program) => {
      program.promotedPrograms
        .filter((promotedProgram) => promotedProgram.active !== false)
        .forEach((promotedProgram) => {
          programIds.push(promotedProgram.id);
        });
    });

    if (checked) {
      dispatch(
        selectMultiplePrograms({
          programIds,
          context: "bulk_partner_selection",
        })
      );
    } else {
      dispatch(
        deselectMultiplePrograms({
          programIds,
          context: "bulk_partner_deselection",
        })
      );
    }
  };

  // Handle infinite scroll
  const loadMorePartners = useCallback(() => {
    if (loading || isExpanding) return;

    setLoading(true);

    // Get all filtered partners immediately instead of paginating
    const filteredPartnersData = getFilteredPartners();
    setVisiblePartners(filteredPartnersData);
    setHasMore(false); // No more items to load
    setLoading(false);
  }, [loading, getFilteredPartners, isExpanding]);

  // Detect when user scrolls to bottom to load more
  const handleScroll = useCallback(() => {
    // We're now loading everything at once, so this can be simplified
    // Just keeping the function for compatibility
  }, []);

  // Reset when search query changes
  useEffect(() => {
    // Load all filtered partners when search changes
    const filteredPartnersData = getFilteredPartners();
    setVisiblePartners(filteredPartnersData);
    setHasMore(false);

    // Auto-expand all matching partners and their programs when searching
    if (searchQuery.trim()) {
      const partnerIdsToExpand: string[] = [];
      const programIdsToExpand: string[] = [];

      filteredPartnersData.forEach((partner) => {
        partnerIdsToExpand.push(partner.id);

        partner.programs.forEach((program) => {
          programIdsToExpand.push(program.id);
        });
      });

      setExpandedPartners(partnerIdsToExpand);
      setExpandedPrograms(programIdsToExpand);
    }
  }, [searchQuery, getFilteredPartners]);

  // Ensure initial load shows more data
  useEffect(() => {
    // Immediately load all data
    loadMorePartners();

    // For better UX, expand all partners when there are search results
    if (searchQuery.trim()) {
      const filteredPartnersData = getFilteredPartners();
      const partnerIdsToExpand = filteredPartnersData.map(
        (partner) => partner.id
      );
      const programIdsToExpand: string[] = [];

      filteredPartnersData.forEach((partner) => {
        partner.programs.forEach((program) => {
          programIdsToExpand.push(program.id);
        });
      });

      setExpandedPartners(partnerIdsToExpand);
      setExpandedPrograms(programIdsToExpand);
    }

    // Still keep scroll listener for future enhancements
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [loadMorePartners, handleScroll, searchQuery, getFilteredPartners]);

  // Add a computed selectedCount property based on selected programs
  const selectedCount = useMemo(() => {
    return Object.keys(selectedPromotedPrograms).filter(
      (id) => selectedPromotedPrograms[id]
    ).length;
  }, [selectedPromotedPrograms]);

  // Update the useEffect to use this value
  useEffect(() => {
    // Call onSelectionChange if provided
    if (onSelectionChange) {
      onSelectionChange(selectedCount);
    }
  }, [selectedCount, onSelectionChange]);

  // Update select all to use Redux
  const selectAll = () => {
    const allIds: string[] = [];
    allPartners.forEach((partner) => {
      partner.programs.forEach((program) => {
        program.promotedPrograms
          .filter((pp) => pp.active !== false)
          .forEach((pp) => {
            allIds.push(pp.id);
          });
      });
    });

    dispatch(
      selectMultiplePrograms({
        programIds: allIds,
        context: "select_all",
      })
    );
  };

  // Update clear all to use Redux
  const clearAll = () => {
    dispatch(clearAllSelections({ context: "clear_all" }));
  };

  // Update save function to use Redux state
  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);

    // Use Redux selected programs
    const selectedIds = selectedPromotedPrograms;

    if (selectedIds.length === 0) {
      setSaveError("No items selected for assignment");
      setSaving(false);
      return;
    }

    try {
      // Prepare assignment items with hierarchical information
      const preparedItems: AssignmentItem[] = [];

      allPartners.forEach((partner) => {
        partner.programs.forEach((program) => {
          program.promotedPrograms.forEach((promotedProgram) => {
            if (selectedIds.includes(promotedProgram.id)) {
              preparedItems.push({
                id: promotedProgram.id,
                name: promotedProgram.name,
                type: "promotedProgram",
                parentName: `${partner.name} > ${program.name}`,
                status: "pending",
              });
            }
          });
        });
      });

      // Notify parent to start assignment process and show status indicator
      if (onStartAssignment) {
        console.log(
          "📤 AssignToProgramsPanel calling onStartAssignment with:",
          preparedItems
        );
        onStartAssignment(preparedItems);
      }

      // Close the panel immediately
      onClose(selectedIds);
    } catch (error) {
      console.error("Failed to prepare assignment:", error);
      setSaveError("Failed to prepare assignment");
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

  // Update cancel function to use Redux state
  const handleCancel = () => {
    // Get the selected IDs from Redux to pass back
    onClose(selectedPromotedPrograms);
  };

  // Status icon component (from card-status-list)
  const StatusIcon = ({ status }: { status: AssignmentItem["status"] }) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      case "processing":
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  // Get status for a promoted program in status mode
  const getPromotedProgramStatus = (
    promotedProgramId: string
  ): AssignmentItem["status"] => {
    if (!statusMode) return "pending";
    const item = assignmentItems.find((item) => item.id === promotedProgramId);
    return item?.status || "pending";
  };

  // Check if we should show this promoted program in status mode
  const shouldShowInStatusMode = (promotedProgramId: string) => {
    if (!statusMode) return true;
    return assignmentItems.some((item) => item.id === promotedProgramId);
  };

  // Filter partners for status mode - only show those with assignment items
  const getDisplayPartners = useCallback(() => {
    const basePartners = getFilteredPartners();

    if (!statusMode) return basePartners;

    // In status mode, only show partners that have promoted programs being assigned
    return basePartners
      .map((partner) => ({
        ...partner,
        programs: partner.programs
          .map((program) => ({
            ...program,
            promotedPrograms: program.promotedPrograms.filter((pp) =>
              shouldShowInStatusMode(pp.id)
            ),
          }))
          .filter((program) => program.promotedPrograms.length > 0),
      }))
      .filter((partner) => partner.programs.length > 0);
  }, [getFilteredPartners, statusMode, assignmentItems]);

  // Calculate progress stats for status mode
  const getProgressStats = () => {
    if (!statusMode) return null;

    const total = assignmentItems.length;
    const completed = assignmentItems.filter(
      (item) => item.status === "success" || item.status === "failed"
    ).length;
    const successful = assignmentItems.filter(
      (item) => item.status === "success"
    ).length;
    const failed = assignmentItems.filter(
      (item) => item.status === "failed"
    ).length;
    const processing = assignmentItems.filter(
      (item) => item.status === "processing"
    ).length;

    return { total, completed, successful, failed, processing };
  };

  // Modified to use getDisplayPartners instead of visiblePartners for status mode
  useEffect(() => {
    if (statusMode) {
      // In status mode, expand all by default
      const displayPartners = getDisplayPartners();
      const partnerIds = displayPartners.map((p) => p.id);
      const programIds: string[] = [];

      displayPartners.forEach((partner) => {
        partner.programs.forEach((program) => {
          programIds.push(program.id);
        });
      });

      setExpandedPartners(partnerIds);
      setExpandedPrograms(programIds);
    } else {
      // Normal selection mode
      loadMorePartners();
    }
  }, [statusMode, getDisplayPartners, loadMorePartners]);

  const progressStats = getProgressStats();
  const displayPartners = statusMode ? getDisplayPartners() : visiblePartners;

  // Initialize Redux state with initial selection
  useEffect(() => {
    if (initialSelection.length > 0) {
      dispatch(
        selectMultiplePrograms({
          programIds: initialSelection,
          context: "initial_load",
        })
      );
    }
  }, [initialSelection, dispatch]);

  return (
    <div
      className="flex flex-col h-full max-h-[600px] overflow-hidden"
      ref={componentRef}
    >
      <div className="flex flex-col h-full">
        {/* Search input - hide in status mode */}
        {!statusMode && (
          <div className="relative mb-4 flex-shrink-0">
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
        )}

        {/* Header info */}
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          {statusMode ? (
            // Status mode header
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">
                Assignment Progress
              </h3>
              <div className="text-sm text-gray-600">
                Assigning filter "{filterName}" to {progressStats?.total || 0}{" "}
                items
              </div>
              {progressStats && (
                <div className="flex gap-4 mt-2 text-sm">
                  <span className="text-green-600">
                    ✓ {progressStats.successful} completed
                  </span>
                  {progressStats.failed > 0 && (
                    <span className="text-red-600">
                      ✗ {progressStats.failed} failed
                    </span>
                  )}
                  {progressStats.processing > 0 && (
                    <span className="text-blue-600">
                      ⟳ {progressStats.processing} processing
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            // Selection mode header
            <>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const allPartnerIds = allPartners.map((p) => p.id);
                    const allProgramIds: string[] = [];
                    allPartners.forEach((partner) => {
                      partner.programs.forEach((program) => {
                        allProgramIds.push(program.id);
                      });
                    });
                    setExpandedPartners(allPartnerIds);
                    setExpandedPrograms(allProgramIds);
                  }}
                >
                  <ChevronDown className="mr-1 h-4 w-4" />
                  Expand All
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Scrollable program list area - with fixed height to ensure buttons stay at bottom */}
        <div
          className="flex-1 overflow-y-auto pr-2 min-h-0"
          ref={scrollContainerRef}
          onScroll={handleScroll}
          style={{ willChange: "scroll-position" }}
        >
          {/* Partner/Program list container */}
          <div className="space-y-1">
            {displayPartners.map((partner) => (
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
                    {!statusMode && (
                      <div
                        className="mr-2"
                        onClick={(e) => e.stopPropagation()}
                      >
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
                    )}

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
                            {!statusMode && (
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
                            )}

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
                                {statusMode ? (
                                  // Status mode - show status icon
                                  <div className="mr-2">
                                    <StatusIcon
                                      status={getPromotedProgramStatus(
                                        promotedProgram.id
                                      )}
                                    />
                                  </div>
                                ) : (
                                  // Selection mode - show checkbox
                                  <div
                                    className="mr-2"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Checkbox
                                      id={`promoted-program-${promotedProgram.id}`}
                                      checked={
                                        !!selectedPromotedProgramsRecord[
                                          promotedProgram.id
                                        ]
                                      }
                                      disabled={
                                        promotedProgram.active === false
                                      }
                                      onCheckedChange={(checked) => {
                                        handlePromotedProgramSelection(
                                          promotedProgram.id,
                                          !!checked
                                        );
                                      }}
                                    />
                                  </div>
                                )}

                                <div className="flex flex-1 items-center justify-between">
                                  <div className="flex items-center">
                                    <LayoutGrid className="h-4 w-4 mr-2 text-purple-600" />
                                    <div>
                                      <Label
                                        htmlFor={`promoted-program-${promotedProgram.id}`}
                                        className={`block font-medium text-sm ${
                                          promotedProgram.active === false ||
                                          statusMode
                                            ? "cursor-default"
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
                                    {statusMode && (
                                      <Badge
                                        variant="outline"
                                        className={`text-xs ${
                                          getPromotedProgramStatus(
                                            promotedProgram.id
                                          ) === "success"
                                            ? "bg-green-50 text-green-700 border-green-200"
                                            : getPromotedProgramStatus(
                                                  promotedProgram.id
                                                ) === "failed"
                                              ? "bg-red-50 text-red-700 border-red-200"
                                              : getPromotedProgramStatus(
                                                    promotedProgram.id
                                                  ) === "processing"
                                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                                : "bg-gray-50 text-gray-600 border-gray-200"
                                        }`}
                                      >
                                        {getPromotedProgramStatus(
                                          promotedProgram.id
                                        ) === "success" && "Completed"}
                                        {getPromotedProgramStatus(
                                          promotedProgram.id
                                        ) === "failed" && "Failed"}
                                        {getPromotedProgramStatus(
                                          promotedProgram.id
                                        ) === "processing" && "Processing"}
                                        {getPromotedProgramStatus(
                                          promotedProgram.id
                                        ) === "pending" && "Pending"}
                                      </Badge>
                                    )}
                                    {!statusMode &&
                                      promotedProgram.active === false && (
                                        <Badge
                                          variant="outline"
                                          className="bg-gray-100"
                                        >
                                          Inactive
                                        </Badge>
                                      )}
                                    {!statusMode &&
                                      promotedProgram.currentFilters?.includes(
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
            {!hasMore && displayPartners.length > 0 && (
              <div className="py-3 text-center text-sm text-muted-foreground border border-t rounded-md mt-1">
                ✓ All partners loaded
              </div>
            )}
          </div>

          {displayPartners.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              No matching partners, programs or promoted programs found.
            </div>
          )}
        </div>

        {/* Feedback and actions */}
        <div className="mt-4 pt-4 border-t flex-shrink-0">
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
                Assignment started for {selectedCount} promoted programs
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 mt-auto">
            {statusMode ? (
              // Status mode actions
              <>
                {progressStats && progressStats.failed > 0 && onRetryFailed && (
                  <Button variant="outline" onClick={onRetryFailed}>
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    Retry Failed
                  </Button>
                )}
                <Button variant="outline" onClick={() => onClose()}>
                  <X className="mr-1 h-4 w-4" />
                  Close
                </Button>
              </>
            ) : (
              // Selection mode actions
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={
                    saving ||
                    Object.keys(selectedPromotedPrograms).filter(
                      (id) => selectedPromotedPrograms[id]
                    ).length === 0
                  }
                >
                  {saving ? "Starting Assignment..." : "Start Assignment"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

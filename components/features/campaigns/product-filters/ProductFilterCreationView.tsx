"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import Card from "@/components/atoms/Card/Card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import {
  ArrowLeftIcon,
  PlusIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  FunnelIcon,
  PencilIcon,
  UsersIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/Select";
import { Calendar } from "@/components/atoms/Calendar";
import { PageHeader } from "@/components/molecules/PageHeader";
import { addDays } from "date-fns";
import { AIAssistantPanel } from "@/components/features/ai";
import { useDispatch, useSelector } from "react-redux";
import { setProductFilterContext } from "@/lib/redux/slices/ai-assistantSlice";
import { Badge } from "@/components/atoms/Badge";
import { Tooltip } from "@/components/atoms/Tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { RootState } from "@/lib/redux/store";
import {
  setFilterName,
  setDescription,
  addCriteria as addCriteriaAction,
  removeCriteria as removeCriteriaAction,
  setCriteria,
  setIsGenerating,
  setLastGeneratedFilter,
  applyFilterUpdate,
  FilterCriteria,
  setCoverageStats,
  resetFilter,
} from "@/lib/redux/slices/productFilterSlice";
import {
  selectFilterName,
  selectDescription,
  selectQueryViewName,
  selectCriteria,
  selectIsGenerating,
  selectLastGeneratedFilter,
  selectHasAllRequiredCriteria,
  selectIsFormValid,
  selectCoverageStats,
} from "@/lib/redux/selectors/productFilterSelectors";
import { getFieldPlaceholder } from "@/services/ai/tools";
import { generateFilterCoverageStats } from "@/services/ai/filterHandler";
import FilterCoveragePanel from "./FilterCoveragePanel";
import { AssignToProgramsPanel, mockPartners } from "./AssignToProgramsPanel";
import { AssignmentManager, useAssignmentStatus } from "./AssignmentManager";
import { AssignmentItem } from "./BulkAssignmentProgress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/molecules/alert-dialog/AlertDialog";
import { ShinyBorder } from "@/components/ui/shiny-border";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  ChevronRight,
  FilterX,
  PencilLine,
  Plus,
  X,
} from "lucide-react";
import {
  ArrowPathIcon,
  PlusCircleIcon,
  ChatBubbleLeftRightIcon,
  BoltIcon,
  BookOpenIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import { SelectedProgramsDisplay } from "./SelectedProgramsDisplay";
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox";
import { ReactSelectMulti } from "@/components/ui/react-select-multi";
import { selectCompleteFilterContext } from "@/lib/redux/selectors/productFilterSelectors";
import {
  selectSelectedProgramIds,
  selectTotalSelectedCount,
  selectCollapsedState,
} from "@/lib/redux/selectors/programSelectionSelectors";
import {
  selectAssignmentItems,
  selectIsAssignmentProcessing,
} from "@/lib/redux/selectors/assignmentSelectors";
import {
  setSelectedPrograms,
  setCollapsedState,
} from "@/lib/redux/slices/programSelectionSlice";
import {
  startAssignment,
  updateAssignmentItemStatus,
} from "@/lib/redux/slices/assignmentSlice";

// Add mock implementations
// Mock Switch component
const Switch = (props: any) => {
  return (
    <div
      {...props}
      className="inline-block w-10 h-6 bg-gray-200 rounded-full transition-colors"
    />
  );
};

// Mock useToast implementation
const useToast = () => {
  return {
    toast: ({
      title,
      description,
      variant,
    }: {
      title: string;
      description: string;
      variant?: string;
    }) => {
      console.log(`Toast: ${title} - ${description} (${variant || "default"})`);
      alert(`${title}: ${description}`);
    },
  };
};

// Mock filterService implementation
const filterService = {
  saveFilter: async (filterData: any) => {
    console.log("Filter saved:", filterData);
    return { success: true, id: "mock-id" };
  },
  updateFilter: async (filterId: string, filterData: any) => {
    console.log("Filter updated:", { ...filterData, id: filterId });
    return { success: true, id: filterId };
  },
  createFilter: async (filterData: any) => {
    console.log("Filter created:", filterData);
    return { success: true, id: "mock-id" };
  },
  getFilter: async (filterId: string) => {
    return {
      id: filterId,
      name: "Mock Filter",
      description: "Mock Description",
      criteria: [],
    };
  },
};

export interface ProductFilterCreationViewProps {
  filterId?: string;
  mode?: "create" | "view" | "edit";
}

export default function ProductFilterCreationView({
  filterId,
  mode = "create",
}: ProductFilterCreationViewProps) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();

  // Redux selectors for filter state
  const filterName = useSelector(selectFilterName);
  const description = useSelector(selectDescription);
  const queryViewName = useSelector(selectQueryViewName);
  const filterCriteria = useSelector(selectCriteria);
  const lastGeneratedFilter = useSelector(selectLastGeneratedFilter);
  const isReduxFormValid = useSelector(selectIsFormValid);
  const hasRequiredCriteria = useSelector(selectHasAllRequiredCriteria);

  // Redux selectors for program selection and assignment
  const selectedPrograms = useSelector(selectSelectedProgramIds);
  const selectedProgramCount = useSelector(selectTotalSelectedCount);
  const selectedProgramsCollapsed = useSelector(selectCollapsedState);
  const assignmentItems = useSelector(selectAssignmentItems);
  const isAssignmentProcessing = useSelector(selectIsAssignmentProcessing);

  console.log("🎮 ProductFilterCreationView Redux state:", {
    selectedPrograms,
    selectedProgramCount,
    assignmentItems: assignmentItems.length,
    isAssignmentProcessing,
  });

  // State variables
  const [isViewMode, setIsViewMode] = useState(mode === "view");
  const [isEditMode, setIsEditMode] = useState(mode === "edit");
  const [activeTab, setActiveTab] = useState("build");
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [showBackConfirmation, setShowBackConfirmation] = useState(false);
  const [criteriaType, setCriteriaType] = useState<string>("MerchantKeyword");
  const [criteriaValue, setCriteriaValue] = useState<string>("");
  const [criteriaRule, setCriteriaRule] = useState<string>("contains");
  const [criteriaInclusion, setCriteriaInclusion] = useState<string>("Include");
  const [criteriaAndOr, setCriteriaAndOr] = useState<string>("and");
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [isAssignProgramsModalOpen, setIsAssignProgramsModalOpen] =
    useState(false);
  const [isCreateLaunchModalOpen, setIsCreateLaunchModalOpen] = useState(false);
  const [isPublishFlow, setIsPublishFlow] = useState(false);
  const [isSubmitInProgress, setIsSubmitInProgress] = useState(false);
  const [isPredefinedOpen, setIsPredefinedOpen] = useState(false);
  const [selectingSuggestion, setSelectingSuggestion] = useState(false);
  const [debugModeEnabled, setDebugModeEnabled] = useState(false);

  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [backDialogOpen, setBackDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [tempFilterId] = useState(() => {
    return (
      Date.now().toString() + "-" + Math.random().toString(36).substring(2, 9)
    );
  });

  // Added derived variable for clarity
  const isCreateMode = mode === "create";

  const allFieldTypes = [
    "MerchantKeyword",
    "MerchantName",
    "OfferCommodity",
    "OfferKeyword",
    "Client",
    "MerchantId",
    "OfferCategory",
    "OfferExpiry",
    "OfferId",
    "OfferRedemptionControlLimit",
    "OfferRedemptionType",
    "OfferType",
  ];

  const isFormValid = () => isReduxFormValid;

  const isBasicInfoComplete =
    filterName.trim() !== "" && description.trim() !== "";

  const isCriteriaComplete = filterCriteria.length > 0;

  const [criteriaMultiValues, setCriteriaMultiValues] = useState<string[]>([]);

  const offerTypeOptions = [
    { label: "Amount (Dollars off)", value: "Amount" },
    { label: "Buy one get one free", value: "BOGO" },
    { label: "Click (online offer)", value: "Click" },
    { label: "Free with purchase", value: "Free" },
    { label: "Percent (percent off)", value: "Percent" },
    { label: "Special (Price point)", value: "Special" },
  ];

  const addCriteria = () => {
    // Validation
    if (!criteriaType) {
      setValidationMessage(
        "Please select a field type for your filter condition"
      );
      setTimeout(() => setValidationMessage(null), 5000);
      return;
    }

    if (criteriaType === "OfferType" && criteriaMultiValues.length === 0) {
      setValidationMessage(
        "Please select at least one offer type for your filter condition"
      );
      setTimeout(() => setValidationMessage(null), 5000);
      return;
    }

    if (criteriaType !== "OfferType" && !criteriaValue) {
      setValidationMessage("Please enter a value for your filter condition");
      setTimeout(() => setValidationMessage(null), 5000);
      return;
    }

    // If validation passes, add criteria
    const isRequired = criteriaInclusion === "Include";
    const defaultRule = "contains";

    if (criteriaType === "OfferType" && criteriaMultiValues.length > 0) {
      criteriaMultiValues.forEach((value, index) => {
        dispatch(
          addCriteriaAction({
            type: criteriaType,
            value: value,
            rule: defaultRule,
            and_or: index === 0 ? criteriaAndOr : "OR", // First one uses the selected AND/OR, rest use OR
            isRequired,
          })
        );
      });

      // Reset form
      setCriteriaType("");
      setCriteriaMultiValues([]);
      setCriteriaAndOr("OR");
      setCriteriaInclusion("Include");
    } else if (criteriaType !== "OfferType" && criteriaValue) {
      dispatch(
        addCriteriaAction({
          type: criteriaType,
          value: criteriaValue,
          rule: defaultRule,
          and_or: criteriaAndOr,
          isRequired,
        })
      );

      // Reset form
      setCriteriaType("");
      setCriteriaValue("");
      setCriteriaAndOr("OR");
      setCriteriaInclusion("Include");
    }
  };

  const removeCriteria = (id: string) => {
    dispatch(removeCriteriaAction(id));
  };

  const handleCreateFilterClick = () => {
    const isBasicInfoValid =
      filterName.trim() !== "" && description.trim() !== "";

    const hasFilterConditions = filterCriteria.length > 0;

    if (!isBasicInfoValid) {
      setValidationMessage(
        "Please fill in the required filter name and description fields"
      );
      setTimeout(() => setValidationMessage(null), 5000);
      return;
    }

    if (!hasFilterConditions) {
      setValidationMessage("Please add at least one filter condition");
      setTimeout(() => setValidationMessage(null), 5000);
      return;
    }

    setCreateDialogOpen(true);
  };

  const handleConfirmedCreateFilter = () => {
    // Close the dialog
    setCreateDialogOpen(false);

    // Show success message
    setSuccessMessage("Product filter created successfully!");

    // Clear the success message after 3 seconds and redirect
    setTimeout(() => {
      setSuccessMessage(null);
      router.push("/campaigns/product-filters");
    }, 3000);
  };

  const handleBackClick = () => {
    if (filterName.trim() || description.trim() || filterCriteria.length > 0) {
      setBackDialogOpen(true);
    } else {
      router.push("/campaigns/product-filters");
    }
  };

  const handleConfirmedNavigateBack = () => {
    dispatch(resetFilter());
    router.push("/campaigns/product-filters");
  };

  const nextTab = () => {
    if (activeTab === "details" && isFormValid()) {
      setActiveTab("criteria");
    }
  };

  const prevTab = () => {
    if (activeTab === "criteria") {
      setActiveTab("details");
    }
  };

  useEffect(() => {
    dispatch(
      setProductFilterContext({
        filterName,
        filterDescription: description,
        currentCriteria: filterCriteria,
      })
    );
  }, [dispatch, filterName, description, filterCriteria]);

  useEffect(() => {
    if (filterId && (isEditMode || isViewMode)) {
      // In a real implementation, this would fetch data from an API
      // For now, use mocked data or get from Redux/other state

      // Find filter in the mock data
      const filters = [
        {
          id: "1",
          name: "Pizza Edition",
          description: "All pizza-related offers for the summer campaign",
          criteria: [
            {
              type: "MerchantKeyword",
              value: "pizza",
              rule: "contains",
              and_or: "OR",
              isRequired: true,
            },
            {
              type: "OfferKeyword",
              value: "discount",
              rule: "contains",
              and_or: "OR",
              isRequired: true,
            },
          ],
        },
        {
          id: "2",
          name: "Coffee & Treats",
          description: "Coffee and bakery offers for morning promotions",
          criteria: [
            {
              type: "MerchantKeyword",
              value: "coffee",
              rule: "contains",
              and_or: "OR",
              isRequired: true,
            },
            {
              type: "OfferCategory",
              value: "bakery",
              rule: "contains",
              and_or: "OR",
              isRequired: true,
            },
          ],
        },
      ];

      const filter = filters.find((f) => f.id === filterId);

      if (filter) {
        dispatch(setFilterName(filter.name));
        dispatch(setDescription(filter.description));

        dispatch(setCriteria([]));

        if (filter.criteria) {
          filter.criteria.forEach((criteria) => {
            dispatch(
              addCriteriaAction({
                type: criteria.type,
                value: criteria.value,
                rule: criteria.rule,
                and_or: criteria.and_or,
                isRequired: criteria.isRequired,
              })
            );
          });
        }
      }
    }
  }, [filterId, isEditMode, isViewMode, dispatch]);

  const handleOptionSelected = (optionId: string) => {
    console.log("Option selected:", optionId);

    if (optionId.startsWith("apply_updates:")) {
      dispatch(setIsGenerating(true));

      try {
        const updatesJson = optionId.replace("apply_updates:", "");
        const updates = JSON.parse(updatesJson);

        console.log("Parsed updates:", updates);

        dispatch(
          applyFilterUpdate({
            filterName: updates.filterName,
            criteriaToAdd: updates.criteriaToAdd,
          })
        );

        dispatch(setLastGeneratedFilter("complete"));

        setTimeout(() => {
          dispatch(setIsGenerating(false));
        }, 800);
      } catch (error) {
        console.error("Error applying updates:", error);
        dispatch(setIsGenerating(false));
      }
    } else if (optionId.startsWith("suggest_name:")) {
      dispatch(setIsGenerating(true));
      const suggestedName = optionId.replace("suggest_name:", "");
      setTimeout(() => {
        dispatch(setFilterName(suggestedName));
        dispatch(setLastGeneratedFilter("name"));
        dispatch(setIsGenerating(false));
      }, 800);
    } else if (optionId.startsWith("suggest_criteria:")) {
      try {
        dispatch(setIsGenerating(true));
        const criteriaData = JSON.parse(
          optionId.replace("suggest_criteria:", "")
        );
        if (criteriaData.type && criteriaData.value) {
          setTimeout(() => {
            const rule = criteriaData.rule || "contains";
            const andOr = criteriaData.and_or || "OR";
            setCriteriaType(criteriaData.type);
            setCriteriaValue(criteriaData.value);
            setCriteriaAndOr(andOr);

            const inclusion = criteriaData.inclusion || "Include";
            const isRequired = inclusion === "Include";

            dispatch(
              addCriteriaAction({
                type: criteriaData.type,
                value: criteriaData.value,
                rule,
                and_or: andOr,
                isRequired,
              })
            );

            setCriteriaType("");
            setCriteriaValue("");
            setCriteriaAndOr("OR");
            setCriteriaInclusion("Include");
            dispatch(setLastGeneratedFilter("criteria"));
            dispatch(setIsGenerating(false));
          }, 1000);
        }
      } catch (e) {
        console.error("Failed to parse criteria suggestion", e);
        dispatch(setIsGenerating(false));
      }
    } else if (optionId.startsWith("suggest_multiple_criteria:")) {
      try {
        dispatch(setIsGenerating(true));
        const criteriaList = JSON.parse(
          optionId.replace("suggest_multiple_criteria:", "")
        );
        if (Array.isArray(criteriaList) && criteriaList.length > 0) {
          setTimeout(() => {
            const newCriteriaItems = criteriaList.map((criteriaItem) => {
              const inclusion = criteriaItem.inclusion || "Include";
              const isRequired = inclusion === "Include";

              return {
                type: criteriaItem.type || "UnknownType",
                value: criteriaItem.value || "",
                rule: criteriaItem.rule || "contains",
                and_or: criteriaItem.and_or || "OR",
                isRequired,
              };
            });

            newCriteriaItems.forEach((criteria) => {
              dispatch(addCriteriaAction(criteria));
            });

            setCriteriaType("");
            setCriteriaValue("");
            setCriteriaAndOr("OR");
            setCriteriaInclusion("Include");
            dispatch(setLastGeneratedFilter("multiple"));
            dispatch(setIsGenerating(false));
          }, 1200);
        }
      } catch (e) {
        console.error("Failed to parse multiple criteria suggestions", e);
        dispatch(setIsGenerating(false));
      }
    } else if (optionId.startsWith("suggest_complete_filter:")) {
      try {
        dispatch(setIsGenerating(true));
        interface CompleteFilterData {
          name?: string;
          description?: string;
          criteria?: Array<Partial<FilterCriteria> & { inclusion?: string }>;
        }
        const filterData: CompleteFilterData = JSON.parse(
          optionId.replace("suggest_complete_filter:", "")
        );
        setTimeout(() => {
          const update: any = {};

          if (filterData.name) update.filterName = filterData.name;
          if (filterData.description)
            update.description = filterData.description;

          if (
            Array.isArray(filterData.criteria) &&
            filterData.criteria.length > 0
          ) {
            const criteriaToAdd = filterData.criteria.map((criteriaItem) => {
              const inclusion = criteriaItem.inclusion || "Include";
              const isRequired = inclusion === "Include";

              return {
                type: criteriaItem.type || "UnknownType",
                value: criteriaItem.value || "",
                rule: criteriaItem.rule || "contains",
                and_or: criteriaItem.and_or || "OR",
                isRequired,
              };
            });

            update.criteriaToAdd = criteriaToAdd;
          }

          dispatch(applyFilterUpdate(update));
          dispatch(setLastGeneratedFilter("complete"));
          dispatch(setIsGenerating(false));
        }, 1500);
      } catch (e) {
        console.error("Failed to parse complete filter suggestion", e);
        dispatch(setIsGenerating(false));
      }
    }
  };

  const friendlyTypeNames: Record<string, string> = {
    MerchantKeyword: "Merchant Keyword",
    MerchantName: "Merchant Name",
    OfferCommodity: "Offer Commodity",
    OfferKeyword: "Offer Keyword",
    Client: "Client",
    MerchantId: "Merchant ID",
    OfferCategory: "Offer Category",
    OfferExpiry: "Offer Expiry Date",
    OfferId: "Offer ID",
    OfferRedemptionControlLimit: "Redemption Limit",
    OfferRedemptionType: "Redemption Type",
    OfferType: "Offer Type",
  };

  const friendlyRuleNames: Record<string, string> = {
    equals: "is exactly",
    contains: "contains",
    startsWith: "starts with",
    endsWith: "ends with",
    greaterThan: "is greater than",
    lessThan: "is less than",
  };

  const coverageStats = useSelector(selectCoverageStats);

  const prevCriteriaLengthRef = useRef(filterCriteria.length);

  useEffect(() => {
    if (
      filterCriteria.length > 0 &&
      (prevCriteriaLengthRef.current !== filterCriteria.length ||
        !coverageStats?.totalOffers)
    ) {
      prevCriteriaLengthRef.current = filterCriteria.length;

      const stats = generateFilterCoverageStats(filterCriteria);
      dispatch(setCoverageStats(stats));
    }
  }, [filterCriteria, dispatch, coverageStats?.totalOffers]);

  const handleSuggestionApply = (suggestionValue: string) => {
    const [type, action, target] = suggestionValue.split(":");

    if (type !== "coverage") return;

    switch (action) {
      case "reduce":
        const criteriaToRemove = filterCriteria
          .filter((c) => c.type === target)
          .slice(0, 1);

        if (criteriaToRemove.length > 0) {
          dispatch(removeCriteriaAction(criteriaToRemove[0].id));

          dispatch(setLastGeneratedFilter("criteria"));
        }
        break;

      case "relax":
        const criteriaIndex = filterCriteria.findIndex((c) => c.id === target);

        if (criteriaIndex >= 0) {
          const criteria = { ...filterCriteria[criteriaIndex] };
          criteria.rule = "contains";

          const updatedCriteria = [...filterCriteria];
          updatedCriteria[criteriaIndex] = criteria;

          dispatch({
            type: "productFilter/setCriteria",
            payload: updatedCriteria,
          });

          dispatch(setLastGeneratedFilter("criteria"));
        }
        break;

      default:
        alert(
          "To improve coverage, try using broader keywords or selecting 'contains' instead of 'equals' for keyword matches."
        );
        break;
    }
  };

  const handleSaveAsDraft = () => {
    if (!filterName.trim()) {
      setValidationMessage("Please provide a filter name to save as draft");
      setTimeout(() => setValidationMessage(null), 5000);
      return;
    }

    setSuccessMessage("Filter saved as draft successfully!");

    setTimeout(() => {
      setSuccessMessage(null);
      router.push("/campaigns/product-filters");
    }, 3000);
  };

  const getPageTitle = () => {
    if (isViewMode) return "View Product Filter";
    if (isEditMode) return "Edit Product Filter";
    return "Create New Product Filter";
  };

  const backButton = (
    <Button
      variant="outline"
      onClick={handleBackClick}
      className="flex items-center gap-1"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      Back to Filters
    </Button>
  );

  const renderFormActions = () => {
    if (isViewMode) {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() =>
              router.push(`/campaigns/product-filters/${filterId}/edit`)
            }
            size="sm"
          >
            Edit Filter
          </Button>
          <Button
            variant="primary"
            onClick={() => router.push("/campaigns/product-filters")}
            size="sm"
          >
            Back to Filters
          </Button>
        </div>
      );
    }

    if (isEditMode) {
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={handleSaveAsDraft}
            disabled={!filterName.trim()}
            size="sm"
          >
            Save Changes
          </Button>
          <Button
            onClick={handleCreateFilterClick}
            disabled={
              !filterName.trim() ||
              !description.trim() ||
              filterCriteria.length === 0
            }
            size="sm"
          >
            Update Filter
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={handleSaveAsDraft}
          disabled={!filterName.trim()}
          size="sm"
        >
          Save as Draft
        </Button>
        <Button
          onClick={handleCreateFilterClick}
          disabled={
            !filterName.trim() ||
            !description.trim() ||
            filterCriteria.length === 0
          }
          size="sm"
        >
          Create Filter
        </Button>
      </div>
    );
  };

  useEffect(() => {
    if (!isAssignProgramsModalOpen && selectedProgramCount > 0) {
      console.log(`Programs selected: ${selectedProgramCount}`);
    }
  }, [isAssignProgramsModalOpen, selectedProgramCount]);

  const handleAssignProgramsModalClose = (selectedIds: string[] = []) => {
    setIsAssignProgramsModalOpen(false);

    // If we received selected IDs from the modal, update Redux state
    if (selectedIds.length > 0) {
      dispatch(
        setSelectedPrograms({
          programIds: selectedIds,
          context: "modal_selection",
        })
      );
    }
  };

  // Toggle Redux collapsed state
  const toggleSelectedProgramsCollapsed = () => {
    dispatch(setCollapsedState(!selectedProgramsCollapsed));
  };

  // Redux startAssignment function
  const handleStartAssignment = async (items: any[]) => {
    console.log("🚀 Redux: Starting assignment with items:", items);

    dispatch(
      startAssignment({
        filterId: tempFilterId,
        filterName: filterName || "Untitled Filter",
        items: items,
      })
    );
  };

  // Mock assignment progression for demo purposes
  useEffect(() => {
    if (assignmentItems.length > 0 && isAssignmentProcessing) {
      console.log("🎬 Starting mock assignment progression simulation...");

      let processedCount = 0;
      const totalItems = assignmentItems.length;

      const processNextBatch = () => {
        if (processedCount >= totalItems) return;

        // Process 1-3 items at a time for realistic batching
        const batchSize = Math.min(
          Math.floor(Math.random() * 3) + 1,
          totalItems - processedCount
        );

        for (let i = 0; i < batchSize && processedCount < totalItems; i++) {
          const itemIndex = processedCount;
          const item = assignmentItems[itemIndex];

          // Set to processing first
          setTimeout(
            () => {
              console.log(`🔄 Processing: ${item.name}`);
              dispatch(
                updateAssignmentItemStatus({
                  itemId: item.id,
                  status: "processing",
                })
              );

              // Then complete after 1-3 seconds
              setTimeout(
                () => {
                  // 90% success rate for demo
                  const success = Math.random() > 0.1;
                  console.log(
                    `${success ? "✅" : "❌"} ${success ? "Completed" : "Failed"}: ${item.name}`
                  );
                  dispatch(
                    updateAssignmentItemStatus({
                      itemId: item.id,
                      status: success ? "success" : "failed",
                      error: success
                        ? undefined
                        : "Simulated assignment failure",
                    })
                  );
                },
                Math.random() * 2000 + 1000
              ); // 1-3 seconds
            },
            i * 200 + 500
          ); // Stagger processing starts by 200ms, start after 500ms

          processedCount++;
        }

        // Schedule next batch
        if (processedCount < totalItems) {
          setTimeout(processNextBatch, Math.random() * 1500 + 1000); // 1-2.5 seconds between batches
        }
      };

      // Start the first batch after a short delay
      const timer = setTimeout(processNextBatch, 800);

      // Cleanup function
      return () => clearTimeout(timer);
    }
  }, [assignmentItems.length, isAssignmentProcessing, dispatch]);

  return (
    <div className="space-y-2 h-full flex flex-col">
      <PageHeader
        title={getPageTitle()}
        description="Define filters to control which offers are displayed to users."
        emoji="✨"
        actions={backButton}
        variant="aurora"
      />

      <AlertDialog open={backDialogOpen} onOpenChange={setBackDialogOpen}>
        <AlertDialogTrigger asChild className="hidden">
          <button />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. What would you like to do?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setBackDialogOpen(false)}>
              Continue Editing
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setBackDialogOpen(false);
                handleSaveAsDraft();
              }}
              disabled={!filterName.trim()}
            >
              Save as Draft
            </Button>
            <Button variant="destructive" onClick={handleConfirmedNavigateBack}>
              Discard Changes
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create Product Filter</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to create the filter "{filterName}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmedCreateFilter}>
              Yes, create filter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div
        className="flex-1 flex flex-col"
        style={{ height: "calc(100vh - 160px)" }}
      >
        <div className="flex gap-3 h-full">
          <div
            className="w-[350px] flex-shrink-0"
            style={{
              position: "sticky",
              top: "1rem",
              height: "calc(100vh - 180px)",
            }}
          >
            <Card className="p-0 h-full flex flex-col overflow-hidden">
              <AIAssistantPanel
                title="AI Filter Assistant"
                description="Tell me what offers you want to filter"
                requiredCriteriaTypes={[]}
                onOptionSelected={handleOptionSelected}
                className="h-full overflow-auto"
              />
              {useSelector(selectIsGenerating) && (
                <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center z-50">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <SparklesIcon className="h-10 w-10 text-primary" />
                    </motion.div>
                    <p className="mt-3 text-sm font-medium">
                      Generating filters...
                    </p>
                  </motion.div>
                </div>
              )}
            </Card>
          </div>

          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={100} minSize={60}>
              <div className="overflow-auto pb-6 h-full pr-4">
                <div className="flex flex-col">
                  {lastGeneratedFilter && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="mb-3 p-2 bg-primary/10 border border-primary/30 rounded-md flex items-center"
                      onAnimationComplete={() => {
                        setTimeout(
                          () => dispatch(setLastGeneratedFilter(null)),
                          5000
                        );
                      }}
                    >
                      <SparklesIcon className="h-5 w-5 text-primary mr-2" />
                      <span className="text-sm">
                        {lastGeneratedFilter === "name" &&
                          "Filter name updated from AI suggestion"}
                        {lastGeneratedFilter === "criteria" &&
                          "New filter criteria added from AI suggestion"}
                        {lastGeneratedFilter === "multiple" &&
                          "Multiple filter criteria added from AI suggestions"}
                        {lastGeneratedFilter === "complete" &&
                          "Complete filter configuration applied from AI"}
                      </span>
                      <button
                        onClick={() => dispatch(setLastGeneratedFilter(null))}
                        className="ml-auto text-gray-500 hover:text-gray-700"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </motion.div>
                  )}

                  {validationMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded-md flex items-center"
                    >
                      <ExclamationCircleIcon className="h-5 w-5 text-yellow-600 mr-2" />
                      <span className="text-sm text-yellow-700">
                        {validationMessage}
                      </span>
                      <button
                        onClick={() => setValidationMessage(null)}
                        className="ml-auto text-yellow-500 hover:text-yellow-700"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </motion.div>
                  )}

                  {successMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="mb-3 p-2 bg-green-100 border border-green-300 rounded-md flex items-center"
                    >
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm text-green-700">
                        {successMessage}
                      </span>
                      <button
                        onClick={() => setSuccessMessage(null)}
                        className="ml-auto text-green-500 hover:text-green-700"
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </motion.div>
                  )}

                  <Card className="p-0">
                    <div className="flex items-center justify-between p-3 border-b bg-muted/20 flex-shrink-0 sticky top-0 z-10">
                      <div className="flex items-center">
                        <FunnelIcon className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="font-medium">
                          Product Filter Configuration
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        {renderFormActions()}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="grid grid-cols-12 gap-6 min-h-[600px]">
                        <div className="col-span-5 flex flex-col space-y-6">
                          <ShinyBorder
                            isActive={isBasicInfoComplete}
                            borderRadius={8}
                          >
                            <Accordion
                              type="single"
                              collapsible
                              defaultValue="basic-info"
                              className="border rounded-md overflow-hidden"
                            >
                              <AccordionItem
                                value="basic-info"
                                className="border-none"
                              >
                                <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                                  <div className="flex items-center">
                                    <DocumentTextIcon className="h-4 w-4 mr-2 text-blue-600" />
                                    Basic Information
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 text-left overflow-hidden">
                                  <div className="space-y-5 pb-2 text-left">
                                    <div className="text-left">
                                      <Label
                                        htmlFor="filter-name"
                                        className="text-sm"
                                      >
                                        Filter Name*
                                        <span className="text-xs font-medium text-gray-600 ml-1">
                                          (required for draft)
                                        </span>
                                      </Label>
                                      <Input
                                        id="filter-name"
                                        placeholder={getFieldPlaceholder(
                                          "filter-name"
                                        )}
                                        value={filterName}
                                        onChange={(e) =>
                                          dispatch(
                                            setFilterName(e.target.value)
                                          )
                                        }
                                        className="mt-1"
                                        maxLength={50}
                                        disabled={isViewMode}
                                      />
                                      <p className="mt-1.5 text-xs font-medium text-gray-600">
                                        Enter a unique, descriptive name for
                                        your filter. Max 50 characters.
                                      </p>
                                    </div>

                                    <div className="text-left">
                                      <Label
                                        htmlFor="description"
                                        className="text-sm"
                                      >
                                        Description*
                                        <span className="text-xs font-medium text-gray-600 ml-1">
                                          (required for publishing)
                                        </span>
                                      </Label>
                                      <Textarea
                                        id="description"
                                        placeholder={getFieldPlaceholder(
                                          "description"
                                        )}
                                        value={description}
                                        onChange={(e) =>
                                          dispatch(
                                            setDescription(e.target.value)
                                          )
                                        }
                                        className="mt-1"
                                        rows={3}
                                        maxLength={250}
                                        disabled={isViewMode}
                                      />
                                      <p className="mt-1.5 text-xs font-medium text-gray-600">
                                        Provide a detailed description of what
                                        this filter does. Max 250 characters.
                                      </p>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </ShinyBorder>

                          <div className="flex-1 min-h-0">
                            <ShinyBorder
                              isActive={selectedProgramCount > 0}
                              borderRadius={8}
                            >
                              {selectedProgramCount > 0 ? (
                                <SelectedProgramsDisplay
                                  partners={mockPartners}
                                  selectedProgramIds={selectedPrograms}
                                  collapsed={selectedProgramsCollapsed}
                                  onEditClick={() =>
                                    setIsAssignProgramsModalOpen(true)
                                  }
                                  onToggleCollapse={
                                    toggleSelectedProgramsCollapsed
                                  }
                                />
                              ) : (
                                <div className="border rounded-md overflow-hidden hover:bg-gray-50 transition-colors cursor-pointer">
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-between px-4 py-3 text-sm font-medium hover:bg-transparent"
                                    onClick={() =>
                                      setIsAssignProgramsModalOpen(true)
                                    }
                                  >
                                    <div className="flex items-center">
                                      <UsersIcon className="h-4 w-4 mr-2" />
                                      Assign to Program Campaigns
                                      <Badge
                                        variant="outline"
                                        className="ml-2 text-xs bg-blue-50 text-blue-700"
                                      >
                                        Optional
                                      </Badge>
                                    </div>
                                    <ChevronRightIcon className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </ShinyBorder>
                          </div>
                        </div>

                        <div className="col-span-7 flex flex-col space-y-4">
                          <ShinyBorder
                            isActive={isCriteriaComplete}
                            borderRadius={8}
                          >
                            <Accordion
                              type="single"
                              collapsible
                              defaultValue="condition-builder"
                              className="border rounded-md overflow-hidden"
                            >
                              <AccordionItem
                                value="condition-builder"
                                className="border-none"
                              >
                                <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                                  <div className="flex items-center">
                                    <FunnelIcon className="h-4 w-4 mr-2 text-purple-600" />
                                    <span>Add Filter Condition</span>
                                    <Badge
                                      variant="success"
                                      size="sm"
                                      className="ml-2"
                                    >
                                      {filterCriteria.length}
                                    </Badge>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 overflow-hidden">
                                  <div className="space-y-4 pb-2">
                                    <div
                                      className="text-xs text-muted-foreground mb-3"
                                      role="note"
                                      aria-live="polite"
                                    >
                                      <span className="inline-flex items-center">
                                        <InformationCircleIcon
                                          className="h-3.5 w-3.5 mr-1"
                                          aria-hidden="true"
                                        />
                                        <span id="filter-requirement-help">
                                          At least one condition is required to
                                          create a filter
                                        </span>
                                      </span>
                                    </div>

                                    <div
                                      className={`bg-gray-50 p-3 rounded-md border border-gray-200 ${isViewMode ? "opacity-75" : ""}`}
                                    >
                                      <div className="mb-2 font-medium text-sm text-gray-700">
                                        Build your filter condition:
                                      </div>

                                      <div className="flex flex-col space-y-4">
                                        {/* Row 1: Find conditions where + field type + include/exclude */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                                          <div className="flex items-center bg-white px-2 py-1 rounded border border-gray-200 h-8 shrink-0 mb-1 sm:mb-0">
                                            <span className="font-medium text-gray-600 text-xs">
                                              Find conditions where
                                            </span>
                                          </div>

                                          <div className="flex-1 w-full">
                                            <Select
                                              value={criteriaType}
                                              onValueChange={setCriteriaType}
                                              disabled={isViewMode}
                                            >
                                              <SelectTrigger className="h-8 w-full">
                                                <SelectValue
                                                  placeholder="select a field"
                                                  className="truncate"
                                                />
                                              </SelectTrigger>
                                              <SelectContent className="max-w-[300px]">
                                                {allFieldTypes.map((type) => (
                                                  <SelectItem
                                                    key={type}
                                                    value={type}
                                                    className="truncate"
                                                  >
                                                    {friendlyTypeNames[type] ||
                                                      type}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                            <span className="mt-1 text-xs font-medium text-gray-600 px-1">
                                              Select what field to filter on
                                            </span>
                                          </div>

                                          <div className="w-full sm:w-[150px]">
                                            <Select
                                              value={criteriaInclusion}
                                              onValueChange={
                                                setCriteriaInclusion
                                              }
                                              disabled={isViewMode}
                                            >
                                              <SelectTrigger className="h-8 w-full">
                                                <SelectValue placeholder="inclusion" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="Include">
                                                  Include
                                                </SelectItem>
                                                <SelectItem value="Exclude">
                                                  Exclude
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                            <span className="mt-1 text-xs font-medium text-gray-600 px-1">
                                              Include or exclude matches
                                            </span>
                                          </div>
                                        </div>

                                        {/* Row 2: Input field (dynamic based on field type) */}
                                        <div className="flex items-center w-full">
                                          <div className="w-full">
                                            {criteriaType === "OfferType" ? (
                                              <ReactSelectMulti
                                                options={offerTypeOptions}
                                                values={criteriaMultiValues}
                                                onChange={
                                                  setCriteriaMultiValues
                                                }
                                                placeholder="Select offer types"
                                                className="h-8"
                                                width="100%"
                                                isDisabled={isViewMode}
                                                maxDisplayValues={2}
                                              />
                                            ) : (
                                              <Input
                                                placeholder="value"
                                                value={criteriaValue}
                                                onChange={(e) =>
                                                  setCriteriaValue(
                                                    e.target.value
                                                  )
                                                }
                                                className="h-8 w-full"
                                                disabled={isViewMode}
                                              />
                                            )}
                                            <span className="mt-1 text-xs font-medium text-gray-600 px-1">
                                              {criteriaType === "OfferType"
                                                ? "Select offer types to match"
                                                : "Enter the value to match"}
                                            </span>
                                          </div>
                                        </div>

                                        {/* Row 3: Connect with + AND/OR operator + Add button */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
                                          <div className="flex items-center bg-white px-2 py-1 rounded border border-gray-200 h-8 shrink-0 mb-1 sm:mb-0">
                                            <span className="font-medium text-gray-600 text-xs">
                                              connect with
                                            </span>
                                          </div>

                                          <div className="flex-1 w-full">
                                            <Select
                                              value={criteriaAndOr}
                                              onValueChange={setCriteriaAndOr}
                                              disabled={isViewMode}
                                            >
                                              <SelectTrigger className="h-8 w-full">
                                                <SelectValue placeholder="operator" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="OR">
                                                  <span className="font-medium">
                                                    OR
                                                  </span>
                                                </SelectItem>
                                                <SelectItem value="AND">
                                                  <span className="font-medium">
                                                    AND
                                                  </span>
                                                </SelectItem>
                                              </SelectContent>
                                            </Select>
                                            <span className="mt-1 text-xs font-medium text-gray-600 px-1">
                                              How to combine conditions
                                            </span>
                                          </div>

                                          <div className="w-full sm:w-auto mt-2 sm:mt-0">
                                            {!isViewMode && (
                                              <Button
                                                onClick={addCriteria}
                                                disabled={
                                                  !criteriaType ||
                                                  (criteriaType === "OfferType"
                                                    ? criteriaMultiValues.length ===
                                                      0
                                                    : !criteriaValue)
                                                }
                                                size="sm"
                                                className="h-8 w-full sm:w-auto"
                                              >
                                                <PlusIcon className="h-3.5 w-3.5 mr-1" />
                                                Add
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="mt-3 text-xs font-medium text-gray-600 bg-white p-2 rounded border border-gray-200">
                                        {criteriaType
                                          ? `${criteriaInclusion === "Include" ? "Include" : "Exclude"} conditions where ${friendlyTypeNames[criteriaType] || criteriaType} ${criteriaType === "OfferType" ? "is one of the selected types" : `contains "${criteriaValue}"`}.`
                                          : "Select a field to get started with building your filter condition."}
                                      </div>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </ShinyBorder>

                          <ShinyBorder
                            isActive={isCriteriaComplete}
                            borderRadius={8}
                          >
                            <Accordion
                              type="single"
                              collapsible
                              defaultValue="current-conditions"
                              className="border rounded-md overflow-hidden"
                            >
                              <AccordionItem
                                value="current-conditions"
                                className="border-none"
                              >
                                <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                                  <div className="flex items-center">
                                    <ClipboardDocumentListIcon className="h-4 w-4 mr-2 text-green-600" />
                                    Current Conditions
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-0 overflow-hidden">
                                  <div className="grid grid-cols-2 overflow-hidden">
                                    <div className="border-r flex flex-col">
                                      <div className="bg-green-50 text-green-800 px-3 py-1.5 text-xs font-medium flex items-center justify-between border-b">
                                        <div className="flex items-center">
                                          <CheckCircleIcon className="h-3.5 w-3.5 mr-1.5" />
                                          <span>INCLUDE CONDITIONS</span>
                                        </div>
                                        <Badge
                                          variant="secondary"
                                          className="text-[10px] bg-green-100"
                                        >
                                          {
                                            filterCriteria.filter(
                                              (c: FilterCriteria) =>
                                                c.isRequired
                                            ).length
                                          }
                                        </Badge>
                                      </div>

                                      <ScrollArea className="p-2 h-[250px]">
                                        {filterCriteria.filter(
                                          (c: FilterCriteria) => c.isRequired
                                        ).length === 0 ? (
                                          <div className="text-xs text-muted-foreground p-4 text-center">
                                            No include conditions added yet
                                          </div>
                                        ) : (
                                          <div className="space-y-1.5">
                                            {filterCriteria
                                              .filter(
                                                (c: FilterCriteria) =>
                                                  c.isRequired
                                              )
                                              .map(
                                                (criteria: FilterCriteria) => (
                                                  <div
                                                    key={criteria.id}
                                                    className="border rounded-md p-1.5 relative hover:shadow-sm transition-all group"
                                                  >
                                                    <button
                                                      onClick={() =>
                                                        removeCriteria(
                                                          criteria.id
                                                        )
                                                      }
                                                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                      aria-label="Remove condition"
                                                    >
                                                      <XCircleIcon className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                                                    </button>

                                                    <div className="text-xs">
                                                      <div className="font-medium">
                                                        {friendlyTypeNames[
                                                          criteria.type
                                                        ] || criteria.type}
                                                      </div>
                                                      <div className="flex items-center flex-wrap gap-1 mt-0.5">
                                                        <span className="text-muted-foreground text-[10px]">
                                                          {friendlyRuleNames[
                                                            criteria.rule
                                                          ] || criteria.rule}
                                                        </span>
                                                        <Badge
                                                          variant="outline"
                                                          className="font-mono text-[10px] py-0 h-4"
                                                        >
                                                          {criteria.value}
                                                        </Badge>
                                                        <Badge
                                                          variant="secondary"
                                                          className="text-[10px] py-0 h-4 ml-auto"
                                                        >
                                                          {criteria.and_or}
                                                        </Badge>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                          </div>
                                        )}
                                      </ScrollArea>
                                    </div>

                                    <div className="flex flex-col">
                                      <div className="bg-red-50 text-red-800 px-3 py-1.5 text-xs font-medium flex items-center justify-between border-b">
                                        <div className="flex items-center">
                                          <XCircleIcon className="h-3.5 w-3.5 mr-1.5" />
                                          <span>EXCLUDE CONDITIONS</span>
                                        </div>
                                        <Badge
                                          variant="secondary"
                                          className="text-[10px] bg-red-100"
                                        >
                                          {
                                            filterCriteria.filter(
                                              (c: FilterCriteria) =>
                                                !c.isRequired
                                            ).length
                                          }
                                        </Badge>
                                      </div>

                                      <ScrollArea className="p-2 h-[250px]">
                                        {filterCriteria.filter(
                                          (c: FilterCriteria) => !c.isRequired
                                        ).length === 0 ? (
                                          <div className="text-xs text-muted-foreground p-4 text-center">
                                            No exclude conditions added yet
                                          </div>
                                        ) : (
                                          <div className="space-y-1.5">
                                            {filterCriteria
                                              .filter(
                                                (c: FilterCriteria) =>
                                                  !c.isRequired
                                              )
                                              .map(
                                                (criteria: FilterCriteria) => (
                                                  <div
                                                    key={criteria.id}
                                                    className="border rounded-md p-1.5 relative hover:shadow-sm transition-all group"
                                                  >
                                                    <button
                                                      onClick={() =>
                                                        removeCriteria(
                                                          criteria.id
                                                        )
                                                      }
                                                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                      aria-label="Remove condition"
                                                    >
                                                      <XCircleIcon className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                                                    </button>

                                                    <div className="text-xs">
                                                      <div className="font-medium">
                                                        {friendlyTypeNames[
                                                          criteria.type
                                                        ] || criteria.type}
                                                      </div>
                                                      <div className="flex items-center flex-wrap gap-1 mt-0.5">
                                                        <span className="text-muted-foreground text-[10px]">
                                                          {friendlyRuleNames[
                                                            criteria.rule
                                                          ] || criteria.rule}
                                                        </span>
                                                        <Badge
                                                          variant="outline"
                                                          className="font-mono text-[10px] py-0 h-4"
                                                        >
                                                          {criteria.value}
                                                        </Badge>
                                                        <Badge
                                                          variant="secondary"
                                                          className="text-[10px] py-0 h-4 ml-auto"
                                                        >
                                                          {criteria.and_or}
                                                        </Badge>
                                                      </div>
                                                    </div>
                                                  </div>
                                                )
                                              )}
                                          </div>
                                        )}
                                      </ScrollArea>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </ShinyBorder>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {isAssignProgramsModalOpen && (
        <Dialog
          open={isAssignProgramsModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              // If dialog is closing, ensure we get the current selection
              setIsAssignProgramsModalOpen(false);
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Assign Filter to Programs</DialogTitle>
              <DialogDescription>
                Select which program campaigns this filter should be assigned
                to.
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[calc(80vh-10rem)] overflow-hidden">
              <AssignToProgramsPanel
                filterId={tempFilterId}
                filterName={filterName || "Untitled Filter"}
                onClose={(selectedIds) =>
                  handleAssignProgramsModalClose(selectedIds)
                }
                initialSelection={selectedPrograms}
                partnerData={mockPartners}
                onSelectionChange={() => {
                  // No longer needed since Redux handles count automatically
                }}
                onStartAssignment={handleStartAssignment}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

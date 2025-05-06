"use client";

import React, { useState, useEffect, ChangeEvent, useCallback } from "react";
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
  setExpiryDate,
  addCriteria as addCriteriaAction,
  removeCriteria as removeCriteriaAction,
  setCriteria,
  setIsGenerating,
  setLastGeneratedFilter,
  applyFilterUpdate,
  FilterCriteria,
  setCoverageStats,
} from "@/lib/redux/slices/productFilterSlice";
import {
  selectFilterName,
  selectDescription,
  selectExpiryDate,
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

// Custom DatePicker component
interface DatePickerProps {
  id: string;
  selected: Date | null;
  onSelect: (date: Date | null) => void;
  placeholder: string;
  className?: string;
}

const DatePicker = ({
  id,
  selected,
  onSelect,
  placeholder,
  className,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get tomorrow's date for minimum selectable date
  const tomorrow = addDays(new Date(), 1);

  // Function to disable dates before tomorrow
  const disablePastDates = (date: Date) => {
    return date < tomorrow;
  };

  return (
    <div className={className}>
      <Input
        id={id}
        placeholder={placeholder}
        value={selected ? format(selected, "PPP") : ""}
        onClick={() => setIsOpen(!isOpen)}
        readOnly
      />
      {isOpen && (
        <div className="absolute mt-2 bg-white border rounded-md shadow-lg z-10">
          <Calendar
            mode="single"
            selected={selected || undefined}
            onSelect={(date: Date | undefined) => {
              onSelect(date || null);
              setIsOpen(false);
            }}
            disabled={disablePastDates}
            initialFocus
          />
        </div>
      )}
    </div>
  );
};

// Add generateUniqueId helper function
const generateUniqueId = () => {
  return (
    Date.now().toString() + "-" + Math.random().toString(36).substring(2, 9)
  );
};

// Add helper function to get instruction text for fields
const getFieldInstruction = (fieldType: string): string => {
  switch (fieldType) {
    case "filter-name":
      return "Enter a unique, descriptive name for your filter. Max 50 characters.";
    case "query-view-name":
      return "Enter a name for database query view. This will be used by the system.";
    case "description":
      return "Provide a detailed description of what this filter does. Max 250 characters.";
    case "expiry-date":
      return "Select a date when this filter should expire. Must be a future date.";
    case "criteria-type":
      return "Select what type of field you want to filter on.";
    case "criteria-inclusion":
      return "Choose whether to include or exclude conditions that match this criterion.";
    case "criteria-value":
      return "Enter the value to match against the selected field type.";
    case "criteria-and-or":
      return "Choose how this condition connects with others. 'AND' requires both conditions to be true. 'OR' requires either condition to be true.";
    default:
      return "";
  }
};

export default function ProductFilterCreationView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("details");
  // Add validation message state
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );
  // Add success message state
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Use Redux selectors for form state
  const filterName = useSelector(selectFilterName);
  const description = useSelector(selectDescription);
  const expiryDateString = useSelector(selectExpiryDate);
  // Convert ISO string to Date object for UI
  const expiryDate = expiryDateString ? new Date(expiryDateString) : null;

  // Get criteria from Redux
  const filterCriteria = useSelector(selectCriteria);
  const isGeneratingFilters = useSelector(selectIsGenerating);
  const lastGeneratedFilter = useSelector(selectLastGeneratedFilter);
  const hasRequiredCriteria = useSelector(selectHasAllRequiredCriteria);
  const isReduxFormValid = useSelector(selectIsFormValid);

  // Local state for criteria creation form
  const [criteriaType, setCriteriaType] = useState("");
  const [criteriaValue, setCriteriaValue] = useState("");
  const [criteriaAndOr, setCriteriaAndOr] = useState("OR");
  const [criteriaInclusion, setCriteriaInclusion] = useState("Include");

  // Combine all field types into a single array - no longer separate required vs optional
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

  // Helper function to check if all required fields are filled - using Redux selector
  const isFormValid = () => isReduxFormValid;

  // Helper function to check if all required criteria are present - using Redux selector
  const hasAllRequiredCriteria = () => hasRequiredCriteria;

  // Add criteria (manual) - using Redux action
  const addCriteria = () => {
    if (criteriaType && criteriaValue) {
      // isRequired is now determined solely by the Include/Exclude selection
      const isRequired = criteriaInclusion === "Include";

      // Always use "contains" as the default rule
      const defaultRule = "contains";

      // Dispatch action to add criteria to Redux store
      dispatch(
        addCriteriaAction({
          type: criteriaType,
          value: criteriaValue,
          rule: defaultRule,
          and_or: criteriaAndOr,
          isRequired,
        })
      );

      // Reset the form
      setCriteriaType("");
      setCriteriaValue("");
      setCriteriaAndOr("OR");
      setCriteriaInclusion("Include");
    } else {
      setValidationMessage(
        "Please select a field and enter a value for your filter condition"
      );
      // Clear the validation message after 5 seconds
      setTimeout(() => setValidationMessage(null), 5000);
    }
  };

  // Remove criteria - using Redux action
  const removeCriteria = (id: string) => {
    dispatch(removeCriteriaAction(id));
  };

  // Create filter
  const handleCreateFilter = () => {
    // Check if basic form fields are filled based on new requirements
    const isBasicInfoValid =
      filterName.trim() !== "" && description.trim() !== "";

    // Check if we have at least one filter condition
    const hasFilterConditions = filterCriteria.length > 0;

    if (!isBasicInfoValid) {
      setValidationMessage(
        "Please fill in the required filter name and description fields"
      );
      // Clear the validation message after 5 seconds
      setTimeout(() => setValidationMessage(null), 5000);
      return;
    }

    if (!hasFilterConditions) {
      setValidationMessage("Please add at least one filter condition");
      // Clear the validation message after 5 seconds
      setTimeout(() => setValidationMessage(null), 5000);
      return;
    }

    // Show success message
    setSuccessMessage("Product filter created successfully!");

    // Clear the success message after 3 seconds and redirect
    setTimeout(() => {
      setSuccessMessage(null);
      router.push("/campaigns/product-filters");
    }, 3000);
  };

  // Cancel and go back
  const handleCancel = () => {
    router.push("/campaigns/product-filters");
  };

  // Navigate to next tab
  const nextTab = () => {
    if (activeTab === "details" && isFormValid()) {
      setActiveTab("criteria");
    }
  };

  // Navigate to previous tab
  const prevTab = () => {
    if (activeTab === "criteria") {
      setActiveTab("details");
    }
  };

  // Create the back button for the header
  const backButton = (
    <Button
      variant="outline"
      onClick={handleCancel}
      className="flex items-center gap-1"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      Back to Filters
    </Button>
  );

  // Initialize AI assistant with product filter context
  useEffect(() => {
    dispatch(
      setProductFilterContext({
        filterName,
        filterDescription: description,
        currentCriteria: filterCriteria,
        expiryDate: expiryDate ? expiryDate.toISOString() : null,
      })
    );
  }, [dispatch, filterName, description, filterCriteria, expiryDate]);

  // Handle option selected from AI Assistant
  const handleOptionSelected = (optionId: string) => {
    // Handle different AI suggestions/commands
    console.log("Option selected:", optionId); // Debug logging

    if (optionId.startsWith("apply_updates:")) {
      dispatch(setIsGenerating(true));

      try {
        // Extract the JSON payload from the option ID
        const updatesJson = optionId.replace("apply_updates:", "");
        const updates = JSON.parse(updatesJson);

        console.log("Parsed updates:", updates); // Debug logging

        // Dispatch action to update the filter in Redux store
        dispatch(
          applyFilterUpdate({
            filterName: updates.filterName,
            criteriaToAdd: updates.criteriaToAdd,
            expiryDate: updates.expiryDate
              ? new Date(updates.expiryDate)
              : undefined,
          })
        );

        // Set last generated filter for UI feedback
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

            // isRequired is determined by the inclusion type (defaulting to Include if not specified)
            const inclusion = criteriaData.inclusion || "Include";
            const isRequired = inclusion === "Include";

            // Dispatch action to add criteria to Redux store
            dispatch(
              addCriteriaAction({
                type: criteriaData.type,
                value: criteriaData.value,
                rule,
                and_or: andOr,
                isRequired,
              })
            );

            // Reset form
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
              // isRequired is determined by the inclusion type (defaulting to Include if not specified)
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

            // Add each criteria to Redux store
            newCriteriaItems.forEach((criteria) => {
              dispatch(addCriteriaAction(criteria));
            });

            // Reset form
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
          expiryDate?: string;
          criteria?: Array<Partial<FilterCriteria> & { inclusion?: string }>;
        }
        const filterData: CompleteFilterData = JSON.parse(
          optionId.replace("suggest_complete_filter:", "")
        );
        setTimeout(() => {
          // Create update object for Redux
          const update: any = {};

          if (filterData.name) update.filterName = filterData.name;
          if (filterData.description)
            update.description = filterData.description;
          if (filterData.expiryDate) {
            const date = new Date(filterData.expiryDate);
            if (!isNaN(date.getTime())) update.expiryDate = date;
          }

          // Format criteria for Redux using new isRequired logic
          if (
            Array.isArray(filterData.criteria) &&
            filterData.criteria.length > 0
          ) {
            const criteriaToAdd = filterData.criteria.map((criteriaItem) => {
              // isRequired is determined by the inclusion type (defaulting to Include if not specified)
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

          // Dispatch single update action with all changes
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

  // Friendly names mapping for technical terms
  const friendlyTypeNames: Record<string, string> = {
    MerchantKeyword: "Merchant Contains Keyword",
    MerchantName: "Merchant Name",
    OfferCommodity: "Offer Commodity",
    OfferKeyword: "Offer Contains Keyword",
    Client: "Client",
    MerchantId: "Merchant ID",
    OfferCategory: "Offer Category",
    OfferExpiry: "Offer Expiry Date",
    OfferId: "Offer ID",
    OfferRedemptionControlLimit: "Redemption Limit",
    OfferRedemptionType: "Redemption Type",
    OfferType: "Offer Type",
  };

  // Friendly names for rules
  const friendlyRuleNames: Record<string, string> = {
    equals: "is exactly",
    contains: "contains",
    startsWith: "starts with",
    endsWith: "ends with",
    greaterThan: "is greater than",
    lessThan: "is less than",
  };

  // Create a serializable-safe date selector function
  const handleDateSelect = useCallback(
    (date: Date | null) => {
      // This dispatch will now use our serialization-safe action
      dispatch(setExpiryDate(date));
    },
    [dispatch]
  );

  // Get coverage stats from Redux
  const coverageStats = useSelector(selectCoverageStats);

  // Update coverage stats whenever criteria change
  useEffect(() => {
    if (filterCriteria.length > 0) {
      const stats = generateFilterCoverageStats(filterCriteria);
      dispatch(setCoverageStats(stats));
    }
  }, [filterCriteria, dispatch]);

  // Function to handle applying coverage suggestions
  const handleSuggestionApply = (suggestionValue: string) => {
    // Parse the suggestion value
    const [type, action, target] = suggestionValue.split(":");

    if (type !== "coverage") return;

    // Handle different types of coverage suggestions
    switch (action) {
      case "reduce":
        // Remove one of the criteria of the specified type
        const criteriaToRemove = filterCriteria
          .filter((c) => c.type === target)
          .slice(0, 1); // Take just one to remove

        if (criteriaToRemove.length > 0) {
          dispatch(removeCriteriaAction(criteriaToRemove[0].id));

          // Show notification
          dispatch(setLastGeneratedFilter("criteria"));
        }
        break;

      case "relax":
        // Find the criteria by ID and change its rule from "equals" to "contains"
        const criteriaIndex = filterCriteria.findIndex((c) => c.id === target);

        if (criteriaIndex >= 0) {
          const criteria = { ...filterCriteria[criteriaIndex] };
          criteria.rule = "contains";

          // Update the criteria
          const updatedCriteria = [...filterCriteria];
          updatedCriteria[criteriaIndex] = criteria;

          // Dispatch the action with the full updated array
          dispatch({
            type: "productFilter/setCriteria",
            payload: updatedCriteria,
          });

          // Show notification
          dispatch(setLastGeneratedFilter("criteria"));
        }
        break;

      // Add other cases as needed

      default:
        // For generic suggestions, show an educational message
        alert(
          "To improve coverage, try using broader keywords or selecting 'contains' instead of 'equals' for keyword matches."
        );
        break;
    }
  };

  // Add a handler function for saving as draft
  const handleSaveAsDraft = () => {
    // For drafts, we only validate that there's a filter name
    if (!filterName.trim()) {
      setValidationMessage("Please provide a filter name to save as draft");
      // Clear the validation message after 5 seconds
      setTimeout(() => setValidationMessage(null), 5000);
      return;
    }

    // Show success message
    setSuccessMessage("Filter saved as draft successfully!");

    // Clear the success message after 3 seconds and redirect
    setTimeout(() => {
      setSuccessMessage(null);
      router.push("/campaigns/product-filters");
    }, 3000);
  };

  return (
    <div className="space-y-2 h-full flex flex-col">
      <PageHeader
        title="Create New Product Filter"
        description="Add a new product filter to control offer display in the TOP platform."
        emoji="✨"
        actions={backButton}
        variant="aurora"
      />

      {/* Main content container with strict viewport-based height */}
      <div
        className="flex-1 flex flex-col"
        style={{ height: "calc(100vh - 160px)" }}
      >
        <div className="flex gap-3 h-full">
          {/* Left Column - AI Assistant Panel with fixed height and position */}
          <div
            className="w-[448px] flex-shrink-0"
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
              {isGeneratingFilters && (
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

          {/* Right Column - Filter Configuration with scrollable content */}
          <div className="flex-1 overflow-auto pb-6">
            <div className="flex flex-col">
              {lastGeneratedFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="mb-3 p-2 bg-primary/10 border border-primary/30 rounded-md flex items-center"
                  onAnimationComplete={() => {
                    // Clear the notification after 5 seconds
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

              {/* Validation Message Banner */}
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

              {/* Success Message Banner */}
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
                    <Button variant="outline" onClick={handleCancel} size="sm">
                      Cancel
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleSaveAsDraft}
                      disabled={!filterName.trim()}
                      size="sm"
                    >
                      Save as Draft
                    </Button>
                    <Button
                      onClick={handleCreateFilter}
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
                </div>

                <div className="p-4">
                  <div className="grid grid-cols-12 gap-6">
                    {/* Left side - Basic Information and Status */}
                    <div className="col-span-4 space-y-6">
                      {/* Filter Conditions Summary Accordion - REMOVED */}

                      {/* Basic Information Section */}
                      <Accordion
                        type="single"
                        collapsible
                        defaultValue="basic-info"
                        className="border rounded-md"
                      >
                        <AccordionItem
                          value="basic-info"
                          className="border-none"
                        >
                          <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                            Basic Information
                          </AccordionTrigger>
                          <AccordionContent className="px-4 text-left">
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
                                    dispatch(setFilterName(e.target.value))
                                  }
                                  className="mt-1"
                                  maxLength={50}
                                />
                                <p className="mt-1.5 text-xs font-medium text-gray-600">
                                  Enter a unique, descriptive name for your
                                  filter. Max 50 characters.
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
                                    dispatch(setDescription(e.target.value))
                                  }
                                  className="mt-1"
                                  rows={3}
                                  maxLength={250}
                                />
                                <p className="mt-1.5 text-xs font-medium text-gray-600">
                                  Provide a detailed description of what this
                                  filter does. Max 250 characters.
                                </p>
                              </div>

                              <div className="text-left">
                                <Label
                                  htmlFor="expiry-date"
                                  className="text-sm"
                                >
                                  Expiry Date
                                </Label>
                                <DatePicker
                                  id="expiry-date"
                                  selected={expiryDate}
                                  onSelect={handleDateSelect}
                                  placeholder={getFieldPlaceholder(
                                    "expiry-date"
                                  )}
                                  className="mt-1 w-full"
                                />
                                <p className="mt-1.5 text-xs font-medium text-gray-600">
                                  Select a date when this filter should expire.
                                  Must be a future date.
                                </p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      {/* Coverage statistics as accordion */}
                      <Accordion
                        type="single"
                        collapsible
                        defaultValue="coverage-stats"
                        className="border rounded-md"
                      >
                        <AccordionItem
                          value="coverage-stats"
                          className="border-none"
                        >
                          <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                            Filter Coverage Statistics
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pb-4">
                            <FilterCoveragePanel
                              coverageStats={coverageStats}
                              isLoading={isGeneratingFilters}
                              onApplySuggestion={handleSuggestionApply}
                            />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>

                    {/* Right side - Filter Builder and Conditions */}
                    <div className="col-span-8 flex flex-col space-y-4">
                      {/* Condition Builder */}
                      <Accordion
                        type="single"
                        collapsible
                        defaultValue="condition-builder"
                        className="border rounded-md"
                      >
                        <AccordionItem
                          value="condition-builder"
                          className="border-none"
                        >
                          <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                            Add Filter Condition
                            <Badge
                              variant={
                                filterCriteria.length > 0
                                  ? "success"
                                  : "warning"
                              }
                              size="sm"
                              className="ml-2"
                            >
                              {filterCriteria.length}
                            </Badge>
                          </AccordionTrigger>
                          <AccordionContent className="px-4">
                            <div className="space-y-4 pb-2">
                              {/* Added condition requirements note */}
                              <div className="text-xs text-muted-foreground mb-3">
                                <span className="inline-flex items-center">
                                  <InformationCircleIcon className="h-3.5 w-3.5 mr-1" />
                                  At least one condition is required to create a
                                  filter
                                </span>
                              </div>

                              {/* Filter condition sentence as a more cohesive flow */}
                              <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                                <div className="mb-2 font-medium text-sm text-gray-700">
                                  Build your filter condition:
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-xs">
                                  <div className="flex items-center bg-white px-2 py-1 rounded border border-gray-200">
                                    <span className="font-medium text-gray-600">
                                      Find conditions where
                                    </span>
                                  </div>

                                  <div className="inline-flex flex-col">
                                    <Select
                                      value={criteriaType}
                                      onValueChange={setCriteriaType}
                                    >
                                      <SelectTrigger className="min-w-[160px] h-8">
                                        <SelectValue placeholder="select a field" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {allFieldTypes.map((type) => (
                                          <SelectItem key={type} value={type}>
                                            {friendlyTypeNames[type] || type}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <span className="mt-1 text-xs font-medium text-gray-600 px-1">
                                      Select what field to filter on
                                    </span>
                                  </div>

                                  <div className="inline-flex flex-col">
                                    <Select
                                      value={criteriaInclusion}
                                      onValueChange={setCriteriaInclusion}
                                    >
                                      <SelectTrigger className="min-w-[110px] h-8">
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

                                  <div className="inline-flex flex-col">
                                    <Input
                                      placeholder="value"
                                      value={criteriaValue}
                                      onChange={(e) =>
                                        setCriteriaValue(e.target.value)
                                      }
                                      className="h-8 w-[160px]"
                                    />
                                    <span className="mt-1 text-xs font-medium text-gray-600 px-1">
                                      Enter the value to match
                                    </span>
                                  </div>

                                  <div className="flex items-center bg-white px-2 py-1 rounded border border-gray-200">
                                    <span className="font-medium text-gray-600">
                                      connect with
                                    </span>
                                  </div>

                                  <div className="inline-flex flex-col">
                                    <Select
                                      value={criteriaAndOr}
                                      onValueChange={setCriteriaAndOr}
                                    >
                                      <SelectTrigger className="w-[90px] h-8">
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

                                  <Button
                                    onClick={() => {
                                      if (!criteriaType) {
                                        setValidationMessage(
                                          "Please select a field type for your filter condition"
                                        );
                                        setTimeout(
                                          () => setValidationMessage(null),
                                          5000
                                        );
                                        return;
                                      }
                                      if (!criteriaValue) {
                                        setValidationMessage(
                                          "Please enter a value for your filter condition"
                                        );
                                        setTimeout(
                                          () => setValidationMessage(null),
                                          5000
                                        );
                                        return;
                                      }
                                      addCriteria();
                                    }}
                                    disabled={!criteriaType || !criteriaValue}
                                    size="sm"
                                    className="h-8 self-start"
                                  >
                                    <PlusIcon className="h-3.5 w-3.5 mr-1" />
                                    Add
                                  </Button>
                                </div>

                                <div className="mt-3 text-xs font-medium text-gray-600 bg-white p-2 rounded border border-gray-200">
                                  {criteriaType
                                    ? `${criteriaInclusion === "Include" ? "Include" : "Exclude"} conditions where ${friendlyTypeNames[criteriaType] || criteriaType} contains "${criteriaValue}".`
                                    : "Select a field to get started with building your filter condition."}
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      {/* Current Conditions */}
                      <div className="flex flex-col border rounded-md overflow-hidden">
                        <div className="border-b p-3">
                          <h4 className="text-sm font-medium flex items-center">
                            Current Conditions
                          </h4>
                        </div>

                        <div className="grid grid-cols-2 overflow-hidden">
                          {/* Include Rules */}
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
                                    (c: FilterCriteria) => c.isRequired
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
                                    .filter((c: FilterCriteria) => c.isRequired)
                                    .map((criteria: FilterCriteria) => (
                                      <div
                                        key={criteria.id}
                                        className="border rounded-md p-1.5 relative hover:shadow-sm transition-all group"
                                      >
                                        <button
                                          onClick={() =>
                                            removeCriteria(criteria.id)
                                          }
                                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                          aria-label="Remove condition"
                                        >
                                          <XCircleIcon className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                                        </button>

                                        <div className="text-xs">
                                          <div className="font-medium">
                                            {friendlyTypeNames[criteria.type] ||
                                              criteria.type}
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
                                    ))}
                                </div>
                              )}
                            </ScrollArea>
                          </div>

                          {/* Exclude Rules */}
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
                                    (c: FilterCriteria) => !c.isRequired
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
                                      (c: FilterCriteria) => !c.isRequired
                                    )
                                    .map((criteria: FilterCriteria) => (
                                      <div
                                        key={criteria.id}
                                        className="border rounded-md p-1.5 relative hover:shadow-sm transition-all group"
                                      >
                                        <button
                                          onClick={() =>
                                            removeCriteria(criteria.id)
                                          }
                                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                          aria-label="Remove condition"
                                        >
                                          <XCircleIcon className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                                        </button>

                                        <div className="text-xs">
                                          <div className="font-medium">
                                            {friendlyTypeNames[criteria.type] ||
                                              criteria.type}
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
                                    ))}
                                </div>
                              )}
                            </ScrollArea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

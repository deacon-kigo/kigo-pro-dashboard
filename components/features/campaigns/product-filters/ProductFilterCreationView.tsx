"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
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
import { useDispatch } from "react-redux";
import { setProductFilterContext } from "@/lib/redux/slices/ai-assistantSlice";
import { Badge } from "@/components/atoms/Badge";
import {
  InformationCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  FunnelIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { Tooltip } from "@/components/atoms/Tooltip";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

// Interface for filter criteria
interface FilterCriteria {
  id: string;
  type: string;
  value: string;
  rule: string;
  and_or: string;
  isRequired: boolean;
}

// Custom DatePicker component
interface DatePickerProps {
  id: string;
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
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
            selected={selected}
            onSelect={(date: Date | undefined) => {
              onSelect(date);
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

export default function ProductFilterCreationView() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("details");

  // Form state
  const [filterName, setFilterName] = useState("");
  const [queryViewName, setQueryViewName] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date>();

  // Criteria state
  const [filterCriteria, setFilterCriteria] = useState<FilterCriteria[]>([]);
  const [criteriaType, setCriteriaType] = useState("");
  const [criteriaValue, setCriteriaValue] = useState("");
  const [criteriaRule, setCriteriaRule] = useState("equals");
  const [criteriaAndOr, setCriteriaAndOr] = useState("OR");

  // Required criteria types based on ticket
  const requiredCriteriaTypes = [
    "MerchantKeyword",
    "MerchantName",
    "OfferCommodity",
    "OfferKeyword",
  ];

  const optionalCriteriaTypes = [
    "Client",
    "MerchantId",
    "OfferCategory",
    "OfferExpiry",
    "OfferId",
    "OfferRedemptionControlLimit",
    "OfferRedemptionType",
    "OfferType",
  ];

  // Helper function to check if all required fields are filled
  const isFormValid = () => {
    return (
      filterName.trim() !== "" &&
      queryViewName.trim() !== "" &&
      expiryDate !== undefined
    );
  };

  // Helper function to check if all required criteria are present
  const hasAllRequiredCriteria = () => {
    return requiredCriteriaTypes.every((type) =>
      filterCriteria.some((criteria: FilterCriteria) => criteria.type === type)
    );
  };

  // Add new criteria (manual)
  const addCriteria = () => {
    if (criteriaType && criteriaValue) {
      const isRequired = requiredCriteriaTypes.includes(criteriaType);
      const newCriteria: FilterCriteria = {
        id: Date.now().toString(),
        type: criteriaType,
        value: criteriaValue,
        rule: criteriaRule,
        and_or: criteriaAndOr,
        isRequired,
      };

      setFilterCriteria((prevCriteria) => [...prevCriteria, newCriteria]); // Use functional update
      setCriteriaType("");
      setCriteriaValue("");
      setCriteriaRule("equals");
      setCriteriaAndOr("OR");
    }
  };

  // Remove criteria
  const removeCriteria = (id: string) => {
    setFilterCriteria((prevCriteria) =>
      prevCriteria.filter((c) => c.id !== id)
    ); // Use functional update
  };

  // Create filter
  const handleCreateFilter = () => {
    if (!isFormValid()) {
      alert("Please fill in all required fields");
      return;
    }

    if (!hasAllRequiredCriteria()) {
      alert("Please add all required criteria types");
      return;
    }

    // In a real implementation, we would make an API call here
    alert("Product filter created successfully!");
    router.push("/campaigns/product-filters");
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
      })
    );
  }, [dispatch, filterName, description, filterCriteria]);

  // Add state variables to manage animation and filter generation
  const [isGeneratingFilters, setIsGeneratingFilters] = useState(false);
  const [lastGeneratedFilter, setLastGeneratedFilter] = useState<string | null>(
    null
  );

  // Handle option selected from AI Assistant
  const handleOptionSelected = (optionId: string) => {
    // Handle different AI suggestions/commands

    if (optionId.startsWith("suggest_name:")) {
      setIsGeneratingFilters(true);
      const suggestedName = optionId.replace("suggest_name:", "");
      setTimeout(() => {
        setFilterName(suggestedName);
        setLastGeneratedFilter("name");
        setIsGeneratingFilters(false);
      }, 800);
    } else if (optionId.startsWith("suggest_criteria:")) {
      try {
        setIsGeneratingFilters(true);
        const criteriaData = JSON.parse(
          optionId.replace("suggest_criteria:", "")
        );
        if (criteriaData.type && criteriaData.value) {
          setTimeout(() => {
            const rule = criteriaData.rule || "equals";
            const andOr = criteriaData.and_or || "OR";
            setCriteriaType(criteriaData.type);
            setCriteriaValue(criteriaData.value);
            setCriteriaRule(rule);
            setCriteriaAndOr(andOr);

            const isRequired = requiredCriteriaTypes.includes(
              criteriaData.type
            );
            const newCriteria: FilterCriteria = {
              id:
                Date.now().toString() + Math.random().toString(36).substr(2, 5),
              type: criteriaData.type,
              value: criteriaData.value,
              rule,
              and_or: andOr,
              isRequired,
            };
            setFilterCriteria((prev) => [...prev, newCriteria]); // Functional update
            setCriteriaType("");
            setCriteriaValue("");
            setCriteriaRule("equals");
            setCriteriaAndOr("OR");
            setLastGeneratedFilter("criteria");
            setIsGeneratingFilters(false);
          }, 1000);
        }
      } catch (e) {
        console.error("Failed to parse criteria suggestion", e);
        setIsGeneratingFilters(false);
      }
    } else if (optionId.startsWith("suggest_multiple_criteria:")) {
      try {
        setIsGeneratingFilters(true);
        const criteriaList = JSON.parse(
          optionId.replace("suggest_multiple_criteria:", "")
        );
        if (Array.isArray(criteriaList) && criteriaList.length > 0) {
          setTimeout(() => {
            const newCriteriaItems = criteriaList.map((criteriaItem) => {
              const isRequired = requiredCriteriaTypes.includes(
                criteriaItem.type || ""
              );
              return {
                id:
                  Date.now().toString() +
                  Math.random().toString(36).substr(2, 5),
                type: criteriaItem.type || "UnknownType",
                value: criteriaItem.value || "",
                rule: criteriaItem.rule || "equals",
                and_or: criteriaItem.and_or || "OR",
                isRequired,
              };
            });
            setFilterCriteria((prev) => [...prev, ...newCriteriaItems]); // Functional update
            setCriteriaType("");
            setCriteriaValue("");
            setCriteriaRule("equals");
            setCriteriaAndOr("OR");
            setLastGeneratedFilter("multiple");
            setIsGeneratingFilters(false);
          }, 1200);
        }
      } catch (e) {
        console.error("Failed to parse multiple criteria suggestions", e);
        setIsGeneratingFilters(false);
      }
    } else if (optionId.startsWith("suggest_complete_filter:")) {
      try {
        setIsGeneratingFilters(true);
        interface CompleteFilterData {
          name?: string;
          queryViewName?: string;
          description?: string;
          expiryDate?: string;
          criteria?: Array<Partial<FilterCriteria>>;
        }
        const filterData: CompleteFilterData = JSON.parse(
          optionId.replace("suggest_complete_filter:", "")
        );
        setTimeout(() => {
          if (filterData.name) setFilterName(filterData.name);
          if (filterData.queryViewName)
            setQueryViewName(filterData.queryViewName);
          if (filterData.description) setDescription(filterData.description);
          if (filterData.expiryDate) {
            const date = new Date(filterData.expiryDate);
            if (!isNaN(date.getTime())) setExpiryDate(date);
          }
          if (
            Array.isArray(filterData.criteria) &&
            filterData.criteria.length > 0
          ) {
            const newCriteriaItems: FilterCriteria[] = filterData.criteria.map(
              (criteriaItem): FilterCriteria => {
                const isRequired = requiredCriteriaTypes.includes(
                  criteriaItem.type || ""
                );
                return {
                  id:
                    Date.now().toString() +
                    Math.random().toString(36).substr(2, 5),
                  type: criteriaItem.type || "UnknownType",
                  value: criteriaItem.value || "",
                  rule: criteriaItem.rule || "equals",
                  and_or: criteriaItem.and_or || "OR",
                  isRequired,
                };
              }
            );
            setFilterCriteria(newCriteriaItems); // Replace criteria
            setLastGeneratedFilter("complete");
          }
          setIsGeneratingFilters(false);
        }, 1500);
      } catch (e) {
        console.error("Failed to parse complete filter suggestion", e);
        setIsGeneratingFilters(false);
      }
    } else if (optionId.startsWith("apply_updates:")) {
      // *** ADDED NEW HANDLER ***
      try {
        setIsGeneratingFilters(true); // Optional: show thinking indicator
        interface UpdatePayload {
          criteriaToAdd?: Partial<FilterCriteria>[];
          filterName?: string;
          // Add other fields if AI might update them (description, expiryDate etc)
        }
        const updateData: UpdatePayload = JSON.parse(
          optionId.replace("apply_updates:", "")
        );

        // Apply updates after a short delay
        setTimeout(() => {
          if (updateData.filterName) {
            setFilterName(updateData.filterName);
          }
          if (
            Array.isArray(updateData.criteriaToAdd) &&
            updateData.criteriaToAdd.length > 0
          ) {
            const newValidCriteria: FilterCriteria[] = updateData.criteriaToAdd
              .filter((item) => item.type && item.value) // Basic validation
              .map((item) => {
                const isRequired = requiredCriteriaTypes.includes(item.type!);
                return {
                  id:
                    Date.now().toString() +
                    Math.random().toString(36).substr(2, 5),
                  type: item.type!,
                  value: item.value!,
                  rule: item.rule || "equals",
                  and_or: item.and_or || "OR",
                  isRequired:
                    item.isRequired !== undefined
                      ? item.isRequired
                      : isRequired,
                };
              });
            setFilterCriteria((prev) => [...prev, ...newValidCriteria]); // Append new criteria
            setLastGeneratedFilter("criteria"); // Use existing notification type
          }
          setIsGeneratingFilters(false);
        }, 500); // Shorter delay for applying updates
      } catch (e) {
        console.error("Failed to parse update payload:", e);
        setIsGeneratingFilters(false);
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
      <div className="flex-1 min-h-0" style={{ height: "calc(100vh - 160px)" }}>
        <div className="flex gap-3 h-full">
          {/* Left Column - AI Assistant Panel */}
          <div
            className="h-full overflow-hidden flex flex-col"
            style={{ width: "448px" }}
          >
            <Card className="p-0 h-full flex flex-col">
              <AIAssistantPanel
                onOptionSelected={handleOptionSelected}
                requiredCriteriaTypes={requiredCriteriaTypes}
                className="flex-grow"
                title="AI Filter Assistant"
                description="Tell me what offers you want to filter"
              />
              {isGeneratingFilters && (
                <div className="absolute inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center">
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

          {/* Right Column - Filter Configuration */}
          <div className="flex-1 h-full">
            {lastGeneratedFilter && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-3 p-2 bg-primary/10 border border-primary/30 rounded-md flex items-center"
                onAnimationComplete={() => {
                  // Clear the notification after 5 seconds
                  setTimeout(() => setLastGeneratedFilter(null), 5000);
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
                  onClick={() => setLastGeneratedFilter(null)}
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
            <Card className="p-0 h-full flex flex-col">
              <div className="flex items-center justify-between p-3 border-b bg-muted/20">
                <div className="flex items-center">
                  <FunnelIcon className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium">Product Filter Configuration</h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleCancel} size="sm">
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateFilter}
                    disabled={!isFormValid() || !hasAllRequiredCriteria()}
                    size="sm"
                  >
                    Create Filter
                  </Button>
                </div>
              </div>

              <div className="flex-grow p-4 overflow-auto">
                <div className="grid grid-cols-12 gap-6 h-full">
                  {/* Left side - Basic Information and Status */}
                  <div className="col-span-5 space-y-6">
                    {/* Basic Information Section */}
                    <Accordion
                      type="single"
                      collapsible
                      defaultValue="basic-info"
                      className="border rounded-md"
                    >
                      <AccordionItem value="basic-info" className="border-none">
                        <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                          Basic Information
                        </AccordionTrigger>
                        <AccordionContent className="px-4">
                          <div className="space-y-4 pb-2">
                            <div>
                              <Label htmlFor="filter-name" className="text-sm">
                                Filter Name*
                              </Label>
                              <Input
                                id="filter-name"
                                placeholder="Enter filter name"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label htmlFor="query-view" className="text-sm">
                                Query View Name*
                              </Label>
                              <Input
                                id="query-view"
                                placeholder="Enter query view name"
                                value={queryViewName}
                                onChange={(e) =>
                                  setQueryViewName(e.target.value)
                                }
                                className="mt-1"
                              />
                            </div>

                            <div>
                              <Label htmlFor="description" className="text-sm">
                                Description
                              </Label>
                              <Textarea
                                id="description"
                                placeholder="Describe what this filter does"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1"
                                rows={2}
                              />
                            </div>

                            <div>
                              <Label htmlFor="expiry-date" className="text-sm">
                                Expiry Date*
                              </Label>
                              <DatePicker
                                id="expiry-date"
                                selected={expiryDate}
                                onSelect={setExpiryDate}
                                placeholder="Select expiry date"
                                className="mt-1 w-full"
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {/* Required Fields Status */}
                    <div className="border rounded-md p-4">
                      <h4 className="text-sm font-medium mb-3 flex items-center">
                        <span>Required Fields</span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {
                            requiredCriteriaTypes.filter((type) =>
                              filterCriteria.some(
                                (c: FilterCriteria) => c.type === type
                              )
                            ).length
                          }{" "}
                          / {requiredCriteriaTypes.length}
                        </Badge>
                      </h4>

                      <div className="grid grid-cols-2 gap-2">
                        {requiredCriteriaTypes.map((type) => (
                          <div
                            key={type}
                            className={`text-xs p-2 rounded-md flex items-center ${
                              filterCriteria.some(
                                (c: FilterCriteria) => c.type === type
                              )
                                ? "bg-green-50 text-green-800"
                                : "bg-gray-50 text-gray-500"
                            }`}
                          >
                            {filterCriteria.some(
                              (c: FilterCriteria) => c.type === type
                            ) ? (
                              <CheckCircleIcon className="h-3.5 w-3.5 mr-1.5" />
                            ) : (
                              <span className="h-3.5 w-3.5 mr-1.5 rounded-full bg-gray-200" />
                            )}
                            <span className="truncate">
                              {friendlyTypeNames[type] || type}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right side - Filter Builder and Conditions */}
                  <div className="col-span-7 flex flex-col space-y-4">
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
                        </AccordionTrigger>
                        <AccordionContent className="px-4">
                          <div className="space-y-3 pb-2">
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span>Find offers where</span>

                              <Select
                                value={criteriaType}
                                onValueChange={setCriteriaType}
                              >
                                <SelectTrigger className="min-w-[160px] h-8">
                                  <SelectValue placeholder="select a field" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="required_header" disabled>
                                    -- Required Fields --
                                  </SelectItem>
                                  {requiredCriteriaTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {friendlyTypeNames[type] || type}{" "}
                                      {filterCriteria.some(
                                        (c: FilterCriteria) => c.type === type
                                      ) && "✓"}
                                    </SelectItem>
                                  ))}
                                  <SelectItem value="optional_header" disabled>
                                    -- Optional Fields --
                                  </SelectItem>
                                  {optionalCriteriaTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {friendlyTypeNames[type] || type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <Select
                                value={criteriaRule}
                                onValueChange={setCriteriaRule}
                              >
                                <SelectTrigger className="min-w-[130px] h-8">
                                  <SelectValue placeholder="comparison" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Object.entries(friendlyRuleNames).map(
                                    ([value, label]) => (
                                      <SelectItem key={value} value={value}>
                                        {label}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>

                              <Input
                                placeholder="value"
                                value={criteriaValue}
                                onChange={(e) =>
                                  setCriteriaValue(e.target.value)
                                }
                                className="h-8 w-[130px]"
                              />

                              <span>connect with</span>

                              <Select
                                value={criteriaAndOr}
                                onValueChange={setCriteriaAndOr}
                              >
                                <SelectTrigger className="w-[90px] h-8">
                                  <SelectValue placeholder="operator" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="OR">
                                    <span className="font-medium">OR</span>
                                  </SelectItem>
                                  <SelectItem value="AND">
                                    <span className="font-medium">AND</span>
                                  </SelectItem>
                                </SelectContent>
                              </Select>

                              <Button
                                onClick={addCriteria}
                                disabled={!criteriaType || !criteriaValue}
                                size="sm"
                                className="h-8"
                              >
                                <PlusIcon className="h-3.5 w-3.5 mr-1" />
                                Add
                              </Button>
                            </div>

                            <div className="text-xs text-muted-foreground">
                              {criteriaType &&
                              requiredCriteriaTypes.includes(criteriaType)
                                ? "This is a required field. Offers matching this condition will be included."
                                : criteriaType
                                  ? "This is an optional field. Offers matching this condition will be excluded."
                                  : "Select a field to get started."}
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {/* Current Conditions */}
                    <div className="flex-grow flex flex-col border rounded-md overflow-hidden">
                      <div className="border-b p-3">
                        <h4 className="text-sm font-medium flex items-center">
                          Current Conditions
                          <Tooltip content="All required conditions must be added before saving">
                            <InformationCircleIcon className="h-4 w-4 ml-1 text-muted-foreground" />
                          </Tooltip>
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 flex-grow overflow-hidden">
                        {/* Include Rules */}
                        <div className="border-r flex flex-col">
                          <div className="bg-green-50 text-green-800 px-3 py-1.5 text-xs font-medium flex items-center justify-between border-b">
                            <div className="flex items-center">
                              <CheckCircleIcon className="h-3.5 w-3.5 mr-1.5" />
                              <span>INCLUDE OFFERS</span>
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

                          <ScrollArea className="flex-grow p-2">
                            {filterCriteria.filter(
                              (c: FilterCriteria) => c.isRequired
                            ).length === 0 ? (
                              <div className="text-xs text-muted-foreground p-4 text-center">
                                No include conditions added yet
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {filterCriteria
                                  .filter((c: FilterCriteria) => c.isRequired)
                                  .map((criteria: FilterCriteria) => (
                                    <div
                                      key={criteria.id}
                                      className="border rounded-md p-2.5 relative hover:shadow-sm transition-all group"
                                    >
                                      <button
                                        onClick={() =>
                                          removeCriteria(criteria.id)
                                        }
                                        className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove condition"
                                      >
                                        <XCircleIcon className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                      </button>

                                      <div className="text-xs">
                                        <div className="font-medium mb-1.5">
                                          {friendlyTypeNames[criteria.type] ||
                                            criteria.type}
                                        </div>
                                        <div className="flex items-center flex-wrap gap-1">
                                          <span className="text-muted-foreground">
                                            {friendlyRuleNames[criteria.rule] ||
                                              criteria.rule}
                                          </span>
                                          <Badge
                                            variant="outline"
                                            className="font-mono text-[10px]"
                                          >
                                            {criteria.value}
                                          </Badge>
                                        </div>
                                        <div className="mt-2 flex justify-between items-center">
                                          <Badge
                                            variant="secondary"
                                            className="text-[10px]"
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
                              <span>EXCLUDE OFFERS</span>
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

                          <ScrollArea className="flex-grow p-2">
                            {filterCriteria.filter(
                              (c: FilterCriteria) => !c.isRequired
                            ).length === 0 ? (
                              <div className="text-xs text-muted-foreground p-4 text-center">
                                No exclude conditions added yet
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {filterCriteria
                                  .filter((c: FilterCriteria) => !c.isRequired)
                                  .map((criteria: FilterCriteria) => (
                                    <div
                                      key={criteria.id}
                                      className="border rounded-md p-2.5 relative hover:shadow-sm transition-all group"
                                    >
                                      <button
                                        onClick={() =>
                                          removeCriteria(criteria.id)
                                        }
                                        className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove condition"
                                      >
                                        <XCircleIcon className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                      </button>

                                      <div className="text-xs">
                                        <div className="font-medium mb-1.5">
                                          {friendlyTypeNames[criteria.type] ||
                                            criteria.type}
                                        </div>
                                        <div className="flex items-center flex-wrap gap-1">
                                          <span className="text-muted-foreground">
                                            {friendlyRuleNames[criteria.rule] ||
                                              criteria.rule}
                                          </span>
                                          <Badge
                                            variant="outline"
                                            className="font-mono text-[10px]"
                                          >
                                            {criteria.value}
                                          </Badge>
                                        </div>
                                        <div className="mt-2 flex justify-between items-center">
                                          <Badge
                                            variant="secondary"
                                            className="text-[10px]"
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
  );
}

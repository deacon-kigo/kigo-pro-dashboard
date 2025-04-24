"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import Card from "@/components/atoms/Card/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/Tabs";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
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

// Interface for filter criteria
interface FilterCriteria {
  id: string;
  type: string;
  value: string;
  operator: string;
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
            onSelect={(date) => {
              onSelect(date);
              setIsOpen(false);
            }}
            initialFocus
          />
        </div>
      )}
    </div>
  );
};

export default function ProductFilterCreationView() {
  const router = useRouter();
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
  const [criteriaOperator, setCriteriaOperator] = useState("equals");

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
      filterCriteria.some((criteria) => criteria.type === type)
    );
  };

  // Add new criteria
  const addCriteria = () => {
    if (criteriaType && criteriaValue) {
      const isRequired = requiredCriteriaTypes.includes(criteriaType);
      const newCriteria: FilterCriteria = {
        id: Date.now().toString(),
        type: criteriaType,
        value: criteriaValue,
        operator: criteriaOperator,
        isRequired,
      };

      setFilterCriteria([...filterCriteria, newCriteria]);
      setCriteriaType("");
      setCriteriaValue("");
      setCriteriaOperator("equals");
    }
  };

  // Remove criteria
  const removeCriteria = (id: string) => {
    setFilterCriteria(filterCriteria.filter((c) => c.id !== id));
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Create New Product Filter"
        description="Add a new product filter to control offer display in the TOP platform."
        emoji="✨"
        actions={backButton}
        gradientColors={{
          from: "rgba(226, 240, 253, 0.9)",
          to: "rgba(226, 232, 255, 0.85)",
        }}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="details">Basic Details</TabsTrigger>
          <TabsTrigger value="criteria" disabled={!isFormValid()}>
            Filter Criteria
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-4 space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="filter-name">Filter Name*</Label>
                <Input
                  id="filter-name"
                  placeholder="Enter filter name"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="query-view">Query View Name*</Label>
                <Input
                  id="query-view"
                  placeholder="Enter query view name"
                  value={queryViewName}
                  onChange={(e) => setQueryViewName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter filter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="expiry-date">Expiry Date*</Label>
                <DatePicker
                  id="expiry-date"
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  placeholder="Select expiry date"
                  className="mt-1 w-full"
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={nextTab} disabled={!isFormValid()}>
              Next: Filter Criteria
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="criteria" className="mt-4 space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Add Filter Criteria</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Define the criteria that will be used to filter offers. All
                  required criteria types must be added.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="criteria-type">Criteria Type*</Label>
                  <Select value={criteriaType} onValueChange={setCriteriaType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select criteria type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="required_header" disabled>
                        -- Required Criteria Types --
                      </SelectItem>
                      {requiredCriteriaTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}{" "}
                          {filterCriteria.some((c) => c.type === type) && "✓"}
                        </SelectItem>
                      ))}
                      <SelectItem value="optional_header" disabled>
                        -- Optional Criteria Types --
                      </SelectItem>
                      {optionalCriteriaTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="criteria-operator">Operator</Label>
                  <Select
                    value={criteriaOperator}
                    onValueChange={setCriteriaOperator}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select operator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                      <SelectItem value="startsWith">Starts With</SelectItem>
                      <SelectItem value="endsWith">Ends With</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="criteria-value">Value*</Label>
                  <div className="flex mt-1">
                    <Input
                      id="criteria-value"
                      placeholder="Enter value"
                      value={criteriaValue}
                      onChange={(e) => setCriteriaValue(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={addCriteria}
                      disabled={!criteriaType || !criteriaValue}
                      className="ml-2 p-2 h-9 w-9"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Current Criteria</h4>

                {filterCriteria.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No criteria added yet. All required criteria must be added
                    before saving.
                  </p>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted border-b">
                          <th className="text-left py-2 px-3 font-medium">
                            Type
                          </th>
                          <th className="text-left py-2 px-3 font-medium">
                            Operator
                          </th>
                          <th className="text-left py-2 px-3 font-medium">
                            Value
                          </th>
                          <th className="text-left py-2 px-3 font-medium">
                            Required
                          </th>
                          <th className="text-right py-2 px-3 font-medium">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filterCriteria.map((criteria) => (
                          <tr
                            key={criteria.id}
                            className="border-b last:border-b-0"
                          >
                            <td className="py-2 px-3">{criteria.type}</td>
                            <td className="py-2 px-3">{criteria.operator}</td>
                            <td className="py-2 px-3">{criteria.value}</td>
                            <td className="py-2 px-3">
                              {criteria.isRequired ? "Yes" : "No"}
                            </td>
                            <td className="py-2 px-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeCriteria(criteria.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevTab}>
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Details
            </Button>
            <Button
              onClick={handleCreateFilter}
              disabled={!hasAllRequiredCriteria()}
            >
              Create Product Filter
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

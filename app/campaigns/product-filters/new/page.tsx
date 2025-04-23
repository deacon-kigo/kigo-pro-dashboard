"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/templates/AppLayout/AppLayout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/atoms/Breadcrumb";
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

// Interface for filter criteria
interface FilterCriteria {
  id: string;
  type: string;
  value: string;
  operator: string;
  isRequired: boolean;
}

// Custom DatePicker component
const DatePicker = ({ id, selected, onSelect, placeholder, className }) => {
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

export default function NewProductFilter() {
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

  // Navigation breadcrumb
  const breadcrumb = (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaigns">Campaigns</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/campaigns/product-filters">
            Product Filters
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Create New Filter</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );

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

  return (
    <AppLayout customBreadcrumb={breadcrumb}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Create New Product Filter
            </h1>
            <p className="text-muted-foreground mt-1">
              Define a new filter to control which offers are displayed in the
              TOP platform.
            </p>
          </div>
          <Button variant="outline" onClick={handleCancel} className="gap-1">
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Filters
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="details">Filter Details</TabsTrigger>
            <TabsTrigger value="criteria" disabled={!isFormValid()}>
              Filter Criteria
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4">
            <Card>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="filterName">Product Filter Name</Label>
                      <Input
                        id="filterName"
                        placeholder="e.g., Pizza Edition"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="queryViewName">Query View Name</Label>
                      <Input
                        id="queryViewName"
                        placeholder="e.g., pizza_view"
                        value={queryViewName}
                        onChange={(e) => setQueryViewName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the purpose of this product filter"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <DatePicker
                      id="expiryDate"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      placeholder="Select expiry date"
                      className="w-full relative"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button onClick={nextTab} disabled={!isFormValid()}>
                      Continue to Filter Criteria
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="criteria" className="mt-4">
            <Card>
              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Add Filter Criteria
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Define criteria that will determine which offers are
                      included in this filter.
                    </p>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                      <div className="space-y-2">
                        <Label htmlFor="criteriaType">Criteria Type</Label>
                        <Select
                          value={criteriaType}
                          onValueChange={setCriteriaType}
                        >
                          <SelectTrigger id="criteriaType">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">Select type</SelectItem>
                            {requiredCriteriaTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type} (Required)
                              </SelectItem>
                            ))}
                            {optionalCriteriaTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="criteriaOperator">Operator</Label>
                        <Select
                          value={criteriaOperator}
                          onValueChange={setCriteriaOperator}
                        >
                          <SelectTrigger id="criteriaOperator">
                            <SelectValue placeholder="Select operator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                            <SelectItem value="startsWith">
                              Starts With
                            </SelectItem>
                            <SelectItem value="endsWith">Ends With</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="criteriaValue">Value</Label>
                        <Input
                          id="criteriaValue"
                          placeholder="Enter criteria value"
                          value={criteriaValue}
                          onChange={(e) => setCriteriaValue(e.target.value)}
                        />
                      </div>

                      <div className="flex items-end">
                        <Button
                          onClick={addCriteria}
                          disabled={!criteriaType || !criteriaValue}
                        >
                          <PlusIcon className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Required Criteria
                    </h3>

                    {requiredCriteriaTypes.map((type) => {
                      const hasCriteria = filterCriteria.some(
                        (c) => c.type === type
                      );
                      return (
                        <div
                          key={type}
                          className="flex items-center py-2 border-b"
                        >
                          <div className="w-6 h-6 mr-2 flex-shrink-0">
                            {hasCriteria ? (
                              <span className="text-green-500">✓</span>
                            ) : (
                              <span className="text-red-500">•</span>
                            )}
                          </div>
                          <div className="flex-grow font-medium">{type}</div>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">
                      Current Criteria
                    </h3>

                    {filterCriteria.length === 0 ? (
                      <p className="text-muted-foreground">
                        No criteria added yet.
                      </p>
                    ) : (
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Operator
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Value
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Required
                              </th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {filterCriteria.map((criteria) => (
                              <tr key={criteria.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {criteria.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {criteria.operator}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {criteria.value}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {criteria.isRequired ? "Yes" : "No"}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => removeCriteria(criteria.id)}
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

                  <div className="pt-4 flex justify-between">
                    <Button variant="outline" onClick={prevTab}>
                      Back to Details
                    </Button>
                    <Button
                      onClick={handleCreateFilter}
                      disabled={!hasAllRequiredCriteria()}
                    >
                      Create Product Filter
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface GoalSettingStepProps {
  formData: {
    businessObjective: string;
    programType: string;
    targetAudience: string[];
    maxDiscount: string;
    maxDiscountUnit: string;
    totalBudget: string;
    startDate: string;
    endDate: string;
  };
  onUpdate: (field: string, value: any) => void;
  onNext: () => void;
  onAskAI: (field: string) => void;
}

export default function GoalSettingStep({
  formData,
  onUpdate,
  onNext,
  onAskAI,
}: GoalSettingStepProps) {
  return (
    <div className="space-y-6">
      {/* Business Objective */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="businessObjective" className="text-sm font-medium">
            Business Objective <span className="text-red-500">*</span>
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAskAI("businessObjective")}
            className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <SparklesIcon className="h-3 w-3 mr-1" />
            Ask AI
          </Button>
        </div>
        <Textarea
          id="businessObjective"
          placeholder='Example: "Increase Q4 parts sales by 20% through seasonal promotion"'
          value={formData.businessObjective}
          onChange={(e) => onUpdate("businessObjective", e.target.value)}
          className="w-full min-h-[80px] text-sm"
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1.5">
          Describe what you want to achieve with this offer in natural language
        </p>
      </div>

      {/* Program Type */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-medium">
            Program Type <span className="text-red-500">*</span>
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAskAI("programType")}
            className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <SparklesIcon className="h-3 w-3 mr-1" />
            Ask AI
          </Button>
        </div>
        <RadioGroup
          value={formData.programType}
          onValueChange={(value) => onUpdate("programType", value)}
          className="space-y-3"
        >
          <label className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <RadioGroupItem value="john_deere" className="mt-1 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                John Deere - Closed Loop
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Dealer network only, restricted to authorized locations
              </p>
            </div>
          </label>

          <label className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <RadioGroupItem value="yardi" className="mt-1 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Yardi - Open Loop
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Tenant rewards + merchant catalog, flexible redemption
              </p>
            </div>
          </label>

          <label className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
            <RadioGroupItem value="general" className="mt-1 mr-3" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                General - Flexible
              </p>
              <p className="text-xs text-gray-600 mt-0.5">
                Custom program configuration, all redemption methods supported
              </p>
            </div>
          </label>
        </RadioGroup>
      </div>

      {/* Target Audience */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-medium">
            Target Audience <span className="text-red-500">*</span>
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAskAI("targetAudience")}
            className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <SparklesIcon className="h-3 w-3 mr-1" />
            Ask AI
          </Button>
        </div>
        <div className="space-y-2">
          {[
            { value: "existing_customers", label: "Existing Customers" },
            { value: "new_prospects", label: "New Prospects" },
            { value: "lapsed_customers", label: "Lapsed Customers (>90 days)" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <Checkbox
                checked={formData.targetAudience.includes(option.value)}
                onCheckedChange={(checked) => {
                  const newAudience = checked
                    ? [...formData.targetAudience, option.value]
                    : formData.targetAudience.filter((a) => a !== option.value);
                  onUpdate("targetAudience", newAudience);
                }}
              />
              <span className="text-sm text-gray-900">{option.label}</span>
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-1.5">
          Select one or more audience segments (per spec: basic audience
          description)
        </p>
      </div>

      {/* Budget Constraints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="maxDiscount" className="text-sm font-medium">
              Max Discount Value
            </Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAskAI("budget")}
              className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <SparklesIcon className="h-3 w-3 mr-1" />
              Ask AI
            </Button>
          </div>
          <div className="flex gap-2">
            <Input
              id="maxDiscount"
              type="number"
              placeholder="20"
              value={formData.maxDiscount}
              onChange={(e) => onUpdate("maxDiscount", e.target.value)}
              className="flex-1 text-sm"
              min="0"
            />
            <Select
              value={formData.maxDiscountUnit || "%"}
              onValueChange={(value) => onUpdate("maxDiscountUnit", value)}
            >
              <SelectTrigger className="w-[80px] text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="%">%</SelectItem>
                <SelectItem value="$">$</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Maximum discount per offer redemption
          </p>
        </div>

        <div>
          <Label htmlFor="totalBudget" className="text-sm font-medium mb-2">
            Total Campaign Spend ($)
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
              $
            </span>
            <Input
              id="totalBudget"
              type="number"
              placeholder="50000"
              value={formData.totalBudget}
              onChange={(e) => onUpdate("totalBudget", e.target.value)}
              className="pl-7 text-sm"
              min="0"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Total budget for this campaign
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm font-medium">
            Timeline <span className="text-red-500">*</span>
          </Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAskAI("timeline")}
            className="h-7 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <SparklesIcon className="h-3 w-3 mr-1" />
            Ask AI
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label
              htmlFor="startDate"
              className="text-xs text-gray-600 mb-1.5 block"
            >
              Start Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-sm",
                    !formData.startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate ? (
                    format(new Date(formData.startDate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    formData.startDate
                      ? new Date(formData.startDate)
                      : undefined
                  }
                  onSelect={(date) =>
                    onUpdate(
                      "startDate",
                      date?.toISOString().split("T")[0] || ""
                    )
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label
              htmlFor="endDate"
              className="text-xs text-gray-600 mb-1.5 block"
            >
              End Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal text-sm",
                    !formData.endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.endDate ? (
                    format(new Date(formData.endDate), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    formData.endDate ? new Date(formData.endDate) : undefined
                  }
                  onSelect={(date) =>
                    onUpdate("endDate", date?.toISOString().split("T")[0] || "")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1.5">
          Campaign start and end dates (per spec: desired campaign start and end
          dates)
        </p>
      </div>
    </div>
  );
}

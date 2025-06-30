"use client";

import React, {
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
  useRef,
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
import { Label } from "@/components/atoms/Label";
import { Textarea } from "@/components/atoms/Textarea";
import {
  ArrowLeftIcon,
  PlusIcon,
  CheckCircleIcon,
  SparklesIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  BanknotesIcon,
  PhotoIcon,
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
import { Badge } from "@/components/atoms/Badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { CampaignAnalyticsPanelLite } from "./CampaignAnalyticsPanelLite";

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

// Helper function to generate unique IDs
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export default function AdvertisementCampaignCreationContent() {
  const router = useRouter();

  // Form state
  const [merchantId, setMerchantId] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [offerId, setOfferId] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [campaignType, setCampaignType] = useState("advertising");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [mediaTypes, setMediaTypes] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ id: string; file: File }>
  >([]);
  const [budget, setBudget] = useState("");
  const [costPerActivation, setCostPerActivation] = useState("");
  const [costPerRedemption, setCostPerRedemption] = useState("");
  const [channels, setChannels] = useState<string[]>([
    "email",
    "social",
    "display",
    "search",
    "in-app",
  ]);
  const [programs, setPrograms] = useState<string[]>([]);

  // UI state
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [backDialogOpen, setBackDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Media type options
  const mediaTypeOptions = [
    "Display Banner",
    "Double Decker",
    "Native",
    "Video",
    "Social Media",
  ];

  // Program options (would typically be fetched from API)
  const programOptions = [
    "Standard Rewards",
    "Premium Loyalty",
    "Partner Network",
    "Merchant Connect",
    "Referral Program",
  ];

  // Helper function to handle image uploads
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Validate file type
      const file = e.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!validTypes.includes(file.type)) {
        setValidationMessage("Please upload JPEG, PNG or GIF images only");
        setTimeout(() => setValidationMessage(null), 5000);
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setValidationMessage("Image size should be less than 5MB");
        setTimeout(() => setValidationMessage(null), 5000);
        return;
      }

      // Add unique ID to each uploaded file
      setUploadedImages([...uploadedImages, { id: generateUniqueId(), file }]);
    }
  };

  // Toggle media type selection
  const toggleMediaType = (type: string) => {
    if (mediaTypes.includes(type)) {
      setMediaTypes(mediaTypes.filter((t) => t !== type));
    } else {
      setMediaTypes([...mediaTypes, type]);
    }
  };

  // Toggle program selection
  const toggleProgram = (program: string) => {
    if (programs.includes(program)) {
      setPrograms(programs.filter((p) => p !== program));
    } else {
      setPrograms([...programs, program]);
    }
  };

  // Handle creation of campaign
  const handleCreateCampaign = () => {
    // Basic validation
    if (
      !campaignName ||
      !campaignDescription ||
      !startDate ||
      !endDate ||
      mediaTypes.length === 0 ||
      uploadedImages.length === 0 ||
      !budget
    ) {
      setValidationMessage("Please fill all required fields");
      setTimeout(() => setValidationMessage(null), 5000);
      return;
    }

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Campaign created successfully!");
      setTimeout(() => {
        setSuccessMessage(null);
        router.push("/campaign-manager");
      }, 2000);
    }, 1500);
  };

  // Handle save as draft
  const handleSaveAsDraft = () => {
    if (!campaignName) {
      setValidationMessage(
        "Please enter at least a campaign name to save as draft"
      );
      setTimeout(() => setValidationMessage(null), 5000);
      return;
    }

    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage("Campaign saved as draft!");
      setTimeout(() => {
        setSuccessMessage(null);
        router.push("/campaign-manager");
      }, 2000);
    }, 1500);
  };

  // Get merchant name (simulated API call)
  const fetchMerchantName = (id: string) => {
    if (id.trim()) {
      setIsLoading(true);
      // Simulate API latency
      setTimeout(() => {
        setIsLoading(false);
        // Mock merchant data
        if (id === "12345") {
          setMerchantName("Coffee Express Inc.");
        } else if (id === "67890") {
          setMerchantName("Global Retail Partners");
        } else {
          setMerchantName(`Merchant ${id}`);
        }
      }, 800);
    } else {
      setMerchantName("");
    }
  };

  // Simulate fetch of merchant when ID changes
  useEffect(() => {
    if (merchantId) {
      fetchMerchantName(merchantId);
    }
  }, [merchantId]);

  // Handler for AI Assistant option selection
  const handleOptionSelected = (optionId: string) => {
    // Handle different AI options here
    console.log("Selected option:", optionId);
  };

  // Create the back button for header
  const backButton = (
    <Button
      variant="outline"
      onClick={() => router.push("/campaign-manager")}
      className="flex items-center gap-1"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      Back to Ads Manager
    </Button>
  );

  return (
    <div className="space-y-2 h-full flex flex-col">
      <PageHeader
        title="Create Ads"
        description="Design and configure your advertisement campaign in one place."
        emoji="📊"
        actions={backButton}
        variant="aurora"
      />

      {/* Main content container with strict viewport-based height */}
      <div
        className="flex-1 flex flex-col"
        style={{ height: "calc(100vh - 160px)" }}
      >
        <div className="flex gap-3 h-full">
          {/* Left Column - AI Assistant Panel */}
          <div
            className="w-1/4 flex-shrink-0"
            style={{
              position: "sticky",
              top: "1rem",
              height: "calc(100vh - 180px)",
            }}
          >
            <Card className="p-0 h-full flex flex-col overflow-hidden shadow-md">
              <div className="flex-1 flex flex-col overflow-hidden">
                <AIAssistantPanel
                  title="AI Campaign Assistant"
                  description="Tell me about the campaign you want to create"
                  onOptionSelected={handleOptionSelected}
                  className="h-full flex-1"
                />
              </div>
              {isLoading && (
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
                      Processing your request...
                    </p>
                  </motion.div>
                </div>
              )}
            </Card>
          </div>

          {/* Middle Column - Campaign Configuration with scrollable content */}
          <div
            className="w-[37.5%] overflow-auto pb-6"
            style={{ height: "100vh" }}
          >
            <div className="flex flex-col h-full">
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
                </motion.div>
              )}

              <Card className="p-0 flex-1 flex flex-col overflow-hidden shadow-md">
                <div className="flex items-center justify-between p-3 border-b bg-muted/20 flex-shrink-0 sticky top-0 z-10">
                  <div className="flex items-center">
                    <BanknotesIcon className="h-5 w-5 mr-2 text-primary" />
                    <h3 className="font-medium">
                      Advertisement Campaign Configuration
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      onClick={handleSaveAsDraft}
                      disabled={!campaignName.trim()}
                      size="sm"
                    >
                      Save as Draft
                    </Button>
                    <Button onClick={handleCreateCampaign} size="sm">
                      Create Campaign
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto">
                  <div className="p-4">
                    <div className="grid grid-cols-12 gap-6">
                      {/* Left side - Merchant & Basic Information */}
                      <div className="col-span-12 space-y-6">
                        {/* Campaign Basic Information */}
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
                              Campaign Information
                            </AccordionTrigger>
                            <AccordionContent className="px-4 text-left">
                              <div className="space-y-5 pb-2 text-left">
                                <div className="text-left">
                                  <Label
                                    htmlFor="campaign-name"
                                    className="text-sm"
                                  >
                                    Campaign Name*
                                  </Label>
                                  <Input
                                    id="campaign-name"
                                    placeholder="Enter campaign name"
                                    value={campaignName}
                                    onChange={(e) =>
                                      setCampaignName(e.target.value)
                                    }
                                    className="mt-1"
                                    maxLength={50}
                                  />
                                  <p className="mt-1.5 text-xs font-medium text-gray-600">
                                    Enter a unique name for your campaign (max
                                    50 characters)
                                  </p>
                                </div>

                                <div className="text-left">
                                  <Label
                                    htmlFor="description"
                                    className="text-sm"
                                  >
                                    Campaign Description*
                                  </Label>
                                  <Textarea
                                    id="description"
                                    placeholder="Enter campaign description"
                                    value={campaignDescription}
                                    onChange={(e) =>
                                      setCampaignDescription(e.target.value)
                                    }
                                    className="mt-1"
                                    rows={3}
                                    maxLength={100}
                                  />
                                  <p className="mt-1.5 text-xs font-medium text-gray-600">
                                    Describe your campaign in detail (max 100
                                    characters)
                                  </p>
                                </div>

                                <div className="text-left">
                                  <Label
                                    htmlFor="campaign-type"
                                    className="text-sm"
                                  >
                                    Campaign Type*
                                  </Label>
                                  <Select
                                    value={campaignType}
                                    onValueChange={setCampaignType}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Select campaign type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="advertising">
                                        Advertising
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <p className="mt-1.5 text-xs font-medium text-gray-600">
                                    Select the type of campaign you want to
                                    create
                                  </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-left">
                                    <Label
                                      htmlFor="start-date"
                                      className="text-sm"
                                    >
                                      Start Date*
                                    </Label>
                                    <DatePicker
                                      id="start-date"
                                      selected={startDate}
                                      onSelect={setStartDate}
                                      placeholder="Select start date"
                                      className="mt-1 w-full"
                                    />
                                  </div>

                                  <div className="text-left">
                                    <Label
                                      htmlFor="end-date"
                                      className="text-sm"
                                    >
                                      End Date*
                                    </Label>
                                    <DatePicker
                                      id="end-date"
                                      selected={endDate}
                                      onSelect={setEndDate}
                                      placeholder="Select end date"
                                      className="mt-1 w-full"
                                    />
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-6">
                            {/* Distribution Information */}
                            <Accordion
                              type="single"
                              collapsible
                              defaultValue="distribution-info"
                              className="border rounded-md"
                            >
                              <AccordionItem
                                value="distribution-info"
                                className="border-none"
                              >
                                <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                                  Distribution
                                </AccordionTrigger>
                                <AccordionContent className="px-4 text-left">
                                  <div className="space-y-5 pb-2 text-left">
                                    <div className="text-left">
                                      <Label className="text-sm mb-2 block">
                                        Channels/Editions*
                                      </Label>
                                      <div className="flex flex-wrap gap-2">
                                        {channels.map((channel) => (
                                          <Badge
                                            key={channel}
                                            variant="default"
                                            className="bg-primary text-primary-foreground"
                                          >
                                            {channel.charAt(0).toUpperCase() +
                                              channel.slice(1)}
                                          </Badge>
                                        ))}
                                      </div>
                                      <p className="mt-1.5 text-xs font-medium text-gray-600">
                                        All channels are selected by default
                                      </p>
                                    </div>

                                    <div className="text-left">
                                      <Label className="text-sm mb-2 block">
                                        Programs
                                      </Label>
                                      <div className="flex flex-wrap gap-2">
                                        {programOptions.map((program) => (
                                          <Badge
                                            key={program}
                                            variant={
                                              programs.includes(program)
                                                ? "default"
                                                : "outline"
                                            }
                                            className={cn(
                                              "cursor-pointer",
                                              programs.includes(program)
                                                ? "bg-primary text-primary-foreground"
                                                : ""
                                            )}
                                            onClick={() =>
                                              toggleProgram(program)
                                            }
                                          >
                                            {program}
                                          </Badge>
                                        ))}
                                      </div>
                                      <p className="mt-1.5 text-xs font-medium text-gray-600">
                                        Select the programs for this campaign
                                      </p>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>

                            {/* Budget Information */}
                            <Accordion
                              type="single"
                              collapsible
                              defaultValue="budget-info"
                              className="border rounded-md"
                            >
                              <AccordionItem
                                value="budget-info"
                                className="border-none"
                              >
                                <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                                  Budget Information
                                </AccordionTrigger>
                                <AccordionContent className="px-4 text-left">
                                  <div className="space-y-5 pb-2 text-left">
                                    <div className="text-left">
                                      <Label
                                        htmlFor="budget"
                                        className="text-sm"
                                      >
                                        Max Budget (USD)*
                                      </Label>
                                      <Input
                                        id="budget"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Enter max budget amount"
                                        value={budget}
                                        onChange={(e) =>
                                          setBudget(e.target.value)
                                        }
                                        className="mt-1"
                                      />
                                      <p className="mt-1.5 text-xs font-medium text-gray-600">
                                        The maximum budget allocated for this
                                        campaign
                                      </p>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>

                          <div className="space-y-6">
                            {/* Media Type Selection */}
                            <Accordion
                              type="single"
                              collapsible
                              defaultValue="media-type"
                              className="border rounded-md"
                            >
                              <AccordionItem
                                value="media-type"
                                className="border-none"
                              >
                                <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                                  Media Type & Assets
                                </AccordionTrigger>
                                <AccordionContent className="px-4 text-left">
                                  <div className="space-y-5 pb-2 text-left">
                                    <div className="text-left">
                                      <Label className="text-sm">
                                        Media Types*
                                      </Label>
                                      <div className="mt-2 flex flex-wrap gap-2">
                                        {mediaTypeOptions.map((type) => (
                                          <Badge
                                            key={type}
                                            variant={
                                              mediaTypes.includes(type)
                                                ? "default"
                                                : "outline"
                                            }
                                            className={cn(
                                              "cursor-pointer",
                                              mediaTypes.includes(type)
                                                ? "bg-primary text-primary-foreground"
                                                : ""
                                            )}
                                            onClick={() =>
                                              toggleMediaType(type)
                                            }
                                          >
                                            {type}
                                          </Badge>
                                        ))}
                                      </div>
                                      <p className="mt-1.5 text-xs font-medium text-gray-600">
                                        Select the types of media for this
                                        campaign
                                      </p>
                                    </div>

                                    <div className="text-left">
                                      <Label
                                        htmlFor="media-upload"
                                        className="text-sm"
                                      >
                                        Upload Media Assets*
                                      </Label>
                                      <div className="mt-2 border-2 border-dashed rounded-md border-gray-300 p-6 text-center">
                                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="mt-2">
                                          <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md bg-white font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                                          >
                                            <span className="text-sm">
                                              Upload an image
                                            </span>
                                            <input
                                              id="file-upload"
                                              name="file-upload"
                                              type="file"
                                              className="sr-only"
                                              accept="image/*"
                                              onChange={handleImageUpload}
                                            />
                                          </label>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                          PNG, JPG, GIF up to 5MB
                                        </p>
                                      </div>

                                      {/* Show uploaded images */}
                                      {uploadedImages.length > 0 && (
                                        <div className="mt-3">
                                          <h4 className="text-sm font-medium mb-2">
                                            Uploaded Media:
                                          </h4>
                                          <div className="flex flex-wrap gap-2">
                                            {uploadedImages.map((fileData) => (
                                              <div
                                                key={fileData.id}
                                                className="relative bg-gray-100 rounded-md p-2"
                                              >
                                                <div className="text-xs truncate max-w-[150px]">
                                                  {fileData.file.name}
                                                </div>
                                                <button
                                                  className="absolute -top-1 -right-1 bg-red-100 text-red-600 rounded-full p-0.5"
                                                  onClick={() => {
                                                    const newImages =
                                                      uploadedImages.filter(
                                                        (img) =>
                                                          img.id !== fileData.id
                                                      );
                                                    setUploadedImages(
                                                      newImages
                                                    );
                                                  }}
                                                >
                                                  <XCircleIcon className="h-4 w-4" />
                                                </button>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>

                            {/* Campaign Summary */}
                            <Accordion
                              type="single"
                              collapsible
                              defaultValue="campaign-summary"
                              className="border rounded-md"
                            >
                              <AccordionItem
                                value="campaign-summary"
                                className="border-none"
                              >
                                <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                                  Campaign Summary
                                </AccordionTrigger>
                                <AccordionContent className="px-4 text-left">
                                  <div className="space-y-3 pb-2 text-left">
                                    {!campaignName && !campaignDescription && (
                                      <p className="text-sm text-gray-500 italic">
                                        Fill out the campaign details to see a
                                        summary here.
                                      </p>
                                    )}

                                    {(campaignName || campaignDescription) && (
                                      <>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                          {campaignName && (
                                            <>
                                              <div className="font-medium">
                                                Campaign:
                                              </div>
                                              <div>{campaignName}</div>

                                              {campaignDescription && (
                                                <>
                                                  <div className="font-medium">
                                                    Description:
                                                  </div>
                                                  <div>
                                                    {campaignDescription}
                                                  </div>
                                                </>
                                              )}
                                            </>
                                          )}

                                          {campaignType && (
                                            <>
                                              <div className="font-medium">
                                                Type:
                                              </div>
                                              <div className="capitalize">
                                                {campaignType}
                                              </div>
                                            </>
                                          )}

                                          {startDate && endDate && (
                                            <>
                                              <div className="font-medium">
                                                Duration:
                                              </div>
                                              <div>
                                                {format(
                                                  startDate,
                                                  "MMM d, yyyy"
                                                )}{" "}
                                                -{" "}
                                                {format(endDate, "MMM d, yyyy")}
                                              </div>
                                            </>
                                          )}

                                          {budget && (
                                            <>
                                              <div className="font-medium">
                                                Budget:
                                              </div>
                                              <div>${budget} USD</div>
                                            </>
                                          )}

                                          {mediaTypes.length > 0 && (
                                            <>
                                              <div className="font-medium">
                                                Media Types:
                                              </div>
                                              <div>{mediaTypes.join(", ")}</div>
                                            </>
                                          )}

                                          {programs.length > 0 && (
                                            <>
                                              <div className="font-medium">
                                                Programs:
                                              </div>
                                              <div>
                                                {programs.length} program(s)
                                                selected
                                              </div>
                                            </>
                                          )}
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-gray-200">
                                          <Button
                                            onClick={handleCreateCampaign}
                                            className="w-full"
                                          >
                                            Create Campaign
                                          </Button>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Right Column - Campaign Progress Checklist */}
          <div className="w-[37.5%] flex-shrink-0 h-full">
            <Card className="h-full p-0 flex flex-col overflow-hidden shadow-md">
              <div className="flex-1 overflow-hidden">
                <CampaignAnalyticsPanelLite className="h-full flex-1" />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

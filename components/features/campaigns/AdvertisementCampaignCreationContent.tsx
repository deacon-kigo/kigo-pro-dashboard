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
  MapPinIcon,
  XMarkIcon,
  DocumentIcon,
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
import { CampaignAnalyticsPanel } from "./CampaignAnalyticsPanel";
import { useDispatch, useSelector } from "react-redux";
import {
  setMerchantId,
  setMerchantName,
  setOfferId,
  setCampaignName,
  setCampaignDescription,
  setStartDate,
  setEndDate,
  setCampaignWeight,
  setMediaTypes,
  addMediaType,
  removeMediaType,
  addLocation,
  removeLocation,
  setBudget,
  setCostPerActivation,
  setCostPerRedemption,
  addImage,
  removeImage,
  applyAICampaignUpdate,
} from "@/lib/redux/slices/adsCampaignSlice";
import {
  selectMerchantId,
  selectMerchantName,
  selectOfferId,
  selectCampaignName,
  selectCampaignDescription,
  selectStartDate,
  selectEndDate,
  selectCampaignWeight,
  selectMediaTypes,
  selectLocations,
  selectBudget,
  selectCostPerActivation,
  selectCostPerRedemption,
  selectImages,
  selectIsFormValid,
} from "@/lib/redux/selectors/adsCampaignSelectors";
import { setAdsCampaignContext } from "@/lib/redux/slices/ai-assistantSlice";

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
  const dispatch = useDispatch();

  // Form state from Redux
  const merchantId = useSelector(selectMerchantId);
  const merchantName = useSelector(selectMerchantName);
  const offerId = useSelector(selectOfferId);
  const campaignName = useSelector(selectCampaignName);
  const campaignDescription = useSelector(selectCampaignDescription);
  const startDate = useSelector(selectStartDate)
    ? new Date(useSelector(selectStartDate)!)
    : null;
  const endDate = useSelector(selectEndDate)
    ? new Date(useSelector(selectEndDate)!)
    : null;
  const campaignWeight = useSelector(selectCampaignWeight);
  const mediaTypes = useSelector(selectMediaTypes);
  const locations = useSelector(selectLocations);
  const budget = useSelector(selectBudget);
  const costPerActivation = useSelector(selectCostPerActivation);
  const costPerRedemption = useSelector(selectCostPerRedemption);
  const uploadedImages = useSelector(selectImages);
  const isFormValid = useSelector(selectIsFormValid);

  // UI state (keep as local state)
  const [validationMessage, setValidationMessage] = useState<string | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [backDialogOpen, setBackDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Location form state (keep as local state for the form)
  const [locationType, setLocationType] = useState<"state" | "msa" | "zipcode">(
    "state"
  );
  const [locationValue, setLocationValue] = useState("");

  // Media type options
  const mediaTypeOptions = [
    "Display Banner",
    "Double Decker",
    "Native",
    "Video",
    "Social Media",
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

      // Add to Redux state
      dispatch(
        addImage({
          fileName: file.name,
          file: file,
        })
      );
    }
  };

  // Handle location add
  const handleAddLocation = () => {
    if (locationValue) {
      // Validate if adding a state or MSA when the other type already exists
      if (
        locationType === "state" &&
        locations.some((loc) => loc.type === "msa")
      ) {
        setValidationMessage(
          "You cannot select state when MSA is already selected"
        );
        setTimeout(() => setValidationMessage(null), 5000);
        return;
      }

      if (
        locationType === "msa" &&
        locations.some((loc) => loc.type === "state")
      ) {
        setValidationMessage(
          "You cannot select MSA when state is already selected"
        );
        setTimeout(() => setValidationMessage(null), 5000);
        return;
      }

      // Add location to Redux state
      dispatch(
        addLocation({
          type: locationType,
          value: locationValue,
        })
      );

      setLocationValue("");
    }
  };

  // Remove location
  const handleRemoveLocation = (idToRemove: string) => {
    dispatch(removeLocation(idToRemove));
  };

  // Toggle media type selection
  const toggleMediaType = (type: string) => {
    if (mediaTypes.includes(type)) {
      dispatch(removeMediaType(type));
    } else {
      dispatch(addMediaType(type));
    }
  };

  // Handle creation of campaign
  const handleCreateCampaign = () => {
    // Basic validation
    if (!isFormValid) {
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
          dispatch(setMerchantName("Coffee Express Inc."));
        } else if (id === "67890") {
          dispatch(setMerchantName("Global Retail Partners"));
        } else {
          dispatch(setMerchantName(`Merchant ${id}`));
        }
      }, 800);
    } else {
      dispatch(setMerchantName(""));
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
    console.log("Selected option:", optionId);

    // Handle apply_updates command for campaign updates
    if (optionId.startsWith("apply_updates:")) {
      try {
        // Extract the JSON payload from the option ID
        const updatesJson = optionId.replace("apply_updates:", "");
        const updates = JSON.parse(updatesJson);

        console.log("Parsed campaign updates:", updates);

        // Dispatch action to update the campaign in Redux store
        dispatch(
          applyAICampaignUpdate({
            merchantId: updates.merchantId,
            merchantName: updates.merchantName,
            offerId: updates.offerId,
            campaignName: updates.campaignName,
            campaignDescription: updates.campaignDescription,
            startDate: updates.startDate
              ? new Date(updates.startDate)
              : undefined,
            endDate: updates.endDate ? new Date(updates.endDate) : undefined,
            campaignWeight: updates.campaignWeight,
            mediaTypes: updates.mediaTypes,
            locations: updates.locations,
            budget: updates.budget,
            costPerActivation: updates.costPerActivation,
            costPerRedemption: updates.costPerRedemption,
          })
        );

        // Show success message
        setSuccessMessage("Campaign updated with AI suggestions!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error("Error applying campaign updates:", error);
        setValidationMessage(
          "Failed to apply AI suggestions. Please try again."
        );
        setTimeout(() => setValidationMessage(null), 3000);
      }
    }
  };

  // Update AI assistant context when campaign data changes
  useEffect(() => {
    console.log("Setting ads campaign context with data:", {
      merchantId,
      merchantName,
      offerId,
      campaignName,
      campaignDescription,
      startDate,
      endDate,
      campaignWeight,
      mediaTypes,
      locations,
      budget,
    });

    dispatch(
      setAdsCampaignContext({
        merchantId,
        merchantName,
        offerId,
        campaignName,
        campaignDescription,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
        campaignWeight,
        mediaTypes,
        locations,
        budget,
      })
    );
  }, [
    dispatch,
    merchantId,
    merchantName,
    offerId,
    campaignName,
    campaignDescription,
    startDate,
    endDate,
    campaignWeight,
    mediaTypes,
    locations,
    budget,
  ]);

  // Create the back button for header
  const backButton = (
    <Button
      variant="outline"
      onClick={() => router.push("/campaign-manager")}
      className="flex items-center gap-1"
    >
      <ArrowLeftIcon className="h-4 w-4" />
      Back to Campaigns
    </Button>
  );

  // Handle remove image function
  const handleRemoveImage = (id: string) => {
    dispatch(removeImage(id));
  };

  return (
    <div className="space-y-2 h-full flex flex-col">
      <PageHeader
        title="Create Advertisement Campaign"
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
          {/* Left Column - AI Assistant Panel with fixed height and position */}
          <div
            className="w-[320px] flex-shrink-0"
            style={{
              position: "sticky",
              top: "1rem",
              height: "calc(100vh - 180px)",
            }}
          >
            <AIAssistantPanel
              className="h-full"
              title="AI Campaign Assistant"
              description="I can help create effective ad campaigns"
              onOptionSelected={handleOptionSelected}
              showWorkflowUI={true}
              onWorkflowComplete={(results) => {
                console.log("Workflow completed:", results);
                // Handle workflow results if needed
              }}
              noHeader={false}
            />
          </div>

          {/* Middle Column - Campaign Configuration with scrollable content */}
          <div className="flex-1 overflow-auto pb-6">
            <div className="flex flex-col">
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

              <Card className="p-0">
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

                <div className="p-4">
                  <div className="grid grid-cols-12 gap-6">
                    {/* Left side - Merchant & Basic Information */}
                    <div className="col-span-12 space-y-6">
                      {/* Merchant Information Section */}
                      <Accordion
                        type="single"
                        collapsible
                        defaultValue="merchant-info"
                        className="border rounded-md"
                      >
                        <AccordionItem
                          value="merchant-info"
                          className="border-none"
                        >
                          <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                            Merchant Information
                          </AccordionTrigger>
                          <AccordionContent className="px-4 text-left">
                            <div className="space-y-5 pb-2 text-left">
                              <div className="text-left">
                                <Label
                                  htmlFor="merchant-id"
                                  className="text-sm"
                                >
                                  Merchant ID*
                                </Label>
                                <Input
                                  id="merchant-id"
                                  placeholder="Enter merchant ID"
                                  value={merchantId}
                                  onChange={(e) =>
                                    dispatch(setMerchantId(e.target.value))
                                  }
                                  className="mt-1"
                                />
                                <p className="mt-1.5 text-xs font-medium text-gray-600">
                                  Enter the unique identifier for the merchant
                                </p>
                              </div>

                              <div className="text-left">
                                <Label
                                  htmlFor="merchant-name"
                                  className="text-sm"
                                >
                                  Merchant Name (Auto-filled)
                                </Label>
                                <Input
                                  id="merchant-name"
                                  value={merchantName}
                                  readOnly
                                  className="mt-1 bg-gray-50"
                                />
                                {!merchantName && merchantId && (
                                  <p className="mt-1.5 text-xs font-medium text-red-500">
                                    Merchant not found
                                  </p>
                                )}
                              </div>

                              <div className="text-left">
                                <Label htmlFor="offer-id" className="text-sm">
                                  Offer ID*
                                </Label>
                                <Select
                                  value={offerId}
                                  onValueChange={(value) =>
                                    dispatch(setOfferId(value))
                                  }
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select an offer" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="off-123">
                                      Off-123: Summer Promo
                                    </SelectItem>
                                    <SelectItem value="off-456">
                                      Off-456: Holiday Special
                                    </SelectItem>
                                    <SelectItem value="off-789">
                                      Off-789: Clearance Sale
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="mt-1.5 text-xs font-medium text-gray-600">
                                  Select from available offers
                                </p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

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
                                    dispatch(setCampaignName(e.target.value))
                                  }
                                  className="mt-1"
                                  maxLength={50}
                                />
                                <p className="mt-1.5 text-xs font-medium text-gray-600">
                                  Enter a unique name for your campaign (max 50
                                  characters)
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
                                    dispatch(
                                      setCampaignDescription(e.target.value)
                                    )
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
                                    onSelect={(date) =>
                                      dispatch(setStartDate(date))
                                    }
                                    placeholder="Select start date"
                                    className="mt-1 w-full"
                                  />
                                </div>

                                <div className="text-left">
                                  <Label htmlFor="end-date" className="text-sm">
                                    End Date*
                                  </Label>
                                  <DatePicker
                                    id="end-date"
                                    selected={endDate}
                                    onSelect={(date) =>
                                      dispatch(setEndDate(date))
                                    }
                                    placeholder="Select end date"
                                    className="mt-1 w-full"
                                  />
                                </div>
                              </div>

                              <div className="text-left">
                                <Label
                                  htmlFor="campaign-weight"
                                  className="text-sm"
                                >
                                  Campaign Weight*
                                </Label>
                                <Select
                                  value={campaignWeight}
                                  onValueChange={(value) =>
                                    dispatch(setCampaignWeight(value))
                                  }
                                >
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select campaign weight" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="small">Small</SelectItem>
                                    <SelectItem value="medium">
                                      Medium
                                    </SelectItem>
                                    <SelectItem value="large">Large</SelectItem>
                                  </SelectContent>
                                </Select>
                                <p className="mt-1.5 text-xs font-medium text-gray-600">
                                  Determines the priority and resources for this
                                  campaign
                                </p>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-6">
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
                                    <Label htmlFor="budget" className="text-sm">
                                      Budget (USD)*
                                    </Label>
                                    <Input
                                      id="budget"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      placeholder="Enter budget amount"
                                      value={budget}
                                      onChange={(e) =>
                                        dispatch(setBudget(e.target.value))
                                      }
                                      className="mt-1"
                                    />
                                    <p className="mt-1.5 text-xs font-medium text-gray-600">
                                      The total budget allocated for this
                                      campaign
                                    </p>
                                  </div>

                                  <div className="text-left">
                                    <Label
                                      htmlFor="cost-per-activation"
                                      className="text-sm"
                                    >
                                      Cost Per Activation (USD)
                                    </Label>
                                    <Input
                                      id="cost-per-activation"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      placeholder="Enter cost per activation"
                                      value={costPerActivation}
                                      onChange={(e) =>
                                        dispatch(
                                          setCostPerActivation(e.target.value)
                                        )
                                      }
                                      className="mt-1"
                                    />
                                  </div>

                                  <div className="text-left">
                                    <Label
                                      htmlFor="cost-per-redemption"
                                      className="text-sm"
                                    >
                                      Cost Per Redemption (USD)
                                    </Label>
                                    <Input
                                      id="cost-per-redemption"
                                      type="number"
                                      min="0"
                                      step="0.01"
                                      placeholder="Enter cost per redemption"
                                      value={costPerRedemption}
                                      onChange={(e) =>
                                        dispatch(
                                          setCostPerRedemption(e.target.value)
                                        )
                                      }
                                      className="mt-1"
                                    />
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>

                          {/* Location Targeting */}
                          <Accordion
                            type="single"
                            collapsible
                            defaultValue="location-targeting"
                            className="border rounded-md"
                          >
                            <AccordionItem
                              value="location-targeting"
                              className="border-none"
                            >
                              <AccordionTrigger className="px-4 py-3 text-sm font-medium">
                                Location Targeting
                              </AccordionTrigger>
                              <AccordionContent className="px-4 text-left">
                                <div className="space-y-5 pb-2 text-left">
                                  <div className="text-left">
                                    <Label className="text-sm">
                                      Target Locations*
                                    </Label>

                                    <div className="mt-2 flex items-end gap-2">
                                      <div className="flex-1">
                                        <Select
                                          value={locationType}
                                          onValueChange={(value: any) =>
                                            setLocationType(value)
                                          }
                                        >
                                          <SelectTrigger className="w-28 shrink-0">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="state">
                                              State
                                            </SelectItem>
                                            <SelectItem value="msa">
                                              MSA
                                            </SelectItem>
                                            <SelectItem value="zipcode">
                                              Zipcode
                                            </SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>

                                      <div className="flex-1">
                                        <Input
                                          placeholder={`Enter ${locationType}`}
                                          value={locationValue}
                                          onChange={(e) =>
                                            setLocationValue(e.target.value)
                                          }
                                        />
                                      </div>

                                      <Button
                                        onClick={handleAddLocation}
                                        disabled={!locationValue}
                                        size="sm"
                                      >
                                        Add
                                      </Button>
                                    </div>

                                    <p className="mt-1.5 text-xs font-medium text-gray-600">
                                      Note: You cannot mix states and MSAs in
                                      the same campaign
                                    </p>

                                    {/* Show selected locations */}
                                    {locations.length > 0 && (
                                      <div className="mt-3">
                                        <h4 className="text-sm font-medium mb-2">
                                          Selected Locations:
                                        </h4>
                                        <div className="flex flex-wrap gap-2 bg-gray-50 p-2 rounded-md">
                                          {locations.map((loc) => (
                                            <Badge
                                              key={loc.id}
                                              variant="secondary"
                                              className="flex items-center gap-1"
                                            >
                                              <MapPinIcon className="h-3 w-3" />
                                              <span className="capitalize">
                                                {loc.type}:
                                              </span>{" "}
                                              {loc.value}
                                              <button
                                                className="ml-1 text-gray-500 hover:text-red-500"
                                                onClick={() =>
                                                  handleRemoveLocation(loc.id)
                                                }
                                              >
                                                <XMarkIcon className="h-3.5 w-3.5" />
                                              </button>
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
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
                                          onClick={() => toggleMediaType(type)}
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

                                    {/* Display uploaded images */}
                                    {uploadedImages.length > 0 && (
                                      <div className="mt-3 grid grid-cols-2 gap-2">
                                        {uploadedImages.map((fileData) => (
                                          <div
                                            key={fileData.id}
                                            className="relative bg-gray-50 border rounded-md p-2 flex items-center"
                                          >
                                            <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center mr-2">
                                              {fileData.file ? (
                                                <img
                                                  src={URL.createObjectURL(
                                                    fileData.file
                                                  )}
                                                  alt="Uploaded"
                                                  className="h-10 w-10 object-cover rounded"
                                                />
                                              ) : (
                                                <DocumentIcon className="h-6 w-6 text-gray-400" />
                                              )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                              <p className="text-xs font-medium truncate">
                                                {fileData.fileName ||
                                                  fileData.file?.name ||
                                                  "Image file"}
                                              </p>
                                              <p className="text-xs text-gray-500">
                                                {fileData.file?.size
                                                  ? (
                                                      fileData.file.size / 1024
                                                    ).toFixed(0) + " KB"
                                                  : "Unknown size"}
                                              </p>
                                            </div>
                                            <button
                                              className="absolute -top-1 -right-1 bg-red-100 text-red-600 rounded-full p-0.5"
                                              onClick={() =>
                                                handleRemoveImage(fileData.id)
                                              }
                                            >
                                              <XCircleIcon className="h-4 w-4" />
                                            </button>
                                          </div>
                                        ))}
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
                                  {!campaignName && !merchantId && (
                                    <p className="text-sm text-gray-500 italic">
                                      Fill out the campaign details to see a
                                      summary here.
                                    </p>
                                  )}

                                  {(campaignName || merchantId) && (
                                    <>
                                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                        {merchantId && (
                                          <>
                                            <div className="font-medium">
                                              Merchant:
                                            </div>
                                            <div>
                                              {merchantName ||
                                                `ID: ${merchantId}`}
                                            </div>
                                          </>
                                        )}

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
                                                <div>{campaignDescription}</div>
                                              </>
                                            )}
                                          </>
                                        )}

                                        {startDate && endDate && (
                                          <>
                                            <div className="font-medium">
                                              Duration:
                                            </div>
                                            <div>
                                              {format(startDate, "MMM d, yyyy")}{" "}
                                              - {format(endDate, "MMM d, yyyy")}
                                            </div>
                                          </>
                                        )}

                                        {campaignWeight && (
                                          <>
                                            <div className="font-medium">
                                              Weight:
                                            </div>
                                            <div className="capitalize">
                                              {campaignWeight}
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

                                        {locations.length > 0 && (
                                          <>
                                            <div className="font-medium">
                                              Target Locations:
                                            </div>
                                            <div>
                                              {locations.length} location(s)
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
              </Card>
            </div>
          </div>

          {/* Right Column - Campaign Analytics Panel */}
          <div
            className="w-[380px] flex-shrink-0"
            style={{
              position: "sticky",
              top: "1rem",
              height: "calc(100vh - 180px)",
              overflowY: "auto",
            }}
          >
            <CampaignAnalyticsPanel
              className="h-full"
              campaignBudget={parseFloat(budget) || 5000}
              estimatedReach={
                campaignWeight === "small"
                  ? 50000
                  : campaignWeight === "medium"
                    ? 100000
                    : 200000
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}

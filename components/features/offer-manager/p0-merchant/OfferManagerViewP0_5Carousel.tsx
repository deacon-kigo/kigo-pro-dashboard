"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/hooks/use-toast";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BuildingStorefrontIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  TagIcon,
  CalendarDaysIcon,
  DocumentCheckIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";
import { OfferTypeCarousel, StickyTypeIndicator } from "./carousel";
import {
  SectionMerchant,
  SectionOfferTypeDetails,
  SectionContent,
  SectionRedemption,
  SectionClassification,
  SectionDates,
  SectionTerms,
} from "./sections";
import { useSectionCompletion } from "./hooks/useSectionCompletion";
import {
  useFormValidation,
  computeValidationErrors,
} from "./hooks/useFormValidation";
import { OfferPreviewPanel } from "../OfferPreviewPanel";
import { MerchantData } from "./MerchantHybridSearch";
import {
  OfferTypeKey,
  SMART_DEFAULTS,
  getDefaultDates,
  getTermsTemplate,
  getOfferCategoriesForMerchant,
  getCommoditiesForMerchant,
  getSmartHeadline,
  getSmartDescription,
  getAutoRedemptionMethod,
} from "@/lib/constants/offer-templates";
import {
  getCurrentPublisher,
  isMultiBrandPublisher,
} from "@/lib/constants/publisher-brands";

/**
 * P0.6 Offer Manager — Carousel + Accordion + Split-Screen Preview
 *
 * Layout: P0.4 split-screen shell (left Card + right preview Card)
 * Left Card: Header bar with actions, scrollable form with carousel + accordion sections
 * Accordion: Ad manager pattern — each section is standalone, all collapsed by default
 * Right Card: OfferPreviewPanel, live-updating
 */

const SECTION_CONFIG = [
  { id: "merchant", label: "Merchant & Brand", icon: BuildingStorefrontIcon },
  { id: "type-details", label: "Offer Type Details", icon: CurrencyDollarIcon },
  { id: "content", label: "Content", icon: DocumentTextIcon },
  { id: "redemption", label: "Redemption", icon: GlobeAltIcon },
  { id: "classification", label: "Classification", icon: TagIcon },
  { id: "dates", label: "Dates & Duration", icon: CalendarDaysIcon },
  { id: "terms", label: "Terms & Settings", icon: DocumentCheckIcon },
];

interface CarouselProps {
  mode?: "create" | "edit" | "clone";
}

export default function OfferManagerViewP0_5Carousel({
  mode = "create",
}: CarouselProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPublishing, setIsPublishing] = useState(false);

  // Controlled accordion state — one section open at a time
  const [openSectionId, setOpenSectionId] = useState<string | null>(
    "offer-type"
  );
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track previous firstIncompleteSection for auto-expand
  const prevFirstIncompleteRef = useRef<string | null>(null);

  // Form data — same shape as wizard + type-specific fields
  const [formData, setFormData] = useState<any>(() => {
    const dates = getDefaultDates();
    return {
      ...SMART_DEFAULTS,
      startDate: dates.startDate,
      endDate: dates.endDate,
      offerType: null as OfferTypeKey | null,
      merchantData: null as MerchantData | null,
      merchant: "",
      offerName: "",
      shortText: "",
      description: "",
      longText: "",
      discountValue: "",
      minimumSpend: "",
      cashbackCap: "",
      cashbackPercentage: "",
      redemptionValue: "",
      externalUrl: "",
      promoCode: "",
      termsConditions: "",
      category_ids: [] as string[],
      commodity_ids: [] as string[],
      // Image upload - Offer Image
      offerImageFile: null as File | null,
      offerImagePreview: "",
      offerImageAlt: "",
      offerImageSource: "none" as "none" | "merchant" | "custom",
      offerImageDimensions: null as { width: number; height: number } | null,
      // Image upload - Offer Banner
      offerBannerFile: null as File | null,
      offerBannerPreview: "",
      offerBannerAlt: "",
      offerBannerSource: "none" as "none" | "merchant" | "custom",
      offerBannerDimensions: null as { width: number; height: number } | null,
      // Auto-fill tracking
      headlineAutoFilled: false,
      descriptionAutoFilled: false,
      categoriesAutoFilled: false,
      commoditiesAutoFilled: false,
      // Publisher brand
      publisherBrandTag: null as string | null,
    };
  });

  // Load initial offer data for edit/clone modes
  useEffect(() => {
    if (mode === "create") return;

    try {
      const stored = localStorage.getItem("editOffer");
      if (!stored) return;

      const offer = JSON.parse(stored);
      localStorage.removeItem("editOffer");

      const offerName =
        mode === "clone" ? `${offer.offerName} (Copy)` : offer.offerName;

      setFormData((prev: any) => ({
        ...prev,
        offerType: offer.offerType || null,
        offerName,
        shortText: offerName,
        description: offer.description || "",
        longText: offer.description || "",
        discountValue: offer.estimatedSavings || "10",
        externalUrl: offer.externalUrl || "",
        promoCode: offer.promoCode || "",
        termsConditions: offer.termsAndConditions || "",
        endDate: offer.endDate || prev.endDate,
        merchant: offer.merchantId || "",
        merchantData: {
          id: offer.merchantId,
          dbaName: offer.merchantName,
          source: "existing" as const,
        },
        _editOfferId: mode === "edit" ? offer.id : undefined,
        _originalStatus: mode === "edit" ? offer.offerStatus : undefined,
      }));
    } catch {
      // Silently fail if localStorage data is invalid
    }
  }, [mode]);

  // Auto-set brand for single-brand publishers
  useEffect(() => {
    if (!isMultiBrandPublisher()) {
      const publisher = getCurrentPublisher();
      setFormData((prev: any) => ({
        ...prev,
        publisherBrandTag: publisher.brands[0].editionTag,
      }));
    }
  }, []);

  // Published edit: lock offer type and merchant
  const isPublishedEdit =
    mode === "edit" && formData._originalStatus === "published";

  // Section completion tracking
  const {
    sections,
    completedCount,
    totalCount,
    allComplete,
    firstIncompleteSection,
  } = useSectionCompletion(formData);

  // Field-level validation
  const [validateAll, setValidateAll] = useState(false);
  const { errors, firstSectionWithError } = useFormValidation(
    formData,
    validateAll
  );

  // Auto-expand: when a section completes, open the next incomplete section
  useEffect(() => {
    // Skip if firstIncompleteSection hasn't changed
    if (prevFirstIncompleteRef.current === firstIncompleteSection) return;
    const prev = prevFirstIncompleteRef.current;
    prevFirstIncompleteRef.current = firstIncompleteSection;

    // On initial mount (prev is null), set based on current state
    if (prev === null) {
      if (!formData.offerType) {
        setOpenSectionId("offer-type");
      } else if (firstIncompleteSection) {
        setOpenSectionId(firstIncompleteSection);
      }
      return;
    }

    // A section just completed — open the next incomplete section
    if (firstIncompleteSection) {
      setOpenSectionId(firstIncompleteSection);
    }
    // All complete (firstIncompleteSection → null): keep current section open
  }, [firstIncompleteSection, formData.offerType]);

  // Scroll into view when openSectionId changes
  useEffect(() => {
    if (!openSectionId || !scrollContainerRef.current) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(`section-${openSectionId}`);
      if (el && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const elTop = el.offsetTop - container.offsetTop;
        const stickyOffset =
          formData.offerType && openSectionId !== "offer-type" ? 64 : 16;
        container.scrollTo({ top: elTop - stickyOffset, behavior: "smooth" });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [openSectionId]);

  // Handle form field updates
  const handleUpdate = useCallback((field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));

    // Auto-fill cascade when merchant is selected
    if (field === "merchantData" && value) {
      const merchantData = value as MerchantData;
      const categories = merchantData.categories || [];
      const category = categories[0] || merchantData.category;

      setFormData((prev: any) => {
        const updates: any = {};

        if (category && !prev.termsConditions) {
          updates.termsConditions = getTermsTemplate(category);
        }
        if (
          categories.length > 0 &&
          (!prev.category_ids || prev.category_ids.length === 0)
        ) {
          updates.category_ids = getOfferCategoriesForMerchant(categories);
          updates.categoriesAutoFilled = true;
        }
        if (
          categories.length > 0 &&
          (!prev.commodity_ids || prev.commodity_ids.length === 0)
        ) {
          updates.commodity_ids = getCommoditiesForMerchant(categories);
          updates.commoditiesAutoFilled = true;
        }
        if (!prev.offerName && prev.offerType) {
          const headline = getSmartHeadline(
            prev.offerType,
            merchantData.dbaName
          );
          if (headline) {
            updates.offerName = headline;
            updates.shortText = headline;
            updates.headlineAutoFilled = true;
          }
        }
        if (!prev.description && prev.offerType && category) {
          const desc = getSmartDescription(prev.offerType, category);
          if (desc) {
            updates.description = desc;
            updates.longText = desc;
            updates.descriptionAutoFilled = true;
          }
        }
        if (merchantData.logoPreview && prev.offerImageSource !== "custom") {
          updates.offerImagePreview = merchantData.logoPreview;
          updates.offerImageSource = "merchant";
          updates.offerImageFile = null;
        }
        if (merchantData.bannerPreview && prev.offerBannerSource !== "custom") {
          updates.offerBannerPreview = merchantData.bannerPreview;
          updates.offerBannerSource = "merchant";
          updates.offerBannerFile = null;
        }

        return { ...prev, [field]: value, ...updates };
      });
      return;
    }
  }, []);

  // Handle offer type selection
  const handleOfferTypeSelect = useCallback((type: OfferTypeKey) => {
    setFormData((prev: any) => {
      const updates: any = {
        offerType: type,
        offerTypeInternal: "clk",
        discountValue: "",
        minimumSpend: "",
        cashbackCap: "",
        cashbackPercentage: "",
        redemptionValue: "",
        shortText: "",
      };

      const method = getAutoRedemptionMethod(type);
      updates.redemptionTypes =
        method === "online" ? ["external_url"] : ["show_and_save"];

      if (prev.merchantData) {
        const merchantName = prev.merchantData.dbaName;
        const category =
          prev.merchantData.categories?.[0] || prev.merchantData.category;

        if (!prev.offerName || prev.headlineAutoFilled) {
          const headline = getSmartHeadline(type, merchantName);
          if (headline) {
            updates.offerName = headline;
            updates.shortText = headline;
            updates.headlineAutoFilled = true;
          }
        }
        if (!prev.description || prev.descriptionAutoFilled) {
          const desc = getSmartDescription(type, category);
          if (desc) {
            updates.description = desc;
            updates.longText = desc;
            updates.descriptionAutoFilled = true;
          }
        }
      }

      return { ...prev, ...updates };
    });

    // After selection, collapse carousel and open first incomplete section
    setTimeout(() => {
      setOpenSectionId((current) => {
        // Let auto-expand take over — default to merchant if nothing else
        return "merchant";
      });
    }, 300);
  }, []);

  // Handle merchant selection
  const handleMerchantSelect = useCallback(
    (merchant: MerchantData) => {
      handleUpdate("merchantData", merchant);
      if (merchant.source === "existing" && merchant.id) {
        setFormData((prev: any) => ({ ...prev, merchant: merchant.id }));
      } else {
        setFormData((prev: any) => ({ ...prev, merchant: "" }));
      }
    },
    [handleUpdate]
  );

  // Publish handler
  const handlePublish = async () => {
    // Run full validation (including empty required fields)
    setValidateAll(true);
    const result = computeValidationErrors(formData, true);

    if (result.hasErrors) {
      // Open the first section with errors
      if (result.firstSectionWithError) {
        setOpenSectionId(result.firstSectionWithError);
      }
      toast({
        title: "Missing or invalid fields",
        description: "Please correct the highlighted fields.",
        variant: "destructive",
      });
      return;
    }

    setIsPublishing(true);
    try {
      console.log(
        mode === "edit"
          ? "Saving offer:"
          : mode === "clone"
            ? "Cloning offer:"
            : "Publishing offer:",
        formData
      );

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const titles: Record<string, string> = {
        create: "Offer Published!",
        edit: "Offer Updated!",
        clone: "Offer Cloned!",
      };
      const descriptions: Record<string, string> = {
        create: `"${formData.offerName}" is now live in the marketplace.`,
        edit: `"${formData.offerName}" has been updated successfully.`,
        clone: `"${formData.offerName}" has been created as a new draft.`,
      };

      toast({
        title: titles[mode],
        description: descriptions[mode],
        variant: "success",
      });

      setTimeout(() => {
        router.push("/offer-manager?version=p1.1");
      }, 1000);
    } catch (error) {
      console.error("Failed to save offer:", error);
      toast({
        title: "Save Failed",
        description: "Failed to save offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  // Build completion map for quick lookup
  const completionMap = new Map(sections.map((s) => [s.id, s.complete]));

  const publishLabel =
    mode === "edit"
      ? "Save Changes"
      : mode === "clone"
        ? "Clone as Draft"
        : "Publish Offer";
  const publishingLabel =
    mode === "edit"
      ? "Saving..."
      : mode === "clone"
        ? "Cloning..."
        : "Publishing...";

  return (
    <div className="overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>
      <div className="h-full flex gap-3">
        {/* Left Column — Form Card */}
        <div className="flex-1 min-w-0">
          <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md">
            {/* Header bar — matches P0.4 / Ad Manager pattern */}
            <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
              <div className="flex items-center">
                <GiftIcon className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <h3 className="font-medium">
                    {mode === "edit"
                      ? "Edit Offer"
                      : mode === "clone"
                        ? "Clone Offer"
                        : "Create Offer"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {completedCount}/{totalCount} sections complete
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/offer-manager?version=p1.1")}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handlePublish}
                  disabled={isPublishing}
                >
                  {isPublishing ? publishingLabel : publishLabel}
                </Button>
              </div>
            </div>

            {/* Scrollable form area */}
            <div ref={scrollContainerRef} className="flex-1 overflow-auto">
              {formData.offerType && openSectionId !== "offer-type" && (
                <StickyTypeIndicator
                  selectedType={formData.offerType}
                  locked={isPublishedEdit}
                  onChangeClick={() => {
                    setOpenSectionId("offer-type");
                    scrollContainerRef.current?.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                />
              )}
              <div className="p-4 space-y-4">
                {/* Offer Type Carousel — shown as accordion when no type selected or when actively changing (hidden if locked) */}
                {(!formData.offerType || openSectionId === "offer-type") &&
                  !isPublishedEdit && (
                    <Accordion
                      type="single"
                      collapsible
                      value={openSectionId === "offer-type" ? "offer-type" : ""}
                      onValueChange={(val) => setOpenSectionId(val || null)}
                      className="border rounded-md overflow-hidden"
                      id="section-offer-type"
                    >
                      <AccordionItem value="offer-type" className="border-none">
                        <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
                          <div className="flex flex-1 items-center justify-between mr-2">
                            <div className="flex items-center gap-2">
                              <CurrencyDollarIcon className="h-4 w-4 text-muted-foreground" />
                              <span>Select Offer Type</span>
                            </div>
                            {formData.offerType ? (
                              <span
                                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                                style={{
                                  backgroundColor: "#16a34a",
                                  color: "#fff",
                                }}
                              >
                                Complete
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full border border-gray-300 px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                                Required
                              </span>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-0 text-left overflow-hidden">
                          <OfferTypeCarousel
                            selectedType={formData.offerType}
                            onSelect={handleOfferTypeSelect}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}

                {/* Accordion Sections — controlled, one open at a time */}
                {SECTION_CONFIG.map((section) => {
                  const Icon = section.icon;
                  const isComplete = completionMap.get(section.id) ?? false;
                  const needsType =
                    section.id !== "merchant" && !formData.offerType;

                  return (
                    <Accordion
                      key={section.id}
                      type="single"
                      collapsible
                      value={openSectionId === section.id ? section.id : ""}
                      onValueChange={(val) => setOpenSectionId(val || null)}
                      className="border rounded-md overflow-hidden"
                      id={`section-${section.id}`}
                    >
                      <AccordionItem value={section.id} className="border-none">
                        <AccordionTrigger
                          className="px-4 py-3 text-sm font-medium hover:no-underline"
                          disabled={needsType}
                        >
                          <div className="flex flex-1 items-center justify-between mr-2">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-muted-foreground" />
                              <span>{section.label}</span>
                            </div>
                            {isComplete ? (
                              <span
                                className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold"
                                style={{
                                  backgroundColor: "#16a34a",
                                  color: "#fff",
                                }}
                              >
                                Complete
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full border border-gray-300 px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                                Required
                              </span>
                            )}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 text-left overflow-hidden">
                          <div className="pb-2">
                            {section.id === "merchant" && (
                              <SectionMerchant
                                selectedMerchant={formData.merchantData}
                                onSelect={handleMerchantSelect}
                                onClear={() => {
                                  handleUpdate("merchantData", null);
                                  setFormData((prev: any) => ({
                                    ...prev,
                                    merchant: "",
                                    publisherBrandTag: isMultiBrandPublisher()
                                      ? null
                                      : prev.publisherBrandTag,
                                  }));
                                }}
                                selectedBrandTag={formData.publisherBrandTag}
                                onBrandChange={(tag) =>
                                  handleUpdate("publisherBrandTag", tag)
                                }
                                brandPickerDisabled={isPublishedEdit}
                              />
                            )}
                            {section.id === "type-details" &&
                              formData.offerType && (
                                <SectionOfferTypeDetails
                                  offerType={formData.offerType}
                                  formData={formData}
                                  onUpdate={handleUpdate}
                                  errors={errors}
                                />
                              )}
                            {section.id === "content" && (
                              <SectionContent
                                formData={formData}
                                onUpdate={handleUpdate}
                                errors={errors}
                              />
                            )}
                            {section.id === "redemption" &&
                              formData.offerType && (
                                <SectionRedemption
                                  offerType={formData.offerType}
                                  formData={formData}
                                  onUpdate={handleUpdate}
                                  errors={errors}
                                />
                              )}
                            {section.id === "classification" && (
                              <SectionClassification
                                formData={formData}
                                onUpdate={handleUpdate}
                                errors={errors}
                              />
                            )}
                            {section.id === "dates" && (
                              <SectionDates
                                formData={formData}
                                onUpdate={handleUpdate}
                                errors={errors}
                              />
                            )}
                            {section.id === "terms" && (
                              <SectionTerms
                                formData={formData}
                                onUpdate={handleUpdate}
                              />
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column — Preview Panel */}
        <div className="w-[420px] flex-shrink-0">
          <Card className="h-full overflow-hidden shadow-md">
            <OfferPreviewPanel formData={formData} />
          </Card>
        </div>
      </div>
    </div>
  );
}

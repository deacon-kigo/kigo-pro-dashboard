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
import { cn } from "@/lib/utils";
import {
  Cog6ToothIcon,
  DocumentTextIcon,
  RectangleStackIcon,
  LinkIcon,
  ClockIcon,
  GlobeAltIcon,
  ArrowTopRightOnSquareIcon,
  MegaphoneIcon,
} from "@heroicons/react/24/outline";
import {
  LandingPageConfig,
  defaultLandingPageConfig,
} from "@/types/tmt-campaign";
import { apiService } from "@/lib/services/tmtCampaignService";
import TMTLandingPreview from "./TMTLandingPreview";
import CampaignSettingsSection from "./editor/CampaignSettingsSection";
import PageContentSection from "./editor/PageContentSection";
import FormFieldsSection from "./editor/FormFieldsSection";
import SubmitButtonSection from "./editor/SubmitButtonSection";
import LinkButtonsSection from "./editor/LinkButtonsSection";
import CopyCodeSection from "./editor/CopyCodeSection";
import AppStoreSection from "./editor/AppStoreSection";
import LegalTextSection from "./editor/LegalTextSection";
import WithTimerSection from "./editor/WithTimerSection";
import OnlineSection from "./editor/OnlineSection";
import DirectLinkSection from "./editor/DirectLinkSection";
import PublishShareSection from "./editor/PublishShareSection";

// Section config following offer manager pattern
const SECTION_CONFIG = [
  { id: "settings", label: "Campaign Settings", icon: Cog6ToothIcon },
  { id: "content", label: "Page Content", icon: DocumentTextIcon },
  { id: "form-fields", label: "Form Fields", icon: RectangleStackIcon },
  {
    id: "submit-button",
    label: "Submit Button",
    icon: ArrowTopRightOnSquareIcon,
  },
  { id: "link-buttons", label: "Link Buttons", icon: LinkIcon },
  { id: "copy-code", label: "Copy Code", icon: DocumentTextIcon },
  { id: "app-store", label: "App Store Links", icon: GlobeAltIcon },
  { id: "legal", label: "Legal Text", icon: DocumentTextIcon },
  { id: "publish", label: "Publish & Share", icon: ArrowTopRightOnSquareIcon },
];

// Conditional sections shown based on getCode value
const CONDITIONAL_SECTIONS: Record<
  string,
  {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }
> = {
  "with-timer": {
    id: "with-timer",
    label: "Timer Configuration",
    icon: ClockIcon,
  },
  online: {
    id: "online",
    label: "Online Configuration",
    icon: GlobeAltIcon,
  },
  "direct-link": {
    id: "direct-link",
    label: "Direct Link",
    icon: ArrowTopRightOnSquareIcon,
  },
};

interface TMTCampaignEditorProps {
  campaignId?: string; // undefined = new campaign
}

export default function TMTCampaignEditor({
  campaignId,
}: TMTCampaignEditorProps) {
  const router = useRouter();
  const { toast } = useToast();
  const isNew = !campaignId || campaignId === "new";

  const [config, setConfig] = useState<LandingPageConfig>({
    ...defaultLandingPageConfig,
  });
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [openSectionId, setOpenSectionId] = useState<string | null>("settings");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Load campaign data for editing
  useEffect(() => {
    if (isNew) return;
    setIsLoading(true);
    apiService
      .getCampaignById(campaignId!)
      .then((data) => {
        setConfig(data);
        setIsLoading(false);
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
        setIsLoading(false);
      });
  }, [campaignId, isNew]);

  // Scroll into view when section changes (offer manager pattern)
  useEffect(() => {
    if (!openSectionId || !scrollContainerRef.current) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(`section-${openSectionId}`);
      if (el && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const elTop = el.offsetTop - container.offsetTop;
        container.scrollTo({ top: elTop - 16, behavior: "smooth" });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [openSectionId]);

  // Generic update handler
  const handleUpdate = useCallback((field: string, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Deep update for nested fields like "submitButton.text"
  const handleDeepUpdate = useCallback((path: string, value: any) => {
    setConfig((prev) => {
      const newConfig = { ...prev };
      const parts = path.split(".");
      let current: any = newConfig;
      for (let i = 0; i < parts.length - 1; i++) {
        current[parts[i]] = { ...current[parts[i]] };
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      return newConfig;
    });
  }, []);

  // Validation — only block on essential fields, warn on optional
  const validateConfig = (): string[] => {
    const errors: string[] = [];
    if (!config.campaignName) errors.push("Campaign name is required");
    if (!config.affiliateSlug) errors.push("Affiliate slug is required");
    return errors;
  };

  // Check section completion
  const isSectionComplete = (sectionId: string): boolean => {
    switch (sectionId) {
      case "settings":
        return !!(
          config.campaignName &&
          config.affiliateSlug &&
          config.endCampaignDate
        );
      case "content":
        return !!config.title;
      case "legal":
        return !!config.legalText || config.getCode === "direct-link";
      case "publish":
        return !!(
          config.affiliateSlug &&
          config.isActive &&
          config.endCampaignDate
        );
      default:
        return true; // Optional sections are always "complete"
    }
  };

  // Save handler
  const handleSave = async () => {
    const errors = validateConfig();
    if (errors.length > 0) {
      toast({
        title: "Validation Errors",
        description: errors.join(". "),
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (isNew) {
        await apiService.createCampaign(config);
        toast({
          title: "Campaign Created",
          description: `"${config.campaignName}" has been created.`,
        });
      } else {
        await apiService.updateCampaign(campaignId!, config);
        toast({
          title: "Campaign Updated",
          description: `"${config.campaignName}" has been updated.`,
        });
      }
      router.push("/promo-campaigns");
    } catch (err: any) {
      toast({
        title: "Save Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Build section list based on getCode
  const activeSections = [
    ...SECTION_CONFIG,
    ...(config.getCode && config.getCode in CONDITIONAL_SECTIONS
      ? [
          CONDITIONAL_SECTIONS[
            config.getCode as keyof typeof CONDITIONAL_SECTIONS
          ],
        ]
      : []),
  ];

  // Completion counting
  const completedCount = activeSections.filter((s) =>
    isSectionComplete(s.id)
  ).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden" style={{ height: "calc(100vh - 140px)" }}>
      <div className="h-full flex gap-3">
        {/* Left Column — Form Card (offer manager pattern) */}
        <div className="flex-1 min-w-0">
          <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md">
            {/* Header bar — matches offer manager pattern */}
            <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
              <div className="flex items-center">
                <MegaphoneIcon className="h-5 w-5 mr-2 text-primary" />
                <div>
                  <h3 className="font-medium">
                    {isNew ? "Create Promo Campaign" : "Edit Promo Campaign"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {completedCount}/{activeSections.length} sections complete
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/promo-campaigns")}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving
                    ? "Saving..."
                    : isNew
                      ? "Create Campaign"
                      : "Save Changes"}
                </Button>
              </div>
            </div>

            {/* Scrollable form area */}
            <div ref={scrollContainerRef} className="flex-1 overflow-auto">
              <div className="p-4 space-y-4">
                {activeSections.map((section) => {
                  const Icon = section.icon;
                  const isComplete = isSectionComplete(section.id);

                  return (
                    <Accordion
                      key={section.id}
                      type="single"
                      collapsible
                      value={openSectionId === section.id ? section.id : ""}
                      onValueChange={(val) => setOpenSectionId(val || null)}
                      className={cn("border rounded-md overflow-hidden")}
                      id={`section-${section.id}`}
                    >
                      <AccordionItem value={section.id} className="border-none">
                        <AccordionTrigger className="px-4 py-3 text-sm font-medium hover:no-underline">
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
                            {section.id === "settings" && (
                              <CampaignSettingsSection
                                config={config}
                                onUpdate={handleUpdate}
                              />
                            )}
                            {section.id === "content" && (
                              <PageContentSection
                                config={config}
                                onUpdate={handleUpdate}
                                onDeepUpdate={handleDeepUpdate}
                              />
                            )}
                            {section.id === "form-fields" && (
                              <FormFieldsSection
                                config={config}
                                onUpdate={handleUpdate}
                              />
                            )}
                            {section.id === "submit-button" && (
                              <SubmitButtonSection
                                config={config}
                                onDeepUpdate={handleDeepUpdate}
                              />
                            )}
                            {section.id === "link-buttons" && (
                              <LinkButtonsSection
                                config={config}
                                onUpdate={handleUpdate}
                              />
                            )}
                            {section.id === "copy-code" && (
                              <CopyCodeSection
                                config={config}
                                onDeepUpdate={handleDeepUpdate}
                              />
                            )}
                            {section.id === "app-store" && (
                              <AppStoreSection
                                config={config}
                                onDeepUpdate={handleDeepUpdate}
                              />
                            )}
                            {section.id === "legal" && (
                              <LegalTextSection
                                config={config}
                                onUpdate={handleUpdate}
                              />
                            )}
                            {section.id === "with-timer" && (
                              <WithTimerSection
                                config={config}
                                onDeepUpdate={handleDeepUpdate}
                              />
                            )}
                            {section.id === "online" && (
                              <OnlineSection
                                config={config}
                                onDeepUpdate={handleDeepUpdate}
                              />
                            )}
                            {section.id === "direct-link" && (
                              <DirectLinkSection
                                config={config}
                                onDeepUpdate={handleDeepUpdate}
                              />
                            )}
                            {section.id === "publish" && (
                              <PublishShareSection
                                config={config}
                                campaignId={campaignId}
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

        {/* Right Column — Preview Card (420px, offer manager pattern) */}
        <div className="w-[420px] flex-shrink-0">
          <Card className="p-0 flex flex-col h-full overflow-hidden shadow-md">
            <div className="flex items-center p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
              <span className="text-sm font-medium">Live Preview</span>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <TMTLandingPreview config={config} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

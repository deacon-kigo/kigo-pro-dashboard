"use client";

import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { CAMPAIGN_STEPS } from "@/lib/redux/slices/campaignSlice";
import { Badge } from "@/components/atoms/Badge";
import PromotionWidget from "@/components/features/campaigns/PromotionWidget";
import { ShinyBorder } from "@/components/ui/shiny-border";
import {
  CheckCircle,
  AlertCircle,
  Eye,
  Settings,
  Target,
  BarChart3,
  Sparkles,
  ImageIcon,
  MapPin,
  Calendar,
  DollarSign,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CampaignPreviewPanelProps {
  className?: string;
}

export function CampaignPreviewPanel({ className }: CampaignPreviewPanelProps) {
  const { currentStep, formData, stepValidation } = useSelector(
    (state: RootState) => state.campaign
  );

  // Get validation status for each step
  const getStepStatus = (stepId: string) => {
    switch (stepId) {
      case "basic-info":
        return formData.basicInfo.name && formData.basicInfo.description;
      case "ad-creation":
        return formData.ads.length > 0;
      case "targeting-distribution-budget":
        return formData.targeting.ageRange && formData.budget.amount > 0;
      case "review":
        return true;
      default:
        return false;
    }
  };

  // Get step icon
  const getStepIcon = (stepId: string) => {
    switch (stepId) {
      case "basic-info":
        return Settings;
      case "ad-creation":
        return ImageIcon;
      case "targeting-distribution-budget":
        return Target;
      case "review":
        return BarChart3;
      default:
        return AlertCircle;
    }
  };

  // Get offer details for preview
  const getOfferDetails = (offerId: string) => {
    const offerMap: { [key: string]: { name: string; logo: string } } = {
      mcm_o1_2023: {
        name: "30% off select vitamins",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/CVS_Pharmacy_logo.svg/2560px-CVS_Pharmacy_logo.svg.png",
      },
      mcm_o2_2023: {
        name: "Buy 1 Get 1 on cough & cold",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/CVS_Pharmacy_logo.svg/2560px-CVS_Pharmacy_logo.svg.png",
      },
      mcm_o3_2023: {
        name: "$5 off $25 grocery purchase",
        logo: "https://logos-world.net/wp-content/uploads/2020/12/Kroger-Logo.png",
      },
      mcm_o4_2023: {
        name: "15% off laptops",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Best_Buy_logo_%282018%29.svg/2560px-Best_Buy_logo_%282018%29.svg.png",
      },
      mcm_o5_2023: {
        name: "$10 off monthly bill",
        logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Verizon_2015_logo_-vector.svg/2560px-Verizon_2015_logo_-vector.svg.png",
      },
      mcm_o6_2023: {
        name: "Free guacamole with entrée",
        logo: "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Chipotle_Mexican_Grill_logo.svg/2560px-Chipotle_Mexican_Grill_logo.svg.png",
      },
    };

    return (
      offerMap[offerId] || {
        name: "Promotion",
        logo: "https://placehold.co/100x100/e2e8f0/64748b?text=Logo",
      }
    );
  };

  // Calculate campaign summary stats
  const campaignStats = {
    totalAds: formData.ads.length,
    totalBudget: formData.budget.amount || 0,
    estimatedReach: formData.budget.amount
      ? Math.floor(formData.budget.amount * 100)
      : 0,
    completionPercentage: Math.round(
      (CAMPAIGN_STEPS.filter((step) => getStepStatus(step.id)).length /
        CAMPAIGN_STEPS.length) *
        100
    ),
  };

  return (
    <div className={`flex flex-col w-full h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/20 h-[61px] flex-shrink-0">
        <div className="flex items-center">
          <Eye className="h-5 w-5 mr-2 text-primary" />
          <div>
            <h3 className="font-medium">Campaign Preview</h3>
            <p className="text-xs text-muted-foreground">
              Live preview of your campaign
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {campaignStats.completionPercentage}% Complete
        </Badge>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-4">
          {/* Campaign Progress Stepper */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700 mb-3">
              Campaign Progress
            </h4>
            {CAMPAIGN_STEPS.map((step, index) => {
              const Icon = getStepIcon(step.id);
              const isCompleted = getStepStatus(step.id);
              const isCurrent = index === currentStep;

              return (
                <ShinyBorder
                  key={step.id}
                  isActive={isCompleted}
                  borderRadius={8}
                >
                  <div
                    className={`flex items-center p-3 rounded-lg border transition-colors ${
                      isCurrent
                        ? "bg-blue-50 border-blue-200"
                        : isCompleted
                          ? "bg-green-50 border-green-200"
                          : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrent
                              ? "bg-blue-500 text-white"
                              : "bg-slate-300 text-slate-600"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium">{step.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {isCurrent && (
                      <Sparkles className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                </ShinyBorder>
              );
            })}
          </div>

          {/* Campaign Summary Stats */}
          <ShinyBorder isActive={campaignStats.totalAds > 0} borderRadius={8}>
            <div className="bg-slate-50 border rounded-lg p-3">
              <h4 className="text-sm font-medium text-slate-700 mb-2">
                Campaign Summary
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center">
                  <ImageIcon className="h-3 w-3 mr-1 text-blue-600" />
                  <span className="text-slate-600">Ads:</span>
                  <span className="ml-1 font-medium">
                    {campaignStats.totalAds}
                  </span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-3 w-3 mr-1 text-green-600" />
                  <span className="text-slate-600">Budget:</span>
                  <span className="ml-1 font-medium">
                    ${campaignStats.totalBudget}
                  </span>
                </div>
                <div className="flex items-center">
                  <Target className="h-3 w-3 mr-1 text-purple-600" />
                  <span className="text-slate-600">Reach:</span>
                  <span className="ml-1 font-medium">
                    {campaignStats.estimatedReach.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-orange-600" />
                  <span className="text-slate-600">Status:</span>
                  <span className="ml-1 font-medium">Draft</span>
                </div>
              </div>
            </div>
          </ShinyBorder>

          {/* Live Promotion Previews */}
          {formData.ads.length > 0 && (
            <ShinyBorder isActive={true} borderRadius={8}>
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-slate-700">
                  Live Preview
                </h4>
                {formData.ads.map((ad, index) => {
                  const offerDetails = getOfferDetails(ad.offerId);

                  return (
                    <div key={ad.id} className="bg-white border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-medium text-slate-600">
                          Ad #{index + 1} - {ad.merchantName}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {Array.isArray(ad.mediaType)
                            ? ad.mediaType[0]
                            : ad.mediaType}
                        </Badge>
                      </div>

                      {/* Live Promotion Widget Preview */}
                      <div className="bg-slate-50 p-2 rounded border">
                        <PromotionWidget
                          merchantLogo={offerDetails.logo}
                          merchantName={ad.merchantName}
                          promotionText={offerDetails.name}
                          featured={true}
                          bannerImage={
                            ad.mediaAssets.length > 0
                              ? ad.mediaAssets[0].previewUrl
                              : undefined
                          }
                          mediaType={
                            Array.isArray(ad.mediaType)
                              ? ad.mediaType[0]
                              : ad.mediaType
                          }
                          distance="5.6 miles"
                          additionalOffers={1}
                          className="transform scale-90 origin-center"
                        />
                      </div>

                      {/* Preview metadata */}
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          Target: {formData.targeting.ageRange || "All ages"}
                        </span>
                        <span>${ad.costPerActivation || "0.00"} CPA</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ShinyBorder>
          )}

          {/* Empty State for Previews */}
          {formData.ads.length === 0 && (
            <div className="bg-slate-50 border border-dashed border-slate-300 rounded-lg p-6 text-center">
              <ImageIcon className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600 mb-1">
                No ads created yet
              </p>
              <p className="text-xs text-slate-500">
                Create your first ad to see a live preview here
              </p>
            </div>
          )}

          {/* Current Step Context */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-800 mb-1">
              Current Step
            </h4>
            <p className="text-xs text-blue-700">
              {CAMPAIGN_STEPS[currentStep]?.title} -{" "}
              {CAMPAIGN_STEPS[currentStep]?.description}
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

export default CampaignPreviewPanel;

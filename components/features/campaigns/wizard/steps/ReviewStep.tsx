"use client";

import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card/Card";
import { Button } from "@/components/atoms/Button";
import PromotionWidget from "@/components/features/campaigns/PromotionWidget";
import {
  XIcon,
  CheckIcon,
  CalendarIcon,
  UsersIcon,
  BanknoteIcon,
  ShareIcon,
  ImageIcon,
  ShoppingBagIcon,
  AlertCircle,
  Plus,
  CheckCircle2,
  Rocket,
} from "lucide-react";
import { CampaignState } from "@/lib/redux/slices/campaignSlice";

interface ReviewStepProps {
  formData: CampaignState["formData"];
}

// Safe access helper to handle possible undefined values
const safeAccess = <T,>(obj: any, path: string, defaultValue: T): T => {
  try {
    const keys = path.split(".");
    let result = obj;
    for (const key of keys) {
      if (result === undefined || result === null) return defaultValue;
      result = result[key];
    }
    return result === undefined || result === null
      ? defaultValue
      : (result as T);
  } catch (e) {
    console.warn(`Error accessing path: ${path}`, e);
    return defaultValue;
  }
};

// Create the SectionCard component for use in the review section
interface SectionCardProps {
  title: string;
  description: string;
  editLink: number;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  editLink,
  children,
}) => {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex justify-between items-center">
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          Edit
        </Button>
      </div>
      {children}
    </Card>
  );
};

// Mock offers data for getOfferName
const offers = [
  {
    id: "o1",
    merchantId: "m1",
    name: "30% off select vitamins",
    shortText: "Vitamins Sale",
    logoUrl: "https://placehold.co/400x200/ccf/fff?text=Vitamin+Logo",
  },
  {
    id: "o2",
    merchantId: "m1",
    name: "Buy 1 Get 1 on cough & cold",
    shortText: "Cold Medicine",
    logoUrl: "https://placehold.co/400x200/ccf/fff?text=Medicine+Logo",
  },
  {
    id: "o3",
    merchantId: "m2",
    name: "$5 off $25 grocery purchase",
    shortText: "Grocery Deal",
    logoUrl: "https://placehold.co/400x200/afa/333?text=Grocery+Logo",
  },
  {
    id: "o4",
    merchantId: "m3",
    name: "15% off laptops",
    shortText: "Laptop Discount",
    logoUrl: "https://placehold.co/400x200/00f/fff?text=Laptop+Logo",
  },
  {
    id: "o5",
    merchantId: "m4",
    name: "$10 off monthly bill",
    shortText: "Bill Credit",
    logoUrl: "https://placehold.co/400x200/f5f/fff?text=Bill+Logo",
  },
  {
    id: "o6",
    merchantId: "m5",
    name: "Free guacamole with entrée",
    shortText: "Free Guac",
    logoUrl: "https://placehold.co/400x200/3b3/fff?text=Guac+Logo",
  },
];

// Helper function to get offer name by ID
const getOfferName = (offerId: string, offersList: any[] = offers): string => {
  const offer = offersList.find((o) => o.id === offerId);
  return offer ? `${offer.name} (${offer.shortText})` : offerId;
};

// Helper function to get offer logo by ID
const getOfferLogo = (offerId: string, offersList: any[] = offers): string => {
  const offer = offersList.find((o) => o.id === offerId);
  return offer?.logoUrl || "";
};

const ReviewStep: React.FC<ReviewStepProps> = ({ formData }) => {
  // Make sure formData exists to avoid crashes
  const data = formData || {
    basicInfo: {},
    targeting: {},
    distribution: { channels: [], programs: [] },
    ads: [],
    budget: {},
  };

  // Format dates for display
  const startDate = safeAccess<string | null>(data, "basicInfo.startDate", null)
    ? format(
        new Date(safeAccess<string>(data, "basicInfo.startDate", "")),
        "MMMM d, yyyy"
      )
    : "Not set";

  const endDate = safeAccess<string | null>(data, "basicInfo.endDate", null)
    ? format(
        new Date(safeAccess<string>(data, "basicInfo.endDate", "")),
        "MMMM d, yyyy"
      )
    : "Not set";

  // Get estimated reach based on campaign weight
  const getEstimatedReach = () => {
    let baseReach = 0;
    switch (safeAccess<string>(data, "targeting.campaignWeight", "medium")) {
      case "small":
        baseReach = 50000;
        break;
      case "medium":
        baseReach = 100000;
        break;
      case "large":
        baseReach = 200000;
        break;
      default:
        baseReach = 100000;
    }

    // Safely access array lengths
    const programLength = safeAccess<any[]>(
      data,
      "distribution.programs",
      []
    ).length;
    const adLength = safeAccess<any[]>(data, "ads", []).length;

    // Adjust based on program count and ad count
    const programMultiplier = 1 + programLength * 0.1;
    const adMultiplier = 1 + adLength * 0.05;

    return Math.round(
      baseReach * programMultiplier * adMultiplier
    ).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Campaign Information */}
      <SectionCard
        title="Campaign Information"
        description="Basic details about your campaign"
        editLink={0} // Step index for campaign information
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h5 className="text-sm font-medium">Campaign Name</h5>
            <p className="text-sm text-muted-foreground mt-1">
              {formData.basicInfo.name || "Not specified"}
            </p>
          </div>
          <div>
            <h5 className="text-sm font-medium">Campaign Type</h5>
            <p className="text-sm text-muted-foreground mt-1">
              {formData.basicInfo.campaignType || "Advertising"}
            </p>
          </div>
          <div className="md:col-span-2">
            <h5 className="text-sm font-medium">Description</h5>
            <p className="text-sm text-muted-foreground mt-1">
              {formData.basicInfo.description || "No description provided"}
            </p>
          </div>
        </div>
      </SectionCard>

      {/* Advertisements */}
      <SectionCard
        title="Advertisements"
        description="Ads created for this campaign"
        editLink={1} // Step index for ad creation
      >
        {formData.ads.length > 0 ? (
          <div className="space-y-4">
            {formData.ads.map((ad, index) => (
              <div key={ad.id} className="border rounded-md p-3">
                <div className="flex gap-4">
                  <div className="w-[180px] flex-shrink-0">
                    <PromotionWidget
                      merchantLogo={getOfferLogo(ad.offerId, offers)}
                      merchantName={ad.merchantName}
                      promotionText={getOfferName(ad.offerId, offers)}
                      featured={true}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h5 className="font-medium">
                        Ad #{index + 1}: {ad.merchantName}
                      </h5>
                      <Badge variant="outline">
                        {ad.mediaAssets.length} media assets
                      </Badge>
                    </div>
                    <p className="text-sm mt-1">
                      {getOfferName(ad.offerId, offers)}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {ad.mediaType.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground flex justify-between">
                      <span>Cost per activation: ${ad.costPerActivation}</span>
                      <span>Cost per redemption: ${ad.costPerRedemption}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center py-8 border rounded-md">
            <div className="text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No advertisements created</p>
              <Button variant="outline" size="sm" className="mt-2">
                <Plus className="mr-1 h-4 w-4" />
                Add Advertisement
              </Button>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Target & Budget */}
      <SectionCard
        title="Target & Budget"
        description="Target audience, distribution, and budget settings"
        editLink={2} // Step index for targeting, distribution, budget
      >
        <div className="space-y-4">
          {/* Targeting */}
          <div>
            <h5 className="font-medium">Target Audience</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <h6 className="text-sm font-medium">Campaign Weight</h6>
                <p className="text-sm text-muted-foreground">
                  {formData.targeting.campaignWeight === "small"
                    ? "Small - Lower budget, focused reach"
                    : formData.targeting.campaignWeight === "medium"
                      ? "Medium - Balanced budget and reach"
                      : "Large - Higher budget, expanded reach"}
                </p>
              </div>
              <div>
                <h6 className="text-sm font-medium">Demographics</h6>
                <p className="text-sm text-muted-foreground">
                  {formData.targeting.gender.length > 0
                    ? `Gender: ${formData.targeting.gender.join(", ")}`
                    : "No gender targeting"}
                  {formData.targeting.ageRange
                    ? `, Age: ${formData.targeting.ageRange[0]}-${
                        formData.targeting.ageRange[1]
                      }`
                    : ", No age targeting"}
                </p>
              </div>
              <div className="md:col-span-2">
                <h6 className="text-sm font-medium">Locations</h6>
                {formData.targeting.locations.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.targeting.locations.map((loc) => (
                      <Badge key={loc.id} variant="outline" className="text-xs">
                        {loc.type === "state"
                          ? "State"
                          : loc.type === "msa"
                            ? "MSA"
                            : "ZIP"}
                        : {loc.value}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No locations specified
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Distribution */}
          <div className="border-t pt-4 mt-4">
            <h5 className="font-medium">Distribution</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <h6 className="text-sm font-medium">Channels</h6>
                <div className="flex flex-wrap gap-1 mt-1">
                  {formData.distribution.channels.map((channel) => (
                    <Badge key={channel} variant="outline" className="text-xs">
                      {channel}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h6 className="text-sm font-medium">Programs</h6>
                {formData.distribution.programs.length > 0 ? (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {formData.distribution.programs.map((program) => (
                      <Badge
                        key={program}
                        variant="outline"
                        className="text-xs"
                      >
                        {program}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No programs selected
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Budget */}
          <div className="border-t pt-4 mt-4">
            <h5 className="font-medium">Budget</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div>
                <h6 className="text-sm font-medium">Maximum Budget</h6>
                <p className="text-sm font-bold text-primary">
                  ${formData.budget.maxBudget.toLocaleString()}
                </p>
              </div>
              <div>
                <h6 className="text-sm font-medium">Estimated Reach</h6>
                <p className="text-sm text-muted-foreground">
                  {formData.budget.estimatedReach
                    ? formData.budget.estimatedReach.toLocaleString() +
                      " impressions"
                    : "Not calculated"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Submit Section */}
      <div className="border rounded-md p-4">
        <div className="flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
          <h3 className="font-medium text-lg">Ready to Launch</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Your campaign is ready to be submitted. Click the button below to
            launch your campaign.
          </p>
          <Button size="lg">
            <Rocket className="mr-2 h-4 w-4" />
            Launch Campaign
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;

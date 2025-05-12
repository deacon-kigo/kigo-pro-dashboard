// Define types for campaign elements
interface CampaignAd {
  id: string;
  merchantId: string;
  merchantName: string;
  offerId: string;
  mediaType: string[];
  mediaAssets: MediaAsset[];
  costPerActivation: number;
  costPerRedemption: number;
}

interface MediaAsset {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  previewUrl: string;
  dimensions?: { width: number; height: number };
}

interface CampaignTargeting {
  startDate: string | null;
  endDate: string | null;
  locations: Array<{
    id: string;
    type: "state" | "msa" | "zipcode";
    value: string;
  }>;
  gender: string[];
  ageRange: [number, number] | null;
  campaignWeight: "small" | "medium" | "large";
}

interface CampaignDistribution {
  channels: string[];
  programs: string[];
  programCampaigns: string[];
}

interface CampaignBudget {
  maxBudget: number;
  estimatedReach: number | null;
}

interface CampaignBasicInfo {
  name: string;
  description: string;
  campaignType?: string;
}

interface CampaignDefinition {
  basicInfo: CampaignBasicInfo;
  targeting: CampaignTargeting;
  distribution: CampaignDistribution;
  budget: CampaignBudget;
  ads: CampaignAd[];
}

// Define a targeting profile interface
interface TargetingProfile {
  ageRange: [number, number];
  gender: string[];
  locations: string[];
  interestCategories: string[];
}

// Mock data for campaign analytics
export interface CampaignAnalytics {
  impressionRate: number;
  conversionRate: number;
  recommendedBudget: number;
  audienceInsight: string;
  performancePrediction: string;
  estimatedReach: number;
  targetDemographics: {
    ageGroups: { [key: string]: number };
    genderDistribution: { [key: string]: number };
    topLocations: Array<{ name: string; percentage: number }>;
  };
  channelDistribution: { [key: string]: number };
}

/**
 * Generates campaign analytics data based on campaign configuration
 * @param campaignData Campaign configuration data
 * @returns Campaign analytics data
 */
export const generateCampaignAnalytics = (
  campaignData: Partial<CampaignDefinition>
): CampaignAnalytics => {
  // Default base values
  let impressionRate = 0.05; // 5% impression rate
  let conversionRate = 0.015; // 1.5% conversion rate
  let recommendedBudget = 5000; // $5000 default budget
  const budget = campaignData.budget?.maxBudget || 5000;
  
  // Adjust based on campaign weight
  switch (campaignData.targeting?.campaignWeight) {
    case "small":
      impressionRate = 0.04;
      conversionRate = 0.01;
      recommendedBudget = 3000;
      break;
    case "medium":
      impressionRate = 0.05;
      conversionRate = 0.015;
      recommendedBudget = 5000;
      break;
    case "large":
      impressionRate = 0.06;
      conversionRate = 0.02;
      recommendedBudget = 8000;
      break;
    default:
      // Use defaults
      break;
  }
  
  // Adjust based on ad count
  const adCount = campaignData.ads?.length || 0;
  if (adCount > 0) {
    impressionRate += adCount * 0.005; // Each ad increases impression rate
    conversionRate += adCount * 0.002; // Each ad increases conversion rate
  }
  
  // Calculate estimated reach
  const estimatedReach = Math.round(budget / 0.05); // Simple CPM model
  
  // Generate age group distribution
  const ageRange = campaignData.targeting?.ageRange || [18, 65];
  const ageGroups: { [key: string]: number } = {
    "18-24": 20,
    "25-34": 35,
    "35-44": 25,
    "45-54": 15,
    "55+": 5,
  };
  
  // Adjust age group distribution based on targeting
  if (ageRange[0] > 24) {
    ageGroups["18-24"] = 10;
    ageGroups["25-34"] = 40;
  }
  if (ageRange[1] < 45) {
    ageGroups["45-54"] = 5;
    ageGroups["55+"] = 0;
    ageGroups["35-44"] = 30;
  }
  
  // Gender distribution
  const genderDistribution: { [key: string]: number } = {
    male: 50,
    female: 50,
    other: 0,
  };
  
  // Adjust based on gender targeting
  if (campaignData.targeting?.gender?.includes("male") && !campaignData.targeting.gender.includes("female")) {
    genderDistribution.male = 90;
    genderDistribution.female = 10;
  } else if (campaignData.targeting?.gender?.includes("female") && !campaignData.targeting.gender.includes("male")) {
    genderDistribution.male = 10;
    genderDistribution.female = 90;
  }
  
  // Generate top locations
  const locations = campaignData.targeting?.locations || [];
  const topLocations = locations.length > 0 
    ? locations.map(loc => ({ name: loc.value, percentage: Math.round(100 / locations.length) }))
    : [
        { name: "New York", percentage: 30 },
        { name: "California", percentage: 25 },
        { name: "Texas", percentage: 20 },
        { name: "Florida", percentage: 15 },
        { name: "Illinois", percentage: 10 },
      ];
  
  // Channel distribution
  const channelDistribution: { [key: string]: number } = {
    email: 25,
    social: 30,
    display: 20,
    search: 15,
    inapp: 10,
  };
  
  // Adjust based on selected channels
  const selectedChannels = campaignData.distribution?.channels || [];
  if (selectedChannels.length > 0) {
    // Reset all to zero first
    Object.keys(channelDistribution).forEach(key => channelDistribution[key] = 0);
    
    // Distribute evenly among selected channels
    const channelPercentage = Math.round(100 / selectedChannels.length);
    selectedChannels.forEach(channel => {
      channelDistribution[channel] = channelPercentage;
    });
  }
  
  // Generate audience insight and performance prediction
  let audienceInsight = "Based on your targeting, this campaign will reach a primarily";
  
  if (genderDistribution.male > genderDistribution.female) {
    audienceInsight += " male";
  } else if (genderDistribution.female > genderDistribution.male) {
    audienceInsight += " female";
  } else {
    audienceInsight += " balanced gender";
  }
  
  // Add age insight
  const maxAgeGroup = Object.entries(ageGroups).reduce((a, b) => a[1] > b[1] ? a : b);
  audienceInsight += ` audience in the ${maxAgeGroup[0]} age range.`;
  
  // Performance prediction
  const performanceLabel = conversionRate > 0.018 ? "high" : conversionRate > 0.012 ? "good" : "moderate";
  const performancePrediction = `This campaign is predicted to have ${performanceLabel} performance with an estimated conversion rate of ${(conversionRate * 100).toFixed(1)}% and ROI of ${(conversionRate * estimatedReach * 10 / budget).toFixed(2)}x.`;
  
  return {
    impressionRate,
    conversionRate,
    recommendedBudget,
    audienceInsight,
    performancePrediction,
    estimatedReach,
    targetDemographics: {
      ageGroups,
      genderDistribution,
      topLocations,
    },
    channelDistribution,
  };
};

/**
 * A service to generate ad content suggestions based on campaign details
 */
export class CampaignContentCreator {
  /**
   * Generates ad headline suggestions based on campaign goals and audience
   * @param campaignGoal The campaign goal (awareness, conversion, etc.)
   * @param targetAudience Description of target audience
   * @param productType Type of product or service being promoted
   * @returns Array of headline suggestions
   */
  static generateHeadlines(
    campaignGoal: string,
    targetAudience: string,
    productType: string
  ): string[] {
    // Sample headline templates based on campaign goal
    const awarenessTemplates = [
      "Discover the [Value] of [Product]",
      "Introducing: [Product] for [Audience]",
      "The [Adjective] way to [Benefit]",
      "Meet your new favorite [Product]",
      "Say hello to [Product]",
    ];
    
    const conversionTemplates = [
      "[Action] now and save [Amount]",
      "Limited time: [Offer] on [Product]",
      "Exclusive [Product] deal for [Audience]",
      "Don't miss: [Offer] ends [Timeframe]",
      "[Percentage] off your next [Product]",
    ];
    
    const retentionTemplates = [
      "We value your loyalty: [Offer]",
      "Special thanks: [Offer] for our [Adjective] customers",
      "Because you're [Audience]: [Exclusive] offers",
      "Members only: [Benefit] awaits",
      "Your loyalty rewards: [Offer]",
    ];
    
    // Select appropriate templates based on goal
    let templates: string[];
    switch(campaignGoal.toLowerCase()) {
      case "awareness":
      case "brand awareness":
      case "branding":
        templates = awarenessTemplates;
        break;
      case "conversion":
      case "sales":
      case "leads":
        templates = conversionTemplates;
        break;
      case "retention":
      case "loyalty":
      case "engagement":
        templates = retentionTemplates;
        break;
      default:
        // Use a mix for unknown goals
        templates = [
          ...awarenessTemplates.slice(0, 2),
          ...conversionTemplates.slice(0, 2),
          ...retentionTemplates.slice(0, 1),
        ];
    }
    
    // Fill in templates with provided information
    return templates.map(template => {
      return template
        .replace("[Product]", productType)
        .replace("[Audience]", targetAudience)
        .replace("[Value]", this.getRandomValue())
        .replace("[Adjective]", this.getRandomAdjective())
        .replace("[Benefit]", this.getRandomBenefit(productType))
        .replace("[Action]", this.getRandomAction())
        .replace("[Amount]", this.getRandomDiscount())
        .replace("[Offer]", this.getRandomOffer())
        .replace("[Timeframe]", this.getRandomTimeframe())
        .replace("[Percentage]", this.getRandomPercentage())
        .replace("[Exclusive]", this.getRandomExclusive());
    });
  }
  
  /**
   * Generates targeting recommendations based on product type and campaign goals
   * @param productType Type of product being advertised
   * @param campaignGoal Campaign objective
   * @returns Targeting recommendations
   */
  static generateTargetingRecommendations(
    productType: string,
    campaignGoal: string
  ): TargetingProfile {
    // Sample targeting profiles by industry/product type
    const targetingProfiles: Record<string, TargetingProfile> = {
      food: {
        ageRange: [18, 54],
        gender: ["male", "female"],
        locations: ["urban", "suburban"],
        interestCategories: ["dining", "cooking", "entertainment"],
      },
      fashion: {
        ageRange: [18, 45],
        gender: ["female"],
        locations: ["urban", "suburban"],
        interestCategories: ["style", "shopping", "lifestyle"],
      },
      technology: {
        ageRange: [24, 45],
        gender: ["male"],
        locations: ["urban"],
        interestCategories: ["gadgets", "innovation", "early adopters"],
      },
      fitness: {
        ageRange: [18, 40],
        gender: ["male", "female"],
        locations: ["urban", "suburban"],
        interestCategories: ["health", "wellness", "active lifestyle"],
      },
      travel: {
        ageRange: [25, 65],
        gender: ["male", "female"],
        locations: ["urban", "suburban"],
        interestCategories: ["adventure", "leisure", "exploration"],
      },
      beauty: {
        ageRange: [18, 55],
        gender: ["female"],
        locations: ["urban", "suburban"],
        interestCategories: ["skincare", "makeup", "wellness"],
      },
    };
    
    // Default targeting if product type isn't matched
    const defaultTargeting: TargetingProfile = {
      ageRange: [25, 54],
      gender: ["male", "female"],
      locations: ["urban", "suburban"],
      interestCategories: ["general", "shopping"],
    };
    
    // Find the best matching product type
    let bestMatch: TargetingProfile = defaultTargeting;
    let bestMatchScore = 0;
    
    Object.entries(targetingProfiles).forEach(([key, profile]) => {
      if (productType.toLowerCase().includes(key)) {
        const matchScore = key.length; // Simple scoring based on length of match
        if (matchScore > bestMatchScore) {
          bestMatch = profile;
          bestMatchScore = matchScore;
        }
      }
    });
    
    // Adjust based on campaign goal
    if (campaignGoal.toLowerCase().includes("awareness")) {
      // Broaden targeting for awareness campaigns
      bestMatch = {
        ...bestMatch,
        ageRange: [bestMatch.ageRange[0], bestMatch.ageRange[1] + 10]
      };
    } else if (campaignGoal.toLowerCase().includes("conversion")) {
      // Narrow targeting for conversion campaigns
      bestMatch = {
        ...bestMatch,
        ageRange: [bestMatch.ageRange[0] + 5, bestMatch.ageRange[1] - 5]
      };
    }
    
    return bestMatch;
  }
  
  /**
   * Generates budget recommendations based on campaign parameters
   * @param audienceSize Estimated audience size
   * @param campaignDuration Duration in days
   * @param campaignGoal Campaign objective
   * @returns Budget recommendation and CPM/CPC estimates
   */
  static generateBudgetRecommendation(
    audienceSize: number,
    campaignDuration: number,
    campaignGoal: string
  ): any {
    // Base CPM rates by campaign goal ($ per 1000 impressions)
    const cpmRates: any = {
      awareness: 10,
      conversion: 15,
      retention: 12,
      default: 12,
    };
    
    // Get appropriate CPM rate
    let cpmRate = cpmRates.default;
    Object.entries(cpmRates).forEach(([key, rate]) => {
      if (campaignGoal.toLowerCase().includes(key)) {
        cpmRate = rate as number;
      }
    });
    
    // Calculate recommended impressions (25% of audience size per week)
    const weeklyImpressionPercentage = 0.25;
    const weeks = campaignDuration / 7;
    const recommendedImpressions = audienceSize * weeklyImpressionPercentage * weeks;
    
    // Calculate budget based on impressions and CPM
    const recommendedBudget = (recommendedImpressions / 1000) * cpmRate;
    
    // Calculate CPC (cost per click) assuming 1% CTR
    const estimatedCTR = 0.01;
    const estimatedClicks = recommendedImpressions * estimatedCTR;
    const estimatedCPC = recommendedBudget / estimatedClicks;
    
    // Return budget recommendation
    return {
      recommendedBudget: Math.round(recommendedBudget),
      cpmRate,
      estimatedCPC: parseFloat(estimatedCPC.toFixed(2)),
      estimatedImpressions: Math.round(recommendedImpressions),
      estimatedClicks: Math.round(estimatedClicks),
      budgetRationale: `Based on an audience of ${audienceSize.toLocaleString()} people, running for ${campaignDuration} days, targeting a ${campaignGoal} goal with a CPM of $${cpmRate}.`,
    };
  }
  
  // Helper methods for template substitution
  private static getRandomValue(): string {
    const values = ["power", "convenience", "excellence", "innovation", "magic", "simplicity"];
    return values[Math.floor(Math.random() * values.length)];
  }
  
  private static getRandomAdjective(): string {
    const adjectives = ["smart", "simple", "modern", "revolutionary", "essential", "perfect"];
    return adjectives[Math.floor(Math.random() * adjectives.length)];
  }
  
  private static getRandomBenefit(productType: string): string {
    const benefits = {
      food: ["eat healthier", "save time cooking", "enjoy restaurant-quality meals"],
      fashion: ["express yourself", "elevate your style", "find your look"],
      technology: ["stay connected", "boost productivity", "simplify your life"],
      default: ["save time", "live better", "improve your life", "feel amazing"],
    };
    
    // Find matching benefits or use default
    let benefitArray = benefits.default;
    Object.entries(benefits).forEach(([key, value]) => {
      if (productType.toLowerCase().includes(key)) {
        benefitArray = value;
      }
    });
    
    return benefitArray[Math.floor(Math.random() * benefitArray.length)];
  }
  
  private static getRandomAction(): string {
    const actions = ["Shop", "Order", "Buy", "Get", "Claim", "Unlock"];
    return actions[Math.floor(Math.random() * actions.length)];
  }
  
  private static getRandomDiscount(): string {
    const discounts = ["20%", "30%", "$10", "$25", "up to 50%"];
    return discounts[Math.floor(Math.random() * discounts.length)];
  }
  
  private static getRandomOffer(): string {
    const offers = ["deal", "discount", "special", "promotion", "offer"];
    return offers[Math.floor(Math.random() * offers.length)];
  }
  
  private static getRandomTimeframe(): string {
    const timeframes = ["soon", "this week", "tomorrow", "Sunday"];
    return timeframes[Math.floor(Math.random() * timeframes.length)];
  }
  
  private static getRandomPercentage(): string {
    const percentages = ["10%", "15%", "20%", "25%", "30%"];
    return percentages[Math.floor(Math.random() * percentages.length)];
  }
  
  private static getRandomExclusive(): string {
    const exclusives = ["exclusive", "special", "premium", "VIP", "member-only"];
    return exclusives[Math.floor(Math.random() * exclusives.length)];
  }
} 
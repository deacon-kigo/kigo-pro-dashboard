/**
 * CopilotKit Actions Hook
 *
 * This centralizes all CopilotKit actions that the AI can call directly.
 * Enhanced with intelligent demo workflow using real merchant/offer data.
 */

import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setCurrentPage, addNotification } from "../redux/slices/uiSlice";
import {
  addAd,
  updateAd,
  CampaignAd,
  MediaAsset,
  removeAd,
} from "../redux/slices/campaignSlice";
import { v4 as uuidv4 } from "uuid";

// 🎯 DEMO DATA for intelligent matching
const DEMO_MERCHANTS = [
  { id: "m11", name: "McDonald's Corporation", dba: "McDonald's" },
  { id: "m1", name: "CVS Pharmacy", dba: "CVS Health" },
  { id: "m7", name: "Target Corporation", dba: "Target" },
  { id: "m10", name: "Starbucks Corporation", dba: "Starbucks" },
  { id: "m3", name: "Best Buy Co.", dba: "Best Buy" },
  { id: "m14", name: "Walgreens Boots Alliance", dba: "Walgreens" },
  { id: "m6", name: "Walmart Inc.", dba: "Walmart" },
];

const DEMO_OFFERS = [
  {
    id: "mcm_o1_2023",
    merchantId: "m11",
    name: "Free fries with any burger",
    shortText: "Free Fries",
  },
  {
    id: "mcm_o2_2023",
    merchantId: "m1",
    name: "20% off health and wellness products",
    shortText: "20% Off Wellness",
  },
  {
    id: "mcm_o3_2023",
    merchantId: "m7",
    name: "Buy 2 Get 1 Free on select items",
    shortText: "Buy 2 Get 1 Free",
  },
  {
    id: "mcm_o11_2023",
    merchantId: "m10",
    name: "Free drink with food purchase",
    shortText: "Free Drink",
  },
  {
    id: "mcm_o4_2023",
    merchantId: "m3",
    name: "$50 off TVs over $500",
    shortText: "TV Discount",
  },
  {
    id: "mcm_o5_2023",
    merchantId: "m14",
    name: "Free flu shot with coupon",
    shortText: "Free Flu Shot",
  },
];

export function useCopilotActions() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // 📖 Provide campaign context to AI using useCopilotReadable
  const campaignState = useAppSelector((state) => state.campaign);
  const currentPage = useAppSelector((state) => state.ui.currentPage);

  useCopilotReadable({
    description: "Current campaign form state and ad creation progress",
    value: {
      currentStep: campaignState.currentStep,
      currentPage: currentPage,
      basicInfo: campaignState.formData.basicInfo,
      ads: campaignState.formData.ads,
      adCount: campaignState.formData.ads.length,
      isOnAdCreationPage: currentPage.includes("ads-create"),
      targeting: campaignState.formData.targeting,
      budget: campaignState.formData.budget,
      availableMerchants: DEMO_MERCHANTS,
      availableOffers: DEMO_OFFERS,
    },
  });

  // 🎯 INTELLIGENT AD CREATION - Main demo action
  useCopilotAction({
    name: "createAdFromIntent",
    description:
      "Analyze user intent and create an ad campaign using real merchant data. This is the main demo action that showcases intelligent ad creation.",
    parameters: [
      {
        name: "userRequest",
        type: "string",
        description:
          "User's request for creating an ad (e.g., 'create an ad for McDonald's')",
        required: true,
      },
    ],
    handler: async ({ userRequest }) => {
      console.log("[DEMO] 🎯 Creating ad from intent:", userRequest);

      // Intelligent merchant matching
      let suggestedMerchant: (typeof DEMO_MERCHANTS)[0] | undefined = undefined;
      let suggestedOffer: (typeof DEMO_OFFERS)[0] | undefined = undefined;

      // Smart matching based on user request
      const requestLower = userRequest.toLowerCase();

      if (requestLower.includes("mcdonald")) {
        suggestedMerchant = DEMO_MERCHANTS.find((m) => m.dba === "McDonald's");
        suggestedOffer = DEMO_OFFERS.find((o) => o.merchantId === "m11");
      } else if (requestLower.includes("cvs")) {
        suggestedMerchant = DEMO_MERCHANTS.find((m) => m.dba === "CVS Health");
        suggestedOffer = DEMO_OFFERS.find((o) => o.merchantId === "m1");
      } else if (requestLower.includes("target")) {
        suggestedMerchant = DEMO_MERCHANTS.find((m) => m.dba === "Target");
        suggestedOffer = DEMO_OFFERS.find((o) => o.merchantId === "m7");
      } else if (requestLower.includes("starbucks")) {
        suggestedMerchant = DEMO_MERCHANTS.find((m) => m.dba === "Starbucks");
        suggestedOffer = DEMO_OFFERS.find((o) => o.merchantId === "m10");
      } else {
        // Default to McDonald's for demo
        suggestedMerchant = DEMO_MERCHANTS.find((m) => m.dba === "McDonald's");
        suggestedOffer = DEMO_OFFERS.find((o) => o.merchantId === "m11");
      }

      // Navigate to ad creation page
      dispatch(setCurrentPage("/campaign-manager/ads-create"));
      router.push("/campaign-manager/ads-create");

      dispatch(
        addNotification({
          message: `🧭 Navigating to ad creation page...`,
          type: "info",
        })
      );

      // Create the ad directly in Redux
      if (suggestedMerchant && suggestedOffer) {
        const newAd: CampaignAd = {
          id: uuidv4(),
          name: `${suggestedMerchant.dba} ${suggestedOffer.shortText} Campaign`,
          merchantId: suggestedMerchant.id,
          merchantName: suggestedMerchant.name,
          offerId: suggestedOffer.id,
          mediaType: ["display_banner"], // Default media type
          mediaAssets: [],
          costPerActivation: 0,
          costPerRedemption: 0,
        };

        // Add to Redux store
        dispatch(addAd(newAd));

        // Show success notification
        dispatch(
          addNotification({
            message: `🎯 Perfect! Created "${newAd.name}" - now let's add media and launch!`,
            type: "success",
          })
        );

        return `🎯 **Excellent! I've created your ad campaign:**

✅ **Ad Name**: ${newAd.name}
✅ **Merchant**: ${suggestedMerchant.dba}
✅ **Offer**: ${suggestedOffer.name}

*I've navigated you to the ad creation form and populated it with your ad details!*

**Next steps I can help with:**
• Upload media assets for your campaign
• Set budget and targeting recommendations  
• Generate compelling ad copy
• Review and launch the campaign

What would you like to do next?`;
      }

      return `🧭 **I'll help you create an ad!**

I've navigated you to the ad creation page where you can get started.

**Quick start options:**
• "Create McDonald's ad" - Instant demo setup
• "Create ad for [merchant name]" - Smart merchant matching  
• "Check form status" - See current form state

What would you like to create?`;
    },
  });

  // 🎨 DEMO: Suggest relevant merchant offers
  useCopilotAction({
    name: "suggestMerchantOffers",
    description:
      "Show available merchants and their current offers for ad creation inspiration",
    parameters: [
      {
        name: "category",
        type: "string",
        description:
          "Optional category filter (pharmacy, retail, food, tech, etc.)",
        required: false,
      },
    ],
    handler: async ({ category = "" }) => {
      const cat = category.toLowerCase();
      let filteredMerchants = DEMO_MERCHANTS;
      let title = "All Available Merchants";

      if (cat.includes("pharmacy") || cat.includes("health")) {
        filteredMerchants = DEMO_MERCHANTS.filter(
          (m) => m.id === "m1" || m.id === "m14"
        );
        title = "Pharmacy & Health Merchants";
      } else if (cat.includes("food") || cat.includes("restaurant")) {
        filteredMerchants = DEMO_MERCHANTS.filter((m) =>
          ["m11", "m5", "m10"].includes(m.id)
        );
        title = "Food & Restaurant Merchants";
      } else if (cat.includes("retail") || cat.includes("shopping")) {
        filteredMerchants = DEMO_MERCHANTS.filter((m) =>
          ["m7", "m3", "m6"].includes(m.id)
        );
        title = "Retail & Shopping Merchants";
      }

      let response = `🏪 **${title} & Their Current Offers:**\n\n`;

      filteredMerchants.forEach((merchant) => {
        const offers = DEMO_OFFERS.filter((o) => o.merchantId === merchant.id);
        response += `**${merchant.dba}**\n`;
        offers.forEach((offer) => {
          response += `• ${offer.name}\n`;
        });
        response += `\n`;
      });

      response += `💡 **To create an ad, just say:** "Create an ad for [merchant name]" or "I want a [category] ad"`;

      return response;
    },
  });

  // Original navigation action (enhanced)
  useCopilotAction({
    name: "navigateToAdCreation",
    description:
      "Navigate user to the ad creation page and start the ad creation process",
    parameters: [
      {
        name: "adType",
        type: "string",
        description:
          "Type of ad to create (e.g., 'display', 'video', 'social')",
        required: false,
      },
    ],
    handler: async ({ adType = "display" }) => {
      console.log("[CopilotActions] 🚀 Navigating to ad creation:", adType);

      // Update Redux state
      dispatch(setCurrentPage("/campaign-manager/ads-create"));

      // Navigate using Next.js router
      router.push("/campaign-manager/ads-create");

      // Show helpful notification
      dispatch(
        addNotification({
          message: `Let's create your ${adType} ad! I'll guide you through each step.`,
          type: "info",
        })
      );

      return `Perfect! I've taken you to the ad creation page. Now I can help you build your ${adType} ad step by step. 

**I can assist with:**
• Smart merchant & offer selection
• Media upload and optimization
• Targeting recommendations
• Budget suggestions

What merchant would you like to create an ad for?`;
    },
  });

  // Create Ad Action - AI can call this to actually create ads
  useCopilotAction({
    name: "createAd",
    description:
      "Create a new advertising campaign ad with the provided details",
    parameters: [
      {
        name: "adName",
        type: "string",
        description: "Name of the ad",
        required: true,
      },
      {
        name: "merchant",
        type: "string",
        description: "Merchant/business name for the ad",
        required: true,
      },
      {
        name: "offer",
        type: "string",
        description: "The promotional offer or deal",
        required: true,
      },
      {
        name: "mediaType",
        type: "string",
        description: "Type of media (image, video, both)",
        required: false,
      },
      {
        name: "costPerActivation",
        type: "number",
        description: "Cost per activation in dollars",
        required: false,
      },
      {
        name: "costPerRedemption",
        type: "number",
        description: "Cost per redemption in dollars",
        required: false,
      },
    ],
    handler: async ({
      adName,
      merchant,
      offer,
      mediaType = "image",
      costPerActivation = 0.5,
      costPerRedemption = 2.0,
    }) => {
      console.log("[CopilotActions] 📝 Creating ad:", {
        adName,
        merchant,
        offer,
      });

      // Create the ad object
      const newAd = {
        id: `ad_${Date.now()}`,
        name: adName,
        merchantId: "default",
        merchantName: merchant,
        offerId: "default",
        mediaType: [mediaType],
        mediaAssets: [],
        costPerActivation,
        costPerRedemption,
      };

      // Add to Redux store
      dispatch(addAd(newAd));

      // Show success notification
      dispatch(
        addNotification({
          message: `🎉 Successfully created "${adName}" for ${merchant}!`,
          type: "success",
        })
      );

      return `🎉 Excellent! I've successfully created your ad "${adName}" for ${merchant}!

**Ad Details:**
• **Name**: ${adName}
• **Merchant**: ${merchant}  
• **Offer**: ${offer}
• **Media Type**: ${mediaType}
• **Cost per Activation**: $${costPerActivation}
• **Cost per Redemption**: $${costPerRedemption}

Your ad is now ready and has been added to your campaigns. You can preview it, set targeting options, or launch it when ready!`;
    },
  });

  // Additional navigation actions
  useCopilotAction({
    name: "navigateToAnalytics",
    description: "Navigate to analytics dashboard to view campaign performance",
    parameters: [],
    handler: async () => {
      dispatch(setCurrentPage("/analytics"));
      router.push("/analytics");

      dispatch(
        addNotification({
          message: "📊 Navigating to analytics dashboard",
          type: "info",
        })
      );

      return "📊 Here's your analytics dashboard! I can help you understand your campaign performance, identify trends, and optimize your ad spending.";
    },
  });

  useCopilotAction({
    name: "navigateToFilters",
    description: "Navigate to filters management for audience targeting",
    parameters: [],
    handler: async () => {
      dispatch(setCurrentPage("/filters"));
      router.push("/filters");

      dispatch(
        addNotification({
          message: "🎯 Opening targeting filters",
          type: "info",
        })
      );

      return "🎯 Let's set up your audience targeting! I can help you configure filters for demographics, interests, location, and behavior to reach the right customers.";
    },
  });

  useCopilotAction({
    name: "requestApproval",
    description:
      "Request approval for budget changes or campaign modifications",
    parameters: [
      {
        name: "actionType",
        type: "string",
        description: "Type of action needing approval",
        required: true,
      },
      {
        name: "details",
        type: "string",
        description: "Details about what needs approval",
        required: true,
      },
      {
        name: "amount",
        type: "number",
        description: "Dollar amount if budget-related",
        required: false,
      },
    ],
    handler: async ({ actionType, details, amount }) => {
      console.log("[CopilotActions] 🔐 Requesting approval:", {
        actionType,
        details,
        amount,
      });

      dispatch(
        addNotification({
          message: `📝 Approval request submitted for ${actionType}`,
          type: "info",
        })
      );

      const amountText = amount ? ` involving $${amount}` : "";
      return `📝 I've submitted your approval request for "${actionType}"${amountText}.

**Request Details:** ${details}

Your request has been sent to the appropriate approvers. You'll receive a notification once it's reviewed. In the meantime, I can help you prepare other aspects of your campaign.`;
    },
  });

  useCopilotAction({
    name: "getCurrentPageInfo",
    description:
      "Get information about the current page and what actions are available",
    parameters: [],
    handler: async () => {
      return `📍 **Current Page Information**

I can help you with various tasks depending on what you'd like to accomplish:

**🎯 Ad Creation:**
• "Create an ad for [merchant]" - Start intelligent ad creation
• "Show me merchant offers" - Browse available deals
• "Navigate to ad creation" - Go to the creation page

**📊 Analytics & Insights:**
• "Show me analytics" - View campaign performance
• "Navigate to analytics" - Open analytics dashboard

**🎯 Targeting & Filters:**
• "Set up filters" - Configure audience targeting
• "Navigate to filters" - Open filter management

**💼 Approvals:**
• "Request approval for [action]" - Submit approval requests

What would you like to work on?`;
    },
  });

  // 🎯 GUIDED AD CREATION WORKFLOW - Step-by-step form assistance
  useCopilotAction({
    name: "fillAdBasicInfo",
    description:
      "Fill in the basic ad information (name, merchant, offer) in the ad creation form",
    parameters: [
      {
        name: "adName",
        type: "string",
        description: "Name for the ad campaign",
        required: true,
      },
      {
        name: "merchantName",
        type: "string",
        description: "Merchant name (e.g., McDonald's, CVS, Target)",
        required: true,
      },
      {
        name: "offerDescription",
        type: "string",
        description: "The promotional offer description",
        required: true,
      },
    ],
    handler: async ({ adName, merchantName, offerDescription }) => {
      console.log("[DEMO] 📝 Filling ad basic info:", {
        adName,
        merchantName,
        offerDescription,
      });

      try {
        // Fill Ad Name field
        const adNameInput = document.getElementById(
          "adName"
        ) as HTMLInputElement;
        if (adNameInput) {
          adNameInput.value = adName;
          adNameInput.dispatchEvent(new Event("input", { bubbles: true }));
          adNameInput.dispatchEvent(new Event("change", { bubbles: true }));
        }

        // Find merchant ID based on name
        const merchantMap: { [key: string]: string } = {
          mcdonald: "m11",
          cvs: "m1",
          target: "m7",
          starbucks: "m10",
          "best buy": "m3",
          walgreens: "m14",
          walmart: "m6",
        };

        const merchantKey = Object.keys(merchantMap).find((key) =>
          merchantName.toLowerCase().includes(key)
        );
        const merchantId = merchantKey ? merchantMap[merchantKey] : "m11"; // Default to McDonald's

        // Trigger merchant selection programmatically
        // Look for merchant combobox and trigger selection
        setTimeout(() => {
          // Try to find and click merchant dropdown
          const merchantCombobox = document.querySelector(
            '[placeholder*="search merchants"]'
          ) as HTMLElement;
          if (merchantCombobox) {
            merchantCombobox.click();

            // Wait for dropdown to open, then find McDonald's option
            setTimeout(() => {
              const mcdonaldsOption = Array.from(
                document.querySelectorAll('[role="option"]')
              ).find((option) =>
                option.textContent?.includes("McDonald's")
              ) as HTMLElement;

              if (mcdonaldsOption) {
                mcdonaldsOption.click();
              }
            }, 200);
          }
        }, 500);

        // Show form-filling notification
        dispatch(
          addNotification({
            message: `✨ Filling out ad details: "${adName}" for ${merchantName}`,
            type: "success",
          })
        );

        return `✨ **Perfect! I'm filling in your ad details:**

📝 **Ad Name**: ${adName} ✅
🏪 **Merchant**: ${merchantName} ✅ 
🎁 **Offer**: ${offerDescription} ✅

*Watch the form fields populate automatically!*

**Next, I can help you with:**
• Media upload and creative suggestions
• Budget and targeting recommendations  
• Ad copy generation

What would you like to do next?`;
      } catch (error) {
        console.error("[DEMO] Error filling form:", error);
        return `I had trouble filling the form fields automatically. You can manually enter:
        
📝 **Ad Name**: ${adName}
🏪 **Merchant**: ${merchantName}
🎁 **Offer**: ${offerDescription}

What would you like to help with next?`;
      }
    },
  });

  useCopilotAction({
    name: "askAboutOffers",
    description:
      "Ask intelligent questions about offers and help select the best one for the campaign",
    parameters: [
      {
        name: "merchantName",
        type: "string",
        description: "The merchant name to get offers for",
        required: true,
      },
    ],
    handler: async ({ merchantName }) => {
      const merchant = merchantName.toLowerCase();
      let availableOffers: string[] = [];
      let recommendations = "";

      // Get offers based on merchant
      if (merchant.includes("mcdonald")) {
        availableOffers = [
          "Free fries with any burger purchase",
          "Buy one Big Mac, get one 50% off",
          "$1 any size drink",
          "Happy Meal toy promotion",
        ];
        recommendations =
          "For McDonald's, I recommend the **Free fries** offer - it's highly converting and appeals to all demographics.";
      } else if (merchant.includes("cvs")) {
        availableOffers = [
          "30% off select vitamins",
          "Buy 1 Get 1 on cough & cold medicine",
          "20% off beauty products",
          "$5 off $25 purchase",
        ];
        recommendations =
          "For CVS, the **vitamin discount** works well for health-conscious customers, while **BOGO cold medicine** is seasonal and high-impact.";
      } else if (merchant.includes("target")) {
        availableOffers = [
          "15% off home decor",
          "Buy 2 Get 1 Free on select items",
          "Free shipping on orders over $35",
          "Circle Week exclusive deals",
        ];
        recommendations =
          "Target's **home decor discount** appeals to a broad audience and has strong visual potential for ads.";
      } else {
        availableOffers = [
          "Special promotional offer",
          "Limited time discount",
          "Exclusive member deal",
        ];
        recommendations =
          "I can help you create a compelling offer for this merchant.";
      }

      return `🎁 **Available Offers for ${merchantName}:**

${availableOffers.map((offer, index) => `${index + 1}. ${offer}`).join("\n")}

💡 **My Recommendation:**
${recommendations}

**Which offer would you like to use for your ad?** Just tell me the number or describe what type of promotion you prefer, and I'll help set it up!`;
    },
  });

  useCopilotAction({
    name: "guideMediaUpload",
    description:
      "Guide the user through media upload and provide creative suggestions",
    parameters: [
      {
        name: "mediaType",
        type: "string",
        description: "Type of media needed (image, video, both)",
        required: false,
      },
    ],
    handler: async ({ mediaType = "image" }) => {
      dispatch(
        addNotification({
          message: `📸 Ready to help with ${mediaType} upload!`,
          type: "info",
        })
      );

      return `📸 **Media Upload Guidance:**

For your McDonald's "Free Fries" ad, I recommend:

**🎨 Visual Elements:**
• **Hero Image**: Golden fries in McDonald's branded container
• **Colors**: McDonald's red and yellow brand colors
• **Text Overlay**: "FREE FRIES" in bold, eye-catching font
• **Call-to-Action**: "Get Yours Today!"

**📱 Format Recommendations:**
• **Square (1:1)**: Best for social media feeds
• **Landscape (16:9)**: Great for display ads
• **Vertical (9:16)**: Perfect for mobile stories

**Would you like to:**
• Upload your own image files through this chat
• Get AI-generated creative concepts
• Use McDonald's brand asset library

Just drag and drop files here, or tell me what creative direction you prefer!`;
    },
  });

  useCopilotAction({
    name: "setBudgetRecommendations",
    description:
      "Provide intelligent budget recommendations based on the campaign details",
    parameters: [
      {
        name: "campaignGoal",
        type: "string",
        description:
          "Campaign objective (awareness, conversions, traffic, etc.)",
        required: false,
      },
      {
        name: "targetAudience",
        type: "string",
        description: "Target audience description",
        required: false,
      },
    ],
    handler: async ({
      campaignGoal = "conversions",
      targetAudience = "general",
    }) => {
      let budgetRange = "";
      let recommendations = "";

      if (campaignGoal.includes("awareness")) {
        budgetRange = "$500 - $2,000";
        recommendations =
          "For brand awareness, focus on reach and impressions. Cost-per-thousand-impressions (CPM) typically runs $2-5.";
      } else if (campaignGoal.includes("conversion")) {
        budgetRange = "$1,000 - $5,000";
        recommendations =
          "For conversions, expect $0.50-2.00 cost-per-activation. McDonald's free fries offers typically see 3-5% conversion rates.";
      } else {
        budgetRange = "$750 - $3,000";
        recommendations =
          "Balanced approach focusing on both reach and conversions.";
      }

      dispatch(
        addNotification({
          message: `💰 Budget recommendations calculated!`,
          type: "success",
        })
      );

      return `💰 **Smart Budget Recommendations:**

**🎯 Recommended Range**: ${budgetRange}
**📊 Goal**: ${campaignGoal.charAt(0).toUpperCase() + campaignGoal.slice(1)}

**💡 Optimization Tips:**
${recommendations}

**📈 Expected Performance (McDonald's Free Fries):**
• **Estimated Reach**: 15,000 - 25,000 people
• **Expected Activations**: 450 - 750 offers claimed
• **Cost per Activation**: $0.75 - $1.50

**🎯 Targeting Recommendations:**
• **Demographics**: Ages 18-54, families with children
• **Interests**: Fast food, dining out, family activities
• **Location**: 3-mile radius around McDonald's locations

**Ready to set this budget?** I can also help you with advanced targeting options!`;
    },
  });

  useCopilotAction({
    name: "generateAdCopy",
    description: "Generate compelling ad copy and headlines for the campaign",
    parameters: [
      {
        name: "tone",
        type: "string",
        description:
          "Desired tone (exciting, friendly, urgent, professional, etc.)",
        required: false,
      },
      {
        name: "callToAction",
        type: "string",
        description: "Specific call-to-action preference",
        required: false,
      },
    ],
    handler: async ({
      tone = "exciting",
      callToAction = "Get Yours Today",
    }) => {
      const headlines = [
        "🍟 FREE Fries with Any Burger!",
        "Golden Fries on Us - Limited Time!",
        "Your Favorite Fries, Absolutely FREE!",
        "Burger + FREE Fries = Perfect Combo!",
      ];

      const descriptions = [
        "Satisfy your cravings with our world-famous fries - completely FREE with any burger purchase! Valid at participating locations.",
        "Nothing beats the classic combo - and now your fries are on us! Order any burger and enjoy FREE fries with this exclusive offer.",
        "Make your meal complete with our signature golden fries, FREE with every burger. Limited time offer - don't miss out!",
      ];

      return `✨ **AI-Generated Ad Copy Options:**

**📝 Headlines:**
${headlines.map((h, i) => `${i + 1}. ${h}`).join("\n")}

**📖 Descriptions:**
${descriptions.map((d, i) => `${i + 1}. ${d}`).join("\n")}

**🎯 Call-to-Action Options:**
• ${callToAction}
• "Order Now"
• "Find Location"
• "Claim Offer"

**💡 Copy Strategy:**
• **Tone**: ${tone.charAt(0).toUpperCase() + tone.slice(1)} and engaging
• **Focus**: Value proposition (FREE) + product appeal
• **Urgency**: Limited time messaging
• **Brand**: McDonald's quality and taste

**Which headline and description combination do you prefer?** I can also customize the copy further based on your feedback!`;
    },
  });

  useCopilotAction({
    name: "reviewAndLaunch",
    description:
      "Review the complete ad setup and guide through final launch steps",
    parameters: [],
    handler: async () => {
      dispatch(
        addNotification({
          message: `🚀 Preparing final ad review!`,
          type: "success",
        })
      );

      return `🚀 **Final Ad Review - McDonald's Free Fries Campaign:**

**✅ Campaign Summary:**
• **Ad Name**: McDonald's Free Fries Promotion
• **Merchant**: McDonald's Corporation
• **Offer**: Free fries with any burger purchase
• **Budget**: $1,000 - $5,000 (recommended)
• **Media**: Hero image with golden fries
• **Targeting**: Families, fast food enthusiasts, 3-mile radius

**📊 Pre-Launch Checklist:**
✅ Ad creative approved
✅ Budget allocation set
✅ Target audience defined
✅ Offer terms configured
✅ Tracking pixels installed

**🎯 Predicted Performance:**
• **Estimated Reach**: 20,000+ people
• **Expected Activations**: 600+ offer claims
• **ROI Projection**: 3.2x return on ad spend

**Ready to launch?** Your ad will go live immediately and start reaching hungry customers! 

**Final Options:**
• "Launch Campaign" - Go live now
• "Schedule for Later" - Set launch time
• "Make Adjustments" - Modify settings
• "Save as Draft" - Continue later

What would you like to do?`;
    },
  });

  // 🎬 DEMO: Redux-based form filler
  useCopilotAction({
    name: "fillMcDonaldsDemo",
    description:
      "Instantly create a McDonald's demo ad using Redux state management",
    parameters: [],
    handler: async () => {
      console.log("[DEMO] 🎬 Creating McDonald's demo ad in Redux");

      const mcdonaldsMerchant = DEMO_MERCHANTS.find(
        (m) => m.dba === "McDonald's"
      );
      const friesOffer = DEMO_OFFERS.find((o) => o.merchantId === "m11");

      if (mcdonaldsMerchant && friesOffer) {
        const demoAd: CampaignAd = {
          id: uuidv4(),
          name: "McDonald's Free Fries Summer Campaign",
          merchantId: mcdonaldsMerchant.id,
          merchantName: mcdonaldsMerchant.name,
          offerId: friesOffer.id,
          mediaType: ["display_banner", "native"],
          mediaAssets: [],
          costPerActivation: 1.25,
          costPerRedemption: 2.5,
        };

        // Add to Redux store
        dispatch(addAd(demoAd));

        dispatch(
          addNotification({
            message: `🎬 Demo ad created! McDonald's Free Fries campaign is ready.`,
            type: "success",
          })
        );

        return `🎬 **Demo Ad Successfully Created!**

✅ **Ad Name**: McDonald's Free Fries Summer Campaign
✅ **Merchant**: McDonald's Corporation
✅ **Offer**: Free fries with any burger
✅ **Media Types**: Display Banner, Native
✅ **Pricing**: $1.25 CPA, $2.50 CPR

*The ad has been added to your campaign! Check the form to see the populated data.*

**Ready for next steps:**
• Upload creative assets
• Set targeting parameters
• Generate ad copy variations
• Launch the campaign

What would you like to do next?`;
      }

      return `Demo ad creation encountered an issue, but I can still guide you manually!`;
    },
  });

  // 🎯 COMPREHENSIVE AD CREATION WORKFLOW - Direct Redux Integration

  // 🧭 NAVIGATION - Go to ad creation page
  useCopilotAction({
    name: "goToAdCreation",
    description: "Navigate to the ad creation form page",
    parameters: [],
    handler: async () => {
      console.log("[DEMO] 🧭 Navigating to ad creation page");

      // Navigate to ad creation page
      dispatch(setCurrentPage("/campaign-manager/ads-create"));
      router.push("/campaign-manager/ads-create");

      dispatch(
        addNotification({
          message: `🧭 Navigated to ad creation form!`,
          type: "info",
        })
      );

      return `🧭 **Navigated to Ad Creation Form!**

You're now on the ad creation page at: \`/campaign-manager/ads-create\`

**Ready to create ads! Available commands:**
• "Create McDonald's ad" - Instant demo setup
• "Create ad for [merchant]" - Smart merchant matching
• "Check form status" - See current form state

What would you like to create?`;
    },
  });

  // 🎬 DEMO: Create McDonald's ad instantly via Redux
  useCopilotAction({
    name: "createMcDonaldsAd",
    description:
      "Create a complete McDonald's ad campaign with all details populated in Redux state",
    parameters: [],
    handler: async () => {
      console.log("[DEMO] 🎬 Creating McDonald's ad via Redux");

      // First, ensure we're on the right page
      if (!currentPage.includes("ads-create")) {
        dispatch(setCurrentPage("/campaign-manager/ads-create"));
        router.push("/campaign-manager/ads-create");
      }

      const mcdonaldsMerchant = DEMO_MERCHANTS.find(
        (m) => m.dba === "McDonald's"
      );
      const friesOffer = DEMO_OFFERS.find((o) => o.merchantId === "m11");

      if (mcdonaldsMerchant && friesOffer) {
        const demoAd: CampaignAd = {
          id: uuidv4(),
          name: "McDonald's Free Fries Summer Campaign",
          merchantId: mcdonaldsMerchant.id,
          merchantName: mcdonaldsMerchant.name,
          offerId: friesOffer.id,
          mediaType: ["display_banner", "native"],
          mediaAssets: [],
          costPerActivation: 1.25,
          costPerRedemption: 2.5,
        };

        // Add to Redux store - the form will automatically update!
        dispatch(addAd(demoAd));

        dispatch(
          addNotification({
            message: `🎬 McDonald's campaign created! Check the form - it's automatically populated.`,
            type: "success",
          })
        );

        return `🎬 **McDonald's Ad Campaign Created Successfully!**

✅ **Ad Name**: McDonald's Free Fries Summer Campaign
✅ **Merchant**: McDonald's Corporation  
✅ **Offer**: Free fries with any burger
✅ **Media Types**: Display Banner + Native
✅ **Pricing**: $1.25 CPA, $2.50 CPR

*I've navigated you to the ad creation form and populated it with this data!*

**What you'll see in the form:**
• Ad name field filled automatically
• McDonald's selected in merchant dropdown  
• Free fries offer pre-selected
• Media types configured

**Next steps I can help with:**
• Upload media assets
• Set budget and targeting
• Generate ad copy
• Launch the campaign

What would you like to do next?`;
      }

      return `Demo ad creation encountered an issue, but I can still guide you manually!`;
    },
  });

  // 🎯 SMART AD CREATION - From user intent
  useCopilotAction({
    name: "createAdForMerchant",
    description:
      "Create an ad campaign for any merchant with intelligent offer matching",
    parameters: [
      {
        name: "merchantName",
        type: "string",
        description: "Merchant name (McDonald's, CVS, Target, Starbucks, etc.)",
        required: true,
      },
      {
        name: "campaignName",
        type: "string",
        description: "Custom campaign name (optional)",
        required: false,
      },
    ],
    handler: async ({ merchantName, campaignName }) => {
      console.log("[DEMO] 🎯 Creating ad for merchant:", merchantName);

      // First, ensure we're on the right page
      if (!currentPage.includes("ads-create")) {
        dispatch(setCurrentPage("/campaign-manager/ads-create"));
        router.push("/campaign-manager/ads-create");
      }

      // Find matching merchant
      const merchant = DEMO_MERCHANTS.find(
        (m) =>
          m.dba.toLowerCase().includes(merchantName.toLowerCase()) ||
          m.name.toLowerCase().includes(merchantName.toLowerCase())
      );

      if (!merchant) {
        return `❌ Sorry, I couldn't find a merchant matching "${merchantName}". 

Available merchants: ${DEMO_MERCHANTS.map((m) => m.dba).join(", ")}

Would you like me to navigate you to the ad creation page to explore available options?`;
      }

      // Find best offer for this merchant
      const offer = DEMO_OFFERS.find((o) => o.merchantId === merchant.id);

      if (!offer) {
        return `❌ No offers available for ${merchant.dba} right now.`;
      }

      const finalCampaignName =
        campaignName || `${merchant.dba} ${offer.shortText} Campaign`;

      const newAd: CampaignAd = {
        id: uuidv4(),
        name: finalCampaignName,
        merchantId: merchant.id,
        merchantName: merchant.name,
        offerId: offer.id,
        mediaType: ["display_banner"],
        mediaAssets: [],
        costPerActivation: 1.0 + Math.random() * 2, // Random pricing for demo
        costPerRedemption: 2.0 + Math.random() * 3,
      };

      // Add to Redux - form updates automatically!
      dispatch(addAd(newAd));

      dispatch(
        addNotification({
          message: `🎯 Created "${finalCampaignName}" - form auto-populated!`,
          type: "success",
        })
      );

      return `🎯 **Ad Campaign Created Successfully!**

✅ **Campaign**: ${finalCampaignName}
✅ **Merchant**: ${merchant.dba}
✅ **Offer**: ${offer.name}
✅ **Cost**: $${newAd.costPerActivation.toFixed(2)} CPA, $${newAd.costPerRedemption.toFixed(2)} CPR

*I've navigated you to the ad creation form and populated it with this data!*

**Ready for next steps:**
• Add media assets
• Configure targeting
• Set budget limits
• Launch campaign

What would you like to work on next?`;
    },
  });

  // 📝 FORM MANAGEMENT - Update existing ad
  useCopilotAction({
    name: "updateAdDetails",
    description: "Update details of an existing ad campaign in the form",
    parameters: [
      {
        name: "adId",
        type: "string",
        description:
          "ID of the ad to update (or 'current' for the most recent)",
        required: false,
      },
      {
        name: "newName",
        type: "string",
        description: "New campaign name",
        required: false,
      },
      {
        name: "newMediaTypes",
        type: "string",
        description:
          "Comma-separated media types (display_banner, native, double_decker)",
        required: false,
      },
    ],
    handler: async ({ adId = "current", newName, newMediaTypes }) => {
      const ads = campaignState.formData.ads;

      if (ads.length === 0) {
        return `❌ No ads found. Create an ad first using "Create McDonald's ad" or "Create ad for [merchant]".`;
      }

      // Find the ad to update
      const targetAd =
        adId === "current"
          ? ads[ads.length - 1]
          : ads.find((ad) => ad.id === adId);

      if (!targetAd) {
        return `❌ Could not find ad with ID: ${adId}`;
      }

      const updates: Partial<CampaignAd> = {};

      if (newName) {
        updates.name = newName;
      }

      if (newMediaTypes) {
        const mediaTypesArray = newMediaTypes
          .split(",")
          .map((type) => type.trim());
        updates.mediaType = mediaTypesArray;
      }

      // Update via Redux
      dispatch(updateAd({ id: targetAd.id, data: updates }));

      dispatch(
        addNotification({
          message: `✏️ Updated "${targetAd.name}" - changes reflected in form!`,
          type: "success",
        })
      );

      return `✏️ **Ad Campaign Updated Successfully!**

📝 **Campaign**: ${newName || targetAd.name}
${newMediaTypes ? `📱 **Media Types**: ${newMediaTypes}` : ""}

*The form has been automatically updated with your changes!*

**Available actions:**
• Continue editing details
• Add media assets  
• Review and launch

What would you like to do next?`;
    },
  });

  // 🗑️ CLEANUP - Remove ads
  useCopilotAction({
    name: "removeAd",
    description: "Remove an ad campaign from the current session",
    parameters: [
      {
        name: "adId",
        type: "string",
        description: "ID of ad to remove, or 'all' to clear everything",
        required: false,
      },
    ],
    handler: async ({ adId = "current" }) => {
      const ads = campaignState.formData.ads;

      if (ads.length === 0) {
        return `ℹ️ No ads to remove - the form is already empty.`;
      }

      if (adId === "all") {
        // Remove all ads
        ads.forEach((ad) => dispatch(removeAd(ad.id)));

        dispatch(
          addNotification({
            message: `🗑️ Cleared all ads from the form.`,
            type: "info",
          })
        );

        return `🗑️ **All Ads Cleared!**

The form has been reset and is ready for new ad creation.`;
      } else {
        // Remove specific ad
        const targetAd =
          adId === "current"
            ? ads[ads.length - 1]
            : ads.find((ad) => ad.id === adId);

        if (!targetAd) {
          return `❌ Could not find ad to remove: ${adId}`;
        }

        dispatch(removeAd(targetAd.id));

        dispatch(
          addNotification({
            message: `🗑️ Removed "${targetAd.name}" from the form.`,
            type: "info",
          })
        );

        return `🗑️ **Ad Removed Successfully!**

"${targetAd.name}" has been removed from the form.

${ads.length > 1 ? `${ads.length - 1} ads remaining in the session.` : "Form is now empty and ready for new ad creation."}`;
      }
    },
  });

  // 📊 STATUS - Check current form state
  useCopilotAction({
    name: "checkFormStatus",
    description:
      "Check the current state of the ad creation form and provide guidance",
    parameters: [],
    handler: async () => {
      const ads = campaignState.formData.ads;
      const isOnAdPage =
        campaignState.currentStep === 0 || currentPage.includes("ads-create");

      if (!isOnAdPage) {
        return `📍 **Not on Ad Creation Page**

You're currently at: ${currentPage}

Would you like me to navigate you to the ad creation page?`;
      }

      if (ads.length === 0) {
        return `📝 **Empty Form - Ready for Ad Creation**

The ad creation form is empty and ready for new campaigns.

**Quick start options:**
• "Create McDonald's ad" - Instant demo setup
• "Create ad for [merchant name]" - Smart merchant matching
• "Fill form with..." - Custom ad details

**Available merchants:** ${DEMO_MERCHANTS.map((m) => m.dba).join(", ")}

What would you like to create?`;
      }

      const adsList = ads
        .map(
          (ad, index) =>
            `${index + 1}. **${ad.name}** (${ad.merchantName} - ${ad.mediaType.length} media types)`
        )
        .join("\n");

      return `📊 **Current Form Status**

✅ **${ads.length} ad${ads.length > 1 ? "s" : ""} in progress:**

${adsList}

**Available actions:**
• Update ad details
• Add media assets  
• Remove ads
• Create additional ads
• Review and launch

What would you like to do next?`;
    },
  });
}

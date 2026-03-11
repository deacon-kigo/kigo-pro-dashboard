export interface LandingPageConfig {
  id?: string;
  // Campaign Settings
  campaignName: string;
  googleTagManagerId: string;
  affiliateSlug: string;
  isActive: boolean;
  endCampaignDate: string;
  getCode: "pos" | "with-timer" | "online" | "direct-link" | "";
  // Page Content
  logo: {
    url: string;
    alt: string;
  };
  title: string;
  description: string;
  image: {
    url: string;
    alt: string;
  };
  secondaryDescription: string;
  formFields: FormField[];
  showForm: boolean;
  submitButton: {
    text: string;
    backgroundColor: string;
    textColor: string;
    style: "contained" | "outline" | "text";
    borderRadius: number;
    redirectUrl: string;
  };
  linkButtons: LinkButton[];
  copyCode: {
    enabled: boolean;
    code: string;
    copyButtonColor: string;
    borderRadius: number;
    button: {
      enabled: boolean;
      text: string;
      url: string;
      backgroundColor: string;
      textColor: string;
      borderRadius: number;
    };
  };
  appStoreLink: {
    enabled: boolean;
    url: string;
  };
  googlePlayLink: {
    enabled: boolean;
    url: string;
  };
  legalText: string;
  backgroundColor: string;
  // With Timer Page Config
  withTimerConfig: {
    title: string;
    subtitle: string;
    description: string;
    primaryButton: {
      text: string;
      backgroundColor: string;
      textColor: string;
      borderRadius: number;
    };
    secondaryButton: {
      enabled: boolean;
      text: string;
      url: string;
      backgroundColor: string;
      textColor: string;
      borderRadius: number;
    };
    showImage: boolean;
    modal: {
      title: string;
      subtitle: string;
      description: string;
      code: string;
      redeemText: string;
      countdownMinutes: number;
      timerBackgroundColor: string;
    };
  };
  // Online Page Config
  onlineConfig: {
    title: string;
    showImage: boolean;
    affiliateCodeOne: {
      enabled: boolean;
      label: string;
      copyButtonColor: string;
      borderRadius: number;
      hardcodedValue?: string;
    };
    affiliateCodeTwo: {
      enabled: boolean;
      label: string;
      copyButtonColor: string;
      borderRadius: number;
      hardcodedValue?: string;
    };
    promoBarcodeImage: {
      enabled: boolean;
      url: string;
      alt: string;
    };
    button: {
      enabled: boolean;
      text: string;
      url: string;
      backgroundColor: string;
      textColor: string;
      borderRadius: number;
      appendAffiliateCode: boolean;
    };
    description: string;
  };
  // Direct Link Config
  directLinkConfig: {
    redirectUrl: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface FormField {
  id: string;
  type: "email" | "zipcode";
  label: string;
  placeholder: string;
  required: boolean;
  urlParamKey?:
    | "zip_code"
    | "zipCode"
    | "zipcode"
    | "postal_code"
    | "postalcode"
    | "postalCode";
  maxWidth?: number;
  borderRadius?: number;
}

export interface LinkButton {
  id: string;
  text: string;
  url: string;
  style: "contained" | "outline" | "text";
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  maxWidth: number;
}

export const defaultLandingPageConfig: LandingPageConfig = {
  // Campaign Settings
  campaignName: "",
  googleTagManagerId: "",
  affiliateSlug: "",
  isActive: true,
  endCampaignDate: "",
  getCode: "",
  // Page Content
  logo: {
    url: "",
    alt: "Company Logo",
  },
  title: "Your Amazing Offer",
  description:
    "<p>Get exclusive access to our special promotion. Limited time only!</p>",
  image: {
    url: "",
    alt: "Product Image",
  },
  secondaryDescription: "",
  formFields: [
    {
      id: "1",
      type: "email",
      label: "Email Address",
      placeholder: "Enter your email",
      required: true,
      urlParamKey: undefined,
      maxWidth: 400,
      borderRadius: 8,
    },
  ],
  showForm: true,
  submitButton: {
    text: "Get My Offer",
    backgroundColor: "#000000",
    textColor: "#ffffff",
    style: "contained",
    borderRadius: 6,
    redirectUrl: "",
  },
  linkButtons: [],
  copyCode: {
    enabled: false,
    code: "",
    copyButtonColor: "#3b82f6",
    borderRadius: 8,
    button: {
      enabled: false,
      text: "Redeem",
      url: "",
      backgroundColor: "#6b7034",
      textColor: "#ffffff",
      borderRadius: 25,
    },
  },
  appStoreLink: {
    enabled: false,
    url: "",
  },
  googlePlayLink: {
    enabled: false,
    url: "",
  },
  legalText: "",
  backgroundColor: "#ffffff",
  withTimerConfig: {
    title: "Your Offer",
    subtitle:
      '<p><span style="color: #8b6914; font-weight: 500;">DRIVE THRU</span> <span style="color: #4b5563;">or</span> <span style="color: #8b6914; font-weight: 500;">CARRY OUT</span></p>',
    description:
      "<p>Show the code to your server to receive the discount.<br/>Be careful not to share this code.<br/><strong>It's just for you and will only work once!</strong></p>",
    primaryButton: {
      text: "Show My Code",
      backgroundColor: "#000000",
      textColor: "#ffffff",
      borderRadius: 25,
    },
    secondaryButton: {
      enabled: true,
      text: "Find A Location",
      url: "",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      borderRadius: 25,
    },
    showImage: true,
    modal: {
      title: "Your Offer",
      subtitle:
        '<p><span style="color: #8b6914; font-weight: 500;">DRIVE THRU</span> <span style="color: #4b5563;">or</span> <span style="color: #8b6914; font-weight: 500;">CARRY OUT</span></p>',
      description:
        "<p>Show this code to your server<br/>The discount will be applied to your bill</p>",
      code: "",
      redeemText: "Redeem in the next",
      countdownMinutes: 30,
      timerBackgroundColor: "#e07c3e",
    },
  },
  onlineConfig: {
    title: "Your Offer",
    showImage: true,
    affiliateCodeOne: {
      enabled: true,
      label: "Promo Code",
      copyButtonColor: "#3b82f6",
      borderRadius: 8,
      hardcodedValue: "",
    },
    affiliateCodeTwo: {
      enabled: false,
      label: "Secondary Code",
      copyButtonColor: "#3b82f6",
      borderRadius: 8,
      hardcodedValue: "",
    },
    promoBarcodeImage: {
      enabled: false,
      url: "",
      alt: "Promo Barcode",
    },
    button: {
      enabled: true,
      text: "Order Now",
      url: "",
      backgroundColor: "#000000",
      textColor: "#ffffff",
      borderRadius: 25,
      appendAffiliateCode: false,
    },
    description: "<p>Use this code at checkout to receive your discount.</p>",
  },
  directLinkConfig: {
    redirectUrl: "",
  },
};

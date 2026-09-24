import {
  adManagerV2ApiRoutes,
  adManagerV2WebRoutes,
} from "@/components/prod/shell/ad-manager-v2/routes";
import {
  adManagerApiRoutes,
  adManagerWebRoutes,
} from "@/components/prod/shell/ad-manager/routes";
import {
  catalogFiltersApiRoutes,
  catalogFiltersWebRoutes,
} from "@/components/prod/shell/catalog-filters/routes";
import {
  hostedWalletManagerApiRoutes,
  hostedWalletManagerWebRoutes,
} from "@/components/prod/shell/hosted-wallet-manager/routes";
import {
  manualReviewApiRoutes,
  manualReviewWebRoutes,
} from "@/components/prod/shell/manual-review/routes";
import {
  merchantManagerApiRoutes,
  merchantManagerWebRoutes,
} from "@/components/prod/shell/merchant-manager/routes";
import {
  offerManagerApiRoutes,
  offerManagerWebRoutes,
} from "@/components/prod/shell/offer-manager/routes";
import { publisherManagerWebRoutes } from "@/components/prod/shell/publisher-manager/routes";
import {
  supportManagerApiRoutes,
  supportManagerWebRoutes,
} from "@/components/prod/shell/support-manager/routes";
import {
  sweepstakesApiRoutes,
  sweepstakesWebRoutes,
} from "@/components/prod/shell/sweepstakes/routes";
import { tmtApiRoutes, tmtWebRoutes } from "@/components/prod/shell/tmt/routes";
import { uiManagerWebRoutes } from "@/components/prod/shell/ui-manager/routes";
import { webBuilderApiRoutes } from "@/components/prod/shell/web-builder/routes";

const ROUTES = {
  api: {
    // * Ad Manager
    adManager: adManagerApiRoutes,
    // * Ad Manager v2
    adManagerV2: adManagerV2ApiRoutes,
    // * Auth
    auth: {
      refreshAccessToken: "/dashboard/auth/access-tokens/refresh",
      samlSsoUrl: "/dashboard/auth/saml/sso-url",
      signOut: "/dashboard/auth/log-out",
    },
    // * Catalog Filters
    catalogFilters: catalogFiltersApiRoutes,
    // * Config
    config: {
      categories: "/dashboard/config/categorisation",
      commodities: "/dashboard/config/commodities",
      offerEligibilities: "/dashboard/config/offer-eligibilities",
      tags: "/dashboard/config/tags",
    },
    // * Images
    images: {
      upload: "/dashboard/images/upload",
    },
    // * Manual Review
    manualReview: manualReviewApiRoutes,
    // * Merchants
    merchants: {
      countries: "/dashboard/merchants/locations/countries",
      create: "/dashboard/merchants",
      createBulkLocations: "/dashboard/merchants/:merchantId/locations/bulk",
      get: "/dashboard/merchants/:merchantId",
      getLocations: "/dashboard/merchants/:merchantId/locations",
      list: "/dashboard/merchants",
      sources: "/dashboard/merchants/sources",
      update: "/dashboard/merchants/:merchantId",
      updateBulkLocations: "/dashboard/merchants/:merchantId/locations/bulk",
    },
    // * Offer Manager
    offerManager: offerManagerApiRoutes,
    // * Partners
    partners: {
      list: "/dashboard/partners",
    },
    // * Programs
    programs: {
      brandingConfigs: "/dashboard/programs/program-branding-configurations",
      list: "/dashboard/programs",
    },
    // * Collection creators (brands)
    collectionCreators: {
      all: "/dashboard/collections/creators/all",
    },
    // * Collections
    collections: {
      list: "/dashboard/collections",
    },
    // * Products
    products: {
      get: "/dashboard/products/:productId",
      update: "/dashboard/products",
    },
    // * Promoted Campaigns
    promotedCampaigns: {
      createTargetingRule: "/dashboard/program-campaigns/targeting-rules",
      list: "/dashboard/program-campaigns",
      update: "/dashboard/program-campaigns/:programCampaignId",
      updateTargetingRule:
        "/dashboard/program-campaigns/targeting-rules/:programCampaignId",
      withPartners: "/dashboard/program-campaigns/hierarchical",
    },
    // * Session
    session: {
      get: "/sso/sessions/admin-tokens",
    },
    // * Support Manager
    supportManager: supportManagerApiRoutes,
    // * TMT
    tmt: tmtApiRoutes,
    // * Web Builder
    webBuilder: webBuilderApiRoutes,
    // * Hosted Wallet Manager
    hostedWalletManager: hostedWalletManagerApiRoutes,
    // * Merchant Manager
    merchantManager: merchantManagerApiRoutes,
    // * Sweepstakes
    sweepstakes: sweepstakesApiRoutes,
  },
  external: {
    help: "https://kigopro.zendesk.com/hc/en-us",
  },
  nextApi: {
    proxyImage: "/api/proxy-image",
    session: "/api/session",
  },
  web: {
    // * Ad Manager
    adManager: adManagerWebRoutes,
    // * Ad Manager v2
    adManagerV2: adManagerV2WebRoutes,
    aiAssistant: "/ai-assistant",
    analytics: "/analytics",
    // * Auth
    auth: {
      login: "/login",
      signOutExpiredSession: "/sign-out-expired-session",
    },
    // * Catalog Filters
    catalogFilters: catalogFiltersWebRoutes,
    dashboard: "/",
    // * Manual Review
    manualReview: manualReviewWebRoutes,
    // * Merchants
    merchants: {
      create: "/merchants/create",
    },
    // * Offer Manager
    offerManager: offerManagerWebRoutes,
    // * Support Manager
    supportManager: supportManagerWebRoutes,
    // * TMT
    tmt: tmtWebRoutes,
    // * UI Manager
    uiManager: uiManagerWebRoutes,
    // * Hosted Wallet Manager
    hostedWalletManager: hostedWalletManagerWebRoutes,
    // * Merchant Manager
    merchantManager: merchantManagerWebRoutes,
    // * Publisher Manager
    publisherManager: publisherManagerWebRoutes,
    // * Sweepstakes
    sweepstakes: sweepstakesWebRoutes,
  },
} as const;

type Leaves<T> = T extends string
  ? T
  : { [K in keyof T]: Leaves<T[K]> }[keyof T];

type WebRoute = Leaves<typeof ROUTES.web>;

export { ROUTES, type WebRoute };

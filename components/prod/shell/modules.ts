import type { ModuleConfig } from "./shared/types/module";

import { moduleConfig as adManagerV2 } from "./ad-manager-v2/config";
import { moduleConfig as adManager } from "./ad-manager/config";
import { moduleConfig as aiAssistant } from "./ai-assistant/config";
import { moduleConfig as catalogFilters } from "./catalog-filters/config";
import { moduleConfig as dashboard } from "./config";
import { moduleConfig as hostedWalletManager } from "./hosted-wallet-manager/config";
import { moduleConfig as johnDeere } from "./john-deere/config";
import { moduleConfig as manualReview } from "./manual-review/config";
import { moduleConfig as merchantManager } from "./merchant-manager/config";
import { moduleConfig as offerManager } from "./offer-manager/config";
import { moduleConfig as optumOffers } from "./optum-offers/config";
import { moduleConfig as publisherManager } from "./publisher-manager/config";
import { moduleConfig as supportManager } from "./support-manager/config";
import { moduleConfig as sweepstakes } from "./sweepstakes/config";
import { moduleConfig as tmt } from "./tmt/config";
import { moduleConfig as uiManager } from "./ui-manager/config";

const modules: ModuleConfig[] = [
  dashboard,
  adManager,
  adManagerV2,
  offerManager,
  catalogFilters,
  aiAssistant,
  supportManager,
  johnDeere,
  manualReview,
  tmt,
  uiManager,
  hostedWalletManager,
  merchantManager,
  publisherManager,
  sweepstakes,
  optumOffers,
];

export { modules };

import StatusBadge, { StatusType } from "./StatusBadge";
import TokenStateBadge, { TokenState } from "./TokenStateBadge";
import TicketBadge, {
  TicketStatus,
  SupportTier,
  TicketStatusBadge,
  TierBadge,
} from "./TicketBadge";
import VersionBadge, { VersionType } from "./VersionBadge";
import ReceiptStatusBadge, {
  ReceiptVerificationStatus,
} from "./ReceiptStatusBadge";

// Component exports
export {
  StatusBadge,
  TokenStateBadge,
  TicketBadge,
  TicketStatusBadge,
  TierBadge,
  VersionBadge,
  ReceiptStatusBadge,
};

// Type exports
export type {
  StatusType,
  TokenState,
  TicketStatus,
  SupportTier,
  VersionType,
  ReceiptVerificationStatus,
};

export default {
  StatusBadge,
  TokenStateBadge,
  TicketBadge,
  VersionBadge,
  ReceiptStatusBadge,
};

/**
 * Feature Flags Configuration
 *
 * This file centralizes feature flags for the application.
 * Uses NEXT_PUBLIC_ prefix for client-side access.
 *
 * Usage:
 * - Set environment variables in .env.local or .env.production
 * - Access flags via the exported constants
 *
 * Example in .env.local:
 * NEXT_PUBLIC_FEATURE_MEMBER_PROFILE_TAB=true
 * NEXT_PUBLIC_FEATURE_MEMBER_HISTORY_TAB=false
 */

/**
 * Parse environment variable to boolean
 * Handles string values like "true", "false", "1", "0"
 */
function parseEnvBoolean(
  value: string | undefined,
  defaultValue: boolean
): boolean {
  if (value === undefined) return defaultValue;
  return value === "true" || value === "1";
}

/**
 * Parse environment variable to string value
 * Returns the value or default if undefined
 */
function parseEnvString(
  value: string | undefined,
  defaultValue: string
): string {
  return value || defaultValue;
}

/**
 * Member CRM Feature Flags
 *
 * These flags control which tabs/features are visible in the Member Detail View
 */
export const FEATURE_FLAGS = {
  // ========================================
  // OFFER CREATION FORM - SKATEBOARD TO CAR
  // ========================================

  /**
   * Offer Creation Form Version
   *
   * Skateboard-to-car progression for offer creation UX:
   *
   * **SKATEBOARD** (v1) - Current Implementation
   * - Manual form with all required fields
   * - Multi-step wizard (Offer Details → Redemption Method → Review)
   * - Merchant/source selection with creatable dropdown
   * - Category & commodity multi-select
   * - Redemption method choice (promo code, receipt scan, affiliate)
   * - Review & submit
   * Status: ✅ PRODUCTION - Fully functional
   *
   * **BIKE** (v2) - Enhanced with Smart Defaults
   * - All v1 features +
   * - Smart field defaults based on merchant/category selection
   * - Inline validation with helpful error messages
   * - Field dependencies (e.g., auto-suggest categories based on merchant)
   * - Draft auto-save functionality
   * - Progress indicator with completion percentage
   * Status: 🚧 PLANNED
   *
   * **CAR** (v3) - AI-Assisted Creation
   * - All v2 features +
   * - AI-powered offer suggestions from natural language input
   * - "Ask AI" buttons for each field with contextual help
   * - Bulk import from CSV/Excel
   * - Template library (common offer patterns)
   * - A/B testing recommendations
   * Status: 🔮 FUTURE
   *
   * **ROCKET** (v4) - Fully Autonomous
   * - All v3 features +
   * - AI analyzes merchant data and auto-generates offers
   * - Performance predictions before launch
   * - Auto-optimization based on real-time data
   * - Integration with CRM for personalized offers
   * Status: 🔮 VISION
   *
   * @default "v1"
   * @env NEXT_PUBLIC_OFFER_CREATION_VERSION
   */
  OFFER_CREATION_VERSION: parseEnvString(
    process.env.NEXT_PUBLIC_OFFER_CREATION_VERSION,
    "v1"
  ) as "v1" | "v2" | "v3" | "v4",

  /**
   * Enable specific v2 features independently (for gradual rollout)
   */
  OFFER_FORM_SMART_DEFAULTS: parseEnvBoolean(
    process.env.NEXT_PUBLIC_OFFER_FORM_SMART_DEFAULTS,
    false
  ),

  OFFER_FORM_INLINE_VALIDATION: parseEnvBoolean(
    process.env.NEXT_PUBLIC_OFFER_FORM_INLINE_VALIDATION,
    false
  ),

  OFFER_FORM_AUTO_SAVE: parseEnvBoolean(
    process.env.NEXT_PUBLIC_OFFER_FORM_AUTO_SAVE,
    false
  ),

  /**
   * Enable specific v3 features independently
   */
  OFFER_FORM_AI_ASSIST: parseEnvBoolean(
    process.env.NEXT_PUBLIC_OFFER_FORM_AI_ASSIST,
    false
  ),

  OFFER_FORM_BULK_IMPORT: parseEnvBoolean(
    process.env.NEXT_PUBLIC_OFFER_FORM_BULK_IMPORT,
    false
  ),

  OFFER_FORM_TEMPLATES: parseEnvBoolean(
    process.env.NEXT_PUBLIC_OFFER_FORM_TEMPLATES,
    false
  ),

  // ========================================
  // MEMBER CRM
  // ========================================
  /**
   * Member Profile Tab
   * Shows: Account information, contact details, program enrollment
   * Status: OUT OF SCOPE for initial release (future enhancement)
   * Default: false
   */
  MEMBER_PROFILE_TAB: parseEnvBoolean(
    process.env.NEXT_PUBLIC_FEATURE_MEMBER_PROFILE_TAB,
    false
  ),

  /**
   * Member History Tab
   * Shows: Transaction history with receipts
   * Status: OUT OF SCOPE for initial release (future enhancement)
   * Default: false
   */
  MEMBER_HISTORY_TAB: parseEnvBoolean(
    process.env.NEXT_PUBLIC_FEATURE_MEMBER_HISTORY_TAB,
    false
  ),

  /**
   * Points Management Tab
   * Shows: Balance, adjustment guidelines, "Adjust Points" button
   * Status: DEPRECATED - Replaced by Customer Details tab
   * Default: false
   */
  MEMBER_POINTS_TAB: parseEnvBoolean(
    process.env.NEXT_PUBLIC_FEATURE_MEMBER_POINTS_TAB,
    false
  ),

  /**
   * Receipts Management Tab
   * Shows: Receipt submission table with review buttons
   * Status: DEPRECATED - Redundant with Customer Details tab
   * Default: false
   */
  MEMBER_RECEIPTS_TAB: parseEnvBoolean(
    process.env.NEXT_PUBLIC_FEATURE_MEMBER_RECEIPTS_TAB,
    false
  ),

  /**
   * Customer Details Tab
   * Shows: Two-panel layout with customer info, receipt table, and receipt preview
   * Status: IN SCOPE - Required for customer support and receipt review
   * Default: true
   */
  MEMBER_CUSTOMER_DETAILS_TAB: parseEnvBoolean(
    process.env.NEXT_PUBLIC_FEATURE_MEMBER_CUSTOMER_DETAILS_TAB,
    true
  ),

  /**
   * Points Analytics Panel
   * Shows: Charts and analytics on the right side
   * Status: REMOVED (not in scope)
   * Default: false
   */
  MEMBER_ANALYTICS_PANEL: parseEnvBoolean(
    process.env.NEXT_PUBLIC_FEATURE_MEMBER_ANALYTICS_PANEL,
    false
  ),
} as const;

/**
 * Helper to check if any tab feature is enabled
 */
export function hasAnyTabEnabled(): boolean {
  return (
    FEATURE_FLAGS.MEMBER_PROFILE_TAB ||
    FEATURE_FLAGS.MEMBER_HISTORY_TAB ||
    FEATURE_FLAGS.MEMBER_POINTS_TAB ||
    FEATURE_FLAGS.MEMBER_RECEIPTS_TAB ||
    FEATURE_FLAGS.MEMBER_CUSTOMER_DETAILS_TAB
  );
}

/**
 * Get list of enabled tabs in order
 */
export function getEnabledTabs(): Array<
  "profile" | "points" | "history" | "receipts" | "customer"
> {
  const tabs: Array<
    "profile" | "points" | "history" | "receipts" | "customer"
  > = [];

  // Customer Details is the primary tab (for Optum launch)
  if (FEATURE_FLAGS.MEMBER_CUSTOMER_DETAILS_TAB) tabs.push("customer");
  if (FEATURE_FLAGS.MEMBER_RECEIPTS_TAB) tabs.push("receipts");
  if (FEATURE_FLAGS.MEMBER_HISTORY_TAB) tabs.push("history");
  if (FEATURE_FLAGS.MEMBER_POINTS_TAB) tabs.push("points");
  if (FEATURE_FLAGS.MEMBER_PROFILE_TAB) tabs.push("profile");

  return tabs;
}

/**
 * Get the default tab (first enabled tab, prioritizes Customer Details)
 */
export function getDefaultTab():
  | "profile"
  | "points"
  | "history"
  | "receipts"
  | "customer" {
  const enabledTabs = getEnabledTabs();
  return enabledTabs[0] || "customer"; // Fallback to 'customer' if none enabled
}

// ========================================
// OFFER CREATION HELPERS
// ========================================

/**
 * Get current offer creation form version
 * Returns the version string for component selection
 */
export function getOfferCreationVersion(): "v1" | "v2" | "v3" | "v4" {
  return FEATURE_FLAGS.OFFER_CREATION_VERSION;
}

/**
 * Check if offer form is using v2 or higher
 * Useful for progressive enhancement checks
 */
export function isOfferFormV2OrHigher(): boolean {
  const version = FEATURE_FLAGS.OFFER_CREATION_VERSION;
  return version === "v2" || version === "v3" || version === "v4";
}

/**
 * Check if offer form is using v3 or higher
 */
export function isOfferFormV3OrHigher(): boolean {
  const version = FEATURE_FLAGS.OFFER_CREATION_VERSION;
  return version === "v3" || version === "v4";
}

/**
 * Check if a specific offer form feature is enabled
 * Respects both version-based and individual feature flags
 */
export function isOfferFormFeatureEnabled(
  feature:
    | "smartDefaults"
    | "inlineValidation"
    | "autoSave"
    | "aiAssist"
    | "bulkImport"
    | "templates"
): boolean {
  const version = FEATURE_FLAGS.OFFER_CREATION_VERSION;

  switch (feature) {
    case "smartDefaults":
      return (
        FEATURE_FLAGS.OFFER_FORM_SMART_DEFAULTS ||
        version === "v2" ||
        version === "v3" ||
        version === "v4"
      );

    case "inlineValidation":
      return (
        FEATURE_FLAGS.OFFER_FORM_INLINE_VALIDATION ||
        version === "v2" ||
        version === "v3" ||
        version === "v4"
      );

    case "autoSave":
      return (
        FEATURE_FLAGS.OFFER_FORM_AUTO_SAVE ||
        version === "v2" ||
        version === "v3" ||
        version === "v4"
      );

    case "aiAssist":
      return (
        FEATURE_FLAGS.OFFER_FORM_AI_ASSIST ||
        version === "v3" ||
        version === "v4"
      );

    case "bulkImport":
      return (
        FEATURE_FLAGS.OFFER_FORM_BULK_IMPORT ||
        version === "v3" ||
        version === "v4"
      );

    case "templates":
      return (
        FEATURE_FLAGS.OFFER_FORM_TEMPLATES ||
        version === "v3" ||
        version === "v4"
      );

    default:
      return false;
  }
}

/**
 * Get description of current offer creation version
 */
export function getOfferCreationVersionDescription(): string {
  const version = FEATURE_FLAGS.OFFER_CREATION_VERSION;

  switch (version) {
    case "v1":
      return "Skateboard - Manual form with all required fields";
    case "v2":
      return "Bike - Enhanced with smart defaults and validation";
    case "v3":
      return "Car - AI-assisted creation with templates";
    case "v4":
      return "Rocket - Fully autonomous offer generation";
    default:
      return "Unknown version";
  }
}

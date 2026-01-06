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
 * Member CRM Feature Flags
 *
 * These flags control which tabs/features are visible in the Member Detail View
 */
export const FEATURE_FLAGS = {
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

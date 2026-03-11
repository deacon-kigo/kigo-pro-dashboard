/**
 * Timezone utilities for handling Eastern Time (ET) dates.
 *
 * Campaign end dates are stored without timezone info (e.g., "2026-06-01T05:00")
 * but should always be interpreted as Eastern Time (America/New_York).
 *
 * This handles both EST (UTC-5) and EDT (UTC-4) automatically.
 */

/**
 * Gets the UTC offset for Eastern Time on a given date.
 * Returns positive number (4 for EDT, 5 for EST) representing hours to add to ET to get UTC.
 */
function getETOffset(date: Date): number {
  // Create a date formatter for ET
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    timeZoneName: "short",
  });

  const parts = formatter.formatToParts(date);
  const tzName = parts.find((p) => p.type === "timeZoneName")?.value;

  // EDT = UTC-4, EST = UTC-5
  return tzName === "EDT" ? 4 : 5;
}

/**
 * Parses a datetime string as Eastern Time and returns a Date object in UTC.
 *
 * @param dateTimeString - A datetime string without timezone (e.g., "2026-06-01T05:00")
 * @returns Date object representing that time in ET, converted to UTC
 *
 * @example
 * // "2026-06-01T05:00" in ET = "2026-06-01T09:00:00Z" in UTC (during EDT)
 * parseAsEasternTime("2026-06-01T05:00")
 */
export function parseAsEasternTime(dateTimeString: string): Date {
  // Parse the input string components
  const [datePart, timePart] = dateTimeString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  // Create a date object for the target date to determine DST
  const targetDate = new Date(year, month - 1, day);

  // Get the ET offset for this specific date (4 for EDT, 5 for EST)
  const etOffset = getETOffset(targetDate);

  // Create UTC date by adding the offset hours
  // If it's 5:00 AM ET and offset is 4 (EDT), UTC is 9:00 AM
  // If it's 5:00 AM ET and offset is 5 (EST), UTC is 10:00 AM
  const result = new Date(
    Date.UTC(year, month - 1, day, hour + etOffset, minute, 0)
  );

  return result;
}

/**
 * Checks if a campaign has expired based on its end date (interpreted as ET).
 *
 * @param endCampaignDate - The campaign end date string (e.g., "2026-06-01T05:00")
 * @returns true if the campaign has expired, false otherwise
 */
export function isCampaignExpired(endCampaignDate: string): boolean {
  if (!endCampaignDate) {
    return false;
  }

  const endDateUTC = parseAsEasternTime(endCampaignDate);
  const nowUTC = new Date();

  return endDateUTC < nowUTC;
}

/**
 * Formats a datetime string for display, showing it's in ET.
 *
 * @param dateTimeString - A datetime string (e.g., "2026-06-01T05:00")
 * @returns Formatted string like "Jun 1, 2026 at 5:00 AM ET"
 */
export function formatAsEasternTime(dateTimeString: string): string {
  if (!dateTimeString) {
    return "";
  }

  const [datePart, timePart] = dateTimeString.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const date = new Date(year, month - 1, day, hour, minute);

  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${formatter.format(date)} ET`;
}

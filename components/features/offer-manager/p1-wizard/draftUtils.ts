/**
 * Draft persistence utilities for the P1.1 Offer Wizard.
 *
 * Pure utility module (no React dependencies) handling all localStorage
 * draft operations. File objects are stripped before serialization since
 * they can't survive JSON.stringify — preview URLs are preserved so
 * images still render on draft resume.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DraftData {
  draftId: string;
  currentStep: string;
  completedSteps: string[];
  savedAt: string; // ISO timestamp
  formData: SerializableFormData;
}

/** formData after stripping non-serializable values (File objects → null) */
export type SerializableFormData = Record<string, unknown> & {
  _filesStripped?: boolean;
};

// Keys that hold File objects and must be nulled before serialization
const FILE_KEYS = ["offerImageFile", "offerBannerFile"];

// Keys that are transient / irrelevant for change-detection
const TRANSIENT_KEYS = [
  "_filesStripped",
  "_editOfferId",
  "headlineAutoFilled",
  "descriptionAutoFilled",
  "categoriesAutoFilled",
  "commoditiesAutoFilled",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STORAGE_PREFIX = "draftOffer-";

function storageKey(draftId: string): string {
  return `${STORAGE_PREFIX}${draftId}`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Deep-clone formData, replace File objects with null, add flag. */
export function serializeFormData(
  formData: Record<string, unknown>
): SerializableFormData {
  const clone: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(formData)) {
    if (FILE_KEYS.includes(key)) {
      clone[key] = null;
    } else if (Array.isArray(value)) {
      // Deep-clone arrays (e.g. tiers, category_ids)
      clone[key] = JSON.parse(JSON.stringify(value));
    } else if (
      value !== null &&
      typeof value === "object" &&
      !(value instanceof File)
    ) {
      clone[key] = JSON.parse(JSON.stringify(value));
    } else if (value instanceof File) {
      clone[key] = null;
    } else {
      clone[key] = value;
    }
  }

  clone._filesStripped = true;
  return clone as SerializableFormData;
}

/** Generate a new UUID for a draft. */
export function generateDraftId(): string {
  return crypto.randomUUID();
}

/** Persist draft to localStorage. */
export function saveDraft(
  draftId: string,
  formData: Record<string, unknown>,
  currentStep: string,
  completedSteps: string[]
): void {
  const draft: DraftData = {
    draftId,
    currentStep,
    completedSteps,
    savedAt: new Date().toISOString(),
    formData: serializeFormData(formData),
  };

  try {
    localStorage.setItem(storageKey(draftId), JSON.stringify(draft));
  } catch (err) {
    console.error("[draftUtils] saveDraft failed:", err);
  }
}

/** Load a draft from localStorage. Returns null on miss or error. */
export function loadDraft(draftId: string): DraftData | null {
  try {
    const raw = localStorage.getItem(storageKey(draftId));
    if (!raw) return null;
    return JSON.parse(raw) as DraftData;
  } catch {
    return null;
  }
}

/** Remove a draft from localStorage. */
export function deleteDraft(draftId: string): void {
  try {
    localStorage.removeItem(storageKey(draftId));
  } catch {
    // Ignore errors on cleanup
  }
}

/**
 * Create a stable JSON snapshot of formData for change-detection.
 * Strips File objects and transient keys, then sorts keys for determinism.
 */
export function createSnapshot(formData: Record<string, unknown>): string {
  const cleaned: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(formData)) {
    if (FILE_KEYS.includes(key) || TRANSIENT_KEYS.includes(key)) continue;
    if (value instanceof File) continue;
    cleaned[key] = value;
  }

  // Sort keys for deterministic comparison
  const sorted: Record<string, unknown> = {};
  for (const key of Object.keys(cleaned).sort()) {
    sorted[key] = cleaned[key];
  }

  return JSON.stringify(sorted);
}

/** Compare current formData against a previously-saved snapshot string. */
export function hasChanges(
  formData: Record<string, unknown>,
  snapshotString: string | null
): boolean {
  if (!snapshotString) return true; // No snapshot = assume changed
  return createSnapshot(formData) !== snapshotString;
}

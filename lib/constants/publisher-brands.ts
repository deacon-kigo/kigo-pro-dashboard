/**
 * Publisher Brand Configuration
 *
 * Mock publisher data simulating auth context at P0.
 * Multi-brand publishers require brand selection during offer creation.
 * The selected brand maps to `edition_exclusivity` on the backend —
 * the user never sees raw edition tags.
 */

export interface PublisherBrand {
  label: string;
  editionTag: string;
}

export interface PublisherConfig {
  id: string;
  name: string;
  brands: PublisherBrand[];
}

export const PUBLISHERS: Record<string, PublisherConfig> = {
  entertainment: {
    id: "entertainment",
    name: "Entertainment",
    brands: [
      { label: "Entertainment Premium", editionTag: "MCM_ENTERTAIN_PREMIUM" },
      { label: "Entertainment Basic", editionTag: "MCM_ENTERTAIN_BASIC" },
      {
        label: "Entertainment Co-Brand",
        editionTag: "MCM_ENTERTAIN_COBRAND",
      },
    ],
  },
  john_deere: {
    id: "john_deere",
    name: "John Deere",
    brands: [
      { label: "John Deere Rewards", editionTag: "PF_JOHN_DEERE_REWARDS" },
    ],
  },
  yardi: {
    id: "yardi",
    name: "Yardi",
    brands: [
      { label: "Yardi Resident Perks", editionTag: "PF_YARDI_RESIDENT" },
    ],
  },
};

/** Toggle this to simulate different publisher auth contexts */
export const MOCK_CURRENT_PUBLISHER_ID = "entertainment";

export function getCurrentPublisher(): PublisherConfig {
  return PUBLISHERS[MOCK_CURRENT_PUBLISHER_ID];
}

export function isMultiBrandPublisher(): boolean {
  return getCurrentPublisher().brands.length > 1;
}

export function getBrandByTag(editionTag: string): PublisherBrand | undefined {
  return getCurrentPublisher().brands.find((b) => b.editionTag === editionTag);
}

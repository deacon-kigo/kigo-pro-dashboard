// V2 Merchant types based on John Keough's prototype design spec
// kigo-pro-dashboard/docs/prototype/kigo-pro-prototype-v2.html — Merchant Manager screen

export interface V2Merchant {
  id: string;
  name: string;
  source: string;
  subcategory: string;
  emoji: string;
  emojiBg: string;
  category: string;
  activeOffers: number;
  expiredOffers: number;
  publishers: string[];
  status: "active" | "attention" | "review";
  revShare: string;
  isDuplicate?: boolean;
}

export interface V2ExpiredOffer {
  id: string;
  name: string;
  merchantName: string;
  publisher: string;
  expiredDate: string;
}

export interface V2DuplicateRecord {
  nameA: string;
  idA: string;
  offersA: string;
  nameB: string;
  idB: string;
  offersB: string;
  matchPercent: number;
}

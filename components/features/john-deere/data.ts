import type { LucideIcon } from "lucide-react";

import {
  Check,
  CircleCheck,
  CircleX,
  Clock,
  Flag,
  MessageSquare,
  Pencil,
  Receipt,
  ShieldCheck,
  Ticket,
  Upload,
} from "lucide-react";

import type { Tone } from "./tone";

export type InvoiceStatus =
  | "pending"
  | "auto_approved"
  | "man_approved"
  | "auto_rejected"
  | "man_rejected";

export type InvoiceDecision =
  | "pending"
  | "approved"
  | "rejected"
  | "auto_approved"
  | "auto_rejected";

export type DisputeStatus = "pending" | "approved" | "rejected";

export const CONFIDENCE_THRESHOLD = 85;

export type InvoiceFlag =
  | { kind: "low_confidence"; confidence: number }
  | { kind: "duplicate"; of: string; confidence: number }
  | { kind: "passed"; confidence: number };

export const FLAG_LABEL: Record<
  InvoiceFlag["kind"],
  { label: string; tone: Tone }
> = {
  duplicate: { label: "Duplicate invoice", tone: "destructive" },
  low_confidence: { label: "Low confidence", tone: "warning" },
  passed: { label: "Checks passed", tone: "success" },
};

export type DisputeField = "invoice" | "discount" | "promo" | "saleDate";

export interface DisputeChange {
  field: DisputeField;
  label: string;
  from: string;
  to: string;
  mono: boolean;
}

export type ReviewDocument =
  | { kind: "pdf"; src: string; pages: number; fileName: string }
  | { kind: "image"; src: string; pages: 1; fileName: string };

export interface Line {
  code: string;
  name: string;
  qty: string;
  amount: string;
}

export interface ExtractedFields {
  dealer: string;
  invoice: string;
  sale: string;
  discount: string;
  discountScanned?: string;
  promo: string;
  lines: Line[];
}

export interface InvoiceRow {
  status: InvoiceStatus;
  invoice: string;
  dealership: string;
  city: string;
  submitter: string;
  email: string;
  date: string;
  time: string;
  flag: InvoiceFlag;
  fraud: number;
  dealerEdited: boolean;
  document: ReviewDocument;
  extracted: ExtractedFields;
}

export interface DisputeRow {
  status: DisputeStatus;
  invoice: string;
  dealership: string;
  city: string;
  submitter: string;
  email: string;
  promotion: string;
  date: string;
  time: string;
  changes: DisputeChange[];
  explanation: string;
  document: ReviewDocument;
}

const PNG_DOCUMENT: ReviewDocument = {
  fileName: "invoice-2027.png",
  kind: "image",
  pages: 1,
  src: "/mock/john_deere_test_invoice_1.png",
};

const PDF_DOCUMENT: ReviewDocument = {
  fileName: "KCJYLD52SY.pdf",
  kind: "pdf",
  pages: 3,
  src: "/mock/john_deere_invoice_41_.pdf",
};

const pngExtracted = (
  dealerEdited: boolean,
  promo: string
): ExtractedFields => ({
  dealer: "South Plains Implement, Ltd.\n105 Avenue D\nAbernathy, TX 79311",
  discount: dealerEdited ? "$400.00" : "$432.00",
  discountScanned: "$432.00",
  invoice: "2027",
  lines: [
    {
      amount: "$2,160.00",
      code: "TY6342",
      name: "Low Viscosity Hy-Gard, 5 gal (18.9 L)",
      qty: "4",
    },
  ],
  promo,
  sale: "$2,160.00",
});

const pdfExtracted = (): ExtractedFields => ({
  dealer: "United Ag & Turf\n25 6 1/2 Station Road\nGoshen, NY 10924",
  discount: "$55.00",
  discountScanned: "$61.27",
  invoice: "KCJYLD52SY",
  lines: [
    {
      amount: "$11.53",
      code: "TY6341",
      name: "Multi-purpose severe-duty grease, 397 g (14 oz)",
      qty: "1",
    },
    {
      amount: "$30.35",
      code: "LVU34504",
      name: "Secondary air filter element",
      qty: "1",
    },
    {
      amount: "$21.75",
      code: "TY26674",
      name: "Premium engine oil, Plus-50 II, 15W-40, 946 ml (32 oz)",
      qty: "3",
    },
    {
      amount: "$110.80",
      code: "TY22000",
      name: "Low Viscosity Hy-Gard, 3.78 L (1 gal)",
      qty: "4",
    },
    {
      amount: "$4.79",
      code: "MIU804762",
      name: "Fuel filter O-ring",
      qty: "1",
    },
    {
      amount: "$18.24",
      code: "TY26575",
      name: "Cool-Gard II pre-mix coolant, 3.78 L (1 gal)",
      qty: "1",
    },
    { amount: "$78.40", code: "TA25769", name: "Filter Pak", qty: "1" },
    {
      amount: "$3.22",
      code: "14M7299",
      name: "Hexagonal flange nut, M12",
      qty: "1",
    },
    {
      amount: "$4.23",
      code: "19M7790",
      name: "Hexagonal head flanged screw, M12 x 35",
      qty: "1",
    },
  ],
  promo: "ABC123",
  sale: "$306.33",
});

const INVOICE_ROWS: Omit<InvoiceRow, "document" | "extracted">[] = [
  {
    status: "pending",
    invoice: "JD-INV-104821",
    dealership: "Prairie State Equipment",
    city: "Bloomington, IL",
    submitter: "Dana Whitfield",
    email: "dwhitfield@prairiestateeq.com",
    date: "2026-09-16",
    time: "09:42 AM",
    flag: { kind: "low_confidence", confidence: 72 },
    fraud: 18,
    dealerEdited: true,
  },
  {
    status: "pending",
    invoice: "JD-INV-104818",
    dealership: "Cedar Ridge Ag Supply",
    city: "Waverly, IA",
    submitter: "Luis Ortega",
    email: "lortega@cedarridgeag.com",
    date: "2026-09-16",
    time: "08:15 AM",
    flag: { kind: "low_confidence", confidence: 66 },
    fraud: 12,
    dealerEdited: false,
  },
  {
    status: "pending",
    invoice: "JD-INV-104805",
    dealership: "Northland Tractor",
    city: "Fargo, ND",
    submitter: "Erin Kolb",
    email: "ekolb@northlandtractor.com",
    date: "2026-09-15",
    time: "04:37 PM",
    flag: { kind: "low_confidence", confidence: 79 },
    fraud: 9,
    dealerEdited: false,
  },
  {
    status: "auto_approved",
    invoice: "JD-INV-104799",
    dealership: "Heartland Machinery",
    city: "Lincoln, NE",
    submitter: "Ray Mendel",
    email: "rmendel@heartlandmach.com",
    date: "2026-09-15",
    time: "11:08 AM",
    flag: { kind: "passed", confidence: 96 },
    fraud: 7,
    dealerEdited: false,
  },
  {
    status: "auto_rejected",
    invoice: "JD-INV-104790",
    dealership: "Valley Turf & Power",
    city: "Modesto, CA",
    submitter: "Priya Raman",
    email: "praman@valleyturf.com",
    date: "2026-09-14",
    time: "02:54 PM",
    flag: { kind: "duplicate", of: "JD-INV-104733", confidence: 94 },
    fraud: 81,
    dealerEdited: false,
  },
  {
    status: "man_approved",
    invoice: "JD-INV-104782",
    dealership: "Blue Stem Equipment",
    city: "Wichita, KS",
    submitter: "Tom Alvarez",
    email: "talvarez@bluestemeq.com",
    date: "2026-09-14",
    time: "10:21 AM",
    flag: { kind: "low_confidence", confidence: 71 },
    fraud: 15,
    dealerEdited: true,
  },
  {
    status: "pending",
    invoice: "JD-INV-104771",
    dealership: "Summit Farm Center",
    city: "Boise, ID",
    submitter: "Grace Lin",
    email: "glin@summitfarm.com",
    date: "2026-09-13",
    time: "03:19 PM",
    flag: { kind: "low_confidence", confidence: 61 },
    fraud: 22,
    dealerEdited: false,
  },
  {
    status: "auto_approved",
    invoice: "JD-INV-104764",
    dealership: "Delta Ag Solutions",
    city: "Greenville, MS",
    submitter: "Marcus Boyd",
    email: "mboyd@deltaag.com",
    date: "2026-09-12",
    time: "01:46 PM",
    flag: { kind: "passed", confidence: 93 },
    fraud: 5,
    dealerEdited: false,
  },
  {
    status: "man_rejected",
    invoice: "JD-INV-104752",
    dealership: "Ridgeline Outdoor",
    city: "Asheville, NC",
    submitter: "Sofia Duarte",
    email: "sduarte@ridgelineoutdoor.com",
    date: "2026-09-12",
    time: "09:03 AM",
    flag: { kind: "low_confidence", confidence: 68 },
    fraud: 25,
    dealerEdited: false,
  },
  {
    status: "auto_rejected",
    invoice: "JD-INV-104741",
    dealership: "Copper Creek Tractor",
    city: "Tucson, AZ",
    submitter: "Hank Meyers",
    email: "hmeyers@coppercreektractor.com",
    date: "2026-09-11",
    time: "05:28 PM",
    flag: { kind: "duplicate", of: "JD-INV-104728", confidence: 92 },
    fraud: 76,
    dealerEdited: false,
  },
  {
    status: "auto_approved",
    invoice: "JD-INV-104733",
    dealership: "Great Lakes Power",
    city: "Green Bay, WI",
    submitter: "Nadia Petrov",
    email: "npetrov@greatlakespower.com",
    date: "2026-09-10",
    time: "12:11 PM",
    flag: { kind: "passed", confidence: 97 },
    fraud: 6,
    dealerEdited: false,
  },
  {
    status: "man_approved",
    invoice: "JD-INV-104728",
    dealership: "Rio Grande Equipment",
    city: "Las Cruces, NM",
    submitter: "Elena Vargas",
    email: "evargas@riograndeeq.com",
    date: "2026-09-10",
    time: "08:57 AM",
    flag: { kind: "low_confidence", confidence: 74 },
    fraud: 11,
    dealerEdited: false,
  },
];

export const INVOICES: InvoiceRow[] = INVOICE_ROWS.map((row, index) => {
  const pdf = row.invoice === "JD-INV-104805" || index % 2 === 1;
  return {
    ...row,
    document: pdf ? PDF_DOCUMENT : PNG_DOCUMENT,
    extracted: pdf
      ? pdfExtracted()
      : pngExtracted(
          row.dealerEdited,
          row.invoice === "JD-INV-104821" ? "" : "ABC123"
        ),
  };
});

export const INVOICE_STATUS: Record<
  InvoiceStatus,
  { label: string; color: "warning" | "success" | "destructive" }
> = {
  pending: { label: "Pending review", color: "warning" },
  auto_approved: { label: "Auto-approved", color: "success" },
  man_approved: { label: "Manually approved", color: "success" },
  auto_rejected: { label: "Auto-rejected", color: "destructive" },
  man_rejected: { label: "Manually rejected", color: "destructive" },
};

export const INVOICE_FILTERS: { key: "all" | InvoiceStatus; label: string }[] =
  [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending review" },
    { key: "auto_approved", label: "Auto-approved" },
    { key: "auto_rejected", label: "Auto-rejected" },
    { key: "man_approved", label: "Manually approved" },
    { key: "man_rejected", label: "Manually rejected" },
  ];

const DISPUTE_ROWS: Omit<DisputeRow, "document">[] = [
  {
    status: "pending",
    invoice: "JD-INV-104612",
    dealership: "Prairie State Equipment",
    city: "Bloomington, IL",
    submitter: "Alvin Prescott",
    email: "aprescott@prairiestateeq.com",
    promotion: "20% off fluids & filters",
    date: "2026-09-16",
    time: "10:24 AM",
    changes: [
      {
        field: "invoice",
        label: "Invoice number",
        from: "JD-INV-104612",
        to: "JD-INV-104621",
        mono: true,
      },
      {
        field: "discount",
        label: "Discount amount",
        from: "$1,240.00",
        to: "$1,780.00",
        mono: true,
      },
    ],
    explanation:
      "I typed the wrong invoice number when I redeemed the code — it should be JD-INV-104621. The discount on that invoice is $1,780.00, not $1,240.00. Photo of the invoice attached.",
  },
  {
    status: "pending",
    invoice: "JD-INV-104588",
    dealership: "Blue Stem Equipment",
    city: "Wichita, KS",
    submitter: "Marguerite Doss",
    email: "mdoss@bluestemeq.com",
    promotion: "$500 off select compact tractors",
    date: "2026-09-15",
    time: "03:41 PM",
    changes: [
      {
        field: "invoice",
        label: "Invoice number",
        from: "JD-INV-104588",
        to: "JD-INV-104593",
        mono: true,
      },
      {
        field: "saleDate",
        label: "Sale date",
        from: "Sep 2, 2026",
        to: "Sep 4, 2026",
        mono: false,
      },
    ],
    explanation:
      "I keyed the wrong invoice at redemption — the tractor was written up two days later on JD-INV-104593.",
  },
  {
    status: "pending",
    invoice: "JD-INV-104501",
    dealership: "Great Lakes Power",
    city: "Green Bay, WI",
    submitter: "Karl Beaumont",
    email: "kbeaumont@greatlakespower.com",
    promotion: "15% off mower blades",
    date: "2026-09-14",
    time: "11:52 AM",
    changes: [
      {
        field: "promo",
        label: "Promo code",
        from: "BLADE15",
        to: "BLADES15",
        mono: true,
      },
      {
        field: "discount",
        label: "Discount amount",
        from: "$84.00",
        to: "$126.00",
        mono: true,
      },
    ],
    explanation:
      "The customer handed us BLADES15, and 15% of the blade lines comes to $126.00 rather than the $84.00 that went in.",
  },
  {
    status: "approved",
    invoice: "JD-INV-104477",
    dealership: "Heartland Machinery",
    city: "Lincoln, NE",
    submitter: "Tessa Nguyen",
    email: "tnguyen@heartlandmach.com",
    promotion: "10% off parts & service",
    date: "2026-09-13",
    time: "09:07 AM",
    changes: [
      {
        field: "saleDate",
        label: "Sale date",
        from: "Aug 29, 2026",
        to: "Sep 1, 2026",
        mono: false,
      },
    ],
    explanation:
      "I redeemed against the work-order date by mistake; the parts were actually billed on Sep 1.",
  },
  {
    status: "rejected",
    invoice: "JD-INV-104420",
    dealership: "Copper Creek Tractor",
    city: "Tucson, AZ",
    submitter: "Owen Baird",
    email: "obaird@coppercreektractor.com",
    promotion: "Free 100-hour service inspection",
    date: "2026-09-12",
    time: "02:18 PM",
    changes: [
      {
        field: "invoice",
        label: "Invoice number",
        from: "JD-INV-104420",
        to: "JD-INV-104466",
        mono: true,
      },
    ],
    explanation:
      "This redemption is sitting on the wrong invoice — the inspection was done under JD-INV-104466.",
  },
  {
    status: "approved",
    invoice: "JD-INV-104398",
    dealership: "Delta Ag Solutions",
    city: "Greenville, MS",
    submitter: "Ines Castellano",
    email: "icastellano@deltaag.com",
    promotion: "20% off fluids & filters",
    date: "2026-09-11",
    time: "04:33 PM",
    changes: [
      {
        field: "discount",
        label: "Discount amount",
        from: "$212.00",
        to: "$318.40",
        mono: true,
      },
    ],
    explanation:
      "Two filter lines were left out of the discount total, which should read $318.40.",
  },
  {
    status: "rejected",
    invoice: "JD-INV-104355",
    dealership: "Ridgeline Outdoor",
    city: "Asheville, NC",
    submitter: "Roy Fielder",
    email: "rfielder@ridgelineoutdoor.com",
    promotion: "$250 off gator accessories",
    date: "2026-09-10",
    time: "08:46 AM",
    changes: [
      {
        field: "promo",
        label: "Promo code",
        from: "GATOR250",
        to: "GATOR500",
        mono: true,
      },
      {
        field: "discount",
        label: "Discount amount",
        from: "$250.00",
        to: "$500.00",
        mono: true,
      },
    ],
    explanation:
      "The customer took two gator packages, so this should have gone in under GATOR500 for a $500.00 discount.",
  },
];

export const DISPUTES: DisputeRow[] = DISPUTE_ROWS.map((row) => ({
  ...row,
  document: PNG_DOCUMENT,
}));

export const DISPUTE_STATUS: Record<
  DisputeStatus,
  { label: string; color: "warning" | "success" | "destructive" }
> = {
  pending: { label: "Pending review", color: "warning" },
  approved: { label: "Approved", color: "success" },
  rejected: { label: "Rejected", color: "destructive" },
};

export const DISPUTE_FILTERS: { key: "all" | DisputeStatus; label: string }[] =
  [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending review" },
    { key: "approved", label: "Approved" },
    { key: "rejected", label: "Rejected" },
  ];

export const invoiceDecision = (status: InvoiceStatus): InvoiceDecision => {
  if (status === "man_approved") return "approved";
  if (status === "man_rejected") return "rejected";
  return status;
};

export const pendingInvoices = INVOICES.filter(
  (row) => row.status === "pending"
).length;
export const openDisputes = DISPUTES.filter(
  (row) => row.status === "pending"
).length;

export interface InvoiceField {
  key: string;
  label: string;
  value: string;
  hint: string;
  mono?: boolean;
  tall?: boolean;
  dealerEdited?: boolean;
  scanned?: string;
}

export const invoiceFields = (extracted: ExtractedFields): InvoiceField[] => [
  {
    key: "dealer",
    label: "Dealer address + phone",
    value: extracted.dealer,
    tall: true,
    hint: "Used to look up the dealer group number.",
  },
  {
    key: "invoice",
    label: "Invoice number",
    value: extracted.invoice,
    mono: true,
    hint: "Must match the number printed on the invoice.",
  },
  {
    key: "sale",
    label: "Sale amount",
    value: extracted.sale,
    mono: true,
    hint: "Invoice total before the promotion discount.",
  },
  {
    key: "discount",
    label: "Discount amount",
    value: extracted.discount,
    mono: true,
    dealerEdited:
      Boolean(extracted.discountScanned) &&
      extracted.discountScanned !== extracted.discount,
    scanned: extracted.discountScanned,
    hint: "Confirm the total discount amount to reimburse.",
  },
  {
    key: "promo",
    label: "Customer promo code",
    value: extracted.promo,
    mono: true,
    hint: "Enter the code the customer presented. Ties the claim to a promotion.",
  },
];

export const INVOICE_REASONS = [
  "Invoice illegible or incomplete",
  "Items do not qualify for this promotion",
  "Invoice date outside the promotion window",
  "Duplicate of a previously submitted invoice",
  "Dealership does not match the account on file",
  "Other",
];

export const DISPUTE_REASONS = [
  {
    label: "Invoice unclear",
    desc: "The attached invoice is blurry, cut off, or incomplete",
  },
  { label: "Invalid attachment", desc: "The attached file is not an invoice" },
  {
    label: "Invoice does not match",
    desc: "The attached invoice does not support the requested change",
  },
  {
    label: "Amount not eligible",
    desc: "The requested discount amount is not eligible for the promotion",
  },
  {
    label: "Invoice already used",
    desc: "The invoice is associated with a different redemption",
  },
  {
    label: "Duplicate request",
    desc: "This dispute was already submitted or resolved",
  },
  { label: "Other", desc: "" },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const formatSubmitted = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;
  return `${MONTHS[month - 1]} ${day}, ${year}`;
};

export const waitingLabel = (
  date: string,
  time: string,
  now = new Date()
): string => {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return time;
  const submitted = Date.UTC(year, month - 1, day);
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((today - submitted) / 86_400_000);
  return days <= 0 ? "today" : `${days}d in queue`;
};

export const plural = (count: number, noun: string) =>
  `${count} ${noun}${count === 1 ? "" : "s"}`;

export const money = (lines: Line[]) => {
  const sum = lines.reduce(
    (total, line) =>
      total + (parseFloat(line.amount.replace(/[^0-9.]/g, "")) || 0),
    0
  );
  return `$${sum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export type EventKind =
  | "submitted"
  | "validated"
  | "flagged"
  | "queued"
  | "confirmed"
  | "edited"
  | "approved"
  | "rejected"
  | "redeemed"
  | "disputed";

export interface ReviewEvent {
  id: string;
  kind: EventKind;
  title: string;
  detail?: string;
  actor: string;
  date: string;
  time: string;
}

export const EVENT_KIND: Record<EventKind, { tone: Tone; icon: LucideIcon }> = {
  approved: { icon: CircleCheck, tone: "success" },
  confirmed: { icon: Check, tone: "neutral" },
  disputed: { icon: MessageSquare, tone: "info" },
  edited: { icon: Pencil, tone: "neutral" },
  flagged: { icon: Flag, tone: "warning" },
  queued: { icon: Clock, tone: "info" },
  redeemed: { icon: Ticket, tone: "neutral" },
  rejected: { icon: CircleX, tone: "destructive" },
  submitted: { icon: Upload, tone: "neutral" },
  validated: { icon: ShieldCheck, tone: "success" },
};

export interface Fact {
  label: string;
  value: string;
  mono?: boolean;
  tone?: Tone;
  emphasis?: boolean;
  /* Warning line under the value, e.g. a scan-vs-dealer discrepancy. */
  note?: string;
  /* Shown on hover, e.g. the submitter's email. */
  hint?: string;
}

export interface FactGroup {
  icon: LucideIcon;
  title: string;
  facts: Fact[];
}

const FLAG_FACT: Record<InvoiceFlag["kind"], { label: string; value: string }> =
  {
    duplicate: { label: "Failed check", value: "Duplicate invoice number" },
    low_confidence: {
      label: "Flagged for manual review",
      value: "Low confidence score",
    },
    passed: { label: "Scan result", value: "All checks passed" },
  };

const fraudBand = (score: number): { word: string; tone?: Tone } => {
  if (score >= 70) return { tone: "destructive", word: "high" };
  if (score >= 40) return { tone: "warning", word: "medium" };
  return { word: "low" };
};

export const scanFacts = (
  row: InvoiceRow
): { flag: Fact; confidence: Fact; fraud: Fact; duplicate?: Fact } => {
  const band = fraudBand(row.fraud);
  const below = row.flag.confidence < CONFIDENCE_THRESHOLD;
  return {
    confidence: {
      label: "Confidence",
      mono: true,
      tone: below
        ? "warning"
        : row.flag.kind === "passed"
          ? "success"
          : undefined,
      value: `${row.flag.confidence}% of ${CONFIDENCE_THRESHOLD}% required`,
    },
    flag: {
      label: FLAG_FACT[row.flag.kind].label,
      tone: FLAG_LABEL[row.flag.kind].tone,
      value: FLAG_FACT[row.flag.kind].value,
    },
    fraud: {
      label: "Fraud score",
      mono: true,
      tone: band.tone,
      value: `${row.fraud} ${band.word}`,
    },
    ...(row.flag.kind === "duplicate"
      ? {
          duplicate: {
            label: "Duplicate of",
            mono: true,
            tone: "destructive" as const,
            value: row.flag.of,
          },
        }
      : {}),
  };
};

const RESULT_VALUE: Record<InvoiceFlag["kind"], string> = {
  duplicate: "Failed · duplicate invoice",
  low_confidence: "Flagged · low confidence",
  passed: "All checks passed",
};

/* Every check carries its own outcome colour so a reviewer sees pass and fail
   side by side. Once decided the status pill owns the outcome and the checks
   fall back to plain reference data; a duplicate still reads as a failure. */
export const reviewFacts = (row: InvoiceRow, decided: boolean): FactGroup[] => {
  const band = fraudBand(row.fraud);
  const below = row.flag.confidence < CONFIDENCE_THRESHOLD;
  const validation: Fact[] = [
    {
      label: "Result",
      tone: FLAG_LABEL[row.flag.kind].tone,
      value: RESULT_VALUE[row.flag.kind],
    },
    {
      label: "Confidence",
      mono: true,
      tone: below ? "warning" : "success",
      value: `${row.flag.confidence}% · ${CONFIDENCE_THRESHOLD}% required`,
    },
    ...(row.flag.kind === "duplicate"
      ? [
          {
            label: "Duplicate of",
            mono: true,
            tone: "destructive" as const,
            value: row.flag.of,
          },
        ]
      : []),
    {
      label: "Fraud score",
      mono: true,
      tone: band.tone ?? "success",
      value: `${row.fraud} · ${band.word}`,
    },
  ];
  const claim: Fact[] = [
    { label: "Dealership", value: `${row.dealership} · ${row.city}` },
    { label: "Submitted", value: `${formatSubmitted(row.date)} · ${row.time}` },
    { hint: row.email, label: "Submitter", value: row.submitter },
    { label: "Promotion", value: "20% off fluids & filters" },
  ];
  const settle = (fact: Fact): Fact =>
    decided && fact.label !== "Duplicate of"
      ? { ...fact, tone: undefined }
      : fact;
  return [
    { facts: validation.map(settle), icon: ShieldCheck, title: "Validation" },
    { facts: claim, icon: Receipt, title: "Claim" },
  ];
};

export const activitySummary = (
  row: InvoiceRow | DisputeRow
): { text: string; tone: Tone } => {
  const waiting = waitingLabel(row.date, row.time);
  if (!("flag" in row)) {
    return {
      text: `Dispute submitted · ${plural(row.changes.length, "requested change")} · ${waiting}`,
      tone: "info",
    };
  }
  if (row.flag.kind === "duplicate") {
    return {
      text: `Duplicate of ${row.flag.of} · ${waiting}`,
      tone: FLAG_LABEL.duplicate.tone,
    };
  }
  if (row.flag.kind === "passed") {
    return {
      text: `Checks passed · ${row.flag.confidence}%`,
      tone: FLAG_LABEL.passed.tone,
    };
  }
  return {
    text: `Flagged · ${row.flag.confidence}% under ${CONFIDENCE_THRESHOLD}% · ${waiting}`,
    tone: FLAG_LABEL.low_confidence.tone,
  };
};

const SYSTEM = "Automated validation";
const REVIEWER = "Maya Ruiz";
const SYSTEM_ACTORS = new Set([SYSTEM, "Support queue"]);

export const actorKind = (actor: string): "person" | "system" =>
  SYSTEM_ACTORS.has(actor) ? "system" : "person";

const submittedEvent = (
  row: { submitter: string; date: string; time: string },
  title: string
): ReviewEvent => ({
  actor: row.submitter,
  date: formatSubmitted(row.date),
  time: row.time,
  id: "submitted",
  kind: "submitted",
  title,
});

export const invoiceActivity = (
  outcome: InvoiceDecision,
  record: InvoiceRow
): ReviewEvent[] => {
  const submitted = submittedEvent(record, "Invoice submitted");
  const flagged: ReviewEvent = {
    actor: SYSTEM,
    date: "Sep 16, 2026",
    time: "09:43 AM",
    detail: `Confidence ${record.flag.confidence}% falls below the ${CONFIDENCE_THRESHOLD}% threshold`,
    id: "flagged",
    kind: "flagged",
    title: "Flagged for manual review",
  };
  const duplicateOf = record.flag.kind === "duplicate" ? record.flag.of : "";
  const original = INVOICES.find((row) => row.invoice === duplicateOf);

  if (outcome === "approved") {
    return [
      {
        actor: REVIEWER,
        date: "Sep 16, 2026",
        time: "10:18 AM",
        detail: "Sent for reimbursement",
        id: "approved",
        kind: "approved",
        title: "Invoice approved",
      },
      {
        actor: REVIEWER,
        date: "Sep 16, 2026",
        time: "10:15 AM",
        detail:
          "Dealer edit of $1,240.00 accepted over the scan read of $1,318.40",
        id: "confirmed",
        kind: "confirmed",
        title: "Discount amount confirmed",
      },
      {
        actor: REVIEWER,
        date: "Sep 16, 2026",
        time: "10:12 AM",
        detail: "Promo code ABC123 entered by hand",
        id: "edited",
        kind: "edited",
        title: "Customer promo code added",
      },
      flagged,
      submitted,
    ];
  }
  if (outcome === "rejected") {
    return [
      {
        actor: REVIEWER,
        date: "Sep 16, 2026",
        time: "10:26 AM",
        detail: "Items do not qualify for this promotion",
        id: "rejected",
        kind: "rejected",
        title: "Invoice rejected",
      },
      {
        actor: REVIEWER,
        date: "Sep 16, 2026",
        time: "10:22 AM",
        detail: "Two of four items are attachments, not fluids or filters",
        id: "confirmed",
        kind: "confirmed",
        title: "Line items reviewed",
      },
      flagged,
      submitted,
    ];
  }
  if (outcome === "auto_approved") {
    return [
      {
        actor: SYSTEM,
        date: "Sep 16, 2026",
        time: "09:43 AM",
        detail: "Sent for reimbursement without manual review",
        id: "approved",
        kind: "approved",
        title: "Invoice auto-approved",
      },
      {
        actor: SYSTEM,
        date: "Sep 16, 2026",
        time: "09:43 AM",
        detail: `Confidence ${record.flag.confidence}% · fraud score ${record.fraud}`,
        id: "validated",
        kind: "validated",
        title: "Automated validation passed",
      },
      submitted,
    ];
  }
  if (outcome === "auto_rejected") {
    return [
      {
        actor: SYSTEM,
        date: "Sep 16, 2026",
        time: "09:43 AM",
        detail: "Duplicate of a previously submitted invoice",
        id: "rejected",
        kind: "rejected",
        title: "Invoice auto-rejected",
      },
      {
        actor: SYSTEM,
        date: "Sep 16, 2026",
        time: "09:43 AM",
        detail: original
          ? `Matches ${duplicateOf}, submitted ${formatSubmitted(original.date)}`
          : `Matches ${duplicateOf}`,
        id: "flagged",
        kind: "flagged",
        title: "Duplicate check failed",
      },
      submitted,
    ];
  }
  return [
    {
      actor: "Support queue",
      date: "Sep 16, 2026",
      time: "09:43 AM",
      id: "queued",
      kind: "queued",
      title: "Awaiting support review",
    },
    flagged,
    {
      actor: SYSTEM,
      date: "Sep 16, 2026",
      time: "09:43 AM",
      detail: "Extraction engine v2.4",
      id: "validated",
      kind: "validated",
      title: "Automated validation completed",
    },
    submitted,
  ];
};

export const disputeActivity = (
  outcome: DisputeStatus,
  record: DisputeRow
): ReviewEvent[] => {
  const redeemed: ReviewEvent = {
    actor: record.submitter,
    date: "Sep 12, 2026",
    time: "02:41 PM",
    detail: "Promo code ABC123 applied in PDAP",
    id: "redeemed",
    kind: "redeemed",
    title: "Code redeemed in PDAP",
  };
  const disputed = {
    ...submittedEvent(record, "Dispute submitted"),
    id: "disputed",
    kind: "disputed" as const,
  };

  if (outcome === "approved") {
    return [
      {
        actor: REVIEWER,
        date: "Sep 16, 2026",
        time: "11:02 AM",
        detail: "PDAP entry updated with the requested values",
        id: "approved",
        kind: "approved",
        title: "Dispute approved",
      },
      disputed,
      redeemed,
    ];
  }
  if (outcome === "rejected") {
    return [
      {
        actor: REVIEWER,
        date: "Sep 16, 2026",
        time: "11:02 AM",
        detail: "PDAP entry left unchanged",
        id: "rejected",
        kind: "rejected",
        title: "Dispute rejected",
      },
      disputed,
      redeemed,
    ];
  }
  return [
    {
      actor: "Support queue",
      date: "Sep 16, 2026",
      time: "10:24 AM",
      detail: "Waiting on a reviewer to compare the photo with the entry",
      id: "queued",
      kind: "queued",
      title: "Awaiting support review",
    },
    disputed,
    redeemed,
  ];
};

"use client";

import React, { useId, useMemo, useCallback, useRef } from "react";
import type { StylesConfig, GroupBase, GroupProps } from "react-select";
import { components } from "react-select";
import * as AsyncCreatableModule from "react-select/async-creatable";
import {
  ChevronDown,
  Search,
  X,
  Check,
  Store,
  Globe,
  Archive,
  Percent,
  DollarSign,
  Gift,
  Wallet,
  Tag,
  MousePointerClick,
  Star,
  ShoppingBag,
  BadgePercent,
  Loader2,
  CornerDownLeft,
  FileEdit,
  XCircle,
  PauseCircle,
  ShieldCheck,
  Layers,
  BarChart3,
  CalendarDays,
  CreditCard,
  QrCode,
  Zap,
  Package,
  MessageSquare,
} from "lucide-react";
import {
  MOCK_MERCHANTS,
  OFFER_TYPE_LABELS,
  REDEMPTION_TYPE_LABELS,
} from "./offerListMockData";
import { OfferType, RedemptionType } from "@/types/offers";

const AsyncCreatable =
  (AsyncCreatableModule as any).default || AsyncCreatableModule;

// ---------- Types ----------

export interface FilterTag {
  label: string;
  value: string; // "merchant:m1" | "type:bogo" | "status:published" | "search:free text" | "category:discount" | etc.
  category:
    | "merchant"
    | "type"
    | "status"
    | "search"
    | "category"
    | "performance"
    | "dateRange"
    | "redemptionType";
}

interface OfferListSearchBarProps {
  selectedFilters: FilterTag[];
  onFiltersChange: (filters: FilterTag[]) => void;
}

// ---------- Category colors (Kigo-aligned) ----------

const CATEGORY_COLORS: Record<
  FilterTag["category"],
  { bg: string; text: string; dot: string }
> = {
  merchant: { bg: "#E1F0FF", text: "#328FE5", dot: "#328FE5" },
  type: { bg: "#E5D7FA", text: "#8941EB", dot: "#8941EB" },
  status: { bg: "#D1F7DF", text: "#059669", dot: "#77D898" },
  search: { bg: "#F6F5F1", text: "#5A5858", dot: "#5A5858" },
  category: { bg: "#E0F2F1", text: "#0D9488", dot: "#0D9488" },
  performance: { bg: "#FFF3E0", text: "#E65100", dot: "#E65100" },
  dateRange: { bg: "#E8EAF6", text: "#3949AB", dot: "#3949AB" },
  redemptionType: { bg: "#FCE4EC", text: "#C2185B", dot: "#C2185B" },
};

const GROUP_CATEGORY_MAP: Record<string, FilterTag["category"]> = {
  Merchants: "merchant",
  "Offer Types": "type",
  Statuses: "status",
  Categories: "category",
  Performance: "performance",
  "Date Range": "dateRange",
  "Redemption Types": "redemptionType",
};

// ---------- Option icons ----------

const OPTION_ICONS: Record<
  string,
  React.ComponentType<{ style?: React.CSSProperties }>
> = {
  // Status icons
  "status:published": Globe,
  "status:draft": FileEdit,
  "status:expired": XCircle,
  "status:paused": PauseCircle,
  "status:pending_approval": ShieldCheck,
  // Type icons
  "type:bogo": Gift,
  "type:percentage_savings": Percent,
  "type:dollars_off": DollarSign,
  "type:cashback": Wallet,
  "type:free_with_purchase": BadgePercent,
  "type:price_point": Tag,
  "type:clickthrough": MousePointerClick,
  "type:loyalty_points": Star,
  "type:spend_and_get": ShoppingBag,
  // Category icons
  "category:discount": Percent,
  "category:bundle": Gift,
  "category:loyalty": Star,
  "category:promotional": Tag,
  // Performance icons
  "performance:high": BarChart3,
  "performance:medium": BarChart3,
  "performance:low": BarChart3,
  // Date range icons
  "dateRange:this_week": CalendarDays,
  "dateRange:this_month": CalendarDays,
  "dateRange:30_days": CalendarDays,
  "dateRange:no_expiration": CalendarDays,
  // Redemption type icons
  "redemptionType:online_code": QrCode,
  "redemptionType:airdrop": Zap,
  "redemptionType:gift_card": Gift,
  "redemptionType:card_linked": CreditCard,
  "redemptionType:stripe_checkout": ShoppingBag,
  "redemptionType:augeo_fulfillment": Package,
  "redemptionType:sms_notification": MessageSquare,
};

function getOptionIcon(
  value: string
): React.ComponentType<{ style?: React.CSSProperties }> | null {
  return OPTION_ICONS[value] || null;
}

const GROUP_ICONS: Record<
  string,
  React.ComponentType<{ style?: React.CSSProperties }>
> = {
  Merchants: Store,
  "Offer Types": Tag,
  Statuses: Globe,
  Categories: Layers,
  Performance: BarChart3,
  "Date Range": CalendarDays,
  "Redemption Types": CreditCard,
};

// ---------- Static option sets ----------

const typeOptions: FilterTag[] = (
  Object.entries(OFFER_TYPE_LABELS) as [OfferType, string][]
)
  .map(([key, label]) => ({
    label,
    value: `type:${key}`,
    category: "type" as const,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const statusOptions: FilterTag[] = [
  { label: "Published", value: "status:published", category: "status" },
  { label: "Draft", value: "status:draft", category: "status" },
  { label: "Expired", value: "status:expired", category: "status" },
  { label: "Paused", value: "status:paused", category: "status" },
  {
    label: "Pending Approval",
    value: "status:pending_approval",
    category: "status",
  },
];

const categoryOptions: FilterTag[] = [
  { label: "Discounts", value: "category:discount", category: "category" },
  { label: "Bundles & Combos", value: "category:bundle", category: "category" },
  { label: "Loyalty Rewards", value: "category:loyalty", category: "category" },
  { label: "Promotional", value: "category:promotional", category: "category" },
];

const performanceOptions: FilterTag[] = [
  { label: "High (100+)", value: "performance:high", category: "performance" },
  {
    label: "Medium (10-99)",
    value: "performance:medium",
    category: "performance",
  },
  { label: "Low (0-9)", value: "performance:low", category: "performance" },
];

const dateRangeOptions: FilterTag[] = [
  { label: "This Week", value: "dateRange:this_week", category: "dateRange" },
  { label: "This Month", value: "dateRange:this_month", category: "dateRange" },
  { label: "Next 30 Days", value: "dateRange:30_days", category: "dateRange" },
  {
    label: "No Expiration",
    value: "dateRange:no_expiration",
    category: "dateRange",
  },
];

const redemptionTypeOptions: FilterTag[] = (
  Object.entries(REDEMPTION_TYPE_LABELS) as [RedemptionType, string][]
)
  .map(([key, label]) => ({
    label,
    value: `redemptionType:${key}`,
    category: "redemptionType" as const,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

// ---------- Merchant search ----------

const MAX_MERCHANT_RESULTS = 8;

async function searchMerchants(query: string): Promise<FilterTag[]> {
  const lower = query.toLowerCase();
  return MOCK_MERCHANTS.filter((m) => m.name.toLowerCase().includes(lower))
    .sort((a, b) => a.name.localeCompare(b.name))
    .slice(0, MAX_MERCHANT_RESULTS)
    .map((m) => ({
      label: m.name,
      value: `merchant:${m.id}`,
      category: "merchant" as const,
    }));
}

function sortSelectedFirst(
  options: FilterTag[],
  selected: Set<string>
): FilterTag[] {
  const sel: FilterTag[] = [];
  const unsel: FilterTag[] = [];
  for (const o of options) {
    if (selected.has(o.value)) sel.push(o);
    else unsel.push(o);
  }
  return [...sel, ...unsel];
}

// ---------- Custom components (Spotlight-inspired) ----------

const DropdownIndicator = (props: any) => (
  <components.DropdownIndicator {...props}>
    <ChevronDown className="h-4 w-4 opacity-50" />
  </components.DropdownIndicator>
);

const ClearIndicator = (props: any) => (
  <components.ClearIndicator {...props}>
    <X className="h-3.5 w-3.5 opacity-50 hover:opacity-100" />
  </components.ClearIndicator>
);

const MultiValueContainer = (props: any) => {
  const category = props.data?.category as FilterTag["category"] | undefined;
  const colors = category ? CATEGORY_COLORS[category] : CATEGORY_COLORS.search;
  return (
    <div
      style={{
        backgroundColor: colors.bg,
        borderRadius: "5px",
        display: "flex",
        alignItems: "center",
        margin: "2px",
        height: "24px",
      }}
    >
      {props.children}
    </div>
  );
};

const MultiValueLabel = (props: any) => {
  const category = props.data?.category as FilterTag["category"] | undefined;
  const colors = category ? CATEGORY_COLORS[category] : CATEGORY_COLORS.search;
  return (
    <div
      style={{
        color: colors.text,
        padding: "0 5px 0 7px",
        fontSize: "0.75rem",
        fontWeight: 500,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "160px",
        lineHeight: "22px",
      }}
    >
      {props.data?.label ?? ""}
    </div>
  );
};

const MultiValueRemove = (props: any) => {
  const category = props.data?.category as FilterTag["category"] | undefined;
  const colors = category ? CATEGORY_COLORS[category] : CATEGORY_COLORS.search;
  return (
    <components.MultiValueRemove {...props}>
      <X style={{ color: colors.text, width: 11, height: 11, opacity: 0.45 }} />
    </components.MultiValueRemove>
  );
};

// Spotlight-style group header — minimal, typographic
const CustomGroup = (
  props: GroupProps<FilterTag, true, GroupBase<FilterTag>>
) => {
  const groupLabel = (props.data as GroupBase<FilterTag>).label ?? "";
  const category = GROUP_CATEGORY_MAP[groupLabel] || "search";
  const colors = CATEGORY_COLORS[category];
  const HeaderIcon = GROUP_ICONS[groupLabel];

  return (
    <div style={{ paddingTop: "4px" }}>
      <div
        style={{
          padding: "6px 16px 5px",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        {HeaderIcon && (
          <HeaderIcon
            style={{
              width: 11,
              height: 11,
              color: colors.dot,
              opacity: 0.7,
              flexShrink: 0,
            }}
          />
        )}
        <span
          style={{
            fontSize: "0.6875rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            color: colors.text,
            opacity: 0.7,
          }}
        >
          {groupLabel}
        </span>
      </div>
      <div style={{ padding: "2px 0" }}>{props.children}</div>
    </div>
  );
};

// ---------- Keyword highlight helper ----------

function highlightMatch(
  text: string,
  query: string,
  baseColor: string
): React.ReactNode {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span
        style={{
          fontWeight: 600,
          color: baseColor,
          backgroundColor: "rgba(255, 213, 79, 0.25)",
          borderRadius: "2px",
          padding: "0 1px",
        }}
      >
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

// Spotlight-style option row — icon-forward, keyword highlight
const CustomOption = (props: any) => {
  const { data, isSelected, isFocused, innerRef, innerProps } = props;
  const category = data?.category as FilterTag["category"] | undefined;
  const colors = category ? CATEGORY_COLORS[category] : CATEGORY_COLORS.search;
  const isCreateOption = data?.__isNew__;
  const OptionIcon = data?.value ? getOptionIcon(data.value) : null;
  const inputValue = (props.selectProps?.inputValue as string) || "";

  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "6px 12px",
        margin: "1px 8px",
        cursor: "pointer",
        backgroundColor: isFocused ? "rgba(0, 0, 0, 0.04)" : "transparent",
        borderRadius: "8px",
        transition: "background-color 0.1s ease",
      }}
    >
      {isCreateOption ? (
        <>
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "7px",
              backgroundColor: isFocused
                ? "rgba(99, 102, 241, 0.08)"
                : "rgba(0,0,0,0.04)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Search
              style={{
                width: 14,
                height: 14,
                color: isFocused ? "#6366f1" : "#888",
              }}
            />
          </span>
          <span
            style={{
              fontSize: "0.8125rem",
              color: isFocused ? "#4338ca" : "#555",
              fontWeight: 500,
              flex: 1,
            }}
          >
            Search for &ldquo;
            <span style={{ fontWeight: 600 }}>{inputValue}</span>
            &rdquo;
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "3px",
              fontSize: "0.6875rem",
              color: "#aaa",
              flexShrink: 0,
            }}
          >
            <CornerDownLeft style={{ width: 11, height: 11 }} />
            enter
          </span>
        </>
      ) : (
        <>
          {/* Icon container */}
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: "7px",
              backgroundColor: isSelected ? colors.bg : "rgba(0,0,0,0.03)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background-color 0.15s ease",
            }}
          >
            {OptionIcon ? (
              <OptionIcon
                style={{
                  width: 14,
                  height: 14,
                  color: isSelected ? colors.text : "#999",
                }}
              />
            ) : (
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: isSelected ? colors.dot : "#ccc",
                }}
              />
            )}
          </span>

          {/* Label with keyword highlight */}
          <span
            style={{
              fontSize: "0.8125rem",
              color: isSelected ? colors.text : "#333",
              fontWeight: isSelected ? 500 : 400,
              flex: 1,
            }}
          >
            {highlightMatch(
              data?.label ?? "",
              inputValue,
              isSelected ? colors.text : "#333"
            )}
          </span>

          {/* Checkmark on right */}
          {isSelected && (
            <Check
              style={{
                width: 14,
                height: 14,
                color: colors.dot,
                flexShrink: 0,
                strokeWidth: 2.5,
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

const LoadingMessage = (props: any) => (
  <div
    style={{
      padding: "8px 16px",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    }}
  >
    <Loader2
      className="h-3.5 w-3.5 animate-spin"
      style={{ color: "#328FE5" }}
    />
    <span style={{ fontSize: "0.8125rem", color: "#717585" }}>
      Searching merchants...
    </span>
  </div>
);

const LoadingIndicator = () => (
  <div style={{ padding: "0 8px", display: "flex", alignItems: "center" }}>
    <Loader2
      className="h-3.5 w-3.5 animate-spin"
      style={{ color: "#328FE5" }}
    />
  </div>
);

// ---------- Badge group labels ----------

const CATEGORY_LABELS: Record<FilterTag["category"], string> = {
  status: "Status",
  type: "Type",
  merchant: "Merchant",
  search: "Search",
  category: "Category",
  performance: "Performance",
  dateRange: "Date Range",
  redemptionType: "Redemption",
};

const CATEGORY_ORDER: FilterTag["category"][] = [
  "status",
  "type",
  "category",
  "performance",
  "dateRange",
  "redemptionType",
  "merchant",
  "search",
];

const CustomValueContainer = (props: any) => {
  const { children, hasValue, ...rest } = props;
  const childArray = React.Children.toArray(children);

  // When no values selected, pass through unchanged (Placeholder + Input)
  if (!hasValue) {
    return (
      <components.ValueContainer hasValue={hasValue} {...rest}>
        {children}
      </components.ValueContainer>
    );
  }

  // Separate MultiValue elements (have data.category) from other children (Input, Placeholder)
  const multiValues: React.ReactNode[] = [];
  const others: React.ReactNode[] = [];
  for (const child of childArray) {
    const data = (child as any)?.props?.data as FilterTag | undefined;
    if (data?.category) {
      multiValues.push(child);
    } else {
      others.push(child);
    }
  }

  // Group multi-value elements by category
  const grouped: Record<string, React.ReactNode[]> = {};
  for (const child of multiValues) {
    const data = (child as any)?.props?.data as FilterTag;
    const cat = data.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(child);
  }

  // Render in defined order with inline labels and group spacing
  const rendered: React.ReactNode[] = [];
  let groupIndex = 0;
  for (const cat of CATEGORY_ORDER) {
    const items = grouped[cat];
    if (!items || items.length === 0) continue;
    const colors = CATEGORY_COLORS[cat];
    const isFirst = groupIndex === 0;
    // Add a subtle separator between groups
    if (!isFirst) {
      rendered.push(
        <span
          key={`sep-${cat}`}
          style={{
            width: "1px",
            height: "16px",
            backgroundColor: "#E4E5E7",
            marginLeft: "6px",
            marginRight: "6px",
            flexShrink: 0,
          }}
        />
      );
    }
    rendered.push(
      <span
        key={`label-${cat}`}
        style={{
          fontSize: "10px",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          color: colors.text,
          opacity: 0.7,
          whiteSpace: "nowrap",
          marginRight: "2px",
          lineHeight: "24px",
        }}
      >
        {CATEGORY_LABELS[cat]}
      </span>
    );
    rendered.push(...items);
    groupIndex++;
  }

  return (
    <components.ValueContainer hasValue={hasValue} {...rest}>
      {rendered}
      {others}
    </components.ValueContainer>
  );
};

// ---------- Styles ----------

const customStyles: StylesConfig<FilterTag, true, GroupBase<FilterTag>> = {
  control: (base, state) => ({
    ...base,
    minHeight: "2.5rem",
    backgroundColor: "white",
    borderColor: state.isFocused ? "#6366f1" : "#E4E5E7",
    borderRadius: "0.5rem",
    boxShadow: state.isFocused
      ? "0 0 0 3px rgba(99, 102, 241, 0.15)"
      : "0 1px 2px rgba(0,0,0,0.04)",
    "&:hover": {
      borderColor: state.isFocused ? "#6366f1" : "#c8cad0",
    },
    cursor: "text",
    paddingLeft: "2rem",
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "2px 4px",
    fontSize: "0.875rem",
    flexWrap: "nowrap",
    gap: "0px",
    alignItems: "center",
    overflow: "auto",
  }),
  multiValue: (base) => ({
    ...base,
    margin: 0,
    backgroundColor: "transparent",
  }),
  multiValueLabel: (base) => ({
    ...base,
    padding: 0,
  }),
  multiValueRemove: (base) => ({
    ...base,
    padding: "0 2px",
    cursor: "pointer",
    borderRadius: "0 0.25rem 0.25rem 0",
    "&:hover": {
      backgroundColor: "transparent",
    },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
    boxShadow:
      "0 4px 24px -4px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.08)",
    border: "1px solid #E4E5E7",
    borderRadius: "0.625rem",
    overflow: "hidden",
    marginTop: "6px",
  }),
  menuList: (base) => ({
    ...base,
    padding: "6px 0",
    maxHeight: "380px",
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  option: () => ({}),
  placeholder: (base) => ({
    ...base,
    color: "#717585",
    fontSize: "0.875rem",
    fontWeight: 400,
    marginLeft: "2px",
  }),
  input: (base) => ({
    ...base,
    color: "#231F20",
    fontSize: "0.875rem",
    margin: "2px",
    padding: 0,
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: "0 8px",
    color: "#717585",
    "&:hover": {
      color: "#5A5858",
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: "0 4px",
    color: "#717585",
    "&:hover": {
      color: "#5A5858",
    },
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  group: (base) => ({
    ...base,
    padding: 0,
  }),
  groupHeading: () => ({
    display: "none",
  }),
};

// ---------- Component ----------

export function OfferListSearchBar({
  selectedFilters,
  onFiltersChange,
}: OfferListSearchBarProps) {
  const instanceId = useId();
  const filtersRef = useRef(selectedFilters);
  filtersRef.current = selectedFilters;

  const selectedValues = useMemo(
    () => new Set(selectedFilters.map((f) => f.value)),
    [selectedFilters]
  );

  const defaultOptions = useMemo(() => {
    const groups: GroupBase<FilterTag>[] = [];

    const sortedStatuses = sortSelectedFirst(statusOptions, selectedValues);
    if (sortedStatuses.length > 0) {
      groups.push({ label: "Statuses", options: sortedStatuses });
    }

    const sortedTypes = sortSelectedFirst(typeOptions, selectedValues);
    if (sortedTypes.length > 0) {
      groups.push({ label: "Offer Types", options: sortedTypes });
    }

    const sortedCategories = sortSelectedFirst(categoryOptions, selectedValues);
    if (sortedCategories.length > 0) {
      groups.push({ label: "Categories", options: sortedCategories });
    }

    const sortedPerformance = sortSelectedFirst(
      performanceOptions,
      selectedValues
    );
    if (sortedPerformance.length > 0) {
      groups.push({ label: "Performance", options: sortedPerformance });
    }

    const sortedDateRange = sortSelectedFirst(dateRangeOptions, selectedValues);
    if (sortedDateRange.length > 0) {
      groups.push({ label: "Date Range", options: sortedDateRange });
    }

    const sortedRedemptionTypes = sortSelectedFirst(
      redemptionTypeOptions,
      selectedValues
    );
    if (sortedRedemptionTypes.length > 0) {
      groups.push({
        label: "Redemption Types",
        options: sortedRedemptionTypes,
      });
    }

    return groups;
  }, [selectedValues]);

  const loadOptions = useCallback(
    async (inputValue: string): Promise<GroupBase<FilterTag>[]> => {
      const groups: GroupBase<FilterTag>[] = [];
      const lower = inputValue.toLowerCase().trim();

      const filterAndPush = (label: string, options: FilterTag[]) => {
        const filtered = options.filter(
          (o) => !lower || o.label.toLowerCase().includes(lower)
        );
        const sorted = sortSelectedFirst(filtered, selectedValues);
        if (sorted.length > 0) {
          groups.push({ label, options: sorted });
        }
      };

      filterAndPush("Statuses", statusOptions);
      filterAndPush("Offer Types", typeOptions);
      filterAndPush("Categories", categoryOptions);
      filterAndPush("Performance", performanceOptions);
      filterAndPush("Date Range", dateRangeOptions);
      filterAndPush("Redemption Types", redemptionTypeOptions);

      if (lower) {
        const merchants = await searchMerchants(lower);
        const sorted = sortSelectedFirst(merchants, selectedValues);
        if (sorted.length > 0) {
          groups.push({ label: "Merchants", options: sorted });
        }
      }

      return groups;
    },
    [selectedValues]
  );

  const handleChange = useCallback(
    (newValue: readonly FilterTag[] | null) => {
      onFiltersChange(newValue ? [...newValue] : []);
    },
    [onFiltersChange]
  );

  const handleCreateOption = useCallback(
    (inputValue: string) => {
      const trimmed = inputValue.trim();
      if (!trimmed) return;
      const newTag: FilterTag = {
        label: `Search: ${trimmed}`,
        value: `search:${trimmed}`,
        category: "search",
      };
      onFiltersChange([...filtersRef.current, newTag]);
    },
    [onFiltersChange]
  );

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none z-10" />
      <AsyncCreatable<FilterTag, true, GroupBase<FilterTag>>
        instanceId={instanceId}
        isMulti
        hideSelectedOptions={false}
        cacheOptions={false}
        defaultOptions={defaultOptions}
        loadOptions={loadOptions}
        value={selectedFilters}
        onChange={handleChange}
        onCreateOption={handleCreateOption}
        createOptionPosition="first"
        formatCreateLabel={(input: string) => `Search for "${input}"`}
        isValidNewOption={(inputValue: string) => inputValue.trim().length > 0}
        getOptionValue={(option: FilterTag) => option.value}
        getOptionLabel={(option: FilterTag) => option.label}
        placeholder="Search offers, merchants, types, or statuses..."
        noOptionsMessage={() => "Type to search merchants..."}
        styles={customStyles}
        components={{
          DropdownIndicator,
          ClearIndicator,
          MultiValueContainer,
          MultiValueLabel,
          MultiValueRemove,
          ValueContainer: CustomValueContainer,
          Group: CustomGroup,
          Option: CustomOption,
          LoadingMessage,
          LoadingIndicator,
        }}
        closeMenuOnSelect={false}
        isClearable
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : undefined
        }
        menuPosition="fixed"
        menuPlacement="auto"
      />
    </div>
  );
}

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
  Globe,
  XCircle,
  PauseCircle,
  Timer,
  Link as LinkIcon,
  MonitorSmartphone,
  CreditCard,
  FileText,
  CalendarDays,
  BarChart3,
  Loader2,
  CornerDownLeft,
  Tag,
  FormInput,
  ClipboardCopy,
  type LucideIcon,
} from "lucide-react";

const AsyncCreatable =
  (AsyncCreatableModule as any).default || AsyncCreatableModule;

// ---------- Types ----------

export interface CampaignFilterTag {
  label: string;
  value: string; // "status:active" | "type:pos" | "search:free text" | "dateRange:this_week" | "feature:form" | etc.
  category: "status" | "type" | "search" | "dateRange" | "feature";
}

interface CampaignListSearchBarProps {
  selectedFilters: CampaignFilterTag[];
  onFiltersChange: (filters: CampaignFilterTag[]) => void;
}

// ---------- Category colors (Kigo-aligned) ----------

const CATEGORY_COLORS: Record<
  CampaignFilterTag["category"],
  { bg: string; text: string; dot: string }
> = {
  status: { bg: "#D1F7DF", text: "#059669", dot: "#77D898" },
  type: { bg: "#E5D7FA", text: "#8941EB", dot: "#8941EB" },
  search: { bg: "#F6F5F1", text: "#5A5858", dot: "#5A5858" },
  dateRange: { bg: "#E8EAF6", text: "#3949AB", dot: "#3949AB" },
  feature: { bg: "#E0F2F1", text: "#0D9488", dot: "#0D9488" },
};

const GROUP_CATEGORY_MAP: Record<string, CampaignFilterTag["category"]> = {
  Status: "status",
  "Campaign Type": "type",
  "Date Range": "dateRange",
  Features: "feature",
};

// ---------- Option icons ----------

const OPTION_ICONS: Record<
  string,
  React.ComponentType<{ style?: React.CSSProperties }>
> = {
  // Status icons
  "status:active": Globe,
  "status:expired": XCircle,
  "status:inactive": PauseCircle,
  // Type icons
  "type:": FileText,
  "type:pos": CreditCard,
  "type:with-timer": Timer,
  "type:online": MonitorSmartphone,
  "type:direct-link": LinkIcon,
  // Date range icons
  "dateRange:this_week": CalendarDays,
  "dateRange:this_month": CalendarDays,
  "dateRange:30_days": CalendarDays,
  "dateRange:no_end_date": CalendarDays,
  "dateRange:expired": CalendarDays,
  // Feature icons
  "feature:form": FormInput,
  "feature:copy_code": ClipboardCopy,
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
  Status: Globe,
  "Campaign Type": Tag,
  "Date Range": CalendarDays,
  Features: BarChart3,
};

// ---------- Static option sets ----------

const statusOptions: CampaignFilterTag[] = [
  { label: "Active", value: "status:active", category: "status" },
  { label: "Expired", value: "status:expired", category: "status" },
  { label: "Inactive", value: "status:inactive", category: "status" },
];

const typeOptions: CampaignFilterTag[] = [
  { label: "Standard", value: "type:", category: "type" },
  { label: "POS", value: "type:pos", category: "type" },
  { label: "With Timer", value: "type:with-timer", category: "type" },
  { label: "Online", value: "type:online", category: "type" },
  { label: "Direct Link", value: "type:direct-link", category: "type" },
];

const dateRangeOptions: CampaignFilterTag[] = [
  {
    label: "Ending This Week",
    value: "dateRange:this_week",
    category: "dateRange",
  },
  {
    label: "Ending This Month",
    value: "dateRange:this_month",
    category: "dateRange",
  },
  { label: "Next 30 Days", value: "dateRange:30_days", category: "dateRange" },
  {
    label: "No End Date",
    value: "dateRange:no_end_date",
    category: "dateRange",
  },
  {
    label: "Already Expired",
    value: "dateRange:expired",
    category: "dateRange",
  },
];

const featureOptions: CampaignFilterTag[] = [
  { label: "Form Enabled", value: "feature:form", category: "feature" },
  { label: "Copy Code", value: "feature:copy_code", category: "feature" },
];

// ---------- Semantic concept map for campaigns ----------

export const CAMPAIGN_SEMANTIC_MAP: Record<
  string,
  {
    filterFn?: (c: any) => boolean;
    sort?: { field: string; direction: "asc" | "desc" };
  }
> = {
  // Status concepts
  live: { filterFn: (c) => c._status === "active" },
  running: { filterFn: (c) => c._status === "active" },
  ended: { filterFn: (c) => c._status === "expired" },
  finished: { filterFn: (c) => c._status === "expired" },
  disabled: { filterFn: (c) => c._status === "inactive" },
  paused: { filterFn: (c) => c._status === "inactive" },
  // Recency concepts
  new: { sort: { field: "createdAt", direction: "desc" } },
  recent: { sort: { field: "updatedAt", direction: "desc" } },
  latest: { sort: { field: "updatedAt", direction: "desc" } },
  oldest: { sort: { field: "createdAt", direction: "asc" } },
  // Type concepts
  timer: { filterFn: (c) => c.getCode === "with-timer" },
  countdown: { filterFn: (c) => c.getCode === "with-timer" },
  link: { filterFn: (c) => c.getCode === "direct-link" },
  redirect: { filterFn: (c) => c.getCode === "direct-link" },
  "point of sale": { filterFn: (c) => c.getCode === "pos" },
  store: { filterFn: (c) => c.getCode === "pos" },
  affiliate: { filterFn: (c) => c.getCode === "online" },
  // Feature concepts
  form: { filterFn: (c) => c.showForm === true },
  email: { filterFn: (c) => c.showForm === true },
  code: { filterFn: (c) => c.copyCode?.enabled === true },
};

// ---------- Helpers ----------

function sortSelectedFirst(
  options: CampaignFilterTag[],
  selected: Set<string>
): CampaignFilterTag[] {
  const sel: CampaignFilterTag[] = [];
  const unsel: CampaignFilterTag[] = [];
  for (const o of options) {
    if (selected.has(o.value)) sel.push(o);
    else unsel.push(o);
  }
  return [...sel, ...unsel];
}

// ---------- Custom components (Spotlight-inspired, from OfferListSearchBar) ----------

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
  const category = props.data?.category as
    | CampaignFilterTag["category"]
    | undefined;
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
  const category = props.data?.category as
    | CampaignFilterTag["category"]
    | undefined;
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
  const category = props.data?.category as
    | CampaignFilterTag["category"]
    | undefined;
  const colors = category ? CATEGORY_COLORS[category] : CATEGORY_COLORS.search;
  return (
    <components.MultiValueRemove {...props}>
      <X style={{ color: colors.text, width: 11, height: 11, opacity: 0.45 }} />
    </components.MultiValueRemove>
  );
};

// Spotlight-style group header
const CustomGroup = (
  props: GroupProps<CampaignFilterTag, true, GroupBase<CampaignFilterTag>>
) => {
  const groupLabel = (props.data as GroupBase<CampaignFilterTag>).label ?? "";
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

// Spotlight-style option row
const CustomOption = (props: any) => {
  const { data, isSelected, isFocused, innerRef, innerProps } = props;
  const category = data?.category as CampaignFilterTag["category"] | undefined;
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

const LoadingMessage = () => (
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
      Searching...
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

const CATEGORY_LABELS: Record<CampaignFilterTag["category"], string> = {
  status: "Status",
  type: "Type",
  search: "Search",
  dateRange: "Date Range",
  feature: "Feature",
};

const CATEGORY_ORDER: CampaignFilterTag["category"][] = [
  "status",
  "type",
  "dateRange",
  "feature",
  "search",
];

const CustomValueContainer = (props: any) => {
  const { children, hasValue, ...rest } = props;
  const childArray = React.Children.toArray(children);

  if (!hasValue) {
    return (
      <components.ValueContainer hasValue={hasValue} {...rest}>
        {children}
      </components.ValueContainer>
    );
  }

  const multiValues: React.ReactNode[] = [];
  const others: React.ReactNode[] = [];
  for (const child of childArray) {
    const data = (child as any)?.props?.data as CampaignFilterTag | undefined;
    if (data?.category) {
      multiValues.push(child);
    } else {
      others.push(child);
    }
  }

  const grouped: Record<string, React.ReactNode[]> = {};
  for (const child of multiValues) {
    const data = (child as any)?.props?.data as CampaignFilterTag;
    const cat = data.category;
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(child);
  }

  const rendered: React.ReactNode[] = [];
  let groupIndex = 0;
  for (const cat of CATEGORY_ORDER) {
    const items = grouped[cat];
    if (!items || items.length === 0) continue;
    const colors = CATEGORY_COLORS[cat];
    const isFirst = groupIndex === 0;
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

const customStyles: StylesConfig<
  CampaignFilterTag,
  true,
  GroupBase<CampaignFilterTag>
> = {
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

export function CampaignListSearchBar({
  selectedFilters,
  onFiltersChange,
}: CampaignListSearchBarProps) {
  const instanceId = useId();
  const filtersRef = useRef(selectedFilters);
  filtersRef.current = selectedFilters;

  const selectedValues = useMemo(
    () => new Set(selectedFilters.map((f) => f.value)),
    [selectedFilters]
  );

  const defaultOptions = useMemo(() => {
    const groups: GroupBase<CampaignFilterTag>[] = [];

    const sortedStatuses = sortSelectedFirst(statusOptions, selectedValues);
    if (sortedStatuses.length > 0) {
      groups.push({ label: "Status", options: sortedStatuses });
    }

    const sortedTypes = sortSelectedFirst(typeOptions, selectedValues);
    if (sortedTypes.length > 0) {
      groups.push({ label: "Campaign Type", options: sortedTypes });
    }

    const sortedDateRange = sortSelectedFirst(dateRangeOptions, selectedValues);
    if (sortedDateRange.length > 0) {
      groups.push({ label: "Date Range", options: sortedDateRange });
    }

    const sortedFeatures = sortSelectedFirst(featureOptions, selectedValues);
    if (sortedFeatures.length > 0) {
      groups.push({ label: "Features", options: sortedFeatures });
    }

    return groups;
  }, [selectedValues]);

  const loadOptions = useCallback(
    async (inputValue: string): Promise<GroupBase<CampaignFilterTag>[]> => {
      const groups: GroupBase<CampaignFilterTag>[] = [];
      const lower = inputValue.toLowerCase().trim();

      const filterAndPush = (label: string, options: CampaignFilterTag[]) => {
        const filtered = options.filter(
          (o) => !lower || o.label.toLowerCase().includes(lower)
        );
        const sorted = sortSelectedFirst(filtered, selectedValues);
        if (sorted.length > 0) {
          groups.push({ label, options: sorted });
        }
      };

      filterAndPush("Status", statusOptions);
      filterAndPush("Campaign Type", typeOptions);
      filterAndPush("Date Range", dateRangeOptions);
      filterAndPush("Features", featureOptions);

      return groups;
    },
    [selectedValues]
  );

  const handleChange = useCallback(
    (newValue: readonly CampaignFilterTag[] | null) => {
      onFiltersChange(newValue ? [...newValue] : []);
    },
    [onFiltersChange]
  );

  const handleCreateOption = useCallback(
    (inputValue: string) => {
      const trimmed = inputValue.trim();
      if (!trimmed) return;
      const newTag: CampaignFilterTag = {
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
      <AsyncCreatable<CampaignFilterTag, true, GroupBase<CampaignFilterTag>>
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
        getOptionValue={(option: CampaignFilterTag) => option.value}
        getOptionLabel={(option: CampaignFilterTag) => option.label}
        placeholder="Search campaigns, types, statuses, or features..."
        noOptionsMessage={() => "Type to search campaigns..."}
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

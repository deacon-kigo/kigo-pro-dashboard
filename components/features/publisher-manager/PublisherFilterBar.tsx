"use client";

/**
 * @file Publisher Manager (DES-876) — faceted filter bar
 * @description Mirrors the Offer/Merchant Manager faceted search convention
 * (react-select AsyncCreatable, color-coded chips grouped by facet). Configured
 * per tab with an Offer Type facet (the publisher's supported types) and a
 * Status facet; free text becomes a Search chip. Emits FilterTag[].
 */

import React, { useId, useMemo, useCallback, useRef } from "react";
import type { StylesConfig, GroupBase, GroupProps } from "react-select";
import { components } from "react-select";
import * as AsyncCreatableModule from "react-select/async-creatable";
import { ChevronDown, Search, X, Check, CornerDownLeft } from "lucide-react";

import type { FilterCategory, FilterTag } from "./filterLogic";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AsyncCreatable =
  (AsyncCreatableModule as any).default || AsyncCreatableModule;

const CATEGORY_COLORS: Record<
  FilterCategory,
  { bg: string; text: string; dot: string }
> = {
  offerType: { bg: "#E5D7FA", text: "#8941EB", dot: "#8941EB" },
  status: { bg: "#D1F7DF", text: "#059669", dot: "#77D898" },
  search: { bg: "#F6F5F1", text: "#5A5858", dot: "#5A5858" },
};

const CATEGORY_LABELS: Record<FilterCategory, string> = {
  offerType: "Offer Type",
  status: "Status",
  search: "Search",
};

const LabelContext = React.createContext(CATEGORY_LABELS);

const GROUP_CATEGORY_MAP: Record<string, FilterCategory> = {
  "Offer Types": "offerType",
  Sort: "offerType",
  Status: "status",
};

const CATEGORY_ORDER: FilterCategory[] = ["status", "offerType", "search"];

export interface FacetOption {
  label: string;
  value: string;
}

interface PublisherFilterBarProps {
  offerTypeOptions: FacetOption[];
  statusOptions: FacetOption[];
  selectedFilters: FilterTag[];
  onFiltersChange: (filters: FilterTag[]) => void;
  placeholder?: string;
  statusGroupLabel?: string;
  offerTypeGroupLabel?: string;
}

function sortSelectedFirst(
  options: FilterTag[],
  selected: Set<string>
): FilterTag[] {
  const sel: FilterTag[] = [];
  const unsel: FilterTag[] = [];
  for (const o of options) (selected.has(o.value) ? sel : unsel).push(o);
  return [...sel, ...unsel];
}

/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const category = props.data?.category as FilterCategory | undefined;
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
  const category = props.data?.category as FilterCategory | undefined;
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
  const category = props.data?.category as FilterCategory | undefined;
  const colors = category ? CATEGORY_COLORS[category] : CATEGORY_COLORS.search;
  return (
    <components.MultiValueRemove {...props}>
      <X style={{ color: colors.text, width: 11, height: 11, opacity: 0.45 }} />
    </components.MultiValueRemove>
  );
};

const CustomGroup = (
  props: GroupProps<FilterTag, true, GroupBase<FilterTag>>
) => {
  const groupLabel = (props.data as GroupBase<FilterTag>).label ?? "";
  const category = GROUP_CATEGORY_MAP[groupLabel] || "search";
  const colors = CATEGORY_COLORS[category];
  return (
    <div style={{ paddingTop: "4px" }}>
      <div style={{ padding: "6px 16px 5px" }}>
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

const CustomOption = (props: any) => {
  const { data, isSelected, isFocused, innerRef, innerProps } = props;
  const category = data?.category as FilterCategory | undefined;
  const colors = category ? CATEGORY_COLORS[category] : CATEGORY_COLORS.search;
  const isCreateOption = data?.__isNew__;
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
            <span style={{ fontWeight: 600 }}>{inputValue}</span>&rdquo;
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
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: isSelected ? colors.dot : "#ccc",
              }}
            />
          </span>
          <span
            style={{
              fontSize: "0.8125rem",
              color: isSelected ? colors.text : "#333",
              fontWeight: isSelected ? 500 : 400,
              flex: 1,
            }}
          >
            {data?.label ?? ""}
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

const CustomValueContainer = (props: any) => {
  const labels = React.useContext(LabelContext);
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
    const data = (child as any)?.props?.data as FilterTag | undefined;
    (data?.category ? multiValues : others).push(child);
  }

  const grouped: Record<string, React.ReactNode[]> = {};
  for (const child of multiValues) {
    const data = (child as any)?.props?.data as FilterTag;
    (grouped[data.category] ||= []).push(child);
  }

  const rendered: React.ReactNode[] = [];
  let groupIndex = 0;
  for (const cat of CATEGORY_ORDER) {
    const items = grouped[cat];
    if (!items || items.length === 0) continue;
    const colors = CATEGORY_COLORS[cat];
    if (groupIndex > 0) {
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
        {labels[cat]}
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
    "&:hover": { borderColor: state.isFocused ? "#6366f1" : "#c8cad0" },
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
  multiValueLabel: (base) => ({ ...base, padding: 0 }),
  multiValueRemove: (base) => ({
    ...base,
    padding: "0 2px",
    cursor: "pointer",
    "&:hover": { backgroundColor: "transparent" },
  }),
  menu: (base) => ({
    ...base,
    zIndex: 9999,
    boxShadow:
      "0 4px 24px -4px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.08)",
    border: "1px solid #E4E5E7",
    borderRadius: "0.625rem",
    overflow: "visible",
    marginTop: "6px",
  }),
  menuList: (base) => ({
    ...base,
    padding: "6px 0",
    maxHeight: "min(480px, 70vh)",
    overflowY: "auto",
  }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
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
    "&:hover": { color: "#5A5858" },
  }),
  clearIndicator: (base) => ({
    ...base,
    padding: "0 4px",
    color: "#717585",
    "&:hover": { color: "#5A5858" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
  group: (base) => ({ ...base, padding: 0 }),
  groupHeading: () => ({ display: "none" }),
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export function PublisherFilterBar({
  offerTypeOptions,
  statusOptions,
  selectedFilters,
  onFiltersChange,
  placeholder = "Filter by offer type, status, or search…",
  statusGroupLabel = "Status",
  offerTypeGroupLabel = "Offer Types",
}: PublisherFilterBarProps) {
  const instanceId = useId();
  const filtersRef = useRef(selectedFilters);
  filtersRef.current = selectedFilters;

  const statusTags = useMemo<FilterTag[]>(
    () =>
      statusOptions.map((o) => ({
        label: o.label,
        value: `status:${o.value}`,
        category: "status" as const,
      })),
    [statusOptions]
  );
  const offerTypeTags = useMemo<FilterTag[]>(
    () =>
      offerTypeOptions.map((o) => ({
        label: o.label,
        value: `offerType:${o.value}`,
        category: "offerType" as const,
      })),
    [offerTypeOptions]
  );

  const selectedValues = useMemo(
    () => new Set(selectedFilters.map((f) => f.value)),
    [selectedFilters]
  );

  const buildGroups = useCallback(
    (lower: string): GroupBase<FilterTag>[] => {
      const groups: GroupBase<FilterTag>[] = [];
      const push = (label: string, options: FilterTag[]) => {
        const filtered = options.filter(
          (o) => !lower || o.label.toLowerCase().includes(lower)
        );
        const sorted = sortSelectedFirst(filtered, selectedValues);
        if (sorted.length > 0) groups.push({ label, options: sorted });
      };
      push(statusGroupLabel, statusTags);
      push(offerTypeGroupLabel, offerTypeTags);
      return groups;
    },
    [
      statusTags,
      offerTypeTags,
      selectedValues,
      statusGroupLabel,
      offerTypeGroupLabel,
    ]
  );

  const defaultOptions = useMemo(() => buildGroups(""), [buildGroups]);
  const loadOptions = useCallback(
    async (inputValue: string) => buildGroups(inputValue.toLowerCase().trim()),
    [buildGroups]
  );

  const handleChange = useCallback(
    (newValue: readonly FilterTag[] | null) =>
      onFiltersChange(newValue ? [...newValue] : []),
    [onFiltersChange]
  );

  const handleCreateOption = useCallback(
    (inputValue: string) => {
      const trimmed = inputValue.trim();
      if (!trimmed) return;
      onFiltersChange([
        ...filtersRef.current,
        {
          label: `Search: ${trimmed}`,
          value: `search:${trimmed}`,
          category: "search",
        },
      ]);
    },
    [onFiltersChange]
  );

  const labels = useMemo(
    () => ({
      ...CATEGORY_LABELS,
      offerType: offerTypeGroupLabel,
      status: statusGroupLabel,
    }),
    [offerTypeGroupLabel, statusGroupLabel]
  );

  return (
    <LabelContext.Provider value={labels}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
          isValidNewOption={(inputValue: string) =>
            inputValue.trim().length > 0
          }
          getOptionValue={(option: FilterTag) => option.value}
          getOptionLabel={(option: FilterTag) => option.label}
          placeholder={placeholder}
          noOptionsMessage={() => "No matching filters"}
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
    </LabelContext.Provider>
  );
}

export default PublisherFilterBar;

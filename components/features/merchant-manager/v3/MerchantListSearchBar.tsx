"use client";

import React, {
  useId,
  useMemo,
  useCallback,
  useRef,
  useState,
  useEffect,
} from "react";
import type { StylesConfig, GroupBase, GroupProps } from "react-select";
import { components } from "react-select";
import * as AsyncCreatableModule from "react-select/async-creatable";
import {
  ChevronDown,
  Search,
  X,
  Check,
  Building2,
  CornerDownLeft,
  FolderOpen,
  Activity,
} from "lucide-react";
import { MERCHANT_CATEGORIES } from "./category-select/taxonomy";
import { buildCategoryTreeOptions } from "./category-select/buildCategoryTreeOptions";
import { CATALOG_NAMES } from "./mockData";

// react-select's default export interop — mirrors OfferListSearchBar
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AsyncCreatable =
  (AsyncCreatableModule as any).default || AsyncCreatableModule;

// ---------- Types ----------

export interface FilterTag {
  label: string;
  /**
   * `"category:<id>" | "catalog:<name>" | "offerStatus:<key>"
   * | "search:<text>" | "sort:<key>"`
   */
  value: string;
  category: "category" | "catalog" | "offerStatus" | "search" | "sort";
  /** Tree depth (0 = root). Present on category options so the dropdown can indent. */
  depth?: number;
  /** Parent categoryId for connector-line rendering. Present on category options. */
  parentValue?: null | number;
}

/** Active offer-presence filter keys. Each maps to a predicate in the list filter. */
export type OfferStatusFilterKey = "active" | "expired" | "unpublished";

export interface MerchantListSearchBarProps {
  selectedFilters: FilterTag[];
  onFiltersChange: (filters: FilterTag[]) => void;
  /**
   * Faceted match counts, keyed by `FilterTag.value`. When present, the count
   * is appended to the option's label in the dropdown so the operator can see
   * what each pill would add before clicking.
   */
  optionCounts?: Map<string, number>;
}

// ---------- Category colors (Kigo-aligned, mirrored from OfferListSearchBar) ----------

const CATEGORY_COLORS: Record<
  FilterTag["category"],
  { bg: string; text: string; dot: string }
> = {
  category: { bg: "#E1F0FF", text: "#328FE5", dot: "#328FE5" },
  catalog: { bg: "#EEF2FF", text: "#4338CA", dot: "#6366F1" },
  offerStatus: { bg: "#D1F7DF", text: "#15803D", dot: "#22C55E" },
  search: { bg: "#F6F5F1", text: "#5A5858", dot: "#5A5858" },
  sort: { bg: "#FFE9D9", text: "#C2410C", dot: "#F97316" },
};

const GROUP_CATEGORY_MAP: Record<string, FilterTag["category"]> = {
  Categories: "category",
  Catalogs: "catalog",
  "Offer Status": "offerStatus",
};

// ---------- Option icons ----------

const GROUP_ICONS: Record<
  string,
  React.ComponentType<{ style?: React.CSSProperties }>
> = {
  Categories: Building2,
  Catalogs: FolderOpen,
  "Offer Status": Activity,
};

function getOptionIcon(
  value: string
): React.ComponentType<{ style?: React.CSSProperties }> | null {
  if (value.startsWith("category:")) return Building2;
  if (value.startsWith("catalog:")) return FolderOpen;
  if (value.startsWith("offerStatus:")) return Activity;
  return null;
}

// ---------- Static option sets ----------

// Tree-flattened from the taxonomy so the dropdown can indent each row by
// `depth` and draw connector lines to the parent. Pill values carry the
// numeric categoryId so the filter consumer can resolve to a descendant set
// (selecting a parent matches merchants tagged under any leaf).
const TREE_CATEGORY_OPTIONS = buildCategoryTreeOptions(MERCHANT_CATEGORIES);
const categoryOptions: FilterTag[] = TREE_CATEGORY_OPTIONS.map((o) => ({
  label: o.label,
  value: `category:${o.value}`,
  category: "category" as const,
  depth: o.depth,
  parentValue: o.parentValue,
}));

const catalogOptions: FilterTag[] = CATALOG_NAMES.map((name) => ({
  label: name,
  value: `catalog:${name}`,
  category: "catalog" as const,
}));

// Filter pills mirror the three buckets the Offers column actually renders
// (active / unpublished / expired). Keep them in display order.
const offerStatusOptions: FilterTag[] = [
  {
    label: "Has active offers",
    value: "offerStatus:active",
    category: "offerStatus" as const,
  },
  {
    label: "Has unpublished offers",
    value: "offerStatus:unpublished",
    category: "offerStatus" as const,
  },
  {
    label: "Has expired offers",
    value: "offerStatus:expired",
    category: "offerStatus" as const,
  },
];

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

// ---------- Custom components (Spotlight-inspired, mirrored from OfferListSearchBar) ----------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DropdownIndicator = (props: any) => (
  <components.DropdownIndicator {...props}>
    <ChevronDown className="h-4 w-4 opacity-50" />
  </components.DropdownIndicator>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ClearIndicator = (props: any) => (
  <components.ClearIndicator {...props}>
    <X className="h-3.5 w-3.5 opacity-50 hover:opacity-100" />
  </components.ClearIndicator>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        maxWidth: "200px",
        lineHeight: "22px",
      }}
    >
      {props.data?.label ?? ""}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MultiValueRemove = (props: any) => {
  const category = props.data?.category as FilterTag["category"] | undefined;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomOption = (props: any) => {
  const { data, isSelected, isFocused, innerRef, innerProps } = props;
  const category = data?.category as FilterTag["category"] | undefined;
  const colors = category ? CATEGORY_COLORS[category] : CATEGORY_COLORS.search;
  const isCreateOption = data?.__isNew__;
  const OptionIcon = data?.value ? getOptionIcon(data.value) : null;
  const inputValue = (props.selectProps?.inputValue as string) || "";
  // Faceted count forwarded by MerchantListSearchBar via selectProps. Only
  // surfaced for catalog + offerStatus options (categories use a tree picker
  // and per-node counts would be misleading without ancestor aggregation).
  const optionCounts: Map<string, number> | undefined =
    props.selectProps?.optionCounts;
  const showCount =
    !isCreateOption &&
    (category === "catalog" || category === "offerStatus") &&
    optionCounts !== undefined;
  const count = showCount ? (optionCounts.get(data.value) ?? 0) : null;

  // Tree-style row for category options (depth + connector line, mirrors
  // kigo-admin-tools CategoryOptionComponent). The anchor() positioning
  // works because MenuList sets `position: relative` and this row's outer
  // wrapper is `position: static`.
  if (category === "category" && typeof data?.depth === "number") {
    const valueStr = String(data.value);
    const parentStr =
      data.parentValue !== null && data.parentValue !== undefined
        ? `category:${data.parentValue}`
        : null;
    const isAncestorOnly =
      inputValue.trim() !== "" &&
      !String(data.label).toLowerCase().includes(inputValue.toLowerCase());

    return (
      <div
        ref={innerRef}
        {...innerProps}
        style={{
          padding: "6px 12px",
          margin: "1px 8px",
          cursor: "pointer",
          backgroundColor: isSelected
            ? colors.bg
            : isFocused
              ? "rgba(0, 0, 0, 0.04)"
              : "transparent",
          borderRadius: "8px",
          transition: "background-color 0.1s ease",
          position: "static",
        }}
      >
        <span
          style={
            {
              alignItems: "center",
              anchorName: `--cat-${valueStr.replace(/:/g, "-")}`,
              display: "flex",
              marginLeft: `${(data.depth * 24).toString()}px`,
            } as React.CSSProperties
          }
        >
          {parentStr !== null && (
            <span
              aria-hidden="true"
              style={
                {
                  borderBottom: "1px solid #d1d5db",
                  borderBottomLeftRadius: "8px",
                  borderLeft: "1px solid #d1d5db",
                  bottom: `anchor(--cat-${valueStr.replace(/:/g, "-")} center)`,
                  left: `anchor(--cat-${parentStr.replace(/:/g, "-")} left)`,
                  position: "absolute",
                  right: `calc(anchor(--cat-${valueStr.replace(/:/g, "-")} left) + 4px)`,
                  top: `anchor(--cat-${parentStr.replace(/:/g, "-")} bottom)`,
                } as React.CSSProperties
              }
            />
          )}
          <span
            style={{
              fontSize: "0.8125rem",
              color: isAncestorOnly
                ? "#9ca3af"
                : isSelected
                  ? colors.text
                  : "#333",
              fontWeight: isSelected ? 500 : 400,
              flex: 1,
            }}
            title={String(data.label)}
          >
            {isAncestorOnly
              ? data.label
              : highlightMatch(
                  data.label ?? "",
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
                marginLeft: "auto",
                flexShrink: 0,
                strokeWidth: 2.5,
              }}
            />
          )}
        </span>
      </div>
    );
  }

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

          {showCount && (
            <span
              style={{
                fontSize: "0.6875rem",
                color: count === 0 ? "#bbb" : "#888",
                fontVariantNumeric: "tabular-nums",
                fontWeight: 500,
                marginRight: isSelected ? 6 : 0,
                flexShrink: 0,
              }}
              aria-label={`${count} ${count === 1 ? "match" : "matches"}`}
            >
              {count}
            </span>
          )}

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

// ---------- Badge group labels (in selected value container) ----------

const CATEGORY_DISPLAY_LABELS: Record<FilterTag["category"], string> = {
  category: "Category",
  catalog: "Catalog",
  offerStatus: "Offer",
  search: "Search",
  sort: "Sort",
};

const CATEGORY_ORDER: FilterTag["category"][] = [
  "category",
  "catalog",
  "offerStatus",
  "search",
  "sort",
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (child as any)?.props?.data as FilterTag | undefined;
    if (data?.category) {
      multiValues.push(child);
    } else {
      others.push(child);
    }
  }

  const grouped: Record<string, React.ReactNode[]> = {};
  for (const child of multiValues) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (child as any)?.props?.data as FilterTag;
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
        {CATEGORY_DISPLAY_LABELS[cat]}
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
    // Containing block for the option-row connector lines (position: absolute).
    position: "relative",
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

export function MerchantListSearchBar({
  selectedFilters,
  onFiltersChange,
  optionCounts,
}: MerchantListSearchBarProps) {
  const instanceId = useId();
  const filtersRef = useRef(selectedFilters);
  filtersRef.current = selectedFilters;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close the menu when the user clicks outside the search bar wrapper AND
  // outside the portaled menu (which lives at document.body via menuPortalTarget).
  useEffect(() => {
    if (!menuIsOpen) return;

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      // Click inside the search bar wrapper — leave menu state untouched.
      if (wrapperRef.current && wrapperRef.current.contains(target)) {
        return;
      }

      // Click inside the portaled react-select menu — leave menu state untouched.
      // react-select assigns ids like `react-select-<instanceId>-listbox` to the menu.
      const escapedId = instanceId.replace(/"/g, '\\"');
      const menuEl = document.querySelector(
        `[id="react-select-${escapedId}-listbox"]`
      );
      if (menuEl && menuEl.contains(target)) {
        return;
      }

      setMenuIsOpen(false);
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [menuIsOpen, instanceId]);

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) {
        clearTimeout(blurTimeoutRef.current);
      }
    };
  }, []);

  const selectedValues = useMemo(
    () => new Set(selectedFilters.map((f) => f.value)),
    [selectedFilters]
  );

  const defaultOptions = useMemo(() => {
    const groups: GroupBase<FilterTag>[] = [];

    // Categories preserve DFS tree order (no sortSelectedFirst — that would
    // detach children from their parents and break the indent/connector UX).
    if (categoryOptions.length > 0) {
      groups.push({ label: "Categories", options: categoryOptions });
    }

    const sortedCatalogs = sortSelectedFirst(catalogOptions, selectedValues);
    if (sortedCatalogs.length > 0) {
      groups.push({ label: "Catalogs", options: sortedCatalogs });
    }

    const sortedOfferStatus = sortSelectedFirst(
      offerStatusOptions,
      selectedValues
    );
    if (sortedOfferStatus.length > 0) {
      groups.push({ label: "Offer Status", options: sortedOfferStatus });
    }

    return groups;
  }, [selectedValues]);

  const loadOptions = useCallback(
    async (inputValue: string): Promise<GroupBase<FilterTag>[]> => {
      const groups: GroupBase<FilterTag>[] = [];
      const lower = inputValue.toLowerCase().trim();

      // Ancestor-walking filter for the tree (mirrors admin-tools CategorySelect):
      // any option whose label matches keeps itself AND every ancestor up the
      // chain so the indent/connector tree shape is preserved. Ancestor-only
      // rows render gray inside CustomOption.
      let visibleCategories = categoryOptions;
      if (lower) {
        const visible = new Set<string>();
        for (const opt of categoryOptions) {
          if (opt.label.toLowerCase().includes(lower)) {
            visible.add(opt.value);
            let parent = opt.parentValue ?? null;
            while (parent !== null) {
              const parentVal = `category:${parent}`;
              visible.add(parentVal);
              const parentOpt = categoryOptions.find(
                (o) => o.value === parentVal
              );
              parent = parentOpt?.parentValue ?? null;
            }
          }
        }
        visibleCategories = categoryOptions.filter((o) => visible.has(o.value));
      }
      if (visibleCategories.length > 0) {
        groups.push({ label: "Categories", options: visibleCategories });
      }

      const filteredCatalogs = catalogOptions.filter(
        (o) => !lower || o.label.toLowerCase().includes(lower)
      );
      const sortedCatalogs = sortSelectedFirst(
        filteredCatalogs,
        selectedValues
      );
      if (sortedCatalogs.length > 0) {
        groups.push({ label: "Catalogs", options: sortedCatalogs });
      }

      const filteredOfferStatus = offerStatusOptions.filter(
        (o) => !lower || o.label.toLowerCase().includes(lower)
      );
      const sortedOfferStatus = sortSelectedFirst(
        filteredOfferStatus,
        selectedValues
      );
      if (sortedOfferStatus.length > 0) {
        groups.push({ label: "Offer Status", options: sortedOfferStatus });
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
    <div className="relative" ref={wrapperRef}>
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
        placeholder="Search merchants, categories, catalogs, or offer status..."
        noOptionsMessage={() => "Press Enter to search merchants..."}
        styles={customStyles}
        // Forwarded into selectProps so CustomOption can display the count.
        // react-select passes any unknown props through unchanged.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...({ optionCounts } as any)}
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
        menuIsOpen={menuIsOpen}
        onFocus={() => setMenuIsOpen(true)}
        onBlur={() => {
          // Secondary defensive close: react-select fires blur when the user
          // clicks an option inside the portaled menu, so defer to a microtask
          // and let the mousedown-outside listener (the primary mechanism)
          // decide the final state. We only close here if focus has truly
          // left the wrapper and the menu — otherwise we leave state alone.
          if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
          blurTimeoutRef.current = setTimeout(() => {
            const active = document.activeElement as Node | null;
            if (!active) return;
            if (wrapperRef.current && wrapperRef.current.contains(active)) {
              return;
            }
            const escapedId = instanceId.replace(/"/g, '\\"');
            const menuEl = document.querySelector(
              `[id="react-select-${escapedId}-listbox"]`
            );
            if (menuEl && menuEl.contains(active)) {
              return;
            }
            setMenuIsOpen(false);
          }, 0);
        }}
        onInputChange={(value, meta) => {
          if (meta.action === "input-change" && value.length > 0) {
            setMenuIsOpen(true);
          }
        }}
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : undefined
        }
        menuPosition="fixed"
        menuPlacement="auto"
      />
    </div>
  );
}

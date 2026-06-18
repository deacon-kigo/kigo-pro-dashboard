"use client";

import React, { useMemo, useRef } from "react";
import type {
  FilterOptionOption,
  GroupBase,
  MultiValue,
  StylesConfig,
} from "react-select";
import Select from "react-select";

import { MERCHANT_CATEGORIES } from "./taxonomy";
import {
  buildCategoryTreeOptions,
  type CategoryOption,
} from "./buildCategoryTreeOptions";
import { CategoryOptionRow } from "./CategoryOption";
import { MenuList } from "./MenuList";

// Tree-aware multi-select for the merchant category taxonomy.
// - Options are pre-flattened DFS, each carrying depth + parentValue.
// - When the user types, the filter shows the matching row AND walks up
//   every ancestor so the tree shape stays intact in the dropdown.
// - Ancestor-only rows render gray inside CategoryOptionRow.
// Ported from kigo-admin-tools CategorySelect, sans the server `getCategories`
// call — this prototype uses a local taxonomy constant.

interface CategoryTreeSelectProps {
  id?: string;
  value: number[];
  onChange: (next: number[]) => void;
  placeholder?: string;
  isDisabled?: boolean;
  className?: string;
}

const styles: StylesConfig<CategoryOption, true, GroupBase<CategoryOption>> = {
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
    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  }),
  valueContainer: (base) => ({
    ...base,
    padding: "2px 6px",
    fontSize: "0.875rem",
    gap: "4px",
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#E1F0FF",
    borderRadius: "5px",
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#328FE5",
    fontSize: "0.75rem",
    fontWeight: 500,
    padding: "0 4px 0 7px",
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#328FE5",
    cursor: "pointer",
    borderRadius: "0 5px 5px 0",
    "&:hover": {
      backgroundColor: "rgba(50, 143, 229, 0.15)",
      color: "#328FE5",
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
  placeholder: (base) => ({
    ...base,
    color: "#717585",
    fontSize: "0.875rem",
  }),
  input: (base) => ({
    ...base,
    color: "#231F20",
    fontSize: "0.875rem",
  }),
  indicatorSeparator: () => ({ display: "none" }),
};

export function CategoryTreeSelect({
  id,
  value,
  onChange,
  placeholder = "Select categories",
  isDisabled,
  className,
}: CategoryTreeSelectProps) {
  const options = useMemo(
    () => buildCategoryTreeOptions(MERCHANT_CATEGORIES),
    []
  );

  // value -> option lookup for resolving the controlled value
  const optionById = useMemo(() => {
    const m = new Map<number, CategoryOption>();
    for (const o of options) m.set(o.value, o);
    return m;
  }, [options]);

  const parentMap = useMemo(() => {
    const m = new Map<number, null | number>();
    for (const o of options) m.set(o.value, o.parentValue);
    return m;
  }, [options]);

  // Cached ancestor-walking filter. When the user types, we include the
  // matching row PLUS every ancestor up the chain so the tree shape stays
  // intact. Cache invalidates on inputValue change.
  const cacheRef = useRef<{ inputValue: string; visible: Set<number> }>({
    inputValue: "",
    visible: new Set(),
  });

  const getVisibleValues = (inputValue: string): Set<number> => {
    if (cacheRef.current.inputValue === inputValue) {
      return cacheRef.current.visible;
    }
    if (!inputValue.trim()) {
      cacheRef.current = { inputValue, visible: new Set() };
      return cacheRef.current.visible;
    }
    const needle = inputValue.toLowerCase();
    const visible = new Set<number>();
    for (const opt of options) {
      if (opt.label.toLowerCase().includes(needle)) {
        visible.add(opt.value);
        let parent = parentMap.get(opt.value) ?? null;
        while (parent !== null) {
          visible.add(parent);
          parent = parentMap.get(parent) ?? null;
        }
      }
    }
    cacheRef.current = { inputValue, visible };
    return visible;
  };

  const filterOption = (
    option: FilterOptionOption<CategoryOption>,
    inputValue: string
  ) => {
    if (!inputValue.trim()) return true;
    return getVisibleValues(inputValue).has(option.data.value);
  };

  const selected = value
    .map((id) => optionById.get(id))
    .filter((o): o is CategoryOption => Boolean(o));

  return (
    <Select<CategoryOption, true, GroupBase<CategoryOption>>
      inputId={id}
      isMulti
      hideSelectedOptions={false}
      options={options}
      value={selected}
      onChange={(next: MultiValue<CategoryOption>) =>
        onChange(next.map((o) => o.value))
      }
      filterOption={filterOption}
      placeholder={placeholder}
      isDisabled={isDisabled}
      className={className}
      styles={styles}
      components={{
        MenuList,
        Option: CategoryOptionRow,
      }}
      noOptionsMessage={({ inputValue }) =>
        inputValue
          ? `No categories match "${inputValue}"`
          : "No categories available"
      }
      menuPortalTarget={
        typeof document !== "undefined" ? document.body : undefined
      }
      menuPosition="fixed"
      menuPlacement="auto"
    />
  );
}

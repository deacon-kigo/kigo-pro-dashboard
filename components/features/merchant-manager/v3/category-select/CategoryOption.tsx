import React, { memo, type CSSProperties } from "react";
import type { GroupBase, OptionProps } from "react-select";
import { components } from "react-select";
import { CheckIcon } from "@heroicons/react/24/outline";

import type { CategoryOption } from "./buildCategoryTreeOptions";
import { Highlighted } from "./Highlighted";

// Tree-aware option row.
// - Indents by depth * 24px
// - Renders an L-shaped connector to its parent using CSS `anchor()` —
//   each option carries an `anchor-name`, the connector positions itself
//   between this row's center and the parent row's bottom.
// - When searching, rows passed through the filter that DON'T match are
//   ancestors-only (gray) — keeps the tree shape readable.
// Ported from kigo-admin-tools `category-option/index.tsx`.
const CategoryOptionRow = memo(
  (props: OptionProps<CategoryOption, true, GroupBase<CategoryOption>>) => {
    const { children, data, isSelected, selectProps } = props;
    const valueStr = String(data.value);
    const parentStr = String(data.parentValue);
    const inputValue = selectProps.inputValue;
    const isAncestorOnly =
      inputValue.trim() !== "" &&
      !data.label.toLowerCase().includes(inputValue.toLowerCase());

    return (
      <components.Option
        {...props}
        className={isSelected ? "!bg-primary/10" : ""}
        innerProps={{
          ...props.innerProps,
          style: { ...props.innerProps.style, position: "static" },
        }}
      >
        <span
          style={
            {
              alignItems: "center",
              anchorName: `--cat-${valueStr}`,
              display: "flex",
              marginLeft: `${(data.depth * 24).toString()}px`,
            } as CSSProperties
          }
        >
          {data.parentValue !== null && (
            <span
              aria-hidden="true"
              style={
                {
                  borderBottom: "1px solid #d1d5db",
                  borderBottomLeftRadius: "8px",
                  borderLeft: "1px solid #d1d5db",
                  bottom: `anchor(--cat-${valueStr} center)`,
                  left: `anchor(--cat-${parentStr} left)`,
                  position: "absolute",
                  right: `calc(anchor(--cat-${valueStr} left) + 4px)`,
                  top: `anchor(--cat-${parentStr} bottom)`,
                } as CSSProperties
              }
            />
          )}
          <span
            className={isAncestorOnly ? "text-gray-400" : undefined}
            title={typeof children === "string" ? children : undefined}
          >
            {isAncestorOnly ? (
              children
            ) : (
              <Highlighted highlight={inputValue}>
                {typeof children === "string" ? children : data.label}
              </Highlighted>
            )}
          </span>
          {isSelected && (
            <CheckIcon
              className="ml-auto h-4 w-4 shrink-0"
              aria-hidden="true"
            />
          )}
        </span>
      </components.Option>
    );
  },
  (prev, next) =>
    prev.data.value === next.data.value &&
    prev.isSelected === next.isSelected &&
    prev.isFocused === next.isFocused &&
    prev.selectProps.inputValue === next.selectProps.inputValue
);

CategoryOptionRow.displayName = "CategoryOptionRow";

export { CategoryOptionRow };

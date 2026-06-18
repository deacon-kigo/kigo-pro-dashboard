import React from "react";
import type { GroupBase, MenuListProps } from "react-select";
import { components } from "react-select";

// position: relative on the menu inner so the connector lines (which are
// `position: absolute` inside each Option) are positioned within the menu
// rather than the document. Ported from admin-tools.
export function MenuList<
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>,
>({ innerProps, ...props }: MenuListProps<Option, IsMulti, Group>) {
  return (
    <components.MenuList
      {...props}
      innerProps={{
        ...innerProps,
        style: {
          ...innerProps.style,
          position: "relative",
        },
      }}
    />
  );
}

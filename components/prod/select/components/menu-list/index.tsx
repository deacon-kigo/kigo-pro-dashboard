"use client";

import type { Option } from "../../types";

import type { CSSProperties, ReactElement, ReactNode, WheelEvent } from "react";
import { Children } from "react";
import type { GroupBase, MenuListProps } from "react-select";
import { components } from "react-select";
import { List } from "react-window";

import { OPTION_HEIGHT } from "../../constants";

const OVER_SCAN_COUNT = 20;
const VIRTUALIZATION_THRESHOLD = 50;

/*
 * Keep wheel events out of Radix's modal scroll lock. The menu portals to
 * `document.body` — outside any open dialog's subtree — and the lock
 * (react-remove-scroll) preventDefaults wheel events it sees at the document
 * level from outside that subtree, which killed wheel/trackpad scrolling in
 * every dialog-hosted select. Stopping propagation here means the lock's
 * document listener never sees the event, so the menu's native scroll (and its
 * native chaining behavior) proceeds untouched. Harmless outside dialogs:
 * nothing above the menu wants its wheel events.
 */
const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
  event.stopPropagation();
};

const Row = ({
  children,
  style,
}: {
  children: ReactNode;
  index: number;
  style: CSSProperties;
}) => <div style={style}>{children}</div>;

const MenuList = <TOption extends Option, TIsMulti extends boolean>(
  props: MenuListProps<TOption, TIsMulti, GroupBase<TOption>>
) => {
  const {
    children,
    className,
    cx,
    getClassNames,
    innerProps,
    innerRef,
    isMulti,
    maxHeight,
    selectProps,
  } = props;
  // eslint-disable-next-line @eslint-react/no-children-to-array
  const childArray = Children.toArray(children);

  if (childArray.length < VIRTUALIZATION_THRESHOLD) {
    return (
      <components.MenuList
        {...props}
        innerProps={
          {
            ...innerProps,
            "data-testid": "menu-list",
            onWheel: handleWheel,
            // Positioning context for anchor-based option connectors (tree view).
            style: { ...innerProps.style, position: "relative" },
          } as typeof innerProps
        }
        innerRef={innerRef}
      />
    );
  }

  const itemHeight =
    (selectProps as { optionHeight?: number }).optionHeight ?? OPTION_HEIGHT;
  const height = Math.min(maxHeight, childArray.length * itemHeight);
  const menuListClassName = cx(
    { "menu-list": true, "menu-list--is-multi": isMulti },
    getClassNames("menuList", props),
    className
  );

  return (
    /*
     * The wrapper carries the wheel shield: wheel events bubble from the
     * virtualized list through here before reaching the document, where the
     * modal scroll lock would otherwise cancel them.
     */
    <div onWheel={handleWheel}>
      <List
        className={menuListClassName}
        data-testid="menu-list"
        overscanCount={OVER_SCAN_COUNT}
        rowComponent={({ index, style }): ReactElement => (
          <Row index={index} style={style}>
            {childArray[index]}
          </Row>
        )}
        rowCount={childArray.length}
        rowHeight={itemHeight}
        rowProps={{}}
        style={{ height, overflow: "auto" }}
      />
    </div>
  );
};

export { MenuList };

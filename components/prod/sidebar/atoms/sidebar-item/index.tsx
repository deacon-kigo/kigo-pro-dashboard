"use client";

import type { ComponentType, HTMLAttributeAnchorTarget, SVGProps } from "react";

import { CollapsibleSidebarLabel } from "../collapsible-sidebar-label";
import { SidebarLabel } from "../sidebar-label";

interface ButtonItemProps {
  onClick: () => Promise<void> | void;
}

interface CollapsibleItemProps {
  subItems: {
    href: string;
    title: string;
  }[];
}

interface CommonItemProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
}

interface LinkItemProps {
  href: string;
  target?: HTMLAttributeAnchorTarget | undefined;
}

type SidebarItemProps =
  | (ButtonItemProps & CommonItemProps)
  | (CollapsibleItemProps & CommonItemProps)
  | (CommonItemProps & LinkItemProps);

const SidebarItem = ({ icon, title, ...props }: SidebarItemProps) => {
  const commonProps = {
    icon,
    title,
  };

  if ("href" in props) {
    return (
      <SidebarLabel href={props.href} {...commonProps} target={props.target} />
    );
  }

  if ("subItems" in props && props.subItems.length > 0) {
    return (
      <CollapsibleSidebarLabel {...commonProps} subItems={props.subItems} />
    );
  }

  if ("onClick" in props) {
    return <SidebarLabel {...commonProps} onClick={props.onClick} />;
  }

  return null;
};

export { SidebarItem };

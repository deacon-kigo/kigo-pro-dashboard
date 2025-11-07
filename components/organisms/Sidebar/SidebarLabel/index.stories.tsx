import type { Meta, StoryObj } from "@storybook/react";
import SidebarLabel from "./index";
import { HomeIcon } from "@heroicons/react/24/outline";

// Debug console log
console.log("Loading SidebarLabel story file");

const meta = {
  title: "Applications/Kigo Pro/Design System/Organisms/Sidebar/SidebarLabel",
  component: SidebarLabel,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SidebarLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "/",
    icon: HomeIcon,
    title: "Dashboard",
    isActive: false,
    isCollapsed: false,
    isCVSContext: false,
  },
};

export const Active: Story = {
  args: {
    href: "/",
    icon: HomeIcon,
    title: "Dashboard",
    isActive: true,
    isCollapsed: false,
    isCVSContext: false,
  },
};

export const Collapsed: Story = {
  args: {
    href: "/",
    icon: HomeIcon,
    title: "Dashboard",
    isActive: false,
    isCollapsed: true,
    isCVSContext: false,
  },
};

export const CVSContext: Story = {
  args: {
    href: "/",
    icon: HomeIcon,
    title: "Dashboard",
    isActive: false,
    isCollapsed: false,
    isCVSContext: true,
  },
};

export const CVSContextActive: Story = {
  args: {
    href: "/",
    icon: HomeIcon,
    title: "Dashboard",
    isActive: true,
    isCollapsed: false,
    isCVSContext: true,
  },
};

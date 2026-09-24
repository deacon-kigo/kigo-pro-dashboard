import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Sidebar } from ".";

/*
 * `/support-manager` is a real module base path, so the Support Manager item
 * renders active and the Modules group header renders in its active state.
 */
const meta = {
  args: {
    initiallyCollapsedGroups: [],
    isInitiallyCollapsed: false,
    userName: "Admin User",
    userRole: "admin",
  },
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/support-manager",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Sidebar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AdminExpanded: Story = {};

export const AdminCollapsed: Story = {
  args: {
    isInitiallyCollapsed: true,
  },
};

export const ModulesGroupCollapsed: Story = {
  args: {
    initiallyCollapsedGroups: ["modules"],
  },
};

/**
 * The first-visit state: no cookie yet, so `parseCollapsedGroups` falls back to
 * the per-group defaults and only Tools starts collapsed.
 */
export const ToolsGroupCollapsed: Story = {
  args: {
    initiallyCollapsedGroups: ["tools"],
  },
};

export const AllGroupsCollapsed: Story = {
  args: {
    initiallyCollapsedGroups: ["modules", "tools"],
  },
};

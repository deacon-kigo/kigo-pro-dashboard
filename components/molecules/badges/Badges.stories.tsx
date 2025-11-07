import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import {
  StatusBadge,
  TokenStateBadge,
  TicketBadge,
  TicketStatusBadge,
  TierBadge,
  VersionBadge,
} from "./index";

const meta: Meta<typeof StatusBadge> = {
  title: "Applications/Kigo Pro/Design System/Molecules/Badges",
  component: StatusBadge,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Badge components for displaying statuses, states, and other information.",
      },
    },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StatusBadge>;

// Status Badge Stories
export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <StatusBadge status="active" />
      <StatusBadge status="draft" />
      <StatusBadge status="scheduled" />
      <StatusBadge status="completed" />
      <StatusBadge status="paused" />
    </div>
  ),
};

// Token State Badge Stories
export const TokenStateBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <TokenStateBadge state="Active" />
      <TokenStateBadge state="Shared" />
      <TokenStateBadge state="Used" />
      <TokenStateBadge state="Expired" />
    </div>
  ),
};

// Ticket Badge Stories
export const TicketBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <TicketBadge status="Open" tier="Tier1" />
      <TicketBadge status="In Progress" tier="Tier2" />
      <TicketBadge status="Escalated" tier="Tier1" />
      <TicketBadge status="Resolved" tier="Tier2" />
      <TicketBadge status="Closed" tier="Tier1" />
    </div>
  ),
};

// Ticket Status Badge Stories
export const TicketStatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <TicketStatusBadge status="Open" />
      <TicketStatusBadge status="In Progress" />
      <TicketStatusBadge status="Escalated" />
      <TicketStatusBadge status="Resolved" />
      <TicketStatusBadge status="Closed" />
    </div>
  ),
};

// Tier Badge Stories
export const TierBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <TierBadge tier="Tier1" />
      <TierBadge tier="Tier2" />
    </div>
  ),
};

// Version Badge Stories
export const VersionBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <VersionBadge version="current" />
      <VersionBadge version="upcoming" />
      <VersionBadge version="future" />
      <VersionBadge version="experimental" />
    </div>
  ),
};

// Custom Size and Styling
export const CustomizedBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <span className="text-sm font-medium text-text-muted">Normal:</span>
        <StatusBadge status="active" />
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <span className="text-sm font-medium text-text-muted">
          Custom size:
        </span>
        <StatusBadge status="active" className="text-xs px-2 py-0.5" />
        <StatusBadge status="draft" className="text-lg px-4 py-1" />
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <span className="text-sm font-medium text-text-muted">
          Custom style:
        </span>
        <StatusBadge status="active" className="rounded-sm" />
        <StatusBadge status="draft" className="rounded-full" />
        <StatusBadge status="completed" className="border-2" />
      </div>
    </div>
  ),
};

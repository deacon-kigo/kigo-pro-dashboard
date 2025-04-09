import { Button } from "./";
import { PlusIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import type { Meta, StoryObj } from "@storybook/react";

/**
 * Button component with various styles and variants.
 * Includes standard variants, sizes, states, and special branding options.
 */

const meta: Meta<typeof Button> = {
  title: "KIGO UI/Atoms/Button",
  component: Button,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Button component with various styles and variants. Supports theming and co-branding through a declarative API.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline", "ghost", "link", "destructive"],
      description: "The button's visual style",
      defaultValue: "primary",
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
      description: "The button's size",
      defaultValue: "default",
    },
    theme: {
      control: "select",
      options: ["kigo", "cvs"],
      description: "The button's theme",
      defaultValue: "kigo",
    },
    state: {
      control: "select",
      options: ["default", "active", "selected"],
      description: "The button's state",
      defaultValue: "default",
    },
    disabled: {
      control: "boolean",
      description: "Whether the button is disabled",
      defaultValue: false,
    },
    icon: {
      control: "boolean",
      description: "Whether to show an icon",
      defaultValue: false,
    },
    className: {
      description: "Additional CSS classes to apply",
      control: "text",
    },
    children: {
      description: "Button content",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Base story
export const Default: Story = {
  args: {
    children: "Button",
    variant: "primary",
    size: "default",
    theme: "kigo",
    state: "default",
    disabled: false,
  },
  render: (args) => (
    <Button {...args} icon={args.icon ? <PlusIcon /> : undefined}>
      {args.children}
    </Button>
  ),
};

// Show all variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-6 gap-4">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">Destructive</Button>
      </div>

      <div className="grid grid-cols-6 gap-4">
        <Button variant="primary" disabled>Primary</Button>
        <Button variant="secondary" disabled>Secondary</Button>
        <Button variant="outline" disabled>Outline</Button>
        <Button variant="ghost" disabled>Ghost</Button>
        <Button variant="link" disabled>Link</Button>
        <Button variant="destructive" disabled>Destructive</Button>
      </div>
    </div>
  ),
};

// Show all sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon" icon={<PlusIcon />} />
      </div>
    </div>
  ),
};

// Show all themes
export const Themes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="text-sm font-medium mb-3">Kigo Theme</h3>
        <div className="grid grid-cols-6 gap-4">
          <Button theme="kigo" variant="primary">Primary</Button>
          <Button theme="kigo" variant="secondary">Secondary</Button>
          <Button theme="kigo" variant="outline">Outline</Button>
          <Button theme="kigo" variant="ghost">Ghost</Button>
          <Button theme="kigo" variant="link">Link</Button>
          <Button theme="kigo" variant="destructive">Destructive</Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">CVS Theme</h3>
        <div className="grid grid-cols-6 gap-4">
          <Button theme="cvs" variant="primary">Primary</Button>
          <Button theme="cvs" variant="secondary">Secondary</Button>
          <Button theme="cvs" variant="outline">Outline</Button>
          <Button theme="cvs" variant="ghost">Ghost</Button>
          <Button theme="cvs" variant="link">Link</Button>
          <Button theme="cvs" variant="destructive">Destructive</Button>
        </div>
      </div>
    </div>
  ),
};

// Show all states
export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <Button state="default">Default State</Button>
        <Button state="active">Active State</Button>
        <Button state="selected">Selected State</Button>
      </div>
    </div>
  ),
};

// Show with icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <Button icon={<PlusIcon />}>With Icon</Button>
        <Button icon={<ArrowRightIcon />}>Icon Right</Button>
        <Button size="icon" icon={<PlusIcon />} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Button variant="outline" icon={<PlusIcon />}>Outline</Button>
        <Button variant="secondary" icon={<PlusIcon />}>Secondary</Button>
        <Button variant="ghost" icon={<PlusIcon />}>Ghost</Button>
      </div>
    </div>
  ),
};

// Show with links
export const WithLinks: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <Button href="#" icon={<ArrowRightIcon />}>Link Button</Button>
        <Button href="#" variant="outline">Outline Link</Button>
        <Button href="#" variant="link">Link Variant</Button>
      </div>
    </div>
  ),
};

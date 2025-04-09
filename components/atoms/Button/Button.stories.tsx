import React from "react";
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
      options: [
        "primary",
        "secondary",
        "outline",
        "ghost",
        "link",
        "destructive",
      ],
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
    glow: {
      control: "boolean",
      description: "Whether to add a glow effect to the button",
      defaultValue: false,
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
        <Button variant="primary" disabled>
          Primary
        </Button>
        <Button variant="secondary" disabled>
          Secondary
        </Button>
        <Button variant="outline" disabled>
          Outline
        </Button>
        <Button variant="ghost" disabled>
          Ghost
        </Button>
        <Button variant="link" disabled>
          Link
        </Button>
        <Button variant="destructive" disabled>
          Destructive
        </Button>
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
          <Button theme="kigo" variant="primary">
            Primary
          </Button>
          <Button theme="kigo" variant="secondary">
            Secondary
          </Button>
          <Button theme="kigo" variant="outline">
            Outline
          </Button>
          <Button theme="kigo" variant="ghost">
            Ghost
          </Button>
          <Button theme="kigo" variant="link">
            Link
          </Button>
          <Button theme="kigo" variant="destructive">
            Destructive
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">CVS Theme</h3>
        <div className="grid grid-cols-6 gap-4">
          <Button theme="cvs" variant="primary">
            Primary
          </Button>
          <Button theme="cvs" variant="secondary">
            Secondary
          </Button>
          <Button theme="cvs" variant="outline">
            Outline
          </Button>
          <Button theme="cvs" variant="ghost">
            Ghost
          </Button>
          <Button theme="cvs" variant="link">
            Link
          </Button>
          <Button theme="cvs" variant="destructive">
            Destructive
          </Button>
        </div>
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
        <Button variant="outline" icon={<PlusIcon />}>
          Outline
        </Button>
        <Button variant="secondary" icon={<PlusIcon />}>
          Secondary
        </Button>
        <Button variant="ghost" icon={<PlusIcon />}>
          Ghost
        </Button>
      </div>
    </div>
  ),
};

// Show with links
export const WithLinks: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <Button href="#" icon={<ArrowRightIcon />}>
          Link Button
        </Button>
        <Button href="#" variant="outline">
          Outline Link
        </Button>
        <Button href="#" variant="link">
          Link Variant
        </Button>
      </div>
    </div>
  ),
};

// Show with glow effects
export const WithGlowEffects: Story = {
  render: () => (
    <div className="flex flex-col gap-8 p-8 bg-gray-950 rounded-xl">
      <div>
        <h3 className="text-sm font-medium mb-3 text-white">
          Default Glow Effects
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <Button variant="primary" glow>
            Primary
          </Button>
          <Button variant="secondary" glow>
            Secondary
          </Button>
          <Button variant="outline" glow>
            Outline
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <Button variant="ghost" glow>
            Ghost
          </Button>
          <Button variant="link" glow>
            Link
          </Button>
          <Button variant="destructive" glow>
            Destructive
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 text-white">
          Custom Glow Effects
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <Button
            variant="primary"
            glow={{
              mode: "rotate",
              colors: ["#3b82f6", "#8b5cf6", "#ec4899", "#ef4444"],
              blur: "soft",
              scale: 0.95,
            }}
          >
            Rainbow Rotate
          </Button>
          <Button
            variant="secondary"
            glow={{
              mode: "breathe",
              colors: ["#10b981", "#059669", "#047857"],
              blur: "soft",
              duration: 2,
            }}
          >
            Green Breathe
          </Button>
          <Button
            variant="outline"
            glow={{
              mode: "pulse",
              colors: ["#f97316", "#ea580c", "#c2410c"],
              blur: "soft",
              scale: 0.95,
            }}
          >
            Orange Pulse
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 text-white">
          CVS Theme with Glow
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <Button theme="cvs" variant="primary" glow>
            CVS Primary
          </Button>
          <Button theme="cvs" variant="outline" glow>
            CVS Outline
          </Button>
          <Button
            theme="cvs"
            variant="primary"
            glow={{
              mode: "colorShift",
              blur: "soft",
              scale: 0.95,
            }}
          >
            Custom CVS Glow
          </Button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3 text-white">
          Header Style Example
        </h3>
        <div className="flex justify-center gap-4 p-6 bg-zinc-900 rounded-lg">
          <Button
            variant="primary"
            size="sm"
            glow={{
              mode: "colorShift",
              blur: "soft",
              scale: 0.95,
              colors: ["#3b82f6", "#8b5cf6", "#ec4899", "#ef4444"],
            }}
          >
            Dashboard
          </Button>
          <Button
            variant="outline"
            size="sm"
            glow={{
              mode: "colorShift",
              blur: "soft",
              scale: 0.95,
              colors: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"],
            }}
          >
            Analytics
          </Button>
          <Button
            variant="secondary"
            size="sm"
            glow={{
              mode: "pulse",
              blur: "soft",
              scale: 0.95,
              colors: ["#9ca3af", "#6b7280", "#4b5563"],
            }}
          >
            Reports
          </Button>
        </div>
      </div>
    </div>
  ),
};

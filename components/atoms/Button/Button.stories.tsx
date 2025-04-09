import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./";

/**
 * Button component with various styles and variants.
 * Includes standard variants, sizes, states, and special branding options.
 */

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Kigo UI/Atoms/Button",
  parameters: {
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
      description: "The visual style variant of the button",
      control: "select",
      options: [
        "primary",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      description: "The size of the button",
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
    state: {
      description: "The state of the button",
      control: "select",
      options: ["default", "active", "selected"],
    },
    theme: {
      description: "The visual theme for this button",
      control: "select",
      options: ["kigo", "cvs"],
    },
    disabled: {
      description: "Whether the button is disabled",
      control: "boolean",
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

// ======= BASIC VARIANTS =======
export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

export const Destructive: Story = {
  args: {
    children: "Delete",
    variant: "destructive",
  },
};

export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "outline",
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
  },
};

export const Link: Story = {
  args: {
    children: "Link Button",
    variant: "link",
  },
};

// ======= THEMED VARIANTS =======
export const PrimaryKigo: Story = {
  args: {
    children: "Primary Kigo Button",
    variant: "primary",
    theme: "kigo",
  },
};

export const PrimaryCVS: Story = {
  args: {
    children: "Primary CVS Button",
    variant: "primary",
    theme: "cvs",
  },
};

export const SecondaryKigo: Story = {
  args: {
    children: "Secondary Kigo Button",
    variant: "secondary",
    theme: "kigo",
  },
};

export const SecondaryCVS: Story = {
  args: {
    children: "Secondary CVS Button",
    variant: "secondary",
    theme: "cvs",
  },
};

export const OutlineKigo: Story = {
  args: {
    children: "Outline Kigo Button",
    variant: "outline",
    theme: "kigo",
  },
};

export const OutlineCVS: Story = {
  args: {
    children: "Outline CVS Button",
    variant: "outline",
    theme: "cvs",
  },
};

export const GhostKigo: Story = {
  args: {
    children: "Ghost Kigo Button",
    variant: "ghost",
    theme: "kigo",
  },
};

export const GhostCVS: Story = {
  args: {
    children: "Ghost CVS Button",
    variant: "ghost",
    theme: "cvs",
  },
};

export const LinkKigo: Story = {
  args: {
    children: "Link Kigo Button",
    variant: "link",
    theme: "kigo",
  },
};

export const LinkCVS: Story = {
  args: {
    children: "Link CVS Button",
    variant: "link",
    theme: "cvs",
  },
};

// ======= SIZE VARIANTS =======
export const Small: Story = {
  args: {
    children: "Small Button",
    size: "sm",
  },
};

export const Default: Story = {
  args: {
    children: "Default Size Button",
    size: "default",
  },
};

export const Large: Story = {
  args: {
    children: "Large Button",
    size: "lg",
  },
};

// ======= STATE VARIANTS =======
export const Active: Story = {
  args: {
    children: "Active Button",
    variant: "primary",
    state: "active",
  },
};

export const Selected: Story = {
  args: {
    children: "Selected Button",
    variant: "primary",
    state: "selected",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};

// ======= WITH ICONS =======
export const WithIcon: Story = {
  args: {
    children: "Button with Icon",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14"></path>
        <path d="M12 5l7 7-7 7"></path>
      </svg>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12h14"></path>
        <path d="M12 5l7 7-7 7"></path>
      </svg>
    ),
    size: "icon",
    "aria-label": "Next",
  },
};

// ======= COMPOUND VARIANTS =======
export const OutlineActiveKigo: Story = {
  args: {
    children: "Kigo Active Outline",
    variant: "outline",
    state: "active",
    theme: "kigo",
  },
};

export const OutlineActive: Story = {
  args: {
    children: "Active Outline",
    variant: "outline",
    state: "active",
  },
};

export const OutlineSelectedKigo: Story = {
  args: {
    children: "Kigo Selected Outline",
    variant: "outline",
    state: "selected",
    theme: "kigo",
  },
};

export const OutlineSelected: Story = {
  args: {
    children: "Selected Outline",
    variant: "outline",
    state: "selected",
  },
};

export const OutlineActiveCVS: Story = {
  args: {
    children: "CVS Active Outline",
    variant: "outline",
    state: "active",
    theme: "cvs",
  },
};

export const OutlineSelectedCVS: Story = {
  args: {
    children: "CVS Selected Outline",
    variant: "outline",
    state: "selected",
    theme: "cvs",
  },
};

// ======= FUNCTION EXAMPLES =======
export const AsLink: Story = {
  args: {
    children: "Link Example",
    variant: "primary",
    href: "#",
  },
};

export const CVSLinkButton: Story = {
  args: {
    children: "CVS Branded Link",
    variant: "primary",
    theme: "cvs",
    href: "#",
  },
};

export const KigoLinkButton: Story = {
  args: {
    children: "Kigo Branded Link",
    variant: "primary",
    theme: "kigo",
    href: "#",
  },
};

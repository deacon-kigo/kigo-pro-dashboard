import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './';

/**
 * Button component with various styles and variants.
 * Includes standard variants, sizes, states, and special branding options.
 */

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Atoms/Button',
  parameters: {
    docs: {
      description: {
        component: 'Button component with various styles and variants. Supports theming and co-branding through a declarative API.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'The visual style variant of the button',
      control: 'select',
      options: [
        'primary',
        'destructive', 
        'outline',
        'secondary',
        'ghost',
        'link',
      ],
    },
    size: {
      description: 'The size of the button',
      control: 'select',
      options: ['default', 'sm', 'md', 'lg', 'xl', 'icon'],
    },
    state: {
      description: 'The state of the button',
      control: 'select',
      options: ['default', 'active', 'selected'],
    },
    branded: {
      description: 'The branding mode for this button',
      control: 'select',
      options: ['default', 'cvs'],
    },
    disabled: {
      description: 'Whether the button is disabled',
      control: 'boolean',
    },
    className: {
      description: 'Additional CSS classes to apply',
      control: 'text',
    },
    children: {
      description: 'Button content',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ======= BASIC VARIANTS =======
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Delete',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
  },
};

export const Link: Story = {
  args: {
    children: 'Link Button',
    variant: 'link',
  },
};

// ======= CO-BRANDED VARIANTS =======
export const PrimaryCVS: Story = {
  args: {
    children: 'Primary CVS Button',
    variant: 'primary',
    branded: 'cvs',
  },
};

export const SecondaryCVS: Story = {
  args: {
    children: 'Secondary CVS Button',
    variant: 'secondary',
    branded: 'cvs', 
  },
};

export const OutlineCVS: Story = {
  args: {
    children: 'Outline CVS Button',
    variant: 'outline',
    branded: 'cvs',
  },
};

export const GhostCVS: Story = {
  args: {
    children: 'Ghost CVS Button',
    variant: 'ghost',
    branded: 'cvs',
  },
};

export const LinkCVS: Story = {
  args: {
    children: 'Link CVS Button',
    variant: 'link',
    branded: 'cvs',
  },
};

// ======= SIZE VARIANTS =======
export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    children: 'Extra Large Button',
    size: 'xl',
  },
};

// ======= STATE VARIANTS =======
export const Active: Story = {
  args: {
    children: 'Active Button',
    variant: 'primary',
    state: 'active',
  },
};

export const Selected: Story = {
  args: {
    children: 'Selected Button',
    variant: 'primary',
    state: 'selected',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

// ======= WITH ICONS =======
export const WithIcon: Story = {
  args: {
    children: 'Button with Icon',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14"></path>
        <path d="M12 5l7 7-7 7"></path>
      </svg>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14"></path>
        <path d="M12 5l7 7-7 7"></path>
      </svg>
    ),
    size: 'icon',
    'aria-label': 'Next'
  },
};

// ======= COMPOUND VARIANTS =======
export const OutlineActive: Story = {
  args: {
    children: 'Active Outline',
    variant: 'outline',
    state: 'active'
  },
};

export const OutlineSelected: Story = {
  args: {
    children: 'Selected Outline',
    variant: 'outline',
    state: 'selected'
  },
};

export const OutlineActiveCVS: Story = {
  args: {
    children: 'CVS Active Outline',
    variant: 'outline',
    state: 'active',
    branded: 'cvs'
  },
};

export const OutlineSelectedCVS: Story = {
  args: {
    children: 'CVS Selected Outline',
    variant: 'outline',
    state: 'selected',
    branded: 'cvs'
  },
};

// ======= FUNCTION EXAMPLES =======
export const AsLink: Story = {
  args: {
    children: 'Link Example',
    variant: 'primary',
    href: '#',
  },
};

export const BrandedLink: Story = {
  args: {
    children: 'CVS Branded Link',
    variant: 'primary',
    branded: 'cvs',
    href: '#',
  },
};


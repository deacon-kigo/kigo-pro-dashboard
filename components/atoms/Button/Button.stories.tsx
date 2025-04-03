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
        component: 'Button component with various styles and variants. Used throughout the application for user interactions.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'The visual style variant of the button',
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'gradient',
        'cvs-gradient',
        'cvs-outline'
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

// Basic variants
export const Default: Story = {
  args: {
    children: 'Default Button',
    variant: 'default',
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

export const Gradient: Story = {
  args: {
    children: 'Gradient Button',
    variant: 'gradient',
  },
};

export const CVSGradient: Story = {
  args: {
    children: 'CVS Co-branded',
    variant: 'cvs-gradient',
  },
};

export const CVSOutline: Story = {
  args: {
    children: 'CVS Outline',
    variant: 'cvs-outline',
  },
};

// Size variants
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

// State variants
export const Active: Story = {
  args: {
    children: 'Active Button',
    state: 'active',
  },
};

export const Selected: Story = {
  args: {
    children: 'Selected Button',
    state: 'selected',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};

// Example of a story with an icon
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

// Compound states and variants
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

export const CVSOutlineActive: Story = {
  args: {
    children: 'Active CVS Outline',
    variant: 'cvs-outline',
    state: 'active'
  },
};

export const CVSOutlineSelected: Story = {
  args: {
    children: 'Selected CVS Outline',
    variant: 'cvs-outline',
    state: 'selected'
  },
};


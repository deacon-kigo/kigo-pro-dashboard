import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './';

/**
 * Badge component with various styles and variants.
 * Used to highlight information or status.
 */

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: 'Kigo UI/Atoms/Badge',
  parameters: {
    docs: {
      description: {
        component: 'Badge component for displaying statuses, labels, or counts. Supports multiple variants for different semantic meanings.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      description: 'The visual style variant of the badge',
      control: 'select',
      options: [
        'default',
        'secondary', 
        'destructive',
        'outline',
        'success',
        'warning',
        'info',
      ],
    },
    className: {
      description: 'Additional CSS classes to apply',
      control: 'text',
    },
    children: {
      description: 'Badge content',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// ======= BASIC VARIANTS =======
export const Default: Story = {
  args: {
    children: 'Default Badge',
    variant: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Badge',
    variant: 'secondary',
  },
};

export const Destructive: Story = {
  args: {
    children: 'Destructive Badge',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: 'Outline Badge',
    variant: 'outline',
  },
};

export const Success: Story = {
  args: {
    children: 'Success Badge',
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning Badge',
    variant: 'warning',
  },
};

export const Info: Story = {
  args: {
    children: 'Info Badge',
    variant: 'info',
  },
};

// ======= EXAMPLES WITH CUSTOM CONTENT =======
export const WithNumber: Story = {
  args: {
    children: '5',
    variant: 'default',
  },
};

export const WithIcon: Story = {
  render: () => (
    <Badge variant="success" className="gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Verified
    </Badge>
  ),
};

export const LongText: Story = {
  args: {
    children: 'This is a badge with longer text content',
    variant: 'info',
  },
}; 
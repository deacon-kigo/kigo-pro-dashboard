import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Kigo UI/Atoms/KigoButton',
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
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      description: 'The size of the button',
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      description: 'Whether the button is disabled',
      control: 'boolean',
    },
    children: {
      description: 'Button content',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

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

export const Small: Story = {
  args: {
    children: 'Small Button',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    size: 'lg',
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
}; 
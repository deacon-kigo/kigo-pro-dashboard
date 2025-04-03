import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'Kigo UI/Atoms/Input',
  parameters: {
    docs: {
      description: {
        component: 'Input component for user text entry. Used throughout the application for forms and search fields.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      description: 'The type of input',
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
      defaultValue: 'text',
    },
    placeholder: {
      description: 'Placeholder text',
      control: 'text',
    },
    disabled: {
      description: 'Whether the input is disabled',
      control: 'boolean',
    },
    required: {
      description: 'Whether the input is required',
      control: 'boolean',
    },
    className: {
      description: 'Additional CSS classes to apply',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
    type: 'text',
  },
};

export const Email: Story = {
  args: {
    placeholder: 'Enter email address',
    type: 'email',
  },
};

export const Password: Story = {
  args: {
    placeholder: 'Enter password',
    type: 'password',
  },
};

export const Search: Story = {
  args: {
    placeholder: 'Search...',
    type: 'search',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    placeholder: 'Required input',
    required: true,
  },
};


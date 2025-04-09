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
    variant: {
      description: 'The style variant of the input',
      control: 'select',
      options: ['default', 'error'],
      defaultValue: 'default',
    },
    inputSize: {
      description: 'The size of the input',
      control: 'select',
      options: ['default', 'sm', 'lg'],
      defaultValue: 'default',
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

export const Error: Story = {
  args: {
    placeholder: 'Error input',
    variant: 'error',
    defaultValue: 'Invalid input',
  },
};

export const Small: Story = {
  args: {
    placeholder: 'Small input',
    inputSize: 'sm',
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large input',
    inputSize: 'lg',
  },
};


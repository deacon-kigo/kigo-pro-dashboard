import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './';

const meta: Meta<typeof Input> = {
  component: Input,
  title: 'Atoms/Input',
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};


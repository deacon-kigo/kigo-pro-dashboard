import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './';

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Atoms/Button',
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
  },
};


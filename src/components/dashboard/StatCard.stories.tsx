import type { Meta, StoryObj } from '@storybook/react';
import StatCard from './StatCard';
import { 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  RocketLaunchIcon,
  BoltIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const meta: Meta<typeof StatCard> = {
  component: StatCard,
  title: 'Dashboard/StatCard',
  parameters: {
    docs: {
      description: {
        component: 'A card component for displaying statistics with an icon, title, value and optional change indicator.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    value: { control: 'text' },
    change: { control: 'number' },
    iconBg: { control: 'text' },
    iconColor: { control: 'text' },
    icon: { control: 'object' },
  }
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Revenue: Story = {
  args: {
    title: 'Total Revenue',
    value: '$42,389',
    change: 12.5,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    icon: <CurrencyDollarIcon className="w-6 h-6" />,
  },
};

export const Orders: Story = {
  args: {
    title: 'New Orders',
    value: '526',
    change: 8.2,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    icon: <ShoppingCartIcon className="w-6 h-6" />,
  },
};

export const Customers: Story = {
  args: {
    title: 'Active Customers',
    value: '1,429',
    change: -3.1,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    icon: <UserGroupIcon className="w-6 h-6" />,
  },
};

export const ConversionRate: Story = {
  args: {
    title: 'Conversion Rate',
    value: '18.2%',
    change: 4.3,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    icon: <ChartBarIcon className="w-6 h-6" />,
  },
};

export const Campaigns: Story = {
  args: {
    title: 'Active Campaigns',
    value: '7',
    change: 16.7,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    icon: <RocketLaunchIcon className="w-6 h-6" />,
  },
};

export const Performance: Story = {
  args: {
    title: 'Performance Score',
    value: '92.3%',
    change: 5.8,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    icon: <BoltIcon className="w-6 h-6" />,
  },
};

export const NoChangeIndicator: Story = {
  args: {
    title: 'Email Subscribers',
    value: '8,942',
    iconBg: 'bg-cyan-100',
    iconColor: 'text-cyan-600',
    icon: <EnvelopeIcon className="w-6 h-6" />,
  },
};

// Add a story to show the cards in a grid
export const StatCardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Revenue"
        value="$42,389"
        change={12.5}
        iconBg="bg-green-100"
        iconColor="text-green-600"
        icon={<CurrencyDollarIcon className="w-6 h-6" />}
      />
      <StatCard
        title="New Orders"
        value="526"
        change={8.2}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        icon={<ShoppingCartIcon className="w-6 h-6" />}
      />
      <StatCard
        title="Active Customers"
        value="1,429"
        change={-3.1}
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
        icon={<UserGroupIcon className="w-6 h-6" />}
      />
      <StatCard
        title="Conversion Rate"
        value="18.2%"
        change={4.3}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
        icon={<ChartBarIcon className="w-6 h-6" />}
      />
    </div>
  ),
}; 
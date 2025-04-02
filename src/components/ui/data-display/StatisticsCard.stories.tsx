import type { Meta, StoryObj } from '@storybook/react';
import StatisticsCard from './StatisticsCard';
import { 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ShoppingCartIcon, 
  ChartBarIcon,
  CursorArrowRaysIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const meta: Meta<typeof StatisticsCard> = {
  component: StatisticsCard,
  title: 'UI/Data Display/StatisticsCard',
  parameters: {
    docs: {
      description: {
        component: 'A statistics card component with integrated sparkline chart for dashboards.'
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    value: { control: 'text' },
    change: { control: 'number' },
    subtitle: { control: 'text' },
    color: {
      control: 'select',
      options: ['blue', 'green', 'red', 'purple', 'amber', 'indigo', 'cyan'],
    },
    data: { control: 'object' },
  }
};

export default meta;
type Story = StoryObj<typeof StatisticsCard>;

// Sample data for different trends
const upwardTrend = [12, 15, 18, 16, 19, 22, 25, 23, 28, 32];
const downwardTrend = [32, 28, 25, 27, 24, 20, 18, 15, 16, 12];
const volatileTrend = [20, 28, 15, 30, 18, 32, 24, 35, 22, 28];
const steadyTrend = [22, 23, 21, 24, 22, 25, 23, 24, 26, 25];
const growthTrend = [10, 12, 16, 20, 24, 28, 35, 38, 42, 48];
const declineTrend = [48, 42, 38, 35, 30, 28, 24, 20, 16, 14];

export const Revenue: Story = {
  args: {
    title: 'Total Revenue',
    value: '$12,346',
    change: 12.5,
    subtitle: 'Compared to last month',
    color: 'green',
    data: upwardTrend,
    icon: <CurrencyDollarIcon className="w-6 h-6" />,
  },
};

export const Users: Story = {
  args: {
    title: 'Active Users',
    value: '2,834',
    change: -3.8,
    subtitle: 'Last 30 days',
    color: 'blue',
    data: downwardTrend,
    icon: <UserGroupIcon className="w-6 h-6" />,
  },
};

export const Orders: Story = {
  args: {
    title: 'New Orders',
    value: '432',
    change: 8.2,
    subtitle: 'Last 7 days',
    color: 'purple',
    data: volatileTrend,
    icon: <ShoppingCartIcon className="w-6 h-6" />,
  },
};

export const Conversion: Story = {
  args: {
    title: 'Conversion Rate',
    value: '12.8%',
    change: 0.4,
    subtitle: 'Last 30 days',
    color: 'indigo',
    data: steadyTrend,
    icon: <ChartBarIcon className="w-6 h-6" />,
  },
};

export const Growth: Story = {
  args: {
    title: 'Visitor Growth',
    value: '48.2%',
    subtitle: 'Year over year',
    color: 'amber',
    data: growthTrend,
    icon: <CursorArrowRaysIcon className="w-6 h-6" />,
  },
};

export const AvgTime: Story = {
  args: {
    title: 'Avg. Session Time',
    value: '2:48',
    change: -5.3,
    subtitle: 'Decreased from last week',
    color: 'red',
    data: declineTrend,
    icon: <ClockIcon className="w-6 h-6" />,
  },
};

export const NoIcon: Story = {
  args: {
    title: 'Site Traffic',
    value: '14,282',
    change: 6.5,
    subtitle: 'Monthly visits',
    color: 'cyan',
    data: upwardTrend,
  },
};

export const StatisticsGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-4">
      <StatisticsCard
        title="Total Revenue"
        value="$12,346"
        change={12.5}
        subtitle="Compared to last month"
        color="green"
        data={upwardTrend}
        icon={<CurrencyDollarIcon className="w-6 h-6" />}
      />
      
      <StatisticsCard
        title="Active Users"
        value="2,834"
        change={-3.8}
        subtitle="Last 30 days"
        color="blue"
        data={downwardTrend}
        icon={<UserGroupIcon className="w-6 h-6" />}
      />
      
      <StatisticsCard
        title="New Orders"
        value="432"
        change={8.2}
        subtitle="Last 7 days"
        color="purple"
        data={volatileTrend}
        icon={<ShoppingCartIcon className="w-6 h-6" />}
      />
      
      <StatisticsCard
        title="Conversion Rate"
        value="12.8%"
        change={0.4}
        subtitle="Last 30 days"
        color="indigo"
        data={steadyTrend}
        icon={<ChartBarIcon className="w-6 h-6" />}
      />
      
      <StatisticsCard
        title="Visitor Growth"
        value="48.2%"
        subtitle="Year over year"
        color="amber"
        data={growthTrend}
        icon={<CursorArrowRaysIcon className="w-6 h-6" />}
      />
      
      <StatisticsCard
        title="Avg. Session Time"
        value="2:48"
        change={-5.3}
        subtitle="Decreased from last week"
        color="red"
        data={declineTrend}
        icon={<ClockIcon className="w-6 h-6" />}
      />
    </div>
  ),
}; 
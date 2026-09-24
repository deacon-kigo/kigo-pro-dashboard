import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from ".";

interface MockRow {
  email: string;
  id: string;
  name: string;
  status: string;
}

const mockData: MockRow[] = [
  { email: "john@example.com", id: "1", name: "John Doe", status: "Active" },
  {
    email: "jane@example.com",
    id: "2",
    name: "Jane Smith",
    status: "Inactive",
  },
  { email: "bob@example.com", id: "3", name: "Bob Johnson", status: "Active" },
  {
    email: "alice@example.com",
    id: "4",
    name: "Alice Brown",
    status: "Active",
  },
  {
    email: "charlie@example.com",
    id: "5",
    name: "Charlie Wilson",
    status: "Inactive",
  },
];

const columns: ColumnDef<MockRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "status",
    cell: ({ row }) => (
      <span
        className={
          row.original.status === "Active" ? "text-green-600" : "text-gray-400"
        }
      >
        {row.original.status}
      </span>
    ),
    header: "Status",
  },
];

const meta = {
  component: DataTable,
  decorators: [
    (Story) => (
      <div className="w-[700px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/merchants",
        searchParams: new URLSearchParams({ page: "1", pageSize: "10" }),
      },
    },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj;

export const Default: Story = {
  render: () => (
    <DataTable columns={columns} data={mockData} rowCount={mockData.length} />
  ),
};

export const WithoutPagination: Story = {
  render: () => (
    <DataTable columns={columns} data={mockData} withPagination={false} />
  ),
};

export const Empty: Story = {
  render: () => <DataTable columns={columns} data={[]} rowCount={0} />,
};

export const CustomEmptyMessage: Story = {
  render: () => (
    <DataTable
      columns={columns}
      data={[]}
      emptyMessage="No merchants found. Try adjusting your search."
      rowCount={0}
    />
  ),
};

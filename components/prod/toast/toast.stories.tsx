import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { toast } from "@/components/prod/hooks/use-toast";

import { ToastAction, Toaster } from ".";

const meta = {
  component: Toaster,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

// Wrapper component to render Toaster and provide trigger buttons
const ToastDemo = ({
  hasAction,
  hasDescription,
  variant,
}: {
  hasAction?: boolean;
  hasDescription?: boolean;
  variant: "default" | "destructive" | "success" | "warning";
}) => {
  const handleClick = () => {
    toast({
      ...(hasAction && {
        action: <ToastAction altText="Action">Action</ToastAction>,
      }),
      ...(hasDescription && {
        description: "This is the description of the toast.",
      }),
      title: "Notification Title",
      variant,
    });
  };

  return (
    <div>
      <button
        className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        onClick={handleClick}
        type="button"
      >
        Show Toast
      </button>
      <Toaster />
    </div>
  );
};

export const Default: Story = {
  render: () => <ToastDemo variant="default" />,
};

export const WithDescription: Story = {
  render: () => <ToastDemo hasDescription variant="default" />,
};

export const WithAction: Story = {
  render: () => <ToastDemo hasAction variant="default" />,
};

export const WithDescriptionAndAction: Story = {
  render: () => <ToastDemo hasAction hasDescription variant="default" />,
};

export const Destructive: Story = {
  render: () => <ToastDemo hasDescription variant="destructive" />,
};

export const DestructiveWithAction: Story = {
  render: () => <ToastDemo hasAction hasDescription variant="destructive" />,
};

export const Success: Story = {
  render: () => <ToastDemo hasDescription variant="success" />,
};

export const SuccessWithAction: Story = {
  render: () => <ToastDemo hasAction hasDescription variant="success" />,
};

export const Warning: Story = {
  render: () => <ToastDemo hasDescription variant="warning" />,
};

export const WarningWithAction: Story = {
  render: () => <ToastDemo hasAction hasDescription variant="warning" />,
};

export const MultipleToasts: Story = {
  render: () => {
    const handleShowMultipleToasts = () => {
      toast({
        description: "First notification",
        title: "Toast 1",
        variant: "default",
      });
      setTimeout(() => {
        toast({
          description: "Second notification",
          title: "Toast 2",
          variant: "success",
        });
      }, 500);
      setTimeout(() => {
        toast({
          description: "Third notification",
          title: "Toast 3",
          variant: "warning",
        });
      }, 1000);
    };

    return (
      <div>
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={handleShowMultipleToasts}
          type="button"
        >
          Show Multiple Toasts
        </button>
        <Toaster />
      </div>
    );
  },
};

export const CustomDuration: Story = {
  render: () => {
    const handleShowLongToast = () => {
      toast({
        description: "This toast will stay for 10 seconds",
        duration: 10000,
        title: "Long Duration Toast",
        variant: "default",
      });
    };

    return (
      <div>
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={handleShowLongToast}
          type="button"
        >
          Show Long Toast (10s)
        </button>
        <Toaster />
      </div>
    );
  },
};

export const AllVariants: Story = {
  render: () => {
    const handleShowAllVariants = () => {
      const variants: ("default" | "destructive" | "success" | "warning")[] = [
        "default",
        "destructive",
        "success",
        "warning",
      ];

      variants.forEach((variant, index) => {
        setTimeout(() => {
          toast({
            action: <ToastAction altText="Action">Action</ToastAction>,
            description: `This is a ${variant} toast notification`,
            title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
            variant,
          });
        }, index * 600);
      });
    };

    return (
      <div>
        <button
          className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={handleShowAllVariants}
          type="button"
        >
          Show All Variants
        </button>
        <Toaster />
      </div>
    );
  },
};

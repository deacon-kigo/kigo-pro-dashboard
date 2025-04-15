import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { InactivityProvider } from "./InactivityProvider";

// Mock content for the story
const DemoContent = () => (
  <div className="bg-white p-8 rounded-lg shadow max-w-3xl mx-auto my-8">
    <h1 className="text-2xl font-bold mb-4">Campaign Manager</h1>
    <p className="mb-4 text-gray-600">
      This is a demonstration of the auto sign-out feature. The system will
      detect inactivity and display a warning before signing you out.
    </p>

    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
      <h2 className="font-semibold text-blue-800 mb-2">For Demo Purposes:</h2>
      <ul className="list-disc list-inside text-blue-700 space-y-1">
        <li>
          Inactivity timeout: <span className="font-bold">20 seconds</span>
        </li>
        <li>
          Warning before timeout: <span className="font-bold">10 seconds</span>
        </li>
        <li>
          Total time before auto sign-out:{" "}
          <span className="font-bold">30 seconds</span>
        </li>
      </ul>
    </div>

    <p className="text-gray-700">
      Stop moving your mouse and wait to see the inactivity warning appear. You
      can then choose to stay signed in or sign out.
    </p>

    <div className="border-t border-gray-200 mt-8 pt-4">
      <h3 className="font-semibold mb-2">Test Actions:</h3>
      <button
        className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded mr-2"
        onClick={() => alert("Action performed!")}
      >
        Perform Action
      </button>
      <button
        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded"
        onClick={() => alert("This keeps your session active!")}
      >
        Keep Session Active
      </button>
    </div>
  </div>
);

const meta: Meta<typeof InactivityProvider> = {
  title: "Kigo UI/Features/Auth/InactivityProvider",
  component: InactivityProvider,
  parameters: {
    docs: {
      description: {
        component:
          "A component that detects user inactivity and shows a warning before automatically signing the user out.",
      },
    },
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof InactivityProvider>;

export const Default: Story = {
  args: {
    children: <DemoContent />,
    timeoutInMinutes: 0.33, // 20 seconds
    warningBeforeTimeoutInMinutes: 0.17, // 10 seconds
  },
  parameters: {
    docs: {
      description: {
        story:
          "The default InactivityProvider with 20 second inactivity timeout and 10 second warning.",
      },
    },
  },
};

export const LongTimeout: Story = {
  args: {
    children: <DemoContent />,
    timeoutInMinutes: 1, // 1 minute
    warningBeforeTimeoutInMinutes: 0.25, // 15 seconds
  },
  parameters: {
    docs: {
      description: {
        story:
          "InactivityProvider with 1 minute inactivity timeout and 15 second warning.",
      },
    },
  },
};

export const ShortTimeout: Story = {
  args: {
    children: <DemoContent />,
    timeoutInMinutes: 0.17, // 10 seconds
    warningBeforeTimeoutInMinutes: 0.08, // 5 seconds
  },
  parameters: {
    docs: {
      description: {
        story:
          "InactivityProvider with 10 second inactivity timeout and 5 second warning for quick testing.",
      },
    },
  },
};

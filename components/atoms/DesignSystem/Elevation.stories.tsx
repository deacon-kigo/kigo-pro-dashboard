import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

/**
 * Elevation and shadow documentation for the Kigo Design System
 */

// Dummy component for Storybook
const ElevationSystem = () => <div></div>;

const meta: Meta<typeof ElevationSystem> = {
  title: "Applications/Kigo Pro/Design System/Elevation",
  parameters: {
    docs: {
      description: {
        component: "Elevation and shadow system for the Kigo design system.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ElevationSystem>;

// Helper component to display shadow examples
interface ShadowExampleProps {
  name: string;
  description: string;
  className: string;
  shadowClass: string;
  usageExamples: string[];
}

const ShadowExample = ({
  name,
  description,
  className,
  shadowClass,
  usageExamples,
}: ShadowExampleProps) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-2">{name}</h3>
    <p className="text-sm text-text-muted mb-4">{description}</p>

    <div className="flex flex-wrap gap-8">
      <div
        className={`w-32 h-32 bg-white rounded-lg ${shadowClass} flex items-center justify-center ${className}`}
      >
        <span className="font-mono text-xs">{shadowClass}</span>
      </div>

      <div className="flex-1">
        <div className="mb-2 text-xs font-medium uppercase text-text-muted tracking-wider">
          Use Cases
        </div>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {usageExamples.map((example, index) => (
            <li key={index}>{example}</li>
          ))}
        </ul>

        <div className="mt-4 bg-gray-50 p-3 rounded-md">
          <pre className="text-xs font-mono">className="{shadowClass}"</pre>
        </div>
      </div>
    </div>
  </div>
);

export const ElevationGuidelines: Story = {
  render: () => (
    <div className="p-6 max-w-4xl">
      <h2 className="text-2xl font-bold mb-2">Elevation System</h2>
      <p className="text-gray-600 mb-6">
        Kigo's elevation system uses shadows to express hierarchy, depth, and
        focus within the interface. Shadows help users understand which elements
        are interactive and which are at the forefront of the experience.
      </p>

      <div className="mb-10">
        <h3 className="text-lg font-bold mb-4">Principles</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-lg border border-gray-100">
            <h4 className="font-semibold mb-2 text-primary">Intentional</h4>
            <p className="text-sm">
              Use elevation purposefully to guide the user's attention and
              create meaningful hierarchy.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-100">
            <h4 className="font-semibold mb-2 text-primary">Consistent</h4>
            <p className="text-sm">
              Apply elevation consistently across products to establish
              predictable patterns.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-gray-100">
            <h4 className="font-semibold mb-2 text-primary">Subtle</h4>
            <p className="text-sm">
              Elevation should enhance without overwhelming the user interface.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-lg font-bold mb-6">Shadow Scale</h3>

          <ShadowExample
            name="Shadow XS (Extra Small)"
            description="Subtle elevation for low-emphasis elements."
            className="border border-gray-50"
            shadowClass="shadow-sm"
            usageExamples={[
              "Buttons in their default state",
              "Input fields and form controls",
              "Subtle card borders",
            ]}
          />

          <ShadowExample
            name="Shadow SM (Small)"
            description="Light elevation for interactive elements."
            className=""
            shadowClass="shadow"
            usageExamples={[
              "Cards and containers",
              "Dropdown menus",
              "Tabs and navigation",
            ]}
          />

          <ShadowExample
            name="Shadow MD (Medium)"
            description="Medium elevation for prominent UI elements."
            className=""
            shadowClass="shadow-md"
            usageExamples={[
              "Floating action buttons",
              "Highlighted cards",
              "Active navigation elements",
            ]}
          />

          <ShadowExample
            name="Shadow LG (Large)"
            description="Higher elevation for featured content."
            className=""
            shadowClass="shadow-lg"
            usageExamples={[
              "Modals and dialogs",
              "Popovers",
              "Feature highlights",
            ]}
          />

          <ShadowExample
            name="Shadow XL (Extra Large)"
            description="Maximum elevation for elements that demand immediate attention."
            className=""
            shadowClass="shadow-xl"
            usageExamples={[
              "Critical notifications",
              "Onboarding spotlights",
              "Elevated dialogs",
            ]}
          />

          <ShadowExample
            name="Shadow 2XL (2x Extra Large)"
            description="Reserved for the highest-priority elements in the interface."
            className=""
            shadowClass="shadow-2xl"
            usageExamples={[
              "Full-screen modals",
              "System alerts",
              "Confirmation dialogs for destructive actions",
            ]}
          />
        </div>

        <div className="mb-12">
          <h3 className="text-lg font-bold mb-4">Interactive States</h3>
          <p className="text-sm text-text-muted mb-6">
            Shadows can be used to communicate interactive states, such as hover
            or active states.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="h-32 bg-white rounded-lg shadow transition-shadow duration-300 hover:shadow-md flex items-center justify-center mb-2">
                Hover Me
              </div>
              <p className="text-xs text-center text-text-muted">
                Default → Hover
                <br />
                <span className="font-mono">shadow → shadow-md</span>
              </p>
            </div>

            <div>
              <div className="h-32 bg-white rounded-lg shadow-md active:shadow flex items-center justify-center mb-2 cursor-pointer">
                Click Me
              </div>
              <p className="text-xs text-center text-text-muted">
                Default → Active
                <br />
                <span className="font-mono">shadow-md → shadow</span>
              </p>
            </div>

            <div>
              <div className="h-32 bg-white rounded-lg shadow-sm focus:shadow-md flex items-center justify-center mb-2">
                <button className="focus:outline-none w-full h-full">
                  Focus Me
                </button>
              </div>
              <p className="text-xs text-center text-text-muted">
                Default → Focus
                <br />
                <span className="font-mono">shadow-sm → shadow-md</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold mb-4">Elevation in Context</h3>
          <p className="text-sm text-text-muted mb-6">
            Example of how different elevation levels work together in an
            interface.
          </p>

          <div className="bg-gray-50 p-8 rounded-lg">
            <div className="shadow-sm bg-white p-4 rounded-lg mb-6">
              <h4 className="font-semibold mb-2">Page Header (shadow-sm)</h4>
              <p className="text-sm">Page title and navigation elements</p>
            </div>

            <div className="shadow bg-white p-4 rounded-lg mb-6">
              <h4 className="font-semibold mb-2">Content Card (shadow)</h4>
              <p className="text-sm mb-4">
                Main content area with standard elevation
              </p>

              <div className="shadow-md bg-white p-3 rounded-lg mb-3 border-l-4 border-primary">
                <p className="text-sm font-medium">
                  Important Notice (shadow-md)
                </p>
                <p className="text-xs text-text-muted">
                  Highlighted information with increased elevation
                </p>
              </div>

              <div className="flex gap-2 mt-4 justify-end">
                <button className="px-3 py-1 rounded bg-gray-100 text-sm shadow-sm hover:shadow transition-shadow">
                  Cancel
                </button>
                <button className="px-3 py-1 rounded bg-primary text-white text-sm shadow hover:shadow-md transition-shadow">
                  Submit
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="shadow-lg bg-white p-4 rounded-lg w-80 absolute right-0 z-10">
                <h4 className="font-semibold mb-2">Notification (shadow-lg)</h4>
                <p className="text-sm">
                  Higher elevation for overlaid UI elements
                </p>
                <button className="text-xs text-primary mt-2">Dismiss</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold mb-4">
            Accessibility Considerations
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">Contrast</h4>
              <p className="text-sm">
                Ensure there is sufficient contrast between elements with
                different elevations. Use color in addition to shadows to
                reinforce hierarchy for users with low vision.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">Focus States</h4>
              <p className="text-sm">
                Use elevation changes in combination with color to make focus
                states clear and visible. Don't rely solely on shadows to
                indicate focus.
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold mb-2">Motion Sensitivity</h4>
              <p className="text-sm">
                Be mindful of users with motion sensitivity when animating
                shadow transitions. Keep animations subtle and respect user
                preferences for reduced motion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

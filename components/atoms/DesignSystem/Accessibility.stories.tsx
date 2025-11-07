import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

/**
 * Accessibility documentation for the Kigo Design System
 */

// Dummy component for Storybook
const AccessibilityGuidelines = () => <div></div>;

const meta: Meta<typeof AccessibilityGuidelines> = {
  title: "Applications/Kigo Pro/Design System/Accessibility",
  parameters: {
    docs: {
      description: {
        component: "Accessibility guidelines for the Kigo design system.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AccessibilityGuidelines>;

// Helper components
const GuidelineSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold mb-4 pb-2 border-b border-gray-200">
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const Guideline = ({
  title,
  description,
  example,
  goodExample,
  badExample,
}: {
  title: string;
  description: string;
  example?: React.ReactNode;
  goodExample?: React.ReactNode;
  badExample?: React.ReactNode;
}) => (
  <div className="mb-8">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-text-dark mb-4">{description}</p>

    {example && (
      <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
        <p className="text-sm font-medium mb-2 text-text-muted">Example:</p>
        {example}
      </div>
    )}

    {(goodExample || badExample) && (
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {goodExample && (
          <div className="bg-pastel-green bg-opacity-20 border border-green-100 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green mr-2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <p className="text-sm font-medium text-green">Good Example</p>
            </div>
            {goodExample}
          </div>
        )}

        {badExample && (
          <div className="bg-pastel-red bg-opacity-20 border border-red-100 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-red mr-2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <p className="text-sm font-medium text-red">Bad Example</p>
            </div>
            {badExample}
          </div>
        )}
      </div>
    )}
  </div>
);

export const Guidelines: Story = {
  render: () => (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Accessibility Guidelines</h1>
        <p className="text-text-muted">
          Our accessibility guidelines ensure that Kigo products are usable by
          everyone. We follow WCAG 2.1 AA standards in our design and
          implementation.
        </p>
      </div>

      <GuidelineSection title="Color & Contrast">
        <Guideline
          title="Text Contrast"
          description="Text should have a contrast ratio of at least 4.5:1 against its background for normal text, and 3:1 for large text (18pt or 14pt bold)."
          goodExample={
            <div>
              <p className="text-text-dark bg-white p-3 mb-2 rounded">
                This text has sufficient contrast (Dark text on white background
                - ratio: 12:1)
              </p>
              <p className="bg-primary text-white p-3 rounded">
                This text has sufficient contrast (White text on primary blue -
                ratio: 4.6:1)
              </p>
            </div>
          }
          badExample={
            <div>
              <p className="text-gray-400 bg-white p-3 mb-2 rounded">
                This text has poor contrast (Light gray on white - ratio: 2.5:1)
              </p>
              <p className="bg-pastel-blue text-blue-300 p-3 rounded">
                This text has poor contrast (Light blue on pastel blue - ratio:
                1.8:1)
              </p>
            </div>
          }
        />

        <Guideline
          title="Non-Text Contrast"
          description="UI components and graphical objects should have a contrast ratio of at least 3:1 against adjacent colors."
          goodExample={
            <div className="flex gap-4">
              <button className="bg-primary text-white px-4 py-2 rounded-lg">
                Primary Button
              </button>
              <button className="bg-white border-2 border-primary text-primary px-4 py-2 rounded-lg">
                Outline Button
              </button>
            </div>
          }
          badExample={
            <div className="flex gap-4">
              <button className="bg-pastel-blue text-blue-300 px-4 py-2 rounded-lg">
                Low Contrast Button
              </button>
              <button className="bg-white border border-gray-200 text-gray-300 px-4 py-2 rounded-lg">
                Low Contrast Outline
              </button>
            </div>
          }
        />

        <Guideline
          title="Don't Use Color Alone"
          description="Never use color as the only means of conveying information. Always include text labels, patterns, or icons."
          goodExample={
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <span className="inline-block w-4 h-4 rounded-full bg-green mr-2"></span>
                <span>Success</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-4 h-4 rounded-full bg-red mr-2"></span>
                <span>Error</span>
              </div>
            </div>
          }
          badExample={
            <div className="flex gap-4">
              <span className="inline-block w-4 h-4 rounded-full bg-green"></span>
              <span className="inline-block w-4 h-4 rounded-full bg-red"></span>
              <span className="inline-block w-4 h-4 rounded-full bg-blue"></span>
            </div>
          }
        />
      </GuidelineSection>

      <GuidelineSection title="Keyboard Navigation">
        <Guideline
          title="Focus Indicators"
          description="Ensure all interactive elements have a visible focus state with sufficient contrast."
          goodExample={
            <div className="flex flex-col gap-3">
              <button className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-primary text-white px-4 py-2 rounded">
                Button with visible focus ring
              </button>
              <a
                href="#"
                className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-primary underline"
              >
                Link with visible focus ring
              </a>
            </div>
          }
          badExample={
            <div className="flex flex-col gap-3">
              <button className="focus:outline-none bg-primary text-white px-4 py-2 rounded">
                Button with no focus indicator
              </button>
              <a href="#" className="focus:outline-none text-primary">
                Link with no focus indicator
              </a>
            </div>
          }
        />

        <Guideline
          title="Logical Tab Order"
          description="The tab order should match the visual layout of the page and follow a logical sequence."
        />

        <Guideline
          title="Keyboard Shortcuts"
          description="Provide keyboard shortcuts for frequent actions, but ensure they don't conflict with assistive technology shortcuts."
        />
      </GuidelineSection>

      <GuidelineSection title="Form Elements">
        <Guideline
          title="Labels"
          description="All form controls should have visible labels that are properly associated with the input."
          goodExample={
            <div className="mb-4">
              <label
                htmlFor="example-input"
                className="block text-sm font-medium mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="example-input"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                placeholder="user@example.com"
              />
            </div>
          }
          badExample={
            <div className="mb-4">
              <input
                type="email"
                className="border border-gray-300 rounded-md px-3 py-2 w-full"
                placeholder="Email Address"
              />
            </div>
          }
        />

        <Guideline
          title="Error Messages"
          description="Form error messages should be clear and provide specific guidance on how to fix the issue."
          goodExample={
            <div className="mb-4">
              <label
                htmlFor="password-good"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password-good"
                className="border border-red-300 rounded-md px-3 py-2 w-full"
                aria-describedby="password-error-good"
              />
              <p id="password-error-good" className="mt-2 text-red text-sm">
                Password must be at least 8 characters and include at least one
                number and one special character.
              </p>
            </div>
          }
          badExample={
            <div className="mb-4">
              <label
                htmlFor="password-bad"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password-bad"
                className="border border-red-300 rounded-md px-3 py-2 w-full"
              />
              <p className="mt-2 text-red text-sm">Invalid input.</p>
            </div>
          }
        />
      </GuidelineSection>

      <GuidelineSection title="Semantic HTML">
        <Guideline
          title="Headings"
          description="Use heading elements (h1-h6) to create a logical outline of the page and don't skip heading levels."
          goodExample={
            <div>
              <h2 className="text-xl font-bold">Product Features</h2>
              <h3 className="text-lg font-semibold mt-2">Feature One</h3>
              <p className="mt-1">Description of feature one.</p>
              <h3 className="text-lg font-semibold mt-2">Feature Two</h3>
              <p className="mt-1">Description of feature two.</p>
            </div>
          }
          badExample={
            <div>
              <div className="text-xl font-bold">Product Features</div>
              <div className="text-lg font-semibold mt-2">Feature One</div>
              <p className="mt-1">Description of feature one.</p>
              <div className="text-lg font-semibold mt-2">Feature Two</div>
              <p className="mt-1">Description of feature two.</p>
            </div>
          }
        />

        <Guideline
          title="Landmarks"
          description="Use HTML5 landmark elements (header, nav, main, footer) to define the structure of the page."
          goodExample={
            <div className="border border-gray-200 rounded p-2 text-sm">
              <code>
                &lt;header&gt;...&lt;/header&gt;
                <br />
                &lt;nav&gt;...&lt;/nav&gt;
                <br />
                &lt;main&gt;
                <br />
                &nbsp;&nbsp;&lt;section&gt;...&lt;/section&gt;
                <br />
                &nbsp;&nbsp;&lt;section&gt;...&lt;/section&gt;
                <br />
                &lt;/main&gt;
                <br />
                &lt;footer&gt;...&lt;/footer&gt;
              </code>
            </div>
          }
          badExample={
            <div className="border border-gray-200 rounded p-2 text-sm">
              <code>
                &lt;div class="header"&gt;...&lt;/div&gt;
                <br />
                &lt;div class="nav"&gt;...&lt;/div&gt;
                <br />
                &lt;div class="main"&gt;
                <br />
                &nbsp;&nbsp;&lt;div class="section"&gt;...&lt;/div&gt;
                <br />
                &nbsp;&nbsp;&lt;div class="section"&gt;...&lt;/div&gt;
                <br />
                &lt;/div&gt;
                <br />
                &lt;div class="footer"&gt;...&lt;/div&gt;
              </code>
            </div>
          }
        />
      </GuidelineSection>

      <GuidelineSection title="Images & Media">
        <Guideline
          title="Alternative Text"
          description="Provide descriptive alt text for all images that convey meaning. Decorative images should have empty alt attributes (alt='')."
          goodExample={
            <div className="border border-gray-200 rounded p-2 text-sm">
              <code>
                &lt;img src="chart-sales-data.png" alt="Bar chart showing
                monthly sales data from January to December 2023, with peak
                sales in November." /&gt;
              </code>
            </div>
          }
          badExample={
            <div className="border border-gray-200 rounded p-2 text-sm">
              <code>
                &lt;img src="chart.png" alt="Chart" /&gt;
                <br />
                &lt;img src="logo.png" /&gt; &lt;!-- Missing alt attribute
                --&gt;
              </code>
            </div>
          }
        />

        <Guideline
          title="Captions & Transcripts"
          description="Provide captions for videos and transcripts for audio content."
        />
      </GuidelineSection>

      <GuidelineSection title="Interactive Components">
        <Guideline
          title="ARIA Attributes"
          description="Use ARIA attributes when necessary to enhance accessibility, but prefer native HTML elements when possible."
          goodExample={
            <div className="border border-gray-200 rounded p-2 text-sm">
              <code>
                &lt;button aria-expanded="false" aria-controls="dropdown-menu"
                &gt; Menu &lt;/button&gt;
                <br />
                &lt;div id="dropdown-menu" hidden&gt;...&lt;/div&gt;
              </code>
            </div>
          }
        />

        <Guideline
          title="Custom Components"
          description="Ensure custom components like tabs, accordions, and modals follow WAI-ARIA Authoring Practices."
        />
      </GuidelineSection>

      <GuidelineSection title="Responsive Design">
        <Guideline
          title="Text Resize"
          description="Ensure the UI can handle text resizing up to 200% without loss of content or functionality."
        />

        <Guideline
          title="Touch Targets"
          description="Touch targets should be at least 44x44 pixels to accommodate users with motor impairments."
          goodExample={
            <div className="flex gap-4">
              <button className="p-3 bg-primary text-white rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          }
          badExample={
            <div className="flex gap-4">
              <button className="p-1 bg-primary text-white rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          }
        />
      </GuidelineSection>
    </div>
  ),
};

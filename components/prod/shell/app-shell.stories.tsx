import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Breadcrumbs } from "../breadcrumbs";
import { BreadcrumbProvider } from "../breadcrumbs/breadcrumb-context";
import { Header } from "../header";
import { PageHeader } from "../page-header";
import { Sidebar } from "../sidebar";

/*
 * Mirrors the composition and wrapper markup of `src/app/(protected)/layout.tsx`
 * so the shell can be screenshotted as production renders it. `InactivityTracker`
 * is omitted: it contributes no markup and only arms sign-out timers.
 */
const AppShell = () => (
  <div className="bg-bg-light flex h-screen">
    <Sidebar
      initiallyCollapsedGroups={[]}
      isInitiallyCollapsed={false}
      userName="Admin User"
      userRole="admin"
    />
    <Header userRole="admin" />
    <main className="mx-auto mt-[72px] max-h-full w-full max-w-[1600px] overflow-scroll p-6 transition-all duration-300">
      <BreadcrumbProvider>
        <Breadcrumbs />
        <PageHeader
          description="Look up customer accounts by email to view account details, membership, and program information."
          emoji="🛟"
          title="Support Manager"
          variant="aurora"
        />
      </BreadcrumbProvider>
    </main>
  </div>
);

const meta = {
  component: AppShell,
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/support-manager",
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AppShell>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SupportManager: Story = {};

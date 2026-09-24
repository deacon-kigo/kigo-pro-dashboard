/*
 * Minimal types for the `import type { Meta, StoryObj } from '@storybook/nextjs-vite'`
 * lines in the copied *.stories.tsx files. The imports are type-only and erased
 * at build time; these declarations exist so the copies typecheck here.
 */
declare module "@storybook/nextjs-vite" {
  import type { ComponentType, ReactNode } from "react";

  type StoryFn = () => ReactNode;
  type Decorator = (Story: StoryFn) => ReactNode;

  interface StoryParameters {
    layout?: "centered" | "fullscreen" | "padded";
    nextjs?: {
      appDirectory?: boolean;
      navigation?: {
        pathname?: string;
        query?: Record<string, string>;
        /* Accepted for typing parity with SOURCE stories; Storybook's decorator ignores it. */
        searchParams?: URLSearchParams;
        segments?: (string | [string, string])[];
      };
    };
    [key: string]: unknown;
  }

  interface Meta<TComponent = unknown> {
    args?: Record<string, unknown>;
    argTypes?: Record<string, unknown>;
    component?: TComponent extends ComponentType<infer P>
      ? ComponentType<P>
      : ComponentType<any>;
    decorators?: Decorator[];
    parameters?: StoryParameters;
    render?: (args: any) => ReactNode;
    subcomponents?: Record<string, ComponentType<any>>;
    tags?: string[];
    title?: string;
  }

  interface StoryObj<TMeta = unknown> {
    args?: Record<string, unknown>;
    decorators?: Decorator[];
    name?: string;
    parameters?: StoryParameters;
    render?: (args: any) => ReactNode;
  }

  export type { Decorator, Meta, StoryObj, StoryParameters };
}

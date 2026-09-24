"use client";

import type {
  Decorator,
  Meta,
  StoryObj,
  StoryParameters,
} from "@storybook/nextjs-vite";
import type { CSSProperties, ReactNode } from "react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import { TooltipProvider } from "@radix-ui/react-tooltip";

import { ParityNavigationContext } from "@/components/prod/_runtime/navigation";

import { inter } from "../../fonts";
import { ProCssReadyContext } from "../../pro-root";

interface ParityStory {
  meta: Meta<any>;
  story: StoryObj<any>;
}

type Layout = NonNullable<StoryParameters["layout"]>;

/*
 * Storybook's preview iframe puts these on <body> and #storybook-root
 * (`.sb-show-main.sb-main-*`). The prototype owns <body>, so the same boxes are
 * rebuilt here as a viewport-filling frame.
 */
const FRAME_STYLE: Record<
  Layout,
  { body: CSSProperties; root: CSSProperties }
> = {
  centered: {
    body: {
      display: "flex",
      alignItems: "center",
      minHeight: "100vh",
      margin: 0,
    },
    root: {
      boxSizing: "border-box",
      margin: "auto",
      padding: "1rem",
      maxHeight: "100%",
    },
  },
  fullscreen: {
    body: { display: "block", minHeight: "100vh", margin: 0, padding: 0 },
    root: {},
  },
  padded: {
    body: {
      display: "block",
      minHeight: "100vh",
      margin: 0,
      padding: "1rem",
      boxSizing: "border-box",
    },
    root: {},
  },
};

const applyDecorators = (
  render: () => ReactNode,
  decorators: Decorator[]
): (() => ReactNode) =>
  decorators.reduce<() => ReactNode>(
    (inner, decorate) => () => decorate(inner),
    render
  );

/*
 * A new function component every render would remount the story, reset its
 * refs, and re-fire URL writes. This type stays stable so only props change.
 */
const BoundStory = ({ render }: { render: () => ReactNode }) => render();

const StoryFrame = ({ meta, story }: ParityStory) => {
  const cssReady = useContext(ProCssReadyContext);
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) setFontsReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const ready = cssReady && fontsReady;

  const layout: Layout =
    story.parameters?.layout ?? meta.parameters?.layout ?? "centered";
  const navigation =
    story.parameters?.nextjs?.navigation ?? meta.parameters?.nextjs?.navigation;
  /*
   * Stories declare the URL they render. Writes from the ported search hook
   * must not be applied: doing so remounts the story (decorators are new
   * component types each render) and the hook writes again.
   */
  const onHref = useCallback(() => {}, []);
  /*
   * Storybook's RouterDecorator builds `new URLSearchParams(navigation.query)`
   * and never reads `navigation.searchParams`, so a story that declares
   * `searchParams` renders in Storybook as if it had declared none. The
   * baseline is the spec, so the same rule applies here.
   */
  const navigationValue = useMemo(
    () => ({
      pathname: navigation?.pathname ?? "/",
      searchParams: new URLSearchParams(navigation?.query ?? {}),
      onHref,
    }),
    [navigation?.pathname, navigation?.query, onHref]
  );

  const args = { ...meta.args, ...story.args };
  const Component = meta.component as
    | React.ComponentType<Record<string, unknown>>
    | undefined;
  const baseRender = (): ReactNode => {
    if (story.render) return story.render(args);
    if (meta.render) return meta.render(args);
    if (!Component) throw new Error("story has neither render nor component");
    return <Component {...args} />;
  };
  /* Story decorators wrap the render first, then meta decorators, then the global preview decorator. */
  const renderStory = applyDecorators(baseRender, [
    ...(story.decorators ?? []),
    ...(meta.decorators ?? []),
  ]);

  return (
    <ParityNavigationContext.Provider value={navigationValue}>
      <div
        data-parity-ready={ready ? "1" : "0"}
        style={{ ...FRAME_STYLE[layout].body, backgroundColor: "#fff" }}
      >
        <div style={FRAME_STYLE[layout].root}>
          <TooltipProvider delayDuration={0}>
            <div className={inter.className}>
              <BoundStory render={renderStory} />
            </div>
          </TooltipProvider>
        </div>
      </div>
    </ParityNavigationContext.Provider>
  );
};

export { StoryFrame };
export type { ParityStory };

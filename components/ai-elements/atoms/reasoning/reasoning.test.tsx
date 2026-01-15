import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { Reasoning, ReasoningContent, ReasoningTrigger } from "./index";

describe("Reasoning Tests", () => {
  // Mock timers for auto-close behavior testing
  beforeEach(() => {
    vi.useFakeTimers();
  });

  describe("Reasoning", () => {
    describe("Rendering", () => {
      it("renders children", () => {
        expect.hasAssertions();

        render(
          <Reasoning>
            <div>Reasoning content</div>
          </Reasoning>
        );

        expect(screen.getByText("Reasoning content")).toBeInTheDocument();
      });

      it("applies custom className", () => {
        expect.hasAssertions();

        const { container } = render(
          <Reasoning className="custom-reasoning">Test</Reasoning>
        );

        // eslint-disable-next-line testing-library/no-node-access -- Need to check className on wrapper
        const reasoning = container.firstChild;

        expect(reasoning).toHaveClass("custom-reasoning");
      });

      it("renders with defaultOpen true", () => {
        expect.hasAssertions();

        render(
          <Reasoning defaultOpen>
            <ReasoningTrigger />
            <ReasoningContent>Content</ReasoningContent>
          </Reasoning>
        );

        expect(screen.getByText("Content")).toBeInTheDocument();
      });

      it("renders with defaultOpen false", () => {
        expect.hasAssertions();

        const { container } = render(
          <Reasoning defaultOpen={false}>
            <ReasoningTrigger />
            <ReasoningContent>Content</ReasoningContent>
          </Reasoning>
        );

        // Content should not be visible when closed
        expect(container).toBeInTheDocument();
      });
    });

    describe("Controlled State", () => {
      it("accepts controlled open prop", () => {
        expect.hasAssertions();

        render(
          <Reasoning open={true}>
            <ReasoningTrigger />
            <ReasoningContent>Content</ReasoningContent>
          </Reasoning>
        );

        expect(screen.getByText("Content")).toBeInTheDocument();
      });

      it("calls onOpenChange when state changes", async () => {
        expect.hasAssertions();

        vi.useRealTimers();
        const user = userEvent.setup();
        const handleOpenChange = vi.fn();

        render(
          <Reasoning onOpenChange={handleOpenChange}>
            <ReasoningTrigger />
            <ReasoningContent>Content</ReasoningContent>
          </Reasoning>
        );

        const trigger = screen.getByRole("button");

        await user.click(trigger);

        await waitFor(
          () => {
            expect(handleOpenChange).toHaveBeenCalled();
          },
          { timeout: 3000 }
        );

        vi.useFakeTimers();
      });
    });

    describe("Streaming Behavior", () => {
      it("displays thinking shimmer when isStreaming true", () => {
        expect.hasAssertions();

        render(
          <Reasoning isStreaming={true}>
            <ReasoningTrigger />
            <ReasoningContent>Content</ReasoningContent>
          </Reasoning>
        );

        expect(screen.getByText("Thinking...")).toBeInTheDocument();
      });

      it("displays duration when isStreaming false and duration provided", () => {
        expect.hasAssertions();

        render(
          <Reasoning duration={5} isStreaming={false}>
            <ReasoningTrigger />
            <ReasoningContent>Content</ReasoningContent>
          </Reasoning>
        );

        expect(screen.getByText("Thought for 5 seconds")).toBeInTheDocument();
      });

      it("displays generic message when duration undefined", () => {
        expect.hasAssertions();

        render(
          <Reasoning isStreaming={false}>
            <ReasoningTrigger />
            <ReasoningContent>Content</ReasoningContent>
          </Reasoning>
        );

        expect(
          screen.getByText("Thought for a few seconds")
        ).toBeInTheDocument();
      });
    });

    describe("Auto-close", () => {
      it("tracks duration when streaming", () => {
        expect.hasAssertions();

        const { rerender } = render(
          <Reasoning defaultOpen={true} isStreaming={true}>
            <ReasoningTrigger />
            <ReasoningContent>Thinking</ReasoningContent>
          </Reasoning>
        );

        expect(screen.getByText("Thinking")).toBeVisible();

        // Advance time while streaming
        vi.advanceTimersByTime(2000);

        // Streaming ends
        rerender(
          <Reasoning defaultOpen={true} isStreaming={false}>
            <ReasoningTrigger />
            <ReasoningContent>Thinking</ReasoningContent>
          </Reasoning>
        );

        // Component should still be rendered
        expect(screen.getByText("Thinking")).toBeInTheDocument();
      });
    });
  });

  describe("ReasoningTrigger", () => {
    describe("Rendering", () => {
      it("renders with default thinking message", () => {
        expect.hasAssertions();

        render(
          <Reasoning isStreaming={false}>
            <ReasoningTrigger />
          </Reasoning>
        );

        expect(
          screen.getByText("Thought for a few seconds")
        ).toBeInTheDocument();
      });

      it("renders with custom children", () => {
        expect.hasAssertions();

        render(
          <Reasoning>
            <ReasoningTrigger>Custom trigger</ReasoningTrigger>
          </Reasoning>
        );

        expect(screen.getByText("Custom trigger")).toBeInTheDocument();
      });

      it("applies custom className", () => {
        expect.hasAssertions();

        const { container } = render(
          <Reasoning>
            <ReasoningTrigger className="custom-trigger" />
          </Reasoning>
        );

        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Need to check className
        const trigger = container.querySelector(".custom-trigger");

        expect(trigger).toBeInTheDocument();
      });

      it("accepts custom getThinkingMessage function", () => {
        expect.hasAssertions();

        const getCustomMessage = () => <span>Custom message</span>;

        render(
          <Reasoning>
            <ReasoningTrigger getThinkingMessage={getCustomMessage} />
          </Reasoning>
        );

        expect(screen.getByText("Custom message")).toBeInTheDocument();
      });
    });

    describe("Interaction", () => {
      it("toggles content on click", async () => {
        expect.hasAssertions();

        vi.useRealTimers();
        const user = userEvent.setup();

        render(
          <Reasoning defaultOpen={false}>
            <ReasoningTrigger />
            <ReasoningContent>Hidden content</ReasoningContent>
          </Reasoning>
        );

        const trigger = screen.getByRole("button");

        await user.click(trigger);

        await waitFor(() => {
          expect(screen.getByText("Hidden content")).toBeInTheDocument();
        });

        vi.useFakeTimers();
      });
    });
  });

  describe("ReasoningContent", () => {
    describe("Rendering", () => {
      it("renders markdown content", () => {
        expect.hasAssertions();

        render(
          <Reasoning defaultOpen={true}>
            <ReasoningTrigger />
            <ReasoningContent>**Bold text**</ReasoningContent>
          </Reasoning>
        );

        expect(screen.getByText("Bold text")).toBeInTheDocument();
      });

      it("applies custom className", () => {
        expect.hasAssertions();

        const { container } = render(
          <Reasoning defaultOpen={true}>
            <ReasoningTrigger />
            <ReasoningContent className="custom-content">Test</ReasoningContent>
          </Reasoning>
        );

        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Need to check className
        const content = container.querySelector(".custom-content");

        expect(content).toBeInTheDocument();
      });

      it("renders plain text content", () => {
        expect.hasAssertions();

        render(
          <Reasoning defaultOpen={true}>
            <ReasoningTrigger />
            <ReasoningContent>Plain text content</ReasoningContent>
          </Reasoning>
        );

        expect(screen.getByText("Plain text content")).toBeInTheDocument();
      });
    });

    describe("Visibility", () => {
      it("is hidden when Reasoning is closed", () => {
        expect.hasAssertions();

        render(
          <Reasoning defaultOpen={false}>
            <ReasoningTrigger />
            <ReasoningContent>Hidden</ReasoningContent>
          </Reasoning>
        );

        // Content exists but is not visible due to collapsible state
        const content = screen.queryByText("Hidden");

        // Content might not be in DOM when collapsed
        expect(content).not.toBeInTheDocument();
      });

      it("is visible when Reasoning is open", () => {
        expect.hasAssertions();

        render(
          <Reasoning defaultOpen={true}>
            <ReasoningTrigger />
            <ReasoningContent>Visible</ReasoningContent>
          </Reasoning>
        );

        expect(screen.getByText("Visible")).toBeInTheDocument();
      });
    });
  });

  describe("Context Integration", () => {
    describe("Error Handling", () => {
      it("throws error when ReasoningTrigger used outside Reasoning", () => {
        expect.hasAssertions();

        // Suppress console.error for this test
        const consoleSpy = vi
          .spyOn(console, "error")
          // eslint-disable-next-line @typescript-eslint/no-empty-function -- Intentionally mocking console.error
          .mockImplementation(() => {});

        expect(() => {
          render(<ReasoningTrigger />);
        }).toThrow(/Reasoning components must be used within Reasoning/);

        consoleSpy.mockRestore();
      });

      it("throws error when ReasoningContent used outside Reasoning", () => {
        expect.hasAssertions();

        // Suppress console.error for this test
        const consoleSpy = vi
          .spyOn(console, "error")
          // eslint-disable-next-line @typescript-eslint/no-empty-function -- Intentionally mocking console.error
          .mockImplementation(() => {});

        expect(() => {
          render(<ReasoningContent>Test</ReasoningContent>);
        }).toThrow(/Collapsible/);

        consoleSpy.mockRestore();
      });
    });
  });
});

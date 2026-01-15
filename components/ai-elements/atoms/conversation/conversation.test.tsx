import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "./index";

// Mock use-stick-to-bottom
const mockScrollToBottom = vi.fn();
const mockIsAtBottom = vi.fn(() => false);

vi.mock("use-stick-to-bottom", () => {
  const StickToBottomContent = ({
    children,
    className,
    ...props
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <div className={className} data-testid="stick-to-bottom-content" {...props}>
      {children}
    </div>
  );

  const StickToBottomComponent = Object.assign(
    ({
      children,
      className,
      ...props
    }: {
      children: React.ReactNode;
      className?: string;
    }) => (
      <div className={className} data-testid="stick-to-bottom" {...props}>
        {children}
      </div>
    ),
    { Content: StickToBottomContent }
  );

  return {
    StickToBottom: StickToBottomComponent,
    // eslint-disable-next-line @eslint-react/hooks-extra/no-useless-custom-hooks -- Hook is used for context mocking
    useStickToBottomContext: () => ({
      isAtBottom: mockIsAtBottom(),
      scrollToBottom: mockScrollToBottom,
    }),
  };
});

describe("Conversation", () => {
  describe("Rendering", () => {
    it("renders children", () => {
      expect.hasAssertions();

      render(<Conversation>Conversation content</Conversation>);

      expect(screen.getByText("Conversation content")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      render(<Conversation className="custom-conversation">Test</Conversation>);

      const conversation = screen.getByTestId("stick-to-bottom");

      expect(conversation).toHaveClass("custom-conversation");
    });

    it("renders with role log", () => {
      expect.hasAssertions();

      const { container } = render(<Conversation>Test</Conversation>);

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Need to check role attribute
      const conversation = container.querySelector('[role="log"]');

      expect(conversation).toBeInTheDocument();
    });
  });
});

describe("ConversationContent", () => {
  describe("Rendering", () => {
    it("renders children", () => {
      expect.hasAssertions();

      render(<ConversationContent>Content here</ConversationContent>);

      expect(screen.getByText("Content here")).toBeInTheDocument();
    });

    it("renders multiple children", () => {
      expect.hasAssertions();

      render(
        <ConversationContent>
          <div>Message 1</div>
          <div>Message 2</div>
        </ConversationContent>
      );

      expect(screen.getByText("Message 1")).toBeInTheDocument();
      expect(screen.getByText("Message 2")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      const { container } = render(
        <ConversationContent className="custom-content">
          Test
        </ConversationContent>
      );

      // eslint-disable-next-line testing-library/no-node-access -- Need to check className
      const content = container.firstChild;

      expect(content).toHaveClass("custom-content");
    });
  });
});

describe("ConversationEmptyState", () => {
  describe("Rendering", () => {
    it("renders with default title and description", () => {
      expect.hasAssertions();

      render(<ConversationEmptyState />);

      expect(screen.getByText("No messages yet")).toBeInTheDocument();
      expect(
        screen.getByText("Start a conversation to see messages here")
      ).toBeInTheDocument();
    });

    it("renders with custom title", () => {
      expect.hasAssertions();

      render(<ConversationEmptyState title="Custom title" />);

      expect(screen.getByText("Custom title")).toBeInTheDocument();
    });

    it("renders with custom description", () => {
      expect.hasAssertions();

      render(<ConversationEmptyState description="Custom description" />);

      expect(screen.getByText("Custom description")).toBeInTheDocument();
    });

    it("renders with icon", () => {
      expect.hasAssertions();

      const icon = <div data-testid="custom-icon">Icon</div>;

      render(<ConversationEmptyState icon={icon} />);

      expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    });

    it("renders custom children instead of defaults", () => {
      expect.hasAssertions();

      render(
        <ConversationEmptyState>
          <div>Custom empty state</div>
        </ConversationEmptyState>
      );

      expect(screen.getByText("Custom empty state")).toBeInTheDocument();
      expect(screen.queryByText("No messages yet")).not.toBeInTheDocument();
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      const { container } = render(
        <ConversationEmptyState className="custom-empty" />
      );

      // eslint-disable-next-line testing-library/no-node-access -- Need to check className
      const emptyState = container.firstChild;

      expect(emptyState).toHaveClass("custom-empty");
    });
  });
});

describe("ConversationScrollButton", () => {
  describe("Rendering", () => {
    it("renders when not at bottom", () => {
      expect.hasAssertions();

      render(<ConversationScrollButton />);

      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      render(<ConversationScrollButton className="custom-scroll-btn" />);

      const button = screen.getByRole("button");

      expect(button).toHaveClass("custom-scroll-btn");
    });
  });

  describe("Interaction", () => {
    it("calls scrollToBottom on click", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      // Reset and set up mock
      mockScrollToBottom.mockClear();
      mockIsAtBottom.mockReturnValue(false);

      render(<ConversationScrollButton />);

      const button = screen.getByRole("button");

      await user.click(button);

      expect(mockScrollToBottom).toHaveBeenCalledWith();
    });
  });

  describe("Visibility", () => {
    it("does not render when at bottom", () => {
      expect.hasAssertions();

      // Mock the context to return isAtBottom: true
      mockIsAtBottom.mockReturnValue(true);

      render(<ConversationScrollButton />);

      const button = screen.queryByRole("button");

      expect(button).not.toBeInTheDocument();
    });
  });
});

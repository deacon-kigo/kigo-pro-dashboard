import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "@/components/ui/tooltip";

import {
  Message,
  MessageAction,
  MessageActions,
  MessageAttachment,
  MessageAttachments,
  MessageBranch,
  MessageBranchContent,
  MessageBranchNext,
  MessageBranchPage,
  MessageBranchPrevious,
  MessageBranchSelector,
  MessageContent,
  MessageResponse,
  MessageToolbar,
} from "./index";

describe("Message", () => {
  describe("Rendering", () => {
    it("renders with user role", () => {
      expect.hasAssertions();

      const { container } = render(<Message from="user">Test</Message>);

      // eslint-disable-next-line testing-library/no-node-access -- Need to check role-specific classes
      const message = container.firstChild;

      expect(message).toHaveClass("is-user");
      expect(message).toHaveClass("ml-auto");
    });

    it("renders with assistant role", () => {
      expect.hasAssertions();

      const { container } = render(<Message from="assistant">Test</Message>);

      // eslint-disable-next-line testing-library/no-node-access -- Need to check role-specific classes
      const message = container.firstChild;

      expect(message).toHaveClass("is-assistant");
      expect(message).not.toHaveClass("ml-auto");
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      const { container } = render(
        <Message className="custom-class" from="user">
          Test
        </Message>
      );

      // eslint-disable-next-line testing-library/no-node-access -- Need to check className
      const message = container.firstChild;

      expect(message).toHaveClass("custom-class");
    });

    it("renders children", () => {
      expect.hasAssertions();

      render(<Message from="user">Message content</Message>);

      expect(screen.getByText("Message content")).toBeInTheDocument();
    });
  });
});

describe("MessageContent", () => {
  describe("Rendering", () => {
    it("renders children", () => {
      expect.hasAssertions();

      render(<MessageContent>Content here</MessageContent>);

      expect(screen.getByText("Content here")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      const { container } = render(
        <MessageContent className="custom-content">Test</MessageContent>
      );

      // eslint-disable-next-line testing-library/no-node-access -- Need to check className
      const content = container.firstChild;

      expect(content).toHaveClass("custom-content");
    });
  });
});

describe("MessageActions", () => {
  describe("Rendering", () => {
    it("renders children", () => {
      expect.hasAssertions();

      render(
        <MessageActions>
          <button type="button">Action 1</button>
        </MessageActions>
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("renders multiple action buttons", () => {
      expect.hasAssertions();

      render(
        <MessageActions>
          <button type="button">Action 1</button>
          <button type="button">Action 2</button>
        </MessageActions>
      );

      const buttons = screen.getAllByRole("button");

      expect(buttons).toHaveLength(2);
    });
  });
});

describe("MessageAction", () => {
  describe("Rendering", () => {
    it("renders button with children", () => {
      expect.hasAssertions();

      render(<MessageAction>Click me</MessageAction>);

      expect(screen.getByRole("button")).toHaveTextContent("Click me");
    });

    it("renders with label as sr-only text", () => {
      expect.hasAssertions();

      render(<MessageAction label="Copy message">Icon</MessageAction>);

      expect(screen.getByText("Copy message")).toHaveClass("sr-only");
    });

    it("renders with tooltip", () => {
      expect.hasAssertions();

      render(<MessageAction tooltip="Copy this message">Icon</MessageAction>);

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("uses tooltip as sr-only when label not provided", () => {
      expect.hasAssertions();

      render(<MessageAction tooltip="Copy message">Icon</MessageAction>);

      expect(screen.getByText("Copy message")).toHaveClass("sr-only");
    });

    it("applies custom size and variant", () => {
      expect.hasAssertions();

      render(
        <MessageAction size="sm" variant="outline">
          Test
        </MessageAction>
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("handles onClick", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<MessageAction onClick={handleClick}>Click</MessageAction>);

      const button = screen.getByRole("button");

      await user.click(button);

      expect(handleClick).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});

describe("MessageBranch", () => {
  describe("Rendering", () => {
    it("renders children", () => {
      expect.hasAssertions();

      render(
        <MessageBranch>
          <div>Branch content</div>
        </MessageBranch>
      );

      expect(screen.getByText("Branch content")).toBeInTheDocument();
    });

    it("uses defaultBranch prop", () => {
      expect.hasAssertions();

      render(
        <MessageBranch defaultBranch={1}>
          <MessageBranchContent>
            <div key="1">Branch 1</div>
            <div key="2">Branch 2</div>
          </MessageBranchContent>
        </MessageBranch>
      );

      expect(screen.getByText("Branch 2")).toBeVisible();
    });

    it("calls onBranchChange when branch changes", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();
      const handleBranchChange = vi.fn();

      render(
        <MessageBranch onBranchChange={handleBranchChange}>
          <MessageBranchContent>
            <div key="1">Branch 1</div>
            <div key="2">Branch 2</div>
          </MessageBranchContent>
          <MessageBranchSelector>
            <MessageBranchPrevious />
            <MessageBranchNext />
          </MessageBranchSelector>
        </MessageBranch>
      );

      const [, nextButton] = screen.getAllByRole("button");

      await user.click(nextButton!);

      expect(handleBranchChange).toHaveBeenCalledWith(1);
    });
  });
});

describe("MessageBranchContent", () => {
  describe("Rendering", () => {
    it("renders active branch", () => {
      expect.hasAssertions();

      render(
        <MessageBranch defaultBranch={0}>
          <MessageBranchContent>
            <div key="1">Branch 1</div>
            <div key="2">Branch 2</div>
          </MessageBranchContent>
        </MessageBranch>
      );

      expect(screen.getByText("Branch 1")).toBeVisible();
    });

    it("hides inactive branches", () => {
      expect.hasAssertions();

      render(
        <MessageBranch defaultBranch={0}>
          <MessageBranchContent>
            <div key="1">Branch 1</div>
            <div key="2">Branch 2</div>
          </MessageBranchContent>
        </MessageBranch>
      );

      const branch2 = screen.getByText("Branch 2");

      // eslint-disable-next-line testing-library/no-node-access -- Need to check parent div's hidden class
      expect(branch2.parentElement).toHaveClass("hidden");
    });
  });
});

describe("MessageBranchSelector", () => {
  describe("Rendering", () => {
    it("renders when multiple branches exist", () => {
      expect.hasAssertions();

      render(
        <MessageBranch>
          <MessageBranchContent>
            <div key="1">Branch 1</div>
            <div key="2">Branch 2</div>
          </MessageBranchContent>
          <MessageBranchSelector data-testid="selector">
            <MessageBranchPrevious />
            <MessageBranchNext />
          </MessageBranchSelector>
        </MessageBranch>
      );

      expect(screen.getByTestId("selector")).toBeInTheDocument();
    });

    it("does not render with single branch", () => {
      expect.hasAssertions();

      render(
        <MessageBranch>
          <MessageBranchContent>
            <div key="1">Branch 1</div>
          </MessageBranchContent>
          <MessageBranchSelector data-testid="selector">
            <MessageBranchPrevious />
            <MessageBranchNext />
          </MessageBranchSelector>
        </MessageBranch>
      );

      expect(screen.queryByTestId("selector")).not.toBeInTheDocument();
    });
  });
});

describe("MessageBranchPrevious", () => {
  describe("Navigation", () => {
    it("navigates to previous branch", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(
        <MessageBranch defaultBranch={1}>
          <MessageBranchContent>
            <div key="1">Branch 1</div>
            <div key="2">Branch 2</div>
          </MessageBranchContent>
          <MessageBranchSelector>
            <MessageBranchPrevious />
          </MessageBranchSelector>
        </MessageBranch>
      );

      const prevButton = screen.getByRole("button");

      await user.click(prevButton);

      expect(screen.getByText("Branch 1")).toBeVisible();
    });

    it("wraps to last branch from first", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(
        <MessageBranch defaultBranch={0}>
          <MessageBranchContent>
            <div key="1">Branch 1</div>
            <div key="2">Branch 2</div>
            <div key="3">Branch 3</div>
          </MessageBranchContent>
          <MessageBranchSelector>
            <MessageBranchPrevious />
          </MessageBranchSelector>
        </MessageBranch>
      );

      const prevButton = screen.getByRole("button");

      await user.click(prevButton);

      expect(screen.getByText("Branch 3")).toBeVisible();
    });

    it("renders with custom children", () => {
      expect.hasAssertions();

      render(
        <MessageBranch>
          <MessageBranchContent>
            <div key="1">Branch 1</div>
            <div key="2">Branch 2</div>
          </MessageBranchContent>
          <MessageBranchSelector>
            <MessageBranchPrevious>Prev</MessageBranchPrevious>
          </MessageBranchSelector>
        </MessageBranch>
      );

      expect(screen.getByText("Prev")).toBeInTheDocument();
    });
  });
});

describe("MessageBranchNext", () => {
  describe("Navigation", () => {
    it("navigates to next branch", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(
        <MessageBranch defaultBranch={0}>
          <MessageBranchContent>
            <div key="1">Branch 1</div>
            <div key="2">Branch 2</div>
          </MessageBranchContent>
          <MessageBranchSelector>
            <MessageBranchNext />
          </MessageBranchSelector>
        </MessageBranch>
      );

      const nextButton = screen.getByRole("button");

      await user.click(nextButton);

      expect(screen.getByText("Branch 2")).toBeVisible();
    });

    it("wraps to first branch from last", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(
        <MessageBranch defaultBranch={2}>
          <MessageBranchContent>
            <div key="1">Branch 1</div>
            <div key="2">Branch 2</div>
            <div key="3">Branch 3</div>
          </MessageBranchContent>
          <MessageBranchSelector>
            <MessageBranchNext />
          </MessageBranchSelector>
        </MessageBranch>
      );

      const nextButton = screen.getByRole("button");

      await user.click(nextButton);

      expect(screen.getByText("Branch 1")).toBeVisible();
    });

    it("renders with custom children", () => {
      expect.hasAssertions();

      render(
        <MessageBranch>
          <MessageBranchContent>
            <div key="1">Branch 1</div>
            <div key="2">Branch 2</div>
          </MessageBranchContent>
          <MessageBranchSelector>
            <MessageBranchNext>Next</MessageBranchNext>
          </MessageBranchSelector>
        </MessageBranch>
      );

      expect(screen.getByText("Next")).toBeInTheDocument();
    });
  });
});

describe("MessageBranchPage", () => {
  describe("Rendering", () => {
    it("displays current branch and total", () => {
      expect.hasAssertions();

      render(
        <MessageBranch defaultBranch={0}>
          <MessageBranchContent>
            <div key="1">Branch 1</div>
            <div key="2">Branch 2</div>
            <div key="3">Branch 3</div>
          </MessageBranchContent>
          <MessageBranchSelector>
            <MessageBranchPage />
          </MessageBranchSelector>
        </MessageBranch>
      );

      expect(screen.getByText("1 of 3")).toBeInTheDocument();
    });

    it("updates when branch changes", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(
        <MessageBranch defaultBranch={0}>
          <MessageBranchContent>
            <div key="1">Branch 1</div>
            <div key="2">Branch 2</div>
          </MessageBranchContent>
          <MessageBranchSelector>
            <MessageBranchNext />
            <MessageBranchPage />
          </MessageBranchSelector>
        </MessageBranch>
      );

      const nextButton = screen.getByRole("button");

      await user.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText("2 of 2")).toBeInTheDocument();
      });
    });
  });
});

describe("MessageResponse", () => {
  describe("Rendering", () => {
    it("renders markdown content", () => {
      expect.hasAssertions();

      render(<MessageResponse>**Bold text**</MessageResponse>);

      expect(screen.getByText("Bold text")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      const { container } = render(
        <MessageResponse className="custom-response">Test</MessageResponse>
      );

      // eslint-disable-next-line testing-library/no-node-access -- Need to check className
      const response = container.firstChild;

      expect(response).toHaveClass("custom-response");
    });
  });
});

describe("MessageAttachment", () => {
  describe("Rendering", () => {
    it("renders image attachment", () => {
      expect.hasAssertions();

      const data = {
        filename: "test.png",
        mediaType: "image/png",
        type: "file" as const,
        url: "blob:test",
      };

      render(<MessageAttachment data={data} />);

      const img = screen.getByAltText("test.png");

      expect(img).toBeInTheDocument();
    });

    it("renders file attachment", () => {
      expect.hasAssertions();

      const data = {
        filename: "document.pdf",
        mediaType: "application/pdf",
        type: "file" as const,
        url: "",
      };

      const { container } = render(
        <TooltipProvider>
          <MessageAttachment data={data} />
        </TooltipProvider>
      );

      expect(container).toBeInTheDocument();
    });

    it("renders remove button when onRemove provided", () => {
      expect.hasAssertions();

      const data = {
        filename: "test.png",
        mediaType: "image/png",
        type: "file" as const,
        url: "blob:test",
      };

      const handleRemove = vi.fn();

      render(<MessageAttachment data={data} onRemove={handleRemove} />);

      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });

    it("calls onRemove when remove button clicked", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();
      const data = {
        filename: "test.png",
        mediaType: "image/png",
        type: "file" as const,
        url: "blob:test",
      };

      const handleRemove = vi.fn();

      render(<MessageAttachment data={data} onRemove={handleRemove} />);

      const button = screen.getByRole("button");

      await user.click(button);

      expect(handleRemove).toHaveBeenCalledWith();
    });

    it("uses attachment as alt text when filename missing", () => {
      expect.hasAssertions();

      const data = {
        filename: "",
        mediaType: "image/png",
        type: "file" as const,
        url: "blob:test",
      };

      render(<MessageAttachment data={data} />);

      const img = screen.getByAltText("attachment");

      expect(img).toBeInTheDocument();
    });
  });
});

describe("MessageAttachments", () => {
  describe("Rendering", () => {
    it("renders children", () => {
      expect.hasAssertions();

      render(
        <MessageAttachments>
          <div>Attachment 1</div>
        </MessageAttachments>
      );

      expect(screen.getByText("Attachment 1")).toBeInTheDocument();
    });

    it("does not render when children is null", () => {
      expect.hasAssertions();

      const { container } = render(
        <MessageAttachments>{null}</MessageAttachments>
      );

      expect(container).toBeEmptyDOMElement();
    });

    it("renders multiple attachments", () => {
      expect.hasAssertions();

      render(
        <MessageAttachments>
          <div>Attachment 1</div>
          <div>Attachment 2</div>
        </MessageAttachments>
      );

      expect(screen.getByText("Attachment 1")).toBeInTheDocument();
      expect(screen.getByText("Attachment 2")).toBeInTheDocument();
    });
  });
});

describe("MessageToolbar", () => {
  describe("Rendering", () => {
    it("renders children", () => {
      expect.hasAssertions();

      render(
        <MessageToolbar>
          <button type="button">Tool 1</button>
        </MessageToolbar>
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      const { container } = render(
        <MessageToolbar className="custom-toolbar">Test</MessageToolbar>
      );

      // eslint-disable-next-line testing-library/no-node-access -- Need to check className
      const toolbar = container.firstChild;

      expect(toolbar).toHaveClass("custom-toolbar");
    });
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "./index";

describe("Tool", () => {
  describe("Rendering", () => {
    it("renders children", () => {
      expect.hasAssertions();

      render(<Tool>Tool content</Tool>);

      expect(screen.getByText("Tool content")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      const { container } = render(<Tool className="custom-tool">Test</Tool>);

      // eslint-disable-next-line testing-library/no-node-access -- Need to check className on wrapper
      const tool = container.firstChild;

      expect(tool).toHaveClass("custom-tool");
    });

    it("renders as collapsible", () => {
      expect.hasAssertions();

      render(
        <Tool>
          <div>Content</div>
        </Tool>
      );

      expect(screen.getByText("Content")).toBeInTheDocument();
    });
  });
});

describe("ToolHeader", () => {
  describe("Rendering", () => {
    it("renders with title and type", () => {
      expect.hasAssertions();

      render(
        <Tool>
          <ToolHeader
            state="output-available"
            title="Search"
            type="tool-search"
          />
        </Tool>
      );

      expect(screen.getByText("Search")).toBeInTheDocument();
    });

    it("derives title from type when title not provided", () => {
      expect.hasAssertions();

      render(
        <Tool>
          <ToolHeader state="output-available" type="tool-search-web" />
        </Tool>
      );

      expect(screen.getByText("search-web")).toBeInTheDocument();
    });

    it("renders status badge for input-available state", () => {
      expect.hasAssertions();

      render(
        <Tool>
          <ToolHeader state="input-available" type="tool-test" />
        </Tool>
      );

      expect(screen.getByText("Running")).toBeInTheDocument();
    });

    it("renders status badge for input-streaming state", () => {
      expect.hasAssertions();

      render(
        <Tool>
          <ToolHeader state="input-streaming" type="tool-test" />
        </Tool>
      );

      expect(screen.getByText("Pending")).toBeInTheDocument();
    });

    it("renders status badge for output-available state", () => {
      expect.hasAssertions();

      render(
        <Tool>
          <ToolHeader state="output-available" type="tool-test" />
        </Tool>
      );

      expect(screen.getByText("Completed")).toBeInTheDocument();
    });

    it("renders status badge for output-error state", () => {
      expect.hasAssertions();

      render(
        <Tool>
          <ToolHeader state="output-error" type="tool-test" />
        </Tool>
      );

      expect(screen.getByText("Error")).toBeInTheDocument();
    });

    it("renders status badge for output-denied state", () => {
      expect.hasAssertions();

      render(
        <Tool>
          <ToolHeader
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Testing additional state not in ToolUIPart type
            state={"output-denied" as any}
            type="tool-test"
          />
        </Tool>
      );

      expect(screen.getByText("Denied")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      const { container } = render(
        <Tool>
          <ToolHeader
            className="custom-header"
            state="output-available"
            type="tool-test"
          />
        </Tool>
      );

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Need to check className on header element
      const header = container.querySelector(".custom-header");

      expect(header).toBeInTheDocument();
    });
  });

  describe("Interaction", () => {
    it("acts as collapsible trigger", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(
        <Tool>
          <ToolHeader state="output-available" type="tool-test" />
          <ToolContent>Hidden content</ToolContent>
        </Tool>
      );

      const trigger = screen.getByRole("button");

      await user.click(trigger);

      expect(screen.getByText("Hidden content")).toBeInTheDocument();
    });
  });
});

describe("ToolContent", () => {
  describe("Rendering", () => {
    it("renders children when opened", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(
        <Tool>
          <ToolHeader state="output-available" type="tool-test" />
          <ToolContent>Content here</ToolContent>
        </Tool>
      );

      const trigger = screen.getByRole("button");

      await user.click(trigger);

      expect(screen.getByText("Content here")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      const { container } = render(
        <Tool defaultOpen>
          <ToolHeader state="output-available" type="tool-test" />
          <ToolContent className="custom-content">Test</ToolContent>
        </Tool>
      );

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Need to check className on content element
      const content = container.querySelector(".custom-content");

      expect(content).toBeInTheDocument();
    });
  });
});

describe("ToolInput", () => {
  describe("Rendering", () => {
    it("renders with simple input object", () => {
      expect.hasAssertions();

      const input = { query: "test query" };

      const { container } = render(<ToolInput input={input} />);

      expect(screen.getByText("Parameters")).toBeInTheDocument();
      // Code is rendered in CodeBlock, just verify component rendered
      expect(container).toHaveTextContent("Parameters");
    });

    it("renders with nested input object", () => {
      expect.hasAssertions();

      const input = {
        filters: { category: "tech", year: 2024 },
        query: "search term",
      };

      const { container } = render(<ToolInput input={input} />);

      expect(screen.getByText("Parameters")).toBeInTheDocument();
      // Code is rendered in CodeBlock
      expect(container).toBeInTheDocument();
    });

    it("renders with null input", () => {
      expect.hasAssertions();

      const { container } = render(<ToolInput input={null} />);

      expect(screen.getByText("Parameters")).toBeInTheDocument();
      expect(container).toBeInTheDocument();
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      const { container } = render(
        <ToolInput className="custom-input" input={{ test: "value" }} />
      );

      // eslint-disable-next-line testing-library/no-node-access -- Need to check className
      const inputDiv = container.firstChild;

      expect(inputDiv).toHaveClass("custom-input");
    });
  });
});

describe("ToolOutput", () => {
  describe("Rendering", () => {
    it("renders with string output", () => {
      expect.hasAssertions();

      const { container } = render(
        <ToolOutput errorText="" output="Test output" />
      );

      expect(screen.getByText("Result")).toBeInTheDocument();
      // Output is rendered in CodeBlock
      expect(container).toBeInTheDocument();
    });

    it("renders with object output", () => {
      expect.hasAssertions();

      const output = { count: 42, result: "success" };

      const { container } = render(<ToolOutput errorText="" output={output} />);

      expect(screen.getByText("Result")).toBeInTheDocument();
      // Output is rendered in CodeBlock
      expect(container).toBeInTheDocument();
    });

    it("renders error text when provided", () => {
      expect.hasAssertions();

      render(<ToolOutput errorText="Something went wrong" output="" />);

      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("does not render when no output or error", () => {
      expect.hasAssertions();

      const { container } = render(<ToolOutput errorText="" output={null} />);

      expect(container).toBeEmptyDOMElement();
    });

    it("renders JSX output element", () => {
      expect.hasAssertions();

      const output = <div>Custom JSX</div>;

      render(<ToolOutput errorText="" output={output} />);

      expect(screen.getByText("Custom JSX")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      const { container } = render(
        <ToolOutput
          className="custom-output"
          errorText=""
          output="test output"
        />
      );

      // eslint-disable-next-line testing-library/no-node-access -- Need to check className
      const outputDiv = container.firstChild;

      expect(outputDiv).toHaveClass("custom-output");
    });

    it("applies error styling when errorText provided", () => {
      expect.hasAssertions();

      const { container } = render(
        <ToolOutput errorText="Error occurred" output="" />
      );

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Need to check error styling classes
      const errorContainer = container.querySelector(".bg-destructive\\/10");

      expect(errorContainer).toBeInTheDocument();
    });
  });
});

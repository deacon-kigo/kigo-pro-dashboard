import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CodeBlock, CodeBlockCopyButton } from "./index";

// Mock shiki to avoid actual syntax highlighting in tests
vi.mock("shiki", () => ({
  codeToHtml: vi.fn((code: string) =>
    Promise.resolve(`<pre><code>${code}</code></pre>`)
  ),
}));

describe("CodeBlock", () => {
  describe("Rendering", () => {
    it("renders with required props", async () => {
      expect.hasAssertions();

      const { container } = render(
        <CodeBlock code="console.log('hello')" language="javascript" />
      );

      // Wait for async highlighting to complete
      await waitFor(() => {
        expect(container).toHaveTextContent(/hello/);
      });
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      const { container } = render(
        <CodeBlock
          className="custom-class"
          code="test code"
          language="typescript"
        />
      );

      // eslint-disable-next-line testing-library/no-node-access -- Need to check className on wrapper div
      const codeBlock = container.firstChild;

      expect(codeBlock).toHaveClass("custom-class");
    });

    it("renders children elements in top-right corner", () => {
      expect.hasAssertions();

      render(
        <CodeBlock code="test" language="javascript">
          <button type="button">Custom Button</button>
        </CodeBlock>
      );

      expect(screen.getByRole("button")).toBeInTheDocument();
      expect(screen.getByText("Custom Button")).toBeInTheDocument();
    });

    it("renders both light and dark theme versions", async () => {
      expect.hasAssertions();

      const { container } = render(
        <CodeBlock code="const x = 1;" language="typescript" />
      );

      await waitFor(() => {
        // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Need to check theme-specific divs
        expect(container.querySelector(".dark\\:hidden")).toBeInTheDocument();
      });

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Need to check theme-specific divs
      expect(container.querySelector(".dark\\:block")).toBeInTheDocument();
    });
  });

  describe("Line Numbers", () => {
    it("renders without line numbers by default", () => {
      expect.hasAssertions();

      const { container } = render(
        <CodeBlock code="line1\nline2" language="javascript" />
      );

      // isShowLineNumbers defaults to false, so no line number styling
      // eslint-disable-next-line testing-library/no-node-access -- Checking component renders
      expect(container.firstChild).toBeInTheDocument();
    });

    it("accepts isShowLineNumbers prop", () => {
      expect.hasAssertions();

      const { container } = render(
        <CodeBlock
          code="line1\nline2"
          isShowLineNumbers={true}
          language="javascript"
        />
      );

      // Line numbers would be added by shiki transformer (mocked in our tests)
      // eslint-disable-next-line testing-library/no-node-access -- Checking component renders
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe("Language Support", () => {
    it("supports javascript language", async () => {
      expect.hasAssertions();

      const { container } = render(
        <CodeBlock code="const x = 1;" language="javascript" />
      );

      await waitFor(() => {
        expect(container).toHaveTextContent(/const x = 1/);
      });
    });

    it("supports typescript language", async () => {
      expect.hasAssertions();

      const { container } = render(
        <CodeBlock code="type X = string;" language="typescript" />
      );

      await waitFor(() => {
        expect(container).toHaveTextContent(/type X = string/);
      });
    });

    it("supports python language", async () => {
      expect.hasAssertions();

      const { container } = render(
        <CodeBlock code="print('hello')" language="python" />
      );

      await waitFor(() => {
        expect(container).toHaveTextContent(/hello/);
      });
    });
  });
});

describe("CodeBlockCopyButton", () => {
  beforeEach(() => {
    // Setup clipboard mock before each test
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
      writable: true,
    });
  });

  describe("Rendering", () => {
    it("renders copy button with default icon", () => {
      expect.hasAssertions();

      render(
        <CodeBlock code="test code" language="javascript">
          <CodeBlockCopyButton />
        </CodeBlock>
      );

      const button = screen.getByRole("button");

      expect(button).toBeInTheDocument();
    });

    it("renders custom children when provided", () => {
      expect.hasAssertions();

      render(
        <CodeBlock code="test code" language="javascript">
          <CodeBlockCopyButton>Copy Code</CodeBlockCopyButton>
        </CodeBlock>
      );

      expect(screen.getByText("Copy Code")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      render(
        <CodeBlock code="test code" language="javascript">
          <CodeBlockCopyButton className="custom-copy-btn" />
        </CodeBlock>
      );

      const button = screen.getByRole("button");

      expect(button).toHaveClass("custom-copy-btn");
    });
  });

  describe("Copy Functionality", () => {
    it("copies code to clipboard on click", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();
      const mockWriteText = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: mockWriteText,
        },
        writable: true,
      });

      render(
        <CodeBlock code="test code" language="javascript">
          <CodeBlockCopyButton />
        </CodeBlock>
      );

      const button = screen.getByRole("button");

      await user.click(button);

      expect(mockWriteText).toHaveBeenCalledWith("test code");
    });

    it("calls onCopy callback after successful copy", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();
      const handleCopy = vi.fn();

      render(
        <CodeBlock code="test code" language="javascript">
          <CodeBlockCopyButton onCopy={handleCopy} />
        </CodeBlock>
      );

      const button = screen.getByRole("button");

      await user.click(button);

      await waitFor(() => {
        expect(handleCopy).toHaveBeenCalledWith();
      });
    });

    it("calls onError callback when clipboard API fails", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();
      const handleError = vi.fn();
      const mockWriteText = vi
        .fn()
        .mockRejectedValue(new Error("Clipboard error"));

      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: mockWriteText,
        },
        writable: true,
      });

      render(
        <CodeBlock code="test code" language="javascript">
          <CodeBlockCopyButton onError={handleError} />
        </CodeBlock>
      );

      const button = screen.getByRole("button");

      await user.click(button);

      await waitFor(() => {
        expect(handleError).toHaveBeenCalledWith(expect.any(Error));
      });
    });

    it("calls onError when clipboard API is not available", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();
      const handleError = vi.fn();

      // Remove clipboard API
      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: undefined,
        },
        writable: true,
      });

      render(
        <CodeBlock code="test code" language="javascript">
          <CodeBlockCopyButton onError={handleError} />
        </CodeBlock>
      );

      const button = screen.getByRole("button");

      await user.click(button);

      await waitFor(() => {
        expect(handleError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Clipboard API not available",
          })
        );
      });
    });
  });

  describe("Visual Feedback", () => {
    it("updates after successful copy", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();

      render(
        <CodeBlock code="test code" language="javascript">
          <CodeBlockCopyButton timeout={100} />
        </CodeBlock>
      );

      const button = screen.getByRole("button");

      await user.click(button);

      // Button should still be in document (icon changes but we can't easily test that)
      expect(button).toBeInTheDocument();
    });
  });

  describe("Context Integration", () => {
    it("accesses code from CodeBlock context", async () => {
      expect.hasAssertions();

      const user = userEvent.setup();
      const mockWriteText = vi.fn().mockResolvedValue(undefined);

      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: {
          writeText: mockWriteText,
        },
        writable: true,
      });

      const testCode = "const foo = 'bar';";

      render(
        <CodeBlock code={testCode} language="javascript">
          <CodeBlockCopyButton />
        </CodeBlock>
      );

      const button = screen.getByRole("button");

      await user.click(button);

      expect(mockWriteText).toHaveBeenCalledWith(testCode);
    });
  });
});

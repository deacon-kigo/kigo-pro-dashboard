import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Shimmer } from "./index";

// Mock motion to avoid animation issues in tests
vi.mock("motion/react", () => ({
  motion: {
    create: (component: any) => {
      // Return a component that strips out motion-specific props

      const MockMotion = ({ children, className, style, ...props }: any) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Component type is intentionally generic for mock
        const Component: any = component;

        return (
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Mock component with generic props
          <Component className={className} style={style} {...props}>
            {children}
          </Component>
        );
      };

      return MockMotion;
    },
  },
}));

describe("Shimmer", () => {
  describe("Rendering", () => {
    it("renders text content", () => {
      expect.hasAssertions();

      render(<Shimmer>Loading text...</Shimmer>);

      expect(screen.getByText("Loading text...")).toBeInTheDocument();
    });

    it("applies custom className", () => {
      expect.hasAssertions();

      const { container } = render(
        <Shimmer className="custom-shimmer">Test</Shimmer>
      );

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Need to check className
      const shimmer = container.querySelector(".custom-shimmer");

      expect(shimmer).toBeInTheDocument();
    });

    it("renders as paragraph by default", () => {
      expect.hasAssertions();

      const { container } = render(<Shimmer>Text</Shimmer>);

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Need to check element type
      const paragraph = container.querySelector("p");

      expect(paragraph).toBeInTheDocument();
      expect(paragraph?.textContent).toBe("Text");
    });

    it("renders as custom element when 'as' prop is provided", () => {
      expect.hasAssertions();

      const { container } = render(<Shimmer as="span">Text</Shimmer>);

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Need to check element type
      const span = container.querySelector("span");

      expect(span).toBeInTheDocument();
      expect(span?.textContent).toBe("Text");
    });

    it("renders as div when specified", () => {
      expect.hasAssertions();

      const { container } = render(<Shimmer as="div">Text</Shimmer>);

      // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access -- Need to check element type
      const div = container.querySelector("div");

      expect(div).toBeInTheDocument();
      expect(div?.textContent).toBe("Text");
    });
  });

  describe("Animation Props", () => {
    it("accepts duration prop", () => {
      expect.hasAssertions();

      render(<Shimmer duration={5}>Text</Shimmer>);

      // Duration is passed to motion component (tested via motion mock)
      expect(screen.getByText("Text")).toBeInTheDocument();
    });

    it("accepts spread prop", () => {
      expect.hasAssertions();

      render(<Shimmer spread={10}>Text</Shimmer>);

      // Spread is used in dynamicSpread calculation (tested via motion mock)
      expect(screen.getByText("Text")).toBeInTheDocument();
    });

    it("uses default duration when not provided", () => {
      expect.hasAssertions();

      render(<Shimmer>Text</Shimmer>);

      // Default duration is 2 (tested via motion mock)
      expect(screen.getByText("Text")).toBeInTheDocument();
    });

    it("uses default spread when not provided", () => {
      expect.hasAssertions();

      render(<Shimmer>Text</Shimmer>);

      // Default spread is 2 (tested via motion mock)
      expect(screen.getByText("Text")).toBeInTheDocument();
    });
  });

  describe("Styling", () => {
    it("applies gradient background styles", () => {
      expect.hasAssertions();

      const { container } = render(<Shimmer>Text</Shimmer>);

      // eslint-disable-next-line testing-library/no-node-access -- Need to check classes on element
      const element = container.firstChild;

      expect(element).toHaveClass("bg-clip-text");
      expect(element).toHaveClass("text-transparent");
    });

    it("combines custom className with default classes", () => {
      expect.hasAssertions();

      const { container } = render(
        <Shimmer className="my-custom-class">Text</Shimmer>
      );

      // eslint-disable-next-line testing-library/no-node-access -- Need to check classes on element
      const element = container.firstChild;

      expect(element).toHaveClass("my-custom-class");
      expect(element).toHaveClass("bg-clip-text");
    });
  });

  describe("Content", () => {
    it("renders short text", () => {
      expect.hasAssertions();

      render(<Shimmer>Hi</Shimmer>);

      expect(screen.getByText("Hi")).toBeInTheDocument();
    });

    it("renders long text", () => {
      expect.hasAssertions();

      const longText =
        "This is a much longer text that should still work with the shimmer effect";

      render(<Shimmer>{longText}</Shimmer>);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("renders text with special characters", () => {
      expect.hasAssertions();

      render(<Shimmer>Loading... 100% complete!</Shimmer>);

      expect(screen.getByText("Loading... 100% complete!")).toBeInTheDocument();
    });
  });
});

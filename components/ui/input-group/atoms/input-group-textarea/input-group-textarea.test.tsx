import { render, screen } from "@testing-library/react";

import { InputGroupTextarea } from ".";

describe(InputGroupTextarea, () => {
  describe("rendering", () => {
    it("renders the textarea element", () => {
      expect.assertions(1);

      render(<InputGroupTextarea />);

      expect(screen.getByRole("textbox")).toBeVisible();
    });
  });

  describe("styling", () => {
    it("applies default classes", () => {
      expect.assertions(1);

      render(<InputGroupTextarea />);

      expect(screen.getByRole("textbox")).toHaveClass(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0"
      );
    });

    it("applies custom className", () => {
      expect.assertions(1);

      render(<InputGroupTextarea className="test-class" />);

      expect(screen.getByRole("textbox")).toHaveClass(
        "flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0",
        "test-class"
      );
    });
  });

  describe("attributes", () => {
    it("sets data-slot attribute to input-group-control", () => {
      expect.assertions(1);

      render(<InputGroupTextarea />);

      expect(screen.getByRole("textbox")).toHaveAttribute(
        "data-slot",
        "input-group-control"
      );
    });

    it("spreads additional props to the textarea element", () => {
      expect.assertions(1);

      render(<InputGroupTextarea data-testid="custom-textarea" />);

      expect(screen.getByTestId("custom-textarea")).toBeVisible();
    });
  });
});

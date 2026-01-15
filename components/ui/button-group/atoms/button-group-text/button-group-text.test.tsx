import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { render, screen } from "@testing-library/react";

import { ButtonGroupText } from ".";

describe("ButtonGroupText", () => {
  describe("rendering", () => {
    it("renders button group text with default styles", () => {
      expect.assertions(2);

      render(<ButtonGroupText>Text Content</ButtonGroupText>);

      const element = screen.getByTestId("button-group-text");

      expect(element).toBeVisible();
      expect(element).toHaveClass(
        "bg-muted",
        "flex",
        "items-center",
        "gap-2",
        "rounded-md",
        "border",
        "px-4",
        "text-sm",
        "font-medium",
        "shadow-xs"
      );
    });

    it("renders with custom className", () => {
      expect.assertions(1);

      render(<ButtonGroupText className="custom-class">Text</ButtonGroupText>);

      expect(screen.getByTestId("button-group-text")).toHaveClass(
        "custom-class"
      );
    });

    it("renders with children", () => {
      expect.assertions(1);

      render(<ButtonGroupText>Button Group Text</ButtonGroupText>);

      expect(screen.getByText("Button Group Text")).toBeVisible();
    });

    it("renders with data-testid attribute", () => {
      expect.assertions(1);

      render(<ButtonGroupText>Text</ButtonGroupText>);

      expect(screen.getByTestId("button-group-text")).toBeVisible();
    });
  });

  describe("icon handling", () => {
    it("applies svg sizing styles", () => {
      expect.assertions(1);

      render(<ButtonGroupText>Text</ButtonGroupText>);

      expect(screen.getByTestId("button-group-text")).toHaveClass(
        "[&_svg]:pointer-events-none",
        "[&_svg:not([class*='size-'])]:size-4"
      );
    });

    it("renders with icon children", () => {
      expect.assertions(2);

      render(
        <ButtonGroupText>
          <ArrowRightIcon aria-label="arrow-icon" />
          <span>With Icon</span>
        </ButtonGroupText>
      );

      expect(screen.getByLabelText("arrow-icon")).toBeVisible();
      expect(screen.getByText("With Icon")).toBeVisible();
    });
  });

  describe("semantic HTML", () => {
    it("renders as a div element", () => {
      expect.assertions(1);

      render(<ButtonGroupText>Text</ButtonGroupText>);

      const element = screen.getByTestId("button-group-text");

      expect(element.tagName).toBe("DIV");
    });

    it("accepts standard div props", () => {
      expect.assertions(1);

      render(
        <ButtonGroupText data-custom="value" id="custom-id">
          Text
        </ButtonGroupText>
      );

      const element = screen.getByTestId("button-group-text");

      expect(element).toHaveAttribute("id", "custom-id");
    });
  });
});

import { render, screen } from "@testing-library/react";

import { Button } from "@/components/ui/button";

import { ButtonGroup } from ".";

describe("ButtonGroup", () => {
  describe("rendering", () => {
    it("renders a button group with default horizontal orientation", () => {
      expect.assertions(2);

      render(
        <ButtonGroup>
          <Button>First</Button>
          <Button>Second</Button>
          <Button>Third</Button>
        </ButtonGroup>
      );

      const group = screen.getByRole("group");

      expect(group).toBeVisible();
      expect(group).toHaveClass("flex w-fit items-stretch");
    });

    it("renders with custom className", () => {
      expect.assertions(1);

      render(
        <ButtonGroup className="custom-class">
          <Button>Button</Button>
        </ButtonGroup>
      );

      expect(screen.getByRole("group")).toHaveClass("custom-class");
    });

    it("renders with data-slot attribute", () => {
      expect.assertions(1);

      render(
        <ButtonGroup>
          <Button>Button</Button>
        </ButtonGroup>
      );

      expect(screen.getByRole("group")).toHaveAttribute(
        "data-slot",
        "button-group"
      );
    });

    it("renders with data-testid attribute", () => {
      expect.assertions(1);

      render(
        <ButtonGroup>
          <Button>Button</Button>
        </ButtonGroup>
      );

      expect(screen.getByTestId("button-group")).toBeVisible();
    });
  });

  describe("orientation variants", () => {
    it("applies horizontal orientation styles", () => {
      expect.assertions(2);

      render(
        <ButtonGroup orientation="horizontal">
          <Button>First</Button>
          <Button>Second</Button>
        </ButtonGroup>
      );

      const group = screen.getByRole("group");

      expect(group).toHaveAttribute("data-orientation", "horizontal");
      expect(group).toHaveClass(
        "[&>*:not(:first-child)]:rounded-l-none",
        "[&>*:not(:first-child)]:border-l-0",
        "[&>*:not(:last-child)]:rounded-r-none"
      );
    });

    it("applies vertical orientation styles", () => {
      expect.assertions(2);

      render(
        <ButtonGroup orientation="vertical">
          <Button>First</Button>
          <Button>Second</Button>
        </ButtonGroup>
      );

      const group = screen.getByRole("group");

      expect(group).toHaveAttribute("data-orientation", "vertical");
      expect(group).toHaveClass(
        "flex-col",
        "[&>*:not(:first-child)]:rounded-t-none",
        "[&>*:not(:first-child)]:border-t-0",
        "[&>*:not(:last-child)]:rounded-b-none"
      );
    });
  });

  describe("focus management", () => {
    it("applies focus-visible styles for z-index stacking", () => {
      expect.assertions(1);

      render(
        <ButtonGroup>
          <Button>Button</Button>
        </ButtonGroup>
      );

      expect(screen.getByRole("group")).toHaveClass(
        "[&>*]:focus-visible:relative",
        "[&>*]:focus-visible:z-10"
      );
    });
  });

  describe("children", () => {
    it("renders multiple children correctly", () => {
      expect.assertions(3);

      render(
        <ButtonGroup>
          <Button>First</Button>
          <Button>Second</Button>
          <Button>Third</Button>
        </ButtonGroup>
      );

      expect(screen.getByText("First")).toBeVisible();
      expect(screen.getByText("Second")).toBeVisible();
      expect(screen.getByText("Third")).toBeVisible();
    });

    it("renders single child correctly", () => {
      expect.assertions(1);

      render(
        <ButtonGroup>
          <Button>Only Button</Button>
        </ButtonGroup>
      );

      expect(screen.getByText("Only Button")).toBeVisible();
    });
  });
});

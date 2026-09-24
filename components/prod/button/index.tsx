"use client";

import type { VariantProps } from "class-variance-authority";
import type { LinkProps } from "@/components/prod/_runtime/link";

import type * as React from "react";
import type { PropsWithChildren, ReactElement } from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import Link from "@/components/prod/_runtime/link";

import { cn } from "@/components/prod/utils/cn";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm",
    "font-medium ring-offset-background transition-colors focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    "border border-transparent",
  ],
  {
    defaultVariants: {
      color: "primary",
      size: "default",
      variant: "default",
    },
    variants: {
      color: {
        destructive: "",
        primary: "",
        secondary: "",
      },
      size: {
        default: "h-10 text-base py-2 px-4",
        icon: "size-10",
        lg: "h-11 text-lg py-2.5 px-5",
        sm: "h-9 text-sm py-1.5 px-3",
        xl: "h-12 text-xl py-3 px-6",
        xs: "h-8 text-xs py-1 px-2",
      },
      variant: {
        default: "",
        ghost: "",
        link: "underline-offset-4 enabled:hover:underline",
        outline: "border-border bg-background",
      },
    },
    //
    compoundVariants: [
      // * Default variant colors
      {
        class: "bg-primary text-primary-foreground enabled:hover:bg-primary/90",
        color: "primary",
        variant: "default",
      },
      {
        class:
          "bg-secondary text-secondary-foreground enabled:hover:bg-secondary/80",
        color: "secondary",
        variant: "default",
      },
      {
        class:
          "bg-destructive text-destructive-foreground enabled:hover:bg-destructive/90",
        color: "destructive",
        variant: "default",
      },
      // * Ghost variant colors
      {
        class:
          "enabled:hover:bg-primary/5 text-primary enabled:hover:text-primary",
        color: "primary",
        variant: "ghost",
      },
      {
        class: "enabled:hover:bg-accent enabled:hover:text-accent-foreground",
        color: "secondary",
        variant: "ghost",
      },
      {
        class:
          "text-destructive enabled:hover:bg-destructive/10 enabled:hover:text-destructive",
        color: "destructive",
        variant: "ghost",
      },
      // * Link variant colors
      { class: "text-primary", color: "primary", variant: "link" },
      {
        class: "text-secondary-foreground",
        color: "secondary",
        variant: "link",
      },
      { class: "text-destructive", color: "destructive", variant: "link" },
      // * Outline variant colors
      {
        class:
          "enabled:hover:bg-primary/5 text-primary enabled:hover:text-primary",
        color: "primary",
        variant: "outline",
      },
      {
        class: "enabled:hover:bg-accent enabled:hover:text-accent-foreground",
        color: "secondary",
        variant: "outline",
      },
      {
        class:
          "border-destructive text-destructive enabled:hover:bg-destructive/10",
        color: "destructive",
        variant: "outline",
      },
    ],
  }
);

type ButtonBaseProps = PropsWithChildren<{
  asChild?: boolean;
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => Promise<void> | void;
}> &
  VariantProps<typeof buttonVariants>;

type ButtonProps =
  | (ButtonBaseProps & LinkProps & { href: string; type?: undefined })
  | (ButtonBaseProps &
      React.ButtonHTMLAttributes<HTMLButtonElement> & {
        href?: undefined;
        type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
      });

const Button = ({
  asChild = false,
  children,
  className,
  color,
  href,
  icon,
  ref,
  size,
  type = "button",
  variant,
  ...props
}: ButtonProps & {
  ref?: React.Ref<HTMLButtonElement | ReactElement<typeof Link>>;
}) => {
  const content = (
    <>
      {icon && <span>{icon}</span>}
      {children}
    </>
  );

  if (href) {
    const Comp = asChild ? Slot : Link;

    return (
      <Comp
        className={cn(buttonVariants({ className, color, size, variant }))}
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        {...(props as Omit<LinkProps, "href">)}
        href={href}
      >
        {content}
      </Comp>
    );
  }

  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ className, color, size, variant }))}
      ref={ref as React.ForwardedRef<HTMLButtonElement>}
      type={type}
      {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </Comp>
  );
};

Button.displayName = "Button";

export { Button, type ButtonProps, buttonVariants };

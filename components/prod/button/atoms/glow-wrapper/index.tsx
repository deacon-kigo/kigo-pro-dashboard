import type { ButtonProps } from "../..";
import type { GlowEffectProps } from "@/components/prod/glow-effect";

import { GlowEffect } from "@/components/prod/glow-effect";

const defaultGlowEffects: Record<
  NonNullable<ButtonProps["color"]>,
  GlowEffectProps
> = {
  destructive: {
    blur: "soft",
    colors: ["#ef4444", "#dc2626", "#b91c1c", "#991b1b"],
    duration: 2,
    mode: "pulse",
    scale: 0.95,
  },
  primary: {
    blur: "soft",
    colors: ["#3b82f6", "#8b5cf6", "#ec4899", "#ef4444"],
    duration: 3,
    mode: "colorShift",
    scale: 0.95,
  },
  secondary: {
    blur: "soft",
    colors: ["#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280"],
    duration: 4,
    mode: "pulse",
    scale: 0.95,
  },
};

const GlowWrapper = ({
  children,
  color = "primary",
  glow,
}: {
  children: React.ReactNode;
  color?: ButtonProps["color"];
  glow?: GlowEffectProps;
}) => {
  const glowProps: GlowEffectProps = {
    ...defaultGlowEffects[color ?? "primary"],
    ...glow,
  };

  return (
    <div
      className="relative flex [&>*:first-child]:relative [&>*:first-child]:z-10 [&>*:first-child]:outline [&>*:first-child]:outline-[#ffffff1a]"
      data-testid="glow-wrapper"
    >
      {children}
      <GlowEffect {...glowProps} className="z-0" />
    </div>
  );
};

export { GlowWrapper };

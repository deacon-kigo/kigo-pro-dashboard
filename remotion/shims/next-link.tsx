/**
 * Shim for next/link inside Remotion's webpack bundler.
 * Renders a plain <a> tag.
 */
import React from "react";

interface LinkProps {
  href: string | { pathname?: string; query?: Record<string, string> };
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  target?: string;
  rel?: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const Link: React.FC<LinkProps> = ({
  href,
  children,
  className,
  style,
  target,
  rel,
  onClick,
}) => {
  const resolvedHref = typeof href === "string" ? href : href.pathname || "#";

  return (
    <a
      href={resolvedHref}
      className={className}
      style={style}
      target={target}
      rel={rel}
      onClick={onClick}
    >
      {children}
    </a>
  );
};

export default Link;

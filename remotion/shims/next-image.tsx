/**
 * Shim for next/image inside Remotion's webpack bundler.
 * Renders a plain <img> tag with equivalent props.
 */
import React from "react";

interface ImageProps {
  src: string | { src: string; height?: number; width?: number };
  alt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
  quality?: number;
  placeholder?: string;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt = "",
  width,
  height,
  fill,
  className,
  style,
  onLoad,
  onError,
}) => {
  const resolvedSrc = typeof src === "string" ? src : src.src;
  const fillStyle: React.CSSProperties = fill
    ? {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }
    : {};

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={className}
      style={{ ...fillStyle, ...style }}
      onLoad={onLoad}
      onError={onError}
    />
  );
};

export default Image;

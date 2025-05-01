import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

// Fix React type import issues
declare module "react" {
  export type ReactNode = React.ReactNode;
  export type FC<P = {}> = React.FC<P>;
  export type FormEvent<T = Element> = React.FormEvent<T>;
  export type CSSProperties = React.CSSProperties;
  export const Fragment: typeof React.Fragment;
  export const useState: typeof React.useState;
  export const useEffect: typeof React.useEffect;
  export const useMemo: typeof React.useMemo;
  export const useCallback: typeof React.useCallback;
}

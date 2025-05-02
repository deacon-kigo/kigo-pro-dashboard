declare module "react-simple-maps" {
  import * as React from "react";

  export interface ComposableMapProps extends React.SVGProps<SVGSVGElement> {
    projectionConfig?: {
      scale?: number;
      center?: [number, number];
      rotate?: [number, number, number];
    };
    projection?: string;
    width?: number;
    height?: number;
  }

  export interface ZoomableGroupProps {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    translateExtent?: [[number, number], [number, number]];
    onMoveStart?: Function;
    onMoveEnd?: Function;
    onMove?: Function;
    onZoomStart?: Function;
    onZoomEnd?: Function;
    className?: string;
    children?: React.ReactNode;
  }

  export interface GeographiesProps {
    geography: string | object;
    children: (props: { geographies: any[] }) => React.ReactNode;
  }

  export interface GeographyProps {
    geography: any;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    className?: string;
    style?: React.CSSProperties;
    onClick?: (event: React.MouseEvent, geography: any) => void;
    onMouseEnter?: (event: React.MouseEvent, geography: any) => void;
    onMouseLeave?: (event: React.MouseEvent, geography: any) => void;
  }

  export interface MarkerProps {
    coordinates: [number, number];
    className?: string;
    style?: React.CSSProperties;
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent) => void;
    onMouseEnter?: (event: React.MouseEvent) => void;
    onMouseLeave?: (event: React.MouseEvent) => void;
  }

  export const ComposableMap: React.FunctionComponent<ComposableMapProps>;
  export const ZoomableGroup: React.FunctionComponent<ZoomableGroupProps>;
  export const Geographies: React.FunctionComponent<GeographiesProps>;
  export const Geography: React.FunctionComponent<GeographyProps>;
  export const Marker: React.FunctionComponent<MarkerProps>;
}

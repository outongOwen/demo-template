import type { Point, TCornerPoint, Canvas, Object as FabricObject } from 'fabric';

export interface VerticalLineCoords {
  x: number;
  y1: number;
  y2: number;
}

export interface HorizontalLineCoords {
  y: number;
  x1: number;
  x2: number;
}
export type TACoords = TCornerPoint;
export type IgnoreObjTypes = Array<Record<string, any>>;
export type ACoordsExtendsCenter = TACoords & {
  c: Point;
};
export interface AlignGuidelinesOptions {
  [key: string]: any;
  autoAdsorb?: boolean;
  aligningLineMargin?: number;
  aligningLineWidth?: number;
  aligningLineColor?: string;
  isOpenElementAlignGuidelines?: boolean;
  isOpenCanvasAlignGuidelines?: boolean;
  ignoreObjTypes?: IgnoreObjTypes;
  pickObjTypes?: IgnoreObjTypes;
}
export interface AlignGuidelinesProps {
  canvas: Canvas;
  options?: AlignGuidelinesOptions;
}
export interface SnapProps {
  activeObject: FabricObject;
  snapXPoints: number[];
  draggingObjCoords: ACoordsExtendsCenter;
  snapYPoints: number[];
}
export type PointArray = [keyof ACoordsExtendsCenter, Point];

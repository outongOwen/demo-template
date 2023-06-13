import type { Point, TCornerPoint } from 'fabric';
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

export interface DragGuideLine {
  isMoving: boolean;
  movePositions: number[];
  assistPositions: number[];
}

export type DragLineProps = DragGuideLine & { scrollLeft: number };

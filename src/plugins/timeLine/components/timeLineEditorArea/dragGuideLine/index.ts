export type TargetType = 'action' | 'cursor';
export interface DragActionGuideLine {
  isMoving: boolean;
  movePositions: number[];
  assistPositions: number[];
  targetType: TargetType;
}
export interface DragLineRowGuideLine {
  isMoving: boolean;
  y: number;
  x: number;
  direction: 'center' | 'bottom' | 'top';
  rowId: string;
  actionId: string;
}
export type DragLineActionProps = DragActionGuideLine;

export type DragLineRowProps = DragActionGuideLine & { scrollTop: number };

interface ScaleInfo {
  scale?: number;
  scaleStep?: number;
  scaleSmallCellWidth?: number;
  scaleLargeCellWidth?: number;
  scaleSmallCellMs?: number;
}
interface TimeLineStateType {
  scaleInfo: ScaleInfo;
}
export type { TimeLineStateType, ScaleInfo };

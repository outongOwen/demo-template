interface ScaleInfo {
  sliderKeys?: Array<number>;
  scale?: number;
  scaleSmallCellWidth?: number;
  scaleLargeCellWidth?: number;
  scaleSmallCellMs?: number;
}
interface TimeLineStateType {
  scaleInfo: ScaleInfo;
}
export type { TimeLineStateType, ScaleInfo };

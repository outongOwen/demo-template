import type { TimelineExpose } from '@/plugins/timeLine';
interface ScaleInfo {
  scale?: number;
  scaleStep?: number;
  scaleSmallCellWidth?: number;
  scaleLargeCellWidth?: number;
  scaleSmallCellMs?: number;
}
interface TimeLineStateType {
  timeLineRef: TimelineExpose | null;
  scaleInfo: ScaleInfo;
}
export type { TimeLineStateType, ScaleInfo };

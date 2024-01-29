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
  timeLineMaxEndTime: number;
  scaleInfo: ScaleInfo;
  previewCurrentState: boolean;
}
export type { TimeLineStateType, ScaleInfo };

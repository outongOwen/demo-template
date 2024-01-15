import type { TimelineAction } from './timeLineAction';
type EventData = {
  lastLeft: number;
  left: number;
  lastWidth: number;
  width: number;
};

export type RndDragStartCallback = () => void;
export type RndDragCallback = (data: EventData, scrollDelta?: number) => boolean | void;
export type RndDragEndCallback = (data: Pick<EventData, 'left' | 'width'>) => void;

export type Direction = 'left' | 'right';
export type RndResizeStartCallback = (dir: Direction) => void;
export type RndResizeCallback = (dir: Direction, data: EventData) => boolean | void;
export type RndResizeEndCallback = (dir: Direction, data: Pick<EventData, 'left' | 'width'>) => void;
/**
 * 时间轴行基本参数
 * @export
 * @interface TimelineRow
 */
export interface TimelineRow {
  /** 行id */
  id: string;
  /** 行名称 */
  name: string | number;
  /** 行类型 */
  type: string;
  /** 行的动作列表 */
  actions: TimelineAction[];
  /** 包含action类型 */
  includes?: string[];
  /** 排除action类型 */
  excludes?: string[];
  /** 侧边栏ID */
  sideBarId?: string;
  /** 自定义行高 */
  rowHeight?: number;
  /** 行是否选中 */
  selected?: boolean;
  /** 锁定行 */
  locked?: boolean;
  /** 隐藏行 */
  hided?: boolean;
  /** 行静音 */
  muted?: boolean;
  /** 行的扩展类名 */
  classNames?: string[];
}

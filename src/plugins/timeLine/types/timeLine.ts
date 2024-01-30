import type { AutoScrollOptions as AutoScrollPluginOptions } from '@interactjs/auto-scroll/plugin';
import type { Emitter } from '../core/emitter';
import type { EventTypes } from '../core/events';
import type { timeLineProps } from '../components/timeLine/props';
import type { TimeLineEditorShareEmits } from '../components/timeLine/emits';
export interface TimelineExpose {
  /** dom节点 */
  targetEl: HTMLElement;
  /** 运行监听器 */
  listener: Emitter<EventTypes>;
  /** 是否正在播放 */
  isPlaying: boolean;
  /** 是否暂停中 */
  isPaused: boolean;
  /** 设置当前播放时间 */
  setTime: (time: number) => void;
  /** 获取当前播放时间 */
  getTime: () => number;
  /** 设置播放速率 */
  setPlayRate: (rate: number) => void;
  /** 设置播放速率 */
  getPlayRate: () => number;
  /** 重新渲染当前时间 */
  reRender: () => void;
  /** 播放 */
  play: (param?: {
    /** 默认从头运行到尾, 优先级大于autoEnd */
    toTime?: number;
    /** 是否播放完后自动结束 */
    autoEnd?: boolean;
    /** 运行的actionId列表，默认全部运行 */
    runActionIds?: string[];
  }) => boolean;
  /** 暂停 */
  pause: () => void;
  // /** 设置scroll left */
  scrollTo: (options: ScrollToOptions) => void;
  // /** 设置scroll top */
  // setScrollTop: (val: number) => void;
}

/**
 * 动画编辑器参数
 * @export
 * @interface TimelineProp
 */
type RemoveReadonly<T> = {
  -readonly [key in keyof T]: T[key];
};
type ExtractPublicPropTypes<T> = Partial<RemoveReadonly<ExtractPropTypes<T>>>;
export type TimeLineEditorProps = ExtractPublicPropTypes<typeof timeLineProps>;
export type TimeLineEditorEmits = Partial<TimeLineEditorShareEmits>;

export interface AutoScrollOptions extends Omit<AutoScrollPluginOptions, 'container'> {
  enabled?: boolean;
}

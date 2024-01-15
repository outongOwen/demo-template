import type { ShallowRef } from 'vue';
import { useScroll } from '@vueuse/core';
import { useContext } from '../hooks';
import { TimelineEngine } from '../core';
import type { ITimelineEngine } from '../core';
export interface TimeLineStateContextProps {
  /**
   * @description 当前指针时间
   * @default 0
   * @type {number}
   */
  cursorTime: Ref<number>;
  /**
   * @description 轨道是否正在运行
   */
  isPlaying: Ref<boolean>;
  /**
   * @description 刻度单位（ms/px）
   */
  scaleUnit: Ref<number>;
  /**
   * @description scrollInfo
   */
  scrollInfo: ReturnType<typeof useScroll>;
  /**
   * @description 一帧width
   * @type {number}
   */
  frameWidth: Ref<number>;
  /**
   * @description 时间线编辑区域容器DOM
   * @default null
   * @type {HTMLElement|null}
   */
  timeLineEditorRef: ShallowRef<HTMLElement | null | undefined>;
  /**
   * @description 是否有时间主轴
   */
  hasMainRow: Ref<boolean>;
  /**
   * @description 时间线最大时间
   */
  timeLineMaxEndTime: Ref<number>;
  /**
   * @description 时间驱动引擎
   * @default TimelineEngine
   * @type {ITimelineEngine}
   */
  engineRef: ShallowRef<ITimelineEngine>;
  /**
   * @description 设置scrollLeft
   * @param {number} delta
   * @returns {void}
   */
  setDeltaScrollLeft(delta: number): void;
  /**
   * @description 设置光标
   * @param {number} time
   * @param {boolean} updateTime
   * @returns {boolean}
   */
  handleSetCursor(time: number, updateTime?: boolean): boolean;
}
const { useInject, useProvide } = useContext<TimeLineStateContextProps>('TimeLineStateContext', {
  native: true
});
export default function useTimeLineStateContext() {
  // 当前指针时间
  const cursorTime = ref<number>(0);
  // 轨道是否正在运行
  const isPlaying = ref<boolean>(false);
  // 刻度单位（ms/px）
  const scaleUnit = ref<number>(0);
  // 一帧width
  const frameWidth = ref<number>(0);
  // 是否有时间主轴
  const hasMainRow = ref<boolean>(false);
  // 时间线编辑区域容器DOM
  const timeLineEditorRef = shallowRef<HTMLElement | null | undefined>(null);
  // 滚动条信息
  const scrollInfo = useScroll(timeLineEditorRef);
  // 时间线最大时间
  const timeLineMaxEndTime = ref<number>(0);
  // 时间驱动引擎
  const engineRef = shallowRef<ITimelineEngine>(new TimelineEngine());
  // 根据delta设置scrollLeft
  const setDeltaScrollLeft = (delta: number) => {
    if (!timeLineEditorRef.value) return;
    const data = timeLineEditorRef.value.scrollLeft + delta;
    // 当超过最大距离时，禁止自动滚动
    if (data > timeLineEditorRef.value.scrollWidth - timeLineEditorRef.value.clientWidth) return;
    timeLineEditorRef.value.scrollLeft = data;
  };
  /** 处理光标 */
  const handleSetCursor = (time: number, updateTime = true) => {
    let result = true;
    if (updateTime) {
      result = engineRef.value.setTime(time / 1000);
      engineRef.value.reRender();
    }
    result && (cursorTime.value = time);
    return result;
  };
  const timeLineStateProps: TimeLineStateContextProps = {
    scrollInfo,
    isPlaying,
    cursorTime,
    scaleUnit,
    frameWidth,
    hasMainRow,
    timeLineEditorRef,
    setDeltaScrollLeft,
    timeLineMaxEndTime,
    engineRef,
    handleSetCursor
  };
  const provideTimeLineStateContext = (context: Partial<TimeLineStateContextProps>) => {
    return useProvide(Object.assign(timeLineStateProps, context));
  };
  const injectTimeLineStateContext = () => {
    return useInject();
  };
  return {
    provideTimeLineStateContext,
    injectTimeLineStateContext
  };
}

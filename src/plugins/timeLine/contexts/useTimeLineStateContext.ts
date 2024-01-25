import type { ShallowRef } from 'vue';
import { useScroll } from '@vueuse/core';
import { useContext } from '../hooks';
import { TimelineEngine } from '../core';
import type { ITimelineEngine } from '../core';
import type { TimelineExpose, TimelineRow, TimelineAction } from '../types';
export interface TimeLineStateContextProps {
  /**
   * @description: 时间线数据
   */
  editorData: Ref<TimelineRow[] | undefined>;
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
   * @description 设置光标
   * @param {number} time
   * @param {boolean} updateTime
   * @returns {boolean}
   */
  handleSetCursor(time: number, updateTime?: boolean): boolean;
  /**
   * @description 根据位置设置光标
   * @param {number} clientX 鼠标位置
   * @param {number} offsetLeft 偏移量
   */
  setCursorByPos(clientX: number, leftOffset: number): void;
  /**
   * @description 暂停
   * @returns {void}
   */
  enginePause(): void;
  /**
   * @description 播放
   * @returns {void}
   */
  enginePlay(param?: Parameters<TimelineExpose['play']>[0]): boolean;
}
const { useInject, useProvide } = useContext<TimeLineStateContextProps>('TimeLineStateContext', {
  native: true
});
export default function useTimeLineStateContext() {
  // 时间线数据
  const editorData = ref<TimelineRow[]>([]);
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
  // 时间驱动引擎
  const engineRef = shallowRef<ITimelineEngine>(new TimelineEngine());
  // 时间线最大时间
  const timeLineMaxEndTime = computed(() => {
    return unref(editorData).reduce((prev, cur) => {
      // 通过actions中最大end值计算最大宽度
      const maxTime = cur.actions.reduce((aPrev: number, aCur: TimelineAction) => {
        return Math.max(aPrev, aCur.end);
      }, 0);
      return Math.max(prev, maxTime);
    }, 0);
  });
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
  /**
   * @description 根据位置设置光标
   * @param {number} posX 当前位置
   * @param {number} frameMs  一帧多少毫秒
   */
  const setCursorByPos = (clientX: number, leftOffset: number) => {
    const posX = clientX - timeLineEditorRef.value!.getBoundingClientRect().left + scrollInfo.x.value - leftOffset;
    const curX = Math.round(posX / frameWidth.value) * frameWidth.value;
    let time = curX * scaleUnit.value;
    time = time < 0 ? 0 : time;
    time = time > timeLineMaxEndTime.value ? timeLineMaxEndTime.value : time; //  限制0-duration;
    handleSetCursor(time); // seek时间
  };
  /**
   * @description 暂停
   * @returns {void}
   */
  const enginePause = () => {
    engineRef.value.isPlaying && engineRef.value.pause();
  };
  /**
   * @description 播放
   * @returns {void}
   */
  const enginePlay = (param?: Parameters<TimelineExpose['play']>[0]): boolean => {
    return engineRef.value.isPaused && engineRef.value.play({ ...param });
  };
  const timeLineStateProps: TimeLineStateContextProps = {
    editorData,
    scrollInfo,
    isPlaying,
    cursorTime,
    scaleUnit,
    frameWidth,
    hasMainRow,
    timeLineEditorRef,
    timeLineMaxEndTime,
    engineRef,
    handleSetCursor,
    setCursorByPos,
    enginePause,
    enginePlay
  };
  const provideTimeLineStateContext = (context?: Partial<TimeLineStateContextProps>) => {
    return useProvide(Object.assign(timeLineStateProps, context || {}));
  };
  const injectTimeLineStateContext = () => {
    return useInject();
  };
  return {
    provideTimeLineStateContext,
    injectTimeLineStateContext
  };
}

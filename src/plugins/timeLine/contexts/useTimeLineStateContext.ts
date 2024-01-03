import type { ShallowRef } from 'vue';
import { useContext } from '../hooks';
export interface TimeLineStateContextProps {
  /**
   * @description 刻度单位（ms/px）
   */
  scaleUnit: Ref<number>;
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
   * @description 设置scrollLeft
   * @param {number} delta
   * @returns {void}
   */
  setDeltaScrollLeft(delta: number): void;
}
const { useInject, useProvide } = useContext<TimeLineStateContextProps>('TimeLineStateContext', {
  native: true
});
export default function useTimeLineStateContext() {
  // 刻度单位（ms/px）
  const scaleUnit = ref<number>(0);
  // 一帧width
  const frameWidth = ref<number>(0);
  // 是否有时间主轴
  const hasMainRow = ref<boolean>(false);
  // 时间线编辑区域容器DOM
  const timeLineEditorRef = shallowRef<HTMLElement | null | undefined>(null);
  // 时间线最大时间
  const timeLineMaxEndTime = ref<number>(0);
  // 根据delta设置scrollLeft
  const setDeltaScrollLeft = (delta: number) => {
    if (!timeLineEditorRef.value) return;
    const data = timeLineEditorRef.value.scrollLeft + delta;
    // 当超过最大距离时，禁止自动滚动
    if (data > timeLineEditorRef.value.scrollWidth - timeLineEditorRef.value.clientWidth) return;
    timeLineEditorRef.value.scrollLeft = data;
  };
  const timeLineStateProps: TimeLineStateContextProps = {
    scaleUnit,
    frameWidth,
    hasMainRow,
    timeLineEditorRef,
    setDeltaScrollLeft,
    timeLineMaxEndTime
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

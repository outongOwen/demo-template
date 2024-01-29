import { ref, shallowRef } from 'vue';
import { createGlobalState, useScroll, useElementSize, useElementBounding, reactiveComputed } from '@vueuse/core';
import type { ITimelineEngine } from '../core';
import { TimelineEngine } from '../core';
import type { TimeLineEditorProps, TimeLineEditorEmits, TimelineRow, TimelineAction, TimelineExpose } from '../types';
interface PreviewCursorState {
  state: boolean;
  time: number;
}
export const useTimeLineStore = createGlobalState(() => {
  // 共享props数据
  const shareProps = ref<TimeLineEditorProps>({});
  // 共享emits
  const shareEmits = ref<TimeLineEditorEmits>({});
  // 时间引擎
  const engine = shallowRef<ITimelineEngine>(new TimelineEngine());
  // 时间引擎状态
  const engineState = reactive({
    isPlaying: false,
    isPaused: true
  });
  // 时间线数据
  const timeLineEditorData = ref<TimelineRow[]>([]);
  // 当前指针时间
  const cursorTime = ref<number>(0);
  // 时间线编辑区域容器DOM
  const timeLineEditorDomRef = shallowRef<HTMLElement>();
  // 滚动条信息
  const scrollInfo = useScroll(timeLineEditorDomRef);
  // 剪辑区域尺寸
  const timeLineEditorDomSize = useElementSize(timeLineEditorDomRef);
  // 剪辑区域视图信息
  const timeLineEditorViewSize = useElementBounding(timeLineEditorDomRef);
  // 预览指针状态
  const previewCursorState = reactive<PreviewCursorState>({
    state: false,
    time: 0
  });
  /** *******************getters**************************/

  const getters = {
    getShareProps: reactiveComputed(() => shareProps.value),
    getShareEmits: reactiveComputed(() => shareEmits.value),
    getEngine: reactiveComputed(() => engine.value),
    getEngineState: reactiveComputed(() => engineState),
    getTimeLineEditorData: computed(() => timeLineEditorData.value),
    getTimeLineEditorDomRef: computed(() => timeLineEditorDomRef.value),
    getScrollDomSize: reactiveComputed(() => {
      return {
        height: timeLineEditorViewSize.height.value - timeLineEditorDomSize.height.value,
        width: timeLineEditorViewSize.width.value - timeLineEditorDomSize.width.value
      };
    }),
    // 剪辑区域起始坐标
    getTimeLineEditorOriginCoords: reactiveComputed(() => {
      return {
        left: timeLineEditorViewSize.left.value + Number(shareProps.value.leftOffset!),
        top: timeLineEditorViewSize.top.value,
        right: timeLineEditorViewSize.right.value,
        bottom: timeLineEditorViewSize.bottom.value
      };
    }),
    getTimeLineMaxEndTime: computed(() => {
      return unref(timeLineEditorData).reduce((prev, cur) => {
        // 通过actions中最大end值计算最大宽度
        const maxTime = cur.actions.reduce((aPrev: number, aCur: TimelineAction) => {
          return Math.max(aPrev, aCur.end);
        }, 0);
        return Math.max(prev, maxTime);
      }, 0);
    }),
    getCursorTime: computed(() => cursorTime.value),
    getFrameWidth: computed(() => {
      return (
        1000 /
        Number(shareProps.value.fps) /
        (Number(shareProps.value.scaleSmallCellMs) / Number(shareProps.value.scaleSmallCellWidth))
      );
    }),
    getScaleUnit: computed(() => {
      return Number(shareProps.value.scaleSmallCellMs) / Number(shareProps.value.scaleSmallCellWidth);
    }),
    getPreviewCursorState: reactiveComputed(() => {
      const state = previewCursorState.state && shareProps.value.previewCursor && !engineState.isPlaying;
      return {
        state,
        time: previewCursorState.time
      };
    })
  };

  /** ********************actions*************************/

  const actions = {
    setShareProps: props => {
      shareProps.value = props;
    },
    setShareEmits: emits => {
      shareEmits.value = emits;
    },
    setEngine: outerEngine => {
      engine.value = outerEngine;
    },
    setEngineState: ({ isPlaying, isPaused }: { isPlaying?: boolean; isPaused?: boolean }) => {
      isPlaying !== undefined && (engineState.isPlaying = isPlaying);
      isPaused !== undefined && (engineState.isPaused = isPaused);
    },
    setTimeLineEditorData: data => {
      timeLineEditorData.value = data;
    },
    setTimeLineEditorDomRef: dom => {
      timeLineEditorDomRef.value = dom;
    },
    /**
     * @description 设置预览指针状态
     */
    setPreviewCursorState: ({ state, time }: Partial<PreviewCursorState>) => {
      state !== undefined && (previewCursorState.state = state);
      time !== undefined && (previewCursorState.time = time);
      if (time !== undefined) {
        const result = engine.value.setTime(time);
        result && engine.value.reRender();
      }
    },
    /**
     * @description 设置光标时间
     * @param time
     * @param updateTime
     * @returns
     */
    setCursorTime: (time: number, updateTime = true) => {
      let result = true;
      if (updateTime) {
        result = engine.value.setTime(time);
        engine.value.reRender();
      }
      result && (cursorTime.value = time);
      return result;
    },
    /**
     * @description 根据位置设置光标
     * @param posX 当前位置
     * @type {number}
     * @returns {void}
     */
    setCursorTimeByPos: (clientX: number) => {
      const posX = clientX - getters.getTimeLineEditorOriginCoords.left + scrollInfo.x.value;
      const curX = Math.round(posX / Number(getters.getFrameWidth.value)) * Number(getters.getFrameWidth.value);
      let time = curX * Number(getters.getScaleUnit.value);
      time = time < 0 ? 0 : time;
      time = time > getters.getTimeLineMaxEndTime.value ? getters.getTimeLineMaxEndTime.value : time; //  限制0-duration;
      actions.setCursorTime(Math.round(time)); // seek时间
    },
    /**
     * @description 引擎播放
     * @params params
     * @type {Parameters<TimelineExpose['play']>[0]}
     * @returns {void}
     */
    enginePlay: (param?: Parameters<TimelineExpose['play']>[0]): boolean => {
      return engine.value.isPaused && engine.value.play({ ...param });
    },
    /**
     * @description 引擎暂停
     * @returns {void}
     */
    enginePause: () => {
      engine.value.isPlaying && engine.value.pause();
    },
    scrollTo: (options: ScrollToOptions) => {
      options && timeLineEditorDomRef.value?.scrollTo(options);
    },
    /**
     *
     * @param deltaX
     * @param   deltaY
     */
    scrollBy: (options: ScrollToOptions) => {
      options && timeLineEditorDomRef.value?.scrollBy(options);
    }
  };

  return {
    timeLineEditorDomSize,
    timeLineEditorViewSize,
    scrollInfo,
    ...getters,
    ...actions
  };
});

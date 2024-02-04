import { ref, shallowRef } from 'vue';
import { isArray, isUndefined } from 'lodash';
import { createGlobalState, useScroll, useElementSize, useElementBounding, reactiveComputed } from '@vueuse/core';
import type { ITimelineEngine } from '../core';
import { TimelineEngine } from '../core';
import type { TimeLineEditorProps, TimeLineEditorEmits, TimelineRow, TimelineAction, TimelineExpose } from '../types';
interface PreviewCursorState {
  state: boolean;
  time: number;
}
interface InteractState {
  target: 'action' | 'cursor' | '';
  type: 'dragmove' | 'resizemove' | '';
  stage: 'start' | 'move' | 'end' | '';
  active: boolean;
  id: string;
}
interface EngineState {
  isPlaying: boolean;
  isPaused: boolean;
}
export const useTimeLineStore = createGlobalState(() => {
  // 共享props数据
  const shareProps = ref<TimeLineEditorProps>({});
  // 共享emits
  const shareEmits = ref<TimeLineEditorEmits>({});
  // 时间引擎
  const engine = shallowRef<ITimelineEngine>(new TimelineEngine());
  // 时间引擎状态
  const engineState = reactive<EngineState>({
    isPlaying: false,
    isPaused: true
  });
  // 交互状态
  const interactState = reactive<InteractState>({
    target: '',
    type: '',
    stage: '',
    active: false,
    id: ''
  });
  // 预览指针开启状态
  const previewCursorState = reactive<PreviewCursorState>({
    state: false,
    time: 0
  });
  // 当前指针时间
  const cursorTime = ref<number>(0);
  // 时间线编辑区域容器DOM
  const timeLineClipDomRef = shallowRef<HTMLElement>();
  // 剪辑区内部尺寸
  const timeLineClipInnerSize = reactive({
    height: 0,
    width: 0
  });
  // 滚动条信息
  const scrollInfo = useScroll(timeLineClipDomRef);
  // 剪辑区域尺寸
  const timeLineClipDomSize = useElementSize(timeLineClipDomRef);
  // 剪辑区域视图信息
  const timeLineClipViewSize = useElementBounding(timeLineClipDomRef);
  /** *******************getters**************************/

  const getters = {
    getTimeLineClipDomSize: reactiveComputed(() => timeLineClipDomSize),
    getTimeLineClipViewSize: reactiveComputed(() => timeLineClipViewSize),
    getTimeLineClipInnerSize: reactiveComputed(() => timeLineClipInnerSize),
    getScrollInfo: reactiveComputed(() => scrollInfo),
    getShareProps: reactiveComputed(() => shareProps.value),
    getShareEmits: reactiveComputed(() => shareEmits.value),
    getEngine: reactiveComputed(() => engine.value),
    getEngineState: reactiveComputed(() => engineState),
    getTimeLineEditorData: computed((): Array<TimelineRow> => {
      return isArray(shareProps.value.editorData) ? shareProps.value.editorData : [];
    }),
    getTimeLineClipDomRef: computed(() => timeLineClipDomRef.value),
    getScrollDomSize: reactiveComputed(() => {
      return {
        height: timeLineClipViewSize.height.value - timeLineClipDomSize.height.value,
        width: timeLineClipViewSize.width.value - timeLineClipDomSize.width.value
      };
    }),
    // 剪辑区域起始坐标
    getTimeLineEditorOriginCoords: reactiveComputed(() => {
      return {
        left: timeLineClipViewSize.left.value + Number(shareProps.value.leftOffset!),
        top: timeLineClipViewSize.top.value,
        right: timeLineClipViewSize.right.value,
        bottom: timeLineClipViewSize.bottom.value
      };
    }),
    getTimeLineDuration: computed(() => {
      if (!isArray(unref(shareProps).editorData)) return 0;
      return unref(shareProps).editorData!.reduce((prev, cur) => {
        // 通过actions中最大end值计算最大宽度
        const maxTime = cur.actions.reduce((aPrev: number, aCur: TimelineAction) => {
          return Math.max(aPrev, aCur.end);
        }, 0);
        return Math.max(prev, maxTime);
      }, 0);
    }),
    getCursorTime: computed(() => cursorTime.value),
    getPreviewCursorState: reactiveComputed(() => {
      return {
        state:
          previewCursorState.state && shareProps.value.previewCursor && engineState.isPaused && !interactState.active,
        time: previewCursorState.time
      };
    }),
    getInteractState: reactiveComputed(() => interactState)
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
    setEngineState: (state: EngineState) => {
      const { isPaused, isPlaying } = state;
      engineState.isPlaying = isPlaying ?? engineState.isPlaying;
      engineState.isPaused = isPaused ?? engineState.isPaused;
    },
    setTimeLineClipDomRef: dom => {
      timeLineClipDomRef.value = dom;
    },
    setTimeLineClipInnerSize: (size: { height: number; width: number }) => {
      const { height, width } = size;
      timeLineClipInnerSize.height = height ?? timeLineClipInnerSize.height;
      timeLineClipInnerSize.width = width ?? timeLineClipInnerSize.width;
    },
    /**
     * @description 设置交互状态
     * @param state
     * @returns
     */
    setInteractState: (state: Partial<InteractState>) => {
      const { target, type, stage, active, id } = state;
      interactState.type = type ?? interactState.type;
      interactState.stage = stage ?? interactState.stage;
      interactState.active = active ?? interactState.active;
      interactState.id = id ?? interactState.id;
      interactState.target = target ?? interactState.target;
    },
    /**
     * @description 设置预览指针状态
     */
    setPreviewCursorState: (state: Partial<PreviewCursorState>, update = true) => {
      const { state: cursorSate, time } = state;
      previewCursorState.state = cursorSate ?? previewCursorState.state;
      if (!isUndefined(time) && update) {
        previewCursorState.time = time;
        const result = engine.value.setTime(time);
        result && engine.value.resetRenderEngine();
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
        engine.value.resetRenderEngine();
      }
      result && (cursorTime.value = time);
      return result;
    },
    /**
     * @description 根据位置设置光标
     * @param posX 当前位置
     * @type {number}
     * @returns {number} 当前时间
     */
    setCursorTimeByPos: (clientX: number, scaleUnit: number, frameWidth: number): number => {
      const posX =
        clientX - (timeLineClipViewSize.left.value + Number(shareProps.value.leftOffset!)) + scrollInfo.x.value;
      const curX = Math.round(posX / frameWidth) * frameWidth;
      let time = curX * Number(scaleUnit);
      time = time < 0 ? 0 : time;
      time = time > getters.getTimeLineDuration.value ? getters.getTimeLineDuration.value : time; //  限制0-duration;
      actions.setCursorTime(time); // seek时间
      return time;
    },
    syncViewScrollByCursorTime: (unit: number) => {
      const offset = unref(cursorTime) / unit;
      console.log(offset, 'offset');
      console.log(unit, 'unit');
      // timeLineClipDomRef.value?.scrollTo({
      //   left: offset - timeLineClipDomSize.width.value
      // });
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
      options && timeLineClipDomRef.value?.scrollTo(options);
    },
    /**
     *
     * @param deltaX
     * @param   deltaY
     */
    scrollBy: (options: ScrollToOptions) => {
      options && timeLineClipDomRef.value?.scrollBy(options);
    }
  };

  return {
    ...getters,
    ...actions
  };
});

import { ref } from 'vue';
import { isUndefined, isFinite } from 'lodash';
import { createGlobalState, reactiveComputed, useElementBounding } from '@vueuse/core';
import Mapping from '../utils/map';
import type { TimeLineEditorProps } from '../types';
import { DEFAULT_FRAME_WIDTH, DEFAULT_FPS, DEFAULT_MAX_FRAME_WIDTH } from '../const';
export const useTimeLineScaleStore = createGlobalState(() => {
  // 共享props数据
  const shareProps = ref<TimeLineEditorProps>({});
  // 时间线编辑区域容器DOM
  const timeLineClipDomRef = shallowRef<HTMLElement>();
  // 剪辑区域尺寸
  // const timeLineClipDomSize = useElementSize(timeLineClipDomRef);
  // 剪辑区域视图信息
  const timeLineClipViewSize = useElementBounding(timeLineClipDomRef);
  // 帧宽度
  const frameWidth = ref(DEFAULT_FRAME_WIDTH);
  //   最大帧宽度
  const maxFrameWidth = ref(DEFAULT_MAX_FRAME_WIDTH);
  // fps
  const fps = computed(() => shareProps.value.fps ?? DEFAULT_FPS);
  // 最大帧数量
  const maxFrameNumbers = computed(() =>
    !isUndefined(unref(shareProps).editorData)
      ? Mapping.getMaxFrameNumbers(unref(shareProps).editorData!, Number(unref(fps)))
      : 0
  );
  // 最小帧宽度
  const minFrameWidth = computed(() =>
    Mapping.getMinFrameWidth(maxFrameNumbers.value, timeLineClipViewSize.width.value)
  );
  // 适应帧宽度
  const fitFrameWidth = computed(() =>
    Mapping.getFitFrameWidth(maxFrameNumbers.value, timeLineClipViewSize.width.value)
  );
  //   格子缓存列表
  const gridBufferList = ref<
    Array<{
      frame: number;
      showNumber: boolean;
      width: number;
    }>
  >([]);
  // 格子信息
  const gidInfo = reactiveComputed(() => {
    return Mapping.frameWidth2Grid(unref(frameWidth), Number(unref(fps)));
  });
  const getters = {
    getFrameWidth: computed(() => frameWidth.value),
    getGridBufferList: reactiveComputed(() => gridBufferList.value),
    getGridInfo: reactiveComputed(() => gidInfo),
    getMaxFrameNumber: computed(() => maxFrameNumbers.value),
    getMaxFrameWidth: computed(() => maxFrameWidth.value),
    getMinFrameWidth: computed(() => minFrameWidth.value),
    getFitFrameWidth: computed(() => fitFrameWidth.value),
    getScaleUnit: computed(() => {
      return 1000 / Number(unref(fps)) / frameWidth.value;
    })
  };
  const actions = {
    setFrameWidth: (width: number) => {
      frameWidth.value = width;
    },
    setSharePropsToScale: (props: TimeLineEditorProps) => {
      shareProps.value = props;
    },
    setTimeLineClipDomRefToScale: (dom: HTMLElement) => {
      timeLineClipDomRef.value = dom;
    },
    zoomFit: () => {
      if (isFinite(fitFrameWidth.value)) {
        frameWidth.value = fitFrameWidth.value;
      }
    },
    zoomIn: (): boolean => {
      if (maxFrameNumbers.value === 0 || frameWidth.value === maxFrameWidth.value) return false;
      const targetFrameWidth = frameWidth.value * 2;
      frameWidth.value = targetFrameWidth > maxFrameWidth.value ? maxFrameWidth.value : targetFrameWidth;
      return true;
    },
    zoomOut: (): boolean => {
      if (maxFrameNumbers.value === 0 || frameWidth.value === minFrameWidth.value) return false;
      const targetFrameWidth = frameWidth.value / 2;
      frameWidth.value = targetFrameWidth < minFrameWidth.value ? minFrameWidth.value : targetFrameWidth;
      return true;
    }
  };
  return {
    ...getters,
    ...actions
  };
});

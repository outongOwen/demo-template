import { ref } from 'vue';
import { createGlobalState, reactiveComputed, useElementBounding, useScroll } from '@vueuse/core';
import Mapping from '../utils/map';
import type { TimeLineEditorProps } from '../types';
import { DEFAULT_FRAME_WIDTH } from '../const';
export const useTimeLineScaleStore = createGlobalState(() => {
  // 共享props数据
  const shareProps = ref<TimeLineEditorProps>({});
  // 时间线编辑区域容器DOM
  const timeLineClipDomRef = shallowRef<HTMLElement>();
  // 剪辑区内部尺寸
  const timeLineClipInnerSize = reactive({
    height: 0,
    width: 0
  });
  // 剪辑区域尺寸
  // const timeLineClipDomSize = useElementSize(timeLineClipDomRef);
  // 剪辑区域视图信息
  const timeLineClipViewSize = useElementBounding(timeLineClipDomRef);
  // 滚动条信息
  const scrollInfo = useScroll(timeLineClipDomRef);
  // 帧宽度
  const frameWidth = ref(DEFAULT_FRAME_WIDTH);
  //   格子缓存列表
  const gridBufferList = ref<
    Array<{
      frame: number;
      showNumber: boolean;
      width: number;
    }>
  >([]);
  // // 格子宽度
  // const gridWidth = ref(0)
  const getters = {
    getTimeLineClipInnerSize: reactiveComputed(() => timeLineClipInnerSize),
    getFrameWidth: computed(() => frameWidth.value),
    getGridInfo: computed(() => Mapping.frameWidth2Grid(unref(frameWidth), Number(shareProps.value.fps))),
    getGridBufferList: reactiveComputed(() => gridBufferList.value)
  };
  const actions = {
    setTimeLineClipInnerSize: (size: { height: number; width: number }) => {
      const { height, width } = size;
      timeLineClipInnerSize.height = height ?? timeLineClipInnerSize.height;
      timeLineClipInnerSize.width = width ?? timeLineClipInnerSize.width;
    },
    setFrameWidth: (width: number) => {
      frameWidth.value = width;
    },
    setSharePropsToScale: (props: TimeLineEditorProps) => {
      shareProps.value = props;
    },
    setTimeLineClipDomRefToScale: (dom: HTMLElement) => {
      timeLineClipDomRef.value = dom;
    },
    updateGridBufferList: () => {
      Mapping.renderGridBufferList(gridBufferList, {
        gridWidth: unref(getters.getGridInfo).gridWidth!,
        groupGridFrame: unref(getters.getGridInfo).groupGridFrame!,
        gridFrame: unref(getters.getGridInfo).gridFrame!,
        offsetLeft: scrollInfo.x.value,
        timeLineWidth: timeLineClipViewSize.width.value
      });
    }
  };
  return {
    ...getters,
    ...actions
  };
});

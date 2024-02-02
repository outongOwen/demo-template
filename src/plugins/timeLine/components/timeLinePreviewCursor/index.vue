<template>
  <div
    v-show="isShowPreviewCursor"
    ref="previewCursorRef"
    class="timeLine-preview-cursor-line"
    :style="{
      transform: `translateX(${translateX - getScrollInfo.x}px)`,
      left: `${Number(getShareProps.leftOffset) - 1}px`,
      top: `${Number(getShareProps.scaleHeight) / 2}px`,
      height: `calc(100% - ${Number(getShareProps.scaleHeight) / 2 + getScrollDomSize.height}px)`
    }"
  />
</template>

<script setup lang="ts">
import { useParentElement, useEventListener } from '@vueuse/core';
import { useTimeLineStore } from '../../store';
import { useActionGuideLine } from '../../hooks';
defineOptions({
  name: 'TimeLinePreviewCursor'
});
const {
  getShareProps,
  getScrollDomSize,
  getTimeLineClipViewSize,
  getFrameWidth,
  getScaleUnit,
  setPreviewCursorState,
  getTimeLineMaxEndTime,
  getCursorTime,
  getTimeLineEditorData,
  getScrollInfo
} = useTimeLineStore();
const { dragLineActionLine, defaultGetAllAssistPosition, initDragLine, disposeDragLine } = useActionGuideLine();
const isShowPreviewCursor = ref(true);
const translateX = ref(0);
const parentElement = useParentElement();
const previewCursorRef = ref<HTMLElement>();
// 滚动增量
// const scrollDelta = ref(0);
const previewTime = computed(() => {
  return Math.round(translateX.value * unref(getScaleUnit));
});
// 初始化辅助线
const handleInitGuideLine = () => {
  if (unref(getShareProps.autoAdsorption)) {
    const assistPositions = defaultGetAllAssistPosition({
      editorData: toRaw(unref(getTimeLineEditorData)),
      scaleUnit: unref(getScaleUnit),
      extendPos: [0, unref(getCursorTime) / unref(getScaleUnit)]
    });
    initDragLine({ assistPositions });
  }
};
// 鼠标移动更新预览光标位置
const updateTranslateX = realClientX => {
  let curMouseX = realClientX;
  curMouseX = Math.round(curMouseX / getFrameWidth.value) * getFrameWidth.value;
  translateX.value = Math.max(0, curMouseX);
  if (previewTime.value <= unref(getTimeLineMaxEndTime)) {
    setPreviewCursorState({ time: unref(previewTime) });
  } else {
    setPreviewCursorState({ time: unref(getTimeLineMaxEndTime) });
  }
};
// 吸附功能
const handleAdsorption = () => {
  const disList: number[] = [];
  dragLineActionLine.assistPositions.forEach(item => {
    const dis = Math.abs(item - translateX.value);
    if (dis < Number(unref(getShareProps.adsorptionDistance)) && dis < Number.MAX_SAFE_INTEGER) {
      disList.push(item);
      const minDis = Math.min(...disList);
      const curTranslateX = minDis;
      updateTranslateX(curTranslateX);
    }
  });
};

watchEffect(() => {
  const state =
    Math.abs(unref(getCursorTime) - unref(previewTime)) >
    unref(getScaleUnit) * Number(getShareProps.adsorptionDistance);
  isShowPreviewCursor.value = state;
});
// watch(
//   () => getScrollInfo.x,
//   (newValue, oldValue) => {
//     scrollDelta.value = newValue - oldValue;
//   }
// );
useEventListener(parentElement, 'mousemove', (event: MouseEvent) => {
  // scrollDelta.value = 0;
  const realClientX = event.clientX - Number(getShareProps.leftOffset) - getTimeLineClipViewSize.left + getScrollInfo.x;
  updateTranslateX(realClientX);
  getShareProps.autoAdsorption && handleAdsorption();
});
// useEventListener(getTimeLineClipDomRef, 'scroll', () => {
//   const curTranslateX = translateX.value + scrollDelta.value;
//   updateTranslateX(curTranslateX);
// });
onMounted(() => {
  disposeDragLine();
  handleInitGuideLine();
  translateX.value = unref(getCursorTime) / unref(getScaleUnit);
});
onBeforeUnmount(() => {
  setPreviewCursorState({ time: unref(getCursorTime) });
});
</script>

<style scoped lang="scss">
.timeLine-preview-cursor-line {
  pointer-events: none;
  user-select: none;
  touch-action: none;
  position: absolute;
  width: 0;
  height: 100%;
  border-left: 2px solid rgb(82, 151, 255, 0.6);
  z-index: 9;
}
</style>

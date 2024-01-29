<template>
  <div
    v-show="isShowPreviewCursor && isMoving"
    ref="previewCursorRef"
    class="timeLine-preview-cursor-line"
    :style="{
      transform: `translateX(${translateX}px)`,
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
  timeLineEditorViewSize,
  getFrameWidth,
  getScaleUnit,
  setPreviewCursorState,
  getTimeLineMaxEndTime,
  getCursorTime,
  getTimeLineEditorData,
  scrollInfo,
  getTimeLineEditorDomRef
} = useTimeLineStore();
const { dragLineActionLine, defaultGetAllAssistPosition, initDragLine, disposeDragLine } = useActionGuideLine();
const isShowPreviewCursor = ref(true);
const isMoving = ref(false);
const translateX = ref(0);
const parentElement = useParentElement();
const previewCursorRef = ref<HTMLElement>();
// const { left } = useElementBounding(previewCursorRef);
const previewTime = computed(() => {
  return Math.round((translateX.value + scrollInfo.x.value) * unref(getScaleUnit));
});
// 初始化辅助线
const handleInitGuideLine = () => {
  if (unref(getShareProps.cursorAdsorption)) {
    const assistPositions = defaultGetAllAssistPosition({
      editorData: toRaw(unref(getTimeLineEditorData)),
      scaleUnit: unref(getScaleUnit),
      extendPos: [unref(getCursorTime) / unref(getScaleUnit)]
    });
    initDragLine({ assistPositions });
  }
};
// 吸附功能
const handleAdsorption = () => {
  const disList: number[] = [];
  dragLineActionLine.assistPositions.forEach(item => {
    const dis = Math.abs(item - (translateX.value + unref(scrollInfo.x.value)));
    if (dis < Number(unref(getShareProps.guideAdsorptionDistance)) && dis < Number.MAX_SAFE_INTEGER) {
      disList.push(item);
      const minDis = Math.min(...disList);
      translateX.value = minDis - unref(scrollInfo.x.value);
    }
  });
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
watchEffect(() => {
  const state =
    Math.abs(unref(getCursorTime) - unref(previewTime)) >
    unref(getScaleUnit) * Number(getShareProps.guideAdsorptionDistance);
  isShowPreviewCursor.value = state;
});
const lastScrollLeft = ref(0);
useEventListener(parentElement, 'mousemove', (event: MouseEvent) => {
  isMoving.value = true;
  lastScrollLeft.value = 0;
  const realClientX = event.clientX - Number(getShareProps.leftOffset) - timeLineEditorViewSize.left.value;
  updateTranslateX(realClientX);
  handleAdsorption();
});
useEventListener(parentElement, 'mouseleave', () => {
  isMoving.value = false;
});

useEventListener(getTimeLineEditorDomRef, 'scroll', () => {
  const curTranslateX =
    Math.round((translateX.value + scrollInfo.x.value) * unref(getFrameWidth)) / unref(getFrameWidth);
  const curPreviewTime = Math.round(curTranslateX * unref(getScaleUnit));
  if (curPreviewTime <= unref(getTimeLineMaxEndTime)) {
    setPreviewCursorState({ time: unref(curPreviewTime) });
  } else {
    setPreviewCursorState({ time: unref(getTimeLineMaxEndTime) });
  }
});
onMounted(() => {
  handleInitGuideLine();
});
onBeforeUnmount(() => {
  disposeDragLine();
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

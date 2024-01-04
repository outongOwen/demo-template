<!--
 * new page
 * @author: owenTong
 * @since: 2023-07-13
 * index.vue
-->
<template>
  <div
    ref="cursorLineRef"
    class="cursor-line"
    :data-left="translateX"
    :style="{
      transform: `translateX(${translateX - scrollLeft}px)`,
      left: `${leftOffset}px`
    }"
  >
    <div class="cursor-line-top" />
    <div class="cursor-line-area" />
    <div class="absolute left-5px top-0">{{ cursorTime }}</div>
  </div>
</template>

<script setup lang="ts">
import interact from 'interactjs';
import { reactiveComputed } from '@vueuse/core';
import type { DragEvent } from '@interactjs/types';
import { useTimeLineContext, useTimeLineStateContext } from '../../contexts';
interface Props {
  scrollLeft: number;
}
defineOptions({
  name: 'TimeLineCursor'
});
const props = defineProps<Props>();
const { scrollLeft } = toRefs(props);
const { injectTimeLineContext } = useTimeLineContext();
const { injectTimeLineStateContext } = useTimeLineStateContext();
const timeLineContext = injectTimeLineContext();
const timeLineStateContext = injectTimeLineStateContext();
const { leftOffset } = toRefs(timeLineContext);
const { scaleUnit, timeLineEditorRef, frameWidth } = timeLineStateContext;
const cursorLineRef = ref<HTMLElement>();
const cursorTime = ref(0);
const translateX = ref(0);
watch(scaleUnit, () => {
  translateX.value = unref(cursorTime) / unref(scaleUnit);
});
const restrictRect = reactiveComputed(() => {
  return interact.modifiers.restrict({
    restriction: timeLineEditorRef.value!,
    elementRect: { left: 0, right: 0, top: 0, bottom: 0 },
    offset: {
      left: 10,
      top: 0,
      bottom: 0,
      right: 0
    }
  });
});
const modifiersSnap = reactiveComputed(() => {
  return interact.modifiers.snap({
    targets: [
      interact.createSnapGrid({
        x: unref(frameWidth),
        y: 1
      })
    ],
    offset: { x: 5, y: 0 },
    relativePoints: [{ x: 0, y: 0 }]
  });
});
const handleMoveStart = (event: DragEvent) => {
  console.log('handleMoveStart', event);
};
const handleMove = (event: DragEvent) => {
  const target = event.target;
  const { left } = target.dataset;
  let curLeft = parseFloat(left || '0') + event.dx;
  curLeft < 0 && (curLeft = 0);
  curLeft =
    Number(curLeft) % unref(frameWidth) > unref(frameWidth) / 2
      ? Number(curLeft) - (Number(curLeft) % unref(frameWidth)) + unref(frameWidth)
      : Number(curLeft) - (Number(curLeft) % unref(frameWidth));
  translateX.value = curLeft;
  cursorTime.value = Math.round(curLeft * unref(scaleUnit));
};
const handleMoveEnd = (event: DragEvent) => {
  console.log('handleMoveEnd', event);
};
onMounted(() => {
  interact(cursorLineRef.value!, {
    deltaSource: 'client',
    context: timeLineEditorRef.value!
  }).draggable({
    modifiers: [modifiersSnap, restrictRect],
    onstart: handleMoveStart,
    onmove: handleMove,
    onend: handleMoveEnd,
    cursorChecker: () => 'ew-resize'
  });
  translateX.value = unref(cursorTime) / unref(scaleUnit);
});
</script>

<style scoped lang="scss">
.cursor-line {
  cursor: ew-resize !important;
  position: absolute;
  top: 28px;
  height: calc(100% - 36px);
  box-sizing: border-box;
  border-left: 1px solid #5297ff;
  border-right: 1px solid #5297ff;
  z-index: 99999;
  // 禁止选中
  user-select: none;

  &-top::before {
    content: '';
    position: absolute;
    z-index: 2;
    top: -10px;
    left: -5px;
    width: 10px;
    height: 10px;
    background-color: #5297ff;
  }
  &-top::after {
    content: '';
    position: absolute;
    z-index: 2;
    top: 0;
    left: -5px;
    border-top: 5px solid #5297ff;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: none;
  }
  &-area {
    width: 16px;
    height: 100%;
    cursor: ew-resize;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>

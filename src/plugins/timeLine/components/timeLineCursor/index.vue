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
      transform: `translateX(${translateX - unref(scrollInfo.x)}px)`,
      left: `${leftOffset}px`
    }"
    :class="{
      'active-state-cursor': activeStateCursor
    }"
  >
    <div class="cursor-line-top" />
    <div class="cursor-line-area" />
    <div class="absolute left-5px top-0">{{ cursorTime }}</div>
  </div>
</template>

<script setup lang="ts">
import { unref } from 'vue';
import interact from 'interactjs';
import { reactiveComputed } from '@vueuse/core';
import type { DragEvent, Interactable } from '@interactjs/types';
import { useTimeLineContext, useTimeLineStateContext } from '../../contexts';
import { useActionGuideLine } from '../../hooks';
defineOptions({
  name: 'TimeLineCursor'
});
const { injectTimeLineContext } = useTimeLineContext();
const { injectTimeLineStateContext } = useTimeLineStateContext();
const timeLineContext = injectTimeLineContext();
const timeLineStateContext = injectTimeLineStateContext();
const { leftOffset, guideAdsorptionDistance, cursorAdsorption, editorData } = toRefs(timeLineContext);
const { scaleUnit, timeLineEditorRef, frameWidth, cursorTime, scrollInfo, handleSetCursor, timeLineMaxEndTime } =
  timeLineStateContext;
const cursorLineRef = ref<HTMLElement>();
const translateX = ref(0);
const interactable = shallowRef<Interactable>();
const { dragLineActionLine, defaultGetAllAssistPosition, initDragLine, disposeDragLine } = useActionGuideLine();
// 初始化辅助线
const handleInitGuideLine = () => {
  if (unref(cursorAdsorption)) {
    const assistPositions = defaultGetAllAssistPosition({
      editorData: editorData!.value!,
      scaleUnit: scaleUnit.value
    });
    initDragLine({ assistPositions, targetType: 'cursor' });
  }
};
watch(scaleUnit, () => {
  translateX.value = unref(cursorTime) / unref(scaleUnit);
  nextTick(() => {
    unref(timeLineEditorRef)!.scrollLeft = translateX.value - unref(timeLineEditorRef)!.clientWidth / 2;
  });
});
watch(cursorTime, () => {
  translateX.value = unref(cursorTime) / unref(scaleUnit);
});
const activeStateCursor = computed(() => {
  return (
    dragLineActionLine.isMoving &&
    dragLineActionLine.targetType === 'action' &&
    dragLineActionLine.movePositions.some(left => {
      const dis = Math.abs(left - translateX.value);
      console.log(dis, 'dissss');
      return Math.round(dis) <= 0.001;
    })
  );
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
const guideSnap = reactiveComputed(() => {
  return interact.modifiers.snap({
    origin: timeLineEditorRef.value!,
    targets: [
      interact.createSnapGrid({
        x: unref(frameWidth),
        y: 1,
        limits: {
          left: 0,
          right: unref(timeLineMaxEndTime) / unref(scaleUnit) - unref(scrollInfo.x),
          bottom: Infinity,
          top: -Infinity
        }
      })
    ],
    offset: { x: 10, y: 0 },
    relativePoints: [{ x: 0, y: 0 }]
  });
});
const adsorbSnap = reactiveComputed(() => {
  return interact.modifiers.snap({
    origin: timeLineEditorRef.value!,
    targets: [
      (x, y) => {
        const minDis = Number.MAX_SAFE_INTEGER;
        let adsorption = x;
        dragLineActionLine.assistPositions.forEach(item => {
          const dis = Math.abs(item - scrollInfo.x.value - adsorption);
          if (dis < unref(guideAdsorptionDistance)! && dis < minDis) adsorption = item - scrollInfo.x.value;
        });
        const newX = adsorption;
        return {
          x: newX,
          y
        };
      }
    ],
    offset: { x: 10, y: 0 },
    relativePoints: [{ x: 0, y: 0 }]
  });
});
const handleMoveStart = (event: DragEvent) => {
  console.log(event);
  handleInitGuideLine();
};
const handleMove = (event: DragEvent) => {
  const target = event.target;
  const { left } = target.dataset;
  let curLeft = parseFloat(left || '0') + event.dx;
  curLeft = Math.round(curLeft / unref(frameWidth)) * unref(frameWidth);
  handleSetCursor(Math.round(curLeft * unref(scaleUnit)));
};
const handleMoveEnd = (event: DragEvent) => {
  console.log('handleMoveEnd', event);
  disposeDragLine();
};

const initInteract = () => {
  const interactInst = interact(cursorLineRef.value!, {
    deltaSource: 'client'
  });
  interactable.value = interactInst;
  interactInst.draggable({
    modifiers: [restrictRect, guideSnap, adsorbSnap],
    onstart: handleMoveStart,
    onmove: handleMove,
    onend: handleMoveEnd,
    cursorChecker: () => 'ew-resize'
  });
};
onMounted(() => {
  initInteract();
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
.active-state-cursor {
  border-left: 1px solid #fff !important;
  border-right: 1px solid #fff !important;
  .cursor-line-top::before {
    background-color: #fff !important;
  }
  .cursor-line-top::after {
    border-top: 5px solid #fff !important;
  }
}
</style>

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
    :data-x="translateX"
    :style="{
      transform: `translateX(${translateX - unref(scrollInfo.x)}px)`,
      left: `${leftOffset}px`
    }"
    :class="{
      'active-state-cursor': activeStateCursor
    }"
    @click.stop="handleMouseEvent"
    @mousedown.stop="handleMouseEvent"
    @mouseup.stop="handleMouseEvent"
    @contextmenu.stop="handleContextMenu"
  >
    <div class="cursor-line-top" />
    <div class="cursor-line-area" />
    <div class="absolute left-5px top-0">{{ cursorTime }}</div>
  </div>
</template>

<script setup lang="ts">
import { unref } from 'vue';
import interact from 'interactjs';
import { reactiveComputed, useEventListener, whenever } from '@vueuse/core';
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
watch(scaleUnit, () => {
  translateX.value = unref(cursorTime) / unref(scaleUnit);
  nextTick(() => {
    unref(timeLineEditorRef)!.scrollLeft = translateX.value - unref(timeLineEditorRef)!.clientWidth / 2;
  });
});
watch(
  cursorTime,
  () => {
    translateX.value = unref(cursorTime) / unref(scaleUnit);
  },
  {
    immediate: true
  }
);
whenever(
  () => cursorTime.value > timeLineMaxEndTime.value,
  () => {
    handleSetCursor(timeLineMaxEndTime.value);
  }
);
const targetDragEvent = shallowRef<DragEvent | null>(null);
const isAutoScroll = ref(false);
const scrollOffset = ref(0);
const timeLineEditorInnerRef = ref<HTMLElement | null>();
const activeStateCursor = computed(() => {
  return (
    dragLineActionLine.isMoving &&
    dragLineActionLine.targetType === 'action' &&
    dragLineActionLine.movePositions.some(left => {
      const dis = Math.abs(left - translateX.value);
      return Math.round(dis) <= 0.001;
    })
  );
});
const restrictRectModifier = reactiveComputed(() => {
  return interact.modifiers.restrictEdges({
    outer: timeLineEditorInnerRef.value!
  });
});
const guideSnapModifier = reactiveComputed(() => {
  return interact.modifiers.snap({
    origin: timeLineEditorInnerRef.value!,
    targets: [
      interact.createSnapGrid({
        x: unref(frameWidth),
        y: 1,
        limits: {
          left: 0,
          right: unref(timeLineMaxEndTime) / unref(scaleUnit),
          bottom: Infinity,
          top: -Infinity
        }
      })
    ],
    relativePoints: [{ x: 0, y: 0 }]
  });
});
const adsorbSnapModifier = reactiveComputed(() => {
  return interact.modifiers.snap({
    origin: timeLineEditorInnerRef.value!,
    targets: [
      (x, y) => {
        let adsorption = x;
        const disList: number[] = [];
        dragLineActionLine.assistPositions.forEach(item => {
          const dis = Math.abs(item - adsorption);
          if (dis < Number(unref(guideAdsorptionDistance)) && dis < Number.MAX_SAFE_INTEGER) {
            disList.push(item);
            const minDis = Math.min(...disList);
            adsorption = minDis;
          }
        });
        return {
          x: adsorption,
          y
        };
      }
    ],
    relativePoints: [{ x: 0, y: 0 }]
  });
});
const autoScrollSnapModifier = reactiveComputed(() => {
  return interact.modifiers.snap({
    origin: timeLineEditorInnerRef.value!,
    targets: [
      (x: number, y: number) => {
        let curX = x;
        curX += scrollOffset.value;
        return {
          x: curX,
          y
        };
      }
    ],
    relativePoints: [{ x: 0, y: 0 }]
  });
});
// 初始化辅助线
const handleInitGuideLine = () => {
  if (unref(cursorAdsorption)) {
    const assistPositions = defaultGetAllAssistPosition({
      editorData: editorData!.value!,
      scaleUnit: scaleUnit.value,
      extendPos: ['0']
    });
    initDragLine({ assistPositions, targetType: 'cursor' });
  }
};
// 右键
const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault();
};
// 点击
const handleMouseEvent = () => {
  timeLineStateContext.enginePause();
};
// 拖拽开始
const handleMoveStart = (event: DragEvent) => {
  timeLineStateContext.enginePause();
  targetDragEvent.value = event;
  handleInitGuideLine();
};
// 拖拽中
const handleMove = (event: DragEvent) => {
  targetDragEvent.value = event;
  const target = event.target;
  const { x } = target.dataset;
  let curLeft = parseFloat(x || '0') + event.dx;
  curLeft = Math.round(curLeft / unref(frameWidth)) * unref(frameWidth);
  handleSetCursor(Math.round(curLeft * unref(scaleUnit)));
};
// 拖拽结束
const handleMoveEnd = () => {
  isAutoScroll.value = false;
  scrollOffset.value = 0;
  targetDragEvent.value = null;
  disposeDragLine();
};
const initInteract = () => {
  const interactInst = interact(cursorLineRef.value!, {
    deltaSource: 'client'
  });
  interactable.value = interactInst;
  interactInst
    .draggable({
      modifiers: [restrictRectModifier, autoScrollSnapModifier, guideSnapModifier, adsorbSnapModifier],
      onstart: handleMoveStart,
      onmove: handleMove,
      onend: handleMoveEnd,
      cursorChecker: () => 'ew-resize',
      autoScroll: {
        container: timeLineEditorRef.value!,
        margin: 40,
        speed: 500
      }
    })
    .on('autoscroll', event => {
      !isAutoScroll.value && (isAutoScroll.value = true);
      scrollOffset.value += event.delta.x;
    });
};
useEventListener(timeLineEditorRef, 'scroll', () => {
  if (targetDragEvent.value) {
    isAutoScroll.value && targetDragEvent.value.interaction.move();
  }
});
onBeforeUnmount(() => {
  interactable.value?.unset();
  disposeDragLine();
});
watch(
  timeLineEditorRef,
  ref => {
    if (!ref) return;
    nextTick(() => {
      timeLineEditorInnerRef.value = timeLineEditorRef.value!.firstChild as HTMLElement;
      initInteract();
    });
  },
  {
    immediate: true
  }
);
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
  background-color: #5297ff;
  z-index: 10;
  cursor: ew-resize;
  // 禁止选中
  user-select: none;
  &-top::before {
    content: '';
    position: absolute;
    top: -10px;
    left: -5px;
    width: 10px;
    height: 10px;
    background-color: #5297ff;
    cursor: ew-resize;
  }
  &-top::after {
    content: '';
    position: absolute;
    top: 0;
    left: -5px;
    border-top: 5px solid #5297ff;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: none;
    cursor: ew-resize;
  }
  &-area {
    width: 10px;
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
  background-color: #fff !important;
  .cursor-line-top::before {
    background-color: #fff !important;
  }
  .cursor-line-top::after {
    border-top: 5px solid #fff !important;
  }
}
</style>

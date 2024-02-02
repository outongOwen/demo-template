<!--
 * new page
 * @author: owenTong
 * @since: 2023-07-13
 * index.vue
-->
<template>
  <div
    ref="cursorLineRef"
    class="timeLine-cursor-line"
    :data-x="translateX"
    :style="{
      transform: `translateX(${translateX - getScrollInfo.x}px)`,
      left: `${Number(getShareProps.leftOffset!) - 1}px`,
      top: `${Number(getShareProps.scaleHeight) / 2}px`,
      height: `calc(100% - ${Number(getShareProps.scaleHeight) / 2 + getScrollDomSize.height}px)`
    }"
    :class="{
      'active-state-cursor': activeStateCursor
    }"
    @mousedown.stop="void 0"
    @mouseup.stop="void 0"
  >
    <div class="timeLine-cursor-line-top" />
    <div class="timeLine-cursor-line-area" />
    <div class="absolute left-5px top-0">{{ getCursorTime }}</div>
  </div>
</template>

<script setup lang="ts">
import interact from 'interactjs';
import { reactiveComputed, useEventListener, unrefElement } from '@vueuse/core';
import type { DragEvent, Interactable } from '@interactjs/types';
import { useActionGuideLine } from '../../hooks';
import { useTimeLineStore } from '../../store';
defineOptions({
  name: 'TimeLineCursor'
});
const {
  getShareProps,
  getTimeLineEditorData,
  getScaleUnit,
  getFrameWidth,
  getScrollInfo,
  getCursorTime,
  getTimeLineClipDomSize,
  scrollTo,
  getTimeLineClipDomRef,
  setCursorTime,
  getTimeLineMaxEndTime,
  enginePause,
  getScrollDomSize,
  setInteractState
} = useTimeLineStore();
const { dragLineActionLine, defaultGetAllAssistPosition, initDragLine, disposeDragLine } = useActionGuideLine();
const cursorLineRef = ref<HTMLElement>();
const timeLineEditorInnerRef = ref<HTMLElement | null>();
const targetDragEvent = shallowRef<DragEvent | null>(null);
const interactable = shallowRef<Interactable>();
const translateX = ref(0);
const scrollOffsetX = ref(0);
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
    outer: timeLineEditorInnerRef.value!,
    offset: {
      top: 0,
      left: -1,
      bottom: 0,
      right: 0
    }
  });
});
const guideSnapModifier = reactiveComputed(() => {
  return interact.modifiers.snap({
    origin: timeLineEditorInnerRef.value!,
    targets: [
      interact.createSnapGrid({
        x: unref(getFrameWidth),
        y: 1,
        limits: {
          left: 0,
          right: unref(getTimeLineMaxEndTime) / unref(getScaleUnit),
          bottom: Infinity,
          top: -Infinity
        }
      })
    ],
    offset: {
      x: -1,
      y: 0
    },
    relativePoints: [{ x: 0, y: 0 }]
  });
});
const adsorptionSnapModifier = reactiveComputed(() => {
  return interact.modifiers.snap({
    origin: timeLineEditorInnerRef.value!,
    targets: [
      (x, y) => {
        let adsorption = x;
        const disList: number[] = [];
        if (getShareProps.autoAdsorption) {
          dragLineActionLine.assistPositions.forEach(item => {
            const dis = Math.abs(item - adsorption);
            if (dis < Number(unref(getShareProps.adsorptionDistance)) && dis < Number.MAX_SAFE_INTEGER) {
              disList.push(item);
              const minDis = Math.min(...disList);
              adsorption = minDis;
            }
          });
        }
        return {
          x: getScrollInfo.isScrolling ? x : adsorption,
          y
        };
      }
    ],
    relativePoints: [{ x: 0, y: 0 }],
    offset: {
      x: -1,
      y: 0
    }
  });
});
const autoScrollSnapModifier = reactiveComputed(() => {
  return interact.modifiers.snap({
    origin: timeLineEditorInnerRef.value!,
    targets: [
      (x: number, y: number) => {
        let curX = x;
        curX += scrollOffsetX.value;
        return {
          x: curX,
          y
        };
      }
    ],
    relativePoints: [{ x: 0, y: 0 }],
    offset: {
      x: -1,
      y: 0
    }
  });
});
// 初始化辅助线
const handleInitGuideLine = () => {
  if (getShareProps.autoAdsorption || getShareProps.guideLine) {
    const assistPositions = defaultGetAllAssistPosition({
      editorData: toRaw(unref(getTimeLineEditorData)),
      scaleUnit: unref(getScaleUnit),
      extendPos: [0]
    });
    initDragLine({ assistPositions, targetType: 'cursor' });
  }
};
// 拖拽开始
const handleMoveStart = (event: DragEvent) => {
  setInteractState({
    target: 'cursor',
    type: 'dragmove',
    stage: 'start',
    active: true
  });
  enginePause();
  targetDragEvent.value = event;
  handleInitGuideLine();
  enginePause();
};
// 拖拽中
const handleMove = (event: DragEvent) => {
  setInteractState({
    stage: 'move'
  });
  targetDragEvent.value = event;
  const target = event.target;
  const { x = '0' } = target.dataset;
  let curLeft = parseFloat(x) + event.dx;
  curLeft = Math.round(curLeft / unref(getFrameWidth)) * unref(getFrameWidth);
  setCursorTime(Math.round(curLeft * unref(getScaleUnit)));
};
// 拖拽结束
const handleMoveEnd = () => {
  setInteractState({
    target: '',
    stage: 'end',
    active: false
  });
  scrollOffsetX.value = 0;
  targetDragEvent.value = null;
  disposeDragLine();
};
// 初始化
const initInteract = () => {
  const interactInst = interact(cursorLineRef.value!, {
    deltaSource: 'client'
  });
  interactable.value = interactInst;
  interactable.value.draggable({
    modifiers: [restrictRectModifier, autoScrollSnapModifier, guideSnapModifier, adsorptionSnapModifier],
    onstart: handleMoveStart,
    onmove: handleMove,
    onend: handleMoveEnd,
    autoScroll: {
      container: unrefElement(getTimeLineClipDomRef),
      ...toRaw(getShareProps.autoScroll),
      ...{ enabled: Boolean(getShareProps.autoScroll?.enabled) }
    },
    cursorChecker: () => 'ew-resize'
  });
};
// 监听刻度尺缩放
watch(getScaleUnit, unit => {
  translateX.value = unref(getCursorTime) / unit;
  nextTick(() => {
    scrollTo({ left: translateX.value - getTimeLineClipDomSize.width / 2 });
  });
});
// 监听当前指针时间
watch(
  getCursorTime,
  (time: number) => {
    translateX.value = time / unref(getScaleUnit);
  },
  {
    immediate: true
  }
);
watchEffect(() => {
  if (getCursorTime.value > getTimeLineMaxEndTime.value) {
    setCursorTime(getTimeLineMaxEndTime.value);
  }
});
watch(
  () => getScrollInfo.x,
  (newValue, oldValue) => {
    if (targetDragEvent.value) {
      scrollOffsetX.value += newValue - oldValue;
    }
  }
);
// 监听滚动
useEventListener(getTimeLineClipDomRef, 'scroll', () => {
  if (targetDragEvent.value) {
    targetDragEvent.value!.interaction.move();
  }
});
onMounted(() => {
  nextTick(() => {
    if (getTimeLineClipDomRef.value) {
      timeLineEditorInnerRef.value = getTimeLineClipDomRef.value.firstChild as HTMLElement;
      interactable.value && interactable.value.unset();
      initInteract();
    }
  });
});
// dom卸载之前
onBeforeUnmount(() => {
  interactable.value?.unset();
});
</script>

<style scoped lang="scss">
.timeLine-cursor-line {
  cursor: ew-resize !important;
  position: absolute;
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
    top: 0px;
    left: -5px;
    width: 10px;
    height: 10px;
    background-color: #5297ff;
    cursor: ew-resize;
  }

  &-top::after {
    content: '';
    position: absolute;
    top: 10px;
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

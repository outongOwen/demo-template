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
    @click.stop="() => void 0"
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
const cacheOffset = ref(0);
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
        let adsorption = x;
        const disList: number[] = [];
        dragLineActionLine.assistPositions.forEach(item => {
          const dis = Math.abs(item - scrollInfo.x.value - adsorption);
          if (dis < unref(guideAdsorptionDistance)! && dis < Number.MAX_SAFE_INTEGER) {
            disList.push(item);
            const minDis = Math.min(...disList);
            adsorption = minDis - scrollInfo.x.value;
          }
        });
        return {
          x: adsorption,
          y
        };
      }
    ],
    offset: { x: 10, y: 0 },
    relativePoints: [{ x: 0, y: 0 }]
  });
});
// let scrollDirection: string | null = null;
// let scrollTimer: number | null = null;
// let isAutoScroll = false;
// const autoScroll = (event: DragEvent) => {
//   // 检测元素是否接近窗口的边缘
//   const cursorX = event.clientX;
//   const tLeft = timeLineEditorRef.value!.getBoundingClientRect().x;
//   const tRight = tLeft + timeLineEditorRef.value!.getBoundingClientRect().width;
//   const threshold = 50;
//   const scrollSpeed = 5;
//   let distance = unref(frameWidth);
//   if (cursorX < tLeft + threshold) {
//     scrollDirection = 'left';
//     isAutoScroll = true;
//     distance = tLeft + threshold - cursorX;
//   } else if (cursorX > tRight - threshold) {
//     scrollDirection = 'right';
//     isAutoScroll = true;
//     distance = cursorX - (tRight - threshold);
//   } else {
//     scrollDirection = null;
//     isAutoScroll = false;
//   }
//   // 如果接近边缘则滚动窗口
//   if (scrollDirection && isAutoScroll) {
//     const step = scrollSpeed * (scrollDirection === 'left' ? -distance : distance);
//     // 通过requestAnimationFrame来实现滚动效果 以免卡顿,
//     const scroll = () => {
//       timeLineEditorRef.value!.scrollBy(step, 0);
//       if (scrollDirection === 'left' && timeLineEditorRef.value!.scrollLeft > 0) {
//         scrollTimer = window.requestAnimationFrame(scroll);
//       } else if (
//         scrollDirection === 'right' &&
//         timeLineEditorRef.value!.scrollLeft <
//           timeLineEditorRef.value!.scrollWidth - timeLineEditorRef.value!.clientWidth
//       ) {
//         scrollTimer = window.requestAnimationFrame(scroll);
//       } else {
//         scrollTimer && cancelAnimationFrame(scrollTimer!);
//       }
//     };
//     if (!scrollTimer) {
//       scrollTimer = window.requestAnimationFrame(scroll);
//     }
//   }
// };
const handleMoveStart = (event: DragEvent) => {
  console.log(event.type);
  // isAutoScroll = false;
  // scrollTimer = null;
  handleInitGuideLine();
};
const handleMove = (event: DragEvent) => {
  // autoScroll(event);
  const target = event.target;
  const { x } = target.dataset;
  let curLeft = parseFloat(x || '0') + event.dx;
  curLeft = Math.round(curLeft / unref(frameWidth)) * unref(frameWidth);
  handleSetCursor(Math.round(curLeft * unref(scaleUnit)));
};

const handleMoveEnd = (event: DragEvent) => {
  console.log(event);
  // scrollTimer && cancelAnimationFrame(scrollTimer);
  // isAutoScroll = false;
  // scrollTimer = null;
  cacheOffset.value = 0;
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
    cursorChecker: () => 'ew-resize',
    autoScroll: {
      container: timeLineEditorRef.value!,
      margin: 40
    }
  });
  interactInst.on('autoscroll', event => {
    cacheOffset.value += event.delta.x;
    if (unref(cursorTime) > 0 && unref(cursorTime) < unref(timeLineMaxEndTime)) {
      const curLeft = translateX.value + Math.round(unref(cacheOffset) / unref(frameWidth)) * unref(frameWidth);
      const curTime = Math.round(curLeft * unref(scaleUnit));
      if (curTime > 0 && curTime > unref(timeLineMaxEndTime)) {
        handleSetCursor(unref(timeLineMaxEndTime));
        cacheOffset.value = 0;
      } else {
        handleSetCursor(curTime);
      }
      cacheOffset.value -= Math.round(unref(cacheOffset) / unref(frameWidth)) * unref(frameWidth);
    } else {
      cacheOffset.value = 0;
    }
  });
};
// useEventListener(timeLineEditorRef, 'scroll', event => {
//   if (isAutoScroll) {
//     // Throttling将滚动与指针位置同步
//     const scrollLeft = timeLineEditorRef.value!.scrollLeft;
//     const scrollWidth = timeLineEditorRef.value!.scrollWidth;
//     const clientWidth = timeLineEditorRef.value!.clientWidth;
//     const scrollPercent = scrollLeft / (scrollWidth - clientWidth);
//     const cursorX = scrollPercent * clientWidth;
//     console.log(cursorX, 'cursorX');
//   }
// });
onMounted(() => {
  nextTick(() => {
    initInteract();
  });
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

<template>
  <div
    ref="actionRef"
    class="timeLine-editor-action"
    :data-type="actionItem.type"
    :data-id="actionItem.id"
    :data-rowId="rowItem.id"
    :data-width="actionItemSize.width"
    :data-left="actionItemSize.left"
    :style="{
      width: `${actionItemSize.width}px`,
      left: `${actionItemSize.left}px`
    }"
    @click.stop="handleClick"
    @mousedown.stop="handleMouseDown"
    @mouseup.stop="handleMouseUp"
    @contextmenu.stop="handleContextMenu"
  >
    <div v-show="isSelected" class="action-action-box">
      <div ref="actionLeftStretchRef" class="action-left-stretch" />
      <div ref="actionRightStretchRef" class="action-right-stretch" />
    </div>
    <div class="wh-full">
      <!-- 随机背景色 -->
      <!-- <p class="of-hidden wh-full">
        {{ actionItem.start }}
        {{ actionItem.end }}
        {{ actionItem.end - actionItem.start }}
        {{ frameWidth }}
      </p> -->

      <!-- <n-slider /> -->
      <img
        src="https://dao-library.54traveler.com/dcr-our/video/gaojiasuo.jpeg"
        class="wh-full object-cover overflow-hidden border-rd-2px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import interact from 'interactjs';
import { reactiveComputed, unrefElement, useEventListener, useElementSize } from '@vueuse/core';
import type { DragEvent, ResizeEvent, Interactable } from '@interactjs/types';
import { useActionGuideLine } from '../../../hooks';
import type { TimelineAction, TimelineRow } from '../../../types';
import { useTimeLineEditorAreaContext } from '../../../contexts';
import { parserTimeToTransform, parserTransformToTime } from '../../../utils';
import { useTimeLineStore } from '../../../store';
import { useDropAction } from './index';
// import { isActionCollision } from './helper';
type Direction = 'left' | 'right';
interface Props {
  rowItem: TimelineRow;
  actionItem: TimelineAction;
  actionHeight: number | string;
}
defineOptions({
  name: 'TimeLineAction'
});
const props = defineProps<Props>();
const { actionItem, rowItem, actionHeight } = toRefs(props);
const actionRef = ref<HTMLElement>();
const { injectTimeLineEditorAreaContext } = useTimeLineEditorAreaContext();
const timeLineEditorAreaContext = injectTimeLineEditorAreaContext();
const {
  enginePause,
  getScaleUnit,
  getTimeLineEditorDomRef,
  getFrameWidth,
  getCursorTime,
  getShareProps,
  getShareEmits,
  getTimeLineEditorData,
  scrollInfo,
  setPreviewCursorState
} = useTimeLineStore();
// 辅助线hook
const {
  dragLineActionLine,
  initDragLine,
  updateDragLine,
  disposeDragLine,
  defaultGetAssistPosition,
  defaultGetMovePosition
} = useActionGuideLine();

// interact实例
const interactable = shallowRef<Interactable>();
// 时间线内部容器
const timeLineEditorInnerRef = ref<HTMLElement>();
// 拖拽Y轴距离
const deltaY = ref(0);
const actionLeftStretchRef = ref<HTMLElement>();
const actionRightStretchRef = ref<HTMLElement>();
const targetDragEvent = shallowRef<DragEvent | ResizeEvent | null>(null);
const scrollOffset = reactive({
  x: 0,
  y: 0
});
const isSelected = computed(() => {
  return Boolean(timeLineEditorAreaContext.selectedActionIds.value.includes(unref(actionItem).id));
});
watch(isSelected, state => {
  state
    ? timeLineEditorAreaContext.selectedActionRefs.set(actionItem.value.id, actionRef.value!)
    : timeLineEditorAreaContext.selectedActionRefs.delete(actionItem.value.id);
});
const { width: timeLineEditorWrapWidth, height: timeLineEditorWrapHeight } = useElementSize(timeLineEditorInnerRef);
const actionItemSize = reactiveComputed(() => {
  return parserTimeToTransform(
    {
      start: actionItem.value.start,
      end: actionItem.value.end
    },
    unref(getScaleUnit)
  );
});
const restrictEdgesDraggableModifier = reactiveComputed(() => {
  return interact.modifiers.restrictEdges({
    outer: unrefElement(timeLineEditorInnerRef),
    offset: {
      left: 0,
      right: 0,
      top: -Number.MAX_SAFE_INTEGER,
      bottom: 0
    }
  });
});
const autoScrollSnapModifier = reactiveComputed(() => {
  return interact.modifiers.snap({
    origin: unrefElement(timeLineEditorInnerRef.value),
    targets: [
      (x: number, y: number) => {
        let curX = x;
        let curY = y;
        curX += scrollOffset.x;
        curY += scrollOffset.y;
        if (curX + actionItemSize.width >= timeLineEditorWrapWidth.value) {
          curX = timeLineEditorWrapWidth.value - actionItemSize.width;
        }
        if (curY + Number(actionHeight.value) >= timeLineEditorWrapHeight.value) {
          curY = timeLineEditorWrapHeight.value - Number(actionHeight.value);
        }
        return {
          x: curX,
          y: curY
        };
      }
    ],
    relativePoints: [{ x: 0, y: 0 }]
  });
});
const adsorptionSnapModifier = reactiveComputed(() => {
  return interact.modifiers.snap({
    origin: unrefElement(timeLineEditorInnerRef),
    targets: [
      (x, y) => {
        let adsorptionPos = x;
        const width = actionItemSize.width;
        const disListLeft: number[] = [];
        const disListRight: number[] = [];
        if (getShareProps.autoAdsorption) {
          dragLineActionLine.assistPositions.forEach(item => {
            const dis = Math.abs(item - adsorptionPos);
            const dis2 = Math.abs(item - (adsorptionPos + width));
            if (
              dis < Number(unref(getShareProps).adsorptionDistance) &&
              dis < Number.MAX_SAFE_INTEGER &&
              disListRight.length === 0
            ) {
              disListLeft.push(item);
              const minDis = Math.min(...disListLeft);
              adsorptionPos = minDis;
            }
            if (
              dis2 < Number(unref(getShareProps).adsorptionDistance) &&
              dis2 < Number.MAX_SAFE_INTEGER &&
              disListLeft.length === 0
            ) {
              disListRight.push(item);
              const minDis = Math.min(...disListRight);
              adsorptionPos = minDis - width;
            }
          });
        }

        return {
          x: adsorptionPos,
          y
        };
      }
    ],
    relativePoints: [{ x: 0, y: 0 }]
  });
});
const resizeRestrictRectModifier = reactiveComputed(() => {
  return interact.modifiers.restrictEdges({
    outer: unrefElement(timeLineEditorInnerRef),
    offset: {
      left: 0,
      right: 0,
      top: -Infinity,
      bottom: 0
    }
  });
});
const restrictSizeModifier = reactiveComputed(() => {
  return interact.modifiers.restrictSize({
    min: {
      width: unref(getFrameWidth),
      height: 0
    }
  });
});
const resizeSnapModifier = reactiveComputed(() => {
  return interact.modifiers.snap({
    origin: unrefElement(timeLineEditorInnerRef),
    targets: [
      (x, y) => {
        const newX = Math.round(x / unref(getFrameWidth)) * unref(getFrameWidth);
        return {
          x: newX,
          y
        };
      }
    ],
    relativePoints: [{ x: 0, y: 0 }]
  });
});
const snapGridDraggableModifier = reactiveComputed(() => {
  return interact.modifiers.snap({
    endOnly: true,
    origin: unrefElement(timeLineEditorInnerRef),
    targets: [
      interact.createSnapGrid({
        x: unref(getFrameWidth),
        y: 1
      })
    ],
    relativePoints: [{ x: 0, y: 0 }]
  });
});
// 点击动作
const handleClick = () => {
  timeLineEditorAreaContext.setSelectedActionId(unref(actionItem).id);
};
// 鼠标按下动作
const handleMouseDown = () => {
  const el = unrefElement(actionRef);
  if (!el) return;
  el.style.zIndex = '9';
  setPreviewCursorState({ state: false });
};
// 鼠标移动抬起
const handleMouseUp = () => {
  const el = unrefElement(actionRef);
  if (!el) return;
  el.style.zIndex = 'auto';
  setPreviewCursorState({ state: true });
};
// 右键菜单
const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault();
};
// 初始化辅助线
const handleInitGuideLine = () => {
  if (getShareProps.guideLine || getShareProps.autoAdsorption) {
    const assistPositions = defaultGetAssistPosition({
      editorData: unref(getTimeLineEditorData),
      action: actionItem.value,
      row: rowItem.value,
      scaleUnit: unref(getScaleUnit),
      hideCursor: Boolean(unref(getShareProps.hideCursor)),
      cursorLeft: unref(getCursorTime) / unref(getScaleUnit),
      extendPos: ['0']
    });
    initDragLine({ assistPositions });
  }
};
// 更新辅助线
const handleUpdateGuideLine = ({ start, end }: { start: number; end: number }) => {
  if (getShareProps.guideLine || getShareProps.autoAdsorption) {
    const movePositions = defaultGetMovePosition({
      start,
      end,
      scaleUnit: unref(getScaleUnit)
    });
    updateDragLine({ movePositions });
  }
};
// 更新宽度
const handleUpdateWidth = (width: number) => {
  if (!interactable.value?.target) return;
  const target = interactable.value.target as HTMLElement;
  target.style.width = `${width}px`;
  Object.assign(target.dataset, { width });
};
// 更新left
const handleUpdateLeft = (left: number) => {
  if (!interactable.value?.target) return;
  const target = interactable.value.target as HTMLElement;
  target.style.left = `${left}px`;
  Object.assign(target.dataset, { left });
};
// 开始拖拽移动
const handleMoveStart = (e: DragEvent) => {
  handleInitGuideLine();
  timeLineEditorAreaContext.setSelectedActionId(unref(actionItem).id);
  enginePause();
  targetDragEvent.value = e;
  timeLineEditorAreaContext.dropzoneInfo.isMoving = true;
  timeLineEditorAreaContext.dropzoneInfo.dragId = actionItem.value.id;
  timeLineEditorAreaContext.setActionDragState({
    actionId: actionItem.value.id,
    rowId: rowItem.value.id,
    isMoving: true,
    isResizing: false
  });
  if (getShareEmits.onActionMoveStart)
    getShareEmits.onActionMoveStart({ action: actionItem.value, row: rowItem.value });
};
// 拖拽移动中
const handleMove = (e: DragEvent) => {
  const target = e.target;
  targetDragEvent.value = e;
  const { left = '0', width = '0' } = target.dataset;
  const preLeft = parseFloat(left);
  const preWidth = parseFloat(width);
  const curLeft = preLeft + e.dx;
  deltaY.value += e.dy;
  const { start, end } = parserTransformToTime({ left: curLeft, width: preWidth }, unref(getScaleUnit));
  handleUpdateGuideLine({ start, end });
  if (getShareEmits.onActionMoving) {
    const ret = getShareEmits.onActionMoving({
      action: actionItem.value,
      row: rowItem.value,
      start,
      end
    });
    if (ret === false) return;
  }
  handleUpdateLeft(curLeft);
  target.style.transform = `translateY(${deltaY.value}px)`;
};
// 拖拽移动结束
const handleMoveEnd = (e: DragEvent) => {
  const target = e.target;
  const { left, width } = target.dataset;
  target.style.transform = `translateY(0px)`;
  const curLeft = Math.round(Number(left) / unref(getFrameWidth)) * unref(getFrameWidth);
  const { start, end } = parserTransformToTime({ left: curLeft, width: Number(width) }, unref(getScaleUnit));
  actionItem.value.start = start;
  actionItem.value.end = end;
  // 选中动作行为进行数据操作
  useDropAction({
    direction: timeLineEditorAreaContext.dropzoneInfo.direction,
    targetRowId: timeLineEditorAreaContext.dropzoneInfo.rowId,
    fromRowId: rowItem.value.id,
    action: actionItem.value,
    editorData: unref(getTimeLineEditorData)!
  });
  deltaY.value = 0;
  targetDragEvent.value = null;
  scrollOffset.x = 0;
  scrollOffset.y = 0;
  timeLineEditorAreaContext.dropzoneInfo.isMoving = false;
  timeLineEditorAreaContext.dropzoneInfo.dragId = '';
  timeLineEditorAreaContext.clearActionDragState();
  disposeDragLine();
  if (getShareEmits.onActionMoveEnd)
    // 触发回调
    getShareEmits.onActionMoveEnd({ action: actionItem.value, row: rowItem.value, start, end });
};
// 开始拖拽缩放
const handleResizeStart = (e: ResizeEvent) => {
  targetDragEvent.value = e;
  const dir = e.edges?.left ? 'left' : 'right';
  timeLineEditorAreaContext.setSelectedActionId(unref(actionItem).id);
  enginePause();
  handleInitGuideLine();
  timeLineEditorAreaContext.setActionDragState({
    actionId: actionItem.value.id,
    rowId: rowItem.value.id,
    isMoving: false,
    isResizing: true
  });
  // 触发开始缩放回调
  if (getShareEmits.onActionResizeStart)
    getShareEmits.onActionResizeStart({ action: actionItem.value, row: rowItem.value, dir });
};
// 拖拽缩放结束
const handleResizeEnd = (e: ResizeEvent) => {
  targetDragEvent.value = null;
  scrollOffset.x = 0;
  scrollOffset.y = 0;
  const target = e.target;
  const { left, width } = target.dataset;
  const dir: Direction = e.edges?.right ? 'right' : 'left';
  const { start, end } = parserTransformToTime({ left: Number(left), width: Number(width) }, unref(getScaleUnit));
  actionItem.value.start = start;
  actionItem.value.end = end;
  disposeDragLine();
  timeLineEditorAreaContext.clearActionDragState();
  // 触发回调
  if (getShareEmits.onActionResizeEnd)
    getShareEmits.onActionResizeEnd({ action: actionItem.value, row: rowItem.value, start, end, dir });
};
// 拖拽缩放中
const handleResize = (e: ResizeEvent) => {
  targetDragEvent.value = e;
  const target = e.target;
  const dir = e.edges?.left ? 'left' : 'right';
  const { left } = target.dataset;
  const preLeft = parseFloat(left || '0');
  if (dir === 'left') {
    let curLeft = preLeft + e.deltaRect!.left!;
    let curWidth = e.rect.width;
    curLeft = Math.round(curLeft / unref(getFrameWidth)) * unref(getFrameWidth);
    curWidth = Math.round(curWidth / unref(getFrameWidth)) * unref(getFrameWidth);
    const { start, end } = parserTransformToTime({ left: curLeft, width: curWidth }, unref(getScaleUnit));
    handleUpdateGuideLine({ start, end });
    if (getShareEmits.onActionResizing) {
      const ret = getShareEmits.onActionResizing({
        action: actionItem.value,
        row: rowItem.value,
        start,
        end,
        dir
      });
      if (ret === false) return;
    }
    handleUpdateLeft(curLeft);
    handleUpdateWidth(curWidth);
  }
  if (dir === 'right') {
    // 拖动右侧
    let curWidth = e.rect.width;
    curWidth = Math.round(curWidth / unref(getFrameWidth)) * unref(getFrameWidth);
    const { start, end } = parserTransformToTime({ left: preLeft, width: curWidth }, unref(getScaleUnit));
    handleUpdateGuideLine({ start, end });
    if (getShareEmits.onActionResizing) {
      const ret = getShareEmits.onActionResizing({
        action: actionItem.value,
        row: rowItem.value,
        start,
        end,
        dir
      });
      if (ret === false) return;
    }
    handleUpdateWidth(curWidth);
  }
};
// 初始化拖拽移动
const initDraggable = (interactInst: Interactable) => {
  interactInst.draggable({
    modifiers: [
      restrictEdgesDraggableModifier,
      autoScrollSnapModifier,
      snapGridDraggableModifier,
      adsorptionSnapModifier
    ],
    onstart: handleMoveStart,
    onmove: handleMove,
    onend: handleMoveEnd,
    autoScroll: {
      container: unrefElement(getTimeLineEditorDomRef),
      ...toRaw(getShareProps.autoScroll),
      ...{ enabled: Boolean(getShareProps.autoScroll?.enabled) }
    }
  });
};
// 初始化拖拽缩放
const initDragResize = (interactInst: Interactable) => {
  interactInst.resizable({
    edges: { left: actionLeftStretchRef.value, right: actionRightStretchRef.value },
    modifiers: [
      resizeRestrictRectModifier,
      autoScrollSnapModifier,
      resizeSnapModifier,
      adsorptionSnapModifier,
      restrictSizeModifier
    ],
    onstart: handleResizeStart,
    onmove: handleResize,
    onend: handleResizeEnd,
    autoScroll: {
      container: unrefElement(getTimeLineEditorDomRef),
      ...toRaw(getShareProps.autoScroll),
      ...{ enabled: Boolean(getShareProps.autoScroll?.enabled) }
    }
  });
};
// 初始化自动滚动监听事件
const initAutoScroll = (interactInst: Interactable) => {
  interactInst &&
    interactInst.on('autoscroll', event => {
      if (targetDragEvent.value!.type === 'resizemove' && Boolean(getShareProps.autoScroll?.enabled)) {
        scrollOffset.x += event.delta.x;
        targetDragEvent.value!.interaction?.move();
      }
    });
};
// 初始化互动
const initInteractable = () => {
  const el = unrefElement(actionRef);
  if (!el || !unref(actionItem)) return;
  const interactInst = interact(el, {
    deltaSource: 'client'
  });
  interactable.value = interactInst;
  initDraggable(interactInst);
  initDragResize(interactInst);
  initAutoScroll(interactInst);
};
watch([() => scrollInfo.x.value, () => scrollInfo.y.value], ([newXValue, newYValue], [preXValue, preYValue]) => {
  if (targetDragEvent.value) {
    scrollOffset.x += newXValue - preXValue;
    scrollOffset.y += newYValue - preYValue;
  }
});
useEventListener(getTimeLineEditorDomRef, 'scroll', () => {
  if (targetDragEvent.value && targetDragEvent.value.type === 'dragmove') {
    nextTick(() => {
      targetDragEvent.value!.interaction?.move();
    });
  }
});
onMounted(() => {
  nextTick(() => {
    if (!unrefElement(getTimeLineEditorDomRef)) return;
    timeLineEditorInnerRef.value = unrefElement(getTimeLineEditorDomRef)!.firstChild as HTMLElement;
    initInteractable();
  });
});
onBeforeUnmount(() => {
  interactable.value?.unset();
});
</script>

<style scoped lang="scss">
.timeLine-editor-action {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  border-radius: 2px;
  height: 100%;
  z-index: auto;
  .action-action-box {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    border-radius: 2px;
    overflow: hidden;
    &::before,
    &::after {
      content: '';
      position: absolute;
      left: 10px;
      right: 10px;
      height: 2px;
      background-color: rgba(255, 255, 255, 0.5);
    }
    &::before {
      top: 0;
    }
    &::after {
      bottom: 0;
    }
    // 上部分
    .action-left-stretch,
    .action-right-stretch {
      position: absolute;
      width: 10px;
      background-color: rgba(255, 255, 255, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      bottom: 0;
      z-index: 99999;
    }
    .action-left-stretch {
      left: 0px;
    }
    .action-right-stretch {
      right: 0px;
    }
    .action-left-stretch::before,
    .action-right-stretch::before {
      background-color: #000;
      content: '';
      display: block;
      height: 10px;
      width: 2px;
    }
  }
}
</style>

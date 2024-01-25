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
import { useTimeLineStateContext, useTimeLineContext, useTimeLineEditorAreaContext } from '../../../contexts';
import { parserTimeToTransform, parserTransformToTime } from '../../../utils';
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
const { injectTimeLineStateContext } = useTimeLineStateContext();
const { injectTimeLineContext } = useTimeLineContext();
const { injectTimeLineEditorAreaContext } = useTimeLineEditorAreaContext();
const timeLineStateContext = injectTimeLineStateContext();
const timeLineContext = injectTimeLineContext();
const timeLineEditorAreaContext = injectTimeLineEditorAreaContext();
const { scaleUnit, timeLineEditorRef, frameWidth, cursorTime } = timeLineStateContext;
const { guideLine, editorData, hideCursor, guideAdsorptionDistance } = toRefs(timeLineContext);
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
const interactActionType = ref<string | null>(null);
const actionLeftStretchRef = ref<HTMLElement>();
const actionRightStretchRef = ref<HTMLElement>();
const targetDragEvent = shallowRef<DragEvent | null>(null);
const scrollOffset = reactive({
  x: 0,
  y: 0
});
const isAutoScroll = ref(false);
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
    scaleUnit.value
  );
});
const draggableRestrictRectModifier = reactiveComputed(() => {
  return interact.modifiers.restrictEdges({
    outer: timeLineEditorInnerRef.value,
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
    origin: timeLineEditorInnerRef.value!,
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
const guideSnapModifier = reactiveComputed(() => {
  return interact.modifiers.snap({
    origin: timeLineEditorInnerRef.value!,
    targets: [
      (x, y) => {
        let adsorptionPos = x;
        const width = actionItemSize.width;
        const disListLeft: number[] = [];
        const disListRight: number[] = [];
        dragLineActionLine.assistPositions.forEach(item => {
          const dis = Math.abs(item - adsorptionPos);
          const dis2 = Math.abs(item - (adsorptionPos + width));
          if (
            dis < Number(unref(guideAdsorptionDistance)) &&
            dis < Number.MAX_SAFE_INTEGER &&
            disListRight.length === 0
          ) {
            disListLeft.push(item);
            const minDis = Math.min(...disListLeft);
            adsorptionPos = minDis;
          }
          if (
            dis2 < Number(unref(guideAdsorptionDistance)) &&
            dis2 < Number.MAX_SAFE_INTEGER &&
            disListLeft.length === 0
          ) {
            disListRight.push(item);
            const minDis = Math.min(...disListRight);
            adsorptionPos = minDis - width;
          }
        });
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
    outer: timeLineEditorInnerRef.value,
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
      width: unref(frameWidth),
      height: 0
    }
  });
});
const snapResizeModifier = reactiveComputed(() => {
  return interact.modifiers.snap({
    origin: timeLineEditorInnerRef.value!,
    targets: [
      (x, y) => {
        const newX = Math.round(x / unref(frameWidth)) * unref(frameWidth);
        return {
          x: newX,
          y
        };
      }
    ],
    relativePoints: [{ x: 0, y: 0 }]
  });
});
const snapDraggableModifier = reactiveComputed(() => {
  return interact.modifiers.snap({
    endOnly: true,
    origin: timeLineEditorInnerRef.value!,
    targets: [
      interact.createSnapGrid({
        x: unref(frameWidth),
        y: 1
      })
    ],
    relativePoints: [{ x: 0, y: 0 }]
  });
});
// 点击动作
const handleClick = event => {
  console.log(event, 'event');
};
// 鼠标按下动作
const handleMouseDown = () => {
  timeLineStateContext.enginePause();
  const el = unrefElement(actionRef);
  if (!el) return;
  el.style.zIndex = '9';
  timeLineEditorAreaContext.setSelectedActionId(unref(actionItem).id);
};
// 鼠标移动抬起
const handleMouseUp = () => {
  const el = unrefElement(actionRef);
  if (!el) return;
  el.style.zIndex = 'auto';
};
// 右键菜单
const handleContextMenu = (e: MouseEvent) => {
  e.preventDefault();
  // if (timeLineContext.onActionContextMenu)
  //   timeLineContext.onActionContextMenu({ action: actionItem.value, row: rowItem.value });
};
// 初始化辅助线
const handleInitGuideLine = () => {
  if (guideLine) {
    const assistPositions = defaultGetAssistPosition({
      editorData: editorData!.value!,
      action: actionItem.value,
      row: rowItem.value,
      scaleUnit: scaleUnit.value,
      hideCursor: Boolean(unref(hideCursor)),
      cursorLeft: unref(cursorTime) / unref(scaleUnit),
      extendPos: ['0']
    });
    initDragLine({ assistPositions });
  }
};
// 更新辅助线
const handleUpdateGuideLine = ({ start, end }: { start: number; end: number }) => {
  if (unref(guideLine)) {
    const movePositions = defaultGetMovePosition({
      start,
      end,
      scaleUnit: scaleUnit.value
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
  timeLineStateContext.enginePause();
  targetDragEvent.value = e;
  interactActionType.value = 'move';
  timeLineEditorAreaContext.dropzoneInfo.isMoving = true;
  timeLineEditorAreaContext.dropzoneInfo.dragId = actionItem.value.id;
  timeLineEditorAreaContext.setActionDragState({
    actionId: actionItem.value.id,
    rowId: rowItem.value.id,
    isMoving: true,
    isResizing: false
  });
  // initAutoScroll();
  handleInitGuideLine();
  if (timeLineContext.onActionMoveStart)
    timeLineContext.onActionMoveStart({ action: actionItem.value, row: rowItem.value });
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
  const { start, end } = parserTransformToTime({ left: curLeft, width: preWidth }, scaleUnit.value);
  handleUpdateGuideLine({ start, end });
  if (timeLineContext.onActionMoving) {
    const ret = timeLineContext.onActionMoving({
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
  deltaY.value = 0;
  interactActionType.value = null;
  targetDragEvent.value = null;
  isAutoScroll.value = false;
  scrollOffset.x = 0;
  scrollOffset.y = 0;
  timeLineEditorAreaContext.dropzoneInfo.isMoving = false;
  timeLineEditorAreaContext.dropzoneInfo.dragId = '';
  timeLineEditorAreaContext.clearActionDragState();
  disposeDragLine();
  const target = e.target;
  const { left, width } = target.dataset;
  target.style.transform = `translateY(0px)`;
  const curLeft = Math.round(Number(left) / unref(frameWidth)) * unref(frameWidth);
  const { start, end } = parserTransformToTime({ left: curLeft, width: Number(width) }, scaleUnit.value);
  actionItem.value.start = start;
  actionItem.value.end = end;
  // 选中动作行为进行数据操作
  useDropAction({
    direction: timeLineEditorAreaContext.dropzoneInfo.direction,
    targetRowId: timeLineEditorAreaContext.dropzoneInfo.rowId,
    fromRowId: rowItem.value.id,
    action: actionItem.value,
    editorData: unref(editorData)!
  });
  if (timeLineContext.onActionMoveEnd)
    // 触发回调
    timeLineContext.onActionMoveEnd({ action: actionItem.value, row: rowItem.value, start, end });
};
// 开始拖拽缩放
const handleResizeStart = (e: ResizeEvent) => {
  const dir = e.edges?.left ? 'left' : 'right';
  interactActionType.value = 'resize';
  timeLineStateContext.enginePause();
  // initAutoScroll();
  handleInitGuideLine();
  timeLineEditorAreaContext.setActionDragState({
    actionId: actionItem.value.id,
    rowId: rowItem.value.id,
    isMoving: false,
    isResizing: true
  });
  // 触发开始缩放回调
  if (timeLineContext.onActionResizeStart)
    timeLineContext.onActionResizeStart({ action: actionItem.value, row: rowItem.value, dir });
};
// 拖拽缩放结束
const handleResizeEnd = (e: ResizeEvent) => {
  interactActionType.value = null;
  disposeDragLine();
  timeLineEditorAreaContext.clearActionDragState();
  const target = e.target;
  const { left, width } = target.dataset;
  const dir: Direction = e.edges?.right ? 'right' : 'left';
  const { start, end } = parserTransformToTime({ left: Number(left), width: Number(width) }, scaleUnit.value);
  actionItem.value.start = start;
  actionItem.value.end = end;
  // 触发回调
  if (timeLineContext.onActionResizeEnd)
    timeLineContext.onActionResizeEnd({ action: actionItem.value, row: rowItem.value, start, end, dir });
};
// 拖拽缩放中
const handleResize = (e: ResizeEvent) => {
  const target = e.target;
  const dir = e.edges?.left ? 'left' : 'right';
  const { left, width } = target.dataset;
  const preLeft = parseFloat(left || '0');
  const preWidth = parseFloat(width || '0');
  if (dir === 'left') {
    let curLeft = preLeft + e.deltaRect!.left!;
    curLeft = Math.round(curLeft / unref(frameWidth)) * unref(frameWidth);
    const tempRight = preLeft + preWidth;
    const curWidth = tempRight - curLeft;
    const { start, end } = parserTransformToTime({ left: curLeft, width: curWidth }, scaleUnit.value);
    handleUpdateGuideLine({ start, end });
    if (timeLineContext.onActionResizing) {
      const ret = timeLineContext.onActionResizing({
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
    let curWidth = preWidth + e.deltaRect!.right!;
    curWidth = Math.round(curWidth / unref(frameWidth)) * unref(frameWidth);
    const { start, end } = parserTransformToTime({ left: preLeft, width: curWidth }, scaleUnit.value);
    handleUpdateGuideLine({ start, end });
    if (timeLineContext.onActionResizing) {
      const ret = timeLineContext.onActionResizing({
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
    modifiers: [draggableRestrictRectModifier, autoScrollSnapModifier, snapDraggableModifier, guideSnapModifier],
    onstart: handleMoveStart,
    onmove: handleMove,
    onend: handleMoveEnd,
    autoScroll: {
      container: timeLineEditorRef.value!,
      margin: 30,
      distance: 10,
      interval: 10,
      speed: 400
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
      snapResizeModifier,
      guideSnapModifier,
      restrictSizeModifier
    ],
    onstart: handleResizeStart,
    onmove: handleResize,
    onend: handleResizeEnd
  });
};
// 初始化自动滚动监听事件
const initAutoScroll = (interactInst: Interactable) => {
  interactInst &&
    interactInst.on('autoscroll', event => {
      !isAutoScroll.value && (isAutoScroll.value = true);
      scrollOffset.x += event.delta.x;
      scrollOffset.y += event.delta.y;
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
useEventListener(timeLineEditorRef, 'scroll', () => {
  nextTick(() => {
    if (targetDragEvent.value) {
      isAutoScroll.value && targetDragEvent.value.interaction?.move();
    }
  });
});
onBeforeUnmount(() => {
  interactable.value?.unset();
});
onMounted(() => {
  nextTick(() => {
    timeLineEditorInnerRef.value = timeLineEditorRef.value!.firstChild as HTMLElement;
    initInteractable();
  });
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

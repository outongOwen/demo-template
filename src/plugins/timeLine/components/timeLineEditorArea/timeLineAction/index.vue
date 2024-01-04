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
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <div v-show="isSelected" class="active-box">
      <div class="left-handle" />
      <div class="right-handle" />
    </div>
    <div class="wh-full flex-center of-hidden">
      <!-- 随机背景色 -->
      <div class="wh-full">
        {{ actionItem.start }}
        {{ actionItem.end }}
        {{ frameWidth }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// // @ts-nocheck
// /* eslint-disable */
import interact from 'interactjs';
import { reactiveComputed, unrefElement } from '@vueuse/core';
import type { DragEvent, ResizeEvent, Interactable } from '@interactjs/types';
import { BigNumber } from 'bignumber.js';
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
}
defineOptions({
  name: 'TimeLineAction'
});
const props = defineProps<Props>();
const { actionItem, rowItem } = toRefs(props);
const actionRef = ref<HTMLElement>();
const { injectTimeLineStateContext } = useTimeLineStateContext();
const { injectTimeLineContext } = useTimeLineContext();
const { injectTimeLineEditorAreaContext } = useTimeLineEditorAreaContext();
const timeLineStateContext = injectTimeLineStateContext();
const timeLineContext = injectTimeLineContext();
const timeLineEditorAreaContext = injectTimeLineEditorAreaContext();
const { scaleUnit, timeLineEditorRef, frameWidth } = timeLineStateContext;
const { guideLine, editorData, hideCursor } = toRefs(timeLineContext);
// const preOrNextAction = reactiveComputed(() => {
//   const index = unref(rowItem).actions.findIndex(item => item.id === unref(actionItem).id);
//   const preAction = unref(rowItem).actions[index - 1];
//   const nextAction = unref(rowItem).actions[index + 1];
//   return {
//     preAction,
//     nextAction
//   };
// });
// 辅助线hook
const {
  // dragLineActionLine,
  initDragLine,
  updateDragLine,
  disposeDragLine,
  defaultGetAssistPosition,
  defaultGetMovePosition
} = useActionGuideLine();

// const { initAutoScroll, dealDragAutoScroll, dealResizeAutoScroll, stopAutoScroll } = useAutoScroll(timeLineEditorRef);
// interact实例
const interactable = shallowRef<Interactable>();
// 拖拽X轴距离
const deltaX = ref(0);
// 拖拽Y轴距离
const deltaY = ref(0);
// 是否吸附
const isAdsorption = ref(false);
const isSelected = computed(() => {
  return Boolean(timeLineEditorAreaContext.selectedActionIds.value.includes(unref(actionItem).id));
});

watch(isSelected, state => {
  state
    ? timeLineEditorAreaContext.selectedActionRefs.set(actionItem.value.id, actionRef.value!)
    : timeLineEditorAreaContext.selectedActionRefs.delete(actionItem.value.id);
});
const actionItemSize = reactiveComputed(() => {
  return parserTimeToTransform(
    {
      start: actionItem.value.start,
      end: actionItem.value.end
    },
    scaleUnit.value
  );
});
// 初始化辅助线
const handleInitGuideLine = () => {
  if (guideLine) {
    const cursorLeft = 0;
    const assistPositions = defaultGetAssistPosition({
      editorData: editorData!.value!,
      action: actionItem.value,
      row: rowItem.value,
      scaleUnit: scaleUnit.value,
      hideCursor: Boolean(unref(hideCursor)),
      cursorLeft
    });
    initDragLine({ assistPositions });
  }
};
// 更新辅助线
const handleUpdateGuideLine = ({ start, end, dir }: { start: number; end: number; dir: Direction }) => {
  if (unref(guideLine)) {
    const movePositions = defaultGetMovePosition({
      start,
      end,
      dir,
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
// 点击动作
const handleClick = () => {
  console.log('213213');
};
// 鼠标按下动作
const handleMouseDown = () => {
  const el = unrefElement(actionRef);
  if (!el) return;
  el.style.zIndex = '9999';
  timeLineEditorAreaContext.setSelectedActionId(unref(actionItem).id);
};
// 鼠标移动抬起
const handleMouseUp = () => {
  const el = unrefElement(actionRef);
  if (!el) return;
  el.style.zIndex = 'auto';
};
// 开始拖拽移动
const handleMoveStart = () => {
  deltaX.value = 0;
  deltaY.value = 0;
  isAdsorption.value = false;
  timeLineEditorAreaContext.dropzoneInfo.isMoving = true;
  timeLineEditorAreaContext.dropzoneInfo.dragId = actionItem.value.id;
  // initAutoScroll();
  handleInitGuideLine();
  if (timeLineContext.onActionMoveStart)
    timeLineContext.onActionMoveStart({ action: actionItem.value, row: rowItem.value });
};
// 拖拽移动中
const handleMove = e => {
  const target = e.target;
  const { left, width } = target.dataset;
  const preLeft = parseFloat(left || 0);
  const preWidth = parseFloat(width || 0);
  deltaX.value += e.dx;
  deltaY.value += e.dy;
  target.style.transform = `translateY( ${deltaY.value}px)`;
  const curLeft = preLeft + e.dx;
  const { start, end } = parserTransformToTime({ left: curLeft, width: preWidth }, scaleUnit.value);
  handleUpdateGuideLine({ start, end, dir: 'left' });
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
};
// 拖拽移动结束
const handleMoveEnd = (e: DragEvent) => {
  deltaX.value = 0;
  deltaY.value = 0;
  e.target.style.transform = `translateY( ${0}px)`;
  isAdsorption.value = false;
  timeLineEditorAreaContext.dropzoneInfo.isMoving = false;
  timeLineEditorAreaContext.dropzoneInfo.dragId = '';
  disposeDragLine();
  const target = e.target;
  const { left, width } = target.dataset;
  const endLeft =
    Number(left) % unref(frameWidth) > unref(frameWidth) / 2
      ? Number(left) - (Number(left) % unref(frameWidth)) + unref(frameWidth)
      : Number(left) - (Number(left) % unref(frameWidth));
  handleUpdateLeft(endLeft);
  const { start, end } = parserTransformToTime({ left: Number(endLeft), width: Number(width) }, scaleUnit.value);
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
  deltaX.value = 0;
  isAdsorption.value = false;
  // initAutoScroll();
  handleInitGuideLine();
  // 触发开始缩放回调
  if (timeLineContext.onActionResizeStart)
    timeLineContext.onActionResizeStart({ action: actionItem.value, row: rowItem.value, dir });
};
// 拖拽缩放结束
const handleResizeEnd = (e: ResizeEvent) => {
  deltaX.value = 0;
  isAdsorption.value = false;
  disposeDragLine();
  const target = e.target;
  const { left, width } = target.dataset;
  const dir: Direction = e.edges?.right ? 'right' : 'left';
  // const endLeft = dir === 'left' ? Number(left) - (Number(left) % unref(frameWidth)) : Number(left);
  // const endWidth = dir === 'right' ? Number(width) - (Number(width) % unref(frameWidth)) : Number(width);
  const { start, end } = parserTransformToTime({ left: Number(left), width: Number(width) }, scaleUnit.value);
  actionItem.value.start = start;
  actionItem.value.end = end;

  // 触发回调
  if (timeLineContext.onActionResizeEnd)
    timeLineContext.onActionResizeEnd({ action: actionItem.value, row: rowItem.value, start, end, dir });
};
// 拖拽缩放中
// eslint-disable-next-line complexity
const handleResize = (e: ResizeEvent) => {
  const target = e.target;
  const dir = e.edges?.left ? 'left' : 'right';
  const { left, width } = target.dataset;
  const preLeft = parseFloat(left || '0');
  const preWidth = parseFloat(width || '0');
  if (dir === 'left') {
    let curLeft = BigNumber(preLeft).plus(e.deltaRect!.left!).toNumber();
    curLeft =
      Number(curLeft) % unref(frameWidth) > unref(frameWidth) / 2
        ? Number(curLeft) - (Number(curLeft) % unref(frameWidth)) + unref(frameWidth)
        : Number(curLeft) - (Number(curLeft) % unref(frameWidth));
    const tempRight = preLeft + preWidth;
    const curWidth = tempRight - curLeft;
    const { start, end } = parserTransformToTime({ left: curLeft, width: curWidth }, scaleUnit.value);
    handleUpdateGuideLine({ start, end, dir });
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
    let curWidth = BigNumber(preWidth).plus(e.deltaRect!.right!).toNumber();
    curWidth =
      Number(curWidth) % unref(frameWidth) > unref(frameWidth) / 2
        ? Number(curWidth) - (Number(curWidth) % unref(frameWidth)) + unref(frameWidth)
        : Number(curWidth) - (Number(curWidth) % unref(frameWidth));
    const { start, end } = parserTransformToTime({ left: preLeft, width: curWidth }, scaleUnit.value);
    handleUpdateGuideLine({ start, end, dir });
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
const draggableRestrictRect = reactiveComputed(() => {
  return interact.modifiers.restrict({
    restriction: 'parent',
    elementRect: {
      left: 0,
      right: -Number.MAX_SAFE_INTEGER,
      top: Number.MAX_SAFE_INTEGER,
      bottom: -Number.MAX_SAFE_INTEGER
    }
  });
});
const resizeRestrictRect = reactiveComputed(() => {
  return interact.modifiers.restrictEdges({
    outer: 'parent',
    offset: {
      left: 0,
      right: Number.MAX_SAFE_INTEGER,
      top: 0,
      bottom: 0
    }
  });
});
const initDraggable = (interactInst: Interactable) => {
  interactInst.draggable({
    modifiers: [draggableRestrictRect],
    onstart: handleMoveStart,
    onmove: handleMove,
    onend: handleMoveEnd
  });
};
const restrictSize = reactiveComputed(() => {
  return interact.modifiers.restrictSize({
    min: {
      width: unref(frameWidth),
      height: 0
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
const initDragResize = (interactInst: Interactable) => {
  interactInst.resizable({
    edges: { left: true, right: true },
    modifiers: [modifiersSnap, restrictSize, resizeRestrictRect],
    margin: 5,
    onstart: handleResizeStart,
    onmove: handleResize,
    onend: handleResizeEnd
  });
};
// 初始化互动
const initInteractable = () => {
  const el = unrefElement(actionRef);
  if (!el || !unref(actionItem)) return;
  const interactInst = interact(el, {
    deltaSource: 'client',
    context: timeLineEditorRef.value!
  });
  initDraggable(interactInst);
  initDragResize(interactInst);
  interactable.value = interactInst;
};
onMounted(() => {
  initInteractable();
});
</script>

<style scoped lang="scss">
.timeLine-editor-action {
  position: absolute;
  background-color: #000;
  border-radius: 2px;
  z-index: auto;
  height: 100%;

  .active-box {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 2px;
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 5px;
    // 上部分
    .left-handle,
    .right-handle {
      position: absolute;
      width: 5px;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      bottom: 0;
    }
    .left-handle {
      left: 0px;
    }
    .right-handle {
      right: 0px;
      // border-top-right-radius: 2px;
      // border-bottom-right-radius: 2px;
    }
    .left-handle::before,
    .right-handle::before {
      background-color: #000;
      content: '';
      display: block;
      height: 10px;
      width: 2px;
    }
  }
  .active-box::before,
  .active-box::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    height: 1px;
    background-color: #fff;
  }
  .active-box::before {
    top: 0;
  }
  .active-box::after {
    bottom: 0;
  }
}
</style>
<!-- // const minDis = Number.MAX_SAFE_INTEGER;
// dragLineActionLine.assistPositions.forEach(item => {
//   const dis = Math.abs(item - curLeft);
//   if (dis < unref(guideAdsorptionDistance)! && dis < minDis) curLeft = item;
//   const dis2 = Math.abs(item - (curLeft + preWidth));
//   if (dis2 < unref(guideAdsorptionDistance)! && dis2 < minDis) curLeft = item - preWidth;
// }); -->

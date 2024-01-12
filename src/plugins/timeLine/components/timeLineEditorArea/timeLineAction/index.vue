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
        {{ actionItem.end - actionItem.start }}
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
const { scaleUnit, timeLineEditorRef, frameWidth, scrollInfo, cursorTime } = timeLineStateContext;
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
// 拖拽Y轴距离
const deltaY = ref(0);
// 自动滚动缓存滚动距离
const cacheOffset = ref(0);
// 是否吸附
const isAdsorption = ref(false);
const interactActionType = ref<string | null>(null);
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
  deltaY.value = 0;
  isAdsorption.value = false;
  interactActionType.value = 'move';
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
  deltaY.value += e.dy;
  target.style.transform = `translateY( ${deltaY.value}px)`;
  const curLeft = preLeft + e.dx;
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
};
// 拖拽移动结束
const handleMoveEnd = (e: DragEvent) => {
  deltaY.value = 0;
  cacheOffset.value = 0;
  interactActionType.value = null;
  e.target.style.transform = `translateY( ${0}px)`;
  isAdsorption.value = false;
  timeLineEditorAreaContext.dropzoneInfo.isMoving = false;
  timeLineEditorAreaContext.dropzoneInfo.dragId = '';
  disposeDragLine();
  const target = e.target;
  const { left, width } = target.dataset;
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
  isAdsorption.value = false;
  interactActionType.value = 'resize';
  // initAutoScroll();
  handleInitGuideLine();
  // 触发开始缩放回调
  if (timeLineContext.onActionResizeStart)
    timeLineContext.onActionResizeStart({ action: actionItem.value, row: rowItem.value, dir });
};
// 拖拽缩放结束
const handleResizeEnd = (e: ResizeEvent) => {
  isAdsorption.value = false;
  cacheOffset.value = 0;
  interactActionType.value = null;
  disposeDragLine();
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
    let curLeft = BigNumber(preLeft).plus(e.deltaRect!.left!).toNumber();
    curLeft = Math.round(Number(curLeft) / unref(frameWidth)) * unref(frameWidth);
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
    let curWidth = BigNumber(preWidth).plus(e.deltaRect!.right!).toNumber();
    curWidth = Math.round(Number(curWidth) / unref(frameWidth)) * unref(frameWidth);
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
const draggableRestrictRectModifier = reactiveComputed(() => {
  return interact.modifiers.restrict({
    restriction: 'parent',
    elementRect: {
      left: 0,
      right: -Infinity,
      top: Infinity,
      bottom: -Infinity
    }
  });
});
const guideSnapModifier = reactiveComputed(() => {
  return interact.modifiers.snap({
    origin: timeLineEditorRef.value!,
    targets: [
      (x, y) => {
        let adsorptionPos = x;
        const width = actionItemSize.width;
        const disListLeft: number[] = [];
        const disListRight: number[] = [];
        dragLineActionLine.assistPositions.forEach(item => {
          const dis = Math.abs(item - adsorptionPos - scrollInfo.x.value);
          const dis2 = Math.abs(item - (adsorptionPos + width) - scrollInfo.x.value);
          if (dis < unref(guideAdsorptionDistance)! && dis < Number.MAX_SAFE_INTEGER && disListRight.length === 0) {
            disListLeft.push(item);
            const minDis = Math.min(...disListLeft);
            adsorptionPos = minDis - scrollInfo.x.value;
          }
          if (dis2 < unref(guideAdsorptionDistance)! && dis2 < Number.MAX_SAFE_INTEGER && disListLeft.length === 0) {
            disListRight.push(item);
            const minDis = Math.min(...disListRight);
            adsorptionPos = minDis - scrollInfo.x.value - width;
          }
        });
        return {
          x: adsorptionPos,
          y
        };
      }
    ],
    offset: { x: 10, y: 0 },
    relativePoints: [{ x: 0, y: 0 }]
  });
});
const resizeRestrictRectModifier = reactiveComputed(() => {
  return interact.modifiers.restrictEdges({
    outer: 'parent',
    offset: {
      left: 0,
      right: Infinity,
      top: 0,
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
    origin: timeLineEditorRef.value!,
    targets: [
      (x, y) => {
        const newX = Math.round(x / unref(frameWidth)) * unref(frameWidth);
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
const snapDraggableModifier = reactiveComputed(() => {
  return interact.modifiers.snap({
    endOnly: true,
    origin: timeLineEditorRef.value!,
    targets: [
      interact.createSnapGrid({
        x: unref(frameWidth),
        y: 1
      })
    ],
    offset: { x: 10, y: 0 },
    relativePoints: [{ x: 0, y: 0 }]
  });
});
// 初始化拖拽移动
const initDraggable = (interactInst: Interactable) => {
  interactInst.draggable({
    modifiers: [draggableRestrictRectModifier, snapDraggableModifier, guideSnapModifier],
    onstart: handleMoveStart,
    onmove: handleMove,
    onend: handleMoveEnd,
    autoScroll: {
      container: '#__TIME_LINE_SCROLL_EL_BAR__',
      margin: 50,
      distance: 10,
      interval: 10
    }
  });
};
// 初始化拖拽缩放
const initDragResize = (interactInst: Interactable) => {
  interactInst.resizable({
    edges: { left: true, right: true },
    modifiers: [resizeRestrictRectModifier, snapResizeModifier, guideSnapModifier, restrictSizeModifier],
    margin: 5,
    onstart: handleResizeStart,
    onmove: handleResize,
    onend: handleResizeEnd,
    autoScroll: {
      container: '#__TIME_LINE_SCROLL_EL_BAR__',
      margin: 50,
      distance: 10,
      interval: 10
    }
  });
};
// 初始化自动滚动监听事件
const initAutoScroll = (interactInst: Interactable) => {
  interactInst &&
    interactInst.on('autoscroll', event => {
      const target = event.target;
      const { left, width } = target.dataset;
      const preLeft = parseFloat(left || 0);
      const preWidth = parseFloat(width || 0);
      cacheOffset.value += event.delta.x;
      if (interactActionType.value === 'move') {
        const curLeft = preLeft + Math.round(unref(cacheOffset) / unref(frameWidth)) * unref(frameWidth);
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
      }
      if (interactActionType.value === 'resize') {
        // const curWidth = preWidth + Math.round(unref(cacheOffset) / unref(frameWidth)) * unref(frameWidth);
        // const { start, end } = parserTransformToTime({ left: curLeft, width: preWidth }, scaleUnit.value);
        // handleUpdateGuideLine({ start, end });
        // if (timeLineContext.onActionMoving) {
        //   const ret = timeLineContext.onActionMoving({
        //     action: actionItem.value,
        //     row: rowItem.value,
        //     start,
        //     end
        //   });
        //   if (ret === false) return;
        // }
      }
      cacheOffset.value -= Math.round(unref(cacheOffset) / unref(frameWidth)) * unref(frameWidth);
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
  interactable.value = interactInst;
  initDraggable(interactInst);
  initDragResize(interactInst);
  initAutoScroll(interactInst);
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

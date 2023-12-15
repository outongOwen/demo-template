<template>
  <div
    ref="actionRef"
    class="timeLine-editor-action"
    :data-type="actionItem.type"
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
    <div
      class="wh-full flex-center"
      :style="{
        // 随机色
        backgroundColor: '#' + Math.floor(Math.random() * 0xffffff).toString(16)
      }"
    >
      <!-- 随机背景色 -->
      <div class="wh-full of-hidden">
        <!-- {{ actionItemSize }} -->
        {{ actionItem.start }}
        {{ actionItem.end }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable */
import interact from 'interactjs';
import { reactiveComputed, unrefElement, useParentElement } from '@vueuse/core';
import type { DragEvent, ResizeEvent, Interactable } from '@interactjs/types';
import { BigNumber } from 'bignumber.js';
import { useGuideLine } from '../../../hooks';
import type { TimelineAction, TimelineRow } from '../../../types';
import { useTimeLineStateContext, useTimeLineContext } from '../../../contexts';
import { parserTimeToTransform, parserTransformToTime } from '../../../utils';
import { isActionCollision } from './helper';
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
const timeLineStateContext = injectTimeLineStateContext();
const timeLineContext = injectTimeLineContext();
const { selectedActionIds, selectedActionRefs, scaleUnit, timeLineEditorRef, frameWidth } = timeLineStateContext;
const { guideLine, guideAdsorptionDistance, editorData, hideCursor } = toRefs(timeLineContext);
const preOrNextAction = reactiveComputed(() => {
  const index = unref(rowItem).actions.findIndex(item => item.id === unref(actionItem).id);
  const preAction = unref(rowItem).actions[index - 1];
  const nextAction = unref(rowItem).actions[index + 1];
  return {
    preAction,
    nextAction
  };
});
// 辅助线hook
const {
  dragLineData,
  initDragLine,
  updateDragLine,
  disposeDragLine,
  defaultGetAssistPosition,
  defaultGetMovePosition
} = useGuideLine();
// const { initAutoScroll, dealDragAutoScroll, dealResizeAutoScroll, stopAutoScroll } = useAutoScroll(timeLineEditorRef);
// interact实例
const interactable = shallowRef<Interactable>();
// 拖拽X轴距离
const deltaX = ref(0);
// 拖拽Y轴距离
const deltaY = ref(0);
// 是否吸附
const isAdsorption = ref(false);
const parentEl = useParentElement();
const isSelected = computed(() => {
  return selectedActionIds.value.includes(unref(actionItem).id);
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
  el.style.zIndex = '';
};
// 鼠标移动抬起
const handleMouseUp = () => {
  const el = unrefElement(actionRef);
  if (!el) return;
  el.style.zIndex = '1';
};
// 开始拖拽移动
const handleMoveStart = e => {
  e.target.style.zIndex = '999';
  deltaX.value = 0;
  deltaY.value = 0;
  isAdsorption.value = false;
  // initAutoScroll();
  handleInitGuideLine();
  if (timeLineContext.onActionMoveStart)
    timeLineContext.onActionMoveStart({ action: actionItem.value, row: rowItem.value });
};
const move = ({ preLeft, preWidth, dx }: { preLeft: number; preWidth: number; dx: number }) => {
  const distance = isAdsorption.value ? unref(guideAdsorptionDistance) : 0.1;
  // 控制吸附
  if (Math.abs(deltaX.value) >= distance!) {
    let curLeft =
      Number(
        BigNumber(preLeft)
          .plus(BigNumber(unref(deltaX)))
          .toFixed(2)
      ) > 0
        ? Number(BigNumber(preLeft).plus(BigNumber(unref(deltaX))))
        : 0;
    // 控制吸附
    let adsorption = curLeft;
    const minDis = Number.MAX_SAFE_INTEGER;
    dragLineData.assistPositions.forEach(item => {
      const dis = Math.abs(item - curLeft);
      if (dis < unref(guideAdsorptionDistance)! && dis < minDis) adsorption = item;
      const dis2 = Math.abs(item - (curLeft + preWidth));
      if (dis2 < unref(guideAdsorptionDistance)! && dis2 < minDis) adsorption = item - preWidth;
    });

    if (adsorption !== curLeft) {
      // 采用吸附数据
      isAdsorption.value = true;
      curLeft = adsorption;
    } else {
      isAdsorption.value = false;
    }
    deltaX.value %= unref(distance)!;
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
  }
};
// const move = ({ preLeft, preWidth, dx }: { preLeft: number; preWidth: number; dx: number }) => {
//   const curLeft =
//     Number(BigNumber(preLeft).plus(BigNumber(dx)).toFixed(2)) > 0 ? Number(BigNumber(preLeft).plus(BigNumber(dx))) : 0;
//   const { start, end } = parserTransformToTime({ left: curLeft, width: preWidth }, scaleUnit.value);
//   handleUpdateGuideLine({ start, end, dir: 'left' });
//   if (timeLineContext.onActionMoving) {
//     const ret = timeLineContext.onActionMoving({
//       action: actionItem.value,
//       row: rowItem.value,
//       start,
//       end
//     });
//     if (ret === false) return;
//   }
//   handleUpdateLeft(curLeft);
// };
// 拖拽移动中
const handleMove = (e: DragEvent) => {
  const target = e.target;
  const { left, width } = target.dataset;
  const preLeft = parseFloat(left!);
  const preWidth = parseFloat(width!);
  deltaX.value += e.dx;
  deltaY.value += e.dy;
  target.style.transform = `translateY( ${deltaY.value}px)`;
  move({ preLeft, preWidth, dx: e.dx });
};
// 拖拽移动结束
const handleMoveEnd = (e: DragEvent) => {
  deltaX.value = 0;
  deltaY.value = 0;
  e.target.style.transform = `translateY( ${0}px)`;
  e.target.style.zIndex = 'auto';
  isAdsorption.value = false;
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
  if (timeLineContext.onActionMoveEnd)
    timeLineContext.onActionMoveEnd({ action: actionItem.value, row: rowItem.value, start, end });
};
// 开始拖拽缩放
const handleResizeStart = (e: ResizeEvent) => {
  const dir = e.edges?.left ? 'left' : 'right';
  deltaX.value = 0;
  e.target.style.zIndex = '999999';
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
  e.target.style.zIndex = 'auto';
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
// eslint-disable-next-line complexity
const handleResize = (e: ResizeEvent) => {
  const target = e.target;
  const dir = e.edges?.left ? 'left' : 'right';
  const { left = '0', width = '0' } = target.dataset;
  const preLeft = parseFloat(left);
  const preWidth = parseFloat(width);
  deltaX.value += dir === 'left' ? e.deltaRect!.left : e.deltaRect!.right;
  const distance = isAdsorption.value ? unref(guideLineSnap) : unref(gridX);

  // 判断缩放时是否与其他动作发生碰撞
  // console.log(deltaX.value, 'deltaX.value');
  // console.log(e.deltaRect!.left, 'e.deltaRect!.left');
  // console.log(e.deltaRect!.right, 'e.deltaRect!.right');

  // if (isActionCollision(start, end, rowItem.value)) {
  //   // 恢复原状
  //   // handleUpdateLeft(preLeft);
  //   // handleUpdateWidth(preWidth);
  //   return;
  // }
  if (dir === 'left') {
    if (distance && Math.abs(deltaX.value) >= distance) {
      const count = parseInt(`${deltaX.value / distance}`, 10);
      let curLeft = preLeft + count * distance!;
      // 控制吸附
      let adsorption = curLeft;
      const minDis = Number.MAX_SAFE_INTEGER;
      dragLineData.assistPositions.forEach(item => {
        const dis = Math.abs(item - curLeft);
        if (dis < unref(guideLineSnap)! && dis < minDis) adsorption = item;
      });

      if (adsorption !== curLeft) {
        // 采用吸附数据
        isAdsorption.value = true;
        curLeft = adsorption;
      } else {
        // 控制grid网格
        if ((curLeft - unref(actionItem).start) % unref(gridX)! !== 0) {
          curLeft =
            unref(actionItem).start + unref(gridX)! * Math.round((curLeft - unref(actionItem).start) / unref(gridX)!);
        }
        isAdsorption.value = false;
      }
      deltaX.value %= distance;
      const tempRight = preLeft + preWidth;
      const curWidth = tempRight - curLeft;
      const { start, end } = parserTransformToTime({ left: curLeft, width: curWidth }, scaleUnit.value);
      handleUpdateGuideLine({ start, end, dir });
      // 判断左侧不超过0
      if (curLeft < 0) {
        // 恢复原状
        handleUpdateLeft(0);
        handleUpdateWidth(preWidth);
        return;
      }
      // // 判断是否与其他动作发生碰撞
      // if (isActionCollision(start, end, rowItem.value)) {
      //   // 恢复原状
      //   handleUpdateWidth(preWidth);
      //   handleUpdateLeft(preLeft);
      //   return;
      // }

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
  }
  if (dir === 'right') {
    // 拖动右侧
    if (distance && Math.abs(deltaX.value) >= distance) {
      const count = parseInt(`${deltaX.value / unref(gridX)!}`, 10);
      let curWidth = preWidth + count * unref(gridX)!;
      // 控制吸附
      let adsorption = preLeft + curWidth;
      const minDis = Number.MAX_SAFE_INTEGER;
      dragLineData.assistPositions.forEach(item => {
        const dis = Math.abs(item - (preLeft + curWidth));
        if (dis < unref(guideLineSnap)! && dis < minDis) adsorption = item;
      });

      if (adsorption !== preLeft + curWidth) {
        // 采用吸附数据
        isAdsorption.value = true;
        curWidth = adsorption - preLeft;
      } else {
        // 控制grid网格
        let tempRight = preLeft + curWidth;
        if ((tempRight - unref(actionItem).start) % unref(gridX)! !== 0) {
          tempRight =
            unref(actionItem).start + unref(gridX)! * Math.round((tempRight - unref(actionItem).start) / unref(gridX)!);
          curWidth = tempRight - preLeft;
        }
        isAdsorption.value = false;
      }
      deltaX.value %= distance;
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
  }
};
// 初始化互动
const initInteractable = () => {
  const el = unrefElement(actionRef);
  if (!el || !unref(actionItem)) return;
  const interactInst = interact(el);
  interactInst.draggable({
    // enable inertial throwing
    inertia: false,
    modifiers: [
      interact.modifiers.restrict({
        restriction: parentEl.value!,
        elementRect: {
          top: Number.MAX_SAFE_INTEGER,
          left: 0,
          bottom: -Number.MAX_SAFE_INTEGER,
          right: -Number.MAX_SAFE_INTEGER
        }
      })
    ],
    onstart: handleMoveStart,
    onmove: handleMove,
    onend: handleMoveEnd
  });
  // interactInst.resizable({
  //   edges: { left: true, right: true },
  //   modifiers: [
  //     interact.modifiers.restrictSize({
  //       min: { width: unref(frameWidth), height: 0 }
  //     }),
  //     interact.modifiers.restrictEdges({
  //       outer: 'parent',
  //       offset: {
  //         top: -Number.MAX_SAFE_INTEGER,
  //         left: 10,
  //         bottom: -Number.MAX_SAFE_INTEGER,
  //         right: -Number.MAX_SAFE_INTEGER
  //       }
  //     })
  //   ],
  //   margin: 0,
  //   onstart: handleResizeStart,
  //   onmove: handleResize,
  //   onend: handleResizeEnd
  // });
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
    // 上部分
    .left-handle,
    .right-handle {
      position: absolute;
      width: 5px;
      background-color: #fff;
      cursor: ew-resize;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      bottom: 0;
    }
    .left-handle {
      left: 0px;
      // border-top-left-radius: 2px;
      // border-bottom-left-radius: 2px;
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

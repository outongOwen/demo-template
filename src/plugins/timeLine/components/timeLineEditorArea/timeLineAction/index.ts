/* eslint-disable */
/* prettier-ignore */
// @ts-nocheck
import interact from 'interactjs';
import { reactiveComputed, toReactive, unrefElement } from '@vueuse/core';
import type { DragEvent, ResizeEvent, Interactable } from '@interactjs/types';
import type { MaybeComputedElementRef, MaybeRef } from '@vueuse/core';
import type { TimelineAction, TimelineRow } from '../../../types';
import { useTimeLineStateContext, useTimeLineContext } from '../../../contexts';
type Direction = 'left' | 'right';
export default (
  actionRef: MaybeComputedElementRef,
  actionItem: MaybeRef<TimelineAction>,
  rowItem: MaybeRef<TimelineRow>
) => {
  const { injectTimeLineStateContext } = useTimeLineStateContext();
  const { injectTimeLineContext } = useTimeLineContext();
  const timeLineStateContext = injectTimeLineStateContext();
  const timeLineContext = injectTimeLineContext();
  // interact实例
  const interactable = shallowRef<Interactable>();
  // 拖拽距离
  const deltaX = ref(0);
  // 是否吸附
  const isAdsorption = ref(false);
  const { selectedActionIds, selectedActionRefs, scaleUnit } = timeLineStateContext;
  watchEffect(() => {
    console.log(unref(rowItem));
    console.log('selectedActionIds', selectedActionIds.value);
  });
  const isSelected = computed(() => {
    return selectedActionIds.value.includes(unref(actionItem).id);
  });
  watch(
    isSelected,
    () => {
      const el = unrefElement(actionRef);
      if (!el) return;
      if (isSelected.value) {
        selectedActionRefs.value.set(unref(actionItem).id, el);
      } else {
        selectedActionRefs.value.delete(unref(actionItem).id);
      }
    },
    {
      immediate: true
    }
  );
  const snap = reactiveComputed(() => {
    return interact.modifiers.snap({
      targets: [interact.snappers.grid({ x: unref(scaleUnit) * 100, y: 1 })]
    });
  });
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
  const handleMoveStart = (event: DragEvent) => {};
  // 拖拽移动中
  const handleMove = (event: DragEvent) => {
    // console.log(event, '_+_+_+_+_+');
    const target = event.target;
    if (!target) return;
    // keep the dragged position in the data-x/data-y attributes
    const { x: dataX = '0', y: dataY = '0' } = target.dataset;
    const x = (parseFloat(dataX!) || 0) + event.dx;
    const y = (parseFloat(dataY!) || 0) + event.dy;

    if (selectedActionIds.value.length) {
      // translate the element
      selectedActionIds.value.forEach(id => {
        const el = selectedActionRefs.value.get(id);
        if (!el) return;
        el.style.transform = `translate(${x}px, ${y}px)`;
        Object.assign(el.dataset, { x, y });
      });
    } else {
      target.style.transform = `translate(${x}px, ${y}px)`;
      // update the posiion attributes
      Object.assign(target.dataset, { x, y });
    }
  };
  // 拖拽移动结束
  const handleMoveEnd = (event: DragEvent) => {};
  // 开始拖拽缩放
  const handleResizeStart = (e: ResizeEvent) => {
    const target = e.target;
    const dir = e.edges?.left ? 'left' : 'right';
    const { left, width } = target.dataset;
    const preLeft = parseFloat(left!);
    const preWidth = parseFloat(width!);
    deltaX.value = 0;
    isAdsorption.value = false;
  };
  // 拖拽缩放中
  const handleResize = (e: ResizeEvent) => {
    const target = e.target;
    const dir = e.edges?.left ? 'left' : 'right';
    const { left = '0', width = '0' } = target.dataset;
    const preLeft = parseFloat(left!);
    const preWidth = parseFloat(width!);
    console.log(preLeft, preWidth, 'preLeft,preWidth');
    deltaX.value = dir === 'left' ? e.deltaRect!.left : e.deltaRect!.right;
  };
  // 拖拽缩放结束
  const handleResizeEnd = (e: ResizeEvent) => {
    deltaX.value = 0;
    isAdsorption.value = false;
    // stopAutoScroll();

    const target = e.target;
  };
  // 更新移动
  const updateMove = () => {};
  // 更新缩放
  const updateResize = (param: { preLeft: number; preWidth: number; dir: 'left' | 'right' }) => {
    if (!interactable.value) return;
    const { dir, preWidth, preLeft } = param;
    const target = interactable.value.target as HTMLElement;
    if (dir === 'left') {
      const curLeft = preLeft + deltaX.value;
      const curWidth = preWidth - deltaX.value;
      target.style.left = `${curLeft}px`;
      target.style.width = `${curWidth}px`;
      Object.assign(target.dataset, { left: curLeft, width: curWidth });
      unref(actionItem).start = curLeft * unref(scaleUnit)!;
    }
    if (dir === 'right') {
      const curWidth = preWidth + deltaX.value;
      target.style.width = `${curWidth}px`;
      Object.assign(target.dataset, { width: curWidth });
      unref(actionItem).end = (preLeft + curWidth) * unref(scaleUnit)!;
    }
  };
  // 更新宽度
  const updateWidth = (width: number) => {
    if (!interactable.value?.target) return;
    const target = interactable.value.target as HTMLElement;
    target.style.width = `${width}px`;
    Object.assign(target.dataset, { width });
  };
  // 更新left
  const updateLeft = (left: number) => {
    if (!interactable.value?.target) return;
    const target = interactable.value.target as HTMLElement;
    target.style.left = `${left}px`;
    Object.assign(target.dataset, { left });
  };
  // 初始化互动
  const initInteractable = () => {
    const el = unrefElement(actionRef);
    if (!el || !unref(actionItem)) return;
    const interactInst = interact(el);
    interactInst.draggable({
      // enable inertial throwing
      inertia: false,
      // // keep the element within the area of it's parent
      modifiers: [
        interact.modifiers.snap({
          targets: [interact.snappers.grid({ x: 30, y: 1 })],
          range: Infinity,
          relativePoints: [{ x: 0, y: 0 }]
        })
      ],
      onstart: handleMoveStart,
      onmove: handleMove,
      // call this function on every dragend event
      onend: handleMoveEnd
    });
    interactInst.resizable({
      edges: { left: true, right: true },
      modifiers: [snap],
      margin: 5,
      onstart: handleResizeStart,
      onmove: handleResize,
      onend: handleResizeEnd
    });
    interactable.value = interactInst;
  };
  return {
    initInteractable,
    timeLineStateContext,
    handleClick,
    handleMouseDown,
    handleMouseUp,
    isSelected,
    selectedActionIds,
    scaleUnit
  };
};

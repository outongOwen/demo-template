// import { getCurrentInstance } from 'vue';
import interact from 'interactjs';
import { unrefElement } from '@vueuse/core';
import type { DragEvent } from '@interactjs/types';
import type { MaybeComputedElementRef, MaybeRef } from '@vueuse/core';
import type { TimelineAction } from '../../../types';
import { useTimeLineStateContext, useTimeLineContext } from '../../../contexts';

export default (
  actionRef: MaybeComputedElementRef,
  actionItem: MaybeRef<TimelineAction>
  // rowItem: MaybeRef<TimelineRow>
) => {
  const { injectTimeLineStateContext } = useTimeLineStateContext();
  const { injectTimeLineContext } = useTimeLineContext();
  const timeLineStateContext = injectTimeLineStateContext();
  const timeLineContext = injectTimeLineContext();
  // const deltaX = ref(0); // 拖拽距离
  // const isAdsorption = ref(false); // 是否吸附
  const { selectedActionIds, selectedActionRefs } = timeLineStateContext;
  const { scaleSmallCellMs, scaleSmallCellWidth } = toRefs(timeLineContext);
  watchEffect(() => {
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
  const dragMoveListener = (event: DragEvent) => {
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
  /* const handleResizeStart = (e: ResizeEvent) => {
    const target = e.target;
    const dir = e.edges?.left ? 'left' : 'right';
    const { left, width } = target.dataset;
    const preLeft = parseFloat(left!);
    const preWidth = parseFloat(width!);
    deltaX.value = 0;
    isAdsorption.value = false;
  }; */
  /* const handleResize = (e: ResizeEvent) => {
    const target = e.target;
    const dir = e.edges?.left ? 'left' : 'right';
    const { left = '0', width = '0' } = target.dataset;
    const preLeft = parseFloat(left!);
    const preWidth = parseFloat(width!);
    deltaX.value += dir === 'left' ? e.deltaRect!.left : e.deltaRect!.right;
    if (dir === 'left') {
      target.style.left = `${preLeft + deltaX.value}px`;
      target.style.width = `${preWidth - deltaX.value}px`;
      Object.assign(target.dataset, { left, width });
    }
    if (dir === 'right') {
      // console.log(scaleSmallCellMs, 'scaleSmallCellMsscaleUnit');
      // console.log(deltaX.value, 'deltaX.valuedeltaX.value');
      const curWidth = preWidth + deltaX.value * scaleSmallCellMs!;
      console.log(deltaX.value * scaleSmallCellMs!, '_+_+');
      // target.style.width = `${curWidth}px`;
      // Object.assign(target.dataset, { width: curWidth });
    }
  };
  const handleResizeEnd = (e: ResizeEvent) => {
    deltaX.value = 0;
    isAdsorption.value = false;
    // stopAutoScroll();

    const target = e.target;
  }; */
  /* const updateResize = (e: ResizeEvent) => {};
  // 初始化互动
  const initInteractResizable = () => {
    const el = unrefElement(actionRef);
    if (!el || !unref(actionItem)) return;
    interact(el).resizable({
      edges: { left: true, right: true },
      margin: 5,
      onstart: handleResizeStart,
      onmove: handleResize,
      onend: handleResizeEnd
    });
  }; */
  const initInteractDraggable = () => {
    const el = unrefElement(actionRef);
    if (!el) return;
    interact(el).draggable({
      // enable inertial throwing
      inertia: false,
      // // keep the element within the area of it's parent
      modifiers: [
        // interact.modifiers.restrict({
        //   restriction: '#__TIME_LINE_SCROLL_EL_BAR__',
        //   elementRect: { top: 0, left: 0, bottom: 0, right: 0 },
        //   offset: {
        //     top: 0,
        //     left: 10,
        //     bottom: 0,
        //     right: 0
        //   }
        // })
        // interact.modifiers.snap({
        //   targets: [interact.snappers.grid({ x: 30, y: 1 })],
        //   range: Infinity,
        //   relativePoints: [{ x: 0, y: 0 }]
        // })
      ],
      onstart: () => {
        timeLineStateContext.rowLinePosition.isMoving = true;
      },
      onmove: dragMoveListener,
      // call this function on every dragend event
      onend: () => {
        timeLineStateContext.rowLinePosition.isMoving = false;
        timeLineStateContext.rowLinePosition.y = -1;
      }
    });
  };

  return {
    // initInteractResizable,
    initInteractDraggable,
    timeLineStateContext,
    handleClick,
    handleMouseDown,
    handleMouseUp,
    isSelected,
    selectedActionIds,
    scaleSmallCellMs,
    scaleSmallCellWidth
  };
};

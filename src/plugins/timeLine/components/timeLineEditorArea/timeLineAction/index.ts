// import { getCurrentInstance } from 'vue';
import interact from 'interactjs';
import { unrefElement } from '@vueuse/core';
import type { DragEvent } from '@interactjs/types';
import type { MaybeComputedElementRef, MaybeRef } from '@vueuse/core';
import type { TimelineAction } from '../../../types';
import { useTimeLineStateContext } from '../../../contexts';
export default (actionRef: MaybeComputedElementRef, actionItem: MaybeRef<TimelineAction>) => {
  const { injectTimeLineStateContext } = useTimeLineStateContext();
  const timeLineStateContext = injectTimeLineStateContext();
  const { selectedActionIds, selectedActionRefs } = toRefs(timeLineStateContext);
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
    el.style.zIndex = '999';
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

    if (selectedActionIds.value.length) {
      // translate the element
      selectedActionIds.value.forEach(id => {
        const el = selectedActionRefs.value.get(id);
        if (!el) return;
        const { x: dataX = '0', y: dataY = '0' } = el.dataset;
        const x = (parseFloat(dataX!) || 0) + event.dx;
        const y = (parseFloat(dataY!) || 0) + event.dy;
        el.style.transform = `translate(${x}px, ${y}px)`;
        Object.assign(el.dataset, { x, y });
      });
    } else {
      const { x: dataX = '0', y: dataY = '0' } = target.dataset;
      const x = (parseFloat(dataX!) || 0) + event.dx;
      const y = (parseFloat(dataY!) || 0) + event.dy;
      target.style.transform = `translate(${x}px, ${y}px)`;
      // update the posiion attributes
      Object.assign(target.dataset, { x, y });
    }
  };
  // 初始化互动
  const initInteractResizable = () => {
    const el = unrefElement(actionRef);
    if (!el) return;
    interact(el).resizable({
      edges: { left: true, right: true },
      margin: 5,
      modifiers: [
        interact.modifiers.restrictSize({
          min: { width: 1, height: 10 }
        })
      ],
      onmove: event => {
        let { x, y } = event.target.dataset;
        x = (parseFloat(x) || 0) + event.deltaRect.left;
        y = (parseFloat(y) || 0) + event.deltaRect.top;
        Object.assign(event.target.style, {
          width: `${event.rect.width}px`,
          transform: `translate(${x}px, ${y}px)`
        });
        (unref(actionItem) as any).width = event.rect.width;
        Object.assign(event.target.dataset, { x, y });
      }
    });
  };
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
      listeners: {
        // call this function on every dragmove event
        move: dragMoveListener
        // call this function on every dragend event
      }
    });
  };

  return {
    initInteractResizable,
    initInteractDraggable,
    timeLineStateContext,
    handleClick,
    handleMouseDown,
    handleMouseUp,
    isSelected,
    selectedActionIds
  };
};

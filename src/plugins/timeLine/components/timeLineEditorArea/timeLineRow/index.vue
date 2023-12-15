<!--
 * new page
 * @author: owenTong
 * @since: 2023-07-13
 * index.vue
-->

<template>
  <div
    ref="rowRef"
    class="timeLine-editor-row"
    :data-type="rowItem.type"
    :style="{
      height: rowItem?.rowHeight ? rowItem.rowHeight + 'px' : rowHeight + 'px'
    }"
  >
    <TimeLineAction v-for="item in rowItem.actions" :key="item.id" :action-item="item" :row-item="rowItem" />
  </div>
</template>

<script setup lang="ts">
// @ts-nocheck
/* eslint-disable */
import interact from 'interactjs';
import type { Interactable } from '@interactjs/types';
import { useTimeLineContext, useTimeLineStateContext } from '../../../contexts';
import type { TimelineRow } from '../../../types';
import TimeLineAction from '../timeLineAction/index.vue';
interface Props {
  rowItem: TimelineRow;
}
interface Expose {
  rowRef: Ref<HTMLElement | undefined>;
}
defineOptions({
  name: 'TimeLineRow'
});
const props = defineProps<Props>();
const { rowItem } = toRefs(props);
rowItem.value.actions.forEach(item => {
  (item as any).width = 400;
});
const { injectTimeLineContext } = useTimeLineContext();
const timeLineContext = injectTimeLineContext();
const { rowHeight, rowBackground, leftOffset } = toRefs(timeLineContext);
const { injectTimeLineStateContext } = useTimeLineStateContext();
const timeLineStateContext = injectTimeLineStateContext();
const dragJudge = event => {
  const dropzoneElement = event.target;
  const draggableEvent = event.dragEvent;
  const { top: cTop } = timeLineStateContext.timeLineEditorRef.value!.getBoundingClientRect();
  const { top: rTop, bottom: rBottom, height: rHeight } = dropzoneElement.getBoundingClientRect();
  const ty = rTop - cTop;
  const cy = rTop - cTop + rHeight / 2;
  const by = rBottom - cTop;
  // 计算鼠标相对于拖拽元素的相对位置
  const relativeY = draggableEvent.clientY - cTop;
  // 判断与那个边相交（容错1px）
  if (parseFloat(relativeY) <= parseFloat(ty + 2)) {
    console.log('top');
    timeLineStateContext.rowLinePosition.y = ty - 5;
  } else if (parseFloat(relativeY) >= parseFloat(by) - 2) {
    console.log('bottom');
    timeLineStateContext.rowLinePosition.y = by + 5;
  } else {
    timeLineStateContext.rowLinePosition.y = cy;
    console.log('center');
  }
};
const rowRef = ref<HTMLElement>();
onMounted(() => {
  interact(rowRef.value!).dropzone({
    accept: ({ dropzone, draggableElement }: { dropzone: Interactable; draggableElement: Element }) => {
      if (rowItem.value.includes?.length) {
        return rowItem.value.includes.includes(draggableElement.getAttribute('data-type')!);
      }
      if (rowItem.value.excludes?.length) {
        return !rowItem.value.excludes.includes(draggableElement.getAttribute('data-type')!);
      }
      return (dropzone.target as Element).getAttribute('data-type') === draggableElement.getAttribute('data-type');
    },
    overlap: 'pointer',
    // ondropactivate(event) {
    //   // add active dropzone feedback
    //   console.log('ondropactivate');
    // },
    // ondropdeactivate(event) {
    //   // remove active dropzone feedback
    //   console.log('ondropdeactivate');
    // },
    ondragenter(event) {
      dragJudge(event);
    },
    ondropmove(event) {
      dragJudge(event);
    },
    ondragleave(event) {
      dragJudge(event);
    }
    // ondrop(event) {
    //   // dragJudge(event);
    // }
  });
});
defineExpose<Expose>({
  rowRef
});
</script>

<style scoped>
.timeLine-editor-row {
  position: relative;
  flex-shrink: 0;
  background-color: v-bind('rowBackground');
  width: 100%;
}
/* .timeLine-editor-row:hover {
  background-color: v-bind('rowActiveBackground');
} */
</style>

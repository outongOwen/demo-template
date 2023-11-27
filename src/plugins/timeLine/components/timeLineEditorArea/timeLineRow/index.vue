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
    :style="{
      height: rowItem?.rowHeight ? rowItem.rowHeight + 'px' : rowHeight + 'px',
      marginLeft: `${leftOffset}px`,
      width: `calc(100% - ${leftOffset}px)`
    }"
  >
    <TimeLineAction
      v-for="(item, index) in rowItem.actions"
      :key="item.id"
      :style="{
        // width: `${item.width}px`,
        left: `${index * 410}px`
      }"
      :action-item="item"
    />
  </div>
</template>

<script setup lang="ts">
import interact from 'interactjs';
// import type { Interactable } from '@interactjs/types';
import { toReactive } from '@vueuse/core';
import { useTimeLineContext } from '../../../contexts';
import type { TimelineRow } from '../../../types';
import TimeLineAction from '../timeLineAction/index.vue';
interface Props {
  rowItem: TimelineRow;
}
interface Expose {
  rowRef: Ref<HTMLElement | undefined>;
}
const props = defineProps<Props>();
const { rowItem } = toRefs(props);
rowItem.value.actions.forEach(item => {
  (item as any).width = 400;
});
const { injectTimeLineContext } = useTimeLineContext();
const timeLineContext = injectTimeLineContext();
const { rowHeight, rowBackground, leftOffset } = toReactive(timeLineContext);
// const { injectTimeLineStateContext } = useTimeLineStateContext();
// const timeLineStateContext = injectTimeLineStateContext();

const rowRef = ref<HTMLElement>();
onMounted(() => {
  interact(rowRef.value!).dropzone({
    // accept: ({ dropzone, draggableElement }: { dropzone: Interactable; draggableElement: Element }) => {},
    accept: '.timeLine-editor-action',
    overlap: 0.1,
    // ondropactivate(event) {
    //   // add active dropzone feedback
    //   console.log('ondropactivate');
    // },
    // ondropdeactivate(event) {
    //   // remove active dropzone feedback
    //   console.log('ondropdeactivate');
    // },
    // ondropmove(event) {
    //   console.log(event.target, 'rowRef---ondropmove');
    // },
    // ondragenter(event) {
    //   console.log(rowItem.value);
    // }
    // ondragleave(event) {
    //   console.log('ondragleave');
    // },
    ondrop(event) {
      const draggableElement = event.relatedTarget;
      const dropzoneElement = event.target;
      console.log(draggableElement, dropzoneElement, 'ondrop');
      // Object.assign(draggableElement.target.dataset, {
      //   y: dropzoneElement.dataset.y
      // });
      // Object.assign(draggableElement.style, { transform: `translate(${dropzoneElement.dataset.y}px)` });
    }
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

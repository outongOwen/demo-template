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
      v-for="item in rowItem.actions"
      :key="item.id"
      :style="{
        width: `${(item.trimEnd - item.trimStart) / timeLineStateContext.msPerPx}px`,
        left: `${item.start / timeLineStateContext.msPerPx}px`
      }"
      :action-item="item"
    />
  </div>
</template>

<script setup lang="ts">
// import type { Interactable } from '@interactjs/types';
import { toReactive } from '@vueuse/core';
import { useTimeLineContext, useTimeLineStateContext } from '../../../contexts';
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
const { injectTimeLineStateContext } = useTimeLineStateContext();
const timeLineStateContext = injectTimeLineStateContext();

const rowRef = ref<HTMLElement>();

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

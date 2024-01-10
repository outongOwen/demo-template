<!--
 * new page
 * @author: owenTong
 * @since: 2023-12-04
 * index.vue
-->
<template>
  <div class="drag-guide-line-container">
    <template v-if="dragLineActionLine.isMoving">
      <div
        v-for="(item, index) in lineList"
        :key="index"
        class="drag-line"
        :style="{
          left: `${item + leftOffset!}px`
        }"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { useTimeLineContext, useTimeLineStateContext } from '../../../contexts';
import { useActionGuideLine } from '../../../hooks';
defineOptions({
  name: 'DragGuideLine'
});
const { injectTimeLineContext } = useTimeLineContext();
const timeLineContext = injectTimeLineContext();
const { injectTimeLineStateContext } = useTimeLineStateContext();
const timeLineStateContext = injectTimeLineStateContext();
const { leftOffset } = toRefs(timeLineContext);
const { scrollInfo } = timeLineStateContext;
console.log(scrollInfo);
const { dragLineActionLine } = useActionGuideLine();
const lineList = computed(() => {
  return dragLineActionLine.movePositions.filter(mItem => {
    return dragLineActionLine.assistPositions.some(dItem => {
      const dis = Math.abs(mItem - dItem);
      return Math.round(dis) <= 0.001;
    });
  });
});
</script>

<style scoped lang="scss">
.drag-guide-line-container {
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  > .drag-line {
    width: 0;
    position: absolute;
    top: 0;
    height: 100%;
    border-left: 1px dashed rgba(82, 151, 255, 0.6);
  }
}
</style>

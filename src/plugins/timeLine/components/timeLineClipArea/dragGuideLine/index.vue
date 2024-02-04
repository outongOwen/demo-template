<!--
 * new page
 * @author: owenTong
 * @since: 2023-12-04
 * index.vue
-->
<template>
  <div class="drag-guide-line-container">
    <template v-if="dragLineActionLine.isMoving && getShareProps.guideLine">
      <div
        v-for="(item, index) in lineList"
        :key="index"
        class="drag-column-line"
        :style="{
          left: `${item + Number(getShareProps.leftOffset)}px`,
          top: `${getScrollInfo.y}px`
        }"
      />
    </template>
    <div
      v-show="timeLineEditorAreaContext.dropzoneInfo.isMoving"
      class="drag-row-line"
      :style="{
        top: `${timeLineEditorAreaContext.dropzoneInfo.top - 0.5}px`,
        left: `${getScrollInfo.x}px`
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { useTimeLineEditorAreaContext } from '../../../contexts';
import { useActionGuideLine } from '../../../hooks';
import { useTimeLineStore, useTimeLineScaleStore } from '../../../store';
defineOptions({
  name: 'DragGuideLine'
});
const { injectTimeLineEditorAreaContext } = useTimeLineEditorAreaContext();
const timeLineEditorAreaContext = injectTimeLineEditorAreaContext();
const { getCursorTime, getShareProps, getScrollInfo } = useTimeLineStore();
const { getScaleUnit } = useTimeLineScaleStore();
const { dragLineActionLine } = useActionGuideLine();
const lineList = computed(() => {
  return dragLineActionLine.movePositions.filter(mItem => {
    return dragLineActionLine.assistPositions.some(dItem => {
      const dis = Math.abs(mItem - dItem);
      const dis2 = Math.abs(dItem - unref(getCursorTime) / unref(getScaleUnit));
      return Math.round(dis) <= 0.001 && Math.round(dis2) > 0.001;
    });
  });
});
</script>

<style scoped lang="scss">
.drag-guide-line-container {
  position: absolute;
  left: -0.5px;
  top: 0;
  bottom: 0;
  right: 0;
  pointer-events: none;
  user-select: none;
  touch-action: none;
  .drag-column-line {
    position: absolute;
    width: 0;
    top: 0;
    left: 0px;
    height: 100%;
    border-left: 1px dashed rgba(82, 151, 255, 0.6);
    z-index: 10;
  }
  .drag-row-line {
    position: absolute;
    width: 100%;
    left: 0px;
    height: 1px;
    background-color: rgba(82, 151, 255, 0.6);
    z-index: 10;
  }
}
</style>

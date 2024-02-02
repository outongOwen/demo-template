<!--
 * new page
 * @author: owenTong
 * @since: 2024-01-31
 * index.vue
-->
<template>
  <div
    ref="timeLineScaleRef"
    class="timeLine-rule-container"
    :style="{
      height: `${getShareProps.scaleHeight}px`,
      left: `${offsetLeft}px`
    }"
  >
    <ScaleGrid
      v-for="(grid, index) in getGridBufferList"
      :key="index"
      :frame="grid.frame"
      :width="grid.width"
      :show-number="grid.showNumber"
    />
  </div>
</template>

<script setup lang="ts">
import { useTimeLineStore, useTimeLineScaleStore } from '../../store';
import ScaleGrid from './scaleGrid/index.vue';
const { getShareProps, getScrollInfo, getTimeLineClipDomSize } = useTimeLineStore();
const { setFrameWidth, updateGridBufferList, getGridBufferList } = useTimeLineScaleStore();
defineOptions({
  name: 'TimeLineScaleArea'
});
const offsetLeft = computed(() => {
  return Number(getShareProps.leftOffset) - getScrollInfo.x > 0
    ? Number(getShareProps.leftOffset) - getScrollInfo.x
    : 0;
});
watchEffect(() => {
  getShareProps?.fps && setFrameWidth(Number(getShareProps.fps) / 1000);
});
watch(
  [() => getScrollInfo.x, () => getTimeLineClipDomSize.width],
  () => {
    updateGridBufferList();
  },
  {
    immediate: true
  }
);
</script>

<style scoped lang="scss">
.timeLine-rule-container {
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  // overflow: hidden;
  z-index: 9;
  display: flex;
  flex-direction: row;
}
</style>

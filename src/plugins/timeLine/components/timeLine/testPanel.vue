<!--
 * new page
 * @author: owenTong
 * @since: 2024-02-01
 * testPanel.vue
-->
<template>
  <div ref="testPanelRef" class="container" :style="style">
    <div class="bg-[rgba(0,0,0,0.6)] absolute-center filter-blur-10px" />
    <n-space vertical :size="1" class="overflow-scroll absolute-lt wh-full absolute z-99">
      <n-text>
        <n-text class="title">getCursorTime:</n-text>
        {{ getCursorTime }}
      </n-text>
      <n-text>
        <n-text class="title">getFrameWidth:</n-text>
        {{ getFrameWidth }}
      </n-text>
      <n-text>
        <n-text class="title">getInteractState:</n-text>
        {{ getInteractState }}
      </n-text>
      <n-text>
        <n-text class="title">getPreviewCursorState:</n-text>
        {{ getPreviewCursorState }}
      </n-text>
      <n-text>
        <n-text class="title">getGridInfo:</n-text>
        {{ getGridInfo }}
      </n-text>
      <n-text>
        <n-text class="title">getTimeLineClipInnerSize:</n-text>
        {{ getTimeLineClipInnerSize }}
      </n-text>
      <n-text>
        <n-text class="title">getGridBufferList:</n-text>
        <n-list v-for="(item, index) in getGridBufferList" :key="index" class="bg-transparent flex flex-wrap">
          {{ item }}
        </n-list>
      </n-text>
      <!-- <n-text>
        <n-text class="title">getActionX:</n-text>
        {{ Array.from(getActionX) }}
      </n-text>
      <n-text>
        <n-text class="title">getRowY:</n-text>
        {{ Array.from(getRowY) }}
      </n-text>
      <n-text>
        <n-text class="title">getPos:</n-text>
        {{ getPos }}
      </n-text> -->
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from '@vueuse/core';
import { useTimeLineStore, useTimeLineScaleStore } from '../../store';
const { getCursorTime, getInteractState, getPreviewCursorState } = useTimeLineStore();
const { getFrameWidth, getGridInfo, getTimeLineClipInnerSize, getGridBufferList } = useTimeLineScaleStore();
// const { getActionX, getRowY, getPos } = useTimeLineClipStore();
const testPanelRef = ref<HTMLElement | null>(null);
// `style` will be a helper computed for `left: ?px; top: ?px;`
const { style } = useDraggable(testPanelRef, {
  initialValue: { x: 0, y: 0 }
});
</script>

<style scoped>
.container {
  position: fixed;
  width: 50%;
  height: 50%;
  z-index: 999;
  .title {
    @apply color-#0cff0c font-bold;
  }
}
</style>

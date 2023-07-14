<!--
 * new page
 * @author: owenTong
 * @since: 2023-06-28
 * TimeLine.vue
-->
<template>
  <div ref="timeLineContainerRef" class="wh-full">
    <canvas ref="timelineRef" />
  </div>
</template>

<script setup lang="ts">
import { useResizeObserver } from '@vueuse/core';
const timeLineContainerRef = ref<HTMLElement>();
const timelineRef = ref<HTMLCanvasElement>();
useResizeObserver(timeLineContainerRef, entries => {
  const entry = entries[0];
  const { width, height } = entry.contentRect;
  timelineRef.value!.width = width;
  timelineRef.value!.height = height;
});
</script>

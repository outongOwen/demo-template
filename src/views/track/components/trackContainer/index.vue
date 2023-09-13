<!--
 * @Description: TimeLine
 * @abstract: 时间线编辑器
 * @author: owenTong
 * @since: 2023-06-25
 * TimeLine
-->
<template>
  <div class="flex wh-full">
    <div class="w130px h100% mt42px of-hidden">
      <time-line-bar :scroll-y="scrollTop" />
    </div>
    <n-divider vertical class="h100%! mx0!" />
    <div class="h-full w-[calc(100%-130px)] relative">
      <TimeLine @scroll="handleTimeLineScroll" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TimeLine from '@/plugins/timeLine/components/timeLine/index.vue';
// import type { ScrollReturn } from '@/plugins/timeLine/components/timeLine/index.vue';
import TimeLineBar from '../timeLineBar/index.vue';
defineOptions({
  name: 'TrackContainer'
});
const scrollTop = ref(0);
const handleTimeLineScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  scrollTop.value = target.scrollTop;
};
</script>

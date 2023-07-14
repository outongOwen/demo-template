<!--
 * @Description: TimeLine
 * @abstract: 时间线编辑器
 * @author: owenTong
 * @since: 2023-06-25
 * TimeLine
-->
<template>
  <div class="timeLine-editor">
    <div class="w130px h100% mt42px of-hidden">
      <time-line-bar :scroll-y="y" />
    </div>
    <n-divider vertical class="h100%! mx0!" />
    <div class="h-full w-[calc(100%-130px)] relative">
      <div class="h42px w100% bg-emerald"></div>
      <div class="h-[calc(100%-42px)] w-full">
        <div id="__TRACK_SCROLL_EL_ID__" ref="trackScrollRef" class="of-scroll wh-full">
          <div class="w1920px h1080px">
            <!-- <div class="w100% h-auto">占位符上</div>
            <div class="h72px w100% bg-#000">主轨道</div>
            <div class="w100% h-auto">占位符下</div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useScroll } from '@vueuse/core';
import TimeLineBar from '../timeLineBar/index.vue';
const trackScrollRef = ref<HTMLElement>();
const { y } = useScroll(trackScrollRef);
</script>
<style lang="scss" scoped>
.timeLine-editor {
  display: flex;
  width: 100%;
  height: 100%;
}

#__TRACK_SCROLL_EL_ID__ {
  @include scrollbar(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.3), 8px);
}

.dark #__TRACK_SCROLL_EL_ID__ {
  @include scrollbar(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.3), 8px);
}
</style>

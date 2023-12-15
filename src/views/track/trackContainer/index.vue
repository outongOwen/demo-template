<!--
 * @Description: TimeLine
 * @abstract: 时间轴编辑器
 * @author: owenTong
 * @since: 2023-06-25
 * TimeLine
-->
<template>
  <TimeLine
    ref="timeLineRef"
    class="wh-full time-line"
    :editor-data="editorData"
    :effects="effects"
    :side-bars="sideBars"
    show-side-bar
    :main-row="true"
    main-row-id="main"
    :row-sort-types="['text', 'video', 'main', 'audio']"
    :side-bar-width="sideBarWidth"
    :scale-height="40"
    :fps="25"
    :scale-small-cell-width="getScaleInfo.scaleSmallCellWidth"
    :scale-large-cell-width="getScaleInfo.scaleLargeCellWidth"
    :scale-small-cell-ms="getScaleInfo.scaleSmallCellMs"
    :get-scale-render="getScaleRender"
  >
    <template #sidebar="{ itemRow, sideBarRef }">
      <TimeLineSideBar :time-line-row="itemRow" :side-bar-ref="sideBarRef" />
    </template>
    <!-- <template #blankPlaceholder>
      <blank-placeholder />
    </template> -->
  </TimeLine>
</template>

<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
// import type { TimelineRow } from '@/plugins/timeLine';
import type { MaybeElementRef } from '@vueuse/core';
import { useTimeLineStore } from '@/store';
import { formatTime } from '@/utils/scaleTimeFormat';
import { TimeLine } from '@/plugins/timeLine';
import useTrackScale from './timeLineScale/useTrackScale';
import { mockData, effects, sideBars } from './mock';
import TimeLineSideBar from './timeLineSideBar/index.vue';
// import BlankPlaceholder from './blankPlaceholder/index.vue';
defineOptions({
  name: 'TrackTimeLine'
});
const themeVars = useThemeVars();
const editorData = ref(mockData);
const timeLineRef = ref<null>();
const timeLineStore = useTimeLineStore();
const sideBarWidth = ref(150);
const { getScaleInfo } = timeLineStore;
const getScaleRender = (time: number, unit: 'f' | 's') => {
  return formatTime(time, 25, unit);
};
onMounted(() => {
  // TODO ts
  const timeLineDom = document.getElementsByClassName('time-line')[0] as MaybeElementRef;
  useTrackScale(timeLineDom, sideBarWidth.value, 25);
});
</script>
<style lang="scss" scoped>
.dark .time-line {
  :deep(.timeLine-inner-wrap) {
    .timeLine-sideBar-container {
      border-color: v-bind('themeVars.dividerColor');
    }
  }
}
.time-line {
  :deep(.timeLine-inner-wrap) {
    .timeLine-sideBar-container {
      border-color: v-bind('themeVars.dividerColor');
    }
  }
}
</style>

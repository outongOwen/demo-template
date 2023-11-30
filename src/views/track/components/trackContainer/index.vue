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
import { useTimeLineStore } from '@/store';
import { TimeLine } from '@/plugins/timeLine';
import type { TimeLineContext } from '@/plugins/timeLine';
import { mockData, effects, sideBars } from './mock';
import TimeLineSideBar from './timeLineSideBar/index.vue';
// import BlankPlaceholder from './blankPlaceholder/index.vue';
defineOptions({
  name: 'TrackTimeLine'
});
const themeVars = useThemeVars();
const editorData = ref(mockData);
const timeLineRef = ref<TimeLineContext | null>();
const timeLineStore = useTimeLineStore();
onMounted(() => {
  timeLineStore.setTimeLineRefs(timeLineRef.value!);
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

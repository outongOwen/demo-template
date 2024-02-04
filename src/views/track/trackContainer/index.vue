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
    :key="updateKey"
    :editor-data="editorData"
    :action-effects="effects"
    :side-bars="sideBars"
    show-side-bar
    :auto-adsorption="autoAdsorptionState"
    :guide-line="autoAdsorptionState"
    :main-row="true"
    :preview-cursor="previewCurrentState"
    main-row-id="main"
    :row-sort-types="['text', 'video', 'main', 'audio']"
    :side-bar-width="sideBarWidth"
    :scale-height="40"
    :fps="fps"
    :auto-scroll="autoScrollOptions"
    :get-scale-render="getScaleRender"
    @action-resizing="handleActionMove"
    @time-line-duration-change="handleMaxEndTimeChange"
    @time-line-scale-marks-range-change="handlerChangeTimeLineScaleMarksRange"
    @scroll="handleScroll"
  >
    <!-- <template #sidebar="{ itemRow, sideBarRef }">
      <TimeLineSideBar :time-line-row="itemRow" :side-bar-ref="sideBarRef" />
    </template> -->
    <!-- <template #blankPlaceholder>
      <blank-placeholder />
    </template> -->
  </TimeLine>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useThemeVars } from 'naive-ui';
import { playerSettings } from '@/settings';
import { useTimeLineStore } from '@/store';
import { formatTime } from '@/utils/scaleTimeFormat';
import { TimeLine } from '@/plugins/timeLine';
import type { TimelineExpose } from '@/plugins/timeLine';
import { mockData, effects, sideBars } from './mock';
// import TimeLineSideBar from './timeLineSideBar/index.vue';
// import BlankPlaceholder from './blankPlaceholder/index.vue';
defineOptions({
  name: 'TrackTimeLine'
});
const themeVars = useThemeVars();
const editorData = ref(mockData);
const timeLineRef = ref<TimelineExpose>();
const timeLineStore = useTimeLineStore();
const sideBarWidth = ref(150);
const updateKey = ref(0);
const fps = ref(playerSettings.fps);
const { previewCurrentState, autoAdsorptionState } = storeToRefs(timeLineStore);
const getScaleRender = (time: number, unit: 'f' | 's') => {
  return formatTime(time, fps.value, unit);
};

const autoScrollOptions = reactive({
  enabled: true,
  margin: 25,
  speed: 1000
});
const handleMaxEndTimeChange = ({ time }) => {
  timeLineStore.setTimeLineMaxEndTime(time);
};
const handlerChangeTimeLineScaleMarksRange = (marks, { maxFrameWidth, minFrameWidth }) => {
  console.log(marks, 'marks');
  console.log(maxFrameWidth, 'maxFrameWidth');
  console.log(minFrameWidth, 'minFrameWidth');
};
const handleActionMove = _params => {
  // console.log(params, 'params');
};
const handleScroll = params => {
  console.log(params, 'params');
};
onMounted(() => {
  timeLineRef.value && timeLineStore.setTimeLineRef(timeLineRef.value);
  setTimeout(() => {
    // sideBarWidth.value = 0;
    // autoScrollOptions.enabled = false;
    // fps.value = 25;
    // editorData.value = mockData;
  }, 3000);
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

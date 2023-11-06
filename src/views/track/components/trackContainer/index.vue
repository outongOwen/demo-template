<!--
 * @Description: TimeLine
 * @abstract: 时间线编辑器
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
    :sort-rule="sortRuleEditorData"
  />
</template>

<script setup lang="ts">
import { useThemeVars } from 'naive-ui';
import type { TimelineRow } from '@/plugins/timeLine';
import { TimeLine } from '@/plugins/timeLine';
import { mockData, effects, sideBars } from './mock';
defineOptions({
  name: 'TrackTimeLine'
});
const themeVars = useThemeVars();
const editorData = ref(mockData.reverse());
const sortRuleEditorData = (timeLineData: TimelineRow[]) => {
  // 将type为audio的数据排在最后面
  timeLineData.sort((a, b) => {
    if (a.type === 'audio') {
      return 1;
    }
    if (b.type === 'audio') {
      return -1;
    }
    return 0;
  });
};
</script>
<style lang="scss" scoped>
.dark .time-line {
  :deep(.timeLine-inner-wrap) {
    .timeLine-divider {
      background-color: v-bind('themeVars.dividerColor');
    }
  }
}
.time-line {
  :deep(.timeLine-inner-wrap) {
    .timeLine-divider {
      background-color: v-bind('themeVars.dividerColor');
    }
  }
}
</style>

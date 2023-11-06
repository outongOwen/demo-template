<!--
 * @Description: TimeLine
 * @abstract: 时间线编辑器
 * @author: owenTong
 * @since: 2023-06-25
 * TimeLine
-->
<template>
  <div class="timeLine-container">
    <div class="timeLine-inner-wrap">
      <template v-if="showSideBar">
        <TimeLineSideBar :scroll-top="scrollTop" />
        <div class="timeLine-divider" />
      </template>
      <div class="timeLine-main-wrap" :style="{ width: showSideBar ? `calc(100% - ${sideBarWidth}px)` : '100%' }">
        <TimeLineTimeArea />
        <TimeLineCursor />
        <TimeLineEditorArea @scroll="handleTimeLineScroll" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { consola } from 'consola';
import { useTimeLineContext } from '../../contexts';
import TimeLineTimeArea from '../timeLineTimeArea/index.vue';
import TimeLineEditorArea from '../timeLineEditorArea/index.vue';
import TimeLineCursor from '../timeLineCursor/index.vue';
import TimeLineSideBar from '../timeLineSideBar/index.vue';
import type { TimelineEditorProps, TimelineRow } from '../../types';
defineOptions({
  name: 'TimeLine'
});
const props = withDefaults(defineProps<TimelineEditorProps>(), {
  editorData: (): TimelineRow[] => [],
  rowHeight: 50,
  sideBarWidth: 150,
  timeAreaHeight: 50
});
/**
 * #TODO 需要对props进行校验和初始化操作
 */
const { provideTimeLineContext } = useTimeLineContext();
provideTimeLineContext(props);
const { showSideBar, sideBarWidth, editorData, mainRow, mainRowId } = toRefs(props);
const scrollTop = ref(0);
const handleTimeLineScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  scrollTop.value = target.scrollTop;
};
watchEffect(() => {
  /**
   * @description 数据校验
   */
  // 判断开启主时间线后没有传入主时间线ID
  if (mainRow.value && !mainRowId?.value) {
    consola.error('mainRowId is required when mainRow is true');
  }
  // 判断主时间线指定的mainRowId是否唯一
  if (mainRow.value && mainRowId?.value) {
    const mainRowIds = editorData.value.filter(item => item.type === mainRowId.value);
    if (mainRowIds.length > 1) {
      consola.error('mainRowId must be unique');
    }
  }
});
onMounted(() => {
  // 主时间线排序
  if (mainRow.value && mainRowId?.value) {
    const mainRowIds = editorData.value.filter(item => item.type === mainRowId.value);
    if (mainRowIds.length) {
      const mainRowIndex = editorData.value.findIndex(item => item.type === mainRowId.value);
      editorData.value.push(editorData.value[mainRowIndex]);
      editorData.value.splice(mainRowIndex, 1);
    }
  }
  // 排序规则
  props?.sortRule && props.sortRule(editorData.value);
});
</script>
<style lang="scss" scoped>
.timeLine-container {
  width: 100%;
  height: 100%;
  .timeLine-inner-wrap {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    .timeLine-divider {
      height: 100%;
      width: 1px;
      background-color: #000;
    }
    .timeLine-track-wrap {
      height: 100%;
      position: relative;
    }
  }
}
</style>
